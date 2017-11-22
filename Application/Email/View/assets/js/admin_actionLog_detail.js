/**
 * js   系统管理>日志管理--查看详情
 * user   dingyingcheng
 * date   2017-05-10
 */
$(function(){
        $.ajax({
            url: "http://"+location.host+"/admin/action_log/get_detail?"+new Date(),
            data:{id_table:table_id},
            type: "POST",
            success:function (data) {
                $('#actionLog_detail_info').html('');
                $('#actionLog_detail_info').html(data);
            },
            error:function(){
                return false;
            }
        });
});
