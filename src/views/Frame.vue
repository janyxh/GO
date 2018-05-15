<!-----------------------------------------------------------------------------------------------------------------
about: 此文件是系统页面的外框，包含左侧导航、顶端用户头像、底部网站信息
author: 马兆铿
date: 2017-9-1
-------------------------------------------------------------------------------------------------------------------->
<template>
	<el-row class="contain">
		<!--左侧导航栏-->
		<el-col class="sideBar" :class="{'is-small':setting.isNavWidthSmall}">
			<el-row>
				<!--logo-->
				<div class="logo">
					<i class="iconfont icon-logo"></i>
				</div>
				<!--登录者信息-->
				<el-dropdown class="userInfo" menu-align="start" @command="userInfoDropDownClick">
					<div class="el-dropdown-link">
						<img src="../assets/img/icon_user_big.png" alt="" class="img-user">
						<i>{{userInfo.trueName}}</i>
					</div>
					<el-dropdown-menu slot="dropdown">
						<router-link to="/Person">
							<el-dropdown-item>个人中心</el-dropdown-item>
						</router-link>
						<el-dropdown-item divided command="userLogoutClick">退出</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<!--导航列表-->
				<el-menu :default-active="getPath($route.path)" class="el-menu-vertical-demo" id="nav"
				         router unique-opened>
					<template v-for="(item, index) in $router.options.routes" v-if="!item.hidden">
						<!--单节点一级菜单，带授权限制的，需要判断权限-->
						<el-menu-item v-if="(item.single && item.children.length > 0) && ((!item.isAuthorize)||(item.isAuthorize && isSystem != 40))"
						              :key="index" :index="item.children[0].path">
							<!--icon,从iconfont里面取，外层tooltip是element提示文字-->
							<el-tooltip class="item" effect="dark" placement="right"
							            :content="item.children[0].name"
							            :disabled="!setting.isNavWidthSmall">
								<i class="iconfont" :class="item.iconClass"></i>
							</el-tooltip>
							<router-link :to="item.children[0].path">
								<!--带气泡的标题-->
								<span class="badge-wrap" v-if="item.badge && item.badgeMsg">
                    <i class="badge" v-if="msgAmount">{{msgAmount}}</i>{{item.children[0].name}}
                </span>
								<!--普通标题-->
								<span v-if="!item.badge">{{item.children[0].name}}</span>
							</router-link>
						</el-menu-item>
						<!--带子菜单的列表，tooltip是提示文字-->
						<el-submenu v-if="!item.single && ((!item.isAuthorize)||(item.isAuthorize && isSystem != 40))"
						            :index="index+''" :key="index">
							<!--子菜单标题-->
							<template slot="title">
								<el-tooltip class="item" effect="light" placement="right"
								            :disabled="!setting.isNavWidthSmall">
									<i class="iconfont" :class="item.iconClass"></i>
									<ul slot="content" class="tootip-link">
										<li v-for="child in item.children" v-if="!child.hidden" :key="child.path"
										    @click="tootipLinkClick(child.path)">
											{{child.name}}
										</li>
									</ul>
								</el-tooltip>
								{{item.name}}
							</template>
							<!--子菜单块-->
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path"
							              v-if="!child.hidden && ((!child.isAuthorize)||(child.isAuthorize && isSystem != 40))">
								<router-link :to="child.path">{{child.name}}</router-link>
							</el-menu-item>
						</el-submenu>
					</template>
				</el-menu>
				<!--导航栏收起-->
				<div class="nav-close-function">
					<i class="iconfont icon-expasion" @click="minifyNav(true)" v-show="!setting.isNavWidthSmall"></i>
					<i class="iconfont icon-shrink" @click="minifyNav(false)" v-show="setting.isNavWidthSmall"></i>
					<p v-show="!setting.isNavWidthSmall">© 2014-{{setting.currentYear}} ORVIBO</p>
				</div>
			</el-row>
		</el-col>
		<!--右侧内容-->
		<el-col class="content">
			<!--面包屑导航-->
			<el-row class="navHead">
				<el-breadcrumb separator="-">
					<el-breadcrumb-item :to="{ path: createBreadcrumbPath(item,index,$route.matched) }"
					                    v-for="(item,index) in $route.matched" :key="item.path">
						<!-- <el-breadcrumb-item :to="{ path: createBreadcrumbPath(item,index,$route.matched) }" v-for="(item,index) in $route.matched" :key="item.path"> -->
						{{item.name}}
						<!-- {{item.path}} -->
					</el-breadcrumb-item>
				</el-breadcrumb>
			</el-row>
			<!--页面路由页面放置的地方-->
			<el-row class="content-container">
				<transition name="fade" mode="out-in">
					<router-view :getMessageNum="getMessageNum" :msgArrAlert="msgArrAlert"></router-view>
				</transition>
			</el-row>
		</el-col>
	</el-row>
</template>

<script>
  import {getMessageAmount, getMessageAlert, logout, getPerson} from '../api/api'
  //
  export default {
    name: "Frame",
    /*---------------------------------------- 数据 ----------------------------------------*/
    data() {
      return {
        alertMstTimer: null,
        msgAmount: 0,
        msgArrAlert: [],
        router: '',
        userInfo: {
          userName: ''
        }, //用户基本信息
        setting: {
          currentYear: '',
          isNavWidthSmall: false, //是否收起导航栏
        },
        isSystem: null
      }
    },
    /*---------------------------------------- 加载运行 ----------------------------------------*/
    created() {
      this.router = this.$route;
      this.setting.currentYear = (new Date()).getFullYear();  //设置年份
      //this.setting.isNavWidthSmall = localStorage.getItem('setting.isNavWidthSmall'); //是否收起导航栏
      this.isSystem = sessionStorage.getItem('isSystem');
      this.getUserInfo();
      this.getMessageNum();
      this.alertMessage();
      this.getMsgTicker();
    },
	  beforeDestroy(){
	    clearInterval(this.alertMstTimer);
	  },
    methods: {
      /*---------------------------------------- 绑定函数 ----------------------------------------*/
      /*  退出登录点击
      * */
      userInfoDropDownClick(command) {
        if (command === 'userLogoutClick') {
          let logoutParams = {};
          logout(logoutParams).then(res => {
            let {code} = res;
            if (code !== 200) {
              this.$message({
                message: res.msg,
                type: 'error'
              });
            } else {
              this.$message({
                message: res.data,
                type: 'success'
              });
              clearInterval(this.alertMstTimer);
              sessionStorage.removeItem('user');
              this.$router.push('/');
            }
          }).catch(error => {
            console.error(error);
          });
        }
      },
      /*  element用的用于生成面包屑的函数
      * */
      createBreadcrumbPath(item, index, list) {

        if (index !== 0 && item.name !== "" && index !== list.length - 1 ) {
           console.log(item.path)
          return item.path;
        }
      },
      /*  跳转到对应的消息提示页面
      *   @param msgId消息的id
      * */
      msgRouterGo(msgId) {
        this.$router.push({path: '/MessageDetail', query: {id: msgId}});
      },
      /*  是否缩小导航栏
      *   @param val布尔值
      * */
      minifyNav(val) {
        this.setting.isNavWidthSmall = val;
        localStorage.setItem('setting.isNavWidthSmall', val);
      },
      /*  提示框跳转链接点击
      * @param link要跳转的链接
			* */
      tootipLinkClick(link) {
        location.href = link;
      },
      /*---------------------------------------- 自定义函数 ----------------------------------------*/
      /*  获取用户基本信息
      * */
      getUserInfo() {
        let that = this;
        getPerson().then(res => {
          if (res.code === 200) {
            that.userInfo = res.data.userInfo;
          }
        });
      },
      /*  获取用户消息
      * */
      getMessageNum() {
        let msgParams = {};
        getMessageAmount(msgParams).then(res => {
          let {code} = res;
          if (code !== 200 && res.msg) {
            this.$message({
              message: res.msg,
              type: 'error'
            });
          } else {
            // console.log(res.data.count);
            this.msgAmount = res.data.count;
          }
        }).catch(error => {
          console.error(error);
        });
      },
      /*  获取用户提示消息的内容
      * */
      alertMessage() {
        let msgAlertParams = {};
        let that = this;
        getMessageAlert(msgAlertParams).then(res => {
          let {code} = res;
          if (code !== 200 && res.msg) {
            that.$message({
              message: res.msg,
              type: 'error'
            });
          } else {
            that.msgArrAlert = res.data.messageList;
            // console.log(res.data.messageList);
            // console.log(that.msgArrAlert);
            if (that.msgArrAlert.length > 0) {
              that.msgArrAlert.forEach((item) => {
                setTimeout(() => {
                  that.$notify({
                    title: item.typeValue,
                    message: item.content,
                    type: 'warning',
                    customClass: 'notifystyle',
                    duration: 5000,
                    onClick: that.msgRouterGo.bind(that, item.msgid)
                  });
                }, 100);
              })
            }
            that.getMessageNum();
          }
        }).catch(error => {
          console.error(error);
        });
      },
      /*  定时获取用户通知
      * */
      getMsgTicker() {
        clearInterval(this.alertMstTimer);
        if (this.isSystem) {
          this.alertMstTimer = setInterval(() => {
            this.alertMessage();
          }, 60000);
        }
      },
      /*  路由调整???
      * */
      getPath(path) {
        if (path === '/DeviceDetail') {
          return '/DeviceList';
        } else if (path === '/SceneEnergyDetail') {
          return '/SceneEnergy';
        }
        return path;
      }
    }
  }
</script>

<style lang="scss">
	.contain {
		height: 100%;
		display: flex;
		overflow-x: hidden;
		overflow-y: hidden;
		min-width: 1300px;
		$navTransitionTime: 200ms;
		/*导航栏整体*/
		.sideBar {
			background: #fff;
			height: 100%;
			box-shadow: 10px 0 30px 0 rgba(51, 51, 51, 0.1);
			z-index: 1;
			overflow-x: hidden;
			overflow-y: auto;
			transition: width $navTransitionTime;
			width: 200px;
			/*导航栏缩小*/
			&.is-small {
				width: 50px;
				.iconfont {
					margin-left: -8px;
				}
				.logo {
					padding-left: 12px;
				}
				.userInfo {
					margin-left: -6px;
				}
				/*子菜单变小*/
				#nav .el-menu .el-menu-item {
					display: none;
				}
			}
			/*消息气泡*/
			.badge-wrap {
				position: relative;
				.badge {
					display: block;
					min-width: 26px;
					height: 16px;
					line-height: 16px;
					position: absolute;
					top: -8px;
					right: -28px;
					background: #fb4c4c;
					border-radius: 7px;
					color: #fff;
					font-style: normal;
					text-align: center;
					font-size: 12px;
				}
			}
		}
		/*导航*/
		#nav {
			background: #fff;
			color: #8c8ea2;
			/*导航列表，包括单个和复数的*/
			$activeColor: #121212 !important;
			$activeBgColor: #eeeff2 !important;
			$navHeight: 60px !important;
			/*大菜单和子菜单字体和样式*/
			.el-menu-item, .el-submenu__title {
				position: relative;
				font-size: 16px;
				color: #8c8ea2;
				padding-left: 63px !important;
				height: $navHeight;
				line-height: $navHeight;
				background: #fff !important;
				transition: all $navTransitionTime;
				a {
					display: block;
					color: inherit;
					height: 100%;
					line-height: inherit;
				}
				&:hover, &.is-active {
					color: $activeColor;
					background: #eeeff2 !important;
				}
			}
			/*大菜单*/
			> .el-menu-item, .el-submenu__title {
				&::before {
					content: ' ';
					display: block;
					position: absolute;
					left: 0;
					top: 50%;
					background: #02c286;
					width: 6px;
					box-shadow: 1px 0 15px 0 #02c286;
					height: 0;
					transition: all $navTransitionTime;
				}
			}
			/*大菜单hover或者激活*/
			> .el-menu-item:hover,
			> .el-menu-item.is-active,
			.el-submenu__title:hover,
			.el-submenu.is-active .el-submenu__title,
			.el-submenu.is-opened.is-active .el-submenu__title {
				background: #fff !important;
				&::before {
					top: 0;
					height: 100%;
				}
				/*icon*/
				.iconfont {
					color: #02c084;
				}
			}
			/*子菜单hover或者激活*/
			.el-menu .el-menu-item {
				&::before {
					content: ' ';
					display: block;
					position: absolute;
					left: 45px;
					top: 50%;
					width: 8px;
					height: 8px;
					box-sizing: border-box;
					transform: translate(0, -50%);
					border: 2px solid #ccceda;
					border-radius: 50%;
					transition: background $navTransitionTime;
				}
				&:hover, &.is-active {
					&::before {
						background: #ccceda;
					}
				}
			}
			/*icon*/
			.iconfont {
				display: block;
				color: inherit;
				font-size: 22px;
				position: absolute;
				top: 50%;
				left: 23px;
				transform: translate(0, -50%);
				transition: all $navTransitionTime;
			}
		}
		/*导航栏收起功能块*/
		.nav-close-function {
			margin-top: 50px;
			padding: 0 22px;
			/*icon*/
			.iconfont {
				display: inline-block;
				color: inherit;
				font-size: 22px;
				margin-bottom: 20px;
				&:hover {
					color: #02c084;
				}
			}
			p {
				display: block;
				width: 100%;
				font-size: 10px;
				margin-bottom: 20px;
			}
		}
		.navHead {
			background: #f6f7fb;
			height: 90px;
			padding-left: 30px;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
			.el-breadcrumb {
				height: 100%;
				display: flex;
				align-items: center;
			}
		}
		/*用户信息*/
		.userInfo {
			$userInfoHeight: 40px;
			height: $userInfoHeight;
			margin: 20px 0;
			overflow: hidden;
			transition: margin $navTransitionTime;
			.el-dropdown-link {
				height: $userInfoHeight;
				cursor: pointer;
				.img-user {
					display: block;
					float: left;
					width: $userInfoHeight;
					height: $userInfoHeight;
					margin: 0 12px;
				}
			}
			i {
				font-style: normal;
				height: 100%;
				line-height: $userInfoHeight;
				display: block;
				float: left;
			}
		}

		/*logo*/
		.logo {
			$logoHeight: 80px;
			height: $logoHeight;
			background: #15d1a5;
			text-align: center;
			line-height: $logoHeight;
			i {
				color: #fff;
				font-size: 27px;
			}
		}
		/*右侧内容*/
		.content {
			position: relative;
			min-height: 100%;
			overflow-y: auto;
		}
		.content-container {
			min-height: 78%;
			// background-color: #f2f2f2;
		}
	}

	/*提示框的链接*/
	.tootip-link {
		li {
			cursor: pointer;
			&:hover {
				text-decoration: underline;
			}
		}
	}
</style>
