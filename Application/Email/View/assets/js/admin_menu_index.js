/**
 * js   系统管理>用户列表
 * menu   dingyingcheng
 * date   2017-05-10
 */
var init_menu_add_data = '';
var parentid = '';
var edit_id = '';
$(function(){
    var heights = $('#sidebar').height()  - 124;
    var jqTableH = heights - $('.headers').outerHeight(true);
    $('#menu_index_index').height(jqTableH);
    //表格创建
    get_menu_info();

    //导航按钮事件
    headersNav();


    $("#menu_index_index").mCustomScrollbar({
        live:true,
        theme:"minimal"
        //scrollInertia:0
    });
});
//导航按钮事件
function headersNav(){
    $('.headers ul li a').unbind().bind('click',function(){
        $(this).parents('li').siblings().find('i').remove();
        $(this).append('<i></i>');
        var headersText = $(this).text();
        $("#jqGridList").jqGrid('setGridParam',
            {
                datatype:'json',
                postData: {dataText:headersText},
                page: 1
            }).trigger("reloadGrid");
    });
    $('.headers ul li a').eq(0).trigger('click');
}
//表格创建
function  get_menu_info() {
    //绘制表格
    $.ajax({
        url: "http://"+location.host+"/admin/Menu/get_menu_infos?"+new Date(),
        "type": "get",
        'success':function (data) {
            $('#menus-table').find('tbody').html('');
            $('#menus-table').find('tbody').html(data);
        }
    });
}
//2--更新权限操作
function menu_auth_update(){
    $.ajax({
        url: "http://"+location.host+"/admin/Menu/update_authorize_rule?"+new Date(),
        type:"get",
        dataType: "json",
        error:function(){
        },
        success: function(data){
            if(data.code>'success'){
                block(data.msg,2000);
            }else{
                block(data.msg,2000);
            }
        }
    })
}



//菜单--排序操作
function  menu_sort() {
    var codata = serializeForm('menus-table');
    var listorders = $('#menus-table').find("input[name^='listorders']");
    var sort = [];
    $.each(listorders,function(k,v){
        sort[$(v).attr('name')] = $(v).val();
    });
    $.ajax({
        url: "http://"+location.host+"/admin/Menu/listorder?"+new Date(),
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
                navAjax('./admin_menu_index.html');
            }
        }
    })
}

//菜单--新增页面渲染
function menu_add(parent_id){
    $('.modalWrap').html('');
    $.ajax({
        'url': './admin_menu_add.html',
        "type": "get",
        async: false,
        //'data':{rows:rows},
        'success':function (data) {
            parentid = parent_id;
            $('.modalWrap').html(data);
            $('#menu_add').modal('show');
        }
    });
}

//用户--编辑
function menu_edit(id){
    $('.modalWrap').html('');
    $.ajax({
        'url': './admin_menu_edit.html',
        "type": "get",
        //'data':{rows:rows},
        'success':function (data) {
            $('.modalWrap').html(data);
            $('#menu_edit').modal('show');
            edit_id = id;
        }
    });
}

//用户--删除
function menu_del(menu_id){
    art.dialog.confirm('确定要删除选中的记录?', function () {
        var url = "http://"+location.host+"/admin/Menu/menu_del?"+new Date();
        $.post(url, {id:menu_id}, function (data) {
            if(data.code>400){
                block(data.message,2000);
            }else{
                block(data.message,2000);
                navAjax('./admin_menu_index.html');
            }
        });
    });

}