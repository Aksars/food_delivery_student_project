<?php

function sendMsg($msg, $user = null)
{
    $response = new stdClass();
    $response->message = $msg;
    $response->username = $user;

    echo json_encode($response);
}

if (isset($_POST['auth'])) {


    if (isset($_POST['username']) && isset($_POST['pass'])) {
        if (strlen($_POST['username']) > 2 && strlen($_POST['pass']) > 5) {

            $username = $_POST['username'];
            $pass = $_POST['pass'];

            $file = @file_get_contents("../users/$username.json");

            if ($file !== FALSE) {
                $user = json_decode($file);
                $is_valid = password_verify($pass, $user->pw);

                // вова ввел правильный логин пароль вовы
                if (!$is_valid) {
                    // throw an error   
                    sendMsg("Вы ввели неправильный логин или пароль");
                } else {

                    // смотрим текущий токен авторизации
                    $token_id = isset($_COOKIE['session_token']) ? $_COOKIE['session_token'] : null;

                    if ($token_id) {
                       
                        // получаем данные пользователя логин и пароль которого был введен
                        $token_user = file_get_contents("../tokens/$token_id.json");
                        $token_user = json_decode($token_user)->user;
                        
                        // если сейчас авторизация в куках не того же юзера от которого были введены логин пароль
                        if($token_user != $user->username )
                        {
                            // очищаем сесию в файловой системе                              
                            unlink('../tokens/' . $_COOKIE['session_token'] . ".json");

                            // очищаем сесию в куках
                            unset($_COOKIE['session_token']); 
                            setcookie('session_token', '', -1, '/');                             
                        }
                    }

                    // Check for a session cookie
                    $token_id = isset($_COOKIE['session_token']) ? $_COOKIE['session_token'] : null;
                    if (!$token_id) {

                        // Create a token details
                        $expires = time() + (60 * 60 * 24 * 14);
                        $token = '_' . $expires . '_' . bin2hex(openssl_random_pseudo_bytes(60));

                        // Set cookie
                        $cookie = setcookie('session_token', $token, $expires, '/', '', false, true);
                        $token_val = array(
                            'user' => $username,
                            'expires' => $expires,
                        );
                        file_put_contents('../tokens/' . $token . '.json', json_encode($token_val));
                        // throw an error                

                        sendMsg("Авторизация успешна", $username);

                    } else {
                        
                        // Get the token details
                        $token = json_decode(file_get_contents('../tokens/' . $token_id . '.json'));
                        // Get the username
                        $username = $token->user;

                        sendMsg("Пользователь уже авторизован", $username);


                        // Желательно предусмотреть удаление старых сессий которые истекли


                    }


                }
            }else{
                sendMsg("Вы ввели неправильный логин или пароль");
            }
        } else {
            sendMsg("Логин или пароль не соответствуют требованиям");
        }

    } else {
        sendMsg("Не введен логин или пароль");
    }


}
// проверка по аджаксу при загрузке каждой страницы в системе
else {


    // Check for a session cookie
    $token_id = isset($_COOKIE['session_token']) ? $_COOKIE['session_token'] : null;

    if (!$token_id) {
        sendMsg("Сначала авторизуйтесь");
    } else {
        $token = json_decode(file_get_contents('../tokens/' . $token_id . '.json'));
        $username = $token->user;
        sendMsg("Есть доступ", $username);

    }

}

?>