/**
 * Created by BHZXZbaibing on 2017/5/9.
 */
var parentId = '', pId = '', jId = '', fId = '', tId = '', onOf = false, header_searchVal = '', indexT = '',
    timeA = '', equipmentName = '', faultName = '', numbers = 0, file_type, war = false,astrCompany="",astrFactory="",astrPlant="",startTime="",endTime="";
var original_file_url, object_file_url;
var uid = '';//用户uid;
var auth = ''
var pid;
var gisIndex = -1;
var gisType = '';
var GVar = {};//用于全局的设备输节点
var loginTime;
var G_oObject = null;
var obj = null;
var clientNm = 0;
$(function () {
    var sidebarH =  $('#sidebar').height();
    $('#main-content').height(sidebarH-100);
    $('#aside_nav').height(sidebarH-$('#sidebar .centered').outerHeight(true)-$('#true_name').outerHeight(true)-6);
    $('#personal_auth_tree').height(sidebarH-$('#sidebar .centered').outerHeight(true)-$('#true_name').outerHeight(true)-6);
    //菜单的初始化显示
    get_menu();

    data_set();

    //navClick();

    //jqGrid 表格自适应
    $("#jqGridList").setGridWidth($(window).width() - 252);

    $('.tooltips').bind('click', function () {
        if ($(this).attr('onOff') == 'on') {
            $("#jqGridList").setGridWidth($(window).width() - 42);
            $(".ui-jqgrid .ui-jqgrid-bdiv").css('overflow','hidden');
            $(this).attr('onOff', 'off');
        } else if ($(this).attr('onOff') == 'off') {
            $("#jqGridList").setGridWidth($(window).width() - 252);
            $(".ui-jqgrid .ui-jqgrid-bdiv").css('overflow','hidden');
            $(this).attr('onOff', 'on');
        }
    });

    //查看更多
    $('.external').children("a:first-child").unbind().bind('click', function () {
        var name = $(this).attr('name');
        switch (name) {
            case 'project_msg':
                // $('#nav-accordion>li').eq(2).children('a').click();
                $('#project_information').find('a').click();
                break;
            case 'fault_msg':
                // $('#nav-accordion>li').eq(2).children('a').click();
                $('#fault_case_library').find('a').click();
                break;
            case 'alarm_msg':
                // $('#nav-accordion>li').eq(5).children('a').click();
                $('#operation_tell_alarm_manage_index').find('a').click();
                break;
            default:
        }

        /*if($('#nav-accordion>li').eq(0).find('a').attr('class') != 'active'){

            $('#nav-accordion>li').eq(0).find('a').click();

        }else{
            $('html,body').animate({scrollTop: $('#nimei').offset().top},1000);
            return false;
        }
        setTimeout(function(){
            if($('#nav-accordion>li').eq(0).find('a').attr('class') == 'active'){

                $('html,body').animate({scrollTop: $('#nimei').offset().top},1000);
                return false;
            }
        },1000)*/


    });
    //导航栏搜索
    header_search();
    //退出登录
    logout();
    //设备树切换
    second_level();
    //换肤
    gear();

})

//导航按钮点击
function navClick() {

    $('#nav-accordion li a').unbind().bind({
        'click': function () {
            $(this).addClass('active');
            if (!$(this).parent().hasClass('sub-menu')) {
                if ($(this).attr('urls') != '') {
                    //点击菜单时判断session过期
                    //get_auth();
                    $('#home_page').html('');
                    var url = $(this).attr('urls');
                    var address = $(this).attr('url');//url
                    get_auth(address);
                    navAjax(url);

                }
            }
            $("#fountainG").hide();
        }
    });

    $('#nav-accordion>li a').eq(0).trigger('click');
}

//
function navAjax(url) {
    $.ajax({
        url: url, //这里是静态页的地址
        type: "GET", //静态页用get方法，否则服务器会抛出405错误
        dataType: 'html',
        async: false,
        success: function (html) {
            $('#jump_page').hide();
            $('#jump_page').html('');
            $('.modal-backdrop').hide();
            $('.modal-backdrop').html('');
            $('.modalContent').html('');
            $('#server_side_page').hide();
            $('#server_side_page').html('');
            if(url == "./monitor.html"){
                $('#home_page').hide();
                if(clientNm == 0){
                    $('#client').html(html);
                    clientNm = 1
                }
                $('#client').show();
            }else {
                $('#client').hide();
                $('#home_page').html(html);
                $('#home_page').show();
            }

        }
    });

}

//跳转请求
function jumpPageAjax(url) {
    $.ajax({
        url: url, //这里是静态页的地址
        type: "GET", //静态页用get方法，否则服务器会抛出405错误
        async: true,
        dataType: 'html',
        success: function (html) {
            $('.modalWrap').html('');
            $('.modalContent').html('');
            $('#jump_page').html(html);
            $('#home_page').hide();
            $('#jump_page').show();
        }
    });

}

//artdialog弹窗插件
function block(msg, timeInt) {

    setTimeout(function () {
        art.artDialog.tips(msg).lock().time(0);
    }, 1);
    if (timeInt) {
        setTimeout(function () {
            art.artDialog.tips().close();
        }, timeInt);
    }
}


//管理数据

function data_set() {
    //logo

    var logo = new Vue({
        el: '.logo',
        data: {
            trademark: '大数据中心'
        }
    });
    //提醒数据
    var Project_reminder = new Vue({
        el: '.Project_reminder',
        data: {
            count: '',
            info: [],
            isA: true,
            isB: false,
            isC: false,
            isD:false
        },
        mounted: function () {
            var thie = this;
            setTimeout(function () {
                $.ajax({
                    type: 'POST',
                    url: "http://" + location.host + "/personal/project/project_remind_top?" + new Date(),
                    success: function (data) {

                        thie.info = data.info;

                        thie.count = data.count;

                        if(data.count>10){
                            thie.isA = false;
                            thie.isB = true;
                            thie.isC = false;
                            thie.isD = true;
                        }else if(data.count == 0){
                            thie.isA = false;
                            thie.isB = false;
                            thie.isC = true;
                            thie.isD = false;
                        }else{
                            thie.isA = true;
                            thie.isB = false;
                            thie.isC = false;
                            thie.isD = true;
                        }

                    }
                });
            }, 1000);
        },
        methods: {
            greet: function (events) {
                var thir = this;
                $.ajax({
                    type: 'POST',
                    url: "http://" + location.host + "/personal/project/project_remind_top?" + new Date(),
                    data: {id: events},
                    success: function (data) {

                        thir.info = data.info;

                        thir.count = data.count;
                        if (events == 0) {
                            $('#Project_reminder .yd').hide();
                        }else{
                            $('#project_information').find('a').click();
                        }
                        if(data.count>10){
                            thir.isA = false;
                            thir.isB = true;
                            thir.isC = false;
                            thir.isD = true;
                        }else if(data.count == 0){
                            thir.isA = false;
                            thir.isB = false;
                            thir.isC = true;
                            thir.isD = false;
                        }else{
                            thir.isA = true;
                            thir.isB = false;
                            thir.isC = false;
                            thir.isD = true;
                        }
                    }
                });
            }
        }
    });

    //提醒数据
    // var fault_case_reminder = new Vue({
    //     el: '.fault_case_reminder',
    //     data: {
    //         count: '',
    //         info: [],
    //         isA: true,
    //         isB: false,
    //         isC: false,
    //         isD:false
    //     },
    //     mounted: function () {
    //         var thie = this;
    //         setTimeout(function () {
    //             $.ajax({
    //                 type: 'POST',
    //                 url: "http://" + location.host + "/personal/project/project_fault_case_top?" + new Date(),
    //                 success: function (data) {
    //
    //                     thie.info = data.info;
    //
    //                     thie.count = data.count;
    //
    //                     if(data.count>10){
    //                         thie.isA = false;
    //                         thie.isB = true;
    //                         thie.isC = false;
    //                         thie.isD = true;
    //                     }else if(data.count == 0){
    //                         thie.isA = false;
    //                         thie.isB = false;
    //                         thie.isC = true;
    //                         thie.isD = false;
    //                     }else{
    //                         thie.isA = true;
    //                         thie.isB = false;
    //                         thie.isC = false;
    //                         thie.isD = true;
    //                     }
    //                 }
    //             });
    //         }, 1000);
    //
    //     },
    //     methods: {
    //         greet: function (events) {
    //             var thir = this;
    //             $.ajax({
    //                 type: 'POST',
    //                 url: "http://" + location.host + "/personal/project/project_fault_case_top?" + new Date(),
    //                 data: {id: events},
    //                 success: function (data) {
    //                     thir.info = data.info;
    //
    //                     thir.count = data.count;
    //                     if (events == 1) {
    //                         $('#fault_case_reminder .yd').hide();
    //                     }else{
    //                         $('#fault_case_library').find('a').click();
    //                     }
    //                     if(data.count>10){
    //                         thir.isA = false;
    //                         thir.isB = true;
    //                         thir.isC = false;
    //                         thir.isD = true;
    //                     }else if(data.count == 0){
    //                         thir.isA = false;
    //                         thir.isB = false;
    //                         thir.isC = true;
    //                         thir.isD = false;
    //                     }else{
    //                         thir.isA = true;
    //                         thir.isB = false;
    //                         thir.isC = false;
    //                         thir.isD = true;
    //                     }
    //                 }
    //             });
    //         }
    //     }
    // });

    //告警--列表
    var operation_monitoring = new Vue({
        el: '.operation_monitoring',
        data: {
            count: '',
            info: [],
            isA: true,
            isB: false,
            isC: false,
            isD:false
        },
        mounted: function () {
            var thie = this;
            setTimeout(function () {
                $.ajax({
                    type: 'POST',
                    url: "http://" + location.host + "/personal/tell_alarm_manage/get_tell_alarm_manage_lists_top?" + new Date(),
                    success: function (data) {
                        thie.info = data.info;
                        thie.count = data.count;
                        if(data.count>10){
                            thie.isA = false;
                            thie.isC = false;
                            thie.isB = true;
                            thie.isD = true;
                        }else if(data.count == 0){
                            thie.isA = false;
                            thie.isB = false;
                            thie.isC = true;
                            thie.isD = false;
                        }else{
                            thie.isA = true;
                            thie.isB = false;
                            thie.isC = false;
                            thie.isD = true;
                        }
                    }
                });
            }, 1000);

        },
        methods: {
            greet: function (events) {

                var thir = this;
                $.ajax({
                    type: 'POST',
                    url: "http://" + location.host + "/personal/tell_alarm_manage/get_tell_alarm_manage_lists_top?" + new Date(),
                    data: {id: events},
                    success: function (data) {
                        thir.info = data.info;
                        thir.count = data.count;
                        if (events == 0) {
                            $('#operation_monitoring .yd').hide();
                        }else{
                            $('#operation_tell_alarm_manage_index').find('a').click();
                        }
                        if(data.count>10){
                            thir.isA = false;
                            thir.isB = true;
                            thir.isC = false;
                            thir.isD = true;
                        }else if(data.count == 0){
                            thir.isA = false;
                            thir.isB = false;
                            thir.isC = true;
                            thir.isD = false;
                        }else{
                            thir.isA = true;
                            thir.isB = false;
                            thir.isC = false;
                            thir.isD = true;
                        }
                    }
                });
            }
        }
    })
/*
    //人员变动提醒数据
    var project_memberr = new Vue({
        el: '.project_memberr',
        data: {
            count: '',
            info: []
        },
        mounted: function () {
            var thie = this;
            setTimeout(function () {
                $.ajax({
                    type: 'POST',
                    url: "http://" + location.host + "/personal/project/project_members_change_top?" + new Date(),
                    success: function (data) {

                        thie.info = data.info;

                        thie.count = data.count;
                    }
                });
            }, 1000);

        },
        methods: {
            greet: function (events) {
                var thir = this;
                $.ajax({
                    type: 'POST',
                    url: "http://" + location.host + "/personal/project/project_members_change_top?" + new Date(),
                    data: {id: events},
                    success: function (data) {

                        thir.info = data.info;

                        thir.count = data.count;
                        if (events == 0) {
                            $('#project_memberr .yd').hide();
                        }
                    }
                });
            }
        }
    })*/
}


//跳转页面时获取该用户的--菜单--权限
function get_menu() {
    $.ajax({
        url: "http://" + location.host + "/Index/Menu/get_menu?" + new Date(),
        type: "get",
        async: false,
        dataType: "json",
        error: function () {

        },
        success: function (data) {
            if (data.code == 'error') {
                location.href = '/ui/index.html';
            } else {
                $('#true_name').html(data.user.true_name);//用户名
                $('.centereds').attr('uid', data.user.uid);//用户名
                $('.centereds').attr('username', data.user.username);//用户名
                if (data.user.photo !== null) {
                    $('#sidebar .img-circle').attr('src', data.user.photo);//头像
                }

                //点击图片修改密码等操作
                $('.img-circle').unbind().bind('click', function () {
                    uid = $('.centereds').attr('uid');
                    $('.modalWrap').html('');
                    $.ajax({
                        'url': './admin_user_edit_me.html',
                        "type": "get",
                        'success': function (data) {
                            $('.modalWrap').html(data);
                            $('#user_edit_me').modal('show');
                        }
                    });
                });
                    if(data.is_simple == true){
                        art.dialog({
                            title: '消息',
                            content: '密码过于简单是否立即修改密码！',
                            icon: 'warning',
                            ok: function(){
                                $('.img-circle').click();
                            },
                            cancel: function(){
                            },
                        });
                    }
                var navHtml = '';
                var subHtml = '';
                $.each(data.info, function (k, v) {

                    if (v.child != undefined) {
                        subHtml = '';
                        $.each(v.child, function (key, val) {

                            subHtml += ' <li id="' + val.action + '"><a href="javascript:void(0)" url="' + val.url + '" urls="./' + val.action + '.html">' + val.name + '</a></li>'

                        })
                        navHtml = ' <li class="sub-menu"> ' +
                            '<a href="javascript:void(0)"  urls=""> ' +
                            '<i class="fa ' + v.icon + '"></i> ' +
                            '<span>' + v.name + '</span> ' +
                            '</a>' +
                            ' <ul class="sub"> ' +
                            subHtml +
                            '</ul> ' +
                            '</li>';
                    } else {
                        navHtml = ' <li id="' + v.action + '"> ' +
                            '<a href="javascript:void(0)" url="' + v.url + '"  urls="./' + v.action + '.html"> ' +
                            '<i class="fa ' + v.icon + '"></i> ' +
                            '<span>' + v.name + '</span> ' +
                            '</a>' +
                            '</li>';
                    }
                    $('#nav-accordion').append(navHtml);

                });

                $('#monitor').hide();
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    $('#monitor').show();
                }
                navClick();
            }
        }
    });
}

//跳转页面时获取该--权限
function get_auth(address) {
    $.ajax({
        url: "http://" + location.host + "/Index/Auth/get_auth?" + new Date(),
        type: "POST",
        async: false,
        data: {url: address},
        dataType: "json",
        error: function () {

        },
        success: function (data) {
            if (data.code == 'error') {
                location.href = '/ui/index.html';
            } else {
                auth = '';
                auth = data.info;
            }
        }
    });
}

//导航栏搜索
function header_search() {
    $('.header_btn').unbind().bind('click', function () {

        header_searchVal = $('#header_search').val();

        $('#nav-accordion> #details_search').find('a').click();

    });

    $('#header_search').unbind().bind('keydown', function () {
        if (event.keyCode == "13") {
            header_searchVal = $('#header_search').val();

            $('#nav-accordion> #details_search').find('a').click();


        }
    });
}

//退出登录
function logout() {
    $('.logout').unbind().bind('click', function () {
        $.ajax({
            url: "http://" + location.host + "/login/Index/logout?" + new Date(),
            type: "POST",
            error: function () {
            },
            success: function (data) {
                window.location.href = 'index.html';
            }
        })
    })
}

//退出登录
function gear() {
    $('.bigDatPage').unbind().bind('click',function(){
        location.href = '/ui/bigDataStatistics.html';
    });
    $('.gear').unbind().bind('click', function () {

        $('.color-mode').show();

    });
    $('.color-mode').unbind().bind({
        'mouseover':function(){
            $('.color-mode').show();
        },
        'mouseout':function() {
            $('.color-mode').hide();
        }
    });

    $('.color-mode .inline>li').unbind().bind('click',function(){
        var dataStyle = $(this).attr('data-style');
        $('#container .black-bg').removeClass('default');
        $('#sidebar').removeClass('default');
        $('.site-footer').removeClass('default');
        $('ul.sidebar-menu li ul.sub li').removeClass('default');
        $('#container .black-bg').removeClass('blue');
        $('#sidebar').removeClass('blue');
        $('.site-footer').removeClass('blue');
        $('ul.sidebar-menu li ul.sub li').removeClass('blue');
        $('#container .black-bg').removeClass('brown');
        $('#sidebar').removeClass('brown');
        $('.site-footer').removeClass('brown');
        $('ul.sidebar-menu li ul.sub li').removeClass('brown');
        $('#container .black-bg').removeClass('purple');
        $('#sidebar').removeClass('purple');
        $('.site-footer').removeClass('purple');
        $('ul.sidebar-menu li ul.sub li').removeClass('purple');
        $('#container .black-bg').removeClass('grey');
        $('#sidebar').removeClass('grey');
        $('.site-footer').removeClass('grey');
        $('ul.sidebar-menu li ul.sub li').removeClass('grey');
        $('#container .black-bg').removeClass('light');
        $('#sidebar').removeClass('light');
        $('.site-footer').removeClass('light');
        $('ul.sidebar-menu li ul.sub li').removeClass('light');
        $('#container .black-bg').addClass(dataStyle);
        $('#sidebar').addClass(dataStyle);
        $('.site-footer').addClass(dataStyle);
        $('ul.sidebar-menu li ul.sub li').addClass(dataStyle);
        $('.color-mode').hide();
    });
}

function second_level() {
    $('#tow_nav li a').unbind().bind({
        'click':function(){
            var indexs = $(this).parent().index();
            if(indexs == 1){
                personal_init_auth_tree();
            }
            $(this).css('background-color','#2D2F30');
            $(this).parent().siblings().find('a').css('background-color','transparent');
            $('#aside_nav .nav_blick').eq(indexs).show();
            $('#aside_nav .nav_blick').eq(indexs).siblings().hide();

        }
    })
    $('#tow_nav li a').eq(0).click();
}

//个人中心--设备树的显示
function personal_init_auth_tree() {
    $('#personal_auth_tree').jstree({
        'core' : {
            'data': {
                'url': function (node) {
                    return node.id === '#' ?
                        "http://" + location.host + "/personal/auth_equiment/get_authorize_equiment?" :
                        "http://" + location.host + "/personal/auth_equiment/get_authorize_equiment?";
                },
                'data': function (node) {
                    return {'id': node.id};
                }
            }
        }

    });
    $('#personal_auth_tree').on('changed.jstree', function (e, data) {
        var personal_tree_id  = data.node.id;//当前选中节点的id
        var personal_tree_param = {};
        if(personal_tree_id == 'total'){
            //用于全局数据基于选中设备树节点的默认筛选
            GVar.SelecTreeNode = {
                groupName: '',
                companyName: '',
                factoryName: '',
                UnitName: ''
            };
        }else{
            var personal_tree_id_arr = personal_tree_id.split('/');
             personal_tree_param =
            {
                groupName: personal_tree_id_arr[0],// 集团
                companyName: personal_tree_id_arr[1],// 公司
                factoryName: personal_tree_id_arr[2],// 分厂
                UnitName: personal_tree_id_arr[3]// 装置
            };
            //用于全局数据基于选中设备树节点的默认筛选
            GVar.SelecTreeNode = {
                groupName: personal_tree_id_arr[0],
                companyName: personal_tree_id_arr[1],
                factoryName: personal_tree_id_arr[2],
                UnitName: personal_tree_id_arr[3]
            };
        }


        //子页面统一调用方法 start
        try {
            personal_tree(personal_tree_param);
        }
        catch (e) {
        }
    });
}