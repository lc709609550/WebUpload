/**
 * Created by BHZXZbaibing on 2017/5/19.
 */
var fileNames = new Array();
var authInfo = new Array();
$(function(){

    //A1设备管理--设备档案--检查权限
    plant_check_auth();
    //表格创建
    equipment_file_tableEvent();
    //搜索
    search();
    //当前用户拥有的设备权限
    equipment_auth();

});

//A1设备管理--设备档案--检查权限
function  plant_check_auth(){
    if (auth.length != 0) {
        $('#equipment_file_auth_btn').html('');
        $.each(auth, function (index, dome) {
            var btn = '';
            if (dome.type == 'add') {
                btn = '<button type="button" class="btn btn-primary  equipment_file_add" id="equipment_file_add">'+dome.title+'</button>　';
            } else if (dome.type == 'delete') {
                btn = '<button type="button" class="btn btn-primary  equipment_file_del" id="equipment_file_del">'+dome.title+'</button>　';
            //} else if (dome.type == 'edit') {
            //    a = '<button type="button" class="btn btn-primary user_edit" id="user_edit" onclick="equipment_file_edit()">'+dome.title+'</button>　';
            }else if (dome.type == 'select') {
                btn = '<button type="button" class="btn btn-primary" id="equipment_file_search">'+dome.title+'</button>　';
            }
            $('#equipment_file_auth_btn').append(btn);
        });
        equipment_file_search();
        equipment_file_add();
        equipment_file_del();
    }
}
//表格创建
function equipment_file_tableEvent() {
    //计算表格高度及条数
    var heights = $('#sidebar').height()  - 198;
    var jqTableH = heights - $('.headers').outerHeight(true);
    var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35) ;
    //绘制表格
    var avpostdata ={};
    avpostdata= $.extend(avpostdata,GVar.SelecTreeNode);
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    $("#jqGridList").jqGrid({
        url: "http://" + location.host + "/equipment/plant_management/getJqGridInfo?" + new Date(),
        mtype: "POST",
        styleUI: 'Bootstrap',
        datatype: "json",
        postData: avpostdata,
         colModel: [
//            {label: '序号', name: 'id', width: 30, align: 'center'},
            {label: '单位名称', name: 'company_name', width: 150, align: 'center'},
            {label: '设备名称', name: 'equipment_name', width: 150, align: 'center'},
            {label: '设备编号', name: 'equipment_id', width: 150, align: 'center'},
            {label: '建档日期', name: 'create_time', width: 150, align: 'center'},
            {label: '操作', name: 'details', width: 150, align: 'center'},
            {label: '设备类型', name: 'equipment_type_name',hidden:true, width: 150, align: 'center'},
            {label: '生产厂家', name: 'manu_facturer',hidden:true, width: 150, align: 'center'},
            {label: '资产编号', name: 'asset_number',hidden:true, width: 150, align: 'center'},
            {label: '设计信息', name: 'design_info',hidden:true, width: 150, align: 'center'},
            {label: '制造/安装信息', name: 'made_info',hidden:true, width: 150, align: 'center'},
            {label: '技术参数', name: 'parameter',hidden:true, width: 150, align: 'center'},
            {label: 'equipment_uuid', name: 'equipment_uuid', key:true, hidden:true,width: 150, align: 'center'}

        ],
        // hoverrows: true,
        height: jqTableH,
        width: "auto",
//        multiselect: true,//复选框
        viewrecords: true,//显示记录
        rownumbers: true, //是否显示行数
        pginput: true,
        pgtext: "第{0}页 / 共{1}页",
        loaduis: 'enable',
        rowNum: tableNumber,
        autoheight: true, //自动拉伸高度
        autowidth: true, //自动拉伸宽度
        pager: "#jqGridPager",
        gridComplete: function () {
            jQuery("#jqGridList").jqGrid('setLabel',0, '序号', 'labelstyle');
        },
        ondblClickRow:function(uuid){
            ViewPlantInformation(uuid);//双击跳转详情界面
        }
    });
}

//action--1--设备档案--查询
function equipment_file_search(){
    $('#equipment_file_search').unbind().bind('click', function(){
        var searchVal = $('#equipment_search').val();
        $("#jqGridList").jqGrid('setGridParam',
            {
                datatype: 'json',
                postData: {name: searchVal},
                page: 1
            }).trigger("reloadGrid");
    });
}
//action--2--设备档案--新增--权限控制
function equipment_file_add(){
    $('#equipment_file_add').unbind().bind('click', function(){
        $('.modalWrap').html('');
        if(authInfo.code>400) {
            block(authInfo.message,1000);
            return false;
        }if(authInfo.code == 300){
            block(authInfo.message,1000);
            return false;
        }else{
            equipment_file_add2();
        }
    });
}

function equipment_auth(){
    $.ajax({
        'url': "http://" + location.host + "/equipment/plant_management/userAuth?" + new Date(),
        'type':"POST",
        'async':false,
        'dataType':"json",
        'success':function(data){
            authInfo = data;
        }

    });

}

//action--2--设备档案--新增--权限控制
function equipment_file_add2(){
    $.ajax({
        'url': './equipment_file_add.html',
        "type": "GET",
        'success': function (data) {
            $('.modalWrap').html(data);
            $('#technicalEditModal').modal('show');
        }
    });
}
//action--3--设备档案--删除
function equipment_file_del(){
    $('#equipment_file_del').unbind().bind('click', function(){
        var equipment_file_id = $("#jqGridList").jqGrid('getGridParam', 'selrow');//获取当前选中的设备uuid
        if(equipment_file_id == null){
            block('请选择一条要删除的设备档案!',1000);
        }else{
            unblock();
            art.dialog({
                content: '确定要删除选中的设备档案吗！',
                ok: function () {
                    $.ajax({
                        'url': "http://" + location.host + "/equipment/plant_management/delInfo?" + new Date(),
                        'type':"POST",
                        'async':true,
                        'data':{id:equipment_file_id},
                        'dataType':"json",
                        'success':function(data){
                            block(data.message,1000);
                            if(data['code']<400) {
                                $("#jqGridList").jqGrid('setGridParam', {

                                }).trigger("reloadGrid");
                            }

                        }

                    })
                },
                cancelVal: '关闭',
                cancel: true //为true等价于function(){}
            }).time(3);

        }
    });
}

//详情跳转
function ViewPlantInformation(id) {
    Editdata = $("#jqGridList").jqGrid('getRowData',id); //根据id获取此行数据

    $('.modalWrap').html('');
    $.ajax({
        'url': './equipment_file_edit.html',
        "type": "get",
        'async':false,
        'success': function (data) {
            $('.modalWrap').html(data);
            if (auth.length != 0) {
                $.each(auth, function(index, auth){
                    if(auth.type == 'edit') {
                        $('#equipment_file_edit_save').prepend('<button id="editSave" type="button" class="btn btn-primary editSave">保存</button>');
                    }
                });
            }
            $('#equipment_file_edit').modal('show');

        }
    });
}

//搜索功能
function search(){
    $.ajax({
        'url': "http://" + location.host + "/equipment/plant_management/search_info?" + new Date(),
        'type':"GET",
        'async':true,
        'dataType':"json",
        'success':function(data){
            $('#equipment_search').typeahead({source: data,items:100});

        }
    });
}

/**
 * 点击左边树的数据表格重载
 */
function personal_tree(params) {
    var avpostdata = {
        groupName: params.groupName || '',
        companyName: params.companyName || '',
        factoryName: params.factoryName || '',
        UnitName: params.UnitName || ''
    };
    $("#jqGridList").jqGrid('setGridParam', {
        postData: avpostdata,
        page: 1
    }).trigger("reloadGrid");
}