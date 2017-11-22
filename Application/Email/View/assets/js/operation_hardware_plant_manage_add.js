/**
 * js   系统管理>用户列表
 * user   dingyingcheng
 * date   2017-05-10
 */
$(function(){

    $('#hardware_plant_manage_add_save').unbind().bind('click',function(){

        var add_data = {
            'server_name':$('#server_name').val(),//服务器名称
            'server_code':$('#server_code').val(),//服务器型号
            'disk_size':$('#disk_size').val(),//硬盘大小
            'memory_size':$('#memory_size').val(),//硬盘大小
            'CPU':$('#CPU').val(),//CPU
            'IP':$('#IP').val(),//IP地址
            'factory':$('#factory').val(),//生产厂家
            'unit':$('#unit').val(),//所属单位
            'leader':$('#leader').val(),//负责人
            'phone':$('#phone').val(),//联系方式
            'remark':$('#remark').val(),//备注
        };
        hardware_plant_manage_add_save(add_data)
    })
});

function hardware_plant_manage_add_save(add_data){
    $.ajax({
        url: "http://"+location.host+"/operation/hardware_plant_manage/hardware_plant_manage_add_save?"+new Date(),
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
                //location.href = '/ui/admin_role_index.html';
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
