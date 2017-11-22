/**
 * js   系统管理>用户列表
 * user   dingyingcheng
 * date   2017-05-10
 */
$(function(){
/*    $(".form_datetime").datetimepicker({
        weekStart: 1,
        startView: 2,
        minView: 4,
        language: 'zh-CN',
        format: "yyyy-mm",
        showMeridian: true,
        autoclose: true,
        todayBtn: true
    });*/
    $(".form_datetime").datetimepicker({
        startView:3,
        minView: 3,//设置只显示到月份
        initialDate: new Date(),//初始化当前日期
        language: 'zh-CN',
        format: "yyyy-mm",
        autoclose: true,
    });
    $('#actionLog_cha_ok').unbind().bind('click',function(){
        var update_time = $('#update_time').val();//修改时间
        var user_name = $('#user_name').val();//修改人
        var module_name = $('#module_name').val();//模块名称
        if(user_name || module_name){
            if(update_time == ''){
                artDialog.alert("修改时间不得为空！");
                return false;
            }
        }

        var cha_data = {
            'module_name':module_name,
            'user_name':user_name,
            'update_time':update_time
        };
        $('#action_log_search').modal('hide');
        $("#jqGridList").jqGrid('setGridParam', {
            url: "http://"+location.host+"/admin/action_log/get_actionLog_infos?"+new Date(),
            postData:cha_data,
            page: 1
        }).trigger("reloadGrid");
    })
});
