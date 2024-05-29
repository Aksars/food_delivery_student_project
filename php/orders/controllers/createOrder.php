<?php 

    //var_dump($_POST);
    

    $orders = json_decode(file_get_contents("../data/orders.json"));
    $lastOrderID = 1;


    foreach ($orders as $order) {
        if ($order->id > $lastOrderID ){
            $lastOrderID = $order->id;
        }
        else{
        }
    }
    
    $order = new stdClass();

    $order->id = ($lastOrderID +1);   
    $order->name = $_POST["name"];
    $order->email= $_POST["email"];
    $order->phone= $_POST["phone"];
    $order->address= $_POST["address"];
    $order->city= $_POST["city"];
    $order->food= $_POST["food"];

    array_push($orders,  $order);
    
    file_put_contents("../data/orders.json", json_encode($orders));


    $ordersNew = file_get_contents("../data/orders.json"); 
    echo $ordersNew; 

    
    //$orders = file_get_contents("../data/orders.json"); 

    //$myJSONvar = json_encode($myJson);
    
    //echo $myJSONvar;
    //echo "<br>";
   
    
    // Generate json file
    //file_put_contents("../data/orders.json", $myJSONvar);

   
?>