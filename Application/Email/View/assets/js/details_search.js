/**
 * Created by BHZXZbaibing on 2017/5/24.
 */
var index = 0;
var digit = 0;
var loadingTask=null;
$(function () {

    var sidebarH = $('#sidebar').height();
    $('#details_search_s').css('min-height', sidebarH - 118);
    $('.details_search_contents').show();
    //搜索点击
    if (header_searchVal != '') {
        $('.search_box').css({'margin-top': '2%'});
        $('.search_left').removeClass('col-sm-3');
        $('#search').val(header_searchVal);

        details_search_nav(header_searchVal);

    } else {

        details_search_nav('');

    }
});

function details_search_nav(searchVal) {
    var docs = 0,imgs = 0,videos = 0,cases = 0;
    //搜索数据统计
    $.ajax({
        url: "http://" + location.host + "/search/index/search_doc?" + new Date(),
        dataType: "json",
        async: false,
        data: {'q': searchVal, 'type': 'doc'},
        type: "GET",
        success: function (req) {
            $('#totalDoc').html(req.records);
            docs = req.records
        }
    })

    $.ajax({
        url: "http://" + location.host + "/search/index/search_doc?" + new Date(),
        dataType: "json",
        async: false,
        data: {'q': searchVal, 'type': 'images'},
        type: "GET",
        success: function (req) {

            $('#totalImg').html(req.records);
            imgs = req.records
        }
    })

    $.ajax({
        url: "http://" + location.host + "/search/index/search_doc?" + new Date(),
        dataType: "json",
        async: false,
        data: {'q': searchVal, 'type': 'video'},
        type: "GET",
        success: function (req) {
            $('#totalVideo').html(req.records);
            videos = req.records
        }
    })

    $.ajax({
        url: "http://" + location.host + "/search/index/search_doc?" + new Date(),
        dataType: "json",
        async: false,
        data: {'q': searchVal, 'type': 'case'},
        type: "GET",
        success: function (req) {

            $('#totalCase').html(req.records);

            cases = req.records
        }
    })

    var totals = docs + imgs + videos + cases;

    $('#totals').html(totals);

    $('.details_search_nav li a').unbind().bind({

        'click': function () {
            $('.pagination').hide();
            index = $(this).parents('li').index();
            indexT = index;
            $(this).css({'border-bottom': '2px solid #0000CC', 'color': '#000', 'font-weight': 'bold'});

            $(this).parents('li').siblings().find('a').css({
                'border-bottom': 'none',
                'color': '#333',
                'font-weight': 'inherit'
            });

            var lists = $(this).attr('lest');

            $('#search_result>div').hide();

            $('#search_result>div').eq(index).show();

            $.ajax({
                url: "http://" + location.host + "/search/index/search_doc?" + new Date(),
                dataType: "json",
                async: false,
                data: {'q': searchVal, 'type': lists, page: 1, rows: 10},
                type: "GET",
                success: function (req) {
                    if (req.records == 0) {
                        $('.details_search_ul').html('');
                        $('#details_search_images .details_search_images').html('');
                        $('#details_search_video .details_search_video').html('');
                        $('.pagination').hide();
                        return false;
                    } else {
                        var aId = '';
                        if (lists == 'doc') {
                            aId = '#details_search_file'
                        } else if (lists == 'images') {
                            aId = '#details_search_images'
                        } else if (lists == 'video') {
                            aId = '#details_search_video'
                        }else if (lists == 'case') {
                            aId = '#details_search_case'
                        }
                        var page_html = '';
                        if(req.total>10){
                            $('.pagination').width((req.total)*35)
                        }else {
                            $('.pagination').width("auto")
                        }
                        for (var i = 1; i <= req.total; i++) {

                            page_html += '<li><a href="#">' + i + '</a></li>';
                        }

                        $(aId + ' .pages').html(page_html);

                        if (req.records > 10) {
                            $('.pagination').show();
                        }

                        $(aId + ' .pagination li .pages li').unbind().bind('click', function () {

                            $(this).siblings('li').removeClass('active');

                            $(this).addClass('active');

                            var pages = $(this).find('a').html();

                                digit = pages-1;

                            var Y = $(this).position().left-137;

                            if(pages%5 == 0){
                                $('.pages').css('left', '-'+Y+'px');
                            }
                            get_search(searchVal, lists, pages, 10);

                        });

                        $(aId + ' .pagination li .pages li').eq(0).trigger('click');

                        $(aId + ' .pagination .previous').unbind().bind('click', function () {

                            digit--;

                            if (digit < 0) {

                                digit = 0

                            }
                            ;

                            $(aId + ' .pagination li .pages li').eq(digit).click();
                            if(req.records/10>10) {

                                var left = parseInt($('.pages').css('left'));

                                var width = parseInt($('.pages>.active').width());

                                if (Math.abs(left) > 35) {

                                    $('.pages').css('left', left + width);

                                } else {

                                    $('.pages').css('left', 0);

                                }
                            }
                        });

                        $(aId + ' .pagination .next').unbind().bind('click', function () {
                            digit++;

                            var dig = $(aId + ' .pagination li .pages li').length - 1;

                            if (digit > dig) {

                                digit = dig;

                            }

                            $(aId + ' .pagination li .pages li').eq(digit).click();

                            if(req.records/10>10){

                                var nums = Math.abs((req.total)*35-364);

                                var left = parseInt($('.pages').css('left'));

                                var width = parseInt($('.pages>.active').width());

                                if(Math.abs(left)< nums){

                                    $('.pages').css('left',left-width);

                                }else {

                                    $('.pages').css('left','-'+nums+'px');

                                }
                            }


                        });
                    }
                }
            })


        }
    });
    if(docs != 0){
        $('.details_search_nav li a').eq(0).trigger('click');
    }else if(imgs != 0){
        $('.details_search_nav li a').eq(1).trigger('click');
    }else if(videos != 0){
        $('.details_search_nav li a').eq(2).trigger('click');
    }else if(cases != 0){
        $('.details_search_nav li a').eq(3).trigger('click');
    }else{
        $('.details_search_nav li a').eq(indexT).trigger('click');
    }



}


function get_search(q, type, page, rows) {

    $.ajax({

        url: "http://" + location.host + "/search/index/search_doc?" + new Date(),
        dataType: "json",
        async: true,
        data: {"q": q, type: type, page: page, rows: rows},
        type: "GET",
        success: function (req) {
            if (req.records == 0) {
                $('.details_search_ul').html('');
                $('#details_search_images .details_search_images').html('');
                $('#details_search_video .details_search_video').html('');
                return false;

            }

            var reqHtml = '';

            if (type == 'doc') {

                $.each(req.rows, function (k, v) {

                    var arrs = v.title.split('.');
                    var len = arrs.length - 1;
                    var l, r;
                    if (arrs[len] == 'xlsx' || arrs[len] == 'xls') {
                        l = -193;
                        r = -1243;
                    } else if (arrs[len] == 'txt') {
                        l = -193;
                        r = -1180;
                    } else if (arrs[len] == 'ppt') {
                        l = -193;
                        r = -1138;
                    } else if (arrs[len] == 'pdf') {
                        l = -193;
                        r = -1075;
                    }

                    reqHtml += '<ol> ' +
                        '<div class="details_search_body"> ' +
                        '<h4><span class="ic ic-doc" style="background-position:' + l + 'px ' + r + 'px"></span>' + v.title + '</h4> ' +
                        '<p>' + v.hit + '</p> ' +
                        '<span>' + v.upload_time + '</span>' +
                        '<p class="details_search_download clear">' +
                        '<a href="javascript:void (0)" hrefs="' + v.url + '" class="btn btn-success down_doc">马上下载</a>' +
                        '</p>' +
                        ' </div> ' +
                        '</ol>';

                });

                $('.details_search_ul').html(reqHtml);

                //文档下载
                $('.down_doc').click(function () {

                    var hrefs = $(this).attr('hrefs');
                    var file_name = $(this).parent().parent().children('h4').text();

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


                $('.details_search_body>h4').unbind().bind('click',function(){
                    var hrefs = $(this).siblings('.details_search_download ').find('a').attr('hrefs');

                    $.ajax({

                        url: "http://" + location.host + "/search/index/read_pdf?" + new Date(),
                        type: "POST",
                        data: {'hrefs': hrefs},
                        success: function (result) {
                            if (result.code === 200) {
                                var taskattr = hrefs.split(".");
                                window.open("/ui/pdf.html?pdf="+taskattr[0]+'.pdf');
                            } else {
                                block(result.msg,2000);
                            }

                        }
                    });
                });
            } else if (type == 'images') {

                $.each(req.rows, function (k, v) {
                    reqHtml +=  '<a class="pic"  href="' + v.file_path + '" target="_blank" >' +
                        '<img src="' + v.thumb_path + '">' +
                        '<span title="' + v.title + '" class="title hover">' + v.title + '</span>' +
                        '</a>';
                });

                $('#details_search_images .details_search_images').html(reqHtml);

                $('#image').justifiedGallery({
                    rowHeight :180,
                    lastRow : 'nojustify',
                    margins :5
                });

                $('#image').show();
                $('.pic').unbind().bind({
                    'mouseover':function(){
                        $(this).find('.hover').show();
                    },
                    'mouseout':function() {
                        $(this).find('.hover').hide();
                    }
                })

            } else if (type == 'video') {

                $.each(req.rows, function (k, v) {

                    reqHtml += '<a class="pic"  href="javascript:void (0)" file_path = "' + v.file_path + '" thumb_path="' + v.thumb_path + '" file_title ="' + v.title + '">' +
                        '<img src="' + v.thumb_path + '">' +
                        '<span title="' + v.title + '" class="title hover">' + v.title + '</span>' +
                        '</a>'
                });

                $('#details_search_video .details_search_video').html(reqHtml);
                $('#videos').justifiedGallery({
                    rowHeight :180,
                    lastRow : 'nojustify',
                    margins :5
                });

                $('#videos').show();

                $('.pic').unbind().bind({
                    'click':function () {
                    var file_url = $(this).attr('file_path');
                    var file_img = $(this).attr('thumb_path');
                    var file_title = $(this).attr('file_title');
                    $('.modalWrap').html('');
                    $.ajax({
                        'url': './project_details_video.html',
                        "type": "GET",
                        'success': function (data) {
                            $('.modalWrap').html(data);
                            $('.modal-title').html(file_title);
                            $(document).ready(function () {
                                $("#jquery_jplayer_1").jPlayer({
                                    ready: function () {
                                        $(this).jPlayer("setMedia", {
                                            title: "Big Buck Bunny",
                                            m4v: file_url,
                                            poster: file_img
                                        });
                                    },
                                    swfPath: "assets/js/jPlayer/dist/jplayer",
                                    supplied: "webmv, ogv, m4v",
                                    size: {
                                        width: "751px",
                                        height: "350px",
                                        cssClass: "jp-video-360p"
                                    },
                                    useStateClassSkin: true,
                                    autoBlur: false,
                                    smoothPlayBar: true,
                                    keyEnabled: true,
                                    remainingDuration: true,
                                    toggleDuration: true
                                });

                            });
                            $('#project_details_videoModel').modal('show');

                            $('#project_details_videoModel').on('hidden.bs.modal', function () {
                                $('#project_details_video').html('');
                            })
                        }
                    });
                },
                'mouseover':function(){
                    $(this).find('.hover').show();
                },
                'mouseout':function() {
                    $(this).find('.hover').hide();
                }
            })

            }else if(type == 'case'){

                    $.each(req.rows, function (k, v) {
                        var jsHtml = '';
                        var jsons = JSON.parse(v.files_info);
                        $.each(jsons,function(k,v){
                            jsHtml+='<a href="javascript:void (0)" hrefs="' + v + '" class="down_doc">'+k+'</a>&nbsp;，&nbsp;';
                        });
                        reqHtml += '<ol> ' +
                            '<div class="details_search_body"> ' +
                            '<h4>' + v.title + '</h4> ' +
                            '<p>故障测点：' + v.point_name + '，故障开始时间:'+ v.start_time+'，故障结束时间：'+ v.end_time+'</p> ' +
                            '<p style="width: 100%;word-break: break-all;">关联文档：'+jsHtml+'</p> ' +
                            '<p class="details_search_download clear">'+
                            '<a href="javascript:void (0)" class="btn btn-success detaileds" style="margin-left: 15px" equipmentUuid = "'+v.equipmentUuid+'"  start="'+v.start_time+'" end="'+v.end_time+'" >详细分析</a>' +
                            '<a href="javascript:void (0)"  class="btn btn-success trendAnalysis" equipmentUuid = "'+v.equipmentUuid+'" pointUuid = "'+v.pointUuid+'" start="'+v.start_time+'" end="'+v.end_time+'" alarmStatus = "'+v.alarm_status+'">' +
                            '趋势分析</a>' +
                        '</p>' +
                            ' </div> ' +
                            '</ol>';

                    });
                    $('.details_search_case').html(reqHtml);
                    //关联文档下载
                    $('.down_doc').click(function () {
                        var hrefs = $(this).attr('hrefs');
                        var file_name = $(this).text();
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
                    $('.trendAnalysis').unbind().bind('click',function(){
                        var equipmentUuid = $(this).attr('equipmentUuid');
                        var pointUuid = $(this).attr('pointUuid');
                        var starts = $(this).attr('start').lastIndexOf(".");
                        var start = $(this).attr('start').substring(0,starts);
                        var ends = $(this).attr('end').lastIndexOf(".") ;
                        var end = $(this).attr('end').substring(0,ends) ;
                        var alarmStatus = $(this).attr('alarmStatus');
                        //绘制弹窗
                        $('.modalWrap').html('');
                        $.ajax({
                            url: './pop_chart.html',
                            type: "GET",
                            dataType: 'html',
                            success: function (data) {
                                $('.modalWrap').html(data);
                                $('#mirror_field').val(start);
                                $('#mirror_fields').val(end);
                                $('#technicalEditModal').modal('show');

                                var parameters ={
                                    equipmentUuid:equipmentUuid,
                                    pointUuid:pointUuid,
                                    start:start,
                                    End:end,
                                    alarm_status:alarmStatus
                                }

                                ajaxData(parameters);

                                Onclick(parameters);

                                $('#technicalEditModal').on('hide.bs.modal', function () {
                                    $("#fountainG").hide();
                                });

                            }
                        });
                    })
                    //跳转状态监测
                    $('.detaileds').unbind().bind('click', function () {
                        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
                        if (userAgent.toUpperCase().indexOf("MSIE") <= -1 && userAgent.indexOf("Trident/7.0") <= -1 && userAgent.indexOf("Edge") <= -1 )  {
                            block('该功能只能在ie下使用!', 2000);
                        }else{
                            var equipmentUuid = $(this).attr('equipmentUuid');
                            startTime = $(this).attr('start');
                            endTime = $(this).attr('end');
                            $.ajax({
                                url: "http://" + location.host + "/project/fault_case/get_equipment_info?" + new Date(),
                                type: "POST",
                                data: {
                                    'equipmentUuid': equipmentUuid
                                },
                                dateType: "josn",
                                async: false,
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

        }
    });
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
