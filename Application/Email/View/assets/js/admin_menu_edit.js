/**
 * js   系统管理>菜单管理--编辑
 * user   dingyingcheng
 * date   2017-06-12
 */
$(function(){
    edit_init_get_info(edit_id);
});

//编辑页面加载时--初始化数据
function edit_init_get_info(edit_id){
    $.ajax({
        url: "http://"+location.host+"/admin/Menu/menu_edit_init?"+new Date(),
        type: "POST",
        data:{edit_id:edit_id},
        success:function (data) {
            $('#parentid').html('');
            var str = '<option value="0">/</option>';
            $('#parentid').html(str+data.select_categorys);
            $.each(data.info,function(key,val){
                $("#edit_" + key,parent.document).val(val).attr("title", val);
            });
            $.each($('#is_display input'),function(k,v){
                if(data.info.display == $(v).val()){
                    $(v).prop('checked',true);
                }else if(data.info.display == $(v).val()){
                    $(v).prop('checked',true);
                }
            })
            $.each($('#edit_code input'),function(k,v){
                if(data.info.code == $(v).val()){
                    $(v).prop('checked',true);
                }
            })
            $.each($('#show input'),function(k,v){
                if(data.info.show == $(v).val()){
                    $(v).prop('checked',true);
                }else if(data.info.show == $(v).val()){
                    $(v).prop('checked',true);
                }
            })

        },
        error:function(){
            return false;
        }
    });
}


function menu_edit_save(){
    var id = $('#edit_id').val();
    var parentid = $('#parentid').val();
    var name = $('#edit_name').val();
    var code = $('input[name=code]:checked').val();
    var m = $('#edit_m').val();//单位
    var c = $('#edit_c').val();//单位
    var action = $('#edit_action').val();//单位
    var display = $('input[name=display]:checked').val();
    var show = $('input[name=show]:checked').val();
    var edit_data = {
        'id':id,
        'parentid':parentid,
        'name':name,
        'code':code,
        'm':m,
        'c':c,
        'action':action,
        'display':display,
        'show':show,
    };
    $.ajax({
        url: "http://"+location.host+"/admin/Menu/menu_edit_save?"+new Date(),
        async: false,
        data: edit_data,
        dataType: "json",
        error:function(){
        },
        success: function(data){
            if(data.code>400){
                block(data.message,2000);
            }else{
                block(data.message,2000);
                $('#menu_edit').modal('hide');
                $('#nav-accordion #admin_menu_index a').click();
            }
        }
    })
}

