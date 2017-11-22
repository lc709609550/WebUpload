/**
 * Created by wyl on 2017/6/20.
 */
var chart;

$(function(){

    get_project();
    //提醒数据
    //reminder_data();

    personal_center_project();
    //故障案例
    project_fault_case();
    //设备饼图
    equipment_chart();

    //项目饼图
    project_chart();

    chart = echarts.init(document.getElementById('graph'));

    createChart();



});
function get_project(id){
    $.ajax({
        url: "http://"+location.host+"/personal/project/index?"+new Date(),
        type: "POST",
        async: false,
        dataType: "json",
        data:{
            id:id
        },
        error:function(){
        },
        success: function(data){
            var prohtml = '';
            // var navhtml = '';
            if(data.length>0){
               $.each(data,function (key,val) {
                   pid =val.id;
                   var project_members = val.project_members ? val.project_members.toString() : '';
                   var project_phase = val.project_phase ? val.project_phase.toString() : '';
                   //按钮
                   // navhtml += '<li pid='+val.id+'></li>';
                    //内容
                   prohtml +='<div class="ash-panel pn"> ' +
                       '<div class="ash-header clear"> ' +
                       '<h5>项目信息</h5> ' +
                       '</div> ' +
                       '<div class="personal_center_project_content cd_panel"> ' +
                       '<table style="width: 100%"> ' +
                       '<tr> ' +
                       '<td class="percent_tile" width="30">项目名称：</td>' +
                       '<td class="percent_content" width="70" title="'+val.project_name+'">'+val.project_name+'</td> ' +
                       '</tr> ' +
                       '<tr>' +
                       '<td class="percent_tile"  width="30">项目类型：</td>' +
                       '<td class="percent_content" width="70" title="'+val.project_type+'">'+val.project_type+'</td> ' +
                       '</tr> ' +
                       '<tr> ' +
                       '<td class="percent_tile" width="30" >负责人：</td> ' +
                       '<td class="percent_content" width="70" title="'+val.project_state+'">'+val.true_name+'</td> ' +
                       '</tr> ' +
                       '<tr> ' +
                       '<td class="percent_tile" width="30" >项目成员：</td> ' +
                       '<td class="percent_content" width="70" title="'+project_members+'"> '+project_members+'</td> ' +
                       '</tr> ' +
                       '<tr> ' +
                       '<td class="percent_tile" width="30">项目周期：</td> ' +
                       '<td class="percent_content" width="70" title="'+val.project_starttime+'  '+val.project_endtime+'">'+val.project_starttime+'  '+val.project_endtime+'</td> ' +
                       '</tr> ' +
                       '<tr> ' +
                       '<td class="percent_tile" width="30" title>项目进度：</td>' +
                       '<td class="percent_content" width="70" title="'+project_phase+'">' +
                       '<div>'+
                       '<div class="progress progress-striped"> ' +
                       '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: '+val.project_per+'%; -webkit-animation: progress-bar-stripes 2s linear infinite;   animation: progress-bar-stripes 2s linear infinite;"> ' +
                       '</div> ' +
                       '<div class="percent">'+val.project_per+'%</div> ' +
                       '</div> ' +
                       '</div> ' +
                       '</td> ' +
                       '</tr> ' +
                       '</table> ' +
                       '</div> ' +
                       '</div>';
               })
            }else{
                prohtml +='<div class="green-panel grey-panel pn"> ' +
                    '<div class="green-header"> ' +
                    '<h5>项目</h5> ' +
                    '</div> ' +
                    '<div class="personal_center_project_content"> ' +
                    '<table style="width: 100%"> ' +
                    '<tr> ' +
                    '<td class="percent_tile" width="30">项目名称：</td>' +
                    '<td class="percent_content" width="70"></td> ' +
                    '</tr> ' +
                    '<tr>' +
                    '<td class="percent_tile"  width="30">项目类型：</td>' +
                    '<td class="percent_content" width="70"></td> ' +
                    '</tr> ' +
                    '<tr> ' +
                    '<td class="percent_tile" width="30">项目成员：</td> ' +
                    '<td class="percent_content" width="70"></td> ' +
                    '</tr> ' +
                    '<tr> ' +
                    '<td class="percent_tile" width="30">项目周期：</td> ' +
                    '<td class="percent_content" width="70"></td> ' +
                    '</tr> ' +
                    '<tr> ' +
                    '<td class="percent_tile" width="30">项目成果：</td> ' +
                    '<td class="percent_content" width="70"></td> ' +
                    '</tr> ' +
                    '<tr> ' +
                    '<td class="percent_tile" width="30">项目阶段：</td>' +
                    '<td class="percent_content" width="70"></td> ' +
                    '</tr> ' +
                    '</table> ' +
                    '</div> ' +
                    '</div>';
            }

            // $('#center_nav').html(navhtml);

            $('.personal_center_project').html(prohtml);
            project_big_event(pid);
            personal_center_project();
        }
    })
}


function project_big_event(pid) {
    if(!pid){
        $('.personal_center_project_big_event').css({'line-height':'160px','color':'#fff','text-align':'center'});
        $('.personal_center_project_big_event').html('暂无大事记！');
       return false;
    }
    $.ajax({
        url: "http://"+location.host+"/personal/project/get_big_event?"+new Date(),
        type: "POST",
        async: false,
        dataType: "json",
        data:{
          pid: pid
        },
        error:function(){
        },
        success: function(data){
            $('.personal_center_project_big_event').html('');
            var bightml = '<!--<div class="bg_img"><img src="./assets/img/timg.png" /> </div>--><a href="javascript:void(0)" class="personal_center_project_big_event_a" urls="./memorabilia_index.html">查看更多</a><ul>';
            if(data){
                $.each(data,function (key,val) {
                    //内容
                    if(val.true_name == null){
                        val.true_name ='';
                    }
                    bightml +=' <li title="'+val.start_time +' '+val.true_name +val.oper + val.mem_name+'"><i class="fa fa-ellipsis-v"></i>'+val.start_time +'    '+val.true_name +val.oper + val.mem_name+'</li>';
                })
            }else{
                $('.personal_center_project_big_event').css({'line-height':'160px','color':'#fff','text-align':'center'});
                $('.personal_center_project_big_event').html('暂无大事记！');
            }
            bightml += '</ul>';
            $('.personal_center_project_big_event').append(bightml);
        }
    })
}

//故障案例
function project_fault_case() {
    $.ajax({
        url: "http://"+location.host+"/personal/project/get_fault_case?"+new Date(),
        type: "POST",
        dataType: "json",
        error:function(){
        },
        success: function(data){
            if(data.length != 0){
                highchartEvent(data);
            }else{
                $('#containerS').css({'line-height':'160px','color':'#333'});
                $('#containerS').html('无故障案例统计！');
            }

        }
    })
}

//故障案例
function highchartEvent(data) {
    // 构建图表
    $('#containerS').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            backgroundColor: 'transparent'
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        title: {
            text: ''
        },
        tooltip: {
            headerFormat: '{series.name}<br>',
            pointFormat: '{point.name}: <b>{point.y}次</b>',
            style: {                      // 文字内容相关样式
                fontSize: "12px",
                lineHeight:"12px"
            } ,
            useHTML:true,
            formatter : function(){
                $("div.highcharts-tooltip span").css({"white-space":"inherit","width":'auto'});//允许换行
                //重新生成
                var percentage = !this.point.percentage ? this.point.percentage : this.point.percentage.toFixed(1);
                var content = '<div style="font-size: 10px;width: 200px;display:block;word-break: break-all;word-wrap: break-word;">' + this.key + '' +

                    '<span style="font-size:10px">'+ this.series.name+': <b>'+percentage+'%</b></span></div>';
                return content;
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>:  {point.y}次',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || '#fff'
                    },
                    shared: true,
                    useHTML: true,
                    connectorColor: 'silver'
                }
            }
        },
        series: [
            {
                type: 'pie',
                name: ' ',
                data: data,
                cursor: 'pointer',
                events: {
                    cursor: 'pointer',
                    click: function(event) {
                        $('#fault_case_library').find('a').click();
                    }
                }
            }
        ]
    });
}

function reminder_data() {
   /* //提醒数据
    var Project_reminders = new Vue({
        el: '.Project_reminders',
        data: {
            todos: [

            ]
        },
        mounted: function() {
            var thie = this;
            setTimeout(function () {
                $.ajax({
                    type: 'POST',
                    url:"http://"+location.host+"/personal/project/project_remind?"+new Date(),
                    success:function(data) {
                        thie.todos = data
                        thie.operation_monitoring =  data.length;
                    }
                });
            },0);
        }
    });

    //2--提醒数据
    var fault_case_reminders = new Vue({
        el: '.fault_case_reminders',
        data: {
            todos: [

            ]
        },
        mounted: function() {
            var thie = this;
            setTimeout(function () {
                $.ajax({
                    type: 'POST',
                    url:"http://"+location.host+"/personal/project/project_fault_case?"+new Date(),
                    success:function(data) {
                        thie.todos = data
                        thie.operation_monitoring =  data.length;
                    }
                });
            },0);
        }
    });

    //3--主页告警管理点击全部操作
    var operation_monitorings = new Vue({
        el: '.operation_monitorings',
        data: {
            todos: [

            ]
        },
        mounted: function() {
            var thie = this;
            setTimeout(function () {
                $.ajax({
                    type: 'POST',
                    url:"http://"+location.host+"/personal/tell_alarm_manage/get_tell_alarm_manage_lists_bottom?"+new Date(),
                    success:function(data) {
                        thie.todos = data;
                        thie.operation_monitoring =  data.length;
                    }
                });
            },0);
        }
    });

    //提醒数据
    var project_memberrs = new Vue({
        el: '.project_memberrs',
        data: {
            todos: [

            ]
        },
        mounted: function() {
            var thie = this;
            setTimeout(function () {
                $.ajax({
                    type: 'POST',
                    url:"http://"+location.host+"/personal/project/project_members_change?"+new Date(),
                    success:function(data) {
                        thie.todos = data
                        thie.operation_monitoring =  data.length;
                    }
                });
            },0);
        }
    })*/
}

//设备饼图
function equipment_chart(){
    $.ajax({
        url: "http://"+location.host+"/personal/project/get_equipment_pie?"+new Date(),
        type: "POST",
        dataType: "json",
        error:function(){
        },
        success: function(data){
            if(data.count == 0){
                $('#equipment_chart').css({'line-height':'160px','color':'#333','text-align':'center'});
                $('#equipment_chart').html('无设备统计！');
            }else{
                // 构建图表
                $('#equipment_chart').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        backgroundColor: 'transparent',
                        marginRight:15
                    },
                    colors:[
                        '#5cb85c',//第三个颜色
                        '#777',
                        '#337ab7', //。。。。
                        '#f0ad4e',//第二个颜色
                        '#d9534f'//

                    ],
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: ''
                    },
                    tooltip: {
                        headerFormat: '{series.name}<br>',
                        pointFormat: '{point.name}: <b>{point.y}台</b>',
                        style: {                      // 文字内容相关样式
                            fontSize: "12px",
                            lineHeight: "1px"
                        }

                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                distance: 0.3,
                                format: '<b>{point.name}</b>:{point.y}台',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                },
                                connectorColor: 'silver'
                            }
                        }
                    },
                    series: [
                        {
                            type: 'pie',
                            name: ' ',
                            data: data.pie,
                            cursor: 'pointer',
                            events: {
                                cursor: 'pointer',
                                click: function(event) {
                                    $('#equipment_status').find('a').click();
                                }
                            }
                        }
                    ]
                });
            }
        }
    });

}

//项目饼图
function project_chart(){
    $.ajax({
        url: "http://"+location.host+"/personal/project/get_project_pie?"+new Date(),
        type: "POST",
        dataType: "json",
        error:function(){
        },
        success: function(data){
            if(data[0].y == 0 && data[1].y == 0){
                $('#project_chart').css({'line-height':'160px','color':'#fff','text-align':'center'});
                $('#project_chart').html('无项目统计！');
            }else{
                // 构建图表
                $('#project_chart').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        backgroundColor: 'transparent'
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: ''
                    },
                    tooltip: {
                        headerFormat: '{series.name}<br>',
                        pointFormat: '{point.name}: <b>{point.y}个</b>',
                        style: {                      // 文字内容相关样式
                            fontSize: "12px",
                            lineHeight:"1px"
                        }

                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: false,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>:  {point.y} 个',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || '#fff'
                                },
                                connectorColor: 'silver',
                                textShadow:false
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: ' ',
                        data: data,
                        cursor: 'pointer',
                        events: {
                            cursor: 'pointer',
                            click: function(event) {
                                var current = event.point.name;
                                if(current == "已存档"){
                                    gisIndex = 3;
                                    gisType = '已存档'
                                }else if(current == "进行中"){
                                    gisIndex = 1;
                                    gisType = '进行中'
                                }else if(current == "已完成"){
                                    gisIndex = 2;
                                    gisType = '已完成'
                                }
                                $('#project_information').find('a').click();
                            }
                        }
                    }]
                });
            }

        }
    });

}


//查看更多
function personal_center_project(){

    $('.personal_center_project_a').unbind().bind('click',function(){

        $('#nav-accordion>li #project_information').find('a').click();

    });

    $('.personal_center_project_big_event_a').unbind().bind('click',function(){

        $('#nav-accordion>li #memorabilia_index').find('a').click();

    });
}


//地图缩放
function map_zoom(){
    if(numbers == 0){

        var projectH = $('#sidebar').height()-417;

        $('#map').height(615-44);
        $('#map').css('margin-bottom','0px');

        $('#map_left').removeClass('col-lg-12');
        $('#map_left').removeClass('col-md-12');
        $('#map_left').addClass('col-md-8');
        $('#map_left').addClass('col-lg-8');
        $('#map_left>div').css('padding-right','10px');

        $('#personal_content').css('padding-right','15px');

        $('#project_right').css('padding','0px 0px');

        $('#project_right').removeClass('col-lg-12');
        $('#project_right').removeClass('col-md-12');
        $('#project_right').addClass('col-md-4');
        $('#project_right').addClass('col-lg-4');

        $('#project_right>div>div').css({'margin-left':'0px','margin-right':'0px','width':'100%'});

        //缩小
        $('.map_discharge').unbind().bind('click',function(){

            $('#nav-accordion> #personal_center').find('a').click();

            numbers = 1;

        });
    }else if(numbers == 1){

        var homeH = $('#sidebar').height()-173;

        $('#map').height(homeH);
        $('#map').css('margin-bottom','13px');

        $('#map_left').removeClass('col-lg-8');
        $('#map_left').removeClass('col-md-8');
        $('#map_left').addClass('col-md-12');
        $('#map_left').addClass('col-lg-12');
        $('#map_left>div').css('padding-right','18px');
        $('#personal_content').css('padding-right','0px');

        $('#project_right').css('padding','0px 15px')

        $('#project_right').removeClass('col-lg-4');
        $('#project_right').removeClass('col-md-4');
        $('#project_right').addClass('col-md-12');
        $('#project_right').addClass('col-lg-12');

        $('#project_right>div>div').css({'width':'33.3%'});
        $('#project_right>div').find('.sn').css({'padding-right':'10px'});

        //放大
        $('.map_shrink').unbind().bind('click',function(){

            $('#nav-accordion> #personal_center').find('a').click();


            numbers = 0;
        });

    }


}

function loadData(){
    $.ajax({
        url: "http://"+location.host+"/personal/Waterfall/getWaterfallData?"+new Date(),
        type: "POST",
        dataType: "json",
        error:function(){
        },
        success: function (result) {
            if(result.status == "200") {

                var series = [];
                for(var i = 0; i < result.result.data.length; i++) {
                    var serie = {
                        type: 'line3D',
                        data: result.result.data[i],
                        lineStyle: {
                            opacity: 1,
                            width: 1,
                            color: "#28ff28"
                        },
                        animation: false
                    };
                    series.push(serie);
                }

                var option = {
                    series: series,
                    zAxis3D: {
                        max: Math.floor(result.result.max * 3)
                    },
                }
                chart.setOption(option);
            }
        }
    });
}

function createChart(){

    var graph = $("#graph");
    var width = graph.width();
    var height = graph.height();

    var boxWidth = width * 0.8;
    var boxHeight = height * 0.5;
    var boxDepth = 100;
    var left = 0;

    var option = {
        tooltip: {
            show: false
        },
        visualMap: {
            show: false,
            //max: 10,
            inRange: {
                //color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                color: ['#28ff28', '#28ff28']
            }
        },
        xAxis3D: {
            type: 'value',
            name: '',
            axisLabel:{
                textStyle: {
                    color: "#FFFFFF"
                }
            },
            axisLine: {
                lineStyle: {
                    opacity: 0.5,
                    width: 1
                }
            }

        },
        yAxis3D: {
            type: 'time',
            name: '',
            splitNumber: 1,
            axisLabel:{
                formatter: function(timestamp){
                    var val = getDateStr(timestamp);
                    return val;
                },
                textStyle: {
                    color: "#FFFFFF"
                }
            },
            axisLine: {
                lineStyle: {
                    opacity: 0.5,
                    width: 1
                }
            }
        },
        zAxis3D: {
            type: 'value',
            name: '',
            splitNumber: 2,
            max: 70,
            axisLabel:{
                textStyle: {
                    color: "#FFFFFF"
                }
            },
            axisLine: {
                lineStyle: {
                    opacity: 0.5,
                    width: 1
                }
            }
        },
        grid3D: {
            boxWidth: boxWidth,
            boxHeight: boxHeight,
            boxDepth: boxDepth,
            left: left,
            environment: '#000',
            splitArea: {
                show: false,
                areaStyle: {
                    color: ['rgba(250,250,250,0.3)','rgba(200,200,200,0.3)']
                }
            },
            axisPointer: {
                show: false,
            },
            light: {
                main: {
                    intensity: 1,
                    shadow: false
                },
                ambient: {
                    intensity: 1
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#9D9D9D'],
                    opacity: 0.3
                }
            },
            distance: 0,
            viewControl: {
                autoRotate: false,
                zoomSensitivity: 0,
                rotateSensitivity: 0,
                animation: false,
                alpha: 0,//30,
                beta: 0
            }
        }
    }


    chart.setOption(option);
    loadData();
}
function getDateStr(timestamp) {
    var date = new Date(timestamp);

    var year = date.getFullYear();
    var month = date.getMonth();
    month++;
    if(month < 9) {
        month = "0" + month;
    }
    var day = date.getDate();
    if(day < 9) {
        day = "0" + day;
    }

    var hour = date.getHours();
    if(hour < 9) {
        hour = "0" + hour;
    }
    var minute = date.getMinutes();
    if(minute < 9) {
        minute = "0" + minute;
    }
    var second = date.getSeconds();
    if(second < 9) {
        second = "0" + second;
    }

    var millisecond = date.getMilliseconds();

    //var val = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" +second + "." + millisecond;
    var val = minute + ":" +second + "." + millisecond;
    return val;
}