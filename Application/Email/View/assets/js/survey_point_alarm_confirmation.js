/**
 * Created by BHZXZbaibing on 2017/5/22.
 */
$(function(){

    //报警原因选中事件
    bindEvents();

    //时间插件
    $(".form_datetime").datetimepicker({
        weekStart: 1,
        startView: 2,
        minView: 2,
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        showMeridian: true,
        autoclose: true,
        todayBtn: true,
        pickerPosition: "top-left"
    });

});

//报警原因选中事件
function bindEvents() {
    $("input[type=checkbox]",parent.document).change(function () {
        if(this.checked) {
            var selected = $(this).next().html() + '; ';
            var temp = $('#comment',parent.document).val();
            $('#comment',parent.document).val(temp + selected);
        }else{
            var selected = $(this).next().html() + '; ';
            var comment = $('#comment',parent.document).val();
            $('#comment',parent.document).val(comment.replace(selected,''));
        }
    });

}