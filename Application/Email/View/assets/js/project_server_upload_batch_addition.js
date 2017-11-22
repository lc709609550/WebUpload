/**
 * Created by BHZXZbaibing on 2017/6/5.
 */
var jsonVal;
$(function(){

    //所属设备
    owned_equipment();

})

//所属设备
function owned_equipment(){

    $.ajax({
        url: "http://" + location.host + "/project/project_details/get_project_unit?" + new Date(),
        type: "POST",
        async: false,
        data: {
            'group_name': BHXZ_PROJECT.group_name,
            'company_name': BHXZ_PROJECT.company_name,
            'factory_name': BHXZ_PROJECT.project_name
        },
        dataType: "json",
        error: function () {

        },
        success: function (result) {
            jsonVal = result;
        }
    });

    $('.owned_equipments').jstree({
        core : {
            check_callback : true,
            data : jsonVal
        },
        'checkbox' : {
            // 禁用级联选中
            'three_state' : true,
            'cascade' : 'undetermined' //有三个选项，up, down, undetermined; 使用前需要先禁用three_state
        },
        'plugins' : ['checkbox', 'search'], //如果使用checkbox效率会降低, 'wholerow'会把线隐藏掉
        "contextmenu": {
            "items": {
                "create": null,
                "multiple" : true, // 允许多选
                "rename": null,
                "remove": null,
                "ccp": null
            }
        }
    });

    $(' .owned_equipments').on('changed.jstree', function (e, data) {

        var nodes = $('.owned_equipments').jstree().get_checked(true);

        attrs.statusText = '';

        $.each(nodes,function(k,v){

            attrs.statusText += v.original.equipment_uuid+',';

        })

    });

    $('.addSave').unbind().bind('click',function(){

        $(this).attr('data-dismiss','modal');

        var ccomments = $('#ccomment').val();

        var optionsRadios1s = $('#optionsRadios1').prop('checked') == true ? 1 : null;

        $('#thelist .briefing_input').val(ccomments);

        if(optionsRadios1s == 1){

            $('.memorabilia').attr('checked',"checked");
        }

        var owned_equipmentHtmlt = $('.owned_equipments').html();

        $.each($('.owned_equipment'),function(key,val){

           $(val).html(owned_equipmentHtmlt);

        });
    })
}