/**
 * Created by BHZXZbaibing on 2017/5/23.
 */
$(function(){

    //项目阶段文件
    task_phase_details_table_event();
});

//项目阶段文件
function task_phase_details_table_event() {
    var datagrid1 = [
        {id1: "11", name1: "test1", baifenbi: '50%', values1: 'One'},
        {id1: "12", name1: "test2", baifenbi: '50%', values1: 'Two'},
        {id1: "13", name1: "test3", baifenbi: '50%', values1: 'Three'}
    ];
    jQuery("#jqGridList").jqGrid({
        datatype: "local",
        mtype: "GET",
        styleUI: 'Bootstrap',
        data: datagrid1,
        hoverrows: true,
        height: "100%",
        width: '768',
        multiselect: true,//复选框
        viewrecords: true,//显示记录
        pginput: true,
        pgtext: "第{0}页 / 共{1}页",
        loaduis: 'enable',
        rowNum: 20,
        autoheight: true, //自动拉伸高度
        //autowidth:true, //自动拉伸宽度
        colModel: [
            {
                label: '文件名',
                name: 'id1',
                index: 'id',
                width: 100,
                key: true,
                align: 'center',
                formatter: currencyFmatter
            },
            {label: '上传人', name: 'name1', index: 'name', width: 100, align: 'center'},
            {label: '文件大小', name: 'baifenbi', index: 'name', width: 100, align: 'center'},
            {label: '修改日期', name: 'values1', index: 'values', width: 200, align: 'center'}
        ],
        pager: '#jqGridPager'
    });
    jQuery("#jqGridList").jqGrid('gridDnD', {connectWith: '#jqGridList'});
}