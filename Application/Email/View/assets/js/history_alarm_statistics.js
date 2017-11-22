/**
 * Created by BHZXZbaibing on 2017/5/22.
 */
var d = new Date();
var times = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
var timer = d.getFullYear()+"-"+(d.getMonth())+"-"+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
$(function(){

    //时间插件
    $(".form_datetime").datetimepicker({
        weekStart: 1,
        startView: 2,
        minView: 2,
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        showMeridian: true,
        autoclose: true,
        todayBtn: true
    });

    var myDate = new Date();
    var end_time = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate();
    var start_time = myDate.getFullYear()+"-"+(myDate.getMonth())+"-"+(myDate.getDate());



    var infos = {
        alarm_starttime : start_time,
        alarm_endtime :end_time,
        companyName : '',
        factoryName : '',
        equipmentName :'',
    };

    $('#alarm_starttime').val(start_time);
    $('#alarm_endtime').val(end_time);


    //A1设备管理--设备档案--检查权限
    plant_check_auth();

    //初始化项目下拉框
    select_company_search();

    //初始化表格
    history_alarm_statistics_tableEvent(infos);


    //查询事件
    search_info();



});



//A1设备管理--设备档案--检查权限
function  plant_check_auth(){
    if (auth.length != 0) {
        $('#history_alarm_auth_btn').html('');
        $.each(auth, function (index, dome) {
            var btn = '';
            if (dome.type == 'select') {
                btn = '<button type="button" class="btn btn-theme " id="search_info">'+dome.title+'</button>　';
            }
            $('#history_alarm_auth_btn').append(btn);
        });
        search_info();

    }
}

//初始化表格
function history_alarm_statistics_tableEvent(infos){
    //计算表格高度及条数
    var heights = $('#sidebar').height()  - 198;
    var jqTableH = heights - $('.headers').outerHeight(true);
    var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35) ;
    //绘制表格
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    $("#jqGridList").jqGrid({
        url: "http://" + location.host + "/equipment/history_alarm/getInfos?" + new Date(),
        mtype: "GET",
        postData:{infos:infos},
        styleUI: 'Bootstrap',
        datatype: "json",
        colModel: [
            {label: 'equipment_uuid', name: 'equipment_uuid', width: 150, align: 'center','hidden':true},
            {label: 'point_uuid', name: 'point_uuid', width: 150, align: 'center','hidden':true},
            {label: 'alarm_status', name: 'alarm_status', width: 150, align: 'center','hidden':true},
            {label: 'end_time', name: 'end_time', width: 150, align: 'center','hidden':true},
            {label: 'start_time', name: 'start_time', width: 150, align: 'center','hidden':true},
            {label: '单位名称', name: 'company_name', width: 150, align: 'center'},
            {label: '分厂名称', name: 'factory_name', width: 150, align: 'center'},
            {label: '设备名称', name: 'equipment_name', width: 150, align: 'center'},
            // {label: '设备类型', name: 'equipment_type_name', width: 150, align: 'center'},
            // {label: '设备编号', name: 'equipment_id', width: 150, align: 'center'},
            {label: '测点名称', name: 'fault_name', width: 150, align: 'center'},
//            {label: '故障原因', name: 'project_state', width: 150, align: 'center'},
//            {label: '诊断结果', name: 'win', width: 150, align: 'center'},
//            {label: '确认人', name: 'operator', width: 150, align: 'center'},
            {label: '报警时间', name: 'start_time', width: 150, align: 'center'}
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
        gridComplete: function () {

        },
        ondblClickRow: function (val, rowid) {
            var rowDatar = $('#jqGridList').jqGrid('getRowData', rowid);
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
                        pointUuid:rowDatar.point_uuid,
                        equipmentUuid:rowDatar.equipment_uuid,
                        alarmStatus:rowDatar.alarm_status,
                        start:rowDatar.start_time,
                        End:rowDatar.end_time
                    }
                    ajaxData(parameters);

                    Onclick(parameters);

                    $('#technicalEditModal').on('hide.bs.modal', function () {
                        $("#fountainG").hide();
                    });
                }
            });
        }//双击
    });
}
//初始化单位名称

function select_company_search(){
    $.ajax({
        url:"http://"+location.host+"/equipment/history_alarm/getCompanyName?"+new Date(),
        type:"GET",
        dataType:"json",
        async:false,
        success:function(data){

            //大于6条数据加滚动条
            if(Object.keys(data).length>6){

                    $('#company_text').css({"height":"210px",'overflow':'auto'});
            }else{
                $('#company_text').css({"height":"auto"});
            }
            var options = '';
            options += '<li><a href="javascript:void(0)" va="-1">全部单位</a></li>';


            $.each(data,function(k,v){
                options += '<li><a href="javascript:void(0)" va="'+v+'">'+v+'</a></li>';
            });
            $('#company_text').html(options);
        }
    });
        $('#company_name').unbind().bind('click',function(){
            $('#company_text').show();
        });
        $('#company_text li a').unbind().bind({
            'click':function(){
                var company_name = $(this).attr('va');

                if(company_name == '-1'){

                    $('#company_name').val('全部单位');

                }else{
                    $('#company_name').val(company_name);
                }

                select_factory_search(company_name);
                $(this).parents('#company_text').hide();
            }
        })
        $('.company_down').unbind().bind('click',function () {
            $(this).siblings('#company_name').click();
        })
        $('#company_text li a').eq(0).click();
        $('#company_text').hover(function(){
                $(this).show();
            },
            function(){
                $(this).hide();
            })
        $('#company_name').hover(function(){

            },
            function(){
                $('#company_text').hide();
            })


}

//联动--分厂查询
function select_factory_search(company_name){
    $.ajax({
        url:"http://"+location.host+"/equipment/history_alarm/getFactoryName?"+new Date(),
        type:"GET",
        data:{companyName:company_name},
        dataType:"json",
        async:false,
        success:function(data){
            //大于6条数据加滚动条
            if(data.length>6){
                $('#factory_text').css({"height":"210px",'overflow':'auto'});
            }else{
                $('#factory_text').css({"height":"auto"});
            }
            var options = '';
            options += '<li><a href="javascript:void(0)" va="-1">全部分厂</a></li>';


            $.each(data,function(k,v){
                options += '<li><a href="javascript:void(0)" va="'+v+'">'+v+'</a></li>';
            });
            $('#factory_text').html(options);
        }
    });
    $('#factory_name').unbind().bind('click',function(){
        $('#factory_text').show();
    });
    $('#factory_text li a').unbind().bind({
        'click':function(){
            var factory_name = $(this).attr('va');
            if(factory_name == '-1'){


                $('#factory_name').val('全部分厂');

            }else{
                $('#factory_name').val(factory_name);
            }

            select_equipment_info(factory_name);
            $(this).parents('#factory_text').hide();
        }
    })
    $('.factory_down').unbind().bind('click',function () {
        $(this).siblings('#factory_name').click();
    })
    $('#factory_text li a').eq(0).click();
    $('#factory_text').hover(function(){
            $(this).show();
        },
        function(){
            $(this).hide();
        })
    $('#factory_name').hover(function(){

        },
        function(){
            $('#factory_text').hide();
        })

}

//初始化设备下拉框
function select_equipment_info(factory_name){

    $.ajax({
        url:"http://"+location.host+"/equipment/history_alarm/getEquipmentName?"+new Date(),
        type:"POST",
        data:{factoryName:factory_name},
        dataType:"json",
        async:false,
        success:function(data){
            //大于6条数据加滚动条
            if(data.length>6){
                $('#equipment_text').css({"height":"210px",'overflow':'auto'});
            }else{
                $('#equipment_text').css({"height":"auto"});
            }
            var options = '';
            options += '<li><a href="javascript:void(0)" va="-1">全部设备</a></li>';


            $.each(data,function(k,v){
                options += '<li><a href="javascript:void(0)" va="'+v+'">'+v+'</a></li>';
            });
                $('#equipment_text').html(options);
        }
    });

    $('#equipment_name').unbind().bind('click',function(){
        $('#equipment_text').show();
    });
    $('#equipment_text li a').unbind().bind({
        'click':function(){
            var equipment_name = $(this).attr('va');

            if(equipment_name == '-1'){


                $('#equipment_name').val('全部设备');

            }else{
                $('#equipment_name').val(equipment_name);
            }

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

//查询事件
function search_info(){

    $('#search_info').unbind('click').click(function(){

        //单位名称
        var companyName = $('#company_name').val();
        if(companyName == '全部单位'){
            companyName='';
        }
        //分厂名称
        var factoryName = $('#factory_name').val();
        if(factoryName == '全部分厂'){
            factoryName='';
        }
        //设备名称
        var equipmentName = $('#equipment_name').val();
        if(equipmentName == '全部设备'){
            equipmentName='';
        }

        //时间
        var alarm_starttime =  $('#alarm_starttime').val();
        var alarm_endtime = $('#alarm_endtime').val();
        var startTime = Date.parse(alarm_starttime);
        var endTime = Date.parse(alarm_endtime);
        if(startTime>endTime){
            block('开始时间应小于结束时间',1000);
            return false;
        }
        var infos = {
            companyName : companyName,
            factoryName : factoryName,
            equipmentName :equipmentName,
            alarm_starttime:alarm_starttime,
            alarm_endtime:alarm_endtime
        };
        $("#jqGridList").jqGrid('setGridParam',
            {
                datatype:"json",
                page:1,
                postData:{infos:infos}

            }).trigger("reloadGrid");

    });
}

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
                    var parameters = {start:start,End:End,equipmentUuid:val.equipmentUuid, pointUuid:val.pointUuid,alarm_status:val.alarm_status};
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
            shortMonths: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
            thousandsSep:",",
            weekdays: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六","星期天"]
        }
    });
    $("#fountainG").show();
    var workerA = new Worker('./assets/js/worker.js');
    var parameterA = {
        url: '/v1/point/get_point_history_trend',
        equipmentUuid:'',
        pointUuid:'',
        current:'',
        alarmStatus:parameters.alarm_status,
        start:parameters.start,
        End:parameters.End
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
                width:751
            },
            title: {
                text: oDataA.data.channelName,
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
                formatter: function () {
                    return Highcharts.dateFormat('<b>当前时刻: </b>%Y-%m-%d %H:%M:%S',this.x)+'<br/><b>当前测点值: </b>' + this.y.toFixed(2)+' '+oDataA.data.channelUnit;
                }

            },
            yAxis: {
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
                    pointStart: '1'
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
    var workerB = new Worker('./assets/js/worker.js');
    var parameterB = {
        url: '/v1/point/get_point_wave_freq',
        equipmentUuid:'',
        pointUuid:'',
        current:'',
        start:'',
        End:'',
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
                marginRight:25
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
                headerFormat: '',
                pointFormat: '<b>当前时刻: </b>{point.x}<br /><b>当前测点值: </b> {point.y}',
                valueSuffix: ' '+ oDataB.data.channelUnit
            },

            yAxis: {
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
                marginRight:25
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
                headerFormat: '',
                pointFormat: '<b>当前频率: </b>{point.x}<br /><b>当前测点值: </b> {point.y}',
                valueSuffix: ' '+ oDataB.data.channelUnit
            },

            yAxis: {
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
