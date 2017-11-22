/**
 * js   系统管理>用户列表
 * user   dingyingcheng
 * date   2017-05-10
 */
var user_add_role_name_info = {};
var user_edit_role_name_info = {};
var Editdatas = {};
var del_id = {};

$(function () {
    //A1检查权限
    user_check_auth();
    //B1--查询的初始化
    init_user_search();
    //f1--页面初始化
    user_table_init();
    //f2--导航按钮事件
    headersNav();
});

//A1检查权限
function user_check_auth() {
    if (auth.length != 0) {
        $('#user_btn').html('');
        $.each(auth, function (index, dome) {
            var a = '';
            if (dome.type == 'select') {
                a = '<button type="button" class="btn btn-primary  user_select" id="user_select" onclick="user_select()">' + dome.title + '</button>　';
            } else if (dome.type == 'add') {
                a = '<button type="button" class="btn btn-primary  user_add" id="user_add" onclick="user_add()">' + dome.title + '</button>　';
            } else if (dome.type == 'delete') {
                a = '<button type="button" class="btn btn-primary  user_del" id="user_del" onclick="user_del()">' + dome.title + '</button>　';
            } else if (dome.type == 'edit') {
                a = '<button type="button" class="btn btn-primary user_edit" id="user_edit" onclick="user_edit()">' + dome.title + '</button>　';
            } else if (dome.type == 'examine') {
                a = '<button type="button" class="btn btn-primary update_pass" id="update_pass" onclick="update_pass()">' + dome.title + '</button>　';
            }
            $('#user_btn').append(a);
        });
    }
}

//B1--查询的初始化
function init_user_search() {
    $.ajax({
        'url': "http://" + location.host + "/admin/equiment/init_user_search?" + new Date(),
        'type': "GET",
        'async': true,
        'dataType': "json",
        'success': function (data) {
            $('#admin_user_cha_input').typeahead({
                source: data,
                items: 100
            });

        }
    });
}

//f1--页面初始化
function user_table_init() {
    //绘制表格
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    var heights = $('#sidebar').height() - 198;
    var jqTableH = heights - $('.headers').outerHeight(true);
    var tableNumber = Math.floor(jqTableH / 35) < 5 ? 5 : Math.floor(jqTableH / 35);
    $("#jqGridList").jqGrid({
        url: "http://" + location.host + "/admin/User/get_user_infos?" + new Date(),
        mtype: "GET",
        styleUI: 'Bootstrap',
        datatype: "json",
        colModel: [
            {label: 'uid', name: 'uid', key: true, hidden: true, width: 150, align: 'center'},
            {label: '用户名', name: 'username', width: 150, align: 'center'},
            //{ label: '密码', name: 'pass', width: 150,align : 'center' },
            {label: 'photo', name: 'photo', hidden: true, width: 150, align: 'center'},
            {label: '单位', name: 'unit', width: 150, align: 'center'},
            {label: '真实姓名', name: 'true_name', width: 150, align: 'center'},
            {label: '所属角色', hidden: true, name: 'gid', width: 150, align: 'center'},
            {label: '所属角色', name: 'role_name', width: 150, align: 'center'},
            {label: '电话', name: 'phone', width: 150, align: 'center'},
            {label: '邮箱', name: 'email', width: 150, align: 'center'}
            //{ label:'操作', name: 'action', width: 150,align : 'center' }
        ],
        hoverrows: true,
        height: jqTableH,
        width: "auto",
        //multiselect: true,//复选框
        rownumbers: true, //是否显示行数
        viewrecords: true,//显示记录
        pginput: true,
        pgtext: "第{0}页 / 共{1}页",
        loaduis: 'enable',
        rowNum: tableNumber,
        autoheight: true, //自动拉伸高度
        autowidth: true, //自动拉伸宽度
        pager: "#jqGridPager",
        gridComplete: function () {
            $("#jqGridList").jqGrid('setLabel', 0, '序号', 'labelstyle');
        },
        ondblClickRow: function (rowid) {
            //user_edit(rowid);
        }
    });
}

//f2--导航按钮事件
function headersNav() {
    $('.headers ul li a').unbind().bind('click', function () {
        $(this).parents('li').siblings().find('i').remove();
        $(this).append('<i></i>');
        var headersText = $(this).text();
        $("#jqGridList").jqGrid('setGridParam',
            {
                datatype: 'json',
                postData: {dataText: headersText},
                page: 1
            }).trigger("reloadGrid");
    });
    $('.headers ul li a').eq(0).trigger('click');
}

//B1--用户查询
function user_select(){
    var user_select_value = $('#admin_user_cha_input').val();
    $("#jqGridList").jqGrid('setGridParam',
        {
            datatype: 'json',
            postData: {username: user_select_value},
            page: 1
        }).trigger("reloadGrid");
}


//action--1--add--用户--新增
function user_add() {
    //获取角色的填充数据
    $('.modalWrap').html('');
    $.ajax({
        'url': './admin_user_add.html',
        "type": "get",
        'success': function (data) {
            $('.modalWrap').html(data);
            $('#user_add').modal('show');
        }
    });
}

//action--1--edit--用户--编辑
function user_edit() {
    var uid = $("#jqGridList").jqGrid('getGridParam', 'selrow');//获取当前选中的设备uuid
    if (uid == null) {
        artDialog.alert("请选择一条要编辑的用户信息！");
        return false;
    }
    var Editdata = $("#jqGridList").jqGrid('getRowData', uid);
    Editdatas = Editdata;
    $('.modalWrap').html('');
    $.ajax({
        'url': './admin_user_edit.html',
        "type": "get",
        //'data':{rows:rows},
        'success': function (data) {
            $('.modalWrap').html(data);
            $('#user_edit').modal('show');
        }
    });
}

//action--1--del--用户--删除
function user_del() {
    var uid = $("#jqGridList").jqGrid('getGridParam', 'selrow');//获取当前数据的唯一标识uid
    if (uid == null) {
        artDialog.alert("请选择一条要删除的用户信息！");
        return false;
    }

    var data = jQuery("#jqGridList").jqGrid('getRowData', uid);
    if (data.username == 'mgr') {
        artDialog.alert("超级管理员不得删除！");
        return false;
    }
    art.dialog.confirm('确定要删除选中的记录?', function () {
        var url = "http://" + location.host + "/admin/User/user_del?" + new Date();
        $.post(url, {uid: uid}, function (data) {
            if (data.code == 'error') {
                block(data.msg, 2000);
            } else {
                block(data.msg, 2000);
                $("#jqGridList").jqGrid('setGridParam', {
                    url: "http://" + location.host + "/admin/User/get_user_infos?" + new Date(),
                    page: 1
                }).trigger("reloadGrid");
            }
        });
    });
}

//action--4--update_pass--用户--重置密码
function update_pass() {
    var uid = $("#jqGridList").jqGrid('getGridParam', 'selrow');//获取当前数据的唯一标识uid
    if (uid == null) {
        artDialog.alert("请选择一条要重置的用户！");
        return false;
    }

    var data = jQuery("#jqGridList").jqGrid('getRowData', uid);
    if (data.username == 'mgr') {
        artDialog.alert("超级管理员不得重置！");
        return false;
    }
    art.dialog.confirm('确定要重置选中的记录?', function () {
        var url = "http://" + location.host + "/admin/User/update_pass?" + new Date();
        $.post(url, {uid: uid, username: data.username}, function (data) {
            if (data.code == 'error') {
                block(data.msg, 2000);
            } else {
                block(data.msg, 2000);
                $("#jqGridList").jqGrid('setGridParam', {
                    url: "http://" + location.host + "/admin/User/get_user_infos?" + new Date(),
                    page: 1
                }).trigger("reloadGrid");
            }
        });
    });
}