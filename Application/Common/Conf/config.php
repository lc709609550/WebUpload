<?php
return array(
	//'配置项'=>'配置值'
    'DB_TYPE'   => 'mysql', // 数据库类型
    'DB_HOST'   => '127.0.0.1', // 服务器地址
    'DB_NAME'   => 'test', // 数据库名
    'DB_USER'   => 'root', // 用户名
    'DB_PWD'    => 'bhxz', // 密码
    'DB_PORT'   => 3310, // 端口
    'DB_PREFIX' => 'gy_', // 数据库表前缀
    'DB_CHARSET'=> 'utf8', // 字符集
    'DB_DEBUG'  =>  TRUE, // 数据库调试模式 开启后可以记录SQL日志 3.2.3新增

//    'APP_GROUP_LIST'    =>    'Home,WebUpload',
    'DEFAULT_MODULE' => 'Resume',

    'TMPL_PARSE_STRING' => array(
        '__Public' => __ROOT__ . '/Modules/' . MODULE_NAME . '/View/Public/',
        '__ROOT__' => __ROOT__,
        '_COMMON_PATH' => __ROOT__ . ltrim(COMMON_PATH, '.'),
    ),

//    'DATA_CACHE_TYPE' =>'Redis',
//    'REDIS_HOST'=>'127.0.0.1',
//    'REDIS_PORT'=>6379,
);