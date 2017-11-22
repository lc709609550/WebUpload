/*
 * 实时报警统计JS,BaiBing
 * Date:2017-02-21
 */
var bhxz = {};

var avpostdata = {};
var d = new Date();
var times = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
var timer = d.getFullYear()+"-"+(d.getMonth())+"-"+d.getDate()+' '+d.getHours()+':'+d.getMinutes();

$(function(){
    bhxz.realTimeAlerting(avpostdata);
});

//实时报警统计
bhxz.realTimeAlerting = function(avpostdata){

    //实时报警统计
    var height = $("#sidebar").height()-203;
    var loRowNumber = 15;
    if(Math.floor(height/38) != 0){
        loRowNumber = Math.floor(height/37);
    };

    var colNames =  ['equipmentUuid','公司名称','生产部名称','设备显示名称','设备类型','报警状态'];

    var colModels = [
        { name: 'equipmentUuid', index: 'equipmentUuid',hidden:true,align : 'center',},
        { name: 'companyName', index: 'companyName', width: 60 ,align : 'center'},
        { name: 'factoryName', index: 'factoryName', width: 60,align : 'center' },
        { name: 'equipmentName', index: 'equipmentName', width: 60 ,align : 'center'},
        { name: 'equipmentTypeName', index: 'equipmentTypeName', width: 60 ,align : 'center'},
        { name: 'alarmAlias', index: 'alarmAlias', width: 60 ,align : 'center'}
    ];

    var jqGridR = {
        ID:$("#jqGridList"),
        idPager:'#jqGridPager',
        url:'/v1/plant/get_plant_info',
        avpostdatas: avpostdata,
        loRowNumber:loRowNumber,
        colNames:colNames,
        colModel:colModels,
        heights:(height-37)+'px',
        loads:function (data) {
            $('.gen-case span').html(data.records);
        },
        gridComplete:function(rowid){
            var ids = jQuery("#jqGridList").jqGrid("getDataIDs");
            var rowDatas =jqGridR.ID.jqGrid('getRowData', rowid);
            var modify = "";
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];

                    //"<a href=\"#\" style=\"color:#f60\" onclick=\"Delete(" + id + ")\">"+rowDatas[i].alarmAlias+"</a>"
                if(rowDatas[i].alarmAlias == '危险'){
                    modify = '<span class="label label-danger label-mini">'+rowDatas[i].alarmAlias+'</span>';
                }else if(rowDatas[i].alarmAlias == '报警'){
                    modify = '<span class="label label-warning label-mini">'+rowDatas[i].alarmAlias+'</span>';
                }else if(rowDatas[i].alarmAlias == '正常'){
                    modify = '<span class="label label-success label-mini">'+rowDatas[i].alarmAlias+'</span>';
                }else if(rowDatas[i].alarmAlias == '停车'){
                    modify = '<span class="label label-primary label-mini">'+rowDatas[i].alarmAlias+'</span>';
                }else if(rowDatas[i].alarmAlias == '断网'){
                    modify = '<span class="label label-default label-mini">'+rowDatas[i].alarmAlias+'</span>';
                }

                jQuery("#jqGridList").jqGrid("setRowData", id, { alarmAlias: modify });
            }
        },

        subGrids:true,
        subGridRowExpanded:bhxz.showChildGrid
    }

    BHXZ.jqGrid(jqGridR);
}

//子表格绘制
bhxz.showChildGrid =function (parentRowID, parentRowKey) {

    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";

    var rowData = $('#jqGridList').jqGrid('getRowData', parentRowKey);

    var childGridURL = "/v1/plant/get_point_info?equipment_uuid=" + rowData['equipmentUuid'];

    // add a table and pager HTML elements to the parent grid row - we will render the child grid here
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        styleUI: 'Bootstrap',
        page: 1,
        colNames: ['测点名称', '当前值', '单位', '高高线', '高线', '低线', '低低线', '状态', 'pointUuid','alarmStatus'],
        colModel: [
            {name: 'aliasName', index: 'aliasName', width: 100,align : 'center'},
            {name: 'val', index: 'val', width: 100,align : 'center'},
            {name: 'unit', index: 'unit', width: 100,align : 'center'},
            {name: 'HH', index: 'HH', width: 100,align : 'center'},
            {name: 'HL', index: 'HL', width: 100,align : 'center'},
            {name: 'LH', index: 'LH', width: 100,align : 'center'},
            {name: 'LL', index: 'LL', width: 100,align : 'center'},
            {name: 'alarmAlias', index: 'alarmAlias', width: 100,align : 'center'},
            {name: 'pointUuid', index: 'pointUuid', hidden: true,align : 'center'},
            {name: 'alarmStatus', index: 'alarmStatus', hidden: true,align : 'center'}
        ],
        rownumbers: 10,
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
        height: '100%',
        rowNum: 10,
        pager: "#" + childGridPagerID,
        gridComplete: function (rowid) {
            var ids = jQuery('#' + childGridID).jqGrid("getDataIDs");
            var rowDatas = $("#" + childGridID).jqGrid('getRowData', rowid);
            var modify = "";
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                if (rowDatas[i].alarmAlias == '危险') {
                    modify = '<span class="label label-danger label-mini">' + rowDatas[i].alarmAlias + '</span> <i class="fa fa-bar-chart-o" style="font-size: 14px;float: right;margin-right: 40px;line-height: 17px;"></i>';
                } else if (rowDatas[i].alarmAlias == '报警') {
                    modify = '<span class="label label-warning label-mini">' + rowDatas[i].alarmAlias + '</span> <i class="fa fa-bar-chart-o" style="font-size: 14px;float: right;margin-right: 40px;line-height: 17px;"></i>';
                } else if (rowDatas[i].alarmAlias == '正常') {
                    modify = '<span class="label label-success label-mini">' + rowDatas[i].alarmAlias + '</span> <i class="fa fa-bar-chart-o" style="font-size: 14px;float: right;margin-right: 40px;line-height: 17px;"></i>';
                } else if (rowDatas[i].alarmAlias == '停车') {
                    modify = '<span class="label label-primary label-mini">' + rowDatas[i].alarmAlias + '</span> <i class="fa fa-bar-chart-o" style="font-size: 14px;float: right;margin-right: 40px;line-height: 17px;"></i>';
                } else if (rowDatas[i].alarmAlias == '断网') {
                    modify = '<span class="label label-default label-mini">' + rowDatas[i].alarmAlias + '</span> <i class="fa fa-bar-chart-o" style="font-size: 14px;float: right;margin-right: 40px;line-height: 17px;"></i>';
                }

                jQuery('#' + childGridID).jqGrid("setRowData", id, {alarmAlias: modify});
            }
        },

        ondblClickRow: function (val, rowid) {
            var rowDatas = $("#" + childGridID).jqGrid('getRowData', rowid);
            var rowDatar = $('#jqGridList').jqGrid('getRowData', parentRowKey);
            //绘制弹窗
            $('.modalWrap').html('');
            $.ajax({
                url: './pop_chart.html',
                type: "GET",
                dataType: 'html',
                success: function (data) {
                    $('.modalWrap').html(data);
                    $('#technicalEditModal').modal('show');
                    var parameters ={
                        pointUuid:rowDatas.pointUuid,
                        equipmentUuid:rowDatar.equipmentUuid,
                        alarmStatus:rowDatas.alarmStatus
                    }
                    bhxz.ajaxData(parameters);

                    bhxz.Onclick(parameters);
                }
            });
        }//双击
    });

    // add navigation bar with some built in actions for the grid
    $("#" + childGridID).navGrid("#" + childGridPagerID, {edit: false, add: false, del: false, search: true, refresh: true, position: "left", cloneToTop: false});
}

//弹窗查询
bhxz.Onclick = function(val){
    $('#btnTime').unbind().bind('click',function(){
        if(!$(this).hasClass('disabled')){
            var start = $(this).parents().find('#mirror_field').val();
            var End = $(this).parents().find('#mirror_fields').val();
            if(End != '' && start != ''){
                var parameters = {start:start,End:End,equipmentUuid:val.equipmentUuid,pointUuid:val.pointUuid,alarmStatus:val.alarmStatus};
                $(this).addClass('disabled');
                bhxz.ajaxData(parameters);
            }else{
                alert('请选择时间！');
            }
        }
    })
}

//绘制趋势图
bhxz.ajaxData = function(parameters){
    var workerA = new Worker('./assets/js/worker.js');
    var parameterA = {
        url: '/v1/point/get_point_history_trend',
        equipmentUuid:'',
        pointUuid:'',
        start:timer,
        End:times
    };
    $.extend(parameterA,parameters);
    workerA.postMessage (parameterA);
    workerA.onmessage = function(event){
        var tead_data=event.data;
        var oDataA = JSON.parse(tead_data);
        //console.log(oDataA);

        if(oDataA.status==0){

            $('.modal-body').html(oDataA.message);
            return ;
        }


        $('#containerA').highcharts({
            chart: {
                zoomType: 'x',
                width: 980,
                height:200
            },
            title: {
                text: oDataA['result'][0]['channel_name']
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
                }
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
                    text: '['+oDataA['result'][0]['channel_unit']+']',
                    rotation: 0,
                    margin: -5,
                    x: -5,
                    y: -18,
                    style: {fontSize: '14px', color: '#000000', fontWeight: 'bold'}
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
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                type: 'area',
                name: '当前测点值',
                data:   oDataA['result'][0]['data']
            }]
        });
        if(oDataA != ''){
            $('#containerA').css('border-bottom','1px solid #999');
        }
    };

    //波形
    var workerB = new Worker('./assets/js/worker.js');
    var parameterB = {
        url: '/v1/point/get_point_wave_freq',
        equipmentUuid:'',
        pointUuid:'',
        start:timer,
        End:times
    };
    $.extend(parameterB,parameters);
    workerB.postMessage (parameterB);
    workerB.onmessage = function(event){

        var tead_data=event.data;
        var oDataB = JSON.parse(tead_data);

        if(oDataB.status==0){
            return ;
        }


        $('#containerB').highcharts({
            chart: {
                zoomType: 'x',
                width: 980,
                height:200
            },
            title: {
                text: oDataB['result'][0]['wave']['channel_name']
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
                }
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
                    text:  '['+oDataB['result'][0]['wave']['channel_unit']+']',
                    rotation: 0,
                    margin: -5,
                    x: -5,
                    y: -18,
                    style: {fontSize: '14px', color: '#000000', fontWeight: 'bold'}
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
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                type: 'area',
                name: '当前测点值',
                data:   oDataB['result'][0]['wave']['data']
            }]
        });
        if(oDataB != ''){
            $('#containerB').css('border-bottom','1px solid #999');
        }
    };

    var workerC = new Worker('./assets/js/worker.js');
    var parameterC = {
        url: '/v1/point/get_point_wave_freq',
        equipmentUuid:'',
        pointUuid:'',
        start:timer,
        End:times
    };
    $.extend(parameterC,parameters);
    workerC.postMessage (parameterC);
    workerC.onmessage = function(event){
        var tead_data=event.data;
        var oDataC = JSON.parse(tead_data);

        if(oDataC.status==0){
            return ;
        }


        $('#containerC').highcharts({
            chart: {
                zoomType: 'x',
                width: 980,
                height:200
            },
            title: {
                text: oDataC['result'][0]['freq']['channel_name']
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
                }
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
                    text: '['+oDataC['result'][0]['freq']['channel_unit']+']',
                    rotation: 0,
                    margin: -5,
                    x: -5,
                    y: -18,
                    style: {fontSize: '14px', color: '#000000', fontWeight: 'bold'}
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
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                type: 'area',
                name: '当前测点值',
                data:   oDataC['result'][0]['freq']['data']
            }]
        });
        if(oDataC != ''){
            $('#btnTime').removeClass('disabled');
        }
    };
}


