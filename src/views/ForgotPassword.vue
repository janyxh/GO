<!-----------------------------------------------------------------------------------------------------------------
about: 此文件是忘记密码页面，四个步骤用step区分，四个状态的框重叠，根据step显示
author: 马兆铿
date: 2017-8-29
-------------------------------------------------------------------------------------------------------------------->
<template>
	<div class="register">
		<!--logo-->
		<regLogo></regLogo>
		<!--内容-->
		<div class="content">
			<!--面包屑导航-->
			<div class="breadcrumb">
				<h2>账户设置 - 找回密码</h2>
				<i>
					<router-link to="/"><span>登录</span></router-link>
				</i>
			</div>
			<!--步骤-->
			<ul class="step-bar">
				<li :class="{active:setting.step==1}">1.确认账号</li>
				<li :class="{active:setting.step==2}">2.安全验证</li>
				<li :class="{active:setting.step==3}">3.重置密码</li>
				<li :class="{active:setting.step==4}">4.完成</li>
			</ul>
			<!--步骤对应的页面-->
			<div class="step-content">
				<el-form :label-position="'top'" :model="form" ref="form" class="demo-form-inline" onkeydown="if(event.keyCode==13)return false;"
				         :rules="rules">
					<ul>
						<!--1-->
						<li v-if="setting.step==1">
							<el-form-item label="请输入您需要找回的账号" prop="name">
								<el-input v-model="form.name" placeholder="请输入手机号或者邮箱"></el-input>
							</el-form-item>
							<dl class="check-code">
								<dt>
									<el-form-item prop="imgCheckCode">
										<el-input placeholder="请输入验证码" v-model="form.imgCheckCode"></el-input>
									</el-form-item>
								</dt>
								<dd>
									<!--验证码图片-->
									<el-button @click="getVerificationImageClick" class="border-radius-6px">
										<img :src="setting.imgCheckCodeSrc"/>
									</el-button>
								</dd>
							</dl>
						</li>
						<!--2-->
						<li v-if="setting.step==2">
							<h2>为了您的账号安全，请完成身份验证</h2>
							<!--手机号验证-->
							<i>{{form.nameType}}验证</i>
							<p>号码：<span>{{form.name}}</span></p>
							<em>验证码</em>
							<dl class="check-code">
								<dt>
									<el-form-item prop="phoneOrEmailCheckCode">
										<el-input v-model="form.phoneOrEmailCheckCode" placeholder="请输入验证码"></el-input>
									</el-form-item>
								</dt>
								<dd>
									<getCheckCodeBtn :account="form.name" type="1" @handleSend="getMessageSuccess"></getCheckCodeBtn>
								</dd>
							</dl>
						</li>
						<!--3-->
						<li v-if="setting.step==3">
							<h2>您的验证已经成功通过，请立即修改您的登录密码</h2>
							<el-form-item label="新密码（6-16位数字、字母或标点符号）：" class="margin-bottom-10px" prop="newPassword">
								<div v-popover:popover1>
									<el-input v-model="form.newPassword" placeholder="请输入新密码"></el-input>
									<el-popover
											ref="popover1"
											placement="right"
											width="200"
											trigger="click">
										<ul>
											<li>长度为6-16位字符</li>
											<li>支持数字，大小写字母和标点符号</li>
											<li>不允许有空格</li>
										</ul>
									</el-popover>
								</div>
							</el-form-item>
							<el-form-item label="确认新密码：" prop="newPasswordConfirm">
								<el-input v-model="form.newPasswordConfirm" placeholder="请再次输入新密码"></el-input>
							</el-form-item>
						</li>
						<!--4-->
						<li v-if="setting.step==4">
							<h2><img src="../assets/img/icon_lock.svg"/><i>你的密码已经重新设置，请妥善保管</i></h2>
						</li>
					</ul>
					<!--下一步按钮-->
					<el-form-item>
						<el-button type="primary" :class="{'short':setting.step==4}" @click="nextStepClick('form')"
						>{{setting.stepBtn.text}}
						</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
  import {verificationCode, validateAccount, validateCheckCode, resetPassword} from '../api/api';
  import {phoneRegCheck, emailRegCheck, passwordCheck} from '../utils/regularCheck';
  import {Message} from "element-ui";
  import regLogo from '../items/regLogo';
  import getCheckCodeBtn from '../items/getCheckCodeBtn.vue'; //获取验证码按钮
  //
  export default {
    name: "ForgotPassword",
    components: {
      regLogo,
      getCheckCodeBtn,
    },
    data() {
      /*---------------------------------------- 表单校验 ----------------------------------------*/
      /*  element默认自定义验证规则，检查登录帐号
      * @param rule? value对应的输入值 callback下方警告框显示回调，必须执行，否则会有旋转图标出现
      * */
      let checkName = (rule, value, callback) => {
        let that = this;
        if (!value) { //空
          return callback(new Error('账号不可为空'));
        } else if (value.indexOf('@') !== -1) {  //是邮箱的话
          that.form.nameType = '邮箱';
          if (!emailRegCheck(value)) {
            return callback(new Error('请输入正确的邮箱号码格式'));
          }
        } else if (!phoneRegCheck(value)) {  //是手机号码的话
          return callback(new Error('请输入正确的手机号码格式'));
        }
        if (!that.form.isNameExist) {
          return callback(new Error('您输入的账号不存在，请核对账号'));
        }
        callback();//通过
      };
      /*  检查密码，参数同第一个
      * */
      let checkNewPassword = (rule, value, callback) => {
        let checkRes = passwordCheck(value);    //校验
        if (!checkRes.isPass) {
          return callback(new Error(checkRes.info));
        }
        callback();//通过
      };
      /*  检查密码确认，参数同第一个
      * */
      let checkNewPasswordConfirm = (rule, value, callback) => {
        let checkRes = passwordCheck(value);    //校验
        if (!checkRes.isPass) {
          return callback(new Error(checkRes.info));
        } else if (value !== this.form.newPassword) {   //两次的密码不一样
          return callback(new Error('您输入的两次密码不一致，请重新输入'));
        }
        callback();//通过
      };
      /*---------------------------------------- 数据 ----------------------------------------*/
      return {
        setting: {  //各种页面上的设置
          imgCheckCodeSrc: '',  //验证码图片src
          step: 1,  //进行到的步骤
          stepBtn: {
            text: '下一步', //功能按钮文字
          }
        },
        form: {
          name: '', //用户名
          nameType: '手机', //验证的类型
          imgCheckCode: '', //图片验证码
          phoneOrEmailCheckCode: '', //手机验证码
          newPassword: '',
          newPasswordConfirm: '',
          //校验
          isNameExist: true,   //默认手机号码存在
          isImgCheckCodeCorrect: true,
        },
        rules: {  //element默认表单验证
          name: {validator: checkName, trigger: 'blur'},
          imgCheckCode: {required: true, message: '验证码不可为空', trigger: 'blur'},
          phoneOrEmailCheckCode: {required: false, message: '验证码不可为空', trigger: 'blur'},
          newPassword: {validator: checkNewPassword, trigger: 'blur'},
          newPasswordConfirm: {validator: checkNewPasswordConfirm, trigger: 'blur'},
        }
      }
    },
    /*---------------------------------------- 启动运行 ----------------------------------------*/
    mounted() {
      this.getVerificationImageClick();
      this.keyBordEvent();
    },
    beforeDestroy() {
      document.onkeydown = null;  //清除键盘事件
    },
    methods: {
      /*---------------------------------------- 绑定函数 ----------------------------------------*/
      /*  键盘事件
			* */
      keyBordEvent() {
        // 回车搜索事件
        document.onkeydown = ((event) => {
          let e = event || window.event;
          if (e && e.keyCode === 13) { // enter 键
            this.nextStepClick('form');
          }
        });
      },
      /*  下一步按钮点击，按照不同步骤划分功能
      *   @param form需要处理的表单对象，element规定的
      * */
      nextStepClick(form) {
        let that = this;
        if ( that.setting.step === 2 ){ //第二步时
          that.rules.phoneOrEmailCheckCode.required = true; //点击下一步时，需要校验验证码，平时是获取成功后校验
        }
        that.$refs[form].validate((valid) => {  //element默认全部校验方法
          if (valid) {    //校验都通过
            switch (that.setting.step) {
              case 1 :
                //步骤1
                validateAccount({   //校验账号是否存在
                  account: that.form.name,
                  code: that.form.imgCheckCode
                }).then(res => {
                  if (res.code === 200) {
                    that.setting.step = 2;
                  } else {
                    if (res.code === 521) {    //账户不存在
                      that.form.isNameExist = false;
                      that.$refs[form].validate();    //再校验一次
                      that.form.isNameExist = true;   //重置
                    }
                    that.getVerificationImageClick();
                  }
                });
                break;
              case 2 :
                //步骤2
                validateCheckCode({
                  account: that.form.name,
                  code: that.form.phoneOrEmailCheckCode
                }).then(res => {
                  if (res.code === 200) {
                    that.setting.step = 3;
                  }
                });
                break;
              case 3 :
                //步骤3
                resetPassword({
                  newPassword: that.form.newPassword,
                  confirmPassword: that.form.newPasswordConfirm
                }).then(res => {
                  if (res.code === 200) {
                    that.setting.step = 4;
                    that.setting.stepBtn.text = '立即登录';
                  } else {
                    Message.error(res.msg);
                  }
                });
                break;
              case 4 :
                //步骤4
                this.$router.push({path: '/'});//离开
                break;
              default:
                break;
            }
          }else{
            return false;
          }
        });
        return false;
      },
      /*  获取验证码图片
      * */
      getVerificationImageClick() {
        this.setting.imgCheckCodeSrc = verificationCode();
      },
      /*---------------------------------------- 自定义函数 ----------------------------------------*/
      /*  获取验证信息成功函数，属于验证信息按键组件的触发函数
      * */
      getMessageSuccess(done) {
        if (done) {
          this.rules.phoneOrEmailCheckCode.required = true; //可以校验验证码
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
	@import '../assets/scss/register';
	/*面包屑导航*/
	.breadcrumb {
		a {
			color: inherit !important;
		}
	}

	/*步骤进度形状*/
	.step-bar {
		width: 800px;
		height: 46px;
		margin: 0 auto;
		overflow: hidden;
		li {
			width: 25%;
			height: 100%;
			line-height: 46px;
			text-align: center;
			color: #8a8ca0;
			background: #dddfe8;
			float: left;
			font-size: 16px;
			position: relative;
			&::after {
				content: ' ';
				background: inherit;
				width: 32.5px;
				height: 32.5px;
				border-top: 3px solid #fff;
				border-right: 3px solid #fff;
				position: absolute;
				/*稍微移上去一点*/
				top: -2px;
				left: 100%;
				transform-origin: 0 0;
				transform: rotate(45deg);
				z-index: 1;
			}
			&.active {
				background: #15cea3;
				color: #fff;
			}
		}
	}

	/*各个步骤*/
	.step-content {
		width: 380px;
		margin: 60px auto;
		ul {
			li {
				/*显示文字*/
				h2, i, em, p {
					font-style: normal;
					font-size: 16px;
					display: block;
					line-height: 1.01;
				}
				p {
					text-indent: 2em;
				}
				h2 {
					margin-bottom: 33px;
					position: relative;
					i {
						display: block;
						width: 100%;
						position: absolute;
						left: 60px;
						top: 50%;
						transform: translate(0, -50%);
					}
					img {
						display: block;
						width: 60px;
					}
				}
				i {
					margin-bottom: 26px;
				}
				p {
					margin-bottom: 28px;
					span {
						color: #15cea3;
					}
				}
				em {
					margin-bottom: 23px;
				}
				/*验证码输入*/
				.check-code {
					position: relative;
					dt {
						width: 250px;
						overflow: hidden;
					}
					dd {
						position: absolute;
						display: block;
						right: 0;
						top: 0;
						background: #fff;
						width: 120px;
						height: 46px;
						button {
							height: 100%;
							position: relative;
							overflow: hidden;
							img {
								position: absolute;
								left: 0;
								top: 0;
								width: 100%;
								height: 100%;
							}
						}
					}
				}
			}
		}
		button {
			display: block;
			width: 100%;
			&.short {
				width: 200px;
				margin: 0 auto;
			}
		}
	}

	/*类调整*/
	.margin-bottom-10px {
		margin-bottom: 10px !important;
	}
</style>
