/**
 * js   系统管理>用户列表
 * role   dingyingcheng
 * date   2017-05-10
 */
$(function(){
    $('#role_add_save').unbind().bind('click',function(){
            var role_name = $('#role_name').val();
                role_name = $.trim(role_name);
            if(role_name == ''){
                block('角色名称不得为空',2000);
                return false;
            }
            if(role_name.length >10){
                block('角色名称不得超过10',2000);
                return false;
            }
            var add_data = {
                'role_name':role_name,
                'status':$('#status').val()
            };
            role_add_save(add_data)
        })
});

function role_add_save(add_data){
    $.ajax({
        url: "http://"+location.host+"/admin/Role/role_add_save?"+new Date(),
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
                $('#role_add').modal('hide');
                $("#jqGridList").jqGrid('setGridParam', {
                    url: "http://"+location.host+"/admin/Role/get_role_infos?"+new Date(),
                    page: 1
                }).trigger("reloadGrid");
            }
        }
    })
}

