<?php
//functions to be included in all php files to log variables to chrome devtools
function dd($var)
{
    var_dump($var);
    die;
}
