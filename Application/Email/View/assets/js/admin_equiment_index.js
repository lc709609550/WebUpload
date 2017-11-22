/**
 * model    系统管理--设备权限管理
 * create   dingyingcheng   2017-08-14
 * update   2017-08-14
 */
var auth_plant_type = 'unauthPlant';    //初始化--设定为--未授权
var level_code = 'all';                  //默认显示所有设备
var level_name = 'all';                  //默认显示所有设备
var auth_plant_table = '#jqGridList';   //jq表格的渲染

var domId = 'all';//全局选中的文字
$(function () {
    //A2--查询完的数据--初始化设备树
    init_auth_equiment_tree();
    //A3--查询完的数据--初始化表格
    init_auth_equiment_table();
    //点击获取设备授权的类别--授权列表--未授权列表的切换
    $('#two_header .admin_equiment_auth').unbind().bind('click', function () {
        auth_plant_type = $(this).find('a').attr('id');
        $(this).css('background', '#337ab7');
        $(this).siblings('li').css('background-color', 'white');
        $(this).siblings('li').css('color', 'black');
        //针对操作权限的--切换
        if (auth_plant_type == 'unauthPlant') {
            $('#jqGridPager').find('.ui-pg-div').html('');
            $('#jqGridPager').find('.ui-pg-div').html('<span class="glyphicon glyphicon-new-window"></span>添加授权');
        } else {
            $('#jqGridPager').find('.ui-pg-div').html('');
            $('#jqGridPager').find('.ui-pg-div').html('<span class="glyphicon glyphicon-new-window"></span>删除授权');
        }
        var username = $('#auth_equiment_auth_select').val();
        if (username == '') {
            block('请输入用户名', 1000);
            return false;
        }
        var user_exists = check_user(username);
        if (user_exists === false) {
            block('用户不在在', 1000);
            return false;
        } else {
            var postData = {
                "type": auth_plant_type,
                "id": domId,
                "username": username
            };
            var loSettings = {
                url: "http://" + location.host + "/admin/equiment/getInfo?" + new Date(),
                postData: postData,
                page: 1
            };
            $(auth_plant_table).jqGrid('setGridParam', loSettings).trigger("reloadGrid");

        }
    });
    //input--1--输入用户模糊查询
    init_user_search();

    //BTN--1授权模块的查询操作
    $('#auth_equiment_auth_cha').unbind().bind('click', function () {
        user_search();
    });
    //BTN--2授权模块的回车--查询--操作--调用函数--user_search()不能操作,故重新一遍
    /*$('#auth_equiment_auth_select').unbind().bind('keydown', function (ev) {
        if (ev.keyCode == 13) {
            var username = $('#auth_equiment_auth_select').val();

            if (username == '') {
                block("用户名不得为空！", 1000);
                return false;
            } else {
                var aaa = check_user(username);
                //如果用户不存在
                if (!aaa) {
                    artDialog.alert("用户不存在");
                    return false;
                } else {
                    var postData = {
                        "id": domId,
                        "type": auth_plant_type,
                        "username": username
                    };
                    var loSettings = {
                        url: "http://" + location.host + "/admin/equiment/getInfo?" + new Date(),
                        postData: postData,
                        page: 1
                    };
                    $(auth_plant_table).jqGrid('setGridParam', loSettings).trigger("reloadGrid");
                }
            }
        }
    });*/
});

//input--1--输入用户模糊查询
function init_user_search() {
    $.ajax({
        'url': "http://" + location.host + "/admin/equiment/init_user_search?" + new Date(),
        'type': "GET",
        'async': true,
        'dataType': "json",
        'success': function (data) {
            $('#auth_equiment_auth_select').typeahead({
                source: data,
                items: 100
            });

        }
    });


}

//A2--查询完的数据--初始化设备树
function init_auth_equiment_tree() {
    $('#object_file_tree').jstree({
        'core' : {
            'data': {
                'url': function (node) {
                    return node.id === '#' ?
                        "http://" + location.host + "/admin/equiment/get_authorize_equiment?" :
                        "http://" + location.host + "/admin/equiment/get_authorize_equiment?";
                },
                'data': function (node) {
                    return {'id': node.id};
                }
            }
        }
    });

    $('#object_file_tree').on('changed.jstree', function (e, data) {
        domId = data.node.id;//当前选中节点的id
        var username = $('#auth_equiment_auth_select').val();
        if (username == '') {
            block("用户名不得为空！", 1000);
            return false;
        }
        var user_exists = check_user(username);
        if (user_exists === false) {
            block('用户不存在', 1000);
            return false;
        } else {
            var postData = {
                "id": domId,
                'username': username,
                "type": auth_plant_type
            };
            var loSettings = {
                url: "http://" + location.host + "/admin/equiment/getInfo?" + new Date(),
                postData: postData,
                page: 1
            };
            $(auth_plant_table).jqGrid('setGridParam', loSettings).trigger("reloadGrid");
        }
    });
}

//A3--查询完的数据--初始化表格
function init_auth_equiment_table() {
    //绘制表格
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var heights = $('#sidebar').height() - 198;
    var jqTableH = heights - $('.headers').outerHeight(true);
    //var tableNumber = Math.floor(jqTableH / 35) < 5 ? 5 : Math.floor(jqTableH / 35);
    $('#object_file_tree').height(jqTableH + 79);

    var postData = {type: auth_plant_type};

    //表格的渲染
    $(auth_plant_table).jqGrid({
        url: "http://" + location.host + "/admin/equiment/getInfo?" + new Date(),
        postData: postData,
        mtype: "POST",
        styleUI: 'Bootstrap',
        datatype: "json",
        colModel: [
            {label: '序号', name: 'id', hidden: true, align: 'center'},
            {label: 'equipmentUuid', hidden: true, name: 'equipmentUuid', align: 'center'},
            {label: '集团名称', name: 'groupName', align: 'left'},
            {label: '公司名称', name: 'companyName', align: 'left'},
            {label: '分厂名称', name: 'factoryName', align: 'left'},
            {label: '装置名称', name: 'unitName', align: 'left'},
            {label: '设备名称', name: 'equipmentName', align: 'left'},
            {label: 'serverIp', name: 'serverIp',hidden: true, align: 'left'},
            {label: 'serverPort', name: 'serverPort',hidden: true, align: 'left'},
            {label: 'equipmentIndex', name: 'equipmentIndex', hidden: true,align: 'left'},
        ],
        // hoverrows: true,
        height: jqTableH,
        width: "auto",
        multiselect: true,//复选框
        viewrecords: true,//显示记录
        pginput: true,
        pgtext: "第{0}页 / 共{1}页",
        loaduis: 'enable',
        rowNum: 50,
        autoheight: true, //自动拉伸高度
        autowidth: true, //自动拉伸宽度
        pager: "#jqGridPager"
    })
        .navGrid('#jqGridPager', {edit: false, add: false, del: false, search: false, refresh: false});
    //$('.glyphicon').hide();
    //A4--授权按钮的显示
    auth_equiment_btn_show();
}

//A4--授权按钮的显示
function auth_equiment_btn_show() {
    $('#jqGridPager_left').find('.ui-pg-table').children('tbody').children('tr').html('');//操作按钮容器的清空--避免按钮重复出现
    $(auth_plant_table).navButtonAdd('#jqGridPager', {
        caption: '添加授权',
        icon: '',
        onClickButton: function () {
            //A5--授权模块--增加授权/删除授权的操作
            auth_equiment_btn_action();
        },
        position: "last"
    });
}

//A5--授权模块--增加授权/删除授权的操作
function auth_equiment_btn_action() {
    var select_id = $(auth_plant_table).getGridParam('selarrrow');//获取选择行ID
    if (select_id.length == 0) {
        artDialog.alert('请选择设备！');
        return false;
    }
    var equipmentIndexObj = {};
    for (var i in select_id) {
        var data = $(auth_plant_table).jqGrid('getRowData', select_id[i]);
        var key = data.serverIp + '_' + data.serverPort;
        if (equipmentIndexObj[key]) {
            equipmentIndexObj[key] += data.equipmentIndex + ",";
        } else {
            equipmentIndexObj[key] = data.equipmentIndex + ",";
        }
    }

    var action_type = '';
    //如果页面为  未授权设备--添加授权=======已授权设备--删除授权
    if (auth_plant_type == 'unauthPlant') {
        action_type = 'add_auth_equiment';
    } else {
        action_type = 'del_auth_equiment';
    }

    var auth_param = {
        'equipmentIndex': equipmentIndexObj,
        'action_type': action_type,
        'username': $('#auth_equiment_auth_select').val()
    };
    $.ajax({
        url: "http://" + location.host + "/Admin/equiment/auth_equiment?" + new Date(),
        type: "POST",
        data: auth_param,
        async: false,
        dataType: "json",
        error: function () {
        },
        success: function (data) {
            if (data.code == 'success') {
                block(data.msg, 2000);
                var postData = {
                    "type": auth_plant_type,
                    "username": $('#auth_equiment_auth_select').val(),
                    "id": domId
                };
                var loSettings = {
                    url: "http://" + location.host + "/admin/equiment/getInfo?" + new Date(),
                    postData: postData,
                    page: 1
                };
                $(auth_plant_table).jqGrid('setGridParam', loSettings).trigger("reloadGrid");
            } else {
                artDialog.alert(data.msg);
                return false;
            }
        }
    });
}


//BTN--1授权模块的查询操作
function auth_equiment_auth_cha() {

}

//点击或者回车键进行查询
function user_search() {

    var username = $('#auth_equiment_auth_select').val();

    if (username == '') {
        block("用户名不得为空！", 1000);
        return false;
    } else {
        var aaa = check_user(username);
        //如果用户不存在
        if (!aaa) {
            artDialog.alert("用户不存在");
            return false;
        } else {
            var postData = {
                "type": auth_plant_type,
                "username": username,
                "id": domId
            };
            var loSettings = {
                url: "http://" + location.host + "/admin/equiment/getInfo?" + new Date(),
                postData: postData,
                page: 1
            };
            $(auth_plant_table).jqGrid('setGridParam', loSettings).trigger("reloadGrid");
        }
    }

}


//检查用户是否存在
function check_user(username) {
    var user_exists = false;
    $.ajax({
        url: "http://" + location.host + "/admin/equiment/check_user?" + new Date(),
        data: 'user=' + username,
        async: false,
        success: function (data) {
            if (data.code == 'error') {
                user_exists = false;
            } else {
                user_exists = true;
            }
        }
    });
    return user_exists;
}