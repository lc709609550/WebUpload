/**
 * Created by BHZXglc on 2017/5/17.
 */
var chartdataDcolumns = new Array();
var chartdataHighchartPie = new Array();
var numa = 0,numb = 5;
var factory_name = '';
$(function(){
    $("#fountainG").show();
    var heights = $('#main-content').height();
    $('#fault_type_statistics_container').height(heights - $('#fault_type_statistics .headers').outerHeight(true) - $('#fault_type_statistics h3').outerHeight(true)-4)
    //权限按钮的显示
    if (auth.length != 0) {
        $('#fault_type_auth_btn').html('');
        $.each(auth, function (index, dome) {
            var bun = '';
            if (dome.type == 'select') {
                bun = '<button type="button" class="btn btn-primary query fault_type_statistics_query" onclick="fault_type_select()">'+dome.title+'</button>　';
            } else if (dome.type == 'export') {
                bun = '<button type="button" id="export" class="btn btn-primary export fault_type_statistics_export" onclick="fault_type_export()">'+dome.title+'</button>　';
            }
            $('#fault_type_auth_btn').append(bun);
        });
    }

    //初始化下拉框列表
    get_select();

    factory_name = $('#factory_name').val();
    $('.title').html(factory_name+' - 故障类型统计');

    chart_show(factory_name,numa,numb);

    //设置滚动加载
        $('#fault_type_statistics_container').scroll(function(){
            //校验数据请求
            if(getCheck()){
                numa = numa+5;
                numb = numb+5;
                $("#fountainG").show();
                chart_show(factory_name,numa,numb);
            }
        });
        /**
         * 数据请求检验
         */
        function getCheck(){
            var documentH =  document.getElementById('fault_type_statistics_container').clientHeight;
            var scrollH = document.getElementById('fault_type_statistics_container').scrollTop;
            return documentH+scrollH>=getLastH() ?true:false;
        }
        /**
         * 获得最后一个box所在列的高度
         */
        function getLastH(){
            var boxs = $('#fault_type_statistics_container .row');

            return boxs[boxs.length-1].offsetTop+boxs[boxs.length-1].offsetHeight-157;
        }

});

function chart_show(factory_name,numa,numb){

    $.ajax({
        url: "http://"+location.host+"/report/fault_type/createChartsInfo?"+new Date(),
        type: "POST",
        async: true,
        data: {factory_name:factory_name},
        dataType: "json",
        error:function(){
        },
        success: function(data){
            var fault_type_container_html = '';
            if(data.length == 0){
                $('#message').css('display','block');
                $("#fountainG").hide();
                return false;
            }

            if(data.parent.length != 0){
              $('#message').css('display','none');

              for(var i = numa;i< data.count;i++){
                if(i==0){

                    fault_type_container_html = '<p>分厂级故障类型次数统计</p><div class="row">' +
                        '<div class="col-lg-6 fault_type_statistics_column" id="column_'+i+'"></div>' +
                        '<div class="col-lg-6 fault_type_statistics_pie" id="pie_'+i+'"></div>' +
                        '</div>';

                    $('.fault_type_statistics_total').append(fault_type_container_html);

                    if(data.count != 1){
                        $('.fault_type_statistics_branch').html('<p>设备级故障类型次数统计</p>')
                    }

                }else if(i >= numa && i < numb){
                    fault_type_container_html = '<div class="row">' +
                        '<div class="col-lg-6 fault_type_statistics_column" id="column_'+i+'"></div>' +
                        '<div class="col-lg-6 fault_type_statistics_pie" id="pie_'+i+'"></div>' +
                        '</div>';

                    $('.fault_type_statistics_branch').append(fault_type_container_html);
                }


                if(i == 0){
                    statistical_chart('column_'+i+'','pie_'+i+'',data.parent,data.parent[0].equipment_name);
                }else if(i >= numa && i < numb){
                    statistical_chart('column_'+i+'','pie_'+i+'',data.child[i-1],data.child[i-1][0].equipment_name);
                }

            }
              $("#fountainG").hide();
          }else{
             $('#message').css('display','block');
              return false;
          }

        }
    })

}

function statistical_chart(column_id,pie_id,data,name){
    //柱状图
    fault_type_statistics_column(column_id,data,name);
    //饼图
    fault_type_statistics_pie(pie_id,data,name);
}
//柱状图
function fault_type_statistics_column(id,data,name){
    var chartpie = new Highcharts.Chart(id,{
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
            text: name
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
                    format: ''
                }
            },
            column : {
                maxPointWidth: 150,
                dataLabels : {
                    enabled : true,
                    style : {
                        'fontSize' : '16px'
                    }
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:13px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>'
        },
        series: [{
//            name: '报警信息统计',
            colorByPoint: true,
            data: data
//            color:'#4ECDC4'
        }]

    });
    chartdataHighchartPie.push(chartpie.getSVG());

}
//饼图
function fault_type_statistics_pie(id,data,name){

    var chartpie = new Highcharts.Chart(id,{
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
            text: name
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
                    fontSize:20,
//                    distance:-55,//标签居中显示
                    enabled: true,
                    format: '{point.name}: {point.y}次',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize : '18px'
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
            data: data
        }]
    });
    chartdataDcolumns.push(chartpie.getSVG());
}






/*- 导出 -*/
function fault_type_export() {


    var info = chartdataHighchartPie.concat(chartdataDcolumns);
    if(info.length == 0){
        block('无数据!',2000);
        return false;
    }
    var Piechart = {
        Higdata: info,
        generalName: '柱状图：'
    };
    var url = "http://" + location.host + "/report/fault_type/exportCharrsInfo?";
    fileDownload(url, {'data': Piechart});
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
        url: "http://"+location.host+"/report/fault_type/getProjectNanme?"+new Date(),
        type: "GET",
        async: false,
        dataType: "json",
        success:function(data){


            //大于6条数据加滚动条
            if(data.length>6){
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
//查询方法
function fault_type_select(){
    $('.fault_style').attr("style","height:auto");

    factory_name = $('#factory_name').val();
    $('.title').html(factory_name+' - 故障类型统计');



    $('.fault_type_statistics_total').html('');

    $('.fault_type_statistics_branch').html('');

    //每次查询后清空之前的图  导出(否则回导出上次的图)
    chartdataHighchartPie = new Array();
    chartdataDcolumns = new Array();
    numa = 0;
    numb = 5;
    chart_show(factory_name,numa,numb);


}