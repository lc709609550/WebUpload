<?php if (!defined('THINK_PATH')) exit();?><!Docmtype>
<html>
<head>
    <meta charset='utf-8'>
    <link rel="stylesheet" type="text/css" href="/thinkphp/Public/js/bootstrap-fileupload/bootstrap.min.css"/>
    <link rel="stylesheet" type="text/css" href="/thinkphp/Public/js/webuploader/webuploader.css"/>

    <!--引入JS-->
    <script type="text/javascript" src="/thinkphp/Public/js/webuploader/jquery.min.js"></script>
    <script type="text/javascript" src="/thinkphp/Public/js/webuploader/webuploader.js"></script>
    <script type="text/javascript" src="/thinkphp/Public/js/bootstrap-fileupload/bootstrap.min.js"></script>
    <style>
        upload-state-done{
            border-color: red;
        }
    </style>
</head>
<body>

<span style="font-size:14px;">
    <!--用来存放item-->
    <div id="uploader" class="wu-example"  style="width: 200px; margin: 0 auto;">
    <!--用来存放文件信息-->
        <div id="thelist" class="uploader-list"></div>
        <div class="btns">
            <div id="picker">选择文件</div>
            <button id="ctlBtn" class="btn btn-default">开始上传</button>
        </div>
    </div>
</span>

</body>

<script type='text/javascript'>

    var GVar = {
        PUBLIC: "/thinkphp/Modules/MODULE_NAME/View/Public/",
        INTO: "/thinkphp/index.php",
        COMMON: "/thinkphp/Application/Common/",
        SERVERTIME: "<?php echo ($__SERVERTIME__); ?>"
    };

    $(function(){
        var $list=$("#thelist");   //这几个初始化全局的百度文档上没说明，好蛋疼。
        var $btn =$("#ctlBtn");   //开始上传

        var uploader = WebUploader.create({
           // swf文件路径
            swf: 'webupload/Uploader.swf',

            // 文件接收服务端。
            server: GVar.INTO + 'Upload/Index/fileUpload/' + new Date(),

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker',

            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false
        });

        // 当有文件被添加进队列的时候
        uploader.on( 'fileQueued', function( file ) {
            $list.append( '<div id="' + file.id + '" class="item">' +
                '<h4 class="info">' + file.name + '</h4>' +
                '<p class="state">等待上传...</p>' +
                '</div>' );
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.on( 'uploadProgress', function( file, percentage ) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress .progress-bar');

            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<div class="progress progress-striped active">' +
                    '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                    '</div>' +
                    '</div>').appendTo($li).find('.progress-bar');
            }

            $li.find('p.state').text('上传中');

            $percent.css('width', percentage * 100 + '%');
        });

        uploader.on( 'uploadSuccess', function( file ) {
            $( '#'+file.id ).find('p.state').text('已上传');
        });

        uploader.on( 'uploadError', function( file ) {
            $( '#'+file.id ).find('p.state').text('上传出错');
        });

        uploader.on( 'uploadComplete', function( file ) {
            $( '#'+file.id ).find('.progress').fadeOut();
        });
        $btn.on( 'click', function() {
            uploader.upload();
        });
    });
</script>
</html>