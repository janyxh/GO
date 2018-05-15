<template lang="html">
  <article class="register">
    <regLogo></regLogo>
    <div class="content">
      <div class="breadcrumb">
        <h2>注册</h2>
        <i>已有账号？
          <router-link to="/">立即登录</router-link>
        </i>
      </div>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="460px" class="demo-ruleForm">
            <el-form-item label="登录账号：" prop="account" class="is-required">
              <div v-popover:popover1>
              <el-input v-model="ruleForm2.account" placeholder="请输入手机号或邮箱"></el-input>
                <el-popover
                  ref="popover1"
                  placement="right"
                  width="240"
                  trigger="click">
                  <ul class="popover-password">
                    <li>仅支持手机号和邮箱注册</li>
                    <li>注册成功后，GreenOffice和智家365通用</li>
                  </ul>
                </el-popover>
              </div>
              <span class="txt-tips">  * 注册成功后，GreenOffice和智家365通用</span>
            </el-form-item>
            <el-form-item label="动态验证码：" prop="code" class="is-required">
              <el-row>
                <el-col :span="14">
                  <el-input v-model="ruleForm2.code" auto-complete="off" :maxlength="6" placeholder="请输入动态验证码"></el-input>
                </el-col>
                <el-col :span="10" class="text-right">
                  <getCheckCodeBtn :account="ruleForm2.account" type="0" class="btn-code" @handleSend="sendCode"></getCheckCodeBtn>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="密码：" prop="password" class="is-required">
              <div v-popover:popover2>
                <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="请输入密码"></el-input>
                <el-popover
                  ref="popover2"
                  placement="right"
                  width="200"
                  trigger="click">
                  <ul class="popover-password">
                    <li>长度为6-16位字符</li>
                    <li>支持数字，大小写字母和标点符号</li>
                    <li>不允许有空格</li>
                  </ul>
                </el-popover>
              </div>
            </el-form-item>
            <el-form-item label="确认密码：" prop="confirmPassword" class="is-required">
              <el-input type="password" v-model="ruleForm2.confirmPassword" auto-complete="off" placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" @click="submitForm('ruleForm2')" class="btn">下一步</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </article>
</template>

<script>
  import { verificationNum} from '../../api/api'
  import { register} from '../../api/register'
  import regLogo from '../../items/regLogo'
  import getCheckCodeBtn from '../../items/getCheckCodeBtn';
  import { phoneRegCheck, emailRegCheck , passwordCheck} from '../../utils/regularCheck'
  export default {
    components:{
      regLogo,
      getCheckCodeBtn
    },
    data(){
      // 验证信息
      let checkAccount = (rule, value, callback) => {
        if (value === '' || value.trim() == '' ) {
          callback(new Error('请输入登录账号'));
        }else if(!phoneRegCheck(value.trim()) && !emailRegCheck(value.trim())){
          callback(new Error('请输入正确的手机号或邮箱'));
        }else{
          callback();
        }
      };
      let checkCode = (rule, value, callback) => {
        if(this.isSend){
          if (value === '' || value.trim() == '' ) {
            callback(new Error('请输入动态验证码'));
          }else if(value.length != 6){
            callback(new Error('验证码错误，请重新输入'));
          }else if(isNaN(Number(value))){
            callback(new Error('请输入数字'));
          }else{
            callback();
          }
        }
      };
      let validatePass = (rule, value, callback) => {
        let checkRes = passwordCheck(value);    //校验
        if (!checkRes.isPass) {
            return callback(new Error(checkRes.info));
        }
        callback();//通过
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.password) {
          callback(new Error('两次输入的密码不一致，请重新输入!'));
        } else {
          callback();
        }
      };
      return {
        isSend:false,
        popoverPassword:false,
        ruleForm2: {
          account: '',
          code: '',
          password: '',
          confirmPassword: ''
        },
        rules2: {
          account: [
             { validator: checkAccount, trigger: 'blur' }
          ],
          code: [
            { validator: checkCode, trigger: 'blur' },
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          confirmPassword: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      };
    },
    methods:{
      //提交表单
      submitForm(formName) {
        this.isSend = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('submit!');
            let regParams = {...this.ruleForm2};
            register(regParams).then(res=>{
              let { code } = res;
              if(code == 200){
                this.$router.push({ path: '/register2', query: { entry: 'register', account:this.ruleForm2.account.trim() } });
              }else if(code == 501){
                this.$alert('该账号已注册，但未升级成企业账号，需升级账号', '提示', {
                  confirmButtonText: '立即升级',
                  type:'warning',
                  callback: action => {
                    this.$router.push({ path: '/register2', query: { entry: 'upgrade', account:this.ruleForm2.account.trim() } });
                  }
                });
              }else if(code == 504){
                this.$alert('该账号已注册，可直接登录', '提示', {
                  confirmButtonText: '立即登录',
                  type:'warning',
                  callback: action => {
                    this.$router.push('/');
                  }
                });
              }
            }).catch(error=>{
              console.error(error);
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //是否发送难码
      sendCode(isSend){
        this.isSend = isSend;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/register";
  .breadcrumb{
    a{
      color: #15d1a5;
    }
  }
  .btn{
    width: 100%;
  }
  .txt-tips{
    color: #8a8ca0;
    font-size: 16px;
  }
  .popover-password{
    padding-left: 15px;
    li{
      list-style:initial;
    }
  }
</style>
