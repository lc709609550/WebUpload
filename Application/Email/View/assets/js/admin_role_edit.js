/**
 * js   系统管理>用户列表
 * user   dingyingcheng
 * date   2017-05-10
 */
$(function(){

    if(role_edit_data.status == '启用'){
        role_edit_data.status = 1;
    }
    if(role_edit_data.status == '禁用'){
        role_edit_data.status = -1;
    }
    $('#edit_id').val(role_edit_data.id);
    $('#edit_role_name').val(role_edit_data.role_name);
    $('#edit_status').val(role_edit_data.status);

    $('#role_edit_save').unbind().bind('click',function(){
        var add_data = {
            'id':$('#edit_id').val(),
            'status':$('#edit_status').val()
        };
        role_edit_save(add_data)
    })
});

function role_edit_save(add_data){
    if(add_data.id == 1 && add_data.status == -1){
        block('超级管理员不得禁用',2000);
        return false;
    };

    $.ajax({
        url: "http://"+location.host+"/admin/Role/role_edit_save?"+new Date(),
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
                $('#role_edit').modal('hide');
                $("#jqGridList").jqGrid('setGridParam', {
                    url: "http://"+location.host+"/admin/Role/get_role_infos?"+new Date(),
                    page: 1
                }).trigger("reloadGrid");
            }
        }
    })
}

