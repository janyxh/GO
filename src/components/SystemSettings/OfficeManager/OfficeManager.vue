<template>
  <section>
    <div class="navHeadBtns">
      <el-button size="large" @click="showOffice_dailog">添加办公室</el-button>
    </div>
    <el-dialog :title="addOffice_dialog.isEdit ? '修改办公室' : '添加办公室'" :visible.sync="officeIDialog.visible">
      <el-form :model="addOffice_dialog" :rules="rules" ref="ruleForm" label-width="30%" class="form-corporate officeManagement">

        <el-form-item label="办公室名称：" prop="officeName" class="is-required">
          <el-input v-model="addOffice_dialog.officeName" placeholder="请输入办公室名称" style="width: 216px;"></el-input>
        </el-form-item>
        <el-form-item label="办公室面积：" prop="officeSize" class="is-required">
          <el-input v-model="addOffice_dialog.officeSize" placeholder="请输入办公室面积" style="width: 216px;"></el-input> m²
        </el-form-item>
        <el-form-item label="地址：" class="is-required">
          <el-col :span="6">
            <el-form-item prop="province" style="margin-bottom:0px;">
              <el-select v-model="addOffice_dialog.province" placeholder="请选择省" style="width: 110px;" v-on:change="provinceChange">
                <el-option v-for="item in provinces" :key="item.code" :label="item.name" :value="item.code">
                </el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="city" style="margin-bottom:0px;">
              <el-select v-model="addOffice_dialog.city" placeholder="请选择市" style="width: 110px;" v-on:change="cityChange">
                <el-option v-for="item in citys" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="area" style="margin-bottom:0px;">
              <el-select v-model="addOffice_dialog.area" placeholder="请选择区" style="width: 110px;">
                <el-option v-for="item in areas" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-form-item>
        <el-form-item label="详细地址：" prop="address" class="is-required">
          <el-input v-model="addOffice_dialog.address" placeholder="请输入详细地址" :maxlength="100" style="width: 350px; "></el-input>
        </el-form-item>
        <!-- <el-form-item label="办公室照片：">
                                                <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                                  <img v-if="addOffice_dialog.imageUrl" :src="addOffice_dialog.imageUrl" class="avatar">
                                                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                                </el-upload>
                                              </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOffice_dialog_cancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <div class="cardStyle">
      <el-tabs v-model="selectedOffice" @tab-click="tapClick" v-if="officeList.length > 0">
        <el-tab-pane v-for="(item, index) in officeList" :key="item.officeId" :label="item.officeName" :name="item.officeId">
          <SingleOffice v-on:editOffice="editOffice" v-on:deleteOffice="deleteOffice" :officeData="item" :officeId="item.officeId">
          </SingleOffice>
        </el-tab-pane>

      </el-tabs>
      <span v-if="officeList.length == 0" class="noOffice">没有办公室</span>
    </div>
  </section>
</template>

<script>

// 修改办公室和添加办公室 的title

import SingleOffice from './SingleOffice';
import { getAllOffice, upDateOrSaveOffice, deleteOffice, getAreas, getProvinces, getCitys } from '../../../api/office';
import { addressCheck, officeSizeCheck, officeNameCheck } from '../../../utils/regularCheck'

export default {
  name: 'OfficeManager',
  components: { SingleOffice },
  data() {
    const validateAddress = (rule, value, callback) => {
      let checkRes = addressCheck(value);
      if(!checkRes.isPass){
        return callback(new Error(checkRes.info));
      }else {
        callback();
      }
    };
    var validateofficeSize = function(rule, value, callback){
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
    return {
      officeList: [],
      provinces: [
        {
          name: '',
          code: 1,
        }
      ],
      citys: [{
        name: '',
        code: 1,
      }],
      areas: [
        {
          name: '',
          code: 1
        }
      ],
      selectedOffice: '',
      officeIDialog: {
        visible: false,
      },
      isSubmiting: false,
      addOffice_dialog: {
        officeSize:'',
        officeName: '',
        address: '',
        city: '',
        province: '',
        area: '',
        imageUrl: '',
        imageId: '',
      },

      rules: {
        officeName: [
          { validator: validateOfficeName, trigger: 'blur' }
        ],
        city: [
          { message: '请选择城市', trigger: 'change', type: 'number' },
        ],
        province: [
          { message: '请选择省', trigger: 'change', type: 'number' },
        ],
        area: [
          { message: '请选择区', trigger: 'change', type: 'number' },
        ],
        officeSize: [
           { validator: validateofficeSize, trigger: 'blur' }
        ],
        address: [
          { validator: validateAddress, trigger: 'blur' }
        ],
      },
      value: '',
      title: '',
    }
  },
  mounted() {
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
    this.init();
    getProvinces().then((res) => {
      this.provinces = res.data;
    })
  },
  methods: {
    init: function () {
      // 获取数据
      return getAllOffice().then((res) => {
        const { data, code, msg } = res;
        if (code == 200) {
          const list = data.map(item => {
            item.isEdit = false;
            item.province = item.province || '';
            item.city = item.city || '';
            item.area = item.area || '';
            item.address = item.address || '';
            return item;
          })
          this.officeList = list;
          this.selectedOffice = this.officeList[0] && this.officeList[0].officeId;
        } else {
          alert(msg)
        }
      })


    },
    tapClick: function (tab, event) {

    },

    cityChange: function (id) {
      if (typeof id == 'string') {

        return;
      }
      getAreas({ cityCode: id }).then(res => {
        this.areas = res.data;
      })
      this.addOffice_dialog.area = '';
    },
    provinceChange: function (id) {
      if (typeof id == 'string') {
        return;
      }

      getCitys({ provinceCode: id }).then(res => {
        this.citys = res.data;
      })
      this.addOffice_dialog.city = '';
      this.addOffice_dialog.area = '';
      this.areas = [];


    },
    showOffice_dailog: function (id) {

      if (typeof id == 'string') {

        const data = this.officeList.find(item => {
          return item.officeId == id;
        })
        this.addOffice_dialog = { ...data }
        this.addOffice_dialog.isEdit = true;


        if(typeof this.addOffice_dialog.officeSize == "number"){
          this.addOffice_dialog.officeSize = this.addOffice_dialog.officeSize.toString();
        }else{
          this.addOffice_dialog.officeSize = "0";
        }


        // 城市
        getProvinces().then(res => {
          const list = res.data;
          const obj = list.find(item => {
            return item.name == data.province;
          })
          if (obj) {
            this.addOffice_dialog.province = obj.code;
            return obj.code;
          } else {
            return null;
          }

        }).then(provinceCode => {
          if (typeof provinceCode != 'number') {
            return null;
          }

          return getCitys({ provinceCode }).then(res => {
            const list = res.data;
            const obj = list.find(item => {
              return item.name == data.city;
            })
            if (obj) {
              this.addOffice_dialog.city = obj.code;
              return obj.code;
            }
            return null;

          })
        }).then(cityCode => {
          if (typeof cityCode != 'number') {
            return;
          }

          return getAreas({ cityCode }).then(res => {
            const list = res.data;
            const obj = list.find(item => {
              return item.name == data.area;
            })
            if (obj) {
              this.addOffice_dialog.area = obj.code;
            }

          })
        })
      } else {
        if (this.officeList.length >= 5) {
          this.$message({
            message: '最多添加5个办公室',
            type: 'error'
          });
          return;
        }
        const data = {
          officeName: '',
          address: '',
          city: '',
          province: '',
          area: '',
          imageUrl: '',
          imageId: '',
          isEdit: false,
          officeSize:'',
        };

        this.addOffice_dialog = data;
      }
      this.officeIDialog.visible = true;
      this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields();
    },

    addOffice_dialog_cancel: function (formName) {
      this.officeIDialog.visible = false;
      setTimeout(() => {
        this.resetForm(formName);
      }, 500);
    },

    handleAvatarSuccess(res, file) {
      this.addOffice_dialog.imageId = res;
      this.addOffice_dialog.imageUrl = URL.createObjectURL(file.raw);
    },
    submitForm(formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
      //     // 更新
          if (this.addOffice_dialog.isEdit) {

            const data = JSON.parse(JSON.stringify(this.addOffice_dialog));
            if (data.city) {
              data.city = this.citys.find((item) => {
                return item.code == data.city;
              }).name;
            }
            if (data.province) {
              data.province = this.provinces.find((item) => {
                return item.code == data.province;
              }).name;
            }
            if (data.area) {
              data.area = this.areas.find((item) => {
                return item.code == data.area;
              }).name;
            }

            data.officeName = data.officeName.trim();


            upDateOrSaveOffice(data).then(res => {
              const { msg, code, data } = res;
              if (code == 200) {
                this.$message({
                  message: res.data,
                  type: 'success'
                });

                this.init().then(() => {

                  this.selectedOffice = this.addOffice_dialog.officeId.toString();
                  this.addOffice_dialog_cancel('ruleForm')
                })

              } else {
                this.$message({
                  message: msg,
                  type: 'error'
                });

                this.addOffice_dialog_cancel('ruleForm')
              }


            })
          } else {  // 新增
            const dataOffice = JSON.parse(JSON.stringify(this.addOffice_dialog));
            if (dataOffice.city) {
              dataOffice.city = this.citys.find((item) => {
                return item.code == dataOffice.city;
              }).name;
            }
            if (dataOffice.province) {
              dataOffice.province = this.provinces.find((item) => {
                return item.code == dataOffice.province;
              }).name;
            }
            if (dataOffice.area) {
              dataOffice.area = this.areas.find((item) => {
                return item.code == dataOffice.area;
              }).name;
            }

            upDateOrSaveOffice(dataOffice).then(res => {
              const { msg, code, data } = res;
              if (code == 200) {
                this.$message({
                  message: res.data,
                  type: 'success'
                });
                this.init().then(() => {
                  this.officeIDialog.visible = false;
                  this.addOffice_dialog_cancel('ruleForm')
                })
              } else {
                this.$message({
                  message: msg,
                  type: 'error'
                });
                this.officeIDialog.visible = false;
                this.addOffice_dialog_cancel('ruleForm')
              }

            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    editOffice() {
      this.showOffice_dailog(this.selectedOffice);
    },
    deleteOffice() {

      this.$confirm('确认删除？')
        .then(_ => {
          deleteOffice({ officeId: this.selectedOffice }).then(res => {
            const { code, msg, data } = res;
            if (code == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.init();
            } else {
              this.$message({
                message: msg,
                type: 'error'
              });
            }
            this.officeIDialog.visible = false;
          })
        })
        .catch(_ => { });
    },
    resetForm(formName) {

      const data = {
        officeName: '',
        address: '',
        city: '',
        province: '',
        area: '',
        imageUrl: '',
        imageId: '',
      };
      this.addOffice_dialog = data;
      this.citys = '';
      this.areas = '';
      this.$refs[formName].resetFields();
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/png';
      const isImg = /image/.test(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isImg) {
        this.$message.error('只能上传图片!');
      }
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      return isImg && isLt5M;
    }

  }
}
</script>


<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.avatar-uploader-icon {

  font-size: 28px;
  color: #8c939d;
  width: 180px;
  height: 180px;
  line-height: 178px;
  text-align: center;
  border: 1px solid rgba(204, 206, 218, 1);
}

.avatar {
  width: 180px;
  height: 180px;
  display: block;
}

.officeManagement {

  height: 190px;
}
.noOffice{
  margin-left: 50px;
}
</style>
