<?php
// Generic CRUD for short editable text lists used on the landing page:
// ?type=rotating_word  -> the words that cycle after "We Build"
// ?type=marquee_item   -> the scrolling "running text" product pills
require __DIR__ . '/config.php';

const ALLOWED_TYPES = ['rotating_word', 'marquee_item'];

$type = $_GET['type'] ?? '';
if (!in_array($type, ALLOWED_TYPES, true)) {
    http_response_code(422);
    echo json_encode(['error' => 'Parameter type tidak valid']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($method === 'GET') {
    $stmt = $pdo->prepare('SELECT * FROM content_lists WHERE list_type = ? ORDER BY sort_order ASC, id ASC');
    $stmt->execute([$type]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($method === 'POST') {
    require_auth();
    $body = json_input();
    $text = trim($body['text'] ?? '');
    if ($text === '') {
        http_response_code(422);
        echo json_encode(['error' => 'Teks wajib diisi']);
        exit;
    }
    $stmt = $pdo->prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 FROM content_lists WHERE list_type = ?');
    $stmt->execute([$type]);
    $nextOrder = (int)$stmt->fetchColumn();

    $stmt = $pdo->prepare('INSERT INTO content_lists (list_type, text, sort_order) VALUES (?, ?, ?)');
    $stmt->execute([$type, $text, $nextOrder]);

    http_response_code(201);
    echo json_encode(['id' => (int)$pdo->lastInsertId(), 'text' => $text, 'sort_order' => $nextOrder]);
    exit;
}

if ($method === 'PUT') {
    require_auth();
    if (!$id) {
        http_response_code(422);
        echo json_encode(['error' => 'ID wajib diisi']);
        exit;
    }
    $body = json_input();

    if (array_key_exists('text', $body)) {
        $text = trim($body['text']);
        if ($text === '') {
            http_response_code(422);
            echo json_encode(['error' => 'Teks wajib diisi']);
            exit;
        }
        $pdo->prepare('UPDATE content_lists SET text = ? WHERE id = ? AND list_type = ?')->execute([$text, $id, $type]);
    }

    // Swap sort_order with the neighboring row to move an item up/down.
    if (($body['move'] ?? null) === 'up' || ($body['move'] ?? null) === 'down') {
        $stmt = $pdo->prepare('SELECT id, sort_order FROM content_lists WHERE list_type = ? ORDER BY sort_order ASC, id ASC');
        $stmt->execute([$type]);
        $rows = $stmt->fetchAll();
        $idx = array_search($id, array_column($rows, 'id'));
        $swapIdx = $body['move'] === 'up' ? $idx - 1 : $idx + 1;

        if ($idx !== false && isset($rows[$swapIdx])) {
            $a = $rows[$idx];
            $b = $rows[$swapIdx];
            $pdo->prepare('UPDATE content_lists SET sort_order = ? WHERE id = ?')->execute([$b['sort_order'], $a['id']]);
            $pdo->prepare('UPDATE content_lists SET sort_order = ? WHERE id = ?')->execute([$a['sort_order'], $b['id']]);
        }
    }

    echo json_encode(['ok' => true]);
    exit;
}

if ($method === 'DELETE') {
    require_auth();
    if (!$id) {
        http_response_code(422);
        echo json_encode(['error' => 'ID wajib diisi']);
        exit;
    }
    $pdo->prepare('DELETE FROM content_lists WHERE id = ? AND list_type = ?')->execute([$id, $type]);
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
