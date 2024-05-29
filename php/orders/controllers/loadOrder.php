<?php    


    //var_dump($_POST);
    // получаем ИД заказа который будем читать из ПОСТ
    $orderID = $_POST["order_id"];

    // Читаем БД с заказами
    $ordersNew = json_decode(file_get_contents("../data/orders.json")); 

    // Ищем заказ с совпадающим ИД
    $result = null;
    foreach ($ordersNew as $object) {
        if ($object->id == $orderID) {
            $result = $object;
            break;
        }
    }
    //var_dump($result);
    unset($object);
    $obj = $result ?? false;

    //var_dump($obj);
    // // отправляем на фронт детали найденного заказа
    echo json_encode($obj);

?>