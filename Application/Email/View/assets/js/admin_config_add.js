/**
 * js   系统管理>菜单管理--增加
 * user   dingyingcheng
 * date   2017-05-10
 */
function config_add_save(){
    var name = $('#name').val();
    var address = $('#address').val();
    var param = $('#param').val();

    var add_data = {
        'name':name,
        'address':address,
        'param':param
    };
    $.ajax({
        url: "http://"+location.host+"/admin/config/config_add_save?"+new Date(),
        async: false,
        data: add_data,
        dataType: "json",
        error:function(){
        },
        success: function(data){
            if(data.code == 'error'){
                block(data.msg,2000);
            }else{
                block(data.msg,2000);
                $('#config_add').modal('hide');
                $('#nav-accordion #admin_config_index a').click();
            }
        }
    })
}
