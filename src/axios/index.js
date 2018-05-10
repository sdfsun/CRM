import axios from 'axios';
import qs from 'qs';
import { Loading , Message } from 'element-ui';

let loaddingIndex;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
        let config_data = config.data;
        let flag = false;
        if(config_data && config_data.length>0){
            config_data = config_data.split("&");
            for (var i = 0; i < config_data.length; i++) {
                let item = config_data[i].split("=");
                if(item[0].indexOf('showLoad')!=-1){
                    flag = true;
                    break;
                }
            }
        }
        if(!flag){
            // 在发送请求之前做些什么
            loaddingIndex = Loading.service();
        }
        return config;
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);
// 添加响应拦截器
axios.interceptors.response.use(res => {
    loaddingIndex.close();
    return Promise.resolve(res);
},err=>{
    loaddingIndex.close();
    if (err && err.response) {
        switch (err.response.status) {
            case 400: err.message = '请求错误(400)' ; break;
            case 401: err.message = '未授权，请重新登录(401)'; break;
            case 403: err.message = '拒绝访问(403)'; break;
            case 404: err.message = '请求出错(404)'; break;
            case 408: err.message = '请求超时(408)'; break;
            case 500: err.message = '服务器错误(500)'; break;
            case 501: err.message = '服务未实现(501)'; break;
            case 502: err.message = '网络错误(502)'; break;
            case 503: err.message = '服务不可用(503)'; break;
            case 504: err.message = '网络超时(504)'; break;
            case 505: err.message = 'HTTP版本不受支持(505)'; break;
            default: err.message = `连接出错(${err.response.status})!`;
        }
    }else{
        err.message = '连接服务器失败!';
    }
    Message({
        message:err.message,
        type:'error'
    });
    return Promise.reject(err);
});


function apiAxios (method, url, params) {
    return new Promise((resolve,reject)=>{
        params = qs.stringify(params);
        axios({
            method: method,
            // headers:{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'},
            url: url,
            data: method === 'post'? params : null,
            params: method === 'get'? params : null,
            // baseURL:'/',
        }).then(function (res) {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        });
    });
}

// 返回在vue模板中的调用接口
export default {
    get:  async(url, params) => {
        try {
            const res = await apiAxios('get',url, params);
            if(res && res.status === 200){
                // return res.data;
                return Promise.resolve(res.data);
            }
        } catch(err) {
            // return err;
            return Promise.reject(err);
        }
    },
    post:  async(url, params) => {
        try {
            const res = await apiAxios('post',url, params);
            if(res && res.status === 200){
                // return res.data;
                return Promise.resolve(res.data);
            }
        } catch(err) {
            // return err;
            return Promise.reject(err);
        }
    }
}