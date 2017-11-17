<?php
return array(
	'REDIS_HOST'            => '127.0.0.1', //主机  
    'REDIS_PORT'            => '6379', //端口  
    'REDIS_CTYPE'           => 1, //连接类型 1:普通连接 2:长连接  
    'REDIS_TIMEOUT'         => 0, //连接超时时间(S) 0:永不超时 
    'DATA_CACHE_TIME'       => '1',      // 数据缓存有效期 0表示永久缓存
);