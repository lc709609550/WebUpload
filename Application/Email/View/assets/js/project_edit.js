/**
 * Created by BHZXZbaibing on 2017/5/10.
 */

var number = 0,numbes = 0;
var Project_Stage = new Array();
$(function(){
    //获取项目配置
    // get_stage_config(true);
    //获取用户信息
    get_user_info();

    // get_database_info();
    //添加人员
    add_members();
    //时间插件
    var start = {
        format: 'YYYY-MM-DD',
        minDate: '2014-06-16', //设定最小日期为当前日期
        isinitVal:true,
        // festival:true,
        ishmsVal:false,
        maxDate: $.nowDate({DD:0}), //最大日期
        choosefun: function(elem, val, date){
            end.minDate = date; //开始日选好后，重置结束日的最小日期
            endDates();
        }
    };
    var end = {
        format: 'YYYY-MM-DD',
        minDate: $.nowDate({DD:0}), //设定最小日期为当前日期
        // festival:true,
        isinitVal:true,
        maxDate: '2099-06-16', //最大日期
        choosefun: function(elem, val, date){
            start.maxDate = date; //将结束日的初始值设定为开始日的最大日期
        }
    };
    //这里是日期联动的关键
    function endDates() {
        //将结束日期的事件改成 false 即可
        end.trigger = false;
        $("#mirror_fields").jeDate(end);
    }
    $.jeDate('#mirror_field',start);
    $.jeDate('#mirror_fields',end);

    if(childGridIDRow && !jqGridListRow){
        $('#parent_pro_div').show();
        $('#parent_pro').show();
    }
    //获取信息
    get_edit_info(project_edit_id);

    //子项目编辑显示父项目类
    var parents = $('#parent_pro').val();
    if(parents != ''){
        $.ajax({
            url: "http://" + location.host + "/project/project_information/get_parent_projectname?" + new Date(),
            type: "POST",
            async: false,
            data: {parent_pro:parents},
            dataType: "json",
            error:function(){

            },
            success: function(data){
                $('#parent').val(data);
            }
        });


    }

});

//添加人员
function add_members(){

    $('.add_project_members').unbind().bind('click',function(){

        number++;
        var project_agentsHtml = $(".project_agents_0").clone(false).attr('class','project_agents_'+number+'');
        $('.project_agents').append(project_agentsHtml);
        $('.project_agents_delete').unbind().bind('click',function(){
            $(this).siblings('.control-label').parent().remove();
        });
        $('.project_agents_'+number+'').find('label').html('');
        $('.project_agents_'+number+' .selectTd').find('select').hide();
        $('.project_agents_'+number+' .selectTd').find('select').eq(0).show();
        selectEventAdd ('.project_agents_'+number+'');
    });
    $('.add_project_other').unbind().bind('click',function(){
        numbes++;
        var project_otherHtml = $(".project_other_0").clone(false).attr('class','project_other_'+numbes+'');
        $('.project_other').append(project_otherHtml);
        $('.project_other_delete').unbind().bind('click',function(){
            $(this).siblings('.control-label').parent().remove();
        });
        $('.project_other_'+numbes+'').find('label').html('');
        $('.project_other_'+numbes+' .selectTd').find('select').hide();
        $('.project_other_'+numbes+' .selectTd').find('select').eq(0).show();
        selectEventAdd ('.project_other_'+numbes+'');
    });
}
$('#addSave').unbind('click').click(function () {
    var postData = serializeForm('project_edit');
        postData = $.extend(postData,{id:project_edit_id});
    $.ajax({
        url: "http://" + location.host + "/project/project_information/update?" + new Date(),
        type: "POST",
        async: false,
        data: postData,
        dataType: "json",
        error:function(){

        },
        success: function(data){
            block(data.message,1000);
            if(data['code']<400) {
                $("#jqGridList").jqGrid('setGridParam', {
                    datatype: 'json',
                    postData: {dataText: headersText},
                    page: 1
                }).trigger("reloadGrid");
                $('#projectEditModal').modal('hide');
            }
        }
    });
});

//更改配置
function project_change_configuration(){
    $('.project_change_configuration').unbind().bind('click',function(){
        $('.modalContent').html('');
        $.ajax({
            'url': './project_change_configuration.html',
            "type": "GET",
            //'data':{rows:rows},
            'success': function (data) {
                $('.modalContent').html(data);
                $('#technicalEditModals').modal('show');
                keyboard: true;
                get_stage_config();

                $('#inlineCheckbox1').unbind().bind('click',function(){

                    if($(this).prop('checked') == true){
                        $('#stage-configs input').prop('checked',true);
                    }else{
                        $('#stage-configs input').prop('checked',false);
                    }

                });

                $('#myModal').unbind().bind('click',function(){
                    $('.stage-config').html('');
                    var configuration_option = [];
                    var configuration_optionArrrs = [];
                    $.each($('#project_phase_configuration .table tbody tr'),function(k,v){
                        if($(v).find('td').eq(0).find('input').is(':checked')){
                            if($(v).find('td').eq(1).find('input').length == 1){

                                configuration_option.push($(v).find('td').eq(1).find('input').val());

                            }else{

                                configuration_option.push($(v).find('td').eq(1).html());

                            }

                            configuration_optionArrrs.push($(v).find('td').eq(0).find('input').val());
                        }
                    });
                    var stage_config_html = '';
                    $.each(configuration_option,function(k,v){

                        stage_config_html += '<label class="checkbox-inline"> <input type="checkbox" name="project_phase" value="'+configuration_optionArrrs[k]+'" checked >'+v+'</label>';

                    });

                    // stage_config_html += '<button type="button" class="btn btn-theme project_change_configuration">更改配置</button>';

                    $('.stage-config').append(stage_config_html);

                    //更改配置
                    project_change_configuration();

                })
            }
        });
    })
}

function get_stage_config(tags){
    $.ajax({
        url:"http://"+location.host+"/project/project_information/get_stage_config?"+new Date(),
        type:"POST",
        async:false,
        dataType: "json",
        error:function(){

        },
        success: function(result){
            var stageHtml = '';
            var stageHtml1 = '';
            var stageHtml2 = '';
            if(result != false){
                var sid,ischecked;
                $.each(Project_Stage,function (m,n) {
                    $.each(result,function (j,l){
                        if(l.sid == n){
                            stageHtml1+= "<tr><td><label class='checkbox-inline'>" +
                                "<input type='checkbox' value='"+l.sid+"' checked>" +
                                "</label> </td>" +
                                "<td class='hidden-phone'>"+l.stage_name+"</td>" +
                                "<td>" +
                                "<button class='btn btn-primary btn-xs project_phase_configuration_ascending' title='层级升序'>" +
                                "<i class='fa fa-long-arrow-up'></i>" +
                                "</button> " +
                                "<button class='btn btn-primary btn-xs project_phase_configuration_descending' title='层级降序'>" +
                                "<i class='fa fa-long-arrow-down'></i>" +
                                "</button>&nbsp;&nbsp;&nbsp;&nbsp; " +
                                "<button class='btn btn-danger btn-xs project_phase_configuration_delete' title='删除'>" +
                                "<i class='fa fa-trash-o '></i>" +
                                "</button> " +
                                "</td> " +
                                "</tr>";
                        }
                    });
                });

                $.each(result,function (k,v) {
                    if(tags){
                        stageHtml+= "<label class='checkbox-inline'> <input type='checkbox' name='project_phase' value="+v.sid+"> "+v.stage_name+" </label>";
                    }else{
                        sid = v.sid ? v.sid.toString() : '';
                        ischecked = $.inArray(sid, Project_Stage) > -1;
                        if(!ischecked){
                            stageHtml2 +=  "<tr><td><label class='checkbox-inline'>" +
                                "<input type='checkbox' value='"+v.sid+"'>" +
                                "</label> </td>" +
                                "<td class='hidden-phone'>"+v.stage_name+"</td>" +
                                "<td>" +
                                "<button class='btn btn-primary btn-xs project_phase_configuration_ascending' title='层级升序'>" +
                                "<i class='fa fa-long-arrow-up'></i>" +
                                "</button> " +
                                "<button class='btn btn-primary btn-xs project_phase_configuration_descending' title='层级降序'>" +
                                "<i class='fa fa-long-arrow-down'></i>" +
                                "</button>&nbsp;&nbsp;&nbsp;&nbsp; " +
                                "<button class='btn btn-danger btn-xs project_phase_configuration_delete' title='删除'>" +
                                "<i class='fa fa-trash-o '></i>" +
                                "</button> " +
                                "</td> " +
                                "</tr>";
                        }
                    }
                });
                stageHtml = stageHtml1 + stageHtml2;
                if(tags){
                    $('#stage-config').html(stageHtml);
                }else{
                    $('#stage-configs').html(stageHtml);
                }
                //按钮操作
                $('.project_phase_configuration_delete').unbind().bind('click',function(){
                    $(this).parent('td').parent('tr').remove();
                });
                $('.project_phase_configuration_ascending').unbind().bind('click',function(){
                    var parents = $(this).parent('td').parent('tr');
                    var index = parents.index();
                    if(index == 0){
                        alert("已经在最上面");return;
                    }
                    else{
                        $('.modal-body .table tbody tr').eq(index-1).before($('.modal-body .table tbody tr').eq(index));
                    }

                });
                $('.project_phase_configuration_descending').unbind().bind('click',function(){
                    var parents = $(this).parent('td').parent('tr');
                    var index = parents.index();
                    var count = $('.modal-body .table tbody tr').length;
                    if(index == (count-1)){
                        alert("已经在最下面");return;
                    }
                    else{
                        $('.modal-body .table tbody tr').eq(index+1).after($('.modal-body .table tbody tr').eq(index));
                    }
                });
            }
        }
    })
}


function get_user_info () {

    $.ajax({
        url:"http://"+location.host+"/project/project_information/get_user_info?"+new Date(),
        type:"POST",
        async:false,
        dataType: "json",
        error:function(){

        },
        success: function(result){
            var adminHtml = '<option value="">请选择</option>';
            var otherHtml = '<option value="">请选择</option>';
            var otherUser = '<select class="form-control" name="project_members"> <option selected value="">全部</option> </select>';
            var otherElseUser = '<select class="form-control" name="project_other_members"> <option selected value="">全部</option> </select>';
            if(result != false){
                $.each(result,function (k,v) {
                    if(k == 'admin'){
                        $.each(v,function (n,m) {
                            adminHtml+="<option value='"+m.uid+"'>"+m.true_name+"</option>";
                        })
                    }else{
                        $.each(v,function (n,m) {
                            otherHtml += "<option value='"+m.unit+"'>"+m.unit+"</option>";
                            var true_name = m.true_name;
                            var true_option = '';
                            true_name = true_name.split(",");
                            $.each(true_name,function (j,l) {
                                true_option += "<option value='"+l.split(":")[1]+"'>"+l.split(":")[0]+"</option>";
                            });
                            otherUser += "<select class='form-control' name='project_members'>"+true_option+"</select>";
                            otherElseUser += "<select class='form-control' name='project_other_members'>"+true_option+"</select>";
                        })
                    }
                });
                $('#project_user').html(adminHtml);
                $('.selectP').html(otherHtml);
                $('.project_agents .selectTd').html(otherUser);
                $('.project_other .selectTd').html(otherElseUser);
                selectEventAdd('.project_agents_0');
                selectEventAdd('.project_other_0');
            }
        }
    })
}

/*function get_database_info(){
    $.ajax({
        url:"http://"+location.host+"/project/project_information/get_database_info?"+new Date(),
        type:"POST",
        async:false,
        dataType: "json",
        error:function(){

        },
        success: function(result){
            var databaseHtml = '';

            if(result != false){
                $.each(result,function (k,v) {
                    databaseHtml+= '<label class="checkbox-inline"> <input type="checkbox" name="project_database" value="'+v.id+'"> '+v.database_name+' </label>';
                });
                $('#project_database').html(databaseHtml);
            }
        }
    })
}*/

function selectEventAdd(id){
    $(''+id+' .selectTd select').hide();
    $(''+id+' .selectTd select:nth-of-type(1)').show();
    $(''+id+'.selectP').change(function () {
        var index = $(''+id+' .selectP option:selected').index();

    });
    $.each($(''+id+' .selectP'), function (index, elem) {
        $(elem).change(function () {
            var num = $(this).find('option:selected').index();

            $(''+id+' .selectTd').eq(index).find('select').eq(num).show().siblings().hide();
        })
    });
}

function get_edit_info(project_edit_id) {
    $.ajax({
        url:"http://"+location.host+"/project/project_information/get_edit_info?"+new Date(),
        type:"POST",
        data:{id:project_edit_id},
        async:false,
        dataType: "json",
        error:function(){

        },

        success: function(result){
            get_province();
            $('#project_province option[value = ' +result.project_province+']').attr("selected",true);
            var provinceid = result.project_province;
            $.ajax({
                url:"http://"+location.host+"/project/project_information/get_city?"+new Date(),
                type:"POST",
                data:{'id':provinceid},
                dataType: "json",
                error:function(){

                },
                success:function (data) {
                    var cityHtml = '<option value="">请选择</option>';
                    $.each(data,function (k,v) {
                        cityHtml += '<option value="'+k+'">'+v+'</option>'
                    });
                    $('#project_city').html(cityHtml);
                    $('#project_city option[value = ' +result.project_city+']').attr("selected",true);
                }
            });


            $('#project_id').val(result.project_id);
            $('#project_name').val(result.project_name);
            $('#project_summary').val(result.project_summary);
            $('#project_type').val(result.project_type);
            $('#project_import').val(result.project_import);
            $("input[name='project_starttime']").val(result.project_starttime);
            $("input[name='project_endtime']").val(result.project_endtime);
            $('#project_fruit').val(result.project_fruit);
            $('#project_user').val(result.project_user);
            $('#parent_pro').val(result.parent_pro);
            $('#truename').val(result.true_name);
            $('#create_time').val(result.create_time);
            if(result.win == '有'){
                $("input[name='win']").eq(0).prop("checked",true);
            }else{
                $("input[name='win']").eq(1).prop("checked",true);
            }

            /*var project_database = result.project_database;
            if(project_database != null){
                project_database = project_database.split(',');
                $.each(project_database,function (k,v) {
                    $('#project_database input:checkbox[value="'+v+'"]').attr("checked","true");
                })
            }*/

            var project_membersArr = result.project_members;

            if(project_membersArr != null){
                $.each(project_membersArr,function (k,v) {
                    var project_members = v.split(':');
                    $('.project_agents_'+number+' .selectP').val(project_members[0]);
                    $('.project_agents_'+number+' .selectTd option').map(function(){
                        if($(this).val() == project_members[1]){
                            $(this).parent().show().val(project_members[1]).siblings().hide();
                        }
                    });
                    if(project_membersArr.length -1 == k){
                        return false;
                    }

                    $('.add_project_members').click();
                })
            }

            var project_other_membersArr = result.project_other_members;

            if(project_other_membersArr != null){
                $.each(project_other_membersArr,function (k,v) {
                    var project_other_members = v.split(':');

                    $('.project_other_'+numbes+' .selectP').val(project_other_members[0]);
                    $('.project_other_'+numbes+' .selectTd option').map(function(){
                        if($(this).val() == project_other_members[1]){
                            $(this).parent().show().val(project_other_members[1]).siblings().hide();
                        }
                    });
                    if(project_other_membersArr.length -1 == k){
                        return false;
                    }
                    $('.add_project_other').click();
                })
            }

            var project_phaseArr = result.project_phase;

            if(project_phaseArr != null){
                var project_phaseHTml = '';
                $.each(project_phaseArr,function (k,v) {
                    var project_phase = v.split(':');
                    Project_Stage.push(project_phase[0]);
                    project_phaseHTml +="<label class='checkbox-inline'> <input type='checkbox' name='project_phase' value="+project_phase[0]+" checked='checked'> "+project_phase[1]+" </label>";
                });

                // project_phaseHTml += '<button type="button" class="btn btn-theme project_change_configuration">更改配置</button>';

                $('#stage-config').html(project_phaseHTml);

                //更改配置
                project_change_configuration();

            }
        }
    })
}
function selectEventAdd(id){
    $(''+id+' .selectTd select').hide();
    $(''+id+' .selectTd select:nth-of-type(1)').show();
    $(''+id+'.selectP').change(function () {
        var index = $(''+id+' .selectP option:selected').index();

    });
    $.each($(''+id+' .selectP'), function (index, elem) {
        $(elem).change(function () {
            var num = $(this).find('option:selected').index();

            $(''+id+' .selectTd').eq(index).find('select').eq(num).show().siblings().hide();
        })
    });
}



function getCity()
{
    var cityHtml = '<option value="">请选择</option>';
    $('#project_city').html(cityHtml);
    $('#project_province').change(function () {
        var provinceid = $('#project_province').find('option:selected').val();
        $.ajax({
            url:"http://"+location.host+"/project/project_information/get_city?"+new Date(),
            type:"POST",
            data:{'id':provinceid},
            async:false,
            dataType: "json",
            error:function(){

            },
            success:function (data) {
                var cityHtml = '<option value="">请选择</option>';
                $.each(data,function (k,v) {
                    cityHtml += '<option value="'+k+'">'+v+'</option>'
                });
                $('#project_city').html(cityHtml);
            }
        })
    });

}
function get_province(){
    $.ajax({
        url:"http://"+location.host+"/project/project_information/get_province?"+new Date(),
        type:"POST",
        dataType: "json",
        async:false,
        error:function(){

        },
        success:function (data) {
            var provinceHtml = '<option value="">请选择</option>';
            $.each(data,function (k,v) {
                provinceHtml += '<option value="'+k+'">'+v+'</option>'
            });
            $('#project_province').html(provinceHtml);
            getCity();
        }
    })
}