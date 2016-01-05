<?php
  $directory = '.';

  $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory));

  $array = array();

  while($it->valid()) {
      if (!$it->isDot()) {
          array_push( $array , $it->getSubPathName());
      }
      $it->next();
  }

  echo json_encode($array);

?>