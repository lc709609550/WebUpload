var times = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
var timer = d.getFullYear()+"-"+(d.getMonth())+"-"+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
var modalW = $('#deviceKanban .modal-body').width();
var highW = $('#deviceKanbanModal').width()-15;
var parameters ={
    pointUuid:'',
    equipmentUuid:'',
    alarmStatus:''
};
$(function () {
    $('#tab li a').unbind().bind('click',function(){
        var index = $(this).parents('li').index();
        $(this).parent().addClass('active');
        $(this).parent().siblings().removeClass('active');
        $('#deviceKanbanModal>div').eq(index).show();
        $('#deviceKanbanModal>div').eq(index).siblings().hide();
    });

    $('#tab li a').eq(0).click();

    $(".trend_analysis").mCustomScrollbar({
        live:true,
        theme:"minimal",
        scrollInertia:0
    });
    modalW = $('#deviceKanban .modal-body').width();
    $(".form_datetime").datetimepicker({

        language: 'zh-CN',
        format: "yyyy-mm-dd hh:ii:ss",
        showMeridian: true,
        autoclose: true,
        todayBtn: true
    });
    //放大
    $('#deviceKanban .device_discharge').unbind().bind('click',function () {
        var modalH  = $('body').height()-92;
        highW = $('#deviceKanbanModal').width()-15;
        $('#deviceKanban .modal-content').css({
            'width':'100%',
            'left':'0',
            'margin-left':'0'
        })

        modalW = $('#deviceKanban .modal-body').width();

        $('#trend_analysis .trend_analysis').height(modalH-73);

        $('#deviceKanbanModal').css({
            'height':modalH,
            'max-height':modalH
        })
        var jqTableH = $('#deviceKanban .modal-body').outerHeight(true)-118;
        var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35) ;
        $("#deviceKanbanJqGridList").setGridHeight(jqTableH);
        $("#deviceKanbanJqGridList").setGridWidth(modalW);
        $("#deviceKanbanJqGridList").jqGrid('setGridParam',
            {
                url: "/v1/plant/get_point_info?equipmentUuid="+equipmentId,
                mtype: "GET",
                datatype: "json",
                page: 1,
                rowNum: tableNumber
            }).trigger("reloadGrid");

        ajaxData(parameters);

        showGraph();
    })
    //缩小
    $('#deviceKanban .device_shrink').unbind().bind('click',function () {
        $('#deviceKanban .modal-content').css({
            'width':'65%',
            'left':'50%',
            'margin-left':'-32.5%'
        })
        $('#deviceKanbanModal').css({
            'height':'500px',
            'max-height':'500px'
        })
        modalW = $('#deviceKanban .modal-body').width();
        $('#trend_analysis .trend_analysis').height(426)
        var jqTableH = $('#deviceKanban .modal-body').outerHeight(true)-118;
        var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35) ;
        $("#deviceKanbanJqGridList").setGridHeight(jqTableH);
        $("#deviceKanbanJqGridList").setGridWidth(modalW);
        $("#deviceKanbanJqGridList").jqGrid('setGridParam',
            {
                url: "/v1/plant/get_point_info?equipmentUuid="+equipmentId,
                mtype: "GET",
                datatype: "json",
                page: 1,
                rowNum: tableNumber
            }).trigger("reloadGrid");

        ajaxData(parameters)
        showGraph();
    })


    select_equipment_info();
    //测点表格
    showChildGrid();

    showGraph();

    var start = {
        format: 'YYYY-MM-DD hh:mm:ss',
        minDate: '2014-06-16 23:59:59', //设定最小日期为当前日期
        isinitVal:true,
        // festival:true,
        ishmsVal:false,
        maxDate: $.nowDate({DD:0}), //最大日期
        choosefun: function(elem, val, date){
            end.minDate = date; //开始日选好后，重置结束日的最小日期
            endDates();
        }
    };
    var end = {
        format: 'YYYY-MM-DD hh:mm:ss',
        minDate: $.nowDate({DD:0}), //设定最小日期为当前日期
        // festival:true,
        isinitVal:true,
        maxDate: '2099-06-16 23:59:59', //最大日期
        choosefun: function(elem, val, date){
            start.maxDate = date; //将结束日的初始值设定为开始日的最大日期
        }
    };
    //这里是日期联动的关键
    function endDates() {
        //将结束日期的事件改成 false 即可
        end.trigger = false;
        $("#mirror_fields").jeDate(end);
    }
    $.jeDate('#mirror_field',start);
    $.jeDate('#mirror_fields',end);
});

//测点表格
function showChildGrid(){

    var childGridURL = "/v1/plant/get_point_info?equipmentUuid="+equipmentId;
    var jqTableH = $('#deviceKanban .modal-body').outerHeight(true)-118;
    var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35) ;
    $("#deviceKanbanJqGridList").jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        styleUI: 'Bootstrap',
        colModel: [
            {label: 'pointUuid', name: 'pointUuid', width: 150, align: 'center','hidden':true},
            {label: '测点名称', name: 'aliasName', width: 150, align: 'center'},
            {label: '当前值', name: 'val', width: 80, align: 'center'},
            {label: '高限', name: 'hl', width: 80, align: 'center'},
            {label: '高高限', name: 'hh', width: 80, align: 'center'},
            {label: '下限', name: 'lh', width: 80, align: 'center'},
            {label: '下下限', name: 'll', width: 80, align: 'center'},
            {label: '单位', name: 'unit', width: 80, align: 'center'},
            {label: '报警方式', name: 'alarmType', width: 100, align: 'center'},
            {label: '报警类型', name: 'alarmAlias', width: 100, align: 'center'},
            {label: '更新时间', name: 'updateTime', width: 150, align: 'center'},
            {label: 'alarmStatus', name: 'alarmStatus', width: 150, align: 'center','hidden':true}
        ],
        dataTypes: "json",
        styleUIs: 'Bootstrap',
        viewrecords: true,
        multiselect: false,
        rownumbers: false,
        autoheight: true, //自动拉伸高度
        number: true, //显示行号
        autoScroll: true,
        pgtext: "第{0}页 共{1}页",
        loadui: 'enable',
        height: jqTableH,
        width:modalW,
        rowNum: tableNumber,
        pager: "#deviceKanbanJqGridPager",
        gridComplete: function (rowid) {
            var ids = jQuery('#deviceKanbanJqGridList').jqGrid("getDataIDs");
            var rowDatas = $("#deviceKanbanJqGridList").jqGrid('getRowData', rowid);
            var modify = "";
            var alarmType = '';
            var lines = '--';
            var timeA = '';
            var timeB = '';
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
                } else if (rowDatas[i].alarmStatus == 9) {
                    modify = '<span class="label label-default label-mini">' + rowDatas[i].alarmAlias + '</span> ';
                }

                jQuery('#deviceKanbanJqGridList').jqGrid("setRowData", id, {alarmAlias: modify});

                if (rowDatas[i].alarmType == 0) {
                    alarmType = '低通';
                }
                else if (rowDatas[i].alarmType == 1) {
                    alarmType = '高通';
                }
                else if (rowDatas[i].alarmType == 2) {
                    alarmType =  '带通';
                }
                else if (rowDatas[i].alarmType == 3) {
                    alarmType =  '带阻';
                }

                jQuery('#deviceKanbanJqGridList').jqGrid("setRowData", id, {alarmType: alarmType});

                if (rowDatas[i].alarmType == 0) {

                    alarmType = '低通';

                    jQuery('#deviceKanbanJqGridList').jqGrid("setRowData", id, {lh: lines});

                    jQuery('#deviceKanbanJqGridList').jqGrid("setRowData", id, {ll: lines});

                }
                else if (rowDatas[i].alarmType == 1) {

                    alarmType = '高通';

                    jQuery('#deviceKanbanJqGridList').jqGrid("setRowData", id, {hl: lines});

                    jQuery('#deviceKanbanJqGridList').jqGrid("setRowData", id, {hh: lines});


                }
                else if (rowDatas[i].alarmType == 2) {
                    alarmType =  '带通';
                }
                else if (rowDatas[i].alarmType == 3) {
                    alarmType =  '带阻';
                }

                jQuery('#deviceKanbanJqGridList').jqGrid("setRowData", id, {alarmType: alarmType});

                if(rowDatas[i].unit == ''){

                    jQuery('#deviceKanbanJqGridList').jqGrid("setRowData", id, {unit: lines});

                }
                //rowDatas[i].updateTime.getTime();
                timeA = new Date(parseInt(rowDatas[i].updateTime));
                var seperator1 = "-";
                var seperator2 = ":";
                var month = timeA.getMonth() + 1;
                var strDate = timeA.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                timeB = timeA.getFullYear() + seperator1 + month + seperator1 + strDate
                    + " " + timeA.getHours() + seperator2 + timeA.getMinutes()
                    + seperator2 + timeA.getSeconds();

                jQuery('#deviceKanbanJqGridList').jqGrid("setRowData", id, {updateTime: timeB});

            }
        }
    });
}

//初始化设备下拉框
function select_equipment_info(){
    $.ajax({
        url:"/v1/plant/get_point_info?equipmentUuid="+equipmentId,
        type:"GET",
        dataType:"json",
        data:{
            page:1
        },
        async:false,
        success:function(data){
            var options = '';
            $.each(data.rows,function(k,v){
                options += '<li><a href="javascript:void(0)" equipment_id="'+v.equipmentUuid+'" point_id="'+v.pointUuid+'"  alarm_status="'+v.alarmStatus+'">'+v.aliasName+'</a></li>';
            });
            $('#equipment_text').html(options);

            var equipment_id = $('#equipment_text li').eq(0).find('a').attr('equipment_id');
            var point_id = $('#equipment_text li').eq(0).find('a').attr('point_id');
            var alarm_status = $('#equipment_text li').eq(0).find('a').attr('alarm_status');
            var parameters ={
                pointUuid:point_id,
                equipmentUuid:equipment_id,
                alarmStatus:alarm_status
            };
            ajaxData(parameters);
            Onclick(parameters);
        }
    });

    $('#equipment_name').unbind().bind('click',function(){
        $('#equipment_text').show();
    });
    $('#equipment_text li a').unbind().bind({
        'click':function(){
            var equipment_name = $(this).text();
            var equipment_id = $(this).attr('equipment_id');
            var point_id = $(this).attr('point_id');
            var alarm_status = $(this).attr('alarm_status');
            parameters ={
                pointUuid:point_id,
                equipmentUuid:equipment_id,
                alarmStatus:alarm_status
            };
            ajaxData(parameters);
            Onclick(parameters);
            $('#equipment_name').val(equipment_name);
            $(this).parents('#equipment_text').hide();
        }
    })
    $('.equipment_down').unbind().bind('click',function () {
        $(this).siblings('#equipment_name').click();
    })
    $('#equipment_text li a').eq(0).click();
    $('#equipment_text').hover(function(){
            $(this).show();
        },
        function(){
            $(this).hide();
        })
    $('#equipment_name').hover(function(){

        },
        function(){
            $('#equipment_text').hide();
        })
}
//弹窗查询
function Onclick (val){
    $('#btnTime').unbind().bind('click',function(){
        if(!$(this).hasClass('disabled')){
            var start = $(this).parents().find('#mirror_field').val();
            var End = $(this).parents().find('#mirror_fields').val();
            var timestamp1 = Date.parse(start);
            var timestamp2 = Date.parse(End);
            $('#containerB').html('');
            $('#containerC').html('');
            if(timestamp1  > timestamp2) {
                block('开始时间应小于结束时间',1000);
                return false;
            }else{
                if(End != '' && start != ''){
                    var parameters = {start:start,End:End,equipmentUuid:val.equipmentUuid, pointUuid:val.pointUuid,alarmStatus:val.alarmStatus};
                    ajaxData(parameters);
                }else{
                    block("请选择时间！",1000);
                }
            }

        }
    })
}
//绘制趋势图
function ajaxData(parameters){
    var ws = $('#tab').width()-15;
    Highcharts.setOptions({
        lang:{
            contextButtonTitle:"图表导出菜单",
            decimalPoint:".",
            downloadJPEG:"下载JPEG图片",
            downloadPDF:"下载PDF文件",
            downloadPNG:"下载PNG文件",
            downloadSVG:"下载SVG文件",
            drillUpText:"返回 {series.name}",
            loading:"加载中",
            months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
            noData:"没有数据",
            numericSymbols: [ "千" , "兆" , "G" , "T" , "P" , "E"],
            printChart:"打印图表",
            resetZoom:"恢复缩放",
            resetZoomTitle:"恢复图表",
            shortMonths: [ "Jan" , "Feb" , "Mar" , "Apr" , "May" , "Jun" , "Jul" , "Aug" , "Sep" , "Oct" , "Nov" , "Dec"],
            thousandsSep:",",
            weekdays: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六","星期天"]
        }
    });
    $('#containerA').html('');
    $('#containerB').html('');
    $('#containerC').html('');
    $('#containerA').css({"border-bottom":"none","margin-bottom":"2px"});
    $('#containerB').css({"border-bottom":"none","margin-bottom":"2px"});
    var workerA = new Worker('./assets/js/worker.js');
    var parameterA = {
        url: '/v1/point/get_point_history_trend',
        equipmentUuid:'',
        pointUuid:'',
        current:'',
        start:timer,
        End:times
    };
    $.extend(parameterA,parameters);

    workerA.postMessage (parameterA);

    workerA.onmessage = function(event){

        $("#fountainG").hide();

        var tead_data=event.data;

        if(tead_data == '' || tead_data ==  'Failed to connect to localhost port 8088: Connection refused'){
            return false;
        }

        var oDataA = JSON.parse(tead_data);

        if(oDataA.code == 400){
            $('.modal-body #containerA').css('text-align','center')
            $('.modal-body #containerA').html('<img src="./assets/img/messages.png" width="40px" height="40px" style="margin-top: 65px"> <br /> <br />没有测点分析数据');
            return false;
        }

        if(oDataA.data.data == ''){
            $('.modal-body #containerA').css('text-align','center')
            $('.modal-body #containerA').html('<img src="./assets/img/messages.png" width="40px" height="40px" style="margin-top: 65px"> <br /> <br />没有测点分析数据');
            return false;
        }
        var date =new Date(oDataA.data.data[0][0]);
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var loginTime = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();

        var dates =new Date(oDataA.data.data[oDataA.data.data.length-1][0]);
        var seperator1 = "-";
        var seperator2 = ":";
        var month = dates.getMonth() + 1;
        var strDate = dates.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var loginTimes = dates.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + dates.getHours() + seperator2 + dates.getMinutes()
            + seperator2 + dates.getSeconds();
        $('#mirror_field').val(loginTime);
        $('#mirror_fields').val(loginTimes);

        var parameterr = {
            equipmentUuid:parameterA.equipmentUuid,
            pointUuid:parameterA.pointUuid,
            current:oDataA.data.data[0][0],
            start:parameterA.timer,
            End:parameterA.times,
            alarmStatus:parameterA.alarmStatus
        }
        ajaxStatistics(parameterr);

        $('#containerA').highcharts({
            chart: {
                type: 'line',
                backgroundColor: '#2b2b2b',
                marginRight:25,
                width:ws,
                zoomType: 'x',
                resetZoomButton: {
                    // 按钮定位
                    position:{
                        align: 'right', // by default
                        verticalAlign: 'top', // by default
                        x: 0,
                        y: -40
                    }
                }
            },
            title: {
                text: oDataA.data.channelName,
                style:{
                    color:"#fff"
                }
            },
            xAxis: {
                gridLineWidth: 1,
                gridLineColor: '#3c3c3c',
                maxZoom: 60,
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
                title: {
                    align: 'high',
                    offset: 0,
                    text:  '[秒]',
                    rotation: 0,
                    margin:20,
                    x:25,
                    y: -8,
                    style: {fontSize: '14px', color: '#fff', fontWeight: 'bold'}
                },
                labels: {
                    style: {
                        color: '#fff'
                    }
                }
            },
            tooltip: {
                crosshairs: [{
                    width: 1,
                    color: '#006cee'
                }, {
                    width: 0,
                    color: '#006cee'
                }],
                positioner: function () {
                    return { x: 60, y: 0 };
                },
                shadow: true,
                borderWidth: 1,
                shape   : 'square',
                borderColor:'#006cee',
                backgroundColor: '#f9f9f9',
                formatter: function () {
                    return Highcharts.dateFormat('<b>当前时刻: </b>%Y-%m-%d %H:%M:%S',this.x)+'<br/><b>当前测点值: </b>' + this.y.toFixed(2)+' '+oDataA.data.channelUnit;
                }

            },
            yAxis: {
                gridLineColor: '#3c3c3c',
                title: {
                    align: 'high',
                    offset: 0,
                    text: '['+oDataA.data.channelUnit+']',
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
                }
            },

            plotOptions: {
                series: {
                    allowPointSelect: true,
                    marker: {
                        states:{ select:{ enabled:true, fillColor:'#04ff16', lineWidth:6,lineColor:'#04ff16' } }
                    }
                },
                spline: {
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    marker: {

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
                data:   oDataA.data.data,
                lineWidth:1,
                color: '#04ff16',
                states:{
                    hover:false
                },
                cursor: 'pointer',
                events: {
                    cursor: 'pointer',
                    click: function(event) {
                        var current = event.point.x;
                        var parameterr = {
                            equipmentUuid:parameterA.equipmentUuid,
                            pointUuid:parameterA.pointUuid,
                            current:current,
                            start:parameterA.timer,
                            End:parameterA.times,
                            alarmStatus:parameterA.alarmStatus
                        }
                        ajaxStatistics(parameterr);
                    }
                }
            }]
        });

        if(oDataA.code == 200){
            $('#containerA').css({"border-bottom":"1px solid #999","margin-bottom":"2px"});
        }
    };


}
//折线图
function ajaxStatistics(parameterr){
    var ws = $('#tab').width()-15;
    var workerB = new Worker('./assets/js/worker.js');
    var parameterB = {
        url: '/v1/point/get_point_wave_freq',
        equipmentUuid:'',
        pointUuid:'',
        current:'',
        start:timer,
        End:times,
        alarmStatus:''
    };

    $.extend(parameterB,parameterr);
    workerB.postMessage (parameterB);

    workerB.onmessage = function(event){

        var tead_data=event.data;


        if(tead_data == ''){
            return false;
        }

        var oDataB = JSON.parse(tead_data);

        if(oDataB.code == 400){
            return false;
        }

        if(oDataB.data.wave_info == ''){
            return false;
        }
        //波形
        $('#containerB').highcharts({

            chart: {
                type: 'line',
                backgroundColor: '#2b2b2b',
                marginRight:25,
                width:ws,
                zoomType: 'x',
                resetZoomButton: {
                    // 按钮定位
                    position:{
                        align: 'right', // by default
                        verticalAlign: 'top', // by default
                        x: 0,
                        y: -40
                    }
                }
            },
            credits:{
                enabled:false
            },

            title: {
                text: oDataB.data.channelName+"(历史波形图)",
                style:{
                    color:'#fff'
                }
            },

            xAxis: {
                gridLineWidth: 1,
                gridLineColor: '#3c3c3c',
                title: {
                    align: 'high',
                    offset: 0,
                    text:  '[秒]',
                    rotation: 0,
                    margin:20,
                    x:25,
                    y: -8,
                    style: {fontSize: '14px', color: '#fff', fontWeight: 'bold'}
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
                crosshairs: [{
                    width: 1,
                    color: '#006cee'
                }, {
                    width:0,
                    color: '#006cee'
                }],
                positioner: function () {
                    return { x: 60, y: 0 };
                },
                shadow: true,
                borderWidth: 1,
                shape   : 'square',
                borderColor:'#006cee',
                backgroundColor: '#f9f9f9',
                headerFormat: '',
                pointFormat: '<b>当前时刻: </b>{point.x}<br /><b>当前测点值: </b> {point.y}',
                valueSuffix: ' '+ oDataB.data.channelUnit
            },

            yAxis: {
                gridLineColor: '#3c3c3c',
                title: {
                    align: 'high',
                    offset: 0,
                    text:  '['+oDataB.data.channelUnit+']',
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
                }
            },

            plotOptions: {
                series: {
                    allowPointSelect: true,
                    marker: {
                        states:{ select:{ enabled:true, fillColor:'#04ff16', lineWidth:6,lineColor:'#04ff16' } }
                    }
                },
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
                data:oDataB.data.waveInfo,
                lineWidth:1,
                color: '#04ff16',
                states:{
                    hover:false
                }
            }]
        });

        if(oDataB.data.waveInfo != ''){
            $('#containerB').css({"border-bottom":"1px solid #999","margin-bottom":"2px"});
        }


        if(oDataB.freqInfo == ''){
            return false;
        }

        //频谱
        $('#containerC').highcharts({

            chart: {
                type: 'line',
                backgroundColor: '#2b2b2b',
                marginRight:25,
                width:ws,
                zoomType: 'x',
                resetZoomButton: {
                    // 按钮定位
                    position:{
                        align: 'right', // by default
                        verticalAlign: 'top', // by default
                        x: 0,
                        y: -40
                    }
                }
            },

            credits:{
                enabled:false
            },

            title: {
                text: oDataB.data.channelName+"(历史频谱)",
                style:{
                    color:'#fff'
                }
            },

            xAxis: {
                gridLineColor: '#3c3c3c',
                gridLineWidth: 1,
                title: {
                    align: 'high',
                    offset: 0,
                    text:  '[Hz]',
                    rotation: 0,
                    x:25,
                    y: -8,
                    style: {fontSize: '14px', color: '#fff', fontWeight: 'bold'}
                },
                type: 'linear',
                labels: {
                    style: {
                        color: '#fff'
                    }
                },
                tickPixelInterval:oDataB.data.ldf*50
            },
            tooltip: {
                crosshairs: [{
                    width: 1,
                    color: '#006cee'
                }, {
                    width:0,
                    color: '#006cee'
                }],
                positioner: function () {
                    return { x: 60, y: 0 };
                },
                shadow: true,
                borderWidth: 1,
                shape   : 'square',
                borderColor:'#006cee',
                backgroundColor: '#f9f9f9',
                headerFormat: '',
                pointFormat: '<b>当前频率: </b>{point.x}<br /><b>当前测点值: </b> {point.y}',
                valueSuffix: ' '+ oDataB.data.channelUnit
            },

            yAxis: {
                gridLineColor: '#3c3c3c',
                title: {
                    align: 'high',
                    offset: 0,
                    text:  '['+oDataB.data.channelUnit+']',
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
                series: {
                    allowPointSelect: true,
                    marker: {
                        states:{ select:{ enabled:true, fillColor:'#04ff16', lineWidth:6,lineColor:'#04ff16' } }
                    }
                },
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
                pointInterval:2.56/oDataB.data.smpum*10000,
                name: '当前测点值',
                data:oDataB.data.freqInfo,
                lineWidth:1,
                color: '#04ff16',
                states:{
                    hover:false
                }
            }]
        });

    };
}

function showGraph() {
    $.ajax({
        url:"http://"+location.host+"/index/graph_info/index?equipmentUuid="+equipmentId,
        type:"GET",
        dataType:"json",
        async:false,
        success:function(data){
            if(data.graph_img != undefined){
                var contentDiv = $("#deviceKanbanModal");
                var contentWidth = contentDiv.width();
                var contentHeight = contentDiv.height();
                var graphWidth = data.graph_img_width;
                var graphHeight = data.graph_img_height;
                var oData = {
                    containerWidth: contentWidth, //1216,
                    containerHeight: contentHeight, //470,
                    width: graphWidth,//852,
                    height: graphHeight //727
                };
                var rate = getRate(oData);

                createGraphPic(data, rate);
                createBox(data, rate);
                PointContent(data.pointGroup)
            }else{
                $('.blockChartImg').html('<img src="./assets/img/messages.png" width="40px" height="40px" style="margin-top: 65px"> <br /> <br />没有概貌图数据').css({'text-align':'center','color':'#fff'});
            }


        }
    });
}
function createGraphPic(data, rate){
    var graphWidth = data.graph_img_width;
    var graphHeight = data.graph_img_height;
    var imgHeight = graphHeight * rate;
    var imgWidth = graphWidth * rate;
    $('#blockChart .blockChartImg').css({'height':''+imgHeight+'','width':''+imgWidth+''});
    var htmls = '<img src="data:image/jpeg;base64,'+data.graph_img+'" style="height:100% ;width:100%;">';
    $('#blockChart .blockChartImg').html(htmls);
}
function getRate(data) {
    var rate = 1;
    if((data.containerWidth / data.containerHeight) > (data.width / data.height)) {
        rate = data.containerHeight/ data.height;
    }else {
        rate = data.containerWidth/ data.width;
    }
    return rate;
}

function createBox(data, rate){
    $.each(data.listBox, function(index, box){
        if(box.ord == 0 && box.type == -1) {
            createPlantNameBox(box, rate , data.equipmentName);
        }else if(box.ord == 0 && box.type == 0) {
           createTimeBox(box, rate , data.updateTime);
        }else if(box.type == 2) {
            // 电机转速
            createSpeedBox(box, rate , data.rev);
        }else {
            //var hasPoints = points[box.ord];
            createPointBox(box, rate);
        }

    });
}
function getBox(box,rate) {
    return  {
        top:Math.floor(box.ypos*rate),
        left:Math.floor(box.xpos*rate),
        width:Math.floor(box.width*rate),
        height:Math.floor(box.height*rate)
    }
}
//名称box
function createPlantNameBox(box, rate,name) {
    var sizes = getBox(box, rate)
    var htmlA = "<div class='plant_name_box'>"+name+"</div>"
    $('#blockChart').append(htmlA);
}
//时间box
function createTimeBox(box, rate,time) {
    var sizes = getBox(box, rate)
    var timeA = new Date(parseInt(time));
    var seperator1 = "-";
    var seperator2 = ":";
    var month = timeA.getMonth() + 1;
    var strDate = timeA.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var timeB = timeA.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + timeA.getHours() + seperator2 + timeA.getMinutes()
        + seperator2 + timeA.getSeconds();
    var htmlA = "<div class='plant_time_box' >"+timeB+"</div>"
    $('#blockChart').append(htmlA);
}
//转速box
function createSpeedBox(box,rate,rev) {
    var sizes = getBox(box, rate)
    var htmlA ='';
    if(rev == -1){
        htmlA = "<div class='plant_rev_box' >"+box.comments+":无建相转速</div>";
    }else {
        htmlA = "<div class='plant_rev_box' >"+box.comments+":"+rev+"</div>";
    }
    $('#blockChart').append(htmlA);
}
//测点box
function createPointBox(box, rate) {
    var sizes = getBox(box, rate)
    
    var ord = box.ord;
    var id = 'point_box_' + ord;
    var htmlA = "<div id='" + id + "' class='point_box' style='width:"+sizes.width+"px;height:"+sizes.height+"px;left:"+sizes.left+"px;top:"+sizes.top+"px;'></div>"
    $('#blockChart .blockChartImg').append(htmlA);
}
//测点内容
function  PointContent(pointGroups) {
    $.each(pointGroups,function (k,v) {
        var pointGroupHtml = '';
        $.each(v,function (kev,val) {
            pointGroupHtml +='<p>'+kev+':'+val+'</p>';
        })
        var id = 'point_box_' + k;
        $('#'+id).html(pointGroupHtml);
    })
    $(".point_box").mCustomScrollbar({
        live:true,
        theme:"minimal",
        scrollInertia:0
    });
}

