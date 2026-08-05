<?php
require __DIR__ . '/config.php';

const ARTICLE_MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB
const ARTICLE_ALLOWED_MIME = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
];
const ARTICLE_UPLOAD_DIR = __DIR__ . '/uploads/articles';
const ARTICLE_UPLOAD_URL_BASE = '/api/uploads/articles';

function make_slug(string $title, PDO $pdo, ?int $excludeId = null): string {
    $base = strtolower(trim(preg_replace('/[^a-zA-Z0-9]+/', '-', $title), '-'));
    $base = $base !== '' ? $base : 'artikel';
    $slug = $base;
    $i = 1;
    while (true) {
        $sql = 'SELECT id FROM articles WHERE slug = ?' . ($excludeId ? ' AND id != ?' : '');
        $stmt = $pdo->prepare($sql);
        $excludeId ? $stmt->execute([$slug, $excludeId]) : $stmt->execute([$slug]);
        if (!$stmt->fetch()) break;
        $i++;
        $slug = "{$base}-{$i}";
    }
    return $slug;
}

function save_article_cover(array $file): string {
    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(422);
        echo json_encode(['error' => 'Upload gambar sampul gagal']);
        exit;
    }
    if ($file['size'] > ARTICLE_MAX_UPLOAD_BYTES) {
        http_response_code(422);
        echo json_encode(['error' => 'Ukuran gambar maksimal 5MB']);
        exit;
    }
    $mime = mime_content_type($file['tmp_name']);
    if (!isset(ARTICLE_ALLOWED_MIME[$mime])) {
        http_response_code(422);
        echo json_encode(['error' => 'Format gambar harus JPG, PNG, WEBP, atau GIF']);
        exit;
    }
    $ext = ARTICLE_ALLOWED_MIME[$mime];
    $filename = bin2hex(random_bytes(16)) . '.' . $ext;
    if (!is_dir(ARTICLE_UPLOAD_DIR)) {
        mkdir(ARTICLE_UPLOAD_DIR, 0755, true);
    }
    if (!move_uploaded_file($file['tmp_name'], ARTICLE_UPLOAD_DIR . '/' . $filename)) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal menyimpan gambar']);
        exit;
    }
    return ARTICLE_UPLOAD_URL_BASE . '/' . $filename;
}

function delete_article_cover(?string $imagePath): void {
    if (!$imagePath) return;
    $full = ARTICLE_UPLOAD_DIR . '/' . basename($imagePath);
    if (is_file($full)) unlink($full);
}

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;
$slug = $_GET['slug'] ?? null;
$isAuthed = !empty($_SESSION['user_id']);

if ($method === 'GET') {
    if ($id || $slug) {
        if ($id) {
            $stmt = $pdo->prepare('SELECT a.*, u.name AS author_name FROM articles a JOIN users u ON u.id = a.author_id WHERE a.id = ?');
            $stmt->execute([$id]);
        } else {
            $stmt = $pdo->prepare('SELECT a.*, u.name AS author_name FROM articles a JOIN users u ON u.id = a.author_id WHERE a.slug = ?');
            $stmt->execute([$slug]);
        }
        $article = $stmt->fetch();
        if (!$article || ($article['status'] !== 'published' && !$isAuthed)) {
            http_response_code(404);
            echo json_encode(['error' => 'Artikel tidak ditemukan']);
            exit;
        }
        echo json_encode($article);
        exit;
    }

    if ($isAuthed) {
        $rows = $pdo->query('SELECT a.*, u.name AS author_name FROM articles a JOIN users u ON u.id = a.author_id ORDER BY a.updated_at DESC')->fetchAll();
    } else {
        $rows = $pdo->query("SELECT a.*, u.name AS author_name FROM articles a JOIN users u ON u.id = a.author_id WHERE a.status = 'published' ORDER BY a.created_at DESC")->fetchAll();
    }
    echo json_encode($rows);
    exit;
}

// Create and update both arrive as multipart/form-data (so a cover image can
// ride along), distinguished by whether `id` is present — mirrors
// api/portfolio.php, since PHP's built-in server doesn't parse multipart
// bodies on PUT requests.
if ($method === 'POST') {
    $user = require_auth();

    $postedId = isset($_POST['id']) ? (int)$_POST['id'] : null;
    $title = trim($_POST['title'] ?? '');
    $content = trim($_POST['content'] ?? '');
    $excerpt = trim($_POST['excerpt'] ?? '');
    $status = in_array($_POST['status'] ?? '', ['draft', 'published'], true) ? $_POST['status'] : 'draft';
    $removeCover = ($_POST['remove_cover'] ?? '') === '1';

    if ($title === '' || $content === '') {
        http_response_code(422);
        echo json_encode(['error' => 'Judul dan konten wajib diisi']);
        exit;
    }

    if ($postedId) {
        $stmt = $pdo->prepare('SELECT * FROM articles WHERE id = ?');
        $stmt->execute([$postedId]);
        $existing = $stmt->fetch();
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['error' => 'Artikel tidak ditemukan']);
            exit;
        }

        $coverImage = $existing['cover_image'];
        if (!empty($_FILES['cover']['name'])) {
            $coverImage = save_article_cover($_FILES['cover']);
            delete_article_cover($existing['cover_image']);
        } elseif ($removeCover && $coverImage) {
            delete_article_cover($coverImage);
            $coverImage = null;
        }

        $slug = $existing['title'] === $title
            ? $existing['slug']
            : make_slug($title, $pdo, $postedId);

        $stmt = $pdo->prepare('UPDATE articles SET title = ?, slug = ?, excerpt = ?, content = ?, status = ?, cover_image = ? WHERE id = ?');
        $stmt->execute([$title, $slug, $excerpt, $content, $status, $coverImage, $postedId]);

        echo json_encode(['ok' => true, 'slug' => $slug]);
        exit;
    }

    $coverImage = !empty($_FILES['cover']['name']) ? save_article_cover($_FILES['cover']) : null;
    $slug = make_slug($title, $pdo);
    $stmt = $pdo->prepare('INSERT INTO articles (title, slug, excerpt, content, status, cover_image, author_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$title, $slug, $excerpt, $content, $status, $coverImage, $user['id']]);

    http_response_code(201);
    echo json_encode(['id' => (int)$pdo->lastInsertId(), 'slug' => $slug]);
    exit;
}

if ($method === 'DELETE') {
    require_auth();
    if (!$id) {
        http_response_code(422);
        echo json_encode(['error' => 'ID artikel wajib diisi']);
        exit;
    }
    $stmt = $pdo->prepare('SELECT cover_image FROM articles WHERE id = ?');
    $stmt->execute([$id]);
    $existing = $stmt->fetch();
    if ($existing) {
        delete_article_cover($existing['cover_image']);
        $pdo->prepare('DELETE FROM articles WHERE id = ?')->execute([$id]);
    }
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
