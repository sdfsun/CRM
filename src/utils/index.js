/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
    if (!name) return;
    return window.localStorage.getItem(name);
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
