/**
 * model    设备管理--设备状态
 * Created by BHZXZbaibing on 2017/5/22.
 * edit dingyingcheng 2017-09-27
 */
var stateTypes = 0;
var equipmentId = null;
var avpostdata = {
    "stateType": stateTypes
};
var timeoutOne = null;
var timersss = null;
var pages = 1;
var d = new Date();
var times = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes();
var timer = d.getFullYear() + "-" + (d.getMonth()) + "-" + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes();
$(function () {
//权限按钮的显示
    if (auth.length != 0) {
        $('#equipment_status_auth_btn').html('');
        $.each(auth, function (index, dome) {
            var bun = '';
            if (dome.type == 'select') {
                bun = '<button type="button" class="btn btn-warning equipment_status_select" id="" onclick="equipment_status_select()">' + dome.title + '</button>　';
            } else if (dome.type == 'export') {
                bun = '<button type="button"  class="btn btn-info equipment_status_export"  id=""onclick="equipment_status_export()">' + dome.title + '</button>　';
            }
            $('#equipment_status_auth_btn').append(bun);
        });
    }

    //设备管理--设备状态--初始化表格
    realTimeAlerting(avpostdata);
    //设备状态--按钮切换状态
    equipment_btn();
    //获取设备状态的总数
    get_equioment_count();
});

function tableTime() {
    var avpostdats = {
        "stateType": stateTypes
    };

    $("#equipment_jqGridList").jqGrid('setGridParam',
        {
            datatype: 'json',
            postData: avpostdats,
            page: pages
        }).trigger("reloadGrid");

    timersss = setTimeout(tableTime, 3000 * 10);
}
//获取设备状态的设备的总数
function get_equioment_count(){
    $.ajax({
        url: "http://"+location.host+"/equipment/equipment_status/get_equipment_status_count?"+new Date(),
        type: "POST",
        dataType: "json",
        error: function () {
        },
        success: function (data) {
            $('#equipment_status .headers h2 span').html('( 共有 ' + data + ' 台设备 )')
        }
    });
};

//设备管理--设备状态--表格初始化
function realTimeAlerting(avpostdata) {
    //计算表格高度及条数
    var heights = $('#sidebar').height() - 194;
    var jqTableH = heights - $('.headers').outerHeight(true);
    var tableNumber = Math.floor(jqTableH / 35) < 5 ? 5 : Math.floor(jqTableH / 35);

    avpostdata= $.extend(avpostdata,GVar.SelecTreeNode);
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    $("#equipment_jqGridList").jqGrid({
        url: "http://"+location.host+"/equipment/equipment_status/get_equipment_status_infos?"+new Date(),
        mtype: "GET",
        styleUI: 'Bootstrap',
        datatype: "json",
        postData: avpostdata,
        colModel: [
            {label: 'equipmentUuid', name: 'equipmentUuid',key:true, width: 150, align: 'center', 'hidden': true},
            {label: 'alarmStatus', name: 'alarmStatus', width: 150, align: 'center', 'hidden': true},
            {label: '单位名称', name: 'companyName', width: 150, align: 'center'},
            {label: '设备名称', name: 'equipmentName', width: 120, align: 'center'},
            {label: '设备类型', name: 'equipmentTypeName', width: 150, align: 'center'},
            {label: '设备编号', name: 'equipmentId', width: 150, align: 'center'},
            {label: '设备状态', name: 'alarmStatus', width: 100, align: 'center',formatter: change_equiment_status},
            {label: '操作', name: '', width: 100, align: 'center', formatter: cz}
        ],
        // hoverrows: true,
        height: jqTableH,
        width: "auto",
        //multiselect: true,//复选框
        rownumbers: true, //是否显示行数
        rownumWidth:50,
        viewrecords: true,//显示记录
        pginput: true,
        pgtext: "第{0}页 / 共{1}页",
        loaduis: 'enable',
        rowNum: tableNumber,
        autoheight: true, //自动拉伸高度
        autowidth: true, //自动拉伸宽度
        pager: "#equipment_jqGridPager",
        gridComplete: function (rowid) {
            $("#equipment_jqGridList").jqGrid('setLabel',0, '序号', 'labelstyle');
            },
        loadComplete: function (data) {
            $('.gen-case span').html(data.records);
        }
    });
}

//设备状态--设备状态的转换
function change_equiment_status(cellvalue, options, rowObject){
   if(cellvalue == 1){
        return '<span class="label label-danger label-mini">危险</span>';
   }else if(cellvalue == 2){
        return '<span class="label label-warning label-mini">报警</span>';
   }else if(cellvalue == 3){
        return '<span class="label label-success label-mini">开机</span>';
   }else if(cellvalue == 4){
        return '<span class="label label-primary label-mini">停机</span>';
   }else if(cellvalue == 5){
        return '<span class="label label-default label-mini">断网</span>';
   }else if(cellvalue == 9){
        return '<span class="label label-default label-mini">---</span>';
   }
}
//操作按钮
function cz(cellvalue, options, rowObject) {
    return '<a href="javascript:void(0);" onclick="deviceKanbanEvent(this)" style="text-decoration: none;color: #2e6e9e;font-weight: bold;" equipmentId="' + rowObject.equipmentUuid + '">设备看板</a>';
}

//操作事件
function deviceKanbanEvent(t) {
    equipmentId = $(t).attr('equipmentId');
    $('.modalWrap').html('');
    $.ajax({
        'url': './device_kanban.html',
        "type": "get",
        'async': false,
        'success': function (data) {
            $('.modalWrap').html(data);
            $('#deviceKanban').modal('show');
            $('#deviceKanban').on('hidden.bs.modal', function () {
                clearTimeout(timeoutOne);
            });
        }
    });
}

//设备状态--按钮切换状态
function equipment_btn() {
    $('#equipment_status .btn-group .btn').unbind().bind('click', function () {

        $(this).addClass('active');
        $(this).css({'border-bottom-color':'#fff','background-color':'#fff'});
        $(this).siblings().removeClass('active');
        $(this).siblings().css('border-bottom-color','#333');
        var types = $(this).attr('types');
        stateTypes = types;
        $("#equipment_jqGridList").jqGrid('setGridParam',
            {
                datatype: 'json',
                postData: {stateType: types},
                page: 1
            }).trigger("reloadGrid");
    });
    $('#equipment_status .btn-group .btn').eq(5).click();
}


/**
 * 点击左边树的数据表格重载
 */
function personal_tree(params) {
    var avpostdata = {
        groupName: params.groupName || '',
        companyName: params.companyName || '',
        factoryName: params.factoryName || '',
        UnitName: params.UnitName || '',
    };
    $("#equipment_jqGridList").jqGrid('setGridParam', {
        postData: avpostdata,
        page: 1
    }).trigger("reloadGrid");
}



//设备状态--查询
function equipment_status_select() {
    artDialog.alert("设备状态--查询！");
    return false;
}

//设备状态--导出
function equipment_status_export() {
    artDialog.alert("设备状态--导出！");
    return false;
}

