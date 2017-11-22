/**
 * Created by BHZXZbaibing on 2017/5/24.
 */
$(function () {

    //表格创建
    maintaining_record_table();

    //查询
    maintaining_record_query();

});

//表格创建
function maintaining_record_table() {
    //绘制表格
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    $("#jqGridList").jqGrid({
        url: "http://"+location.host+"/project/project_information/index?"+new Date(),
        mtype: "GET",
        styleUI: 'Bootstrap',
        datatype: "json",
        colModel: [
            {label: '项目名称', name: 'project_name', width: 150, align: 'center'},
            {label: '项目类型', name: 'project_type', width: 150, align: 'center'},
            {label: '项目负责人', name: 'true_name', width: 150, align: 'center'},
            {label: '项目开始时间', name: 'project_starttime', width: 150, align: 'center'},
            {label: '项目结束时间', name: 'project_endtime', width: 150, align: 'center'},
            {label: '当前状态', name: 'project_state', width: 150, align: 'center'},
            {label: '获奖情况', name: 'win', width: 150, align: 'center'},
            {label: '重要度', name: 'project_import', width: 150, align: 'center'},
            {label: '操作', name: 'details', width: 150, align: 'center'}
        ],
        // hoverrows: true,
        height: "100%",
        width: "auto",
        multiselect: true,//复选框
        viewrecords: true,//显示记录
        pginput: true,
        pgtext: "第{0}页 / 共{1}页",
        loaduis: 'enable',
        rowNum: 20,
        autoheight: true, //自动拉伸高度
        autowidth: true, //自动拉伸宽度
        pager: "#jqGridPager",
        ondblClickRow:function(){
            $('.modalWrap').html('');
            $.ajax({
                'url': './maintaining_record_details.html',
                "type": "POST",
                'success': function (data) {
                    $('.modalWrap').html(data);
                    $('#maintaining_record_details').modal('show');
                }
            });
        }
    });
}

//查询
function maintaining_record_query(){
    $('.maintaining_record_query').unbind().bind('click',function(){
        $('.modalWrap').html('');
        $.ajax({
            'url': './maintaining_record_query.html',
            "type": "POST",
            'success': function (data) {
                $('.modalWrap').html(data);
                $('#maintaining_record_query').modal('show');
            }
        });
    });
}
