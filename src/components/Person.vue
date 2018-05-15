<template>
  <section>
    <el-row>
      <el-col :span="12" class=" wrap-person">
          <div class="cardStyle">
              <div class="head-person">
                <img src="../assets/img/icon_user_big.png" alt="头像" />
                <p>{{this.dataTable.companyName}}</p>
              </div>
              <el-form label-width="50%">
                <el-form-item label="用户名：">
                  {{this.dataTable.userName}}
                </el-form-item>
                <el-form-item label="姓名：">
                  {{this.dataTable.trueName}}
                </el-form-item>
                <el-form-item label="用户手机号：">
                  {{this.dataTable.phone}}
                </el-form-item>
                <el-form-item label="办公楼/区域：">
                  <p>{{this.dataTable.officeName}}</p>
                  <p>{{this.dataTable.areaName}}</p>
                </el-form-item>
              </el-form>
              <div class="wrap-edit-password">
                <el-button @click="dialogFormVisible = true">修改密码</el-button>
              </div>
          </div>
      </el-col>
    </el-row>

    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-row :gutter="30">
          <el-col :span="20">
        <el-form-item label="新密码：" prop="password" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.password" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="passwordAgain" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.passwordAgain" auto-complete="off" placeholder="请再次输入密码"></el-input>
        </el-form-item>
    </el-col>
  </el-row>
</el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="btnSaveLoading">确 定</el-button>
      </div>
    </el-dialog>


  </section>
</template>

<script>
import {getPerson,updatePassword} from "../api/api"
import {passwordCheck} from "../utils/regularCheck"
export default {
  name:"Person",
  data(){
    var validatePass = (rule, value, callback) => {
      if (!passwordCheck(value).isPass) {
        callback(new Error(passwordCheck(value).info));
      } else {
        if (this.ruleForm.passwordAgain !== '') {
          this.$refs.ruleForm.validateField('passwordAgain');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致，请重新输入'));
      } else {
        callback();
        this.form.newPassword = value;
      }
    };
    return{
      btnSaveLoading:false,
      dataTable:{
        userId:'',
        userName:'',
        trueName:'',
        phone:'',
        officeName:'',
        areaName:'',
        companyName:'',
        companyAddress:''
      },
      dialogFormVisible: false,
      form: {
        password: '',
        passwordAgain: '',
        newPassword:''
      },
      formLabelWidth: '180px',
      ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
      rules: {
          password: [
            { min: 6, max: 16, message: '密码长度在6-16位', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ],
          passwordAgain: [
            { validator: validatePass2, trigger: 'blur' }
          ],
      }
    }
  },
  created(){
    this.ready();
  },
  methods:{
    ready(){
        let perserParams = null;
        getPerson(perserParams).then(data =>{
          // console.log(data.data);
          this.dataTable.userId = data.data.userInfo.userId;
          this.dataTable.userName = data.data.userInfo.userName;
          this.dataTable.trueName = data.data.userInfo.trueName;
          this.dataTable.phone = data.data.userInfo.phone;
          this.dataTable.officeName = data.data.userInfo.officeName;
          this.dataTable.areaName = data.data.userInfo.areaName;
          this.dataTable.companyName = data.data.userInfo.companyName;
          this.dataTable.companyAddress = data.data.userInfo.companyAddress;

        }).catch(error =>{
          console.log(error);
        });
    },
    submitForm(formName){

        this.$refs[formName].validate((valid) => {
          if (valid) {
            let passwordParams = {'userId':this.dataTable.userId,'newPassword':this.form.newPassword};
              // let passwordParams = {'userId':this.dataTable.userId,'newPassword':""};
            updatePassword(passwordParams).then(data =>{
              // console.log(data);
              let { msg, code } = data;
              if (code !== 200) {
                this.$message({
                  message: data.msg,
                  type: 'error'
                });
                this.btnSaveLoading = true;
              }else{
                this.$message({
                  message: data.data,
                  type: 'success'
                });
              }
            }).catch(error =>{
              console.log(error);
            });
            this.dialogFormVisible = false;
            this.$router.push('/');
          } else {
            // console.log('提交失败!');
            return false;
          }
        });
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="css" scoped>
  .wrap-person{
    min-width: 680px;
    font-size: 12px;
  }
  .head-person,.wrap-edit-password{
    text-align: center;
  }
  .head-person p{
    padding: 50px 0 20px 0;
    font-size: 14px;
  }
  .cardStyle .el-form-item{
    margin-bottom: 0;
  }
  .wrap-edit-password{
    padding: 80px 0 30px 0;
  }
</style>
