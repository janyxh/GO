/*****************************************************************************************
 about: 此文件用于格式校验
 author: 马兆铿
 date: 2017-8-30
 *****************************************************************************************/

/*  正则校验构造函数
* @param reg使用的正则表达式
* @return 正则检验函数，参数str为要校验的字符串
* */
function RegCheck(reg) {
    return function (str) { //闭包函数
        return reg.test(str);
    };
}

/*  手机号校验
*   @param str输入的字符串
*   @return 校验是否正确的布尔值
* */
export let phoneRegCheck = RegCheck(/^1[3|5|7|8]\d{9}$/);

/*  邮箱校验
*   @param str输入的字符串
*   @return 校验是否正确的布尔值
* */
export let emailRegCheck = RegCheck(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/);

/*  密码规则校验
*   @param str输入的密码
*   @return 校验结果对象，包含isPass是否通过和info错误信息
* */
export let passwordCheck = (str)=>{
    let check = {    //返回的信息
        isPass: false,
        info: ''
    };
    const MIN_LEN = 6;  //长度限制
    const MAX_LEN = 16;
    let chineseReg = /.*[\u4e00-\u9fa5]+.*$/;    //汉字正则
    //
    if ( str === ''|| str.trim() === '' ){
        check.info = '请输入密码';
    }else if( str.length < MIN_LEN ){
        check.info = '密码长度不得小于' + MIN_LEN + '位';
    }else if ( str.length > MAX_LEN ){
        check.info = '密码长度不得大于' + MAX_LEN + '位';
    }else if( str.indexOf(' ') > 0 ){
        check.info = '密码不得包含空格';
    }else if(chineseReg.test(str)){
        check.info = '密码不得包含汉字';
    }else{
        check.isPass = true;
        check.info = '密码可以使用';
    }
    return check;
};

//电话号码
export let telRegCheck = RegCheck(/^(\d{3}-|\d{4}-)(\d{8}|\d{7})$/);

/*  联系人名称规则校验
*   @param str输入的密码
*   @return 校验结果对象，包含isPass是否通过和info错误信息
* */
export let contactsCheck = (str)=>{
    let check = {    //返回的信息
        isPass: false,
        info: ''
    };
    const MAX_LEN = 60;  //长度限制
    //
    if ( str === ''|| str.trim() === '' ){
        check.info = '请输入联系人名称';
    }else if ( str.length > MAX_LEN ){
        check.info = '联系人名称长度不得大于' + MAX_LEN + '位';
    }else{
        check.isPass = true;
        // check.info = '联系人名称可以使用';
    }
    return check;
};


/*  详细地址规则校验
*   @param str输入的密码
*   @return 校验结果对象，包含isPass是否通过和info错误信息
* */
export let addressCheck = (str)=>{
    let check = {    //返回的信息
        isPass: false,
        info: ''
    };
    const MAX_LEN = 100;  //长度限制
    //
    if ( str === ''|| str.trim() === '' ){
        check.info = '请输入详细地址';
    }else if ( str.length > MAX_LEN ){
        check.info = '详细地址长度不得大于' + MAX_LEN + '位';
    }else{
        check.isPass = true;
        // check.info = '联系人名称可以使用';
    }
    return check;
};


/*  办公室面积规则校验
*   @param str输入的密码
*   @return 校验结果对象，包含isPass是否通过和info错误信息
* */
export let officeSizeCheck = (str)=>{
    let check = {    //返回的信息
        isPass: false,
        info: ''
    };
    const MAX_LEN = 10;  //长度限制
    //
    if ( str === ''|| str.trim() === '' ){
        check.info = '请输入办公室面积';
    }else if( str.indexOf(' ') > 0 ){
        check.info = '办公室面积不得包含空格';
    }else if( str.indexOf(',') > 0 ){
        check.info = '办公室面积不得包含逗号';
    }else if (isNaN(Number(str)) || !Number.isInteger(Number(str))) {
        check.info = '请输入整数';
    }else if ( str.trim().length > MAX_LEN ){
        check.info = '办公室面积不得大于' + MAX_LEN + '位数';
    }else{
        check.isPass = true;
        // check.info = '联系人名称可以使用';
    }
    return check;
};


/*  办公室名称规则校验
*   @param str输入的密码
*   @return 校验结果对象，包含isPass是否通过和info错误信息
* */
export let officeNameCheck = (str)=>{
    let check = {    //返回的信息
        isPass: false,
        info: ''
    };
    const MAX_LEN = 32;  //长度限制
    //
    if ( str === ''|| str.trim() === '' ){
        check.info = '请输入办公室名称';
    }else if ( str.trim().length > MAX_LEN ){
        check.info = '办公室名称长度不得大于' + MAX_LEN + '位';
    }else{
        check.isPass = true;
        // check.info = '联系人名称可以使用';
    }
    return check;
};

/*  判断是否为ie9以下浏览器
*   @return IE 9以下返回 true
* */
export let checkInternetExplorer = ()=> {
    var browser = navigator.appName;
    var b_version = navigator.appVersion;
    var version = b_version.split(";");
    if (version.length > 1) {
        var trim_Version = parseInt(version[1].replace(/[ ]/g, "").replace(/MSIE/g, ""));
        if (trim_Version <= 9) {
            return true;
        }
    }
    
}