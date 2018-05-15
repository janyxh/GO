import base from './domain';
import axios from "axios";
import { Message } from "element-ui";
import router from "../router";
//添加响应拦截器
export default axios.interceptors.response.use(
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

// 通过当前登录者查询办公楼列表

export const getAllOffice = params =>{
  return axios.post(`${base}/office/query/offices?`,params).then(res=>res.data);
}

//  添加/更新办公室

export const upDateOrSaveOffice = params =>{
  return axios.post(`${base}/office/save`,params).then(res=>res.data);
}

// 删除办公室

export const deleteOffice = params =>{
  return axios.post(`${base}/office/delete?officeId=${params.officeId}`,params).then(res=>res.data);
}

// 获取地区列表

export const getAreas = params =>{
  return axios.post(`${base}/address/areas?cityCode=${params.cityCode}`,params).then(res=>res.data);
}

// 获取城市列表

export const getCitys = params =>{
  return axios.post(`${base}/address/cities?provinceCode=${params.provinceCode}`,params).then(res=>res.data);
}

// 获取省份列表

export const getProvinces = params =>{
  return axios.post(`${base}/address/provinces`,params).then(res=>res.data);
}
