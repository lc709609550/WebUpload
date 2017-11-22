/**
 * Created by BHZXZbaibing on 2017/5/11.
 */
var stage_name;
var attrs = {};
var typeB;
var rowId;
var indexSign = 0;
var indexQ = 0;
$(function () {

    //获取当前进度 阶段id

    if(jId == ''){
        $.ajax({
            url:"http://"+location.host+"/project/project_details/get_sid_info?"+new Date(),
            type:"POST",
            data:{
                'p_id':BHXZ_PROJECT.project_details
            },
            dateType:"josn",
            async:false,
            success:function (result) {
                jId = result;
            }
        });
    }

    //返回
    project_details_return();

    //导航事件
    detailsImgClick(indexSign);

    //项目阶段
    phase_information();

    $('#file_down').unbind('click').click(function () {
        var selr = $('#project_details_jqGridList').getGridParam('selarrrow');

        if (!isEmpty(selr)) {
            block("文件创建中...");
            $.ajax({
                url: "http://" + location.host + "/project/project_details/get_file_down?" + new Date(),
                type: "POST",
                async: false,
                data: {ids: selr},
                dataType: "json",
                success: function (result) {
                    if (result.status == 'error') {
                        artDialog.alert(data.info);
                        unblock();
                    } else if (result.status == 'success') {
                        unblock();
                        artDialog.confirm("点击确定下载", function () {
                            window.location.href = result.url;
                        });
                    }
                },
                error: function (XMLHttpRequest, textStatus) {
                    unblock();
                    artDialog.alert("页面请求错误，请联系系统管理员！\n" + textStatus);
                }

            })
        }

    });

    $('#file_del').unbind('click').click(function () {
        var selr = $('#project_details_jqGridList').getGridParam('selarrrow');
        if (selr.length > 1) {
            artDialog.alert('只能删除一条!');
            return false;
        }else{
            art.dialog({
                title: '消息',
                content: '是否删除此条记录！',
                icon: 'warning',
                button:[{
                    name:'取消',
                    callback:function(){}
                }],
                ok: function(){
                    if (!isEmpty(selr)) {
                        $.ajax({
                            url: "http://" + location.host + "/project/project_details/get_file_del?" + new Date(),
                            type: "POST",
                            async: false,
                            data: {ids: selr},
                            dataType: "json",
                            success: function (result) {
                                block(result.message, 1000);
                                if (result.code < 400) {
                                    var heights = $('#main-content').height();

                                    var jqTableH = heights - $('.project_details_task_phase_header').outerHeight(true) - $('#project_details .headers').outerHeight(true) - 100;

                                    $('.project_details_big_event').height(heights - $('.project_details_task_phase_header').outerHeight(true) - $('#project_details .headers').outerHeight(true)-17);

                                    $(".project_details_big_event").mCustomScrollbar({
                                        live:true,
                                        theme:"minimal"
                                    });
                                    var is = 35*5;
                                    if(jqTableH< is){
                                        jqTableH = 188;
                                    }

                                    var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35) ;

                                    $("#project_details_jqGridList").setGridHeight(jqTableH);
                                    $("#project_details_jqGridList").jqGrid('setGridParam',
                                        {
                                            url: "http://" + location.host + "/project/project_details/index?" + new Date(),
                                            datatype: 'json',
                                            postData: {
                                                'p_id': BHXZ_PROJECT.project_details,
                                                'j_id': BHXZ_PROJECT.project_satge,
                                                't_id': BHXZ_PROJECT.project_task
                                            },
                                            page: 1,
                                            rowNum: tableNumber
                                        }).trigger("reloadGrid");
                                    $('.btn_subset').hide();
                                }
                            },
                            error: function (XMLHttpRequest, textStatus) {
                                artDialog.alert("页面请求错误，请联系系统管理员！\n" + textStatus);
                            }

                        })
                    }
                }
            });
        }

    });
    $('.project_details_essential_information input').attr('disabled', 'disabled');
    $('.project_details_essential_information textarea').attr('disabled', 'disabled');
});
//导航事件
function detailsImgClick(indexSign) {
    $.ajax({
        url: "http://" + location.host + "/project/project_details/get_project_stage?" + new Date(),
        type: "POST",
        async: true,
        data: {id: BHXZ_PROJECT.project_details},
        dataType: "json",
        error: function () {

        },
        success: function (result) {
            $('#project_id').val(result.project_id);
            $('#project_name').val(result.project_name);
            $('#project_name_top').html(result.project_name);
            $('#project_summary').val(result.project_summary);
            $('#project_type').val(result.project_type);
            $('#project_import').val(result.project_import);
            $("input[name='project_starttime']").val(result.project_starttime);
            $("input[name='project_endtime']").val(result.project_endtime);
            $('#project_fruit').val(result.project_fruit);
            $('#project_user').val(result.true_name);
            $('#parent_pro').val(result.parent_pro);
            $('#project_province').val(result.province_name);
            $('#project_city').val(result.name);
            $('#close_project').val(result.is_close);
            if (result.is_close == 1) {
                $('#close_project').html('重启项目');
            } else {
                $('#close_project').html('关闭项目');
            }

            var project_membersArr = result.project_members;

            BHXZ_PROJECT.project_name = result.project_name;

            if (project_membersArr != null) {
                var project_members_html = '';
                $.each(project_membersArr, function (k, v) {
                    var project_members = v.split(':');
                    project_members_html += '<div class="col-lg-6"> ' +
                        '<input class=" form-control" type="text" value="' + project_members[0] + '" required=""> ' +
                        '</div>' +
                        '<div class="col-lg-6"> ' +
                        '<input class=" form-control" type="text" value="' + project_members[1] + '" required=""> ' +
                        '</div>';
                });
                $('#project_members').html(project_members_html);
            }

            var project_other_membersArr = result.project_other_members;

            if (project_other_membersArr != null) {
                var project_other_members_html = '';
                $.each(project_other_membersArr, function (k, v) {
                    var project_other_members = v.split(':');
                    project_other_members_html += '<div class="col-lg-6"> ' +
                        '<input class=" form-control" type="text" value="' + project_other_members[0] + '" required=""> ' +
                        '</div>' +
                        '<div class="col-lg-6"> ' +
                        '<input class=" form-control" type="text" value="' + project_other_members[1] + '" required=""> ' +
                        '</div>';
                });
                $('#project_other_members').html(project_other_members_html);
            }

            var arrs = ['项目信息'];

            var abs = [];

            var starttime = result.project_stage_starttime;

            $.each(result.project_phase, function (k, v) {
                arrs.push(v.stage_name);
                abs.push(v.sid);
            });

            var attrs = ['fa-folder', 'fa-file', 'fa-tasks', 'fa-road', 'fa-check', 'fa-certificate'];
            var detailsHtml = '';
            $('.project_schedule_details ul').html('');
            // var numb = 0;
            var colors = '#428BCA';
            for (var i = 0; i < arrs.length; i++) {

                // ++numb;

                if (i == 0) {
                    detailsHtml += '<li> ' +
                        // '<em>' + numb + '</em> ' +
                        '<p class="details_img">' +
                        '<i class="fa ' + attrs[i] + '" style="color:'+colors+'"></i>' +
                        '</p> ' +
                        '<p class="details_p">' + arrs[i] + '</p> ' +
                        '<p class="details_p">' + result.project_starttime + '</p>' +
                        '</li>';
                } else {
                    var starttimes = '';
                    if (starttime[i - 1][0]) {
                        starttimes = starttime[i - 1][0];
                    }

                    if(attrs[i] ==  undefined || attrs[i] == null){
                        attrs[i] = 'fa-upload';
                    }

                    if(starttimes != ''){
                        detailsHtml += '<li as="'+abs[i - 1]+'"> ' +
                            // '<em>' + numb + '</em> ' +
                            '<input type="hidden" value="' + abs[i - 1] + '">' +
                            '<p class="details_img">' +
                            '<i class="fa ' + attrs[i] + '" style="color:'+colors+'"></i>' +
                            '</p> ' +
                            '<p class="details_p">' + arrs[i] + '</p> ' +
                            '<p class="details_p">' + starttimes + '</p>' +
                            '<div  style="color:'+colors+'"><i class="fa fa-ellipsis-h"></i>&nbsp;<i class="fa fa-ellipsis-h"></i><i class="fa fa-play"></i></div> ' +
                            '</li>';
                    }else{
                        detailsHtml += '<li as="'+abs[i - 1]+'"> ' +
                            // '<em>' + numb + '</em> ' +
                            '<input type="hidden" value="' + abs[i - 1] + '">' +
                            '<p class="details_img">' +
                            '<i class="fa ' + attrs[i] + '"></i>' +
                            '</p> ' +
                            '<p class="details_p">' + arrs[i] + '</p> ' +
                            '<p class="details_p">' + starttimes + '</p>' +
                            '<div><i class="fa fa-ellipsis-h"></i>&nbsp;<i class="fa fa-ellipsis-h"></i><i class="fa fa-play"></i></div> ' +
                            '</li>';
                    }

                }

            }
            $('.project_schedule_details ul').html(detailsHtml);

            detailsLen = $('.project_schedule_details ul li').length;
            var wh = 100 / detailsLen < 9 ? 9 : 100 / detailsLen;

            $('.project_schedule_details ul li').css('width', ''+wh+'%');



            //点击事件
            $('.project_schedule_details ul li .details_img').unbind().bind('click', function () {

                var index = $(this).parents('li').index();
                //进度样式
                $(this).siblings('.details_p').css('color', '#d9534f');
                $(this).parent().siblings('li').find('.details_p').css('color', '#333');

                indexSign = index;

                $('.btn_subset').hide();

                BHXZ_PROJECT.project_satge = $(this).prev('input').val();

                stage_name = $(this).next('p').text();

                $('.project_details_big_event .project_details_big_ul').html('');

                project_details_big_event();

                $('#project_details_nav li a').unbind().bind('click',function(){
                    $(this).parent().addClass('active');
                    $(this).parent().siblings().removeClass('active');
                    indexQ = $(this).parent().index();
                   if(indexQ == 0){
                        $('.project_details_jqGrid_wrapper').show();
                        $('.project_details_big_event').hide();
                   }else if(indexQ == 1){
                       $('.project_details_jqGrid_wrapper').hide();
                       $('.project_details_big_event').show();
                   }
                })

                // $(this).parents('li').find('em').css('color','#FA3600');

                // $(this).parents('li').siblings().find('em').css('color','#000');

                if (index == 0) {
                    $('.project_details_task_phase').hide();
                    $('.project_details_essential_information').show();
                    $('.project_schedule_text').html('项目信息');
                    $('.project_schedule_percentage').html('');
                    $('.project_details_big_event').hide();
                } else {
                    if(indexQ == 0){
                        $('.project_details_jqGrid_wrapper').show();
                        $('.project_details_big_event').hide();
                    }else if(indexQ == 1){
                        $('.project_details_jqGrid_wrapper').hide();
                        $('.project_details_big_event').show();
                    }
                    $('.project_details_essential_information').hide();

                    $('.project_details_task_phase').show();
                    typeB = result.is_close;

          /*          if (result.is_close == 1) {
                        $('.project_details_task_phase_header').hide();
                    }*/

                    get_project_speed(BHXZ_PROJECT.project_details, BHXZ_PROJECT.project_satge);

                    $('.upper_level ').hide();

                    //计算表格高度及条数
                    var heights = $('#main-content').height();

                    var jqTableH = heights - $('.project_details_task_phase_header').outerHeight(true) - $('#project_details .headers').outerHeight(true) - 100;

                    $('.project_details_big_event').height(heights - $('.project_details_task_phase_header').outerHeight(true) - $('#project_details .headers').outerHeight(true)-17);

                    $(".project_details_big_event").mCustomScrollbar({
                        live:true,
                        theme:"minimal"
                    });
                    var is = 35*5;
                    if(jqTableH< is){
                        jqTableH = 188;
                    }

                    var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35) ;

                    $("#project_details_jqGridList").setGridHeight(jqTableH);

                    $("#project_details_jqGridList").jqGrid('setGridParam',
                        {
                            url: "http://" + location.host + "/project/project_details/index?" + new Date(),
                            datatype: 'json',
                            postData: {
                                'p_id': BHXZ_PROJECT.project_details,
                                'j_id': BHXZ_PROJECT.project_satge,
                                't_id': '',
                                'f_id': ''
                            },
                            page: 1,
                            rowNum: tableNumber
                        }).trigger("reloadGrid");

                }
            });


            $.each($('.project_schedule_details ul li'),function(k,v){
                if($(v).attr('as') == jId){

                    var url = "http://" + location.host + "/project/project_details/index?" + new Date();

                    $(v).find('.details_img').click();

                    pId == '' ? pId = BHXZ_PROJECT.project_details : pId = pId;

                    phase_information(url,pId,jId,tId,fId);

                    pId = '';

                    jId = '';

                    tId = '';

                    fId = '';

                    return false;

                }else if(jId == '' ||  jId == null && $(v).attr('as') == undefined){

                    $('.project_schedule_details ul li .details_img').eq(indexSign).trigger('click');

                }
            });
        }
    })
}

function get_project_speed(project_id, jid) {
    $.ajax({
        url: "http://" + location.host + "/project/project_details/get_project_speed?" + new Date(),
        type: "POST",
        async: false,
        data: {id: project_id, jid: jid},
        dataType: "json",
        error: function () {

        },
        success: function (result) {
            $('.project_schedule_text').html(stage_name + '执行中');
            if (result == '100%') {
                $('.project_schedule_text').html(stage_name + '已完成');
            }
            $('.project_schedule_percentage').html(result);
        }
    });
}
//大事件
function project_details_big_event() {

    $.ajax({
        url: "http://" + location.host + "/project/project_details/get_task_memorabilia?" + new Date(),
        data: {
            'p_id': BHXZ_PROJECT.project_details,
            'j_id': BHXZ_PROJECT.project_satge
        },
        type: "POST",
        async: false,
        dataType: "json",
        success: function (result) {
            $('.project_details_big_event .project_details_big_ul').html('');
            var bigEventHtml = '';
             for (var i = 0; i < result.length; i++) {
             if(result[i].classification == null){
                 result[i].classification = '';
             }
             if (i == 0) {
                 if(result[i].type == null){
                     bigEventHtml += '<ol style="color: #FA3600;font-weight: bold;"> ' +
                         '<i class="fa fa-dot-circle-o" style="font-weight: bold"></i>' +
                         '<span>' +
                         '<em>' + result[i].start_time + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].true_name + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].oper + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].classification + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].mem_name + '</em>' +
                         '</span> ' +
                         '<strong></strong> ' +
                         '</ol>';
                 }else if(result[i].type == 1){
                     bigEventHtml += '<ol style="color: #FA3600;font-weight: bold;"> ' +
                         '<i class="fa fa-dot-circle-o" style="font-weight: bold"></i>' +
                         '<span>' +
                         '<em>' + result[i].start_time + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].classification + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].oper + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].mem_name + '</em>' +
                         '</span> ' +
                         '<strong></strong> ' +
                         '</ol>';
                 }

             } else if (i == result.length - 1) {
                 if(result[i].type == null){
                     bigEventHtml += '<ol style="height: 20px"> ' +
                         '<i class="fa fa-dot-circle-o"></i>' +
                         '<span>' +
                         '<em>' + result[i].start_time  + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].true_name  + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].oper + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].classification + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].mem_name + '</em>' +
                         '</span> ' +
                         '</ol>';
                 }else if(result[i].type == 1){
                     bigEventHtml += '<ol style="height: 20px"> ' +
                         '<i class="fa fa-dot-circle-o"></i>' +
                         '<span>' +
                         '<em>' + result[i].start_time  + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].classification + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].oper + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].mem_name + '</em>' +
                         '</span> ' +
                         '</ol>';
                 }

             } else {
                 if(result[i].type == null){
                     bigEventHtml += '<ol> ' +
                         '<i class="fa fa-dot-circle-o"></i>' +
                         '<span>' +
                         '<em>' + result[i].start_time  + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].true_name  + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].oper + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].classification + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].mem_name + '</em>' +
                         '</span> ' +
                         '<strong></strong> ' +
                         '</ol>';
                 }else if(result[i].type == 1){
                     bigEventHtml += '<ol> ' +
                         '<i class="fa fa-dot-circle-o"></i>' +
                         '<span>' +
                         '<em>' + result[i].start_time  + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].classification + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].oper + '</em>&nbsp;&nbsp;' +
                         '<em>' + result[i].mem_name + '</em>' +
                         '</span> ' +
                         '<strong></strong> ' +
                         '</ol>';
                 }

             }

             }

            $('.project_details_big_event .project_details_big_ul').html(bigEventHtml);
        }
    });
}
//项目阶段
function phase_information(url,pId,jId,tId,fId) {
    //计算表格高度及条数
    var heights = $('#main-content').height();

    var jqTableH = heights - $('.project_details_task_phase_header').outerHeight(true) - $('#project_details .headers').outerHeight(true) - 100;

    $('.project_details_big_event').height(heights - $('.project_details_task_phase_header').outerHeight(true) - $('#project_details .headers').outerHeight(true)-17);

    $(".project_details_big_event").mCustomScrollbar({
        live:true,
        theme:"minimal"
    });
    var is = 35*5;
    if(jqTableH< is){
        jqTableH = 188;
    }

    var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35) ;

    var mainW = $('#main-content').width() - 42;

    $("#project_details_jqGridList").jqGrid({
        url: url || '',
        datatype: "json",
        postData: {
            'p_id': pId,
            'j_id':jId,
            't_id':tId,
            'f_id':fId
        },
        type: "GET",
        styleUI: 'Bootstrap',
        hoverrows: true,
        height:jqTableH,
        width: mainW,
        multiselect: true,//复选框
        viewrecords: true,//显示记录
        pginput: true,
        pgtext: "第{0}页 / 共{1}页",
        loaduis: 'enable',
        rowNum: tableNumber,
        autoheight: true, //自动拉伸高度
        colModel: [
            {label: 'id', name: 'id', index: 'id', hidden: true, align: 'center', key: true},
            {label: '任务名称', name: 'task_name', index: 'task_name', width: 100, align: 'center'},
            {label: '指派给', name: 'task_user', index: 'task_user', width: 100, align: 'center'},
            {label: '状态', name: 'task_status', index: 'task_status', width: 100, align: 'center'},
            {label: '优先级', name: 'task_import', index: 'task_import', width: 100, align: 'center'},
            {label: '进度 %', name: 'task_per', index: 'task_per', width: 100, align: 'center'},
            {label: '开始日期', name: 'task_starttime', index: 'task_starttime', width: 100, align: 'center'},
            {label: '计划完成日期', name: 'task_endtime', index: 'task_endtime', width: 100, align: 'center'}
        ],
        pager: '#project_details_jqGridPager',
        gridComplete: function (rowid) {

        }
    }).navGrid('#project_details_jqGridPager', {edit: false, add: false, del: false, search: false, refresh: false});
    if(powerId != 3 && typeB != 1){
        findUserPower();
    }
}

/*
 * function：判断用户权限，增加相应的操作按钮
 * input：无
 * return：操作按钮
 * date：2014-8-6
 */
function findUserPower() {
    $('#project_details_jqGridPager_left').find('.ui-pg-table').children('tbody').children('tr').html('');//操作按钮容器的清空--避免按钮重复出现
    $("#project_details_jqGridList").navButtonAdd('#project_details_jqGridPager', {
        caption: "新建任务",
        icon: '',
        onClickButton: function () {
            new_project();
        },
        position: "first"
    });
    //导出EXCEL
    $("#project_details_jqGridList").navButtonAdd('#project_details_jqGridPager', {
        caption: "编辑",
        icon: '',
        onClickButton: function () {

            project_oldfileEvent();

        },
        position: "last"
    });
}

//编辑事件
function project_oldfileEvent() {
    var ids = $("#project_details_jqGridList").jqGrid('getGridParam', 'selarrrow');
    rowId  = $("#project_details_jqGridList").jqGrid('getRowData', ids).id;
    if (ids.length > 1 || ids.length == 0) {
        block('请选择一个任务!',1000);
        return false;
    }else{
        $('.modalWrap').html('');
        $.ajax({
            'url': './project_edit_task.html',
            "type": "GET",
            'success': function (data) {
                $('.modalWrap').html(data);
                $('#taskAddModal').modal('show');
            }
        });
    }
}
//任务新建
function new_project() {

    $('.modalWrap').html('');
    $.ajax({
        'url': './project_new.html',
        "type": "GET",
        //'data':{rows:rows},
        'success': function (data) {
            $('.modalWrap').html(data);
            $('#taskAddModal').modal('show');
            $('#task_stage').val(stage_name);
            $('#p_id').val(BHXZ_PROJECT.project_details);
            $('#j_id').val(BHXZ_PROJECT.project_satge);
        }
    });
}


//返回
function project_details_return() {
    $('.project_details_return').unbind().bind('click', function () {
        BHXZ_PROJECT = {
            'project_details': '',//项目id
            'project_name': '',//项目名称
            'project_satge': '',//项目阶段
            'project_task': '',//任务阶段
            'project_parent': ''//文件id对应的任务
        };
        $('#project_information').find('a').click();
        $('#jump_page').hide();
        $('#home_page').show();
    });
}







