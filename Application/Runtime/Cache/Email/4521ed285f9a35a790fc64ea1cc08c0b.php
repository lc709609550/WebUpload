<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="XXH-BH">

    <!-- Bootstrap core CSS -->
    <link href="public/css/bootstrap.min.css"  rel="stylesheet">

    <script src="public/js/jquery.js" ></script>
    <script type="text/javascript" charset="utf-8" src="public/js/ueditor.config.js"></script>
    <script type="text/javascript" charset="utf-8" src="public/js/editor_api.js"></script>
    <!--建议手动加在语言，避免在ie下有时因为加载语言失败导致编辑器加载失败-->
    <script type="text/javascript" charset="utf-8" src="public/js/zh-cn.js"></script>
</head>

<body>
<div id="login-body">
    <!--登录 -->
    <div id="login-page">
        <div class="container">
            <form class="form-login" method="post" action="<?php echo U(sendEmail);?>">
                <h2 class="form-login-heading">Email<i class="fa fa-times-circle-o"></i></h2>
                <div class="login-wrap">
                    <input id="to" type="text" class="form-control" placeholder="发送地址" autofocus>
                    <br>
                    <input id="name" type="text" class="form-control" placeholder="收件人名称">
                    <br>
                    <input id="subject" type="text" class="form-control" placeholder="主题" autofocus>
                    <br>
                    <!--<input id="" type="password" class="form-control" placeholder="">-->
                    <!--<br>-->
                    <!--<input id="" type="text" class="form-control" placeholder="" autofocus>-->
                    <!--<br>-->
                    <!--<textarea id="" type="password" class="form-control" placeholder=""></textarea>-->
                    <!--<br>-->
                    <textarea type="text/plain" name="content" id="myEditor"  ></textarea>
                    <br>
                    <button id="submitBtn" class="btn btn-theme btn-block" type="button"><i class="fa fa-lock"></i> 登 录</button>
                </div>
            </form>
        </div>

    </div>
    <!--登录 end -->
</div>
<!-- js placed at the end of the document so the pages load faster -->

<!--BACKSTRETCH-->
<!-- You can use an image of whatever size. This script will stretch to fit in any screen size.-->
<script type="text/javascript">

    UE.getEditor('myEditor' ,{'enterTag' : '' ,'allowDivTransToP':false});
//        ,{
//            initialFrameWidth : 600,
//            initialFrameHeight: 600
//        });
//    var editor = new UE.ui.Editor();
//    editor.render("content");
//    editor.addListener('contentchange',function(){
//        this.sync();
//        //1.2.4+以后可以直接给textarea的id名字就行了
//        $('content').valid();
//    });

    $('#submitBtn').click(function(){
//        UE.getEditor('content').sync();

        if (!UE.getEditor('myEditor').hasContents()){
            alert('请先填写内容!');
        }else{
            var content =UE.getEditor('myEditor').getContent();
        }

        var to = $("#to").val();
        var name = $("#name").val();
        var subject = $("#subject").val();

        var emailPost = {'to':to,'name':name,'subject':subject,'content':content};

//        $('form').submit(function (e) {
//            console.log(e)
//        });
        var url = $('form').attr('action');
        $.ajax({
            url:url,
            type:'post',
            data: emailPost,
            success:function (data) {
//                alert(1);
            }
        })
    })
</script>
</body>
</html>