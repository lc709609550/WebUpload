/**
 * js   系统管理>角色管理--角色授权
 * user   dingyingcheng
 * date   2017-05-10
 */
$(function() {
    $.ajax({
        url: "http://" + location.host + "/admin/role/get_role_authorize_list?" + new Date(),
        type: "POST",
        data: {role_group_id: role_group_id},
        success: function (data) {
            $('#role_authorize').html('');
            $('#role_authorize').html(data);
        },
        error: function () {
            return false;
        }
    });


    //规则授权后进行保存操作
    $('#authorize_add_save').unbind().bind('click', function () {

        var codata = serializeForm('role_authorize');
        codata = $.extend(codata,{id:role_group_id});
        $.ajax({
            url: "http://"+location.host+"/admin/Role/authorize?"+new Date(),
            async: false,
            type:"POST",
            data: codata,
            dataType: "json",
            error:function(){
            },
            success: function(data){
                if(data.code>400){
                    block(data.message,2000);
                }else{
                    block(data.message,2000);
                    $('#role_authorize_add').modal('hide');
                    navAjax('./admin_role_index.html');
                }
            }
        })
        })
});




function user_add_save(add_data){
    $.ajax({
        url: "http://"+location.host+"/admin/User/user_add_save?"+new Date(),
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
                //$('#technicalEditModal').modal('hide');
                $("#jqGridList").jqGrid('setGridParam', {
                    url: "http://"+location.host+"/admin/User/get_user_infos?"+new Date(),
                    page: 1
                }).trigger("reloadGrid");
            }
        }
    })
}
function checknode(obj) {

    var chk = $("input[type='checkbox']");
    var count = chk.length;
    var num = chk.index(obj);
    var level_top = level_bottom = chk.eq(num).attr('level');

    for (var i = num; i >= 0; i--) {
        var le = chk.eq(i).attr('level');
        if (eval(le) < eval(level_top)) {
            chk.eq(i).prop("checked",true);
            var level_top = level_top - 1;
        }
    }

    for (var j = num + 1; j < count; j++) {
        var le = chk.eq(j).attr('level');
        if (chk.eq(num).prop("checked")) {
            if (eval(le) > eval(level_bottom)){

                chk.eq(j).prop("checked",true);
            }
            else if (eval(le) <= eval(level_bottom)){
                break;
            }
        } else {
            if (eval(le) > eval(level_bottom)){
                chk.eq(j).prop("checked",false);
            }else if(eval(le) <= eval(level_bottom)){
                break;
            }
        }
    }
}