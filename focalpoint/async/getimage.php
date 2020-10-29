<?php

include(__DIR__.'/../../../../runtime.php');

header('Content-type: application/json');

if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $assetID = $_GET['id'];
    $Assets = new PerchAssets_Assets;
    $Asset = $Assets->find($assetID);
    if ($Asset) {
        echo json_encode(['path' => $Asset->web_path(), 'error' => '']);
    } else {
        echo json_encode(['path' => '' , 'error' => 'Assets seems to be empty']);
    }
} else {
    echo json_encode(['path' => '' , 'error' => 'No asset id sent']);
}
