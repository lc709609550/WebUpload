/**
 * js   系统管理>菜单管理--编辑
 * user   dingyingcheng
 * date   2017-06-12
 */
$(function(){
    edit_init_get_info(config_edit_id);
});
//编辑页面加载时--初始化数据
function edit_init_get_info(config_edit_id){
    $.ajax({
        url: "http://"+location.host+"/admin/Config/get_edit_config_info?"+new Date(),
        type: "POST",
        data:{config_edit_id:config_edit_id},
        success:function (data) {
            $('#edit_id').val(data.id);
            $('#edit_name').val(data.name);
            $('#edit_url').val(data.url);
            $('#edit_address').val(data.address);
            $('#edit_param').val(data.param);
        },
        error:function(){
            return false;
        }
    });
}


function config_edit_save(){
    var edit_id = $('#edit_id').val();
    var edit_name = $('#edit_name').val();
    var edit_url = $('#edit_url').val();
    var edit_address = $('#edit_address').val();
    var edit_param = $('#edit_param').val();
    var edit_data = {
        'edit_id':edit_id,
        'edit_name':edit_name,
        'edit_url':edit_url,
        'edit_address':edit_address,
        'edit_param':edit_param
    };
    $.ajax({
        url: "http://"+location.host+"/admin/config/config_edit_save?"+new Date(),
        async: false,
        data: edit_data,
        dataType: "json",
        error:function(){
        },
        success: function(data){
            if(data.code == 'error'){
                block(data.msg,2000);
            }else{
                block(data.msg,2000);
                $('#config_edit').modal('hide');
                $('#nav-accordion #admin_config_index a').click();
            }
        }
    })
}

