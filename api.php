<?php
require __DIR__ . '/vendor/autoload.php';

use Lance\Sofascore\{Tournament, Team, Events, Setting};

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$route = $_GET['route'] ?? 'tournament';

try {
    switch ($route) {
        case 'team':
            $id = $_GET['id'] ?? null;
            if (!$id) throw new Exception('Parâmetro "id" obrigatório');
            $t = new Team();
            $data = $t->get($id);
            break;

        case 'event':
            $id = $_GET['id'] ?? null;
            if (!$id) throw new Exception('Parâmetro "id" obrigatório');
            $e = new Events();
            $data = $e->get($id);
            break;

        case 'tournament':
        default:
            $t = new Tournament();
            $data = $t->list();
            break;
    }

    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Throwable $ex) {
    http_response_code(500);
    echo json_encode(['erro' => $ex->getMessage()]);
}
