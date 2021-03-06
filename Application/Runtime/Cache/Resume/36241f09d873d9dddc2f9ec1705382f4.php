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
            server: GVar.INTO + '/Resume/Index/fileUpload/' + new Date(),

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker',

            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false,

            //是否要分片处理大文件上传。
            chunked:true,

            // 如果要分片，分多大一片？ 默认大小为5M.
            chunkSize: 500 * 1024,

            // 如果某个分片由于网络问题出错，允许自动重传多少次？
            chunkRetry: 3,

            // 上传并发数。允许同时最大上传进程数[默认值：3]
            threads: 1,

            // 去重
            duplicate: true,

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker',

            // 上传本分片时预处理下一分片
            prepareNextFile: true,

            //formData: function(){return {uniqueFileName: '333'};}
//            formData: {uniqueFileName: uniqueFileName}
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

        /** 实现webupload hook，触发上传前，中，后的调用关键 **/
        /*WebUploader.Uploader.register({
            "before-send-file": "beforeSendFile",  // 整个文件上传前
            "before-send": "beforeSend",           // 每个分片上传前
            "after-send-file": "afterSendFile"     // 分片上传完毕
        }, {
            beforeSendFile: function (file) {
                var task = new $.Deferred();
                var start = new Date().getTime();

                //拿到上传文件的唯一名称，用于断点续传
                uniqueFileName = md5(file.name + file.size);

                $.ajax({
                    type: "POST",
                    url: GVar.INTO + 'Resume/Index/fileUpload/' + new Date(),   // 后台url地址
                    data: {
                        type: "init",
                        uniqueFileName: uniqueFileName,
                    },
                    cache: false,
                    async: false,  // 同步
                    timeout: 1000, //todo 超时的话，只能认为该文件不曾上传过
                    dataType: "json"
                }).then(function (data, textStatus, jqXHR) {
                    if (data.complete) { //若存在，这返回失败给WebUploader，表明该文件不需要上传
                        task.reject();
                        // 业务逻辑...

                    } else {
                        task.resolve();
                    }
                }, function (jqXHR, textStatus, errorThrown) { //任何形式的验证失败，都触发重新上传
                    task.resolve();
                });

                return $.when(task);
            }
            , beforeSend: function (block) {
                //分片验证是否已传过，用于断点续传
                var task = new $.Deferred();
                $.ajax({
                    type: "POST",
                    url: GVar.INTO + 'Resume/Index/fileUpload/' + new Date(),
                    data: {
                        type: "block",
                        chunk: block.chunk,
                        size: block.end - block.start
                    },
                    cache: false,
                    async: false,  // 同步
                    timeout: 1000, //todo 超时的话，只能认为该分片未上传过
                    dataType: "json"
                }).then(function (data, textStatus, jqXHR) {
                    if (data.is_exists) { //若存在，返回失败给WebUploader，表明该分块不需要上传
                        task.reject();
                    } else {
                        task.resolve();
                    }
                }, function (jqXHR, textStatus, errorThrown) { //任何形式的验证失败，都触发重新上传
                    task.resolve();
                });
                return $.when(task);
            }
            , afterSendFile: function (file) {
                var chunksTotal = Math.ceil(file.size / chunkSize);
                if (chunksTotal > 1) {
                    //合并请求
                    var task = new $.Deferred();
                    $.ajax({
                        type: "POST",
                        url: GVar.INTO + 'Resume/Index/fileUpload/' + new Date(),
                        data: {
                            type: "merge",
                            name: file.name,
                            chunks: chunksTotal,
                            size: file.size
                        },
                        cache: false,
                        async: false,  // 同步
                        dataType: "json"
                    }).then(function (data, textStatus, jqXHR) {
                        // 业务逻辑...

                    }, function (jqXHR, textStatus, errorThrown) {
                        current_uploader.uploader.trigger('uploadError');
                        task.reject();
                    });
                    return $.when(task);
                }
            }

        });*/
    });
</script>
</html>