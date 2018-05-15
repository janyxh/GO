<template>

    <el-row class="bg" id="login">

      <el-row class="loginForm">
        <div class="login-statistics">
          <p>GreenOffice已节省 <span>{{this.energyConsumption}}</span> kwh能耗</p>
          <p>相当于为地球减少了 <span>{{this.co2Num}}</span> kg二氧化碳的排放</p>
        </div>
        <el-row class="loginContain">

          <el-row class="loginLogo">
            <i class="iconfont icon-logo"></i>
          </el-row>


          <transition name="el-zoom-in-top">
            <el-alert v-show="isShow" :title="message" type="error" :closable="false" style="margin-bottom: 20px"></el-alert>
          </transition>

          <el-row class="loginContent">

            <el-form ref="form">

              <div class="wrap-input-login">
                <i class="iconfont icon-login-user"></i>
                <input type="text" v-model="form.user" @change="isShow=false;" placeholder="请输入登录账号" autocomplete="on" />
              </div>

              <div class="wrap-input-login">
                <i class="iconfont icon-login-lock"></i>
                <input type="password" v-model="form.password" @change="isShow=false;" placeholder="请输入密码" autocomplete="on" />
              </div>

              <el-form-item v-show="isShowCode">
                <el-row type="flex" justify="space-between">
                  <el-col :span="14">
                    <el-input placeholder="验证码" v-model="form.validate" @change="isShow=false;" :autofocus="focusCode"></el-input>
                  </el-col>
                  <el-col :span="9" class="validateImg">
                    <img :src="imgUrl" @click="getVerificationCode" alt="">
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item>
                <el-checkbox v-model="form.checked">下次自动登录</el-checkbox>
                  <router-link to="/forgotPassword" class="forgetP">忘记密码？</router-link>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="login" style="width:100%;border-radius:6px;">登录</el-button>
              </el-form-item>

              <el-form-item>
                <el-row class="reg">
                  还没有账号？<router-link to="/register">免费注册</router-link>
                </el-row>
              </el-form-item>

            </el-form>

          </el-row>

        </el-row>

      </el-row>

      <footer>
        <el-row>
          <p> © 2014-2017 深圳市欧瑞博电子技术有限公司版权所有 . 粤ICP备12019139号-2</p>
          <p>
            <img src="../assets/img/icon_sign.png">
            深圳工商监督工商网监信息公示
          </p>
        </el-row>
      </footer>

    </el-row>

</template>

<script>
import { login, verificationCode, getLoginEnergyData } from '../api/api';
import { phoneRegCheck, emailRegCheck} from '../utils/regularCheck';
export default {
  name:'Login',
  data(){
    return {
      isShowCode:false,
      energyConsumption:0,
      co2Num:0,
      imgUrl:'',
      isShow:false,
      message:'',
      focusCode:false,
      form:{
        user:'',
        password:'',
        validate:'',
        checked: false
      }
    }
  },
  created(){
    // this.login();
    this.getVerificationCode();
  },
  mounted(){
    let that = this;
    document.onkeyup = function(event){
        var e = event || window.event;
         if(e && e.keyCode==13){ // enter 键
           that.login();
        }
    };

    let energyParams = {};
    getLoginEnergyData(energyParams).then(res=>{
      let {code} = res;
      if(code==200){
        this.energyConsumption =  res.data.energy;
        this.co2Num = res.data.carbon;
      }else{
        this.$message({
          message:res.msg,
          type:'error'
        });
      }
    }).catch(error=>{
      console.error(error);
    });
  },
  beforeDestroy(){
    document.onkeyup = '';
  },
  methods: {
    login(){
      if(this.form.user == ''){
        this.$message({
          message:'用户名不能为空',
          type:'error'
        });
        // this.message = '用户名不能为空！';
        // this.isShow = true;
        this.getVerificationCode();
      }else if(this.form.password == ''){
        this.$message({
          message:'密码不能为空',
          type:'error'
        });
        // this.message = '密码不能为空！';
        // this.isShow = true;
        this.getVerificationCode();
      }else {
        if(this.isShowCode){
          if(this.form.validate == ''){
            this.message = '验证码不能为空！';
            this.isShow = true;
          }
        }

        this.isShow = false;

        //下次自动登录转换
        let checkedNum = { "true":"0", "false":"1" }[this.form.checked];
//        console.log(checkedNum);
        //调用登录接口
        let para = {
          "accountName": this.form.user.trim(),
          "password": this.form.password.trim(),
          "validateCode": this.form.validate.trim(),
          "day": checkedNum
        };
        login(para).then((res) => {
//        console.log(res);
          if (res.code == 200){
//            console.log(res);
            let isLogin = !!res.data.isSystem;
            let isSystem = res.data.isSystem;
            sessionStorage.setItem('isLogin', JSON.stringify(isLogin));
            sessionStorage.setItem('isSystem', JSON.stringify(isSystem));
            this.$router.push('/home');
          }else if(res.code == 506){
            this.$message({
              message:res.msg,
              type:'error'
            });
            this.isShowCode = true;
            this.focusCode = true;
          }else if(res.code == 400){
            this.message = res.msg;
            this.isShow = true;
            this.form.validate = '';
            this.getVerificationCode();
          }else if(res.code == 521){
            this.$message({
              message:res.msg,
              type:'error'
            });
          }else if(res.code == 501 || res.code == 502 ){
            this.$alert('您的账号属于个人账号，需升级成企业账号才能访问"GreenOffice"。', '提示', {
              confirmButtonText: '立即升级',
              type:'warning',
            }).then(() => {
              this.$router.push({  path: '/register2', query: { entry: 'upgrade', account:this.form.user.trim() }});
            }).catch(() => {
              // this.$message({
              //   type: 'info',
              //   message: '已取消升级'
              // });
            });
          }else if(res.code == 505){
            this.$message({
              message:res.msg,
              type:'error'
            });
            this.isShowCode = true;
          }
        }).catch(function (error) {
          console.log(error);
        });
      }

//      let para = {
//        "accountName": "15989860607",
//        "password": "654321"
//      };
//      login(para).then((res) => {
////        console.log(res);
//        let sessionId = res.data.sessionId;
//        if (res.code == 200) {
////          console.log(res);
//          sessionStorage.setItem('user', JSON.stringify(sessionId));
//          this.$router.push('/home');
//        }
//      }).catch(function (error) {
//        console.log(error);
//      });
    },
    //刷新验证码
    getVerificationCode(){
      this.imgUrl = verificationCode();
    }
  }
}
</script>

<style lang="scss" scoped>
  #login{
    .el-form-item{
        margin-bottom: 20px;
    }
    width: 100%;
    height: 100%;
    overflow: auto;
    background:-webkit-linear-gradient(top,#f9f9f9 80%,#eaeaea 20%);
    // filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#ffffff',GradientType=0 );
    position: relative;
    box-sizing: border-box;
    .loginForm{
      // min-width: 1200px;
      width: 1200px;
      margin: auto;
      min-height: 84%;
      position: relative;
      background:url("../assets/img/ui21/login.png") no-repeat center bottom;
      .login-statistics{
        position: absolute;
        top: 30%;
        left: 8%;
        font-size: 22px;
        line-height: 1.8;
        span{
          color: #ffd765;
          font-size: 26px;
        }
      }
      .loginContain{
        // position: absolute;
        // top: 24%;
        // right: 10%;
        width: 400px;
        float: right;
        margin: 15% 110px 0 0 ;
        // margin: 0 auto;
        padding: 38px 50px 32px 50px;
        background: #fff;
        border-radius: 8px;
        .loginLogo{
          margin-bottom: 32px;
          text-align: center;
          .icon-logo{
            font-size:40px;
            color:#15d1a5;
          }
        }
        .loginContent{
          .wrap-input-login{
            position: relative;
            height: 42px;
            border-radius: 6px;
            border: 2px solid #dddfe8;
            margin-bottom: 20px;
            transition: border-color .2s cubic-bezier(.645,.045,.355,1);
            input{
              width: calc(100% - 41px);
              // height: 38px;
              height: calc(100% - 2px);
              padding-left: 40px;
              border: none;
              outline: none;
              border-radius: 6px;
              line-height: 1.5;
            }
            .iconfont{
              position: absolute;
              top: 10px;
              left: 14px;
              font-size: 18px;
              color: #dddfe8;
              pointer-events:none;
            }
          }
          .wrap-input-login:hover{
            border: 2px solid #ccceda;
          }
          .validateImg{
            float: right;
            border: 2px solid #dddfe8;
            border-radius: 6px;
            transition: border-color .2s cubic-bezier(.645,.045,.355,1);
            img{
              width: 100%;
              vertical-align: top;
              cursor: pointer;
            }
          }
          .validateImg:hover{
            border: 2px solid #ccceda;
          }
          .el-checkbox {
            color: #8c8ea2;
          }
          .forgetP{
            float: right;
            color: #15d1a5;
          }
          .reg{
            a{
              color: #15d1a5;
            }
          }
          .el-form-item:nth-child(4),.el-form-item:nth-child(5){
            margin-bottom: 0;
          }
        }
      }
    }
    footer {
      width: 100%;
      // height: 100px;
      color: #8c8ea2;
      background-color: transparent;
      padding-top: 60px;
      padding-bottom: 30px;
      text-align: center;
      // position: absolute;
      // bottom: 30px;
      p {
        margin-bottom: 1em;
        font-size:12px;
        img{
          vertical-align: top;
        }
      }
    }
  }

  // _::-webkit-full-page-media, _:future, :root .safari_only {
  //   /*此处为css样式*/
  //   #login{
  //     .loginContent{
  //       input{
  //         width: calc(100% - 50px);
  //         // height: 38px;
  //         height: calc(100% - 4px);
  //         line-height: 2;
  //       }
  //     }
  //   }
  // }

</style>
