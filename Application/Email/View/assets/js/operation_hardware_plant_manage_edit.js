/**
 * js   系统管理>用户列表
 * user   dingyingcheng
 * date   2017-05-10
 */
$(function(){
    //编辑页面的初始化赋值
    $.each(hardware_plant_manage_edit_data,function(key,val){
        $("#edit_" + key,parent.document).val(val).attr("title", val);
    });
    $('#hardware_plant_manage_edit_save').unbind().bind('click',function(){
        var edit_data = {
            'id':$('#edit_id').val(),//服务器名称
            'server_name':$('#edit_server_name').val(),//服务器名称
            'server_code':$('#edit_server_code').val(),//服务器型号
            'disk_size':$('#edit_disk_size').val(),//硬盘大小
            'memory_size':$('#edit_memory_size').val(),//硬盘大小
            'CPU':$('#edit_CPU').val(),//CPU
            'IP':$('#edit_IP').val(),//IP地址
            'factory':$('#edit_factory').val(),//生产厂家
            'unit':$('#edit_unit').val(),//所属单位
            'leader':$('#edit_leader').val(),//负责人
            'phone':$('#edit_phone').val(),//联系方式
            'remark':$('#edit_remark').val()//备注
        };
        hardware_plant_manage_edit_save(edit_data)
    })
});

function hardware_plant_manage_edit_save(add_data){
    $.ajax({
        url: "http://"+location.host+"/operation/hardware_plant_manage/hardware_plant_manage_edit_save?"+new Date(),
        type: "POST",
        async: false,
        data: add_data,
        dataType: "json",
        error:function(){
        },
        success: function(data){
            if(data.code>400){
                block(data.message,2000);
            }else{
                block(data.message,2000);
                $('#technicalEditModal').modal('hide');
                $("#jqGridList").jqGrid('setGridParam', {
                    url: "http://"+location.host+"/operation/hardware_plant_manage/getRows?"+new Date(),
                    page: 1
                }).trigger("reloadGrid");
            }
        }
    })
}
