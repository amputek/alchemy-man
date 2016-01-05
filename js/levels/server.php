<?php

$decoded = $_POST['json'];
$noslashes = stripslashes($decoded);
$filename = $_POST['filename'];
$jsonFile = fopen($filename . '.json','w+');
fwrite($jsonFile,$noslashes);
fclose($jsonFile);

?>



