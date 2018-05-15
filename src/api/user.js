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


//用户管理-用户列表
export const getUserList = params => {
  return axios
    .post(`${base}/ouser/list`, params)
    .then(res => res.data);
};

//用户管理-添加/修改用户
export const addOrEditUser = params => {
  return axios
    .put(`${base}/ouser/save`, params)
    .then(res => res.data);
};

//用户管理-冻结，启用用户
export const updateUserStatus = params => {
  return axios
    .put(`${base}/ouser/update/status`, params)
    .then(res => res.data);
};

//用户管理-删除用户
export const deleteUser = params => {
  return axios
    .delete(`${base}/ouser/delete`, { params: params })
    .then(res => res.data);
};

//用户管理-通过登录账号获取部分信息
export const getPartOfUserInfo = params => {
  return axios
    .get(`${base}/ouser/query/name`, {params: params})
    .then(res => res.data);
};

//用户管理-查看用户信息
export const getUserInfo = params => {
  return axios
    .get(`${base}/ouser/view`, {params: params})
    .then(res => res.data);
};
