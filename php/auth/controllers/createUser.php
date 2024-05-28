<?php


    // Create the user
    $username = $_POST['username'];
    $pw = $_POST['pass'];
    // var_dump($_POST);
    $user = array(
        'username'=> $username,
        'pw' => password_hash($pw, PASSWORD_DEFAULT)
    );

    //var_dump($user);
    // если пользователь существует (есть файл с его именем)
    if(file_exists("../users/$username.json")){
        echo "Такой пользователь уже существует";
    }
    else{
        // Save user to a flat JSON file
        file_put_contents("../users/$username.json", json_encode($user));

        echo "Пользователь успешно зарегистрирован";
        echo "Перенаправляю 2,1 .....";

        header( "refresh:2;url=auth.html" );
        
    }
   
    ?>