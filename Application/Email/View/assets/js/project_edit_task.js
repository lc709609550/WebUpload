/**
 * Created by BHZXZbaibing on 2017/5/15.
 */
$(function(){
    //时间插件
    //时间插件
    var start = {
        format: 'YYYY-MM-DD',
        minDate: '2014-06-16', //设定最小日期为当前日期
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
        format: 'YYYY-MM-DD',
        minDate: $.nowDate({DD:0}), //设定最小日期为当前日期
        // festival:true,
        isinitVal:true,
        maxDate: '2099-06-16', //最大日期
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

    get_task_user_info();
    if(rowId){
        $.ajax({
            url: "http://" + location.host + "/project/project_details/update_info?" + new Date(),
            type: "POST",
            async: false,
            data: {t_id:rowId},
            dataType: "json",
            error:function(){

            },
            success: function(data){
                $("#task_name").val(data.task_name);
                $("#p_id").val(data.p_id);
                $("#j_id").val(data.j_id);
                var stage='';
                $.each(data.all,function (k,v) {
                    stage +="<option value="+k+">"+v+"</option>";
                });
                $('#task_stage').html(stage);
                $("#task_stage").val(data.j_id);

                if(data.task_status == '新建'){
                    data.task_status = 0;
                }else if(data.task_status == '进行中'){
                    data.task_status = 1;
                }else if(data.task_status == '已关闭'){
                    data.task_status = 2;
                }else if(data.task_status == '已解决'){
                    data.task_status = 3;
                }
                $("#task_status").val(data.task_status);
                $("#task_per").val(data.task_per);
                $("#task_import").val(data.task_import);
                $("#task_describe").val(data.task_describe);
                $("#task_user").val(data.task_user);
                $("#task_fruit").val(data.task_fruit);
                $("input[name='task_starttime']").val(data.task_starttime);
                $("input[name='task_endtime']").val(data.task_endtime);
                if(data.task_member != null){
                    var task_member = data.task_member.split(',');
                    $.each(task_member,function (k,v) {
                        $('#task_member input:checkbox[value="'+v+'"]').attr("checked","true");
                    })
                }
            }
        });

        $.ajax({
            url: "http://" + location.host + "/project/project_details/get_task_file?" + new Date(),
            type: "POST",
            async: false,
            data: {
                id:rowId
            },
            dataType: "json",
            error: function () {

            },
            success: function (result) {
                $.each(result,function(k,v){
                    var add_file_html = '<div  id="' + v.f_id + '" class="item"> ' +
                        '<div class="form-group clear"> ' +
                        '<div class="col-lg-9">' +
                        '<div class="oldfilename">' + v.oldfilename + '</div>' +
                        '</div>' +
                        '<button type="button" class="btn btn-default col-lg-1 file_remove" file_e="'+ v.id +'" style="margin-right:5px">删除</button> ' +
                        '<a href="javascript:void (0)" hrefs="' + v.filepath + '" class="btn btn-success col-lg-1  down_doc">下载</a>' +
                        '</div>';
                    $('#defaultFid').append(add_file_html);
                })
                //删除
                $('.file_remove').unbind().bind('click',function(){
                    $(this).parents('.item').remove();
                });
                //下载
                $('.down_doc').click(function () {
                    var hrefs = $(this).attr('hrefs');
                    var file_name = $(this).parent().children('div').children('div').text();
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
            }
        });
    }

    /*$('#addSave').unbind('click').click(function () {
        var postData = serializeForm('task_add');
        postData = $.extend(postData,{id:rowId});
        $.ajax({
            url: "http://" + location.host + "/project/project_details/update?" + new Date(),
            type: "POST",
            async: false,
            data: postData,
            dataType: "json",
            error:function(){

            },
            success: function(data){
                block(data.message,1000);
                if(data['code']<400) {
                    $("#project_details_jqGridList").jqGrid('setGridParam', {
                        datatype: 'json',
                        page: 1
                    }).trigger("reloadGrid");
                    get_project_speed(BHXZ_PROJECT.project_details,BHXZ_PROJECT.project_satge);
                    $('#taskAddModal').modal('hide');
                }
            }
        });
    });*/
});

function get_task_user_info() {
    $.ajax({
        url:"http://"+location.host+"/project/project_details/get_task_user_info?"+new Date(),
        type:"POST",
        async:false,
        data:{'id':BHXZ_PROJECT.project_details},
        dataType: "json",
        error:function(){

        },
        success: function(result){
            var taskHtml = "<option value=''>请选择</option>";
            var taskUserHtml = "";
            $.each(result,function (k,v) {
                var task_user = v.split(":");
                taskHtml += "<option value='"+task_user[1]+"'>"+task_user[1]+"</option>";
                taskUserHtml += '<div class="radio"> <label> <input type="checkbox" name="task_member" value="'+task_user[1]+'">'+task_user[1]+' </label></div>';
            });
            $('#task_user').html(taskHtml);
            $('#task_member').html(taskUserHtml);
        }
    })
}