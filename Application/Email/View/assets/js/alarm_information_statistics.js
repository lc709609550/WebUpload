/**
 * Created by BHZXZbaibing on 2017/5/12.
 */
var chartdataDcolumns = new Array();
var chartdataHighchartPie = new Array();
var docH = $(document).height()-306;
var factory_name = '';
$(function(){
    $("#fountainG").show();
    // 权限按钮的显示
    if (auth.length != 0) {
        $('#alarm_info_auth_btn').html('');
        $.each(auth, function (index, dome) {
            var bun = '';
            if (dome.type == 'select') {
                bun = '<button type="button"  id="search" class="btn btn-primary query alarm_information_statistics_query" onclick="alarm_info_select()">'+dome.title+'</button>　';
            } else if (dome.type == 'export') {
                bun = '<button type="button" id="export" class="btn btn-primary  export alarm_information_statistics_export" onclick="alarm_info_export()">'+dome.title+'</button>　';
             }
            $('#alarm_info_auth_btn').append(bun);
        });
    }
    // 初始化下拉框列表
    get_select();

     factory_name = $('#factory_name').val();
     $('.title').html(factory_name+" - 报警信息统计");

        chart_show(factory_name);


});


function chart_show(factory_name){
    $.ajax({
        url: "http://"+location.host+"/report/alarm_info/createChartsInfo?"+new Date(),
        type: "POST",
        async: true,
        data: {factory_name:factory_name},
        dataType: "json",
        error:function(){
        },
        success: function(data){

            if(data.length == 0){
                $('#message').css('display','block');
                $("#fountainG").hide();
                return false;
            }

            if(data.parent[0].y !=0){

                $('#message').css('display','none');

                    //柱状图
                    alarm_information_statistics_column(data.parent);
                    //饼图
                    alarm_information_statistics_pie(data.child);

                    $("#fountainG").hide();
         }else{

                $('#message').css('display','block');
                    return false;
            }


        }
    })


}

//柱状图
function alarm_information_statistics_column(data){
    var chartpie = new Highcharts.Chart('column',{
        chart: {
            height: '350',
            type: 'column',
            backgroundColor:'#fff'
        },
        exporting:{
            enabled:false
        },
        credits: {
            enabled: false
        },
        title: {
            text: data[0].factory_name
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            allowDecimals:false,
            title: {
                text: ''
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    style : {
                        'fontSize' : '16px'
                    },
                    format: '{point.y}'
                }
            },

            column : {
                pointWidth:150,
                dataLabels : {
                    enabled : true,
                    style : {
                        'fontSize' : '16px'
                    },
                },
                events:{
                    click: function(e) {
                        $('.alarm_information_statistics_table').show();
                        //表格
                        alarm_information_statistics_table(e.point['project_name']);
                    }
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}:{point.y}</span>'
        },
        series: [{
            name: '报警信息统计',
            colorByPoint: true,
            data: data
//            color:'#4ECDC4'
        }]

    });
    chartdataHighchartPie.push(chartpie.getSVG());

}
//饼图
function alarm_information_statistics_pie(data){
    var chartpie = new Highcharts.Chart('pie',{
        chart: {
            height: '350',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            backgroundColor:'#fff'
        },
        exporting:{
            enabled:false
        },
        credits: {
            enabled: false
        },
        title: {
            text: '设备级别报警统计'
        },
        tooltip: {
            headerFormat: '{series.name}<br>',
            pointFormat: '{point.name}: <b>{point.y}次</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled : true,
                    style : {
                        'fontSize' : '16px'
                    },
                    // fontSize:20,
                    // distance:-130,//标签居中显示
                    // enabled: true,

                    format: '{point.name}: {point.y}次 '
                    // style: {
                    //     color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                    //     fontSize : '22px'
                    //
                    //
                    // }
                },
                events:{
                    click: function(e) {
                        $('.alarm_information_statistics_table').show();
                        //表格
                         alarm_information_statistics_table(e.point['name']);
                    }
                }
            },
            dataLabels: {
                enabled: true
            }

},
        series: [{
            type: 'pie',
            name: '统计次数',
            data: data,
            borderColor: null
        }]
    });
    chartdataDcolumns.push(chartpie.getSVG());
}




//报警信息统计--查询
function alarm_info_select(){

    $('.alarm_style').attr("style","height:auto");


     factory_name = $('#factory_name').val();
    $('.title').html(factory_name+" - 报警信息统计");

    $('.alarm_information_statistics_column').html('');

    $('.alarm_information_statistics_pie').html('');

    $('.alarm_information_statistics_table').hide();
    //每次查询后清空之前的图  导出(否则回导出上次的图)
    chartdataHighchartPie = new Array();
    chartdataDcolumns = new Array();
    chart_show(factory_name);

}
//报警信息统计--导出
function alarm_info_export(){
    var info = chartdataHighchartPie.concat(chartdataDcolumns);
    if(info.length == 0){
        block('无数据!',2000);
        return false;
    }
    var Piechart = {
        Higdata: info,
        generalName: '柱状图：'
    };
    var url =  "http://"+location.host+"/report/alarm_info/exportCharrsInfo?";
    fileDownload(url,{'data':Piechart});
}


/**
 * 文件导出，下载操作
 * @param url：远程请求地址
 * @param Params post请求参数
 */

function fileDownload(url, Params) {

    if (Params) {
        $.ajax({
            type: "POST",
            Datatype: "json",
            url: url,
            data: Params,
            cache: false,
            async: true,
            success: function (data) {

                if (data.status == 'error') {
                    artDialog.alert(data.status);
                    unblock();
                } else if (data.status == 'success') {
                    unblock();
                    artDialog.confirm("点击确定下载", function () {
                        window.location.href = data.url;
                    });
                }
            },
            error: function (XMLHttpRequest, textStatus) {

                unblock();
                artDialog.alert("页面请求错误，请联系系统管理员！\n" + textStatus);
            }
        });
    }
}

//初始化下拉框搜索数据
function  get_select(){
    $.ajax({
        url: "http://"+location.host+"/report/alarm_info/getProjectNanme?"+new Date(),
        type: "GET",
        async: false,
        dataType: "json",
        success:function(data){

            //大于6条数据加滚动条
            if(Object.keys(data).length>6){

                    $('#factory_text').css({"height":"210px",'overflow':'auto'});
            }else{
                $('#factory_text').css({"height":"auto"});
            }
            var options = '';

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

                $('#factory_name').val(factory_name);


            $(this).parents('#factory_text').hide();
        }
    })
    $('.equipment_down').unbind().bind('click',function () {
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
//表格
function alarm_information_statistics_table(equipment){
    //计算表格高度及条数
    var widths = $('.alarm_information_statistics_table').width();
    var heights = $('#sidebar').height()  - 128;
    var jqTableH = heights - $('#alarm_information_statistics .headers').outerHeight(true) - $('.alarm_information_statistics_wrapper>h3').outerHeight(true) - $('#alarm_information_statistics_container').outerHeight(true)-85;
    var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35);
    jqTableH = Math.floor(jqTableH) < 180 ? 180 : Math.floor(jqTableH);
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    $("#alarm_information_statistics_jqGridList").jqGrid({
        url: "http://"+location.host+"/report/alarm_info/getJqGridInfo?"+new Date(),
        datatype: "json",
        mtype: "POST",
        page: 1,
        styleUI : 'Bootstrap',
        postData: {equipment:equipment,factory_name:factory_name},
        hoverrows: true,
        height: jqTableH,
        width:widths,
        rownumbers: false, //是否显示行数
        multiselect: false,//复选框
        viewrecords: true,//显示记录
        pginput:true,
        pgtext: "第{0}页 / 共{1}页",
        loaduis: 'enable',
        rowNum:tableNumber,
        autoheight:true, //自动拉伸高度
        //autowidth:true, //自动拉伸宽度
        colModel: [
            { label: '序号', name: 'equipment_uuid',hidden:true,width: 100,align:'center'},
            { label: '项目名称', name: 'factory_name',width: 100, align:'center'},
            { label: '设备名称', name: 'equipment_name',width: 100 ,align:'center'},
            // { label: '设备编号', name: 'equipment_id', width: 100,align:'center'},
            { label: '测点名称', name: 'fault_name', width: 100,align:'center'},
            { label: '开始时间', name: 'start_time', width: 150,align:'center'},
            { label: '结束时间', name: 'end_time', width: 150,align:'center'},
        ],
        pager: '#alarm_information_statistics_jqGridPager',
        gridComplete: function () {
        }

    });


    $("#alarm_information_statistics_jqGridList").jqGrid('setGridParam',
        {
            datatype: 'json',
            postData: {equipment:equipment,factory_name:factory_name},
            page : 1
        }).trigger("reloadGrid");
}