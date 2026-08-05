<?php
require __DIR__ . '/config.php';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB per image
const MAX_IMAGES = 8;
const ALLOWED_MIME = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
];
const UPLOAD_DIR = __DIR__ . '/uploads/portfolio';
const UPLOAD_URL_BASE = '/api/uploads/portfolio';

function save_uploaded_image(array $file): string {
    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(422);
        echo json_encode(['error' => 'Upload gambar gagal']);
        exit;
    }
    if ($file['size'] > MAX_UPLOAD_BYTES) {
        http_response_code(422);
        echo json_encode(['error' => 'Ukuran setiap gambar maksimal 5MB']);
        exit;
    }
    $mime = mime_content_type($file['tmp_name']);
    if (!isset(ALLOWED_MIME[$mime])) {
        http_response_code(422);
        echo json_encode(['error' => 'Format gambar harus JPG, PNG, WEBP, atau GIF']);
        exit;
    }
    $ext = ALLOWED_MIME[$mime];
    $filename = bin2hex(random_bytes(16)) . '.' . $ext;
    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }
    if (!move_uploaded_file($file['tmp_name'], UPLOAD_DIR . '/' . $filename)) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal menyimpan gambar']);
        exit;
    }
    return UPLOAD_URL_BASE . '/' . $filename;
}

// Normalizes PHP's awkward $_FILES['images'] structure (parallel arrays)
// into a plain list of single-file arrays, in upload order.
function normalize_files(string $field): array {
    if (empty($_FILES[$field])) return [];
    $f = $_FILES[$field];
    if (!is_array($f['name'])) return [$f];
    $out = [];
    foreach ($f['name'] as $i => $name) {
        if ($name === '') continue;
        $out[] = [
            'name' => $f['name'][$i],
            'type' => $f['type'][$i],
            'tmp_name' => $f['tmp_name'][$i],
            'error' => $f['error'][$i],
            'size' => $f['size'][$i],
        ];
    }
    return $out;
}

function delete_image_file(?string $imagePath): void {
    if (!$imagePath) return;
    $full = __DIR__ . '/uploads/portfolio/' . basename($imagePath);
    if (is_file($full)) unlink($full);
}

function fetch_images(PDO $pdo, int $itemId, string $coverPath): array {
    $stmt = $pdo->prepare('SELECT image_path FROM portfolio_images WHERE portfolio_item_id = ? ORDER BY sort_order ASC, id ASC');
    $stmt->execute([$itemId]);
    $gallery = $stmt->fetchAll(PDO::FETCH_COLUMN);
    return array_values(array_unique(array_merge([$coverPath], $gallery)));
}

function replace_gallery(PDO $pdo, int $itemId, array $imagePaths): void {
    // imagePaths[0] is the cover (already stored on portfolio_items.image_path);
    // the rest become the gallery.
    $stmt = $pdo->prepare('SELECT image_path FROM portfolio_images WHERE portfolio_item_id = ?');
    $stmt->execute([$itemId]);
    foreach ($stmt->fetchAll(PDO::FETCH_COLUMN) as $old) delete_image_file($old);
    $pdo->prepare('DELETE FROM portfolio_images WHERE portfolio_item_id = ?')->execute([$itemId]);

    $stmt = $pdo->prepare('INSERT INTO portfolio_images (portfolio_item_id, image_path, sort_order) VALUES (?, ?, ?)');
    foreach (array_slice($imagePaths, 1) as $i => $path) {
        $stmt->execute([$itemId, $path, $i]);
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($method === 'GET') {
    if ($id) {
        $stmt = $pdo->prepare('SELECT p.*, u.name AS author_name FROM portfolio_items p JOIN users u ON u.id = p.author_id WHERE p.id = ?');
        $stmt->execute([$id]);
        $item = $stmt->fetch();
        if (!$item) {
            http_response_code(404);
            echo json_encode(['error' => 'Item portofolio tidak ditemukan']);
            exit;
        }
        $item['images'] = fetch_images($pdo, $item['id'], $item['image_path']);
        echo json_encode($item);
        exit;
    }
    $rows = $pdo->query('SELECT p.*, u.name AS author_name FROM portfolio_items p JOIN users u ON u.id = p.author_id ORDER BY p.created_at DESC')->fetchAll();
    foreach ($rows as &$row) {
        $row['images'] = fetch_images($pdo, $row['id'], $row['image_path']);
    }
    echo json_encode($rows);
    exit;
}

if ($method === 'POST') {
    $user = require_auth();

    $postedId = isset($_POST['id']) ? (int)$_POST['id'] : null;
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $productUrl = trim($_POST['product_url'] ?? '');
    $files = array_slice(normalize_files('images'), 0, MAX_IMAGES);

    if ($title === '') {
        http_response_code(422);
        echo json_encode(['error' => 'Judul produk wajib diisi']);
        exit;
    }

    if ($postedId) {
        $stmt = $pdo->prepare('SELECT * FROM portfolio_items WHERE id = ?');
        $stmt->execute([$postedId]);
        $existing = $stmt->fetch();
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Item portofolio tidak ditemukan']);
            exit;
        }

        $imagePath = $existing['image_path'];
        if ($files) {
            $uploaded = array_map('save_uploaded_image', $files);
            delete_image_file($existing['image_path']);
            replace_gallery($pdo, $postedId, $uploaded);
            $imagePath = $uploaded[0];
        }

        $pdo->prepare('UPDATE portfolio_items SET title = ?, description = ?, product_url = ?, image_path = ? WHERE id = ?')
            ->execute([$title, $description, $productUrl, $imagePath, $postedId]);

        echo json_encode(['ok' => true, 'id' => $postedId]);
        exit;
    }

    if (!$files) {
        http_response_code(422);
        echo json_encode(['error' => 'Minimal satu screenshot gambar wajib diunggah']);
        exit;
    }
    $uploaded = array_map('save_uploaded_image', $files);

    $stmt = $pdo->prepare('INSERT INTO portfolio_items (title, description, product_url, image_path, author_id) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$title, $description, $productUrl, $uploaded[0], $user['id']]);
    $newId = (int)$pdo->lastInsertId();
    replace_gallery($pdo, $newId, $uploaded);

    http_response_code(201);
    echo json_encode(['id' => $newId]);
    exit;
}

if ($method === 'DELETE') {
    require_auth();
    if (!$id) {
        http_response_code(422);
        echo json_encode(['error' => 'ID item wajib diisi']);
        exit;
    }
    $stmt = $pdo->prepare('SELECT image_path FROM portfolio_items WHERE id = ?');
    $stmt->execute([$id]);
    $existing = $stmt->fetch();
    if ($existing) {
        $stmt2 = $pdo->prepare('SELECT image_path FROM portfolio_images WHERE portfolio_item_id = ?');
        $stmt2->execute([$id]);
        foreach ($stmt2->fetchAll(PDO::FETCH_COLUMN) as $galleryPath) delete_image_file($galleryPath);
        delete_image_file($existing['image_path']);
        $pdo->prepare('DELETE FROM portfolio_items WHERE id = ?')->execute([$id]); // cascades to portfolio_images
    }
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
