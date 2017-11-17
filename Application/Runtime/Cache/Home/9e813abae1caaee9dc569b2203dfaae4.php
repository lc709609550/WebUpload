<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head>
    <title>Add</title>
    <link href="/thinkphp_3.2.3_full/Public/css/ui.jqgrid.css" rel="stylesheet" type="text/css">
    <link type="text/css" href="/thinkphp_3.2.3_full/Public/css/main.css" rel="stylesheet"/>
    <link type="text/css" href="/thinkphp_3.2.3_full/Public/css/default.css" rel="stylesheet"/>
</head>
<body>
    <div id="content">
        <form method="post" action="">
            <input type="text" name="corrosion_tablet" required="required"/>
            <input type="text" name="corrosion_line"  required="required"/>
            <input type="text" name="corrosion_point"  required="required"/>
            <input type="text" name="plantmatchkey"  required="required"/>
            <button type="submit">添加</button>
        </form>
    </div>
</body>
</html>