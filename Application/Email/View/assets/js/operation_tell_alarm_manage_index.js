/**
 * js   运维监控>硬件设备管理
 * user   dingyingcheng
 * date   2017-05-10
 */
var hardware_plant_manage_edit_data = {};
$(function(){
        //表格创建
    tableEvent();
    //导航按钮事件
    headersNav();
});
//导航按钮事件
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
//表格创建
function  tableEvent() {
    //计算表格高度及条数
    var heights = $('#sidebar').height()  - 198;
    var jqTableH = heights - $('.headers').outerHeight(true);
    var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35) ;
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    $("#jqGridList").jqGrid({
        url: "http://"+location.host+"/operation/tell_alarm_manage/get1?"+new Date(),
        mtype: "GET",
        styleUI: 'Bootstrap',
        datatype: "json",
        colModel: [
            { label: 'id', name: 'id',hidden:true,align : 'center'},
            { label: '服务器名称', name: 'host_name', width: 120,align : 'center' },
            { label: '监控项', name: 'item_name', width: 100,align : 'center' },
            {label: '告警开始时间', name: 'start_time', width: 200,align : 'center' },
            { label: '更新时间', name: 'update_time', width: 200,align : 'center' },
            { label: '总计时间', name: 'total_run_time', width: 200,align : 'center' ,formatter: append_hours},
            { label: '阈值', name: 'alarm_line', width: 120,align : 'center' },
            { label: '最新值', name: 'item_value', width: 120,align : 'center' },
            { label: '状态', name: 'status', width: 100,align : 'center' }
        ],
        height: jqTableH,
        width: "auto",
        viewrecords: true,//显示记录
        pginput: true,
        pgtext: "第{0}页 / 共{1}页",
        loaduis: 'enable',
        rowNum: 30,
        autoheight: true, //自动拉伸高度
        autowidth: true, //自动拉伸宽度
        pager: "#jqGridPager",
        rownumbers: true, //是否显示行数
        gridComplete: function () {
            $("#jqGridList").jqGrid('setLabel',0, '序号', 'labelstyle');
        },
        onSelectRow: function (id) {
            var trClass = $("#"+id+"").find("span").attr("class");
            if(trClass == 'glyphicon glyphicon-triangle-right'){
                $("#"+id+"").find("span.glyphicon-triangle-right").click();
            }else{
                $("#"+id+"").find("span.glyphicon-triangle-bottom").click();
            }
        },
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showChildGrid// javascript function that will take care of showing the child grid
    });
}
function showChildGrid(parentRowID, parentRowKey){
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var rowData = $('#jqGridList').jqGrid('getRowData', parentRowKey);
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: "/operation/tell_alarm_manage/getChildTable?id=" + rowData['id'],
        mtype: "GET",
        datatype: "json",
        styleUI: 'Bootstrap',
        page: 1,
        colModel: [
            { label: 'id', name: 'id',hidden:true,align : 'center'},
            { label: 'parent_id', name: 'parent_id',hidden:true,align : 'center'},
            { label: '服务器名称', name: 'host_name', width: 120,align : 'center' },
            { label: '监控项', name: 'item_name', width: 100,align : 'center' },
            { label: '告警开始时间', name: 'start_time', width: 150,align : 'center' },
            { label: '更新时间', name: 'update_time', width: 150,align : 'center' },
            { label: '总计时间', name: 'total_run_time', width: 170,align : 'center',formatter: append_hours },
            { label: '阈值', name: 'alarm_line', width: 105,align : 'center' },
            { label: '最新值', name: 'item_value', width: 110,align : 'center' },
            { label: '状态', name: 'status', width: 80,align : 'center' }
        ],
        dataTypes: "json",
        styleUIs: 'Bootstrap',
        viewrecords: true,
        multiselect: false,
        autoheight: true, //自动拉伸高度
        autowidth: true, //自动拉伸宽度
        number: true, //显示行号
        autoScroll: true,
        pgtext: "第{0}页 共{1}页",
        loadui: 'enable',
        width: "99%",
        height: '100%',
        rowNum: 5,
        pager: "#" + childGridPagerID,
        rownumbers: true, //是否显示行数
        gridComplete: function () {
            $("#" + childGridID).jqGrid('setLabel',0, '序号', 'labelstyle');
        },
    });
    $("#" + childGridID).navGrid("#" + childGridPagerID, {edit: false, add: false, del: false, search: false, refresh: false, position: "left", cloneToTop: false});
}

function append_hours(cellvalue){
    return cellvalue+"小时";
}
