/**
 * js   系统管理>操作日志管理
 * user   dingyingcheng
 * date   2017-05-10
 */
var table_id = '';//表名+id
$(function(){
    //A1--检查权限
    check_auth();
    //f1--操作日志管理--页面初始化
    tableEvent();
    //f2--导航按钮事件
    headersNav();
});
//A1--检查权限
function check_auth(){
    if (auth.length != 0) {
        $.each(auth, function (index, dome) {
            var a = '';
            if (dome.type == 'select') {
                a = '<button type="button" class="btn btn-primary  action_log_cha" id="action_log_cha" onclick="action_log_cha()">'+dome.title+'</button>';
            }
            $('.tableBtn').append(a);
        });
    }
}
//f1--操作日志管理--页面初始化
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
//f2--导航按钮事件
function  tableEvent() {
    //绘制表格
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var heights = $('#sidebar').height()  - 198;
    var jqTableH = heights - $('.headers').outerHeight(true);
    var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35);

    $("#jqGridList").jqGrid({
        url: "http://"+location.host+"/admin/action_log/get_actionLog_infos?"+new Date(),
        mtype: "GET",
        styleUI : 'Bootstrap',
        datatype: "json",
        colModel: [
            { label: 'id', name: 'id',hidden:true,width: 150 ,align : 'center'},
            // { label: '项目名称', name: 'project_name', width: 150 ,align : 'center'},
            { label: '模块名称', name: 'model_name', width: 150,align : 'center' },
            { label: '子模块名称', name: 'child_name', width: 150,align : 'center' },
            { label:'操作类型', name: 'change_name', width: 150,align : 'center' },
            { label:'修改人', name: 'user_name', width: 150,align : 'center' },
            //{ label:'操作前', name: 'before_action', width: 150,align : 'center' },
            //{ label:'操作后', name: 'after_action', width: 150,align : 'center' },
            { label:'IP', name: 'ip', width: 150,align : 'center' },
            { label:'修改时间', name: 'update_time', width: 150,align : 'center'},
            { label:'操作', name: 'mqsql',hidden:true, width: 150,align : 'center' },
            { label:'详情', name: 'show', width: 150,align : 'center' }

        ],
        hoverrows: true,
        height: jqTableH,
        width:"auto",
        viewrecords: true,//显示记录
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
}
//action--查询--操作日志管理
function action_log_cha(){
        $('.modalWrap').html('');
        $.ajax({
            'url': './admin_actionLog_cha.html',
            "type": "get",
            'success':function (data) {
                $('.modalWrap').html(data);
                $('#action_log_search').modal('show');
            }
        });
}


function action_log_detail(id_table){
    $('.modalWrap').html('');
    $.ajax({
        'url': './admin_actionLog_detail.html',
        "type": "get",
        'success':function (data) {
            $('.modalWrap').html(data);
            $('#action_log_detail').modal('show');
            table_id = id_table;
        }
    });
}

