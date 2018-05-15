import axios from "axios";
import {Message} from "element-ui";
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

//登录
export const login = params => {
  return axios.post(`${base}/ologin/login`, params).then(res => res.data);
};

//登录-获取节能数据
export const getLoginEnergyData = params => {
  return axios
    .get(`${base}/ologin/save/energy`, {params: params})
    .then(res => res.data);
};

//图片验证码
export const verificationCode = () => {
  return `${base}/common/image/code?` + Math.random();
};

//手机和邮箱的验证码
export const verificationNum = params => {
  return axios
    .post(`${base}/common/send/code`, params)
    .then(res => res.data);
};

//退出登录
export const logout = params => {
  return axios
    .post(`${base}/ologin/logout`, params)
    .then(res => res.data);
};

//找回密码-确认账号
export const validateAccount = params => {
  return axios.get(`${base}/reset/validate/account`, {params: params}).then(res => res.data);
};

//找回密码-验证码校验
export const validateCheckCode = params => {
  return axios.get(`${base}/reset/validate/code`, {params: params}).then(res => res.data);
};

//找回密码-传输新密码
export const resetPassword = params => {
  return axios.post(`${base}/reset/password`, params)
    .then(res => res.data);
};

// //首页-节能统计，节省费用，电量统计，设备节能，设备类型节能，区域节能
// export const getIndexStatistics = params => {
//   return axios
//     .post(`${base}/ostaticsPower/ajaxStatics`, params)
//     .then(res => res.data);
// };
//
// //首页-电量统计分析
// export const getIndexPower = params => {
//   return axios
//     .post(`${base}/ostaticsPower/staticsAnalysis`, params)
//     .then(res => res.data);
// };
//
// //首页-电量统计分析(月，季，年)
// export const getIndexPowerDate = params => {
//   return axios
//     .post(`${base}/ostaticsPower/staticsMonthQuarterYear`, params)
//     .then(res => res.data);
// };

//首页-统计电量,节能电费,节能节费
export const getIndexGauge = params => {
  return axios
    .post(`${base}/report/power/day/statics4Dashboard`, params)
    .then(res => res.data);
};

//首页-节能情况: 0: 设备类型节能, 1: 区域节能, 2: 设备类型能占比
export const getIndexPie = params => {
  return axios
    .post(`${base}/report/power/day/query/situation`, params)
    .then(res => res.data);
};

//首页-能耗统计分析: 1: 月, 2: 季度, 3: 年
export const getIndexBar = params => {
  return axios
    .post(`${base}/report/power/day/query/analysis`, params)
    .then(res => res.data)
}

//工作台 - 节能提醒,常用情景，区域控制（获取数据）
export const getWorkEnergy = params => {
  return axios
    .post(`${base}/workStation/getWorkStationData`, params)
    .then(res => res.data);
};

//工作台 - 节能提醒
export const getWorkbenchMessage = params => {
  return axios
    .post(`${base}/workStation/getMeesageRemind`, params)
    .then(res => res.data);
};

//工作台 - 常用情景
export const getWorkbenchScene = params => {
  return axios
    .post(`${base}/workStation/getConmmonScenes`, params)
    .then(res => res.data);
};

//工作台 - 区域
export const getWorkbenchArea = params => {
  return axios
    .post(`${base}/workStation/geRoomControlData`, params)
    .then(res => res.data);
};

//工作台 - 节能提醒 - 关闭设备
export const closeEnergyMessage = params => {
  return axios
    .post(`${base}/messageCenter/closeDevices`, params)
    .then(res => res.data);
};

//工作台 - 区域控制 - 关闭设备
export const closeArea = params => {
  return axios
    .post(`${base}/odeviceControl/controlDeviceSimple4Room`, params)
    .then(res => res.data);
};

//情景节能-获取情景列表
export const getScenesEnergy = params => {
  return axios
    .post(`${base}/scene/getScenesByCondition`, params)
    .then(res => res.data);
};

//情景节能-启动情景
export const startScene = params => {
  return axios
    .post(`${base}/odeviceControl/startScene`, params)
    .then(res => res.data);
};

//情景详情-获取情景详情
export const getScenesEnergyDetail = params => {
  return axios
    .post(`${base}/scene/getSceneBySceneId`, params)
    .then(res => res.data);
};

//情景详情-更新情景信息
export const updateScenesEnergyDetail = params => {
  return axios.post(`${base}/scene/updateScene`, params).then(res => res.data);
};

//情景详情-删除定时
export const deleteTimerScenesEnergyDetail = params => {
  return axios.post(`${base}/scene/deleteTimer`, params).then(res => res.data);
};

//获取该用户的办公楼信息
export const getOffice = params => {
  return axios
  // .post(`${base}/office/selectMyOffice`, params)
    .post(`${base}/office/query/offices`, params)
    .then(res => res.data);
};

//通过办公ID查询区域
export const getArea = params => {
  return axios
  // .post(`${base}/office/selectRoomByOfficeId`, params)
    .post(`${base}/room/query/rooms`, params)
    .then(res => res.data);
};

//设备接口-通过办公室ID查询区域以及区域下的设备
export const getAreaAndItsDevice = params => {
  return axios.get(`${base}/device/query/devices`, {params: params}).then(res => res.data);
};

//设备管理-设备列表-获取设备列表
export const getDeviceList = params => {
  return axios
    .post(`${base}/deviceManager/selectDevicePowerListByPage`, params)
    .then(res => res.data);
};

//设备管理-设备列表-控制设备开启或关闭
export const switchDevice = params => {
  return axios
    .post(`${base}/odeviceControl/controlDeviceSimple`, params)
    .then(res => res.data);
};

//设备管理-设备列表-设置设备类型
export const setDevice = params => {
  return axios
    .post(`${base}/deviceManager/saveDeviceType`, params)
    .then(res => res.data);
};

//设备管理-设备列表-区域分配
export const setArea = params => {
  return axios
    .post(`${base}/odeviceControl/updateDeviceRoom`, params)
    .then(res => res.data);
};

//设备管理-设备列表-设置电流阈值
export const setElectric = params => {
  return axios
    .post(`${base}/odeviceControl/setPowerConfigure`, params)
    .then(res => res.data);
};

//设备管理-设备列表-设置设备功率
export const setPower = params => {
  return axios
    .post(`${base}/deviceManager/saveDevicePower`, params)
    .then(res => res.data);
};

//节能设置-设备节能-设备详情
export const deviceDetail = params => {
  return axios
    .post(`${base}/device/viewDeviceDetail`, params)
    .then(res => res.data);
};

//设备管理-设备列表-设备详情-查询空开是否关闭电源
export const checkKKPower = params => {
  return axios
    .post(`${base}/deviceManager/selectIsEnableShutdown`, params)
    .then(res => res.data);
};

//设备管理-设备列表-设备详情-是否禁止关闭空开电源
export const powerKKOnOff = params => {
  return axios
    .post(`${base}/odeviceControl/setPowerConfigureOption`, params)
    .then(res => res.data);
};

//设备管理-设备列表-设备详情-删除设备定时
export const deleteTim = params => {
  return axios
    .post(`${base}/odeviceControl/deleteTimer`, params)
    .then(res => res.data);
};

//设备管理-设备列表-设备详情-保存设备信息
export const saveDeviceInfo = params => {
  return axios
    .post(`${base}/device/updateDeviceInfo`, params)
    .then(res => res.data);
};

//设备管理-网关管理
export const getGateWay = params => {
  return axios
    .post(`${base}/ogatewayManage/selectGatewayListByOfficeId`, params)
    .then(res => res.data);
};

//节能设置-设备节能-获取设备列表
export const getDeviceSavingList = params => {
  return axios
    .post(`${base}/odeviceControl/selectDeviceListByPage`, params)
    .then(res => res.data);
};

//节能设置-设备节能-控制设备
export const controlDevice = params => {
  return axios
    .post(`${base}/odeviceControl/controlDevice`, params)
    .then(res => res.data);
};

//节能设置-设备节能-红外转发器下虚拟遥控器学码接口
export const isCodeLearning = params => {
  return axios
    .get(`${base}/deviceIr/query/isCodeLearning`, {params: params})
    .then(res => res.data);
};

//个人中心-获取用户信息
export const getPerson = params => {
  return axios.post(`${base}/ouser/userCenter`, params).then(res => res.data);
};

//个人中心-修改密码
export const updatePassword = params => {
  return axios
    .post(`${base}/ouser/updatePassword`, params)
    .then(res => res.data);
};

//系统设置-企业信息
export const getCorporate = params => {
  return axios
    .post(`${base}/ocompany/getCompany`, params)
    .then(res => res.data);
};

//系统设置-更新企业信息
export const updateCorporate = params => {
  return axios
    .post(`${base}/ocompany/saveOrUpdateCompany`, params)
    .then(res => res.data);
};

//系统设置-办公室管理-通过办公楼获取办公楼及区域信息
export const getSingleOfficeInfo = params => {
  return axios
    .post(`${base}/room/selectFamilyRoomByFamilyId`, params)
    .then(res => res.data);
};

//系统设置-办公室管理-添加区域
export const addRoom = params => {
  return axios
    .post(`${base}/room/addRoom`, params)
    .then(res => res.data);
};

//系统设置-办公室管理-删除区域
export const deleteRoom = params => {
  return axios
    .post(`${base}/room/deleteRoom`, params)
    .then(res => res.data);
};

//系统设置-办公室管理-查看当前区域详情
export const viewRoom = params => {
  return axios
    .post(`${base}/room/viewRoom`, params)
    .then(res => res.data);
};

//系统设置-办公室管理-移除区域设备
export const removeRoomDevice = params => {
  return axios
    .post(`${base}/room/removeDevice`, params)
    .then(res => res.data);
};

//系统设置-办公室管理-修改区域
export const editRoom = params => {
  return axios
    .post(`${base}/room/modifyRoom`, params)
    .then(res => res.data);
};

//系统设置-基础设置-获取基础设置详情
export const getBaseSetting = params => {
  return axios
    .post(`${base}/baseSetting/getBaseSetting`, params)
    .then(res => res.data);
};

//系统设置-基础设置-添加或更新基础设置
export const updateBaseSetting = params => {
  return axios
    .post(`${base}/baseSetting/saveBaseSetting`, params)
    .then(res => res.data);
};

//系统设置-基础设置-通过办公楼获取情景列表
export const getOfficeSceneList = params => {
  return axios
    .post(`${base}/scene/getScenesByFamilyId`, params)
    .then(res => res.data);
};

//系统设置-计价模板列表
export const getElectricityPricing = params => {
  return axios
    .post(`${base}/valuationTemplete/getValuationTempleteList`, params)
    .then(res => res.data);
};

//消息中心-消息列表
export const getMessageList = params => {
  return axios
    .post(`${base}/omessage/selectMessageListPage`, params)
    .then(res => res.data);
};

//消息中心-全部已读
export const updateAllRead = params => {
  return axios
    .post(`${base}/omessage/readAll`, params)
    .then(res => res.data);
};

//消息中心-消息详情
export const getMessageDetail = params => {
  return axios
    .post(`${base}/omessage/selectMessage`, params)
    .then(res => res.data);
};

//消息中心-删除消息
export const delMessage = params => {
  return axios
    .post(`${base}/omessage/deleteMessage`, params)
    .then(res => res.data);
};

//消息中心-获取未读消息总数
export const getMessageAmount = params => {
  return axios
    .post(`${base}/omessage/selectCount4Unread`, params)
    .then(res => res.data);
};

//消息中心-获取提醒消息
export const getMessageAlert = params => {
  return axios
    .post(`${base}/omessage/selectMessageList`, params)
    .then(res => res.data);
};
