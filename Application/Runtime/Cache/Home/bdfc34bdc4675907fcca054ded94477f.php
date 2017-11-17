<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head>
    <title>Edit</title>
    <link href="/thinkphp_3.2.3_full/Public/css/ui.jqgrid.css" rel="stylesheet" type="text/css">
    <link type="text/css" href="/thinkphp_3.2.3_full/Public/css/main.css" rel="stylesheet"/>
    <link type="text/css" href="/thinkphp_3.2.3_full/Public/css/default.css" rel="stylesheet"/>
</head>
<body>
    <div id="content">
        <form method="post" action="">
            <?php if(is_array($list)): $i = 0; $__LIST__ = $list;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?><input type="text" name="corrosion_tablet" value="<?php echo ($vo["corrosion_tablet"]); ?>"/>
                <input type="text" name="corrosion_line" value="<?php echo ($vo["corrosion_line"]); ?>"/>
                <input type="text" name="corrosion_point" value="<?php echo ($vo["corrosion_point"]); ?>"/>
                <input type="text" name="plantmatchkey" value="<?php echo ($vo["plantmatchkey"]); ?>"/>
                <button type="submit">确认修改</button><?php endforeach; endif; else: echo "" ;endif; ?>
        </form>
    </div>
</body>
</html>