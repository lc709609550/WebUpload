/**
 * js   系统管理>用户管理
 * action   用户--编辑
 * user   dingyingcheng
 * date   2017-05-10
 */
$(function(){

    //f1--用户--编辑--页面的角色名称html填充
    user_edit_role_name_html();
    //f3--用户--编辑--图片的更换
    user_edit_photo();
    //f4--用户--编辑--保存
    $('#user_edit_save').unbind().bind('click',function(){
        var edit_gid = $('#edit_gid').val();//角色id就是分组id
        var role_name = $('#edit_gid').find('option:selected').html();//角色id就是分组id
        if(edit_gid == '-1'){
            block('请选择所属角色',2000);
            return false;
        }
        var edit_unit = $('#edit_unit').val();//单位
        edit_unit = $.trim(edit_unit);

        if(edit_unit == ''){
            block('单位不得为空',2000);
            return false;
        }
        if(edit_unit.length >20){
            block('单位长度过长',2000);
            return false;
        }

        var edit_true_name = $('#edit_true_name').val();//真实姓名
            edit_true_name = $.trim(edit_true_name);

        if(edit_true_name == ''){
            block('真实姓名不得为空',2000);
            return false;
        }
        if(edit_true_name.length >5){
            block('真实姓名长度过长',2000);
            return false;
        }

        var edit_email = $('#edit_email').val();
            edit_email = $.trim(edit_email);
        var email_reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if(edit_email == ''){
            block('邮箱不得为空',2000);
            return false;
        }
        if(!email_reg.test(edit_email)){
            block('邮箱格式不正确',2000);
            return false;
        }
        if(edit_email.length >300){
            block('邮箱长度过长',2000);
            return false;
        }

        var edit_phone = $('#edit_phone').val();
            edit_phone = $.trim(edit_phone);

        if(edit_phone == ''){
            block('手机号不得为空',2000);
            return false;
        }
        var phone_reg = /^1\d{10}$/;
        if(!phone_reg.test(edit_phone)){
            block('手机号格式不正确',2000);
            return false;
        }

        /*var pass1 = $('#edit_password').val();
        var pass2 = $('#edit_pass').val();
            pass1 = $.trim(pass1);
            pass2 = $.trim(pass2);
        if(pass1 =='' || pass2 ==''){
            block('密码不得为空',2000);
            return false;
        }
        if(pass1 !== pass2){
            block('密码不一致',2000);
            return false;
        }
        if(pass1.length >8 || pass2.length >8){
            block('密码长度过长',2000);
            return false;
        }*/


        var edit_data = {
            'photo':$('#fileList').find('img').attr('src'),//用户头像
            'uid':$('#edit_uid').val(),
            'username':$('#edit_username').val(),
            'gid':$('#edit_gid').val(),
            'role_name':role_name,
            'unit':edit_unit,
            'true_name':edit_true_name,
            'email':edit_email,
            'phone':edit_phone,
            //'password':pass1,
            //'pass':pass2
        };
        user_edit_save(edit_data)
    })
    //密码显示隐藏
    // 这里使用最原始的js语法实现，可对应换成jquery语法进行逻辑控制
    var demoInput = document.getElementById("edit_password");
    $('.demo_img').unbind().bind('click',function(){
        if (demoInput.type == "password") {
            demoInput.type = "text";
            $(this).attr('src','assets/img/320.png');
        }else {
            demoInput.type = "password";
            $(this).attr('src','assets/img/321.png');
        }
    })
    //密码显示隐藏
    var demoInputs = document.getElementById("edit_pass");
    $('.demo_imgs').unbind().bind('click',function(){
        if (demoInputs.type == "password") {
            demoInputs.type = "text";
            $(this).attr('src','assets/img/320.png');
        }else {
            demoInputs.type = "password";
            $(this).attr('src','assets/img/321.png');
        }
    })
});

//f1--角色页面的角色名称html填充
function user_edit_role_name_html(){
    $.ajax({
        url: "http://"+location.host+"/admin/User/get_role_infos?"+new Date(),
        data:{user_uid:Editdatas.uid},
        type: "POST",
        success:function (data) {
            $('#edit_gid').html('');
            $('#edit_gid').html(data);
            $.each(Editdatas,function(key,val){
                $("#edit_" + key,parent.document).val(val).attr("title", val);
            });
            //超级管理员角色不能编辑
            if(Editdatas.uid == 1){
                $('#edit_gid').prop('disabled','disabled');
            }
            var img_info= '<div id="WU_FILE_0" class="file-item thumbnail">';
            img_info += "<img style='' src="+Editdatas.photo+">";
            img_info += "</div>";
            img_info += '<div class="success" url="" style="position: absolute;top: 98px;left: 43px;"></div>';
            $('#fileList').html(img_info);//头像的赋值
            $('#edit_password').val(Editdatas.pass);
        },
        error:function(){
            return false;
        }
    });
}

//f3--用户--修改--图片的更换
function user_edit_photo(){
    var $list = $('#fileList'),
    // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,

    // 缩略图大小
        thumbnailWidth = 50 * ratio,
        thumbnailHeight = 50 * ratio,

    // Web Uploader实例
        uploader;

    // 初始化Web Uploader
    uploader = WebUploader.create({
        // 自动上传。
        auto: true,
        // swf文件路径
        swf: './assets/js/webuploader/Uploader.swf',
        // 文件接收服务端。
        server: "http://"+location.host+"/admin/User/up?" + new Date(),
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker',
        // 只允许选择文件，可选。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/jpg,image/jpeg,image/png'
        }
    });

    // 当有文件添加进来的时候
    uploader.on( 'fileQueued', function( file ) {
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img style="width: 100%;height: 100%;">' +
                '</div>'
            ),
            $img = $li.find('img');

        $list.html('');
        $list.append( $li );

        // 创建缩略图
        uploader.makeThumb( file, function( error, src ) {
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }

            $img.attr( 'src', src );
        }, thumbnailWidth, thumbnailHeight );
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<p class="progress"><span></span></p>')
                .appendTo( $li )
                .find('span');
        }

        $percent.css( 'width', percentage * 100 + '%' );
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on( 'uploadSuccess', function( file,response  ) {
        //$( '#'+file.id ).addClass('upload-state-done');
        var $li = $( '#'+file.id),
            $success_info = $li.find('div.success');
        // 避免重复创建
        if ( !$success_info.length ) {
            $success_info = $('<div class="success" url="" style="position: absolute;top: 98px;left: 43px;"></div>').appendTo( $li );
        }
        $success_info.attr('url',response.url);
        //uploader.removeFile(file);
        $success_info.text('上传成功');
    });

    // 文件上传失败，现实上传出错。
    uploader.on( 'uploadError', function( file ) {
        var $li = $( '#'+file.id ),
            $error = $li.find('div.error');
        // 避免重复创建
        if ( !$error.length ) {
            $error = $('<div class="error" style="position: absolute;top: 98px;left: 43px;"></div>').appendTo( $li );
        }

        $error.text('上传失败');
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').remove();
    });
}

//f4--用户--编辑--保存
function user_edit_save(edit_data){
    $.ajax({
        url: "http://"+location.host+"/admin/User/user_edit_save?"+new Date(),
        type: "POST",
        async: false,
        data: edit_data,
        dataType: "json",
        error:function(){
        },
        success: function(data){
            if(data.code == 'error'){
                block(data.msg,2000);
            }else{
                if(data.is_me == true){
                    $('#sidebar .img-circle').attr('src',data.path);//头像
                    $('#true_name').html(data.true_name);//头像
                }
                block(data.msg,2000);
                $('#user_edit').modal('hide');
                $("#jqGridList").jqGrid('setGridParam', {
                    url: "http://"+location.host+"/admin/User/get_user_infos?"+new Date(),
                    page: 1
                }).trigger("reloadGrid");
            }
        }
    })
}

