# GreenOffice办公室系统
-	技术栈：VUE2.0
-	说明：本项目是GreenOffice办公室系统的前台页面。

## 编译命令行
-	安装依赖：npm install
-	启动调试：npm run dev / npm start
-	编译压缩：npm run build
-	编译并报告：npm run build --report

<!-- ## 项目相关地址
- 代码svn：https://suyulin@192.168.2.14:36000/svn/project/vihome/03Software/01Code/03server/office/front_vue
- 过往文件svn：https：//192.168.2.14:36000/svn/project/vihome/08PM/智慧办公
- UI：https://lanhuapp.com/web/#!/item/board?pid=3ad373a8-0845-405a-bc47-8644c2d64d17
- 需求：http://orvibo521.xicp.net:8190/pages/viewpage.action?pageId=22774080
- api文档：http://192.168.2.189:8080/intelligenceOffice/swagger-ui.html#/ -->

<!-- ## 测试账号
1.  user: 15989860607 pw: 654321 desc: 个人测试
2.  user: 13790371603 / 810768333@qq.com pw: 369369 desc: 个人测试
3.  user: cici@163.com  pw: 999000  desc: 此账号数据比较全
3.  user: HUDIE@ORVIBO.COM  pw: 123456  desc: 此账号设备比较多 -->


## 全局信息
sessionStorage.getItem('isLogin')  //是否登录（登录页，注册页，找回密码需要在路由绕过）
sessionStorage.getItem('isSystem')  //是否是系统管理员，对应的值38（企业管理员），39（普通管理员），40（普通用户）

## 代码文件夹目录
src
|-- api 网络请求和网络设置
|-- assets 图片、样式、iconfont
|-- component ui组件，非公用组件也在各自的文件夹下
|-- items 公用小组件
|-- router 路由配置
|-- utils 纯js的公用方法函数
|-- views 独立于办公控制系统（无导航）的页面组件
|-- vuex 状态管理（暂时不使用）
<!-- 
## 代码持续集成（发布）
地址： http://192.168.2.243:8080/ user:office pw:office
office-front-test 是测试环境
office-front-prod 是线上环境

## 线上地址
测试服务器：http://192.168.2.189
正式服务器：http://greenoffice.orvibo.com -->
