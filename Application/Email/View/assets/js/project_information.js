/**
 * Created by BHZXZbaibing on 2017/5/9.
 */
var BHXZ_PROJECT = {
    'group_name': '某集团',
    'company_name': '中国空气动力研究与发展中心',
    'project_details':'',//项目id
    'project_name':'',//项目名称
    'project_satge':'',//项目阶段
    'project_task':'',//任务阶段
    'project_parent':'',//文件id对应的任务
    'project_task_name':''//任务阶段名称
};
var project_edit_id;
var childGridID;
var headersText = '';
var childGridIDRow,jqGridListRow,powerId;
$(function () {
    if (auth.length != 0) {
        $('.tableBtn').html('');
        var a = '';
        $.each(auth, function (index, dome) {
            if (dome.type == 'add') {
                a += '<button type="button" class="btn btn-primary project_add" id="project_add">新增</button>';
            }else if (dome.type == 'delete') {
                a += '<button type="button" class="btn btn-primary project_del" id="project_del">删除</button>';
            } else if (dome.type == 'edit') {
                a += '<button type="button" class="btn btn-primary project_edit" id="project_edit">编辑</button>';
            } else if (dome.type == 'create') {
                a += '<button type="button" class="btn btn-primary project_close" id="project_close" value="">关闭项目</button>';
            }
        });
        $('.tableBtn').append(a);
    }

    //新增用户方法
    project_add();


    //表格创建
    tableEvent();

    //删除
    project_del();

/*    //新增子项目
    subproject_add();*/

    //导航按钮事件
    headersNav();

});
//导航按钮事件
function headersNav() {

    $('.headers ul li a').unbind().bind('click', function () {

        $(this).parents('li').siblings().find('i').remove();
        $(this).append('<i></i>');
        headersText = $(this).text();

        $("#jqGridList").jqGrid('setGridParam',
            {
                datatype: 'json',
                postData: {dataText: headersText,pId:''},
                page: 1
            }).trigger("reloadGrid");
    });

    if(gisIndex == -1){
        $('.headers ul li a').eq(0).trigger('click');
    }else{
        $('.headers ul li a').eq(gisIndex).click();
        gisIndex = -1;
        gisType = '';
    }
}

//表格创建
function tableEvent() {
    //计算表格高度及条数
    var heights = $('#sidebar').height()  - 198;
    var jqTableH = heights - $('.headers').outerHeight(true);
    var tableNumber = Math.floor(jqTableH/37) < 5 ? 5 : Math.floor(jqTableH/37) ;

    //绘制表格
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    $("#jqGridList").jqGrid({
        url: "http://" + location.host + "/project/project_information/index?" + new Date(),
        mtype: "GET",
        postData: {pId: parentId || pId  ||'',dataText:gisType},
        styleUI: 'Bootstrap',
        datatype: "json",
        colModel: [
            {label: 'id', name: 'id', width: 150, 'align': 'center','hidden':true},
            {label: 'is_close', name: 'is_close', width: 150, 'align': 'center','hidden':true},
            {label: '项目名称', name: 'project_name', width: 150, 'align': 'center'},
            {label: '项目类型', name: 'project_type', width: 150, 'align': 'center'},
            {label: '项目负责人', name: 'true_name', width: 150, 'align': 'center'},
            {label: '项目开始时间', name: 'project_starttime', width: 150, 'align': 'center'},
            {label: '项目结束时间', name: 'project_endtime', width: 150, 'align': 'center'},
            {label: '项目进度', name: 'project_per', width: 150, 'align': 'center'},
            {label: '当前阶段', name: 'project_state', width: 150, 'align': 'center'},
            {label: '获奖情况', name: 'win', width: 100, 'align': 'center'},
            {label: '重要度', name: 'project_import', width: 100, 'align': 'center'},
            {label: '操作', name: 'details', width: 120, 'align': 'center','title':false}
        ],
        // hoverrows: true,
        height: jqTableH,
        width: "auto",
        multiselect: true,//复选框
        viewrecords: true,//显示记录
        pginput: true,
        pgtext: "第{0}页 / 共{1}页",
        loaduis: 'enable',
        rowNum: tableNumber,
        autoheight: true, //自动拉伸高度
        autowidth: true, //自动拉伸宽度
        pager: "#jqGridPager",
        gridComplete: function (rowid) {
            var ids = jQuery("#jqGridList").jqGrid("getDataIDs");
            var rowDatas = $("#jqGridList").jqGrid('getRowData', rowid);

            var modify = "";
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                    modify = '<div class="progress progress-striped col-sm-12" style="margin:0;padding: 0;width: 95%;"> ' +
                        '<div class="percent" style="position: absolute;right: 0;top:2px;z-index: 999;">'+rowDatas[i].project_per+'%</div> ' +
                        '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="'+rowDatas[i].project_per+'" aria-valuemin="0" aria-valuemax="100" style="width: '+rowDatas[i].project_per+'%; -webkit-animation: progress-bar-stripes 2s linear infinite;   animation: progress-bar-stripes 2s linear infinite;position: absolute;left: 0;top: 0;">' +
                        '</div>' +
                        '</div>';

                jQuery("#jqGridList").jqGrid("setRowData", id, { project_per: modify});
            }

            //新增用户方法
            project_add();

            if(onOf == true) {

                $('#jqGridList tbody a').click();

                onOf = false;

            }

            //编辑
            project_edit();

            //关闭
            projectClose();
        },
        'onSelectRow':function(){
            var ids  = jQuery("#jqGridList").jqGrid('getGridParam','selarrrow');

            var rowState = $("#jqGridList").jqGrid('getRowData', ids).project_state;
            var isClose = $("#jqGridList").jqGrid('getRowData', ids).is_close;
            $('#project_close').val(isClose);
            if(ids.length > 1 || ids.length == 0){
                $('#project_close').html('关闭项目');
            }else{
                if(rowState == '关闭'){
                    $('#project_close').html('重启项目');
                }
            }



        }
    });
}

//获取该用户此项目权限
function get_power(id){

    $.ajax({
        url:"http://"+location.host+"/project/project_details/get_power?"+new Date(),
        type:"POST",
        data:{
            'id':id
        },
        dateType:"josn",
        async:false,
        success:function (result) {
            powerId = result.power;
        }
    });
}

//新增
function project_add() {
    $('.project_add').unbind().bind('click', function () {
        $('.modalWrap').html('');
        $.ajax({
            'url': './project_add.html',
            "type": "GET",
            'success': function (data) {
                $('.modalWrap').html(data);
                $('#projectAddModal').modal('show');
            }
        });
    })
}
//编辑
function project_edit() {

    $('.project_edit').unbind().bind('click', function () {

        var ids  = jQuery("#jqGridList").jqGrid('getGridParam','selarrrow');

        jqGridListRow = $("#jqGridList").jqGrid('getGridParam', 'selrow');

        project_edit_id = jqGridListRow;

        if(ids.length > 1 || ids.length == 0){
            block("请选择一个项目！",1000);
        }else{

            get_power(project_edit_id);

            $('.modalWrap').html('');
            $.ajax({
                'url': './project_edit.html',
                'type': 'GET',
                'success': function (data) {
                    $('.modalWrap').html(data);
                    if(powerId != 1){
                        $('#addSave').hide();
                    }
                    $('#projectEditModal').modal('show');
                }
            });

        }


    })
}

function project_del() {
    $('.project_del').unbind().bind('click', function () {
        var project_del_id = $("#jqGridList").jqGrid('getGridParam', 'selrow') ? $("#jqGridList").jqGrid('getGridParam', 'selrow'): $("#" + childGridID).jqGrid('getGridParam', 'selrow');
        var ids  = jQuery("#jqGridList").jqGrid('getGridParam','selarrrow');
        if (ids.length == 1) {

            get_power(project_del_id);

            if(powerId != 1){
                block("您没有删除该项目的权限！",1000);
            }else{
                art.dialog({
                    content: '是否删除此条记录！',
                    icon: 'warning',
                    ok: function () {
                        $.post(
                            "http://" + location.host + "/project/project_information/delete?" + new Date(),
                            {'id':project_del_id},
                            function (data) {
                                block(data.message,1000);
                                if(data['code']<400) {
                                    $("#jqGridList").jqGrid('setGridParam', {
                                        datatype: 'json',
                                        postData: {dataText: headersText},
                                        page: 1
                                    }).trigger("reloadGrid");
                                }
                            }
                        );
                    },
                    cancelVal: '取消',
                    cancel: true //为true等价于function(){}
                });

            }

        }else{
            block("请选择一个项目！",1000);
        }

    })
}
//新增子项目
function subproject_add() {

    $('.subproject_add').unbind().bind('click', function () {

        var idr  = jQuery("#" + childGridID).jqGrid('getGridParam','selarrrow');

        var ids  = jQuery("#jqGridList").jqGrid('getGridParam','selarrrow');

        jqGridListRow = $("#jqGridList").jqGrid('getGridParam', 'selrow');

        childGridIDRow =  $("#" + childGridID).jqGrid('getGridParam', 'selrow');

        project_edit_id = jqGridListRow ? jqGridListRow : childGridIDRow;
        var len = 0;
        if (idr == undefined){
            len = 0;
        }else {
            len = idr.length;
        }

        if(len + ids.length > 1 || len + ids.length == 0) {
            block("请选择一个项目！",1000);
        }else{

            var rowDatar = $("#" + childGridID).jqGrid('getRowData', idr).parent_pro;
            var rowDatas = $("#jqGridList").jqGrid('getRowData', ids).id;
            var projectName = $("#jqGridList").jqGrid('getRowData', ids).project_name;

            if (rowDatar != undefined) {
                art.dialog({
                    content: '请选择一个父项目！',
                    ok: function () {
                    },
                    cancelVal: '关闭',
                    cancel: true //为true等价于function(){}
                });

            } else {
                $('.modalWrap').html('');
                $.ajax({
                    'url': './project_add.html',
                    "type": "GET",
                    'success': function (data) {
                        $('.modalWrap').html(data);
                        $('#parent_pro_div').show();
                        $('#parent_yn').val(1);
                        $('#parent_pro').val(rowDatas);
                        $('#parent').val(projectName);
                        $('#projectAddModal').modal('show');
                    }
                });

            }
        }
    })
}

//关闭
function projectClose(){
    $('.project_close').unbind().bind('click',function(){
        var ids  = jQuery("#jqGridList").jqGrid('getGridParam','selarrrow');

        var rowId = $("#jqGridList").jqGrid('getRowData', ids).id;

        var rowState = $("#jqGridList").jqGrid('getRowData', ids).project_state;

        if(rowState == '关闭'){

            $('#project_close').html('重启项目');
            
        }

        if(ids.length > 1 || ids.length == 0){
            block("请选择一个项目！",1000);
        }else{
            var contents =  $('#project_close').html();
            art.dialog({
                title: '消息',
                content: '是否'+contents+'！',
                icon: 'warning',
                ok: function(){
                    $.ajax({
                        url: "http://" + location.host + "/project/project_details/close_project?" + new Date(),
                        type: "POST",
                        async: false,
                        data: {id:rowId, close: $('#project_close').val()},
                        dataType: "json",
                        success: function (result) {
                            block(result.message, 1000);
                            if (result.code < 400) {
                                $("#jqGridList").jqGrid('setGridParam',
                                    {
                                        datatype: 'json',
                                        postData: {dataText: headersText},
                                        page: 1
                                    }).trigger("reloadGrid");

                                $('#project_close').html('关闭项目');
                            }
                        },
                        error: function (XMLHttpRequest, textStatus) {
                            artDialog.alert("页面请求错误，请联系系统管理员！\n" + textStatus);
                        }

                    })
                },
                cancelVal: '取消',
                cancel: true //为true等价于function(){}
            });
         }

    })
}
function ViewProjectInformation(id) {
    BHXZ_PROJECT.project_details = id;

    var url = './project_details.html';

    get_power(id);

    jumpPageAjax(url);
}