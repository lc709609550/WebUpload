/**
 * js   系统管理>菜单管理--增加
 * user   dingyingcheng
 * date   2017-05-10
 */
$(function(){
    //获取菜单的分类
    add_get_menu_type(parentid);
});

//add--1获取菜单的分类
function add_get_menu_type(parentid){
    $.ajax({
        url: "http://"+location.host+"/admin/Menu/add_get_menu_type?"+new Date(),
        type: "get",
        data:{parentid:parentid},
        success:function (data) {
            $('#parentid').html('');
            var str = '<option value="0">/</option>';
            $('#parentid').html(str+data);
        },
        error:function(){
            return false;
        }
    });
}


function menu_add_save(){
    var parentid = $('#parentid').val();
    var name = $('#name').val();
    var code = $('input[name=code]:checked').val();
    var m = $('#m').val();//单位
    var c = $('#c').val();//单位
    var action = $('#action').val();//单位
    var icon = $('input[name=icon]:checked').val();//图标
    var display = $('input[name=display]:checked').val();
    var show = $('input[name=show]:checked').val();
    var add_data = {
        'parentid':parentid,
        'name':name,
        'code':code,
        'm':m,
        'c':c,
        'action':action,
        'icon':icon,
        'show':show,
        'display':display
    };
    $.ajax({
        url: "http://"+location.host+"/admin/Menu/menu_add_save?"+new Date(),
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
                $('#menu_add').modal('hide');
                $('#nav-accordion #admin_menu_index a').click();
            }
        }
    })
}
