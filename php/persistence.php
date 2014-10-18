<?php
    $data = json_decode(file_get_contents("php://input"));
    rename ('../data/content.json' , '../data/content_'.date('Y_m_d_H_i_s').'.json' );
    file_put_contents('../data/content.json', json_encode($data));

?>
