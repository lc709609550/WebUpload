/**
 * js   运维监控>统计报表
 * js   operation   count_report
 * user   dingyingcheng
 * date   2017-05-10
 */
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
        //A1检查权限
        if (auth.length != 0) {
            $('#count_report_auth_btn').html('');
            $.each(auth, function (index, dome) {
                var a = '';
                if (dome.type == 'export'){
                    a = '<button type="button" class="btn btn-primary " id="count_report_export" onclick="count_report_export()">'+dome.title+'</button>　';
                }
                $('#count_report_auth_btn').append(a);
            });
        }
    //绘制表格
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var heights = $('#sidebar').height()  - 198;
    var jqTableH = heights - $('.headers').outerHeight(true);
    var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35) ;

    $("#jqGridList").jqGrid({
        url: "http://"+location.host+"/operation/count_report/getRows?"+new Date(),
        mtype: "GET",
        styleUI : 'Bootstrap',
        datatype: "json",
        colModel: [
            { label: 'id', name: 'id',hidden:true,width: 150 ,align : 'center'},
            { label: '服务器名称', name: 'hostname', width: 150 ,align : 'center'},
            { label: '硬盘大小', name: 'disk_total', width: 150 ,align : 'center'},
            { label: '磁盘使用情况', name: 'data_total', width: 150 ,align : 'center'},
            { label: '内存大小', name: 'memory_total', width: 150,align : 'center' },
            { label: 'CPU', name: 'cpu_use_lv_1', width: 150,align : 'center' },
            { label: '进程数', name: 'proc_num', width: 150,align : 'center' },
            { label: '网络带宽', name: 'net_total', width: 150,align : 'center' },
            { label: '温度', name: 'temperature', width: 150,align : 'center' }
            ],
        hoverrows: true,
        height: jqTableH,
        width:"auto",
        multiselect: true,//复选框
        viewrecords: true,//显示记录
        multiselect: true,//复选框
        pginput:true,
        pgtext: "第{0}页 / 共{1}页",
        rowNum:tableNumber,
        autoheight:true, //自动拉伸高度
        autowidth:true, //自动拉伸宽度
        pager: "#jqGridPager",
        gridComplete:function(){

        }
    });
}
//运维监控>统计报表--导出
function count_report_export(){
        var hostname = '';
        var row = $("#jqGridList").getGridParam('selarrrow');
        if (row.length == 0) {
            artDialog.alert('请选择一条或多条要下载的文件！');
            return false;
        }
        for (var i = 0; i < row.length; i++) {
            var data = jQuery("#jqGridList").jqGrid('getRowData', row[i]);
            hostname += data.hostname + ",";
        }
        $.ajax({
            url: "http://"+location.host+"/operation/count_report/count_report_export?"+new Date(),
            type: "POST",
            async: false,
            data: {'hostname':hostname},
            dataType: "json",
            error: function () {
            },
            success: function (data) {
                if (data.status == 'success') {
                    artDialog.confirm("点击确定下载", function () {
                        window.location.href = data.url;
                    });
                } else {
                    artDialog.alert(data.info);
                }
            }
        });
}