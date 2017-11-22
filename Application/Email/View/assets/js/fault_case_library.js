/**
 * Created by BHZXZbaibing on 2017/5/18.
 */
var tableContent;
$(function () {

    //A1检查权限
    fault_case_library_check_auth();
    //表格创建
    fault_case_library_table();
    fault_case_search();


    $('#fault_case_export').click(function () {
        var selr = $('#jqGridList').getGridParam('selarrrow');
        if (selr.length == 0) {
            artDialog.alert('请选择一条或多条要导出的记录!');
            return false;
        }
        if (!isEmpty(selr)) {
            fileDownload("http://" + location.host + "/project/fault_case/export_fault_case?" + new Date(), {ids: selr});
        }
    })

});


//A1检查权限
function fault_case_library_check_auth() {
    if (auth.length != 0) {
        $('#fault_case_library_btn').html('');
        $.each(auth, function (index, dome) {
            var a = '';
            if (dome.type == 'select') {
                a = '<button type="button" class="btn btn-primary  fault_case_library_query" id="fault_case_library_query">' + dome.title + '</button>　';
            } else if (dome.type == 'export') {
                a = '<button type="button" class="btn btn-primary  fault_case_export" id="fault_case_export">' + dome.title + '</button>　';
            }
            $('#fault_case_library_btn').append(a);
        });
        //查询
        fault_case_library_query();
    }
}


function fileDownload(url, Params, isFileUrl) {
    if (isFileUrl) {
        artDialog.confirm("点击确定下载", function () {
            window.location.href = url;
        });
    } else {
        block("文件创建中...", 0);
        $.ajax({
            type: "post",
            dataType: "json",
            url: url,
            data: Params,
            cache: false,
            async: true,
            success: function (data) {
                if (data.status == 'error') {
                    artDialog.alert(data.info);
                    unblock();
                } else if (data.status == 'success') {
                    unblock();
                    artDialog.confirm("点击确定下载", function () {
                        window.location.href = data.url;
                    });
                    //block("<a href='"+data.url+"' onclick='unblock()'>点击下载</a>");
                }
            }, error: function (XMLHttpRequest, textStatus) {
                unblock();
                artDialog.alert("页面请求错误，请联系系统管理员！\n" + textStatus);
            }
        });
    }
}


//表格创建
function fault_case_library_table() {
    //计算表格高度及条数
    var heights = $('#sidebar').height() - 198;
    var jqTableH = heights - $('.headers').outerHeight(true);
    var tableNumber = Math.floor(jqTableH / 35) < 5 ? 5 : Math.floor(jqTableH / 35);
    //绘制表格
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    $("#jqGridList").jqGrid({
        url: "http://" + location.host + "/project/fault_case/index?" + new Date(),
        mtype: "GET",
        postData: {pid: pId, time: timeA, equipment_name: equipmentName, fault_name: faultName},
        styleUI: 'Bootstrap',
        datatype: "json",
        colModel: [

            {label: 'id', name: 'id', width: 150, hidden: true, align: 'center'},
            {label: 'file_ids', name: 'file_ids', width: 150, hidden: true, align: 'center'},
            {label: '单位名称', name: 'company_name', width: 150, align: 'center'},
            {label: '分厂名称', name: 'factory_name', width: 150, align: 'center'},
            {label: '装置名称', name: 'unit_name', width: 150, align: 'center'},
            {label: '设备名称', name: 'equipment_name', width: 150, align: 'center'},
            {label: '设备id', name: 'equipment_uuid', width: 150, hidden: true, align: 'center'},
            {label: '故障测点名称', name: 'fault_name', width: 150, align: 'center'},
            {label: '发现时间', name: 'start_time', width: 150, align: 'center'},
            {label: '故障描述', name: 'depict', width: 150, align: 'center'},
            {label: '最后更新时间', name: 'update_time', width: 150, align: 'center'},
            {label: '操作', width: 150, align: 'center', formatter: callbackfunc}
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
        ondblClickRow: function (rowId) {
            tableContent = jQuery("#jqGridList").jqGrid('getRowData', rowId);
            $('.modalWrap').html('');
            $.ajax({
                'url': './fault_case_library_details.html',
                "type": "GET",
                'success': function (data) {
                    $('.modalWrap').html(data);
                    //关联数据
                    $('#fault_name').val(tableContent.fault_name);
                    $('#factory_name').val(tableContent.factory_name);
                    $('#unit_name').val(tableContent.unit_name);
                    $('#equipment_name').val(tableContent.equipment_name);
                    $('#depict').val(tableContent.depict);
                    $('#start_time').val(tableContent.start_time);
                    $('#fault_case_library_details').modal('show');

                    $.ajax({
                        url: "http://" + location.host + "/project/fault_case/get_fault_case_file?" + new Date(),
                        type: "POST",
                        async: false,
                        data: {
                            id: tableContent.id
                        },
                        dataType: "json",
                        error: function () {

                        },
                        success: function (result) {
                            $.each(result, function (k, v) {
                                var add_file_html = '<div  id="' + v.f_id + '" class="item"> ' +
                                    '<div class="form-group clear"> ' +
                                    '<div class="col-lg-9">' +
                                    '<div class="oldfilename">' + v.oldfilename + '</div>' +
                                    '</div>' +
                                    '<button type="button" class="btn btn-default col-lg-1 file_remove" file_e="' + v.id + '" style="margin-right:5px">删除</button> ' +
                                    '<a href="javascript:void (0)" hrefs="' + v.filepath + '" class="btn btn-success col-lg-1  down_doc">下载</a>' +
                                    '</div>';
                                $('#defaultFid').append(add_file_html);
                            })
                            //删除
                            $('.file_remove').unbind().bind('click', function () {
                                $(this).parents('.item').remove();
                            });
                            //下载
                            $('.down_doc').click(function () {
                                var hrefs = $(this).attr('hrefs');
                                var file_name = $(this).parent().children('div').children('div').text();
                                $.ajax({
                                    url: "http://" + location.host + "/search/index/down_doc?" + new Date(),
                                    type: "POST",
                                    data: {'hrefs': hrefs, 'file_name': file_name},
                                    beforeSend: function (request) {
                                    },
                                    success: function (result) {
                                        if (result.status == 'success') {
                                            window.location.href = result.url;
                                        } else {
                                            block(result.info, 1000);
                                        }
                                    }
                                });
                            });
                        }
                    });
                }
            });
        },
        loadComplete: function () {
            pId = '';
            timeA = '';
            equipmentName = '';
            faultName = '';
        },
        gridComplete: function (rowid) {

            $('.historyData').unbind().bind('click', function () {
                var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
                if (userAgent.toUpperCase().indexOf("MSIE") <= -1 && userAgent.indexOf("Trident/7.0") <= -1 && userAgent.indexOf("Edge") <= -1 )  {
                    block('该功能只能在ie下使用!', 2000);
                }else{
                    var equipmentUuid = $(this).attr('equipmentId');
                    startTime = $(this).attr('startTime');
                    endTime = $(this).attr('endTime');
                    $.ajax({
                        url: "http://" + location.host + "/project/fault_case/get_equipment_info?" + new Date(),
                        type: "POST",
                        data: {
                            'equipmentUuid': equipmentUuid
                        },
                        dateType: "josn",
                        success: function (result) {
                            astrCompany = result.companyId;
                            astrFactory = result.factoryId;
                            astrPlant = result.equipmentId;
                            if(clientNm == 1){
                                G_oObject.SwitchPlant4(astrCompany, astrFactory, astrPlant, "报警查询", startTime, endTime);
                            }
                            $('#monitor').find('a').click();
                        }
                    });

                }

            });
        }
    });
}

function callbackfunc(cellvalue, options, rowObject) {
    var temp = "<a href='javascript:void(0);' class='historyData' equipmentId='" + rowObject.equipment_uuid + "' startTime='" + rowObject.start_time + "' endTime='" + rowObject.end_time + "'>监测分析</a>";
    return temp;
}

function fault_case_search() {
    /*var factory_name =  $('#factory_name').val();
    var equipment_name =  $('#equipment_name').val();
    var fault_name =  $('#fault_name').val();*/
    $.ajax({
        'url': "http://" + location.host + "/project/fault_case/search_info?" + new Date(),
        'type': "GET",
        /*'data':{
            'factory_name':factory_name,
            'equipment_name':equipment_name,
            'fault_name':fault_name
        },*/
        'async': true,
        'dataType': "json",
        'success': function (data) {
            $('#factory_name').typeahead({source: data.factory, items: 100});
            $('#equipment_name').typeahead({source: data.equipment, items: 100});
            $('#fault_name').typeahead({source: data.fault, items: 100});
        }
    });


}

//查询
function fault_case_library_query() {
    $('.fault_case_library_query').unbind().bind('click', function () {
        // var searchData = serializeForm('commentForm');
        var factory_name = $('#fault_case_library_search #factory_name').val();
        var equipment_name = $('#fault_case_library_search #equipment_name').val();
        var fault_name = $('#fault_case_library_search #fault_name').val();
        var oldfilename = $('#fault_case_library_search #oldfilename').val();

        var searchData = {
            'factory_name': factory_name,
            'equipment_name': equipment_name,
            'fault_name': fault_name,
            'oldfilename': oldfilename
        };
        $('#fault_case_library_query').modal('hide');
        $("#jqGridList").jqGrid('setGridParam',
            {
                url: "http://" + location.host + "/project/fault_case/index?" + new Date(),
                datatype: 'json',
                postData: searchData,
                page: 1
            }).trigger("reloadGrid");
        /*$('.modalWrap').html('');
        $.ajax({
            'url': './fault_case_library_query.html',
            "type": "GET",
            'success': function (data) {
                $('.modalWrap').html(data);
                $('#fault_case_library_query').modal('show');
                $('#searchBtn').click(function () {

                })
            }
        });*/
    });
}
