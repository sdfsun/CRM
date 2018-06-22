/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
    if (!name) return;
    return localStorage.getItem(name);
}


/**
 * 获取时长
 */
export const getDuration = (startDate,endDate) => {
    let st = startDate.replace(/-/g,"/");
    st = new Date(st);
    let ed = endDate.replace(/-/g,"/");
    ed = new Date(ed);
    var ms = ed.getTime() - st.getTime();
    if (ms < 0) {
        return -1;
    }
    ms = ms/1000;//转换为秒数
    let result_h = Math.floor(ms/60/60);//时
    let result_m = Math.floor(ms/60%60);//分
    let result_s = Math.floor(ms%60);//秒
    return result_h+"时"+result_m+"分"+result_s+"秒";
}

/**
 * 格式化时间
 */
export const formatDate = (date,format) => {
    var args = {
       "M+": date.getMonth() + 1,
       "d+": date.getDate(),
       "h+": date.getHours(),
       "m+": date.getMinutes(),
       "s+": date.getSeconds(),
       "q+": Math.floor((date.getMonth() + 3) / 3),  //quarter
       "S": date.getMilliseconds()
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var i in args) {
        var n = args[i];
        if (new RegExp("(" + i + ")").test(format))
           format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
    }
    return format;
}
/**
 * 返回上传图片类型对应的icon
 */
export const getUploadIcon = (fileName) =>{
    let iconUrl = '';
    if(fileName.indexOf('doc')!=-1){
        iconUrl = 'https://pic.solux.cn/PC/crm/word.png';
    }else if(fileName.indexOf('xls')!=-1){
        iconUrl = 'https://pic.solux.cn/PC/crm/excel.png';
    }
    else if(fileName.indexOf('txt')!=-1){
        iconUrl = 'https://pic.solux.cn/PC/crm/txt.png';
    }
    else if(fileName.indexOf('pdf')!=-1){
        iconUrl = 'https://pic.solux.cn/PC/crm/pdf.png';
    }
    else if(fileName.indexOf('ppt')!=-1){
        iconUrl = 'https://pic.solux.cn/PC/crm/ppt.png';
    }
    return iconUrl;
}