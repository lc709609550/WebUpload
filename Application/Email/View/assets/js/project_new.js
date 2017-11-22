/**
 * Created by BHZXZbaibing on 2017/5/15.
 */
$(function(){
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
    /*$('#addSave').unbind('click').click(function () {
        var postData = serializeForm('task_add');
        $.ajax({
            url: "http://" + location.host + "/project/project_details/save?" + new Date(),
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
            var taskHtml = "<option value=''>全部</option>";
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