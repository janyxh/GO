import axios from "axios";
import { Message } from "element-ui";
import router from "../router";
import base from './domain';

//添加响应拦截器
axios.interceptors.response.use(
  res => {
    //对响应数据做些事
    // console.log(res);
    // console.log(res.data)
    if (res.data.code == 401) {
      Message.error(res.data.msg);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } else if (res.data.code == 500) {
      Message.error(res.data.msg);
    }
    return res;
  },
  error => {
    //请求错误时做些事
    // console.error(error)
    return Promise.reject(error);
  }
);


//注册
export const register = params => {
  return axios
    .post(`${base}/register`, params)
    .then(res => res.data);
};

//申请授权/完善企业信息
export const permission = params => {
  return axios
    .post(`${base}/permission`, params)
    .then(res => res.data);
};
