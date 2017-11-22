/**
 * js   系统管理>用户列表
 * user   dingyingcheng
 * date   2017-05-10
 */

$(function(){

    //f1--用户--增加--页面的角色名称html填充
    user_add_role_name_html();

    //f2--用户--增加--页面的初始化赋值
    user_add_photo();

    //f3--用户--增加--保存操作
    $('#user_add_save').unbind().bind('click',function(){
        var url = $('#fileList .success').attr('url');//用户头像
        var username = $('#username').val();
        if($.trim(username) == ''){
            block('用户名不得为空',2000);
            return false;
        }
        if($.trim(username).length >15){
            block('用户名长度过长',2000);
            return false;
        }
        //验证规则：字母、数字、下划线组成，字母开头，3-15位。
        var name_reg = /^[a-zA-z]\w{2,14}$/;
        if(!name_reg.test(username)){
            block('用户名格式不正确',2000);
            return false;
        }


        var role_id = $('#role_name').val();//角色id就是分组id
        var role_name = $('#role_name').find('option:selected').html();//角色id就是分组id
        if(role_id == '-1'){
            block('请选择所属角色',2000);
            return false;
        }

        var unit = $('#unit').val();//单位
             unit = $.trim(unit);
        if(unit == ''){
            block('单位不得为空',2000);
            return false;
        }
        if(unit.length >20){
            block('单位长度过长',2000);
            return false;
        }

        var true_name = $('#true_name').val();//真实姓名
            true_name = $.trim(true_name);
        if(true_name == ''){
            block('真实姓名不得为空',2000);
            return false;
        }
        if(true_name.length >5){
            block('真实姓名长度过长',2000);
            return false;
        }
        var email = $('#email').val();
            email = $.trim(email);
        var email_reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if(email == ''){
            block('邮箱不得为空',2000);
            return false;
        }
        if(!email_reg.test(email)){
            block('邮箱格式不正确',2000);
            return false;
        }
        if(email.length >300){
            block('邮箱长度过长',2000);
            return false;
        }

        var phone = $('#phone').val();
        var phone_reg = /^1\d{10}$/;
        if(phone == ''){
            block('手机号不得为空',2000);
            return false;
        }
        if(!phone_reg.test(phone)){
            block('手机号格式不正确',2000);
            return false;
        }

        var pass1 = $('#password1').val();
            pass1 = $.trim(pass1);
        var pass2 = $('#password2').val();
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
        }


        var add_data = {
            'photo':url,
            'username':username,
            'unit':unit,
            'true_name':true_name,
            'role_id':role_id,
            'role_name':role_name,
            'email':$('#email').val(),
            'phone':$('#phone').val(),
            'password':$('#password1').val()
        };
        user_add_save(add_data)
    })
    //密码显示隐藏
    // 这里使用最原始的js语法实现，可对应换成jquery语法进行逻辑控制
    var demoInput = document.getElementById("password1");
    $('.demo_img').unbind().bind('click',function(){
        if (demoInput.type == "password") {
            demoInput.type = "text";
            $(this).removeClass('fa-eye');
            $(this).addClass('fa-eye-slash');
        }else {
            demoInput.type = "password";
            $(this).removeClass('fa-eye-slash');
            $(this).addClass('fa-eye');
        }
    })
    //密码显示隐藏
    var demoInputs = document.getElementById("password2");
    $('.demo_imgs').unbind().bind('click',function(){
        if (demoInputs.type == "password") {
            demoInputs.type = "text";
            $(this).removeClass('fa-eye');
            $(this).addClass('fa-eye-slash');
        }else {
            demoInputs.type = "password";
            $(this).removeClass('fa-eye-slash');
            $(this).addClass('fa-eye');
        }
    })
});

//f1--角色页面的角色名称html填充
function user_add_role_name_html(){
    $.ajax({
        url: "http://"+location.host+"/admin/User/get_role_infos?"+new Date(),
        type: "get",
        success:function (data) {
            $('#role_name').html('');
            $('#role_name').html(data);
        },
        error:function(){
            return false;
        }
    });
}
//f2--用户--增加--页面的初始化赋值
function user_add_photo(){
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

function user_add_save(add_data){
    $.ajax({
        url: "http://"+location.host+"/admin/User/user_add_save?"+new Date(),
        type: "POST",
        async: false,
        data: add_data,
        dataType: "json",
        error:function(){
        },
        success: function(data){
            if(data.code == 'error'){
                block(data.msg,2000);
                return false;
            }else{
                //location.href = '/ui/admin_role_index.html';
                block(data.msg,2000);
                $('#user_add').modal('hide');
                $("#jqGridList").jqGrid('setGridParam', {
                    url: "http://"+location.host+"/admin/User/get_user_infos?"+new Date(),
                    page: 1
                }).trigger("reloadGrid");
            }
        }
    })
}
