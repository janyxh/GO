<template>
    <section>
      <el-row>
        <el-col :span="12" class="wrap-corporate">
            <div class="cardStyle">
                <div class="tit-corporate">
                  <p>企业信息</p>
                </div>
                <div>
                    <el-form label-width="30%" class="form-corporate" v-show="!isEdit">
                      <el-form-item class="wrap-edit-corporate text-right">
                        <el-button type="text" @click="edit">编辑</el-button>
                        <!-- <el-button type="text" @click="edit">编辑</el-button> -->
                      </el-form-item>
                      <el-form-item label="公司名称：">
                        {{this.corporate.companyname}}
                      </el-form-item>
                      <el-form-item label="联系人：">
                        {{this.corporate.contacts}}
                      </el-form-item>
                      <el-form-item label="联系电话：">
                        {{this.corporate.contactnumber}}
                      </el-form-item>
                    </el-form>
                </div>
                <div>
                    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="30%" class="form-corporate" v-show="isEdit">
                      <el-form-item class="wrap-edit-corporate text-right">
                        <el-button type="text" @click="submitForm('ruleForm')">保存</el-button>
                        <el-button type="text" @click="reset('ruleForm')">取消</el-button>
                      </el-form-item>
                      <el-form-item label="公司名称：" prop="companyname">
                        <el-input v-model="form.companyname" :maxlength="60"></el-input>
                      </el-form-item>
                      <el-form-item label="联系人：" prop="contacts">
                        <el-input v-model="form.contacts" :maxlength="60"></el-input>
                      </el-form-item>
                      <el-form-item label="联系电话：" prop="contactnumber">
                        <el-input v-model="form.contactnumber"></el-input>
                      </el-form-item>
                    </el-form>
                </div>
            </div>


            <div class="cardStyle">
                <div class="tit-corporate">
                  <p>办公楼信息</p>
                </div>
                <div v-for="office in officeList" class="office-info">
                  <el-form label-width="30%">
                      <el-form-item label="办公楼名称：">
                        {{office.familyName}}
                      </el-form-item>
                      <el-form-item label="办公地址：">
                        {{office.country}}
                        {{office.state}}
                        {{office.city}}
                      </el-form-item>
                  </el-form>
                </div>
            </div>
        </el-col>
      </el-row>
    </section>
</template>

<script>
  import { getCorporate,updateCorporate } from '../../api/api';
  import { contactsCheck, phoneRegCheck, telRegCheck } from '../../utils/regularCheck';
  export default {
      name: "CorporateInfo",
      data() {
          const validateName = (rule, value, callback) => {
            if (value.trim()=='') {
              return callback("公司名称不能为空");
            }else {
              callback();
            }
          };
          const validateContacts = (rule, value, callback) => {
            let checkRes = contactsCheck(value);
            if(!checkRes.isPass){
              return callback(new Error(checkRes.info));
            }else {
              callback();
            }
          };
          const validatePass = (rule, value, callback) => {
            // let mobile = /^1((3|5|8){1}\d{1}|70)\d{8}$/;
            // let phone = /^(\d{3}-|\d{4}-)(\d{8}|\d{7})$/;
            if ( !phoneRegCheck(value.trim()) && !telRegCheck(value.trim())) {
              callback("请输入正确的手机号码或者带区号的电话号码，如0755-xxxxxxxx");
            }else {
              callback();
            }
          };
          return {
            corporate:{
                companyid:'',
                companyname:'',
                contacts:'',
                contactnumber:''
            },
            officeList:[],
            isEdit:false,
            form:{
                companyname:'',
                contacts:'',
                contactnumber:''
            },
            rules:{
                companyname: [
                  { required: true, message: '请输入公司名称', trigger: 'blur' },
                  { min: 1, max: 60, message: '公司名称长度在1-60位', trigger: 'blur' },
                  { validator: validateName, trigger: 'blur' }
                ],
                contacts: [
                  // { required: true, message: '请输入联系人姓名', trigger: 'blur' },
                  // { min: 2,  message: '联系人名称不能少于两个字符', trigger: 'blur' },
                  { validator: validateContacts, trigger: 'blur' }
                ],
                contactnumber: [
                  { required: true, message: '请输入联系电话', trigger: 'blur' },
                  { validator: validatePass, trigger: 'blur' }
                ],
            }
          }
      },
      created(){
          this.ready();
      },
      methods:{
          ready(){
              let corporateParams = null;
              getCorporate(corporateParams).then(data=>{
                // console.log(data.data);
                let {code,msg} = data;
                if(code != 200){
                    this.$message({
                      message: data.msg,
                      type: 'error'
                    });
                }else {
                    this.corporate.companyid = data.data.company.companyid;
                    this.corporate.companyname = data.data.company.companyname;
                    this.corporate.contacts = data.data.company.contacts;
                    this.corporate.contactnumber = data.data.company.contactnumber;

                    this.form.companyname = data.data.company.companyname;
                    this.form.contacts = data.data.company.contacts;
                    this.form.contactnumber = data.data.company.contactnumber;

                    this.officeList = data.data.officeList;
                }
              }).catch(error=>{
                console.log(error);
              });
          },
          edit(){
            this.isEdit = true;
          },
          reset(formName){
            this.isEdit = false;
            this.$refs[formName].resetFields();
            this.ready();
          },
          submitForm(formName) {
              this.$refs[formName].validate((valid) => {
                if (valid) {
                  // alert('submit!');
                  let updateParams = {'companyId':this.corporate.companyid,'companyName':this.form.companyname,'contacts':this.form.contacts,'contactNumber':this.form.contactnumber};
                  updateCorporate(updateParams).then(data=>{
                    // console.log(data.data);
                    let {code,msg} = data;
                    if(code != 200){
                        this.$message({
                          message: data.msg,
                          type: 'error'
                        });
                    }else {
                        this.$message({
                          message: data.data,
                          type: 'success'
                        });
                        this.ready();
                        this.isEdit = false;
                    }
                  }).catch(error=>{
                    console.log(error);
                  });
                } else {
                  // console.log('error submit!!');
                  return false;
                }
              });
          },
          trim(str){
            return str.replace(/\s/g,"");
          },
      }
  }
</script>

<style lang="scss" scoped>
  .cardStyle{
    padding: 40px 50px;
    margin-bottom: 30px;
  }
  // .cardStyle .el-form-item{
  //   margin-bottom: 0;
  // }
  .wrap-corporate{
    word-wrap: break-word;
  }
  .tit-corporate p{
    text-align: center;
    font-size: 14px;
  }
  .form-corporate{
      margin-bottom: 50px;
  }
  .wrap-edit-corporate{
    padding: 20px 0;
  }

  .office-info{
    padding: 50px 0;
    border-bottom: 1px solid #ccc;
  }
  .office-info:last-child{
    border-bottom:none;
  }
</style>
