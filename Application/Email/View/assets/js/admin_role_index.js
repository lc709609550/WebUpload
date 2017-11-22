/**
 * js   系统管理>角色管理
 * user   dingyingcheng
 * date   2017-05-10
 */
var role_edit_data = {};//角色管理--编辑的数据
var role_group_id = '';//授权时 的角色(组)id
$(function(){
    //A1--角色--检查权限
    role_check_auth();
    //f1--页面初始化
    role_table_init();
    //f2--导航按钮事件
    headersNav();
});
//A1--角色--检查权限
function role_check_auth(){
    if (auth != null) {
        $.each(auth, function (index, dome) {
            var a = '';
            if (dome.type == 'add') {
                a = '<button type="button" class="btn btn-primary  role_add" id="role_add" onclick="role_add()">'+dome.title+'</button>　';
            } else if (dome.type == 'delete') {
                a = '<button type="button" class="btn btn-primary  role_del" id="role_del" onclick="role_del()">'+dome.title+'</button>　';
            } else if (dome.type == 'edit') {
                a = '<button type="button" class="btn btn-primary role_edit" id="role_edit" onclick="role_edit()">'+dome.title+'</button>　';
            }else if (dome.type == 'examine') {
                a = '<button type="button" class="btn btn-primary  authorize" id="authorize" onclick="authorize()">'+dome.title+'</button>　';
            }
            $('.tableBtn').append(a);
        });
    }
}
//f2--导航按钮事件
function headersNav(){
    $('.headers ul li a').unbind().bind('click',function(){
        $(this).parents('li').siblings().find('i').remove();
        $(this).append('<i></i>');
        var headersText = $(this).text();
        $("#jqGridList").jqGrid('setGridParam',
            {
                datatype:'json',
                postData: {dataText:headersText},
                page: 1
            }).trigger("reloadGrid");
    });
    $('.headers ul li a').eq(0).trigger('click');
}
//f1--页面初始化
function  role_table_init() {
    //绘制表格
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var heights = $('#sidebar').height()  - 198;
    var jqTableH = heights - $('.headers').outerHeight(true);
    var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35);

    $("#jqGridList").jqGrid({
        url: "http://"+location.host+"/admin/Role/get_role_infos?"+new Date(),
        mtype: "GET",
        styleUI : 'Bootstrap',
        datatype: "json",
        colModel: [
            { label: 'id', name: 'id',hidden:true, width: 150 ,align : 'center'},
            { label: '角色名称', name: 'role_name', width: 150 ,align : 'center'},
            { label: '状态', name: 'status', width: 150,align : 'center',formatter: change_status}
            //{ label: '授权', name: 'action', width: 150,align : 'center',}
        ],
        hoverrows: true,
        height: jqTableH,
        width:"auto",
        viewrecords: true,//显示记录
        //multiselect: true,//复选框
        pginput:true,
        pgtext: "第{0}页 / 共{1}页",
        loaduis: 'enable',
        rowNum:tableNumber,
        autoheight:true, //自动拉伸高度
        autowidth:true, //自动拉伸宽度
        pager: "#jqGridPager",
        rownumbers: true, //是否显示行数
        gridComplete:function(){
            $("#jqGridList").jqGrid('setLabel',0, '序号', 'labelstyle');
        }
    });
};
//action--add--角色--新增
function role_add(){
        $('.modalWrap').html('');
        $.ajax({
            'url': './admin_role_add.html',
            "type": "get",
            'success':function (data) {
                $('.modalWrap').html(data);
                $('#role_add').modal('show');
            }
        });
    }
//action--edit--角色--编辑
function role_edit(){
    var row_uuid = $("#jqGridList").jqGrid('getGridParam', 'selrow');//获取当前数据的唯一标识
    if (row_uuid == null) {
        artDialog.alert("请选择一条要编辑的角色信息！");
        return false;
    }
    role_edit_data = $("#jqGridList").jqGrid('getRowData', row_uuid);

        $('.modalWrap').html('');
        $.ajax({
            'url': './admin_role_edit.html',
            "type": "get",
            //'data':{rows:rows},
            'success':function (data) {
                $('.modalWrap').html(data);
                $('#role_edit').modal('show');
            }
        });
}
//action--del--角色--删除
function role_del(){

    var row_uuid = $("#jqGridList").jqGrid('getGridParam', 'selrow');//获取当前数据的唯一辨识
    if (row_uuid == null) {
        artDialog.alert("请选择一条要删除的角色信息！");
        return false;
    }

    art.dialog.confirm('确定要删除选中的记录?', function () {
        var url = "http://"+location.host+"/admin/role/role_del?"+new Date();
            $.post(url, {id: row_uuid}, function (data) {
                if(data.code>400){
                    block(data.message,2000);
                }else{
                    block(data.message,2000);
                    $("#jqGridList").jqGrid('setGridParam', {
                        url: "http://"+location.host+"/admin/Role/get_role_infos?"+new Date(),
                        page: 1
                    }).trigger("reloadGrid");
                }
        });
    });
}
//action--authorize--角色--授权
function authorize(){


    var row_uuid = $("#jqGridList").jqGrid('getGridParam', 'selrow');//获取当前数据的唯一辨识
    if (row_uuid == null) {
        artDialog.alert("请选择一条要授权的用户组！");
        return false;
    }
    $('.modalWrap').html('');
    $.ajax({
        'url': './admin_role_authorize.html',
        "type": "get",
        'success':function (data) {
            $('.modalWrap').html(data);
            $('#role_authorize_add').modal('show');
            role_group_id = row_uuid;
            //如果是超级管理员则不得修改权限
            if(row_uuid != 1){
                $('#authorize_edit_btn').prepend('<button id="authorize_add_save" type="button" class="btn btn-primary">保存</button>')
            }
        }
    });
}
//init--1角色--状态转码
function change_status(cellvalue){
        if (cellvalue == 1) {
            return "启用";
        } else{
            return '禁用';
        }
}


