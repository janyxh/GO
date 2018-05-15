<!-----------------------------------------------------------------------------------------------------------------
about: 此文件是用户管理-添加用户，三种角色有对应的后台码，分别是企业管理员（38），普通管理员（39），普通用户（40）。此处包含
	两个功能，一个是添加用户，一个是修改用户，用setting中的值来区分
author: 马兆铿
date: 2017-9-5
-------------------------------------------------------------------------------------------------------------------->
<template>
	<section>
		<div class="cardStyle">
			<!--基本信息-->
			<div class="block info">
				<h2>基本信息</h2>
				<!--表单-->
				<el-form label-width="140px" ref="formInfo" class="demo-form-inline"
				         :label-position="'right'"
				         :model="formInfo"
				         :rules="rules">
					<el-form-item label="办公室:" prop="officeId">
						<el-select v-model="formInfo.officeId" placeholder="请选择办公室" class="my-input"
						           @change="officeChange">
							<el-option v-for="(item,index) in formInfo.officeList" :key="index" :label="item.officeName"
							           :value="item.officeId"></el-option>
						</el-select>
					</el-form-item>
					<div v-popover:popover4>
						<el-form-item label="登录帐号:" prop="name">
							<el-input v-model="formInfo.name" placeholder="请输入手机号或者邮箱" class="my-input"
							          :disabled="setting.isNameInputDisabled"></el-input>
							<el-popover
									ref="popover4"
									placement="right"
									width="200"
									trigger="click">
								<ul>
									<li>• 如您添加的账号未注册，则将给您添加的账号（邮箱或手机），发送系统初始密码</li>
									<li>• 如您添加的账号已注册，将收到授权消息</li>
								</ul>
							</el-popover>
						</el-form-item>
					</div>
					<el-form-item label="角色:" prop="isSystem">
						<el-select v-model="formInfo.isSystem" placeholder="请选择角色" class="my-input"
						           @change="isSystemChange">
							<el-option v-for="(item,index) in setting.isSystemList" :key="index" :label="item.name"
							           :value="item.val+''" v-if="item.exist"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="昵称:" prop="nickName">
						<el-input v-model="formInfo.nickName" placeholder="请输入昵称" class="my-input"></el-input>
					</el-form-item>
					<el-form-item label="真实姓名:" prop="trueName">
						<el-input v-model="formInfo.trueName" placeholder="请输入真实姓名" class="my-input"></el-input>
					</el-form-item>
					<el-form-item label="所在部门:" prop="deptName">
						<el-input v-model="formInfo.deptName" placeholder="请输入所在部门" class="my-input"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<!--办公权限-->
			<div class="block power" v-show="setting.isRoomBlockCanShow">
				<h2>区域权限</h2>
				<el-form label-width="140px" ref="formPower" class="demo-form-inline"
				         :label-position="'right'"
				         :model="formPower"
				         :rules="rules">
					<!--办公区域选项表-->
					<el-form-item label="办公区域:">
						<div class="power-office-list">
							<ul class="power-office-list-main">
								<!--全选-->
								<li>
									<el-checkbox label="全部" name="addRoomSelectAll" v-model="setting.isAllCheckboxChecked"
									             @change="allCheckboxChange"></el-checkbox>
								</li>
								<!--区域列表-->
								<li v-for="(roomSub,index) in formPower.room" :key="index" :name="index">
									<el-checkbox :label="roomSub.roomName" @change="roomSubCheckboxChange(index,$event)"
									             v-model="roomSub.checked"></el-checkbox>
									<ul class="power-office-list-sub">
										<!--设备列表-->
										<li v-for="(item,index) in roomSub.deviceList" :key="index">
											<el-checkbox :label="item.deviceName" v-model="item.checked"
											             @change="deviceCheckboxChange(index,$event)"></el-checkbox>
										</li>
									</ul>
								</li>
							</ul>
						</div>
					</el-form-item>
				</el-form>
			</div>
			<!--按钮-->
			<div class="btn-group">
				<el-button @click="cancelClick">取消</el-button>
				<el-button type="primary" @click="submitClick('formInfo')">确定</el-button>
			</div>
			<!--对话示框-->
			<el-dialog size="tiny" title="提示" :visible.sync="setting.isDialogBoxVisible">
				<span>你已经对页面进行了编辑，确定要离开吗？</span>
				<span slot="footer" class="dialog-footer">
          <el-button @click="setting.isDialogBoxVisible = false">取 消</el-button>
						<router-link to="/UserManager">
							<el-button type="primary">确 定</el-button>
						</router-link>
        </span>
			</el-dialog>
		</div>
	</section>
</template>

<script>
  import {phoneRegCheck, emailRegCheck} from '../../utils/regularCheck';
  import {getAreaAndItsDevice} from '../../api/api';
  import {getAllOffice} from '../../api/office';
  import {getPartOfUserInfo, addOrEditUser, getUserInfo} from '../../api/user';
  //
  export default {
    data() {
      /*---------------------------------------- 表单校验 ----------------------------------------*/
      /*  element默认自定义验证规则，检查登录帐号
			* @param rule? value对应的输入值 callback下方警告框显示回调，必须执行，否则会有旋转图标出现
			* */
      let checkName = (rule, value, callback) => {
        let form = this.formInfo;
        if (!value) { //空
          return callback(new Error('账号不可为空'));
        } else if (!emailRegCheck(value) && !phoneRegCheck(value)) {
          return callback(new Error('请输入正确的账号格式'));
        } else {  //判断是否有此账户，有则自动填写信息
          if (this.setting.isAutoCheckAccount && this.setting.functionOfThisPage === 'addUser') {
            getPartOfUserInfo({
              accountName: value
            }).then(res => {
              if (res.code === 200) {
                if (res.data) {
                  form.isSystem = res.data.isSystem + '';
                  form.deptName = res.data.deptName;
                  form.nickName = res.data.nickName;
                  form.trueName = res.data.trueName;
                } else {
	                form.isSystem = ''; //没有的权限要清除
                  form.deptName = '';
                  form.nickName = '';
                  form.trueName = '';
                }
              }
            });
          }
          callback();
        }
      };
      /*---------------------------------------- 数据 ----------------------------------------*/
      return {
        checked: true,
        setting: {  //页面设置
          functionOfThisPage: 'addUser',  //此页的功能，有addUser和editUser可选
          isDialogBoxVisible: false,  //取消按钮的对话框
          isSystem: '', //当前操作用户的身份
          isAutoCheckAccount: true,  //自动检测账户是否存在
          isSystemList: [//角色列表
            {name: '企业管理员', val: '38', exist: true},
            {name: '普通管理员', val: '39', exist: true},
            {name: '普通用户', val: '40', exist: true}
          ], //可以添加角色列表
          isRoomBlockCanShow: false,
          isAllCheckboxChecked: false,  //是否全部区域勾上
          isNameInputDisabled: false,  //是否可以编辑用户帐号
        },
        formInfo: {  //添加的用户表单
          name: '',
          isSystem: '',
          nickName: '',
          trueName: '',
          deptName: '',
          officeId: '',
          officeList: null,
        },
        formInfoOrigin: null, //用户表单的复制品，用于判断离开时，知道页码是否编辑过
        formPower: {
          room: null,
          roomPowered: null,
        },
        rules: {  //element默认表单验证
          name: {validator: checkName, trigger: 'blur', required: true,},
          officeId: {required: true, message: '请选择办公室', trigger: 'change'},
          isSystem: {required: true, message: '请选择角色', trigger: 'change'},
          nickName: {min: 1, max: 32, message: '长度在1到32个字符', trigger: 'blur'},
          trueName: {min: 1, max: 32, message: '长度在1到32个字符', trigger: 'blur'},
          deptName: {min: 1, max: 32, message: '长度在1到32个字符', trigger: 'blur'},
        }
      }
    },
    /*---------------------------------------- 启动运行 ----------------------------------------*/
    mounted() {
      this.pageFunctionSelect();  //首先选择页面的功能
      this.getUserPowerAndSetSelect();
      this.getAllOfficesAndDevice();
    },
    methods: {
      /*---------------------------------------- 绑定函数 ----------------------------------------*/
      /*  角色选择
      * */
      isSystemChange(val) {
        //普通用户才需要设置权限，普通管理员可以拥有全部权限
        this.setting.isRoomBlockCanShow = (val === this.setting.isSystemList[2].val);
      },
      /*  办公室选择
			* @param val办公室的id
			* */
      officeChange(val) {
        //获取下面的区域，填写到列表中。如果已经获取过列表，则不用赋值，用早前的数据，那是用户已经有的权限数据。
        let oldOfficeId = this.$route.query.officeId; //是修改的话，这些是有的。新建用户则没有
        if (this.formPower.roomPowered && (val === oldOfficeId)) {  //已有权限，用权限
          this.formPower.room = this.formPower.roomPowered;
        } else {
          getAreaAndItsDevice({ //还没有权限，用获取的数据
            officeId: val
          }).then(res => {
            if (res.code === 200) {
              this.formPower.room = res.data;
            }
          });
        }
      },
      /*  确定按钮，提交表单
			*   @param form需要处理的表单对象，element规定的
			* */
      submitClick(form) {
        let formInfo = this.formInfo;
        let formPower = this.formPower;
        this.setting.isAutoCheckAccount = false;  //先关闭账户已存在检测
        let oldOfficeId = this.$route.query.officeId; //是修改的话，这些是有的。新建用户则没有
        let userId = this.$route.query.id;
        //
        this.$refs[form].validate((valid) => {  //element默认全部校验方法，校验基本信息表单
          if (valid) {    //校验都通过
            let param = {
              accountName: formInfo.name,
              deptName: formInfo.deptName,
              isSystem: formInfo.isSystem,
              nickName: formInfo.nickName,
              officeId: formInfo.officeId,
              oldOfficeId: oldOfficeId,
              roomDeviceList: formPower.room,
              trueName: formInfo.trueName,
              userId: userId,
            };
            addOrEditUser(param).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: res.data,
                  type: 'success'
                });
                let timer = setTimeout(() => {
                  this.$router.push({path: '/UserManager'});//离开
                }, 1000);
              }
            });
          }
          this.setting.isAutoCheckAccount = true;  //先关闭账户已存在检测
        });
      },
      /*  取消按钮点击
			* */
      cancelClick() {
        let isFormInfoChanged = false;  //是否改变
        for (let key in this.formInfo) {
          let val = this.formInfo[key];
          let valOrigin = this.formInfoOrigin[key];
          if (val !== valOrigin && key !== 'officeList') {  //有一个变了
            isFormInfoChanged = true;
            break;
          }
        }
        if (isFormInfoChanged) {
          this.setting.isDialogBoxVisible = true; //提示是否离开
        } else {
          this.$router.push({path: '/UserManager'});//没改动直接离开
        }
      },
      /*  ‘全部’checkbox点击改变，全部区域和设备勾选/不勾
			* @param index框的序号 $el事件
			 */
      allCheckboxChange(index, $event) {
        let isChecked = this.setting.isAllCheckboxChecked;
        let roomList = this.formPower.room;
        if (roomList) {
          //遍历全部
          roomList.forEach((room, idx) => {
            room.checked = isChecked;
            //设备遍历
            room.deviceList.forEach((device, idx) => {
              device.checked = isChecked;
            });
          });
        }
      },
      /*  改变区域选框，区域下设备全勾/全不勾
      * @param index序号 $el事件
			* */
      roomSubCheckboxChange(index, $event) {
        let roomList = this.formPower.room;
        let isChecked = roomList[index].checked;
        //勾选则全部设备勾选/不勾选
        roomList[index].deviceList.forEach((item, idx) => {
          item.checked = isChecked;
        });
        this.checkAllCheckbox();  //全部检查
      },
      /*  改变设备选框
      * @param index序号 $el事件
			* */
      deviceCheckboxChange(index, $event) {
        this.checkAllCheckbox();  //全部检查
      },
      /*---------------------------------------- 自定义函数 ----------------------------------------*/
      /*  根据url信息判断页面的功能
      * */
      pageFunctionSelect() {
        let officeId = this.$route.query.officeId; //是修改的话，这些是有的。新建用户则没有
        let userId = this.$route.query.id;
        //包含id，说明是用户编辑功能，填充用户信息
        if (userId && officeId) {
          this.setting.functionOfThisPage = 'editUser';
          //获取当前编辑用户
          getUserInfo({
            userId: userId,
            officeId: officeId
          }).then(res => {
            if (res.code === 200) {
              let data = res.data;
              let formInfo = this.formInfo;
              let formPower = this.formPower;
              this.setting.isNameInputDisabled = true;
              //
              formInfo.name = data.accountName;
              formInfo.isSystem = data.isSystem + '';
              formInfo.nickName = data.nickName;
              formInfo.trueName = data.trueName;
              formInfo.deptName = data.deptName;
              formInfo.officeId = data.officeId;
              formPower.room = data.roomDeviceList;
              formPower.roomPowered = data.roomDeviceList;  //已有权限列表的保存
              this.formInfoOrigin = JSON.parse(JSON.stringify(formInfo));  //保存当前表单
            }
          });
        } 
        //否则是用户添加功能
        else {
          this.formInfoOrigin = JSON.parse(JSON.stringify(this.formInfo));  //保存当前表单
        }
      },
      /*  检测所有区域和设备，进行判断修改checkbox
			* */
      checkAllCheckbox() {
        let allDeviceCheckedRoomCnt = 0;  //全部设备都有勾上的区域数量
        let roomList = this.formPower.room;
        //遍历区域
        roomList.forEach((room, idx) => {
          //设备遍历
          let deviceOfRoomCheckedCnt = 0;  //区域下设备没有勾选数量
          room.deviceList.forEach((device, idx) => {
            if (device.checked) { //有一个勾上，就把区域勾上，
              //room.checked = true;
              deviceOfRoomCheckedCnt++;
            } else {  //有一个没勾上，就把全部去掉
              this.setting.isAllCheckboxChecked = false;
            }
          });
          if (deviceOfRoomCheckedCnt === room.deviceList.length) {  //都勾上了
            room.checked = true;
            allDeviceCheckedRoomCnt++;
          } else if (deviceOfRoomCheckedCnt === 0) {  //都没勾上
            room.checked = false;
          } else {  //部分勾上
            room.checked = true;
          }
        });
        this.setting.isAllCheckboxChecked = (allDeviceCheckedRoomCnt === roomList.length); //全部区域勾选
      },
      /*  获取并填充办公室列表和办公区域列表
			* */
      getAllOfficesAndDevice() {
        //全部办公室
        getAllOffice().then(res => {
          if (res.code === 200) {
            this.formInfo.officeList = res.data;
          }
        })
      },
      /*  操作用户权限设置
			* */
      getUserPowerAndSetSelect() {
        let isSystem = sessionStorage.getItem('isSystem');
        this.setting.isSystem = isSystem;
        let setting = this.setting;
        //可操作的用户：企管最高，普管可以添加普通用户，普通用户不允许进入此页面
        if (isSystem === setting.isSystemList[0].val) {
          setting.isSystemList[0].exist = false;
        } else if (isSystem === setting.isSystemList[1].val) {
          setting.isSystemList[0].exist = false;
          setting.isSystemList[1].exist = false;
        } else {
          setting.isSystemList = [];
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
	/*大块，以及公用样式*/
	.block {
		padding: 22px;
		width: 100%;
		overflow: hidden;
		h2 {
			line-height: 1.1;
			font-size: 20px;
			margin-bottom: 56px;
			color: #121212;
		}
	}

	/*按钮组*/
	.btn-group {
		width: 470px;
		margin: 50px auto 0;
		button {
			width: 200px;
			margin: 0 15px;
		}
	}

	/*input标签修改*/
	.my-input {
		width: 410px !important;
		position: absolute;
	}

	/*基本信息*/
	.info {
		form {
			width: 600px;
			margin: 0 auto;
			overflow: visible;
		}
	}

	/*办公权限*/
	.power {
		form {
			width: 1020px;
			margin: 0 auto;
		}

		/*办公室列表*/
		&-office-list {
			$subListWidth: 230px;
			/*主菜单*/
			&-main {
				li {
					margin-bottom: 16px;
				}
			}
			/*子菜单*/
			&-sub {
				margin-left: 40px;
				width: $subListWidth*4;
				overflow: hidden;
				li {
					float: left;
					width: 230px;
					height: 40px;
					margin-bottom: 0;
				}
			}
		}
	}
</style>
