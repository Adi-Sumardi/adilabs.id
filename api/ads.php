<?php
require __DIR__ . '/config.php';

const AD_MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB
const AD_ALLOWED_MIME = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
];
const AD_UPLOAD_DIR = __DIR__ . '/uploads/ads';
const AD_UPLOAD_URL_BASE = '/api/uploads/ads';

function save_ad_image(array $file): string {
    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(422);
        echo json_encode(['error' => 'Upload gambar iklan gagal']);
        exit;
    }
    if ($file['size'] > AD_MAX_UPLOAD_BYTES) {
        http_response_code(422);
        echo json_encode(['error' => 'Ukuran gambar maksimal 5MB']);
        exit;
    }
    $mime = mime_content_type($file['tmp_name']);
    if (!isset(AD_ALLOWED_MIME[$mime])) {
        http_response_code(422);
        echo json_encode(['error' => 'Format gambar harus JPG, PNG, WEBP, atau GIF']);
        exit;
    }
    $ext = AD_ALLOWED_MIME[$mime];
    $filename = bin2hex(random_bytes(16)) . '.' . $ext;
    if (!is_dir(AD_UPLOAD_DIR)) {
        mkdir(AD_UPLOAD_DIR, 0755, true);
    }
    if (!move_uploaded_file($file['tmp_name'], AD_UPLOAD_DIR . '/' . $filename)) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal menyimpan gambar']);
        exit;
    }
    return AD_UPLOAD_URL_BASE . '/' . $filename;
}

function delete_ad_image(?string $imagePath): void {
    if (!$imagePath) return;
    $full = AD_UPLOAD_DIR . '/' . basename($imagePath);
    if (is_file($full)) unlink($full);
}

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($method === 'GET') {
    if ($id) {
        $stmt = $pdo->prepare('SELECT * FROM ads WHERE id = ?');
        $stmt->execute([$id]);
        $ad = $stmt->fetch();
        if (!$ad) {
            http_response_code(404);
            echo json_encode(['error' => 'Iklan tidak ditemukan']);
            exit;
        }
        echo json_encode($ad);
        exit;
    }
    $rows = $pdo->query('SELECT * FROM ads ORDER BY sort_order ASC, id ASC')->fetchAll();
    echo json_encode($rows);
    exit;
}

if ($method === 'POST') {
    $user = require_auth();

    $postedId = isset($_POST['id']) ? (int)$_POST['id'] : null;
    $title = trim($_POST['title'] ?? '');
    $targetUrl = trim($_POST['target_url'] ?? '');

    if ($title === '' || $targetUrl === '') {
        http_response_code(422);
        echo json_encode(['error' => 'Judul dan URL tujuan wajib diisi']);
        exit;
    }
    if (!filter_var($targetUrl, FILTER_VALIDATE_URL)) {
        http_response_code(422);
        echo json_encode(['error' => 'URL tujuan tidak valid']);
        exit;
    }

    if ($postedId) {
        $stmt = $pdo->prepare('SELECT * FROM ads WHERE id = ?');
        $stmt->execute([$postedId]);
        $existing = $stmt->fetch();
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Iklan tidak ditemukan']);
            exit;
        }

        $imagePath = $existing['image_path'];
        if (!empty($_FILES['image']['name'])) {
            $imagePath = save_ad_image($_FILES['image']);
            delete_ad_image($existing['image_path']);
        }

        $pdo->prepare('UPDATE ads SET title = ?, target_url = ?, image_path = ? WHERE id = ?')
            ->execute([$title, $targetUrl, $imagePath, $postedId]);

        echo json_encode(['ok' => true, 'id' => $postedId]);
        exit;
    }

    if (empty($_FILES['image']['name'])) {
        http_response_code(422);
        echo json_encode(['error' => 'Gambar iklan wajib diunggah']);
        exit;
    }
    $imagePath = save_ad_image($_FILES['image']);
    $nextOrder = (int)$pdo->query('SELECT COALESCE(MAX(sort_order), -1) + 1 FROM ads')->fetchColumn();

    $stmt = $pdo->prepare('INSERT INTO ads (title, image_path, target_url, sort_order, author_id) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$title, $imagePath, $targetUrl, $nextOrder, $user['id']]);

    http_response_code(201);
    echo json_encode(['id' => (int)$pdo->lastInsertId()]);
    exit;
}

if ($method === 'PUT') {
    require_auth();
    if (!$id) {
        http_response_code(422);
        echo json_encode(['error' => 'ID iklan wajib diisi']);
        exit;
    }
    $body = json_input();
    if (($body['move'] ?? null) === 'up' || ($body['move'] ?? null) === 'down') {
        $rows = $pdo->query('SELECT id, sort_order FROM ads ORDER BY sort_order ASC, id ASC')->fetchAll();
        $idx = array_search($id, array_column($rows, 'id'));
        $swapIdx = $body['move'] === 'up' ? $idx - 1 : $idx + 1;
        if ($idx !== false && isset($rows[$swapIdx])) {
            $a = $rows[$idx];
            $b = $rows[$swapIdx];
            $pdo->prepare('UPDATE ads SET sort_order = ? WHERE id = ?')->execute([$b['sort_order'], $a['id']]);
            $pdo->prepare('UPDATE ads SET sort_order = ? WHERE id = ?')->execute([$a['sort_order'], $b['id']]);
        }
    }
    echo json_encode(['ok' => true]);
    exit;
}

if ($method === 'DELETE') {
    require_auth();
    if (!$id) {
        http_response_code(422);
        echo json_encode(['error' => 'ID iklan wajib diisi']);
        exit;
    }
    $stmt = $pdo->prepare('SELECT image_path FROM ads WHERE id = ?');
    $stmt->execute([$id]);
    $existing = $stmt->fetch();
    if ($existing) {
        delete_ad_image($existing['image_path']);
        $pdo->prepare('DELETE FROM ads WHERE id = ?')->execute([$id]);
    }
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
