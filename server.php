<?php

$decoded = $_POST['json'];
$noslash= stripslashes($decoded);
$filename = $_POST['filename'];
$jsonFile = fopen($filename . '.json','w+');
fwrite($jsonFile,$noslash);
fclose($jsonFile);

?>
