/**
 * Created by BHZXZbaibing on 2017/5/8.
 */
var BHCLIENT_SETUP_EXE;
var g_ControlInstalled = false;
var g_ServerVersion;
var g_ClientVersion = "-1";
$(function(){
    $.ajax({
        url:"http://"+location.host+"/login/index/checkExe?"+new Date(),
        type:"GET",
        dateType:"josn",
        async:false,
        success:function (result) {
            BHCLIENT_SETUP_EXE = result.BHCLIENT_SETUP_EXE;
            g_ServerVersion = result.g_ServerVersion;
        }
    });
    //登录界面点击事件
    loginNavClick();

    g_ControlInstalled = DetectActiveXFirst();
    
    if (!g_ControlInstalled || g_ServerVersion != g_ClientVersion)//判断是否存在版本号 或者版本号不一致
    {
        $('#new').show();
    }

});

//登录界面点击事件
function loginNavClick(){
    $('#login-nav li').unbind().bind('click',function(){
        $(this).find('a').append('<i></i>');
        $(this).siblings().find('i').remove();
        $('#login-body>div').eq($(this).index()).siblings().hide();
        if($(this).index() != 2){
            $('#login-content').hide();
        }else{
            $('#login-content').show();
        }
        $('#login-body>div').eq($(this).index()).show();

    });
    //点击logo
    $('#login-logo img').unbind().bind('click',function(){
        window.location.reload();
    })
    $('#login-logo h1').unbind().bind('click',function(){
        window.location.reload();
    })
    $('.form-login h2.form-login-heading i').unbind().bind('click',function(){
        window.location.reload();
    })
}

$('#submitBtn').click(function () {
    $('#submitBtn').attr('disabled', 'disabled');

    var postData = {
        'username':$('#username').val(),
        'password':$('#password').val()
    };


    $.ajax({
        url: "http://"+location.host+"/login/Index/checkLogin?"+new Date(),
        type: "POST",
        async: false,
        data: postData,
        dataType: "json",
        error:function(){
        },
        success: function(data){
            $.gritter.add({
                title: '提示',
                text: data.message,
                sticky: false,
                time: 3000,
                speed:500,
                position: 'bottom-right',
                class_name: 'gritter-err'//gritter-center
            });
            if(data.code>400){

                $('#submitBtn').removeAttr('disabled');

            }else{
                location.href = '/ui/bigDataStatistics.html';
            }
        }
    })
});


$(document).keydown(function (ev) {
    if($('#login-page').css("display") == 'block') {
        if (ev.keyCode == 13) {
            /*if (!($('#username').val() && $('#password').val())) {
             artDialog.alert('请填写用户名和密码信息!');
             return false;
             }*/
            $('#submitBtn').attr('disabled', 'disabled');

            var postData = {
                'username': $('#username').val(),
                'password': $('#password').val()
            };

            $.ajax({
                url: "http://" + location.host + "/login/Index/checkLogin?" + new Date(),
                type: "POST",
                async: false,
                data: postData,
                dataType: "json",
                error: function () {
                },
                success: function (data) {
                    $.gritter.add({
                        title: '提示',
                        text: data.message,
                        sticky: false,
                        time: 3000,
                        speed: 500,
                        position: 'bottom-right',
                        class_name: 'gritter-err'//gritter-center
                    });
                    if (data.code > 400) {
                        $('#submitBtn').removeAttr('disabled');
                    } else {
                        location.href = '/ui/bigDataStatistics.html';
                    }
                }
            })
        }
    }
});


// 4.安装插件
function installplugin() {
    window.open(BHCLIENT_SETUP_EXE);
}


function DetectActiveXFirst() {

    try {
        var comActiveX = new ActiveXObject('KD5000.ComServer.1');
        try {
            g_ClientVersion = comActiveX.GetVersion();
        } catch (e) {
        }
    }
    catch (e) {
        return false;
    }
    return true;
}