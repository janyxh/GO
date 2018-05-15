import Vue from "vue";
import Router from "vue-router";
import Login from "../views/Login";
import ForgotPassword from "../views/ForgotPassword";
import Register from "../views/register/Register";
import Register2 from "../views/register/Register2";
import Frame from "../views/Frame";
import notFound from "../views/404";
import Home from "../components/Home";
import WorkBenchNew from "../components/WorkBench/WorkBenchNew";
import SceneEnergy from "../components/Energy/Scene/SceneEnergy";
import SceneEnergyDetail from "../components/Energy/Scene/SceneEnergyDetail";
import DeviceEnergy from "../components/Energy/DeviceEnergy/DeviceEnergy";
import DeviceList from "../components/DeviceManage/DeviceList/DeviceList";
import DeviceIndex from "../components/DeviceManage/DeviceList/Index";
import DeviceDetail from "../components/DeviceManage/DeviceDetail/DeviceDetail";
import GatewayManage from "../components/DeviceManage/GatewayManage";
import BaseSetting from "../components/SystemSettings/BaseSetting/BaseSetting";
import CorporateInfo from "../components/SystemSettings/CorporateInfo";
import ElectricityPricing from "../components/SystemSettings/ElectricityPricing";
import OfficeManager from "../components/SystemSettings/OfficeManager/OfficeManager";
import Person from "../components/Person";
import Message from "../components/Message/MessageList";
import MessageDetail from "../components/Message/MessageDetail";
import UserManager from "../components/UserManager/UserManager";
import UserManagerAdd from "../components/UserManager/UserManagerAdd";

Vue.use(Router);

let routes = [
  /*--- 单独页面 ---*/
  {
    path: "/404",
    name: "notFound",
    component: notFound,
    hidden: true
  },
  {
    path: "*",
    redirect: "/404",
    hidden: true
  },
  {
    path: "/",
    component: Login,
    hidden: true
  },
  {
    path: "/forgotPassword",
    component: ForgotPassword,
    hidden: true
  },
  {
    path: "/register",
    component: Register,
    hidden: true
  },
  {
    path: "/register2",
    component: Register2,
    hidden: true
  },
  /*--- 主控系统页面 ---*/
  /*侧边导航*/
  {
    path: "/Frame",
    component: Frame,
    name: "首页",
    iconClass: "icon-home",
    single: true, //一个节点
    children: [{path: "/home", component: Home, name: "首页"}]
  },
  {
    path: "/Frame",
    component: Frame,
    name: "工作台",
    iconClass: "icon-work",
    single: true, //一个节点
    children: [{path: "/WorkBench", component: WorkBenchNew, name: "工作台"}]
  },
  {
    path: "/Frame",
    component: Frame,
    name: "节能设置",
    iconClass: "icon-energy",
    children: [
      {path: "/SceneEnergy", component: SceneEnergy, name: "情景节能"},
      {path: "/DeviceEnergy", component: DeviceEnergy, name: "设备节能"},
      {
        path: "/SceneEnergyDetail",
        component: SceneEnergyDetail,
        name: "情景节能 > 情景详情",
        hidden: true
      }
    ]
  },
  {
    path: "/Frame",
    component: Frame,
    name: "设备管理",
    iconClass: "icon-equipment",
    children: [
      {
        path: "/DeviceList",
        component: DeviceIndex,
        name: "设备列表",
        children: [
          {
            path: "",
            component: DeviceList,
            name: ""
          },
          {
            path: "DeviceDetail",
            component: DeviceDetail,
            name: "设备详情"
          }
        ]
      },
      {path: "/GatewayManage", component: GatewayManage, name: "网关管理"}
    ]
  },
  {
    path: "/Frame",
    component: Frame,
    name: "消息",
    iconClass: "icon-news",
    single: true, //一个节点
    badge: true,
    badgeMsg: true,
    children: [
      {path: "/Message", component: Message, name: "消息中心"},
      {
        path: "/MessageDetail",
        component: MessageDetail,
        name: "消息详情",
        hidden: true
      }
    ]
  },
  {
    path: "/Frame",
    component: Frame,
    name: "用户管理",
    iconClass: "icon-user",
    badge: true,
    badgeMsg: true,
    isAuthorize:true,
    children: [
      {path: "/UserManager", component: UserManager, name: "系统用户管理"},
      {path: "/UserManagerAdd", component: UserManagerAdd, name: "添加/授权用户",hidden: true},
      {path: "/UserManagerEdit", component: UserManagerAdd, name: "用户详情",hidden: true},
    ]
  },
  {
    path: "/Frame",
    component: Frame,
    name: "系统设置",
    iconClass: "icon-system",
    isAuthorize:true,
    children: [
      {path: "/BaseSetting", component: BaseSetting, name: "基础设置"},
      {path: "/CorporateInfo", component: CorporateInfo, name: "企业信息"},
      // { path:'/OfficeManagement', component: OfficeManagement, name:'办公室管理' },
      {path: "/OfficeManager", component: OfficeManager, name: "办公室管理"},
      {
        path: "/ElectricityPricing",
        component: ElectricityPricing,
        name: "电费计价管理",
        isAuthorize:true
      }
    ]
  },
  /*主控系统中的非导航路由*/
  {
    path: "/Frame",
    component: Frame,
    name: "系统",
    hidden: true,
    children: [
      {
        path: "/person",
        name: "个人中心",
        component: Person
      }
    ]
  }
];

//路由使用历史模式，域名加上/和路由名字即可访问
const router = new Router({
  mode: "history",
  routes
});

/*  路由拦截
* @param to将要到达的路由 form来源路由 next可控制要跳转路由的函数
* */
router.beforeEach((to, from, next) => {
  if (to.path == "/") {
    sessionStorage.removeItem("isLogin");
  }
  let isLogin = JSON.parse(sessionStorage.getItem("isLogin"));
  if (to.path == "/register" || to.path == "/register2" || to.path == "/forgotPassword") {
    sessionStorage.removeItem("isLogin");
    next();
  }
  else if (!isLogin && to.path != "/") {
    next({path: "/"});
  } else {
    next();
  }
});

export default router;
