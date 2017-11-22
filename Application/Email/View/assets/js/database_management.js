/**
 * Created by BHZXZbaibing on 2017/5/19.
 */
/**
 * Created by BHZXZbaibing on 2017/5/9.
 */
var database_edit_id;
var headersText;
$(function () {

    //A1检查权限
    database_management_check_auth();

    //上传数据库
    database_management_add();

    //表格创建
    database_management_tableEvent();

    //导航按钮事件
    headersNav();
    //编辑
    database_management_edit();
    database_delete();


});

//A1检查权限
function  database_management_check_auth(){
    if (auth.length != 0) {
        $('#database_management_btn').html('');
        $.each(auth, function (index, dome) {
            var a = '';
            if (dome.type == 'add') {
                a = '<button type="button" class="btn btn-primary  database_add" id="database_add">'+dome.title+'</button>　';
            } else if (dome.type == 'edit') {
                a = '<button type="button" class="btn btn-primary  database_edit" id="database_edit">'+dome.title+'</button>　';
            }else if (dome.type == 'delete') {
                a = '<button type="button" class="btn btn-primary  database_del" id="database_del">'+dome.title+'</button>　';
            }
            $('#database_management_btn').append(a);
        });
    }
}

//导航按钮事件
function headersNav() {
    $('.headers ul li a').unbind().bind('click', function () {
        $(this).parents('li').siblings().find('i').remove();
        $(this).append('<i></i>');
        headersText = $(this).text()
        $("#jqGridList").jqGrid('setGridParam',
            {
                datatype: 'json',
                postData: {dataText: headersText},
                page: 1
            }).trigger("reloadGrid");
    });
    $('.headers ul li a').eq(0).trigger('click');
}

//表格创建
function database_management_tableEvent() {
    //计算表格高度及条数
    var heights = $('#sidebar').height()  - 198;
    var jqTableH = heights - $('.headers').outerHeight(true);
    var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35) ;
    //绘制表格
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    $("#jqGridList").jqGrid({
        url: "http://" + location.host + "/project/project_database/index?" + new Date(),
        mtype: "GET",
        styleUI: 'Bootstrap',
        datatype: "json",
        colModel: [
            {label: 'id', name: 'id', width: 150, hidden:true, align: 'center'},
            {label: 'database_sum', name: 'database_sum', width: 150,'hidden':true, align: 'center'},
            {label: '数据库名称', name: 'database_name', width: 150, align: 'center'},
            {label: 'IP地址', name: 'server_ip', width: 150, align: 'center'},
            {label: '端口', name: 'server_port', width: 120, align: 'center'},
            {label: '当前进度', name: 'percent', width: 120, align: 'center'},
            {label: '当前状态', name: 'state', width: 100, align: 'center'},
            // {label: '大小', name: 'database_size', width: 150, align: 'center'},
            // {label: '大事记', name: 'is_memorabilia', width: 80, align: 'center'},
            {label: '上传人', name: 'true_name', width: 150, align: 'center'},
            {label: '上传时间', name: 'create_time', width: 150, align: 'center'}
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
                modify = '<div class="progress progress-striped col-sm-12" style="margin:0;padding: 0;width: 95%;height: 18px;"> ' +
                    '<div class="percent" style="    position: relative; z-index: 999;display: inline-block;line-height: 18px;">'+rowDatas[i].percent+'%</div> ' +
                    '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="'+rowDatas[i].percent+'" aria-valuemin="0" aria-valuemax="100" style="width: '+rowDatas[i].percent+'%; -webkit-animation: progress-bar-stripes 2s linear infinite;   animation: progress-bar-stripes 2s linear infinite;position: absolute;left: 0;top: 0;">' +
                    '</div>' +
                    '</div>';

                jQuery("#jqGridList").jqGrid("setRowData", id, { percent: modify});
            }
        }
    });
}

//上传数据库
function database_management_add() {

    $('.database_add').unbind().bind('click', function () {
        file_type = 'database';
        $('#server_side_page').html('');

        var url = './project_server_upload.html';

        $.ajax({
            url: url, //这里是静态页的地址
            type: "GET", //静态页用get方法，否则服务器会抛出405错误
            dataType:'html',
            success: function (html) {
                $('#server_side_page').html(html);
                $('#home_page').hide();
                $('#server_side_page').show();

                //返回操作
                $('.btn-theme04').bind('click',function(){
                    $('#server_side_page').hide();
                    $('#home_page').show();
                });
            }
        });
    });
}
//编辑
function database_management_edit() {

    $('.database_edit').unbind().bind('click', function () {

        var ids  = jQuery("#jqGridList").jqGrid('getGridParam','selarrrow');

        if (ids.length == 1) {

            var rowData = $("#jqGridList").jqGrid('getRowData',ids);

            $('.modalWrap').html('');
            $.ajax({
                'url': './database_edit.html',
                "type": "GET",
                'success': function (data) {
                    $('.modalWrap').html(data);
                    $('#cname').val(rowData.database_name);
                    // $('#cemail').val(rowData.project_name);
                    $('#ccomment').val(rowData.database_sum);
                    /*if(rowData.is_memorabilia == '是'){
                        $('#inlineCheckbox3').prop('checked',true);
                    }*/
                    /*var optionHtml = ''
                    $.ajax({
                        url: "http://" + location.host + "/project/project_database/get_user?" + new Date(),
                        type: "POST",
                        data:{'project_name':rowData.project_name},
                        dataType: "json",
                        async: false,
                        success: function (data) {
                            var numbs = 0;
                            optionHtml += '<option value="-1">请选择</option>';
                            $.each(data,function(k,v){

                                if(v.true_name == rowData.database_user_name){

                                    numbs = v.uid;

                                }

                                optionHtml += '<option value="'+v.uid+'">'+ v.true_name +'</option>';

                            });
                            $('#curl').html(optionHtml);

                            $("#curl option[value='"+numbs+"']").attr("selected","selected");

                        }
                    })*/

                    /*$('#cemail').bind("change", function() {
                        var vals =  $(this).val();
                        var optionHtml = ''
                        $.ajax({
                            url: "http://" + location.host + "/project/project_database/get_user?" + new Date(),
                            type: "POST",
                            data:{'project_name':vals},
                            dataType: "json",
                            async: false,
                            success: function (data) {
                                optionHtml += '<option value="">请选择</option>';
                                $.each(data,function(k,v){
                                    optionHtml += '<option value="'+v.uid+'">'+ v.true_name +'</option>';
                                });
                                $('#curl').html(optionHtml);
                            }
                        })
                    });*/
                    $('#technicalEditModal').modal('show');
                    $('#addSave').unbind('click').bind('click',function () {
                        var baseName  = $('#cname').val();
                        var projectName  = $('#cemail').val();
                        var relatedPerson  = $('#curl').val();
                        var relatedPersonname  = $('#curl option:selected').text();
                        var comment  = $('#ccomment').val();
                        var options  = $('#inlineCheckbox3').prop('checked') == true? 1 : null;
                        $.ajax({
                            url: "http://" + location.host + "/project/project_database/update?" + new Date(),
                            type: "POST",
                            data:{'id':rowData.id,'database_name':baseName,'project_name':projectName,'database_user':relatedPerson,'database_user_name':relatedPersonname,'database_sum':comment,'source_adds':original_file_url,'target_adds':object_file_url,'is_memorabilia':options},
                            dataType: "json",
                            async: false,
                            success: function (data) {
                                block(data.message,1000);
                                if(data['code']<400) {
                                    $("#jqGridList").jqGrid('setGridParam', {
                                        datatype: 'json',
                                        postData: {dataText: headersText},
                                        page: 1
                                    }).trigger("reloadGrid");
                                }
                                $('#technicalEditModal').modal('hide');
                            }
                        });

                    });
                }
            });
        }else{
            art.dialog({
                content: '请选择一条数据！',
                ok: function () {
                },
                cancelVal: '关闭',
                cancel: true //为true等价于function(){}
            }).time(3);
        }

    })
}
//删除
function database_delete() {
    $('#database_del').click(function () {
        var row = $("#jqGridList").jqGrid('getGridParam','selarrrow');
        if(row.length == 0)
        {
            artDialog.alert("请选择一条要删除的数据库管理记录！");
            return false;
        }
        else if(row.length > 1){
            artDialog.alert("只能选择一条要删除的数据库管理记录！");
            return false;
        }

        var database_del_id = row[0];
        if(database_del_id){
            $.post(
                "http://" + location.host + "/project/project_database/delete?" + new Date(),
                {'id':database_del_id},
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
        }
    })

}
