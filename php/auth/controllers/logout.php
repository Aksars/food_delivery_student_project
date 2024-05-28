<?php

function sendMsg($msg, $user=null){
    $response = new stdClass();
    $response->message = $msg ;
    $response->username = $user;    
    echo json_encode($response);
}

    // Проверяем авторизацию
    if (isset($_COOKIE['session_token'])) {
        //удаляем куки у пользователя
        setcookie('session_token', '', -1, '/');
        // удаляем файл с токеном
        unlink('../tokens/' . $_COOKIE['session_token'] . ".json");
        sendMsg("Пользователь разлогинен успешно");
    } 
    else {
        sendMsg("Пользователь не авторизован");            
    }

?>