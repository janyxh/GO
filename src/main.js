// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex'
import axios from 'axios'
import echarts from 'echarts'
import moment from 'moment'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-default/base.css'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import { checkInternetExplorer } from './utils/regularCheck'
//axios
Vue.prototype.$http = axios
axios.defaults.withCredentials=true;

//ElementUI
Vue.use(ElementUI)
Vue.component(CollapseTransition.name, CollapseTransition)

//echarts
Vue.prototype.$echarts = echarts

//moment
Vue.prototype.$moment = moment

Vue.config.productionTip = false


// 判断IE 版本

if(checkInternetExplorer()){
  alert('啊呀,浏览器版本太低,我兼容不了 T_T, 请升级浏览器')
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  template: '<App/>',
  components: { App }
})
