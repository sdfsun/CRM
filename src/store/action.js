export default{
    setStoreage(context,data){//设置本地存储
        if (!data.name) return;
        window.localStorage.setItem(data.name, data.val);
    },
    getStoreage({commit},name){//读取本地存储
        if (!name) return;
        let cookieValue =  window.localStorage.getItem(name);
        commit('SETCOOKIEVALUE',{"name":name,"val":cookieValue});
    }
}