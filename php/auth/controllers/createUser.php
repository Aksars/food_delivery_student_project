<?php

function sendMsg($msg, $user = null)
{
    $response = new stdClass();
    $response->message = $msg;
    $response->username = $user;

    echo json_encode($response);
}

// Create the user
$username = $_POST['username'];
$pw = $_POST['pass'];
// var_dump($_POST);
$user = array(
    'username' => $username,
    'pw' => password_hash($pw, PASSWORD_DEFAULT)
);

//var_dump($user);
// если пользователь существует (есть файл с его именем)
if (file_exists("../users/$username.json")) {
    sendMsg("Такой пользователь уже существует");   
} else {
    // Save user to a flat JSON file
    file_put_contents("../users/$username.json", json_encode($user));
    sendMsg("Регистрация успешна", $username);  
}


?>