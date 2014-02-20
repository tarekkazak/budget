<?php
    $data = json_decode(file_get_contents("php://input"));
    file_put_contents('../data/content.json', json_encode($data));

?>
