/**
 * model:设备管理--测点统计
 * Created by BHZXZbaibing on 2017/5/22.
 */
var d = new Date();
var times = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
var timer = d.getFullYear()+"-"+(d.getMonth())+"-"+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
var page = 1;

$(function(){
    //获取测点状态的测点的总数
    get_point_count();
    //A1设备管理--测点统计--检查权限
    point_check_auth();

    //初始化表格
    survey_point_statistics_tableEvent();

    survey_btn();
});
//获取测点状态的测点的总数
function get_point_count(){
    $.ajax({
        url: "http://" + location.host + "/equipment/point/get_point_count?" + new Date(),
        type: "POST",
        dataType: "json",
        error: function () {
        },
        success: function (data) {
            $('#survey_point_statistics .headers h2 span').html('( 共有 ' + data + ' 测点 )')
        }
    });
};
//A1设备管理--测点统计--检查权限
function  point_check_auth(){
    if (auth.length != 0) {
        $('#point_auth_btn').html('');
        $.each(auth, function (index, dome) {
            var btn = '';
            if (dome.type == 'select') {
                bun = '<button type="button" class="btn btn-warning point_select" id="" onclick="point_select()">'+dome.title+'</button>　';
            } else if (dome.type == 'export') {
                bun = '<button type="button"  class="btn btn-info point_export"  id="" onclick="point_export()">'+dome.title+'</button>　';
            }
            $('#point_auth_btn').append(bun);
        });
    }
}

//初始化表格
function survey_point_statistics_tableEvent(){
    //计算表格高度及条数
    var heights = $('#sidebar').height()  - 198;
    var jqTableH = heights - $('.headers').outerHeight(true);
    var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35) ;

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var childGridURL = "http://" + location.host + "/equipment/point/get_point_infos?" + new Date();

    $("#jqGridList").jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        styleUI: 'Bootstrap',
        postData: {stateType:0},
        page: 1,
        colModel: [
            {label: 'equipmentUuid', name: 'equipmentUuid', width: 150, align: 'center','hidden':true},
            {label: 'pointUuid', name: 'pointUuid', width: 150, align: 'center','hidden':true},
            {label: '单位名称', name: 'companyName', width: 150, align: 'center'},
            {label: '分厂名称', name: 'factoryName', width: 150, align: 'center'},
            {label: '装置名称', name: 'unitName', width: 150, align: 'center'},
            {label: '设备名称', name: 'equipmentName', width: 150, align: 'center'},
            // {label: '设备类型', name: 'equipment_type_name', width: 120, align: 'center'},
            // {label: '设备编号', name: 'equipment_id', width: 150, align: 'center'},
            {label: '测点名称', name: 'aliasName', width: 150, align: 'center'},
            {label: '当前值', name: 'val', width: 100, align: 'center'},
            {label: '高限', name: 'hl', width: 100, align: 'center'},
            {label: '高高限', name: 'hh', width: 100, align: 'center'},
            {label: '下限', name: 'lh', width: 100, align: 'center'},
            {label: '下下限', name: 'll', width: 100, align: 'center'},
            {label: '单位', name: 'unit', width: 100, align: 'center'},
            {label: '报警方式', name: 'alarmType', width: 100, align: 'center','hidden':true},
            {label: '测点状态', name: 'alarmAlias', width: 100, align: 'center'},
            {label: '更新时间', name: 'updateTime', width: 150, align: 'center'},
            /*{label: '报警操作', name: 'alarm_alias', width: 150, align: 'center'},
             {label: '报警记录', name: 'alarm_alias', width: 150, align: 'center'},
             {label: '原因', name: 'alarm_alias', width: 150, align: 'center'}, */
            {label: 'alarmStatus', name: 'alarmStatus', width: 150, align: 'center','hidden':true}
        ],
        dataTypes: "json",
        styleUIs: 'Bootstrap',
        viewrecords: true,
        multiselect: false,
        rownumbers: false,
        autoheight: true, //自动拉伸高度
        autowidth: true, //自动拉伸宽度
        number: true, //显示行号
        autoScroll: true,
        pgtext: "第{0}页 共{1}页",
        loadui: 'enable',
        height: jqTableH,
        width: "100%",
        rowNum:tableNumber,
        pager: "#jqGridPager",
        gridComplete: function (rowid) {
            page = $('#jqGridList').getGridParam('page');
            var ids = jQuery("#jqGridList").jqGrid("getDataIDs");
            var rowDatas =$("#jqGridList").jqGrid('getRowData', rowid);
            var modify = "";
            var alarmType = '';
            var lines = '--'
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                if (rowDatas[i].alarmStatus == 1) {
                    modify = '<span class="label label-danger label-mini">' + rowDatas[i].alarmAlias + '</span></i>';
                } else if (rowDatas[i].alarmStatus == 2) {
                    modify = '<span class="label label-warning label-mini">' + rowDatas[i].alarmAlias + '</span>';
                } else if (rowDatas[i].alarmStatus == 3) {
                    modify = '<span class="label label-success label-mini">' + rowDatas[i].alarmAlias + '</span>';
                } else if (rowDatas[i].alarmStatus == 4) {
                    modify = '<span class="label label-primary label-mini">' + rowDatas[i].alarmAlias + '</span>';
                } else if (rowDatas[i].alarmStatus == 5) {
                    modify = '<span class="label label-default label-mini">' + rowDatas[i].alarmAlias + '</span> ';
                } else if (rowDatas[i].alarmStatus == 6) {
                    modify = '<span class="label label-default label-mini">' + rowDatas[i].alarmAlias + '</span> ';
                } else {
                    modify = '--';
                }

                jQuery("#jqGridList").jqGrid("setRowData", id, {alarmAlias: modify});

                if (rowDatas[i].alarmType == 0) {

                    alarmType = '低通';

                    jQuery("#jqGridList").jqGrid("setRowData", id, {lh: lines});

                    jQuery("#jqGridList").jqGrid("setRowData", id, {ll: lines});

                }
                else if (rowDatas[i].alarmType == 1) {

                    alarmType = '高通';

                    jQuery("#jqGridList").jqGrid("setRowData", id, {hl: lines});

                    jQuery("#jqGridList").jqGrid("setRowData", id, {hh: lines});


                }
                else if (rowDatas[i].alarmType == 2) {
                    alarmType =  '带通';
                }
                else if (rowDatas[i].alarmType == 3) {
                    alarmType =  '带阻';
                }

                jQuery("#jqGridList").jqGrid("setRowData", id, {alarmType: alarmType});

                if(rowDatas[i].unit == ''){

                    jQuery("#jqGridList").jqGrid("setRowData", id, {unit: lines});

                }
            }

        },

/*        ondblClickRow: function (val, rowid) {

            var rowDatas = $("#jqGridList").jqGrid('getRowData', rowid);

            //绘制弹窗
            $('.modalWrap').html('');
            $.ajax({
                url: './pop_chart.html',
                type: "GET",
                dataType: 'html',
                success: function (data) {
                    $('.modalWrap').html(data);

                    var parameters ={
                        equipment_uuid:rowDatas.equipment_uuid,
                        point_uuid:rowDatas.point_uuid,
                        alarm_status:rowDatas.alarm_status
                    }

                    ajaxData(parameters);

                    Onclick(parameters);

                    $('#technicalEditModal').modal('show');
                }
            });
        }//双击*/
    });

}


//action--1--设备管理--测点统计--查询
function point_select(){
    artDialog.alert("测点统计--查询！");
    return false;
}
//action--2--设备管理--测点统计--导出
function point_export(){
    artDialog.alert("测点统计--导出！");
    return false;
}
//弹窗查询
function Onclick (val){
    $('#btnTime').unbind().bind('click',function(){
        if(!$(this).hasClass('disabled')){
            var start = $(this).parents().find('#mirror_field').val();
            var End = $(this).parents().find('#mirror_fields').val();
            if(End != '' && start != ''){
                var parameters = {start:start,End:End,equipment_uuid:val.equipment_uuid, point_uuid:val.point_uuid,alarm_status:val.alarm_status};
                $(this).addClass('disabled');
                ajaxData(parameters);
            }else{
                art.dialog({
                    content: '请选择时间！',
                    ok: function () {
                    },
                    cancelVal: '关闭',
                    cancel: true //为true等价于function(){}
                }).time(3);
            }
        }
    })
}

//绘制趋势图
function ajaxData(parameters){

    var workerA = new Worker('./assets/js/worker.js');
    var parameterA = {
        url: '/v1/point/get_point_history_trend',
        equipment_uuid:'',
        point_uuid:'',
        current:'',
        start:timer,
        End:times
    };
    $.extend(parameterA,parameters);

    workerA.postMessage (parameterA);

    workerA.onmessage = function(event){
        var tead_data=event.data;
        if(tead_data == '' || tead_data ==  'Failed to connect to localhost port 8088: Connection refused'){
            return false;
        }

        var oDataA = JSON.parse(tead_data);

        if(oDataA.data== ''){

            $('.modal-body #containerA').html('没有测点分析数据！');

            return false;
        }

        $('#containerA').highcharts({
            chart: {
                type: 'line',
                backgroundColor: '#2b2b2b',
            },
            title: {
                text: oDataA.channel_name,
                style:{
                    color:"#fff"
                }
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%m-%d',
                    week: '%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                },
                labels: {
                    style: {
                        color: '#fff'
                    }
                },
            },
            scrollbar: {
                enabled: true
            },
            tooltip: {
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%Y-%m-%d',
                    week: '%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                }
            },
            yAxis: {
                title: {
                    align: 'high',
                    offset: 0,
                    text: '['+oDataA.channel_unit+']',
                    rotation: 0,
                    margin: -5,
                    x: -5,
                    y: -18,
                    style: {fontSize: '14px', color: '#fff', fontWeight: 'bold'}
                },
                labels: {
                    style: {
                        color: '#fff'
                    }
                },
            },

            plotOptions: {
                spline: {
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    marker: {
                        enabled: false
                    },
                }
            },

            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },

            series: [{
                type: 'line',
                name: '当前测点值',
                data:   oDataA.data,
                lineWidth:1,
                color: '#04ff16',
                states:{
                    hover:false
                },
                events: {
                    click: function(event) {
                        var current = event.point.x;
                        var parameterr = {
                            equipment_uuid:parameterA.equipment_uuid,
                            point_uuid:parameterA.point_uuid,
                            current:current,
                            start:parameterA.timer,
                            End:parameterA.times,
                            alarm_status:parameterA.alarm_status
                        }

                        ajaxStatistics(parameterr);
                    }
                }
            }]
        });
        if(oDataA != ''){
            $('#containerA').css({"border-bottom":"1px solid #999","margin-bottom":"2px"});
        }
    };


}
//折线图
function ajaxStatistics(parameterr){


    var workerB = new Worker('./assets/js/worker.js');
    var parameterB = {
        url: '/v1/point/get_point_wave_freq',
        equipment_uuid:'',
        point_uuid:'',
        current:'',
        start:timer,
        End:times,
        alarm_status:''
    };

    $.extend(parameterB,parameterr);
    workerB.postMessage (parameterB);

    workerB.onmessage = function(event){

        var tead_data=event.data;

        if(tead_data == ''){
            return false;
        }

        var oDataB = JSON.parse(tead_data);

        if(oDataB.wave_info == ''){
            return false;
        }

        //波形
        $('#containerB').highcharts({

            chart: {
                type: 'line',
                backgroundColor: '#2b2b2b',

            },
            credits:{
                enabled:false
            },

            title: {
                text: oDataB.channel_name+"(历史波形图)",
                style:{
                    color:'#fff'
                }
            },

            xAxis: {
                title: {
                    align: 'high',
                    offset: 0,
                    text:  '[秒]',
                    rotation: 0,
                    margin:20,
                    x: 0,
                    y: 0,
                    style: {fontSize: '14px', color: '#000000', fontWeight: 'bold'}
                },
                labels: {
                    style: {
                        color: '#fff'
                    }
                },
                crosshair:{
                    color:'#5785ff'
                },
                type: 'linear',
                tickPixelInterval:12.5
            },
            tooltip: {
                dateTimeLabelFormats: {
                    millisecond: '%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%Y-%m-%d',
                    week: '%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                }
            },

            yAxis: {
                title: {
                    align: 'high',
                    offset: 0,
                    text:  '['+oDataB.channel_unit+']',
                    rotation: 0,
                    margin: -5,
                    x: -5,
                    y: -18,
                    style: {fontSize: '14px', color: '#fff', fontWeight: 'bold'}
                },
                labels: {
                    style: {
                        color: '#fff'
                    }
                },
                crosshair:{
                    color:'#5785ff'
                }
            },

            plotOptions: {
                spline: {
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    marker: {
                        enabled: false
                    },
                }
            },

            exporting: {
                enabled: false
            },

            credits: {
                enabled: false
            },

            legend: {
                enabled: false
            },

            series: [{
                name: '当前测点值',
                data:oDataB.wave_info,
                lineWidth:1,
                color: '#04ff16',
                states:{
                    hover:false
                }
            }]
        });

        if(oDataB != ''){
            $('#containerB').css({"border-bottom":"1px solid #999","margin-bottom":"2px"});
        }


        if(oDataB.freq_info == ''){
            return false;
        }


        //频谱
        $('#containerC').highcharts({

            chart: {
                type: 'line',
                backgroundColor: '#2b2b2b',

            },

            credits:{
                enabled:false
            },

            title: {
                text: oDataB.channel_name+"(历史频谱)",
                style:{
                    color:'#fff'
                }
            },

            xAxis: {
                title: {
                    align: 'high',
                    offset: 0,
                    text:  '[Hz]',
                    rotation: 0,
                    x: 0,
                    y: 0,
                    style: {fontSize: '14px', color: '#000000', fontWeight: 'bold'}
                },
                type: 'linear',
                labels: {
                    style: {
                        color: '#fff'
                    }
                },
                tickPixelInterval:oDataB.ldf*50
            },
            tooltip: {
                dateTimeLabelFormats: {
                    millisecond: '%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%Y-%m-%d',
                    week: '%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                }
            },

            yAxis: {
                title: {
                    align: 'high',
                    offset: 0,
                    text:  '['+oDataB.channel_unit+']',
                    rotation: 0,
                    x: -5,
                    y: -18,
                    style: {fontSize: '14px', color: '#fff', fontWeight: 'bold'}
                },
                labels: {
                    style: {
                        color: '#fff'
                    }
                },
            },

            plotOptions: {
                spline: {
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    marker: {
                        enabled: false
                    },
                }
            },

            exporting: {
                enabled: false
            },

            credits: {
                enabled: false
            },

            legend: {
                enabled: false
            },

            series: [{
                pointInterval:2.56/oDataB.smp_num*10000,
                name: '当前测点值',
                data:oDataB.freq_info,
                lineWidth:1,
                color: '#04ff16',
                states:{
                    hover:false
                }
            }]
        });

        if(oDataC != ''){
            $('#btnTime').removeClass('disabled');
        }
    };
}


//按钮切换状态
function survey_btn(){
    $('#survey_point_statistics .btn-group .btn').unbind().bind('click',function(){
        $(this).addClass('active');
        $(this).css({'border-bottom-color':'#fff','background-color':'#fff'});
        $(this).siblings().removeClass('active');
        $(this).siblings().css('border-bottom-color','#333');
        var types = $(this).attr('types');
        $("#jqGridList").jqGrid('setGridParam',
            {
                datatype: 'json',
                postData: {stateType:types},
                page: 1
            }).trigger("reloadGrid");
    });
    $('#survey_point_statistics .btn-group .btn').eq(3).click();
}

/**
 * 点击左边树的数据表格重载
 */
function personal_tree(params) {
    var avpostdata = {
        groupName: params.groupName || '',
        companyName: params.companyName || '',
        factoryName: params.factoryName || '',
        UnitName: params.UnitName || '',
    };
    $("#jqGridList").jqGrid('setGridParam', {
        postData: avpostdata,
        page: 1
    }).trigger("reloadGrid");
}