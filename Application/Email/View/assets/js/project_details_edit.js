/**
 * Created by BHZXZbaibing on 2017/6/9.
 */
var statusText = '';
$(function () {

    jstreeEvent();

});

function jstreeEvent(){
     $('#project_name').val(BHXZ_PROJECT.project_task_name);
    $.ajax({
        url: "http://" + location.host + "/project/project_details/get_project_unit?" + new Date(),
        type: "POST",
        async: false,
        data: {
            'group_name': BHXZ_PROJECT.group_name,
            'company_name': BHXZ_PROJECT.company_name,
            'factory_name': BHXZ_PROJECT.project_name,
            'f_id': rowDatar
        },
        dataType: "json",
        error: function () {

        },
        success: function (result) {
            $('.owned_equipment').jstree({
                core: {
                    check_callback: true,
                    data: result
                },
                checkbox: {
                    // 禁用级联选中
                    'three_state': true,
                    'cascade': 'undetermined' //有三个选项，up, down, undetermined; 使用前需要先禁用three_state
                },
                plugins: ['checkbox', 'search'], //如果使用checkbox效率会降低, 'wholerow'会把线隐藏掉
                contextmenu: {
                    "items": {
                        "create": null,
                        "multiple": true, // 允许多选
                        "rename": null,
                        "remove": null,
                        "ccp": null
                    }
                }

            })

            $(' .owned_equipment').on('changed.jstree', function (e, data) {
                var nodes = $('.owned_equipment').jstree().get_checked(true);
                statusText = '';
                $.each(nodes, function (k, v) {
                    statusText += v.original.equipment_uuid + ',';
                });
            });
        }
    });

    $.ajax({
        url: "http://" + location.host + "/project/project_details/get_project_equipment?" + new Date(),
        type: "POST",
        async: false,
        data: {
            'f_id': rowDatar
        },
        dataType: "json",
        error: function () {

        },
        success: function (result) {
            $('#olefilename').val(result.info.oldfilename);
            $('#introduction').val(result.info.introduction);
            if(result.info.is_memorabilia == 1){
                $('#memorabilia').prop('checked',true);
            }
        }
    });

    $('#detailsEditSave').click(function () {

        $.ajax({
            url: "http://" + location.host + "/project/project_details/edit_file_equipment?" + new Date(),
            type: "POST",
            async: false,
            data: {
                'f_id': rowDatar,
                'p_id': BHXZ_PROJECT.project_details,
                'j_id': BHXZ_PROJECT.project_satge,
                'oldfilename': $('#olefilename').val(),
                'owned_equipment': statusText || '',
                'introduction': $('#introduction').val(),
                'classification': $('#classification').val(),
                'memorabilia': $('#memorabilia').is(':checked') ? 1 : 0
            },
            error: function () {

            },
            success: function (result) {
                block(result.message, 1000);
                if (result.code < 400) {
                    $('#project_details_editModel').modal('hide');
                }
            }
        });
    })

}