var CLICKC_FUN = {};

(function (w) {
    var isIE = function(){
        if(!!window.ActiveXObject || "ActiveXObject" in window)
        {
            return true;
        }
        return false;
    };
    var uaMatch = function (e) {
        e = e.toLowerCase();
        var t = /(chrome)[ \/]([\w.]+)/.exec(e)
                || /(webkit)[ \/]([\w.]+)/.exec(e)
                || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)
                || /(msie) ([\w.]+)/.exec(e)
                || /(trident) ([\w.]+)/.exec(e)
                || e.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [];
        if(isIE() && t[1] != "msie"){
            t[1] = "msie";
        }
        return {
            browser: t[1] || "",
            version: t[2] || "0"
        }
    };
    var e = uaMatch(w.navigator.userAgent);
    w.checkIE = function (version) {
        var result = e.browser == "msie";
        if (result && version) {
            var v = Math.floor(e.version);
            result = version == v;
        }
        return result;
    };
    w.isLoagModule = function(asModuleName){
        if(typeof asModuleName == "string"){
            if($("a[name='" + asModuleName + "']").length > 0)
            {
                return true;
            }
        }
        return false;
    };
    $(document).click(function(){
        $.each(CLICKC_FUN, function(key, fun){
            if($.isFunction(fun)){
                fun();
            }
        })
    });
})(window);

/*
 *    文件描述：index.php调用的与ActiveX控件无关的JS函数，包括：
 *    Cookie缓存设置和读取、匿名控制、初始化界面、JS文档对象有效性校验、元素隐藏和显示
 */
function $$(astrID) {
    var loObj = document.getElementById(astrID);

    if (loObj != null && loObj != "undefined") {
        return loObj;
    }
    else {
        loObj = document.getElementByName(astrID);
        return loObj;
    }
}

function isObjValid(aoObj) {
    if (aoObj != null && aoObj != "undefined") {
        return true;
    }
    return false;
}

function isValidObject(apObj) {
    if (typeof (apObj) != "undefined" && apObj != null) return true;
    else {
        //alert('not valid');
        return false;
    }
}

function sinadot_isValidObject(aObj) {
    if (typeof (aObj) == "undefined" || aObj == null) {
        return false;
    }
    return true;
}

function block(msg, timeInt) {
    setTimeout(function () {
        art.artDialog.tips(msg).lock().time(0);
    }, 1);
    if (timeInt) {
        setTimeout(function () {
            art.artDialog.tips().close();
        }, timeInt);
    }
}

function unblock(timeInt) {
    if (!timeInt) {
        timeInt = 1;
    }
    setTimeout(function () {
        art.artDialog.tips().close();
    }, timeInt);
}

/**
 * Y  年份，数字。包括世纪     2012
 * y  不带世纪的年份，数字     00~99
 * m  月份，数字               01~12
 * n  月份，数字。无前导零     1~12
 * d  每月中的第几天，数字     01~31
 *
 * H  小时，数字，24小时制     00~23
 * h  小时，数字，12小时制     01~12
 * i  分钟，数字               00~59
 * s  秒，数字                 00~60
 *
 * ms 毫秒，数字               0~999
 */
function formatDate(format, date) {
    date = date ? date : new Date();
    var regdate = /[\\\/:_;.,\t\T\s-]/;
    //var format = "Y-m-d h:i:s ms";
    var formatArr = format.split(regdate);
    var flen = formatArr.length;
    var reStr = "";
    for (var i = 0; i < flen; i++) {
        var strFormat = formatArr[i];
        if (strFormat == "Y") {
            reStr = date.getFullYear();
            format = format.replace(strFormat, reStr);
            continue;
        } else if (strFormat == "y") {
            reStr = date.getFullYear().toString();
            reStr = reStr.substr(2);
            format = format.replace(strFormat, reStr);
            continue;
        } else if (strFormat == "m") {
            reStr = date.getMonth() + 1;
            if (reStr < 10) {
                reStr = "0" + reStr;
            }
            format = format.replace(strFormat, reStr);
            continue;
        } else if (strFormat == "n") {
            reStr = date.getMonth() + 1;
            format = format.replace(strFormat, reStr);
            continue;
        } else if (strFormat == "d") {
            reStr = date.getDate();
            if (reStr < 10) {
                reStr = "0" + reStr;
            }
            format = format.replace(strFormat, reStr);
            continue;
        } else if (strFormat == "H") {
            reStr = date.getHours();
            if (reStr < 10) {
                reStr = "0" + reStr;
            }
            format = format.replace(strFormat, reStr);
            continue;
        } else if (strFormat == "h") {
            reStr = date.getHours();
            if (reStr > 12) {
                reStr = reStr - 12;
            }
            if (reStr < 10) {
                reStr = "0" + reStr;
            }
            format = format.replace(strFormat, reStr);
            continue;
        } else if (strFormat == "i") {
            reStr = date.getMinutes();
            if (reStr < 10) {
                reStr = "0" + reStr;
            }
            format = format.replace(strFormat, reStr);
            continue;
        } else if (strFormat == "s") {
            reStr = date.getSeconds();
            if (reStr < 10) {
                reStr = "0" + reStr;
            }
            format = format.replace(strFormat, reStr);
            continue;
        } else if (strFormat == "ms") {
            reStr = date.getMilliseconds();
            if (reStr < 10) {
                reStr = "0" + reStr;
            }
            format = format.replace(strFormat, reStr);
            continue;
        }
    }
    return format;
}
function getDiffDate(anYear, anMonth, anDay, anHour, anMinute, anSecond) {
    var loDate = new Date();
    loDate.setTime(0);
    if (anSecond != undefined) {
        loDate.setSeconds(anSecond);
    }
    if (anMinute != undefined) {
        loDate.setMinutes(anMinute);
    }
    if (anHour != undefined) {
        loDate.setHours(anHour)
    }

    if (anYear != undefined) {
        loDate.setFullYear(anYear);
    }
    if (anMonth != undefined) {
        loDate.setMonth(anMonth);
    }
    if (anDay != undefined) {
        loDate.setDate(anDay)
    }


    if (loDate.getDate() != anDay) {
        loDate.setDate(0);
    }
//	if(anMonth != undefined)
//	{
//		loDate.setMonth(anMonth);
//	}
    return loDate;
}

function setDatePicker(slctname, callback) {
    //date picker in alarm confrim dialog
    $('#' + slctname).datetimepicker({
        showSecond: true,
        showMillisec: false,
        timeFormat: 'hh:mm:ss',
        changeMonth: true,
        changeYear: true,
        beforeShow: function (i, e) {
            var z = jQuery(i).closest(".ui-dialog").css("z-index") +100;
            e.dpDiv.css('z-index', z);
        },
        dateFormat: 'yy-mm-dd',
        timeOnlyTitle: '时间选择',
        timeText: '时间',
        hourText: '时',
        minuteText: '分',
        secondText: '秒',
        currentText: '当前时间',
        closeText: '完成',
        onSelect: function (selectedDateTime) {
            if (typeof callback == 'function') {
                callback(selectedDateTime);
            }
        }
    });
}

function domAddCSS() {
    if (checkIE(6)) {
        $("#generalDialog .dialogFiled").css({
            'width': '120px',
            'font-size': '12px'
        });
        $("#generalDialog .dialogsFiled").css({
            'width': '120px',
            'font-size': '12px'
        });
    } else {
        $("#generalDialog .dialogFiled").css({
            'width': '130px',
            'font-size': '12px'
        });
        $("#generalDialog .dialogsFiled").css({
            'width': '137px',
            'font-size': '12px'
        });
    }
}
function domAddCSSMM() {
    if (checkIE(6)) {
        $("#generalDialog .dialogFiled").css({
            'width': '70px',
            'font-size': '12px'
        });
        $("#generalDialog .dialogsFiled").css({
            'width': '70px',
            'font-size': '12px'
        });
    } else {
        $("#generalDialog .dialogFiled").css({
            'width': '70px',
            'font-size': '12px'
        });
        $("#generalDialog .dialogsFiled").css({
            'width': '77px',
            'font-size': '12px'
        });
    }
}

function domAddCSSRR() {
    if (checkIE(6)) {
        $("#generalDialog .dialogFiled").css({
            'width': '130px',
            'font-size': '12px'
        });
        $("#generalDialog .dialogsFiled").css({
            'width': '130px',
            'font-size': '12px'
        });
    } else {
        $("#generalDialog .dialogFiled").css({
            'width': '137px',
            'font-size': '12px'
        });
        $("#generalDialog .dialogsFiled").css({
            'width': '130px',
            'font-size': '12px'
        });
    }
}

/**
 * 设置tabs标签页跳转
 * tabId  tabs标签Id
 * name 标签a的name属性
 * contentDoc tabs所在的document
 */
function initTabsSelect(tabId, name, contentWin) {
    if (typeof contentWin == "undefined") {
        contentWin = window;
    }
    var check = true;
    $("#" + tabId + " a", contentWin.document).each(function (index, element) {
        if (check && $(this).attr("name") == name) {
            check = false;
            contentWin.$("#" + tabId).tabs('select', index);
        }
    });
}
function VerifyTheTime(startTime, endTime, startname, endname) {
    startname = startname || "开始时间";
    endname = endname || "结束时间";

    var reg = /^\d{4}-(?:0\d|1[0-2])-(?:[0-2]\d|3[01])( (?:[01]\d|2[0-3])\:[0-5]\d\:[0-5]\d)?$/;
    var rStart = startTime.match(reg);
    var rEnd = endTime.match(reg);
    if (startTime != "" && rStart == null) {
        block(startname + "格式错误！", 2000);
        return false;
    }
    else if (endTime != "" && rEnd == null) {
        block(endname + "格式错误！", 2000);
        return false;
    }
    else if (endTime != "" && startTime > endTime) {
        block(endname + "应大于" + startname + "！", 2000);
        return false;
    }
    else {
        return true;
    }
}

function saveFile(fileURL) {
    var fileURL = window.location.href(fileURL, "_blank", "height=0,width=0,toolbar=no,menubar=no,scrollbars=no,resizable=on,location=no,status=no");
    //fileURL.document.execCommand("SaveAs");
    fileURL.window.close();
    fileURL.close();
}

/**
 * 去掉左右空格
 */
function trim(str) { //删除左右两端的空格
    return $.trim(str);
}

/**
 * 验证数字，非数字返回false
 */
function validNums(data) {
    if (data != null && data != "") {
        return !isNaN(data);
    }

    return false;
}

/**
 * 验证空值，空时返回false
 */
function validEmpty(data) {
    if (data == null || data.length == 0 || typeof data == 'undefined') {
        return false;
    }
    {
        return true;
    }
}

function VerifyTheTimeFormat(value, msg) {
    var reg = /^\d{4}-(?:0\d|1[0-2])-(?:[0-2]\d|3[01])( (?:[01]\d|2[0-3])\:[0-5]\d\:[0-5]\d)?$/;
    var r = value.match(reg)
    if (r == null) {

        block(msg, 2000);
        return false;
    }

    return true;
}

Date.prototype.Format = function (formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

    str = str.replace(/MM/, this.getMonth() > 9 ? this.getMonth().toString() : '0' + this.getMonth());
    str = str.replace(/M/g, this.getMonth());

    str = str.replace(/w|W/g, Week[this.getDay()]);

    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());

    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());

    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());

    return str;
}

function addPowerBtn(ModelAuth, gridId, fnCallback, params) {
    if ($.isArray(ModelAuth)) {
        var options = {
            pager: "#pager"
        };
        $.extend(options, params);
        $.each(ModelAuth, function (index, childData) {

            var fnName = childData.type;
            if (fnCallback[fnName]) {
                $("#" + gridId).navButtonAdd(options.pager, {
                    caption: childData.title,
                    buttonicon: childData.buttonicon,
                    onClickButton: function () {
                        eval(fnCallback[fnName]);
                    },
                    position: "last"
                });
            }
        });
    }
}
function getGridParam() {
    var height = $("#main").height() - 80;
    var loRowNunber = Math.floor(height / 22) - 1;
    return {height: height, rowCount: loRowNunber};
}
function initInputStyle(params) {
    var options = {
        fontSize: "14px",
        inputWidth: 130,
        selectOffset: 5,
        inputMargin: "5px 0 5px 0",
        textAlign: "left",
        textWidth: 80,
        textPaddingLeft: "10px",

        inputClass: "dialogInput",
        selectClass: "dialogSelect",
        textClass: "dialogText"
    };
    $.extend(options, params);
    var fontSize = '14px';
    var dialogInputStyle = {
        'width': options.inputWidth + "px",
        'margin': options.inputMargin,
        'text-align': options.textAlign,
        'font-size': options.fontSize
    };
    var dialogSelectStyle = {
        'width': (options.inputWidth + options.selectOffset) + "px",
        'margin': options.inputMargin,
        'text-align': options.textAlign,
        'font-size': options.fontSize
    };
    var dialogTextStyle = {
        'width': options.textWidth + "px",
        'padding-left': options.textPaddingLeft,
        'text-align': options.textAlign,
        'font-size': options.fontSize
    };
    if (checkIE(6)) {
        dialogInputStyle = {
            'width': options.inputWidth + "px",
            'text-align': options.textAlign,
            'font-size': options.fontSize
        };
        dialogSelectStyle = {
            'width': options.inputWidth + "px",
            'text-align': options.textAlign,
            'font-size': options.fontSize
        };
    }

    $("." + options.inputClass).css(dialogInputStyle);
    $("." + options.selectClass).css(dialogSelectStyle);
    $("." + options.textClass).css(dialogTextStyle);
}
function closeArtDialog(id) {
    id = id || "artDialog_id";
    art.dialog({id: id}).close()
}


function openArtDialog(urlParams, artParams, callbackFn, styleParams) {
    var artOptions = {
        title: '',
        id: "artDialog_id",
        lock: true,
        init: function () {
            initInputStyle(styleParams);
        }
    };
    var callbackFunctions = {
        reload: function () {
        }
    };
    $.extend(callbackFunctions, callbackFn);

    var style = "overflow-x: hidden;overflow-y: auto;";
    var height = $(window).height();
    height -= 150;
    if (artParams.height) {
        if (artParams.height < height) {
            height = artParams.height;
        }
        delete artParams.height;
        style += "height:" + height + "px;";
    }

    var width = $(window).width();
    width -= 150;
    if (artParams.width) {
        if (artParams.width < width) {
            width = artParams.width;
        }
        artParams.width = width;
    }
    style += "width:" + artParams.width + "px;";

    style = "style=\"" + style + "\"";

    var ajaxOptions = {
        type: "POST",
        data: {},
        async: true,
        cache: false,
        dataType: "html",
        success: function (html) {
            var content = "<div " + style + ">" + html + "</div>";
            artOptions.content = content;
            $.extend(artOptions, artParams);

            $.artDialog(artOptions);

            callbackFunctions.reload(callbackFunctions.parameters);
        }
    };

    $.extend(ajaxOptions, urlParams);
    ajaxOptions.data.width = width;
    ajaxOptions.data.height = height;
    $.ajax(ajaxOptions);
}

function openArtDialogSearch(urlParams, artParams, callbackFn, styleParams) {
    var artOptions = {
        title: '',
        id: "artDialog_id",
        lock: true,
        init: function () {
            initInputStyle(styleParams);
        }
    };
    var callbackFunctions = {
        reload: function () {
        }
    };
    $.extend(callbackFunctions, callbackFn);

    var style = "";
    var height = $(window).height();
    height -= 150;
    if (artParams.height) {
        if (artParams.height < height) {
            height = artParams.height;
        }
        delete artParams.height;
        style += "height:" + height + "px;";
    }

    var width = $(window).width();
    width -= 150;
    if (artParams.width) {
        if (artParams.width < width) {
            width = artParams.width;
        }
        artParams.width = width;
    }
    style += "width:" + artParams.width + "px;";

    style = "style=\"" + style + "\"";

    var ajaxOptions = {
        type: "POST",
        data: {},
        async: true,
        cache: false,
        dataType: "html",
        success: function (html) {
            var content = "<div " + style + ">" + html + "</div>";
            artOptions.content = content;
            $.extend(artOptions, artParams);

            $.artDialog(artOptions);

            callbackFunctions.reload(callbackFunctions.parameters);
        }
    };

    $.extend(ajaxOptions, urlParams);
    ajaxOptions.data.width = width;
    ajaxOptions.data.height = height;
    $.ajax(ajaxOptions);
}

function confirmDialog(params) {
    var options = {
        msg: "",
        ok: function () {
        },
        cancel: function () {
        }
    };
    $.extend(options, params);
    art.dialog.confirm(options.msg, function () {
        options.ok();
    }, function () {
        options.cancel();
    });
}
function alertDialog(msg) {
    msg = msg || "";
    art.dialog.alert(msg);
}
function flexboxSelector(selectObj, datas, selectorCallback, option) {
    if (typeof(option) == 'undefined') {
        option = {
            width: 155,
            noResultsText: "无匹配数据",
            watermark: ''
        }
    }

    if (typeof(datas.total) == "undefined") {
        datas = {
            "results": {"name": "无匹配数据"},
            "total": 1
        }
    }

    $(selectObj, top.document).flexbox(datas, {
        width: option.width,
        noResultsText: option.noResultsText,
        watermark: option.watermark,
        paging: {
            summaryTemplate: '{start}-{end}' // can use {page} and {pages} as well
        },
        onSelect: selectorCallback
    });
}
//combobox不联动查询
function comboboxSeach(selectObj, datas){
    var BOXHTML = '<option value="">请选择</option>';
    if(datas != null && datas != ''){
        $.each(datas,function(k,v){
            BOXHTML += "<option title='"+v.name+"' value='"+v.id+"' code='"+v.code+"'>"+v.name+"</option>";
        });
    }
    $(selectObj).empty();
    $(selectObj).append(BOXHTML);
    $(selectObj).combobox({

    });
}
//type 是设置清空范围 设置为true清空同行 <tr> 不设置则清空本栏位之后的所有元素内容
//func 是设置返回方法是否传value值 不传为true，默认false传值
function comboboxSelector(selectObj, datas, selectorCallback,option) {
    if (typeof(option) == 'undefined') {
        option = {
            type :'',
            func :false,
            Rback:false,
            disabled:false
        };
    }
    var BOXHTML = '<option value="">请选择</option>';
    if(datas != null && datas != ''){
        if(option.Rback == true){
            $.each(datas,function(k,v){
                BOXHTML += "<option title='"+v.name+"' value='"+v.name+"' code='"+v.code+"'>"+v.name+"</option>";
            });
        }else {
            $.each(datas,function(k,v){
                BOXHTML += "<option title='"+v.name+"' value='"+v.id+"' code='"+v.code+"'>"+v.name+"</option>";
            });
        }
    }
    $(selectObj).empty();
    $(selectObj).append(BOXHTML);
    $(selectObj).combobox({

        select: function( event, ui ) {
            if(option.disabled == true){
                $(this).next('span').children('input').attr({'disabled':'disabled'});
            }

            //重新选择时清空下边相关联的内容
            if(option.type == 'row'){
                $(this).parent().nextAll().children('span').children('input').val('');
                $(this).parent().nextAll().children('select').empty();
            }else if(option.type == 'next'){
                $(this).parent().parent().next('tr').children('td').children('span').children('input').val('');
                $(this).parent().parent().next('tr').children('td').children('select').empty();
            }else{
                $(this).parent().nextAll().children('span').children('input').val('');
                $(this).parent().parent().nextAll('tr').children('td').children('span').children('input').val('');
                $(this).parent().nextAll().children('select').empty();
                $(this).parent().parent().nextAll('tr').children('td').children('select').empty();
            }
            if(selectorCallback){
                if(option.func == true){
                    selectorCallback();
                }else{
                    selectorCallback(ui.item.value,event.target.id);
                }
            }
        },
        change:function(event, ui){
            if(option.type == 'row'){
                $(this).parent().nextAll().children('span').children('input').val('');
                $(this).parent().nextAll().children('select').empty();
            }else if(option.type == 'next'){
                $(this).parent().parent().next('tr').children('td').children('span').children('input').val('');
                $(this).parent().parent().next('tr').children('td').children('select').empty();
            }else{
                $(this).parent().nextAll().children('span').children('input').val('');
                $(this).parent().parent().nextAll('tr').children('td').children('span').children('input').val('');
                $(this).parent().nextAll().children('select').empty();
                $(this).parent().parent().nextAll('tr').children('td').children('select').empty();
            }
        }
    });
}

/*
 *文件上传
 */
function uploadFiles(module) {
    if (typeof(module) == "undefined") {
        artDialog.alert('参数错误！');
        return false;
    }

    block("正在上传中...", 0);

    $.ajaxFileUpload({
        url: GVar.INTO + '/Util/Upload/attachmentUpload?module=' + module + '&date=' + new Date(),
        secureuri: false,
        fileElementId: "fileToUpload",
        dataType: 'json',
        success: function (data) {
            if (data.status == 'success') {
                block(data.info, 1000);

                var html = '<tr id="' + data.id + '">' +
                    '<td align="left" width="80%">' + data.oldfilename + '</td>' +
                    '<td align="center">' +
                    '<a href="' + data.savepath + '" target="_blank">下载</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<a href="javascript:delToDoFiles(\'' + data.id + '\');">删除</a>' +
                    '</td>' +
                    '</tr>';
                $('#uploadfilestbl', top.document).append(html);

            }
            else {
                unblock();
                artDialog.alert(data.info, 1000);
                return false;
            }
        }
    });
}

/**
 * 下载附件 检测是否存在
 * @param url：远程请求地址
 * @param Params post请求参数
 * */

function checkfileExists(filepath) {
    block("文件创建中...", 0);
    $.ajax({
        url: GVar.INTO + "/Util/getFile/checkfileExists?" + new Date(),
        type: "POST",
        data: "filepath=" + filepath,
        dataType: "json",
        success: function (data) {
            unblock();
            if (data.status == 1) {
                artDialog.confirm("点击确定下载", function () {
                    window.open(data.filepath, '_blank');
                });
            } else {
                artDialog.alert('文件不存在');
            }
        }, error: function (XMLHttpRequest, textStatus) {
            unblock();
            artDialog.alert("页面请求错误，请联系系统管理员！\n" + textStatus);
        }
    });
}

/**
 * 文件导出，下载操作
 * @param url：远程请求地址
 * @param Params post请求参数
 */
function fileDownload(url, Params, isFileUrl) {
    if (isFileUrl) {
        artDialog.confirm("点击确定下载", function () {
            window.location.href = url;
        });
    } else {
        block("文件创建中...", 0);
        $.ajax({
            type: "post",
            dataType: "json",
            url: url,
            data: Params,
            cache: false,
            async: true,
            success: function (data) {
                if (data.status == 'error') {
                    artDialog.alert(data.info);
                    unblock();
                } else if (data.status == 'success') {
                    unblock();
                    artDialog.confirm("点击确定下载", function () {
                        window.location.href = data.url;
                    });
                    //block("<a href='"+data.url+"' onclick='unblock()'>点击下载</a>");
                }
            }, error: function (XMLHttpRequest, textStatus) {
                unblock();
                artDialog.alert("页面请求错误，请联系系统管理员！\n" + textStatus);
            }
        });
    }
}
/**
 * 双击打开后下载文件
 */
function getFilesByAid(aids) {
    $.ajax({
        url: GVar.INTO + "/Util/getFile/downloadFiles?" + new Date(),
        type: "POST",
        async: false,
        data: "aids=" + aids,
        dataType: "json",
        error: function () {
        },
        success: function (data) {
            if (data.status == 'success') {
                window.open(data.url);
            } else {
                artDialog.alert('压缩包生成失败');
            }
        }
    });
}
/**
 * 附件删除
 * zhangbin
 * 2014-7-31
 */
function delToDoFiles(delFile) {
    $('#' + delFile).remove();
}

//新增公共方法 代码开始
/**搜索框联动绑定
 * @curr_selector 当前select的ID
 * @parent_selector 父级别ID
 * @url 异步请求地址
 */
function mySearch(curr_selector, parent_selector, url) {
    $(curr_selector).remoteChained(parent_selector, url);
}
/**
 * 4级查询下拉框联动:管理单位-站库名称-机组类型-运行编号
 * user:zhangbin
 * date:2014-7-25
 */
function initStopSearchList(username, tblname, factoryid, setid, unittypeid, plantid) {
    //管理单位
    $.getJSON(GVar.INTO + "/Util/Select/getTableFactoryList?tblname=" + tblname,
        function (result) {
            try {
                var lstHtml = "<option title='全部' value=''>全部</option>";
                $.each(result.result, function (index, loFactory) {
                    lstHtml += "<option title=\"" + loFactory.factory_name + "\" value=\"" + loFactory.factory_name + "\">" + loFactory.factory_name + "</option>";
                });
                $('#' + factoryid).append(lstHtml);
            } catch (e) {

            }
        }
        , "json");
    //机组类型
    $.getJSON(GVar.INTO + "/Util/Select/getTableUnitTypeList?",
        {
            "tblname": "plant_unit_info",
            "tblnames": tblname
        },
        function (result) {
            try {
                var lstHtml = "<option title='全部' value=''>全部</option>";
                if (result.result != undefined) {
                    $.each(result.result, function (index, loPlant) {
                        lstHtml += "<option title=\"" + loPlant.unit_type + "\" value=\"" + loPlant.unit_typecode + "\">" + loPlant.unit_type + "</option>";
                    });
                }
                $('#' + unittypeid).html(lstHtml);
            } catch (e) {

            }
        }
        , "json");
    //运行编号
    $.getJSON(GVar.INTO + "/Util/Select/getPlantList?tblname=" + tblname,
        function (result) {
            try {
                var lstHtml = "";
                if (result.result != undefined) {
                    $.each(result.result, function (index, loPlant) {
                        lstHtml += "<option title=\"" + loPlant.plant_id + "\" value=\"" + loPlant.plant_id + "\">" + loPlant.plant_id + "</option>";
                    });
                }
                $('#' + plantid).append(lstHtml);
            } catch (e) {

            }
        }
        , "json");
    //管理单位触发站库名称
    var url = GVar.INTO + "/Util/Select/getTableSetName?tblname=" + tblname;
    top.mySearch('#' + setid, '#' + factoryid, url);
    //管理单位触发机组类型、运行编号
    $('#' + factoryid).bind("change", function () {
        var loFactory = $('#' + factoryid).val();
        $.getJSON(GVar.INTO + "/Util/Select/getTableUnitTypeList?",
            {
                "tblname": "plant_unit_info",
                "tblnames": "plant_unit_info",
                "S_factoryName": loFactory
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loPlant) {
                            lstHtml += "<option title=\"" + loPlant.unit_type + "\" value=\"" + loPlant.unit_typecode + "\">" + loPlant.unit_type + "</option>";
                        });
                    }
                    $('#' + unittypeid).html(lstHtml);
                } catch (e) {

                }
            }
            , "json");
        $.getJSON(GVar.INTO + "/Util/Select/getPlantList?",
            {
                "tblname": tblname,
                "factory": loFactory
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loPlant) {
                            lstHtml += "<option title=\"" + loPlant.plant_name + "\" value=\"" + loPlant.plant_name + "\">" + loPlant.plant_name + "</option>";
                        });
                    }
                    $('#' + plantid).html(lstHtml);
                } catch (e) {

                }
            }
            , "json");
    });
    //站库名称触发运行编号
    $('#' + setid).bind("change", function () {
        var loFactory = $('#' + factoryid).val();
        var loSet = $('#' + setid).val();
        $.getJSON(GVar.INTO + "/Util/Select/getTableUnitTypeList?",
            {
                "tblname": "plant_unit_info",
                "S_factoryName": loFactory,
                "S_SetName": loSet,
                "tblnames": tblname
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loPlant) {
                            lstHtml += "<option title=\"" + loPlant.unit_type + "\" value=\"" + loPlant.unit_typecode + "\">" + loPlant.unit_type + "</option>";
                        });
                    }
                    $('#' + unittypeid).html(lstHtml);
                } catch (e) {

                }
            }
            , "json");
        $.getJSON(GVar.INTO + "/Util/Select/getPlantList?",
            {
                "tblname": tblname,
                "factory": loFactory,
                "set": loSet
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loPlant) {
                            lstHtml += "<option title=\"" + loPlant.plant_id + "\" value=\"" + loPlant.plant_id + "\">" + loPlant.plant_id + "</option>";
                        });
                    }
                    $('#' + plantid).html(lstHtml);
                } catch (e) {

                }
            }
            , "json");
    });
    //选择机组类型后，更新运行编号
    $('#' + unittypeid).bind("change", function () {
        var loFactory = $('#' + factoryid).val();
        var loSet = $('#' + setid).val();
        var loPlanttype = $('#' + unittypeid).val();
        $.getJSON(GVar.INTO + "/Util/Select/getPlantList?tblname=" + tblname,
            {
                "tblname": tblname,
                "factory": loFactory,
                "set": loSet,
                "planttype": loPlanttype
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loPlant) {
                            lstHtml += "<option title=\"" + loPlant.plant_id + "\" value=\"" + loPlant.plant_id + "\">" + loPlant.plant_id + "</option>";
                        });
                    }
                    $('#' + plantid).html(lstHtml);
                } catch (e) {

                }
            }
            , "json");
    });
}

//新增公共方法 代码结束

/**
 *form表单的ajax方式提交
 * @param formID form表单ID
 * @param options 扩展配置
 */
function ajaxSubmit(formID, options, jqGridID) {

    var defaultOptions = {
        dataType: 'json',
        resetForm: false,
        beforeSubmit: null,
        clearForm: false, //
        success: function (data, statusText, xhr, $form) {
            if (data.status == 'success') {
                block(data.content, 1500);
                if (isObjValid(jqGridID)) { //循环刷新多个jqGrid
                    for (var i = 0; i < jqGridID.length; i++) {
                        $('#' + jqGridID[i]).jqGrid('setGridParam', {}).trigger("reloadGrid");
                    }
                } else {
                    $('#' + jqGridID).jqGrid('setGridParam', {}).trigger("reloadGrid");
                }
                closeArtDialog(options.artID);
                return true;
            } else {
                artDialog.alert(data.content);
                return false;
            }
        }, error: function (XMLHttpRequest, textStatus) {
            artDialog.alert("页面请求错误，请联系系统管理员！\n" + textStatus);
        }
    };
    $.extend(defaultOptions, options);
    $('#' + formID).ajaxSubmit(defaultOptions);
}
/**
 * Y                4 位数字完整表示的年份
 * m                数字表示的月份，有前导零
 * d                月份中的第几天，有前导零的 2 位数字
 * l（“L”的小写字母）    星期几，完整的文本格式
 *
 * h    小时，12 小时格式，有前导零
 * H    小时，24 小时格式，有前导零
 * i    有前导零的分钟数
 * s    秒数，有前导零
 * a    小写的上午和下午值    am 或 pm
 * U    从 Unix 纪元（January 1 1970 00:00:00 GMT）开始至今的秒数
 */
function server_date(format, timestamp) {
    var dateFormat = function (val) {
        if (val < 10) {
            val = "0" + val;
        }
        return val;
    };

    var time = format ? format : 'Y-m-d H:i:s';

    var date = new Date();
    if (!timestamp) {
        var timestamp_temp = date.getTime();

        var local = GVar.LOCALTIME ? GVar.LOCALTIME : 0;
        var server = GVar.SERVERTIME ? GVar.SERVERTIME : 0;
        timestamp = parseInt(server) + parseInt(timestamp_temp / 1000) - parseInt(local);
    }
    timestamp *= 1000;

    date.setTime(timestamp);
    var Y = date.getFullYear();
    var m = date.getMonth();
    m = dateFormat(m + 1);
    var d = date.getDate();
    d = dateFormat(d);
    var l = date.getDay();
    var H = date.getHours();
    var h = H <= 12 ? H : H - 12;
    H = dateFormat(H);
    h = dateFormat(h);
    var i = date.getMinutes();
    i = dateFormat(i);
    var s = date.getSeconds();
    s = dateFormat(s);
    var a = H <= 12 ? "am" : "pm";
    var U = timestamp / 1000;

    var loTR = ["Y", "m", "d", "l", "H", "h", "i", "s", "a", "U"];
    $.each(loTR, function (index, str) {
        var reg = "/" + str + "/g";
        time = time.indexOf(str) == -1 ? time : time.replace(eval(reg), eval(str));
    });

    return time;
}


/**
 * 5级查询下拉框联动:公司-分厂-装置-设备类型-运行编号
 */
function five_level_linkage_menu(username,tblname, groupid, companyid,factoryid, setid,unittypeid, plantid) {
    //集团
    $.getJSON(GVar.INTO + "/Util/Select/getTableGroupList?tblname=" + tblname,
        function (result) {
            try {
                var lstHtml = "";
                $.each(result.result, function (index, loGroup) {
                    lstHtml += "<option title=\"" + loGroup.group_name + "\" value=\"" + loGroup.group_name + "\">" + loGroup.group_name + "</option>";
                });
                $('#' + groupid).append(lstHtml);
                lstHtml = '';  //清除缓存
            } catch (e) {

            }
        }
        , "json");

    //公司
    $.getJSON(GVar.INTO + "/Util/Select/getTableCompanyList?tblname=" + tblname,
        function (result) {
            try {
                var lstHtml = "";
                $.each(result.result, function (index, loCompany) {
                    lstHtml += "<option title=\"" + loCompany.company_name + "\" value=\"" + loCompany.company_name + "\">" + loCompany.company_name + "</option>";
                });
                $('#' + companyid).append(lstHtml);
                lstHtml = '';
            } catch (e) {

            }
        }
        , "json");

    //分厂
    $.getJSON(GVar.INTO + "/Util/Select/getTableFactoryList?tblname=" + tblname,
        function (result) {
            try {
                var lstHtml = "";
                $.each(result.result, function (index, loFactory) {
                    lstHtml += "<option title=\"" + loFactory.factory_name + "\" value=\"" + loFactory.factory_name + "\">" + loFactory.factory_name + "</option>";
                });
                $('#' + factoryid).append(lstHtml);
                lstHtml = '';
            } catch (e) {

            }
        }
        , "json");

    //装置级
    $.getJSON(GVar.INTO + "/Util/Select/getTableSetList?tblname=" + tblname,
        function (result) {
            try {
                var lstHtml = "";
                if (result.result != undefined) {
                    $.each(result.result, function (index, loSet) {
                        lstHtml += "<option title=\"" + loSet.set_name + "\" value=\"" + loSet.set_name + "\">" + loSet.set_name + "</option>";
                    });
                }
                $('#' + setid).append(lstHtml);
                lstHtml = '';
            } catch (e) {

            }
        }
        , "json");

    //运行编号
    $.getJSON(GVar.INTO + "/Util/Select/getPlantList?tblname=" + tblname,
        function (result) {
            try {
                var lstHtml = "";
                if (result.result != undefined) {
                    $.each(result.result, function (index, loPlant) {
                        lstHtml += "<option title=\"" + loPlant.plant_id + "\" value=\"" + loPlant.plant_id + "\">" + loPlant.plant_id + "</option>";
                    });
                }
                $('#' + plantid).append(lstHtml);
                lstHtml = '';
            } catch (e) {

            }
        }
        , "json");

    //设备类型
    $.getJSON(GVar.INTO + "/Util/Select/getTableUnitTypeList?",
        {
            "tblname": "plant_unit_info",
            "tblnames": tblname
        },
        function (result) {
            try {
                var lstHtml = "";
                if (result.result != undefined) {
                    $.each(result.result, function (index, loUnittype) {
                        lstHtml += "<option title=\"" + loUnittype.unit_type + "\" value=\"" + loUnittype.unit_typecode + "\">" + loUnittype.unit_type + "</option>";
                    });
                }
                $('#' + unittypeid).append(lstHtml);
                lstHtml = '';
            } catch (e) {

            }
        }
        , "json");
    //集团触发公司、分公司、装置、运行编号、设备类型
    $('#' + groupid).bind("change", function () {
        var loGroup = $('#' + groupid).val();
        $.getJSON(GVar.INTO + "/Util/Select/getTableCompanyList?",
            {
                "tblname": tblname,
                "group": loGroup
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loCompany) {
                            lstHtml += "<option title=\"" + loCompany.company_name + "\" value=\"" + loCompany.company_name + "\">" + loCompany.company_name + "</option>";
                        });
                    }
                    $('#' + companyid).html(lstHtml);
                    lstHtml = '';
                } catch (e) {

                }
            }
            , "json");

        $.getJSON(GVar.INTO + "/Util/Select/getTableFactoryList?",
            {
                "tblname": tblname,
                "group": loGroup
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loFactory) {
                            lstHtml += "<option title=\"" + loFactory.factory_name + "\" value=\"" + loFactory.factory_name + "\">" + loFactory.factory_name + "</option>";
                        });
                    }
                    $('#' + factoryid).html(lstHtml);
                    lstHtml = '';
                } catch (e) {

                }
            }
            , "json");

        $.getJSON(GVar.INTO + "/Util/Select/getTableSetList?",
            {
                "tblname": tblname,
                "group": loGroup
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loSet) {
                            lstHtml += "<option title=\"" + loSet.set_name + "\" value=\"" + loSet.set_name + "\">" + loSet.set_name + "</option>";
                        });
                    }
                    $('#' + setid).html(lstHtml);
                    lstHtml = '';
                } catch (e) {

                }
            }
            , "json");

        $.getJSON(GVar.INTO + "/Util/Select/getPlantList?",
            {
                "tblname": tblname,
                "group": loGroup
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loPlantid) {
                            lstHtml += "<option title=\"" + loPlantid.plant_id + "\" value=\"" + loPlantid.plant_id + "\">" + loPlantid.plant_id + "</option>";
                        });
                    }
                    $('#' + plantid).html(lstHtml);
                    lstHtml = '';
                } catch (e) {

                }
            }
            , "json");

        $.getJSON(GVar.INTO + "/Util/Select/getTableUnitTypeList?",
            {
                "tblname": "plant_unit_info",
                "tblnames": tblname,
                "group": loGroup
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loUnittype) {
                            lstHtml += "<option title=\"" + loUnittype.unit_type + "\" value=\"" + loUnittype.unit_typecode + "\">" + loUnittype.unit_type + "</option>";
                        });
                    }
                    $('#' + unittypeid).html(lstHtml);
                    lstHtml = '';
                } catch (e) {

                }
            }
            , "json");
    });

    //公司触发分公司、装置、运行编号、设备类型
    $('#' + companyid).bind("change", function () {
        var loGroup = $('#' + groupid).val();
        var loCompany = $('#' + companyid).val();
        $.getJSON(GVar.INTO + "/Util/Select/getTableFactoryList?",
            {
                "tblname": tblname,
                "group": loGroup,
                "company": loCompany
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loFactory) {
                            lstHtml += "<option title=\"" + loFactory.factory_name + "\" value=\"" + loFactory.factory_name + "\">" + loFactory.factory_name + "</option>";
                        });
                    }
                    $('#' + factoryid).html(lstHtml);
                    lstHtml = '';
                } catch (e) {

                }
            }
            , "json");

        $.getJSON(GVar.INTO + "/Util/Select/getTableSetList?",
            {
                "tblname": tblname,
                "group": loGroup,
                "company": loCompany
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loSet) {
                            lstHtml += "<option title=\"" + loSet.set_name + "\" value=\"" + loSet.set_name + "\">" + loSet.set_name + "</option>";
                        });
                    }
                    $('#' + setid).html(lstHtml);
                    lstHtml = '';
                } catch (e) {

                }
            }
            , "json");

        $.getJSON(GVar.INTO + "/Util/Select/getPlantList?",
            {
                "tblname": tblname,
                "group": loGroup,
                "company": loCompany
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loPlantid) {
                            lstHtml += "<option title=\"" + loPlantid.plant_id + "\" value=\"" + loPlantid.plant_id + "\">" + loPlantid.plant_id + "</option>";
                        });
                    }
                    $('#' + plantid).html(lstHtml);
                    lstHtml = '';
                } catch (e) {

                }
            }
            , "json");

        $.getJSON(GVar.INTO + "/Util/Select/getTableUnitTypeList?",
            {
                "tblname": "plant_unit_info",
                "tblnames": tblname,
                "group": loGroup,
                "company": loCompany
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loUnittype) {
                            lstHtml += "<option title=\"" + loUnittype.unit_type + "\" value=\"" + loUnittype.unit_typecode + "\">" + loUnittype.unit_type + "</option>";
                        });
                    }
                    $('#' + unittypeid).html(lstHtml);
                    lstHtml = '';
                } catch (e) {

                }
            }
            , "json");
    });

    //分厂触发装置、运行编号、设备类型
    $('#' + factoryid).bind("change", function () {
        var loGroup = $('#' + groupid).val();
        var loCompany = $('#' + companyid).val();
        var loFactory = $('#' + factoryid).val();
        $.getJSON(GVar.INTO + "/Util/Select/getTableSetList?",
            {
                "tblname": tblname,
                "group" : loGroup,
                "company" : loCompany,
                "factory": loFactory
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loSet) {
                            lstHtml += "<option title=\"" + loSet.set_name + "\" value=\"" + loSet.set_name + "\">" + loSet.set_name + "</option>";
                        });
                    }
                    $('#' + setid).html(lstHtml);
                    lstHtml = '';
                } catch (e) {

                }
            }
            , "json");

        $.getJSON(GVar.INTO + "/Util/Select/getTableUnitTypeList?",
            {
                "tblname": "plant_unit_info",
                "tblnames": tblname,
                "group" : loGroup,
                "company" : loCompany,
                "factory": loFactory
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loUnittype) {
                            lstHtml += "<option title=\"" + loUnittype.unit_type + "\" value=\"" + loUnittype.unit_typecode + "\">" + loUnittype.unit_type + "</option>";
                        });
                    }
                    $('#' + unittypeid).html(lstHtml);
                    lstHtml = '';
                } catch (e) {

                }
            }
            , "json");

        $.getJSON(GVar.INTO + "/Util/Select/getPlantList?",
            {
                "tblname": tblname,
                "group" : loGroup,
                "company" : loCompany,
                "factory": loFactory
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loPlantid) {
                            lstHtml += "<option title=\"" + loPlantid.plant_id + "\" value=\"" + loPlantid.plant_id + "\">" + loPlantid.plant_id + "</option>";
                        });
                    }
                    $('#' + plantid).html(lstHtml);
                    lstHtml = '';
                } catch (e) {

                }
            }
            , "json");
    });

    //装置触发运行编号、设备类型
    $('#' + setid).bind("change", function () {
        var loGroup = $('#' + groupid).val();
        var loCompany = $('#' + companyid).val();
        var loFactory = $('#' + factoryid).val();
        var loSet = $('#' + setid).val();
        $.getJSON(GVar.INTO + "/Util/Select/getTableUnitTypeList?",
            {
                "tblname": "plant_unit_info",
                "tblnames": tblname,
                "group" : loGroup,
                "company" : loCompany,
                "factory": loFactory,
                "set": loSet
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loUnittype) {
                            lstHtml += "<option title=\"" + loUnittype.unit_type + "\" value=\"" + loUnittype.unit_typecode + "\">" + loUnittype.unit_type + "</option>";
                        });
                    }
                    $('#' + unittypeid).html(lstHtml);
                    lstHtml = '';
                } catch (e) {

                }
            }
            , "json");

        $.getJSON(GVar.INTO + "/Util/Select/getPlantList?",
            {
                "tblname": tblname,
                "group" : loGroup,
                "company" : loCompany,
                "factory": loFactory,
                "set": loSet
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loPlantid) {
                            lstHtml += "<option title=\"" + loPlantid.plant_id + "\" value=\"" + loPlantid.plant_id + "\">" + loPlantid.plant_id + "</option>";
                        });
                    }
                    $('#' + plantid).html(lstHtml);
                    lstHtml = '';
                } catch (e) {

                }
            }
            , "json");
    });

    //设备类型触发运行编号
    $('#' + unittypeid).bind("change", function () {
        var loGroup = $('#' + groupid).val();
        var loCompany = $('#' + companyid).val();
        var loFactory = $('#' + factoryid).val();
        var loSet = $('#' + setid).val();
        var loUnittype = $('#' + unittypeid).val();
        $.getJSON(GVar.INTO + "/Util/Select/getPlantList?",
            {
                "tblname": tblname,
                "group" : loGroup,
                "company" : loCompany,
                "factory": loFactory,
                "set": loSet,
                "unittype": loUnittype
            },
            function (result) {
                try {
                    var lstHtml = "<option title='全部' value=''>全部</option>";
                    if (result.result != undefined) {
                        $.each(result.result, function (index, loPlantid) {
                            lstHtml += "<option title=\"" + loPlantid.plant_id + "\" value=\"" + loPlantid.plant_id + "\">" + loPlantid.plant_id + "</option>";
                        });
                    }
                    $('#' + plantid).html(lstHtml);
                    lstHtml = '';
                } catch (e) {

                }
            }
            , "json");
    });
}


//获取指定form中的所有的<input>对象
function getElements(formId) {
    var form = document.getElementById(formId);
    var elements = new Array();

    var tagElements = form.getElementsByTagName('input');
    var tagSelects = form.getElementsByTagName('select');
    var tagtextarea = form.getElementsByTagName('textarea');

    for (var j = 0; j < tagElements.length; j++){
        elements.push(tagElements[j]);

    }
    for (var n = 0; n < tagSelects.length; n++){
        if(tagSelects[n].style.display == "none"){
            continue;
        }
        elements.push(tagSelects[n]);
    }

    for (var m = 0; m < tagtextarea.length; m++){
        elements.push(tagtextarea[m]);
    }
    return elements;
}

//获取单个input中的【name,value】数组
function inputSelector(element) {
    if (element.checked)
        return [element.name, element.value];
}

function input(element) {
    switch (element.type.toLowerCase()) {
        case 'submit':
        case 'hidden':
        case 'password':
        case 'text':
            return [element.name, element.value];
        case 'checkbox':
        case 'radio':
            return inputSelector(element);
        case 'select-one':
            return [element.name, element.value];
        case 'textarea':
            return [element.name, element.value];
    }
    return false;
}

//组合URL
function serializeElement(element) {
    var method = element.tagName.toLowerCase();
    var parameter = input(element);

    if (parameter) {
        var key = (parameter[0]);
        if (key.length == 0) return;

        if (parameter[1].constructor != Array)
            parameter[1] = [parameter[1]];

        var values = parameter[1];
        var results = [];
        for (var i=0; i<values.length; i++) {
            results.push(key + '=' +(values[i]));
        }
        return results.join('&');
    }
}

//获取表单数据
function serializeForm(formId) {
    var elements = getElements(formId);
    var queryComponents = new Array();

    for (var i = 0; i < elements.length; i++) {
        var queryComponent = serializeElement(elements[i]);
        if (queryComponent)
            queryComponents.push(queryComponent);
    }
    var strData = queryComponents.join('&');
    var data = strData.split('&');
    var postData = {};
    for(var i = 0; i < data.length; i++) {
        var da = data[i];
        var das = da.split('=');

        if(postData[das[0]] === undefined) {
            postData[das[0]] = [];
        }
        postData[das[0]].push(das[1]);
    }
    for(var name in postData) {
        if(postData[name].length == 1) {
            postData[name] = postData[name][0];
        }
    }
    return postData;
}


//判断数组是否为空
function isEmpty(obj) {

    // 用变量保存可以加速对对象原型的hasOwnProperty的访问。
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    // 本身为空直接返回true
    if (obj == null) return true;

    // 然后可以根据长度判断，在低版本的ie浏览器中无法这样判断。
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    //最后通过属性长度判断。
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
