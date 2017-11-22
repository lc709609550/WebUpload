/**
 * js   系统管理>菜单管理--编辑
 * user   dingyingcheng
 * date   2017-06-12
 */
$(function(){
    edit_init_get_info(config_param_id);

    $('#config_param_add').unbind().bind('click',function(){
        var html = '<tr bgcolor="">'+
            '<td>'+
            '<input style="width:90%;height: 90%" type="text" id="" value="" name="param"/>'+
            '</td>'+
            '<td>'+
            '<input style="width:90%;height: 90%" type="text" id="" value="" name="param"/>'+
            '</td>'+
            '<td>'+
            '<i class="fa fa-minus col-lg-1 config_param_jian" id="" style="height: 32px;line-height: 32px;cursor: pointer"></i>'+
            '</td>'+
            '</tr>';
        $('#config_param_table').find('tbody').append(html);
        $('.config_param_jian').unbind().bind('click',function(){
            $(this).parent().parent('tr').remove();
        });
    });
});
//编辑页面加载时--初始化数据
function edit_init_get_info(config_edit_id){
    $.ajax({
        url: "http://"+location.host+"/admin/Config/get_edit_config_info?"+new Date(),
        type: "POST",
        data:{config_edit_id:config_edit_id},
        success:function (data) {
           $('#config_param_name').html(data.name);
            var str = data.address;
           $('#config_param_url').html(str);

        },
        error:function(){
            return false;
        }
    });
}


function config_param_save(){
    var config_param_url = $('#config_param_url').html();
    var param = $('#config_param_table').find('tbody tr');
    var obj = {};
    if(param.length > 0){
        var arrs ={};
        $.each(param,function(k,v){
            var td1 = $(v).children().eq(0).find('input').val();
            var td2 = $(v).children().eq(1).find('input').val();
            if(td1 == ''){
                $(v).children().eq(0).find('input').focus();
                return false;
            }
            if(td2 == ''){
                $(v).children().eq(1).find('input').focus();
                return false;
            }
            arrs[td1]=td2;
        });
    }
    var add_param = {
        'config_param_url':config_param_url
    };
    var add_params= $.extend(add_param,arrs);
    $.ajax({
        url: "http://"+location.host+"/admin/config/config_param_quest?"+new Date(),
        async: false,
        data: add_params,
        type:'post',
        dataType: "json",
        error:function(){
        },
        success: function(data){
            if(data.code == 'error'){
                block(data.msg,2000);
            }else{
                try {
                 var input = eval('(' +  data + ')');
                 }
                 catch (error) {
                 return alert("Cannot eval JSON: " + error);
                 }
                var options = {
                    collapsed: false,
                    withQuotes: false
                };
                $('#json-input').jsonViewer(input, options);
            }
        }
    })
}

