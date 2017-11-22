/**
 * Created by BHZXZbaibing on 2017/5/19.
 *  设备档案新增页面Js
 */
$(function(){

    //初始化设备名称下拉框
    initAddData();

    //文件信息按钮事件
    file_navEvent();
})

//文件信息按钮事件
function file_navEvent(){

    $('#file_nav li a').unbind().bind('click',function(){
        var index = $(this).parents('li').index();
        $(this).parent().addClass('activess');
        $(this).parent().siblings('li').removeClass('activess');

        $('#file_content>div').hide();

        $('#file_content>div').eq(index).show();

    })
    $('#file_nav li a').eq(0).trigger('click');
}

//联动查询
function initAddData(){
    get_company();//初始化单位名称
    $('#company_name').change(function(){
        var company_name = $('#company_name option:selected').val();
        get_equipment(company_name);//获取设备名称
    })
}
//联动之单位名称
function get_company(){
    $.ajax({
        'url': "http://" + location.host + "/equipment/plant_management/getCompanyName?" + new Date(),
        'type': "GET",
        'async': false,
        'dataType': "json",
        success:function(data){

            var options = '';
            $('#company_name').html('');
            $.each(data,function(k,v){
                options += '<option value="'+ v+'" >'+ v+'</option>';
            });

            $('#company_name').html(options);

        }

    });
    var company_name = $('#company_name option:selected').val();

    get_equipment(company_name);
}


//联动之设备名称
function  get_equipment(company_name){
    $.ajax({
        'url': "http://" + location.host + "/equipment/plant_management/getEquipmentName?" + new Date(),
        'type': "GET",
        'data':{company_name:company_name},
        'async': true,
        'dataType': "json",
        success:function(data){
            if(data.length == 0){
                block('当前单位下已无设备可添加!',1000);
            }
            var options = '';
            $('#equipment_name').html('');
            $.each(data,function(k,v){
                options += '<option value="'+ v.equipment_name+'" plantId="'+ v.equipment_id+'" uuid="'+ v.equipment_uuid + '" group="'+ v.group_name+'" factory="'+ v.factory_name+'" unit="'+ v.unit_name+' "types="'+ v.equipment_type_name +'">'+ v.equipment_name+'</option>';
            });

            $('#equipment_name').html(options);


            var equipment_name = $('#equipment_name option:selected').text();
            if(equipment_name !=null && equipment_name !=undefined){
                var equipment_uuid = $('#equipment_name').find("option:selected").attr("uuid");
                var group_name = $('#equipment_name').find("option:selected").attr("group");
                var factory_name = $('#equipment_name').find("option:selected").attr("factory");
                var unit_name = $('#equipment_name').find("option:selected").attr("unit");

                var equipment_type_name = $('#equipment_name').find("option:selected").attr("types");
                var equipment_id = $('#equipment_name').find("option:selected").attr("plantId");

                $('#unit_name').val(unit_name);
                $('#group_name').val(group_name);
                $('#equipment_id').val(equipment_id);
                $('#factory_name').val(factory_name);
                $('#equipment_uuid').val(equipment_uuid);
                $('#equipment_type_name').val(equipment_type_name);
            }

        }

    });
    $('#equipment_name').change(function(){
        get_equipment_info();//获取设备类型、编号信息
    })

}
//联动之设备类型、编号
function get_equipment_info(){
    var equipment_name = $('#equipment_name option:selected').text();
    if(equipment_name !=null && equipment_name !=undefined){

        var group_name = $('#equipment_name').find("option:selected").attr("group");
        var factory_name = $('#equipment_name').find("option:selected").attr("factory");
        var unit_name = $('#equipment_name').find("option:selected").attr("unit");
        var equipment_id = $('#equipment_name').find("option:selected").attr("plantId");
        var equipment_uuid = $('#equipment_name').find("option:selected").attr("uuid");
        var equipment_type_name = $('#equipment_name').find("option:selected").attr("types");
        $('#unit_name').val(unit_name);
        $('#group_name').val(group_name);
        $('#equipment_id').val(equipment_id);
        $('#factory_name').val(factory_name);
        $('#equipment_uuid').val(equipment_uuid);
        $('#equipment_type_name').val(equipment_type_name);
    }


}
//新增保存按钮
$('.addSave').unbind('click').click(function () {

    var made_info = $('#made_info').val();
    var parameter = $('#parameter').val();
    var design_info = $('#design_info').val();

    if(made_info.length>200 || parameter.length>200 || design_info.length>200 ){

        return block('输入内容不能超过200字',1000);
    }
    var postData = serializeForm('equipment_add');
    $.ajax({
        'url': "http://" + location.host + "/equipment/plant_management/saveInfo?" + new Date(),
        'type': "POST",
        'data': postData,
        'dataType': "json",
        success: function(data){
            block(data.message,1000);
            if(data['code']<400) {
                $("#jqGridList").jqGrid('setGridParam', {

                }).trigger("reloadGrid");
                $('#technicalEditModal').modal('hide');
            }
        }
    });
});