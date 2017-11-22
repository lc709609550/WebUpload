/* 设备档案编辑页面Js */
var uuid = Editdata.equipment_uuid;
$(function(){

    var company_option = '<option>'+Editdata.company_name+'</option>';
    $('#company_name').html(company_option);
    var equipment_option = '<option>'+Editdata.equipment_name+'</option>';
    $('#equipment_name').html(equipment_option);
    $('#equipment_uuid').val(Editdata.equipment_uuid);
    $('#equipment_type_name').val(Editdata.equipment_type_name);
    $('#equipment_id').val(Editdata.equipment_id);
    $('#manu_facturer').val(Editdata.manu_facturer);
    $('#asset_number').val(Editdata.asset_number);
    $('#design_info').val(Editdata.design_info);
    $('#made_info').val(Editdata.made_info);
    $('#parameter').val(Editdata.parameter);


    //文件信息按钮事件
    file_navEvent();

    //编辑保存按钮
    edit();

    //初始化文件显示
    equipment_file();


});


//文件信息按钮事件
function file_navEvent(){
    $('#file_info').hide();
    $('#tab li a').unbind().bind('click',function(){

        $(this).parent().addClass('active');
        $(this).parent().siblings().removeClass('active');

        var file = $(this)[0].innerHTML;

        if(file !='设备档案'){
            $('#equipment_add').hide();
            $('#file_info').show();
            equipment_file(file);
        }else{
            $('#equipment_add').show();
            $('#file_info').hide();
        }
    });

    $('#tab li a').eq(0).click();
}

function equipment_file(file) {
    //计算表格高度及条数
    var heights = $('#sidebar').height()  - 198;
    var jqTableH = heights - $('.headers').outerHeight(true);
    var jqTableW = $('.modal-body').outerWidth(true)-33;

    var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35) ;
    //绘制表格
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
    $("#jqGridEditList").jqGrid({
        url: "http://" + location.host + "/equipment/plant_management/getFileInfo?" + new Date(),
        mtype: "POST",
        styleUI: 'Bootstrap',
        datatype: "json",
        postData:{file:file,uuid:uuid},
        colModel: [
            {label: '文件名称', name: 'oldfilename', width: 150, align: 'center'},
            {label: '文件类型', name: 'file_type', width: 150, align: 'center'},
            {label: '简介', name: 'introduction', width: 150, align: 'center'},
            {label: '创建日期', name: 'create_time', width: 150, align: 'center'},
            {label: '操作', name: 'download', width: 150, align: 'center'},
        ],
        // hoverrows: true,
        height: 305,
        width: 768,
//        multiselect: true,//复选框
        viewrecords: true,//显示记录
        rownumbers: true, //是否显示行数
        pginput: true,
        pgtext: "第{0}页 / 共{1}页",
        loaduis: 'enable',
        rowNum: tableNumber,
        autoheight: true, //自动拉伸高度
        //autowidth: true, //自动拉伸宽度
        pager: "#jqGridEditPager",
        gridComplete: function () {
            jQuery("#jqGridEditList").jqGrid('setLabel',0, '序号', 'labelstyle');
        }

    });
    $("#jqGridEditList").jqGrid('setGridParam',
        {
            datatype: 'json',
            postData: {file: file},
            page: 1
        }).trigger("reloadGrid");
}




function edit(){

    $('#editSave').unbind().bind('click',function(){

        var made_info = $('#made_info').val();
        var parameter = $('#parameter').val();
        var design_info = $('#design_info').val();

        if(made_info.length>200 || parameter.length>200 || design_info.length>200 ){

            return block('输入内容不能超过200字',1000);
        }

        var postData = serializeForm('equipment_add');
        $.ajax({
            'url': "http://" + location.host + "/equipment/plant_management/editInfo?" + new Date(),
            'type': "POST",
            'data': postData,
            'dataType': "json",
            success: function(data){
                block(data.message,1000);
                if(data['code']<400) {
                    $("#jqGridList").jqGrid('setGridParam', {

                    }).trigger("reloadGrid");
                    $('#equipment_file_edit').modal('hide');
                }
            }
        });
    });

}


