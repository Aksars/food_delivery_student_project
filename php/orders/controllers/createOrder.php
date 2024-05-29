<?php

//var_dump($_POST);

$orders = json_decode(file_get_contents("../data/orders.json"));
$lastOrderID = 1;

foreach ($orders as $order) {
    // ищем последнее ИД, для создания нового ИД
    if ($order->id > $lastOrderID) {
        $lastOrderID = $order->id;
    }   
}

 // создаем новый заказ
 $order = new stdClass();

 $order->id = ($lastOrderID + 1);
 $order->name = $_POST["name"];
 $order->email = $_POST["email"];
 $order->phone = $_POST["phone"];
 $order->address = $_POST["address"];
 $order->city = $_POST["city"];
 $order->manager = $_POST["username"];
 $order->food = $_POST["food"];

//  var_dump($orders);
//  echo "<br><br><br><br><br><br>";
//  var_dump($order);
// Проверяем нет ли заказа со всеми идентичными полями кроме менеджера и ИД
$conflict = array_filter($orders, function($currentOrder, $key) use ($order) {
    $temp1 = clone($order);
    $temp2 = clone($currentOrder);
    unset($temp1->id);
    unset($temp1->manager);    
    unset($temp2->id);
    unset($temp2->manager); 
    return $temp1 == $temp2;
}, ARRAY_FILTER_USE_BOTH);
//var_dump($conflict);

// foreach ($orders as $currentOrder) {
    
//     if( areSameExcept($order, $currentOrder, ["id", "manager"]) )
//         $conflict = $order->id -1;


// }


// Если это новый заказ ( а не повторное создание старого )
if (count($conflict) === 0) {   
   
    // пушим его в массив с заказами
    array_push($orders, $order);

    // записываем заказы в БД
    file_put_contents("../data/orders.json", json_encode($orders));

    // Генерируем ответ -- все заказы
    $ordersNew = new stdClass();
    $ordersNew->message = "Created"; 
    $ordersNew->orders = $orders;
    echo json_encode($ordersNew);

}
else{
    $conflictOrder = array_values($conflict);
    $conflictID = $conflictOrder[0]->id;
    $conflictManager = $conflictOrder[0]->manager;
    // Генерируем ответ -- все заказы
    $response = new stdClass();
    $response->message = "Already exist";     
    $response->conflictOrderID = $conflictID; 
    $response->conflictOrderManager = $conflictManager; 
    echo json_encode($response);
}

//$orders = file_get_contents("../data/orders.json"); 

//$myJSONvar = json_encode($myJson);

//echo $myJSONvar;
//echo "<br>";


// Generate json file
//file_put_contents("../data/orders.json", $myJSONvar);

// // функция сравнения двух объектов за вычетом некоторых параметров 
// function areSameExcept($obj1, $obj2, $sameParameters) {
//     $ref1 = new ReflectionClass($obj1);
//     $ref2 = new ReflectionClass($obj2);

//     $propertiesObj1 = $ref1->getProperties();
//     var_dump($sameParameters);
//     var_dump($propertiesObj1);
//     echo "<br><br><br><br><br><br>";

//     foreach ($propertiesObj1 as $propertyObj1) {
//         if (  array_search($propertyObj1->getName(), $sameParameters)  != false ) continue;
//         $propertyObj1->setAccessible(true);
//         $valueObj1 = $propertyObj1->getValue($obj1);

//         $propertyObj2 = $ref2->getProperty($propertyObj1->getName());
//         $propertyObj2->setAccessible(true);
//         $valueObj2 = $propertyObj2->getValue($obj2);
//         if ($valueObj1 !== $valueObj2) {
//             return false;
//         }
//     }
//     return true;
// }


?>