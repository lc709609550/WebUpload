/**
 * Created by BHZXZbaibing on 2017/5/10.
 */
$(function () {
    //删除阶段
    project_phase_configuration_delete();
    var new_project_phase_html = '';
    $('.new_project_phase').unbind().bind('click', function () {
        new_project_phase_html =
            '<tr> ' +
            '<td>' +
            '<label class="checkbox-inline"> ' +
            '<input type="checkbox" id="" value="option1"> ' +
            '</label>' +
            ' </td>' +
            ' <td class="hidden-phone">' +
            '<input type="text" value="">' +
            '<i class="glyphicon glyphicon-ok"></i>' +
            '</td> ' +
            '<td> ' +
            '<button class="btn btn-primary btn-xs project_phase_configuration_ascending" title="层级升序">' +
            '<i class="fa fa-long-arrow-up"></i>' +
            '</button>' +
            ' <button class="btn btn-primary btn-xs project_phase_configuration_descending" title="层级降序">' +
            '<i class="fa fa-long-arrow-down"></i>' +
            '</button> &nbsp;&nbsp;&nbsp;&nbsp; ' +
            '<button class="btn btn-danger btn-xs project_phase_configuration_delete" title="删除">' +
            '<i class="fa fa-trash-o "></i>' +
            '</button> ' +
            '</td> ' +
            '</tr>';
        $('.modal-body .table tbody').prepend(new_project_phase_html);
        //删除阶段
        project_phase_configuration_delete();
        $('.glyphicon-ok').unbind('click').click(function () {
            var thisInput = $(this);
            var thisval = $(this).prev('input').val();
            if (thisval != '') {
                $.ajax({
                    url: "http://" + location.host + "/project/project_information/add_stage_config?" + new Date(),
                    type: "POST",
                    data: {val: thisval},
                    // async:false,
                    dataType: "json",
                    success: function (result) {
                        block(result.message, 1000);
                        if (result['code'] < 400) {
                            thisInput.prev('input').attr("readonly", 'readonly');
                            thisInput.prev('input').attr("disabled", 'disabled');
                            thisInput.prev('input').css({'border':'none','background':'#fff','text-align':'center'});
                            thisInput.parent('td').prev('td').find('input').val(result.inputId);
                            thisInput.remove();
                        }
                    }
                })
            }
        })

    });


});


//删除
function project_phase_configuration_delete() {
    $('.project_phase_configuration_delete').unbind().bind('click', function () {
        var thir = $(this);
        var stage_delete_id = $(this).parent('td').prev().prev().children().find('input').val();
        if (stage_delete_id) {
            $.ajax({
                url: "http://" + location.host + "/project/project_information/get_stage_delete?" + new Date(),
                type: "POST",
                data: {id: stage_delete_id},
                async: false,
                dataType: "json",
                error: function () {

                },
                success: function (data) {
                    block(data.message,1000);
                    if(data['code']<400) {
                        thir.parent('td').parent('tr').remove();
                    }
                }
            });
        }

    });
    $('.project_phase_configuration_ascending').unbind().bind('click', function () {
        var parents = $(this).parent('td').parent('tr');
        var index = parents.index();
        if (index == 0) {
            alert("已经在最上面");
            return;
        }
        else {
            $('.modal-body .table tbody tr').eq(index - 1).before($('.modal-body .table tbody tr').eq(index));
        }

    });
    $('.project_phase_configuration_descending').unbind().bind('click', function () {
        var parents = $(this).parent('td').parent('tr');
        var index = parents.index();
        var count = $('.modal-body .table tbody tr').length;
        if (index == (count - 1)) {
            alert("已经在最下面");
            return;
        }
        else {
            $('.modal-body .table tbody tr').eq(index + 1).after($('.modal-body .table tbody tr').eq(index));
        }
    });

}