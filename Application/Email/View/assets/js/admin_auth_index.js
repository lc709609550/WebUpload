/**
 * js   系统管理>角色授权
 * user   dingyingcheng
 * date   2017-05-10
 */
$(function(){
    //数据初始化
    init_auth_info();
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
function init_auth_info(){
    $.ajax({
        url: "http://"+location.host+"/admin/Auth/get_auth_infos?"+new Date(),
        "type": "POST",
        'success':function (data) {
            $('#auth_info').html('');
            $('#auth_info').html(data);
        }
    });
}




//表格创建
function  tableEvent() {
    //绘制表格
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    $("#jqGridList").jqGrid({
        url: "http://"+location.host+"/admin/User/get_user_infos?"+new Date(),
        mtype: "GET",
        styleUI : 'Bootstrap',
        datatype: "json",
        colModel: [
            { label: '111', name: 'GROUP_NAME', width: 150 ,align : 'center'},
            { label: '用户名', name: 'username', width: 150 ,align : 'center'},
            { label: '密码', name: 'password', width: 150,align : 'center' },
            { label: '单位', name: 'unit', width: 150,align : 'center' },
            { label:'真实姓名', name: 'true_name', width: 150,align : 'center' },
            { label:'所属角色', name: 'role', width: 150,align : 'center' },
            { label:'电话', name: 'phone', width: 150,align : 'center' },
            { label:'邮箱', name: 'email', width: 150,align : 'center' },
            { label:'操作', name: 'action', width: 150,align : 'center' }
        ],
        hoverrows: true,
        height: "100%",
        width:"auto",
        multiselect: true,//复选框
        viewrecords: true,//显示记录
        multiselect: true,//复选框
        pginput:true,
        pgtext: "第{0}页 / 共{1}页",
        loaduis: 'enable',
        rowNum:20,
        autoheight:true, //自动拉伸高度
        autowidth:true, //自动拉伸宽度
        pager: "#jqGridPager"
    });
};