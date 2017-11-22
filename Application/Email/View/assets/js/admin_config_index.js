/**
 * js   系统管理>配置管理
 * menu   dingyingcheng
 * date   2017-05-10
 */
var config_param_id = '';
var config_edit_id = '';
$(function(){
    var heights = $('#sidebar').height()  - 124;
    var jqTableH = heights - $('.headers').outerHeight(true);
    $('#config_index_index').height(jqTableH);
    //表格创建
    get_interface_config_info();
    //导航按钮事件
    headersNav();

    $("#config_index_index").mCustomScrollbar({
        live:true,
        theme:"minimal"
        //scrollInertia:0
    });
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
function  get_interface_config_info() {
    //f1--页面初始化
        //绘制表格
        $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
        var heights = $('#sidebar').height() - 198;
        var jqTableH = heights - $('.headers').outerHeight(true);
        var tableNumber = Math.floor(jqTableH / 35) < 5 ? 5 : Math.floor(jqTableH / 35);
        $("#jqGridList").jqGrid({
            url: "http://" + location.host + "/admin/config/get_interface_config_info?" + new Date(),
            mtype: "GET",
            styleUI: 'Bootstrap',
            datatype: "json",
            colModel: [
                {label: 'uid', name: 'uid', key: true, hidden: true, width: 10, align: 'center'},
                {label: '接口名称', name: 'name', width: 50, align: 'center'},
                //{ label: '密码', name: 'pass', width: 150,align : 'center' },
                {label: '接口地址', name: 'address',width: 150, align: 'left'},
                {label: '参数', name: 'param', width: 150, align: 'center'},
                { label:'操作', name: 'action', width: 60,align : 'center' }
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
            }
        });
}
//菜单--新增页面渲染
function config_add(){
    $('.modalWrap').html('');
    $.ajax({
        'url': './admin_config_add.html',
        "type": "get",
        async: false,
        'success':function (data) {
            $('.modalWrap').html(data);
            $('#config_add').modal('show');
        }
    });
}
//配置参数--访问
function interface_param(interface_param_id){
    $('.modalWrap').html('');
    $.ajax({
        'url': './admin_config_param.html',
        "type": "get",
        'success':function (data) {
            $('.modalWrap').html(data);
            $('#config_param').modal('show');
            config_param_id = interface_param_id;
        }
    });
}
//配置--修改
function interface_edit(interface_edit_id){
    $('.modalWrap').html('');
    $.ajax({
        'url': './admin_config_edit.html',
        "type": "get",
        'success':function (data) {
            $('.modalWrap').html(data);
            $('#config_edit').modal('show');
            config_edit_id = interface_edit_id;
        }
    });
}

//配置--删除
function interface_delete(interface_id){
    art.dialog.confirm('确定要删除选中的记录?', function () {
        var url = "http://"+location.host+"/admin/Config/config_del?"+new Date();
        $.post(url, {id:interface_id}, function (data) {
            if(data.code == 'errror'){
                block(data.msg,2000);
            }else{
                block(data.msg,2000);
                navAjax('./admin_config_index.html');
            }
        });
    });

}