/**
 * Created by BHZXZbaibing on 2017/8/14.
 */
$(function(){
    batchUploadFile();
});

function batchUploadFile(){
    var add_file_html = '<div id="" class="item"> ' +
        '<div class="form-group clear"> ' +
        '<label for="" class="control-label col-lg-1">标题</label> ' +
        '<div class="col-lg-4">' +
        '<input value="" class=" form-control title_input" id="project_name" name="project_name" minlength="2" type="text" required="">' +
        '</div>' +
        '<p class="state" style="display: inline-block;float: left;">等待上传...</p>' +
        '<a href="javascript:void(0)" class="col-lg-1 shrink" onOff="off"><span>展开</span> ' +
        '<i class="fa fa-angle-double-down"></i>' +
        '</a> ' +
        '</div> ' +
        '<div class="form" style="display: none;"> ' +
        '<div class="form-group clear"> ' +
        '<label for="" class="control-label col-lg-1">所属设备</label> ' +
        '<div class="col-lg-11"> ' +
        '<div class="owned_equipment" ></div>' +
        '</div> ' +
        '</div> ' +
        '<div class="form-group clear" style="35px"> ' +
        '<label for="" class="control-label col-lg-1">简介</label> ' +
        '<div class="col-lg-11"> ' +
        '<textarea class="form-control briefing_input" id="comment" name="comment" required="" style="height:85px"></textarea> ' +
        '</div> ' +
        '</div> ' +
        '</div>';
    $('#thelist').append(add_file_html);
    //收缩
    project_upload_file_shrink();
}
//收缩
function project_upload_file_shrink() {

    $('.shrink').unbind().bind('click', function () {

        if ($(this).attr('onOff') == 'off') {
            $(this).parent().siblings('.form').show(100);
            $(this).find('span').html('收起');
            $(this).find('i').removeClass('fa-angle-double-down');
            $(this).find('i').addClass('fa-angle-double-up');
            $(this).attr('onOff', 'on');
        } else if ($(this).attr('onOff') == 'on') {
            $(this).parent().siblings('.form').hide(100);
            $(this).find('span').html('展开');
            $(this).find('i').removeClass('fa-angle-double-up');
            $(this).find('i').addClass('fa-angle-double-down');
            $(this).attr('onOff', 'off');
        }

    });

    $('.shrink').eq(0).click();
}