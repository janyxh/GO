<template lang="html">
  <article class="register" id="register">
    <regLogo></regLogo>
    <div class="content">
      <div class="breadcrumb" v-if="entry.register">
        <h2>注册</h2>
        <i>已有账号？
          <router-link to="/">立即登录</router-link>
        </i>
      </div>
      <div class="breadcrumb" v-if="entry.upgrade">
        <h2>升级企业账号</h2>
      </div>
      <el-row :gutter="20">
        <el-col :span="17">
          <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="460px" class="demo-ruleForm">
            <!-- 授权使用登录账号 -->
            <el-form-item label="登录账号：" prop="account" v-show="entry.upgrade">
              <el-input v-model="ruleForm2.account" placeholder="请输入手机号或邮箱"></el-input>
              <span class="txt-tips">  * 您收到授权成功的消息后，可直接登录系统</span>
            </el-form-item>
            <el-form-item label="联系人：" prop="contacts" class="is-required">
              <el-input v-model="ruleForm2.contacts" :maxlength="60" placeholder="请输入联系人"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="contactNumber">
              <el-input v-model="ruleForm2.contactNumber" :maxlength="30" placeholder="请输入联系电话"></el-input>
            </el-form-item>
            <el-form-item label="企业名称：" prop="companyName">
              <el-input v-model="ruleForm2.companyName" :maxlength="60" placeholder="请输入企业名称" @blur="inputCompanyName"></el-input>
            </el-form-item>
            <el-form-item label="地址：" class="is-required sel-district">
              <el-row :gutter="16" style="margin: 0;" class="">
                <el-col :span="8" style="padding-left: 0;">
                  <el-form-item prop="province">
                    <el-select v-model="ruleForm2.province" placeholder="请选择省" v-on:change="provinceChange">
                      <el-option v-for="item in provinces" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>

                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="city">
                    <el-select v-model="ruleForm2.city" placeholder="请选择市" v-on:change="cityChange">
                      <el-option v-for="item in citys" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-right: 0;">
                  <el-form-item prop="area">
                    <el-select v-model="ruleForm2.area" placeholder="请选择区">
                      <el-option v-for="item in areas" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

            </el-form-item>
            <el-form-item label=" " prop="address">
              <el-input v-model="ruleForm2.address" :maxlength="100" placeholder="请输入详细地址"></el-input>
            </el-form-item>
            <el-form-item label="办公室面积：" prop="officeSize" class="input-wrap-unit is-required">
              <el-input v-model="ruleForm2.officeSize" placeholder="请输入办公室面积"></el-input>
              <span class="unit">m²</span>

            </el-form-item>
            <el-form-item label="办公室名称：" prop="officeName" class="is-required">
              <el-input v-model="ruleForm2.officeName" :maxlength="32" placeholder="请输入办公室名称"></el-input>
            </el-form-item>
            <el-form-item label="办公区域：" class="is-required">
              <!-- <el-form-item
                v-for="(aRoom,index) in ruleForm2.roomAll"
                :key="aRoom.key"
                :prop="'roomAll.' + index + '.roomName'"
                > -->
              <el-form-item
                v-for="(aRoom,index) in ruleForm2.roomAll"
                :key="aRoom.key"
                :prop="'roomAll.' + index + '.roomName'"
                :rules="[
                  {required: true, message: '请输入办公区域', trigger: 'blur'},
                  {max:32, message: '办公区域名称长度不得超过32位', trigger: 'blur'},
                ]">
                  <addRoomList
                    :aRoom = "aRoom"
                    :index = "index"
                    @handleAddArea="addOneArea"
                    @handleMinusArea="minusOneArea">
                  </addRoomList>
              </el-form-item>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 注册 -->
      <el-row v-if="entry.register">
        <el-col :offset="8" :span="5">
          <el-button @click="backForm('ruleForm2')" class="btns">返回</el-button>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="submitForm('ruleForm2')" class="btns">注册</el-button>
        </el-col>
      </el-row>
      <!-- 授权 -->
      <el-row v-if="entry.upgrade">
        <el-col :offset="8" :span="5">
          <el-button @click="cancelForm('ruleForm2')" class="btns">取消</el-button>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="submitForm('ruleForm2')" class="btns">提交</el-button>
        </el-col>
      </el-row>
    </div>
  </article>
</template>

<script>
  import { getProvinces, getCitys, getAreas } from '../../api/office'
  import { permission } from '../../api/register'
  import regLogo from '../../items/regLogo'
  import addRoomList from '../../components/Register/AddRoomList'
  import { phoneRegCheck, emailRegCheck, telRegCheck, contactsCheck, addressCheck, officeSizeCheck, officeNameCheck } from '../../utils/regularCheck'
  export default {
    components:{
      regLogo,
      addRoomList
    },
    data(){
      const checkAccount = (rule, value, callback) => {
        if (value === '' || value.trim() == '' ) {
          callback(new Error('请输入登录账号'));
        }else if(!phoneRegCheck(value.trim()) && !emailRegCheck(value.trim())){
          callback(new Error('请输入正确的手机号或邮箱'));
        }else{
          callback();
        }
      };
      const validateName = (rule, value, callback) => {
        if (value.trim()=='') {
          return callback("请输入企业名称");
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
        if ( !phoneRegCheck(value.trim()) && !telRegCheck(value.trim())) {
          callback("请输入正确的手机号码或者带区号的电话号码，如0755-xxxxxxxx");
        }else {
          callback();
        }
      };
      const validateAddress = (rule, value, callback) => {
        let checkRes = addressCheck(value);
        if(!checkRes.isPass){
          return callback(new Error(checkRes.info));
        }else {
          callback();
        }
      };
      const validateOfficeSize = function(rule, value, callback){
        if(!officeSizeCheck(value).isPass){
          return callback(new Error(officeSizeCheck(value).info));
        }else{
          callback();
        }
      };
      const validateOfficeName = function(rule, value, callback){
        if(!officeNameCheck(value).isPass){
          return callback(new Error(officeNameCheck(value).info));
        }else{
          callback();
        }
      };
      const validateRoomName = function(rule, value, callback){
        if(value.trim()==''){
          return callback("请输入区域名称");
          // return callback(new Error(officeNameCheck(value).info));
        }else{
          callback();
        }
      };
      return {
        entry:{   //入口
          register:false,
          upgrade:false,
        },
        ruleForm2: {  //表单
          account: '',
          contacts:'',
          contactNumber:'',
          companyName:'',
          officeSize:'',
          officeName: '',
          address: '',
          city: '',
          province: '',
          area: '',
          // imageUrl: '',
          // imageId: '',
          roomNames: [],
          roomAll: [{ 'roomName': '公共区域' }],
        },
        rules2: {   //验证
          account: [
             { required: true, message: '请输入登录账号', trigger: 'blur' },
             { validator: checkAccount, trigger: 'blur' }
          ],
          contacts: [
            // { required: true, message: '请输入联系人姓名', trigger: 'blur' },
            // { min: 2, message: '联系人名称不能少于两个字符', trigger: 'blur' },
            // { max: 60, message: '联系人名称不能超过60个字符', trigger: 'blur' },
            { validator: validateContacts, trigger: 'blur' }
          ],
          contactNumber: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ],
          companyName: [
            { required: true, message: '请输入企业名称', trigger: 'blur' },
            { max: 60, message: '企业名称长度在1-60位', trigger: 'blur' },
            { validator: validateName, trigger: 'blur' }
          ],
          province: [
            { required: true, message: '请选择省', trigger: 'change', type: 'number' },
          ],
          city: [
            { required: true,  message: '请选择城市', trigger: 'change', type: 'number' },
          ],
          area: [
            { required: true, message: '请选择区', trigger: 'change', type: 'number' },
          ],
          address: [
            { validator: validateAddress, trigger: 'blur' }
          ],
          officeSize: [
             { validator: validateOfficeSize, trigger: 'blur' }
          ],
          officeName: [
            { validator: validateOfficeName, trigger: 'blur' }
          ],
          // "roomAll.0.roomName":[
          //   { validator: validateRoomName, trigger: 'blur' }
          // ]
        },
        provinces: [
          {
            label: '省',
            value: '1',
          }
        ],
        citys: [{
          label: '省',
          value: '1',
        }],
        areas: [
          {
            label: '区,',
            value: '1'
          }
        ],
      };
    },
    // -------------------------------------------------   加载   --------------------------------------------------------------------
    mounted(){
      //判断是注册还是升级企业账号
      if(this.$route.query.entry == 'register'){
        this.entry.register = true;
      }else if(this.$route.query.entry == 'upgrade'){
        this.entry.upgrade = true;
      }
      //获取账号
      this.ruleForm2.account = this.$route.query.account;
      //获取省份
      getProvinces().then((res) => {
        this.provinces = res.data;
      })
      // 计算字符长度
      String.prototype.gblen = function () {
        var len = 0;
        for (var i = 0; i < this.length; i++) {
          if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
            len += 2;
          } else {
            len++;
          }
        }
        return len;
      }
    },
    // -------------------------------------------------   函数   --------------------------------------------------------------------
    methods:{
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let regParams = {...this.ruleForm2};

            if (regParams.city) {
              regParams.city = this.citys.find((item) => {
                return item.code == regParams.city;
              }).name;
            }
            if (regParams.province) {
              regParams.province = this.provinces.find((item) => {
                return item.code == regParams.province;
              }).name;
            }
            if (regParams.area) {
              regParams.area = this.areas.find((item) => {
                return item.code == regParams.area;
              }).name;
            }

            if(regParams.officeSize.toString().trim() == ''){
              regParams.officeSize = 0;
            }else{
              regParams.officeSize = parseInt(regParams.officeSize);
            }

            if(this.ruleForm2.roomAll.length >0){
              let resM = this.ruleForm2.roomAll.map((item)=>{
                  return item.roomName;
              });
              // console.log(resM);
              regParams.roomNames = resM;
            }

            delete regParams.roomAll;
            console.log(regParams);
            permission(regParams).then(res=>{
              let { code } = res;
              if(code != 200){
                this.$message({
                 message: res.msg,
                 type: 'error'
               });
              }else{
                this.$alert(res.data, '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                }).then(() => {
                  this.$router.push('/');
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
      //取消升级企业账号
      cancelForm(formName){
        this.$refs[formName].resetFields();
        this.$router.push('/');
      },
      //注册返回上一步
      backForm(formName){
        this.$refs[formName].resetFields();
        this.$router.go(-1);
      },
      //获取市、区
      provinceChange(id) {
        if (typeof id == 'string') {
          return;
        }
        getCitys({ provinceCode: id }).then(res => {
          this.citys = res.data;
        })
        this.ruleForm2.city = '';
        this.ruleForm2.area = '';
        this.areas = [];
      },
      cityChange(id) {
        if (typeof id == 'string') {

          return;
        }
        getAreas({ cityCode: id }).then(res => {
          this.areas = res.data;
        })
        this.ruleForm2.area = '';
      },
      // 添加,删除区域
      addOneArea() {
        // this.ruleForm2.roomAll.push({ 'roomName': '' });
        this.ruleForm2.roomAll.push({
          roomName: '',
          key: Date.now()
        });
        // let roomName = "roomAll."+ (this.ruleForm2.roomAll.length -1) +".roomName";
        //
        // this.rules2[roomName] = [{ validator: this.validateRoomName, trigger: 'blur' }];
        // console.log(this.rules2);
      },
      minusOneArea(index) {
        this.ruleForm2.roomAll.splice(index, 1);
      },
      //输入企业名称，自动填充办公室
      inputCompanyName(){
        if(this.ruleForm2.companyName.trim() != '' && this.ruleForm2.officeName.trim() == ''){
          this.ruleForm2.officeName = this.ruleForm2.companyName + '办公室';
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/register";
  #register{
    .breadcrumb{
      a{
        color: #15d1a5;
      }
    }
    .sel-district{
      .el-form-item{
         margin-bottom: 0px;
      }
    }
    .btns{
      padding: 15px 82px;
    }
    .txt-tips{
      color: #8a8ca0;
      font-size: 16px;
    }

  }
</style>
