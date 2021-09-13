import Vue from "vue";
import axios from 'axios'

// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.defaults.baseURL = `http://47.97.115.63:8889/api/private/v1/`

axios.interceptors.request.use(config=>{
    //需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
    config.headers.authorization = window.sessionStorage.getItem("token")
    //在最后必须 return config
    return config
},err=>{
    console.log(err);
})
axios.interceptors.response.use(res=>{
    return res
},err=>{
    console.log(err);
})
Vue.prototype.$http = axios