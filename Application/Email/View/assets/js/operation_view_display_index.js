/**
 * js   运维监控>视图展示
 * js   operation   view_display
 * user   dingyingcheng
 * date   2017-05-10
 */

$(function () {
    //A1获取主机名称
    get_host_name();
});
//A1获取主机名称
function get_host_name() {
    $.ajax({
        url: "http://" + location.host + "/operation/view_display/index?" + new Date(),
        type: "get",
        async: false,
        dataType: "json",
        error: function () {
        },
        success: function (data) {
            if(data.length > 0){
                var host_names = '';
                $.each(data, function (k, v) {
                    host_names += "<li class='' host=" + v.hostid + "><a href='#'>" + v.name + "</a></li>";
                });
                $('#view_display_nav').html(host_names);
                //A2默认第一个tab页点击
                first_host_click();
            }else{
                artDialog.alert("服务器状态初始化失败");
                return false;
            }
        }
    })
}
//A2默认第一个tab页点击
function first_host_click() {
    $('#view_display_nav li').unbind().bind('click', function () {
        var index = $(this).index();
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        $('#view_display>section').hide();
        $('#view_display>section').eq(index).show();
        //var names = $(this).find('a').html();
        var hostid = $(this).attr('host');//获取主机的hostid
        //A3获取该主机的详细信息
        get_host_info(hostid);
    });
    $('#view_display_nav li').eq(0).trigger('click');
}
//A3获取该主机的详细信息
function get_host_info(names) {
    $.ajax({
        url: "http://" + location.host + "/operation/view_display/get_host_info?" + new Date(),
        type: "POST",
        async: false,
        dataType: "json",
        data: {hostid: names},
        error: function () {
        },
        success: function (data) {
            var database_switchings = ' <section class="wrapper container-fluid" id="database_switching1"> ' +
                '<div class="row equipment_occupancy"> ' +
                '<div class="col-sm-3 equipment_occupancy_right"> ' +
                '<div class="darkblue-panel pns"> ' +
                '<i class="fa fa-circle equipment_occupancy_state view_status_' + data.data_per_status + '"></i> ' +
                '<img src="assets/img/darkblue-panel'+data.data_per_status+'.png" style="width: 35px;position: absolute;left: 15px;top: 15px;">' +
                '<div id="database_switching_chart1" style="height:370px"></div> ' +
                '<p> ' +
                '<span><i class="fa fa-square" style="color: #00A900;"></i>空闲</span> ' +
                //'<span><i class="fa fa-square" style="color: #0A0C10;"></i>异常</span> ' +
                '<span><i class="fa fa-square" style="color: #FE0002;"></i>占用</span> ' +
                //'<span><i class="fa fa-square" style="color: #B0ACA9;"></i>未格式化</span> ' +
                '</p> ' +
                '</div> ' +
                '</div> ' +
                '<div class="col-sm-9"> ' +
                '<div class="pnq row"> ' +
                '<div class="col-md-4 col-sm-4 pne equipment_occupancy_right"> ' +
                '<div class="darkblue-panel pne"> ' +
                    //'<i class="fa fa-circle equipment_occupancy_state equipment_occupancy_danger"></i> ' +
                '<p class="darkblue-panel_header"><span>' + data.disk_total + '</span></p> ' +
                '<p class="darkblue-panel_content"><i class="fa fa-save"></i>系统总空间</p> ' +
                '</div> ' +
                '</div> ' +
                '<div class="col-md-4 col-sm-4 pne equipment_occupancy_right"> ' +
                '<div class="darkblue-panel pne"> ' +
                    //'<i class="fa fa-circle equipment_occupancy_state equipment_occupancy_danger"></i> ' +
                '<p class="darkblue-panel_header"><span>' + data.data_total + '</span></p> ' +
                '<p class="darkblue-panel_content"><i class="fa fa-save"></i>数据总量</p> ' +
                '</div> ' +
                '</div> ' +
                '<div class="col-md-4 col-sm-4 pne"> ' +
                '<div class="darkblue-panel pne"> ' +
                '<i class="fa fa-circle equipment_occupancy_state view_status_' + data.data_per_status + '"></i> ' +
                '<p class="darkblue-panel_header"><span>' + data.data_per + '</span>%</p> ' +
                '<p class="darkblue-panel_content"><i class="fa fa-save"></i>数据占用</p>' +
                '</div> ' +
                '</div> ' +
                '</div> ' +
                '<div class="darkblue-panel pnw"> ' +
                '<table style="width:100%;height:100%;font-size:15px;color:white" border="1">'+
                '<tr>'+
                '<td rowspan="3" style="width:31.5%;font-size:24px;">结构化数据占用</td>'+
                '<td>柴油机</th>'+
                '<td>内燃机</th>'+
                '<td>燃气轮机</th>'+
                '<td>空压机</th>'+
                '<td>电机</th>'+
                '<td>齿轮箱</th>'+
                '</tr>'+
                '<tr>'+
                '<td>' + data.cyj + '</td>'+
                '<td>' + data.nrj + '</td>'+
                '<td>' + data.rqlj + '</td>'+
                '<td>' + data.kyj + '</td>'+
                '<td>' + data.dj + '</td>'+
                '<td>' + data.clx + '</td>'+
                '</tr>'+
                '</tr>'+
                '<tr>'+
                '<td>' + data.cyj_per +"%" + '</td>'+
                '<td>' + data.nrj_per +"%" + '</td>'+
                '<td>' + data.rqlj_per + "%" +'</td>'+
                '<td>' + data.kyj_per +"%" + '</td>'+
                '<td>' + data.dj_per + "%" +'</td>'+
                '<td>' + data.clx_per +"%" + '</td>'+
                '</tr>'+
                '<tr style="font-size:24px;">'+
                '<td>IP</td>'+
                '<td colspan="6" >' + data.ip + '</td>'+
                '</tr>'+
                '</table>'+



                /*'<p class="ip_head"><span style="float:left;margin-left:40px;">设备占用</span> <span>IP</span>　　<span>' + data.ip + '</span></p><p class="ip_content">' +
                '<span>柴油机:<em class="equipment_occupancy_success">' + data.cyj + '</em></span> ' +
                '<span>　内燃机:<em class="equipment_occupancy_success">' + data.nrj +  '</em></span> ' +
                '<span>　燃气轮机:<em class="equipment_occupancy_success">' + data.rqlj + '</em></span> ' +
                '<span>　空压机:<em class="equipment_occupancy_success">' + data.kyj + '</em></span> ' +
                '<span>　电机:<em class="equipment_occupancy_success">' + data.dj + '</em></span> ' +
                '<span>　齿轮箱:<em class="equipment_occupancy_success">' + data.clx +  '</em></span> ' +
                '</p>' +
                '<p class="ip_content">' +
                '<span>柴油机:<em class="equipment_occupancy_success">' + data.cyj_per + "%" + '</em></span> ' +
                '<span>　内燃机:<em class="equipment_occupancy_success">' + data.nrj_per + "%" + '</em></span> ' +
                '<span>　燃气轮机:<em class="equipment_occupancy_success">' + data.rqlj_per + "%" + '</em></span> ' +
                '<span>　空压机:<em class="equipment_occupancy_success">' + data.kyj_per + "%" + '</em></span> ' +
                '<span>　电机:<em class="equipment_occupancy_success">' + data.dj_per + "%" + '</em></span> ' +
                '<span>　齿轮箱:<em class="equipment_occupancy_success">' + data.clx_per + "%" + '</em></span> ' +
                '</p>'+*/
                //'<p class="equipment_occupancy_rightB">HD</p>' +
                '</div> ' +
                '</div> ' +
                '</div> ' +
                '<div class="row"> ' +
                '<div class="col-sm-4 equipment_occupancy_right"> ' +
                '<div class="darkblue-panel pns"> ' +
                '<i class="fa fa-circle equipment_occupancy_state view_status_' + data.cpu_use_lv_1_status + '"></i> ' +
                '<p class="darkblue-panel_header darkblue-panel_heades">CPU</p> ' +
                '<p class="darkblue-panel_content">' + data.cpu_use_lv_1 + '%</p> ' +
                '<p  class="equipment_occupancy_rightB">14核2.60GHz</p> ' +
                '</div> ' +
                '</div> ' +
                '<div class="col-sm-4 equipment_occupancy_right"> <div class="darkblue-panel pns"> ' +
                '<i class="fa fa-circle equipment_occupancy_state view_status_' + data.memory_pused_status + '"></i> ' +
                '<p class="darkblue-panel_header darkblue-panel_heades">内存</p> <p class="darkblue-panel_content">' + data.memory_pused + '%</p> ' +
                '<p  class="equipment_occupancy_rightB">' + data.memory_used + '/' + data.memory_total + '</p> </div> </div> <div class="col-sm-4"> ' +
                '<div class="pns net_temp"> ' +
                '<div class="darkblue-panel net"> ' +
                '<i class="fa fa-circle equipment_occupancy_state view_status_' + data.net_down_status + '"></i> ' +
                '<p class="darkblue-panel_header">网络</p> <p class="darkblue-panel_content">' + data.net_up + '/' + data.net_down + '</p> ' +
                '</div> ' +
                '<div class="darkblue-panel temp"> ' +
                '<i class="fa fa-circle equipment_occupancy_state view_status_' + data.temperature_status + '"></i> ' +
                '<p class="darkblue-panel_header">温度</p> <p class="darkblue-panel_content">' + data.temperature + '℃' + '</p> ' +
                '</div> ' +
                '</div> ' +
                '</div> ' +
                '</div>' +
                '</section>';
            $('#view_display').html(database_switchings);
            //A4渲染环形图
            annular_chart(data);
        }
    })
}
//A4渲染环形图
function annular_chart(data) {
    var disk_free_per = parseFloat(data.disk_free_per,5);
    var data_per = parseFloat(data.data_per,5);
    var highchartW = $('.equipment_occupancy_right').width();
    $('#database_switching_chart1').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            backgroundColor: 'transparent',
            height: 375,
            width: highchartW,
            spacing: [100, 0, 40, 0]
        },
        colors:[
            '#00A900',//空闲，欢迎加入Highcharts学习交流群294191384
            //'#0A0C10',//异常
            '#FE0002',//占用
            //'#B0ACA9'//未格式化
            ],
        title: {
            floating: true,
            text: ''
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        /*        tooltip: {
         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
         },*/
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                /*   dataLabels: {
                 enabled: false,
                 format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                 style: {
                 color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || '#000'
                 }
                 }*/
                dataLabels: {
                    enabled: true,
                    distance: -23,
                    // format: '{point.percentage:.f} %',
                    style: {
                        fontWeight: 'bold',
                        color: 'white'
                        //textShadow: '0px 1px 2px black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            innerSize: '60%',
            name: '',
            data: [
                {name: '空闲', y: disk_free_per},
                //{name: '异常', y: 25.0},
                {name: '占用', y: data_per}
                //{name: '未格式化', y: 0.49961},
            ]
        }]
    }, function (c) {
        // 环形图圆心
        /*        var centerY = '',
         titleHeight = '';
         c.setTitle({
         y:centerY + titleHeight/2
         });
         chart = c;*/
    });
}










