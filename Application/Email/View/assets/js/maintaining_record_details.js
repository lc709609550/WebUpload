/**
 * Created by BHZXZbaibing on 2017/5/24.
 */
$(function(){

    $('#file_name').val(Editdata.oldfilename);
    $('#file_type').val(Editdata.file_type);
    $('#introduce').val(Editdata.introduction);
    $('#project_name').val(Editdata.project_name);
    $('#unit_name').val(Editdata.unit_name);
    $('#fileName').val(Editdata.oldfilename);
    $('#equipment').val(Editdata.equipment_name);
    $("#filepath").find('a').attr("href",Editdata.filepath);

})