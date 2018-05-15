<template lang="html">
  <div class="singleOffice">
      <el-row>
          <el-col style="width:185px;">
            <img :src="data.pic" class="officePic" alt="办公室图片" v-if="data.pic">
            <img src="../../../assets/img/office.png" class="officePic" alt="办公室图片" v-if="!data.pic">
          </el-col>
          <el-col :span="18">
            <p class="p-office-name">{{data.familyName}}</p>
            <p class="span-area">共{{data.count}}<span v-if="!data.count">0</span>个区域</p>
            <p class="btns-office">
              <el-button type="primary" v-on:click="editOffice">修改</el-button>
              <el-button  v-on:click="deleteOffice" >删除</el-button>
            </p>
          </el-col>
      </el-row>
      <hr class="hr-office" />
      <ul class="roomList">
          <roomList
          v-for="room in data.roomList"
          :key="room.roomid"
          :room = "room"
          :refresh = "getOfficeInfo"
          @sendRoomId="showRoomInfo">
          </roomList>
          <li @click="addArea(officeId)">
              <p class="el-icon-plus add"></p>
              <p>添加区域</p>
          </li>
      </ul>
      <el-dialog title="区域" :visible.sync="dialogFormVisible" @close="closeRommInfo">
        <el-form :model="editRoomform" :rules="rules" ref="ruleForm">
          <el-form-item label="区域名：" :label-width="formLabelWidth">
            <el-input v-model="editRoomform.roomName" auto-complete="off" :maxlength="32" style="width:315px;"></el-input>
          </el-form-item>
        </el-form>
        <el-row>
          <label class="text-right" style="width:185px; line-height: 1;padding-top: 11px;display:block; float:left;">
            区域设备：
          </label>
          <el-col :span="12">
            <deviceList
            v-for = "device in editRoomform.deviceList"
            :key = "device.deviceId"
            :item = "device"
            :office = "office"
            @sendDeviceId = "removeRoomDevice">
            </deviceList>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelRoomInfo">取 消</el-button>
          <el-button type="primary" @click="saveRoomInfo('ruleForm',editRoomform.roomId)">保 存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="添加区域" :visible.sync="dialogFormVisibleAdd" class="dialogAddArea">
        <el-form :model="data">
          <addRoomList
            v-for="(aRoom,index) in roomAll"
            :key="Date.now()"
            :aRoom = "aRoom"
            :index = "index"
            :roomList = "roomAll"
            @handleAddArea="addOneArea"
            @handleMinusArea="minusOneArea">
          </addRoomList>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAddArea">取 消</el-button>
          <el-button type="primary" @click="savaAddArea()">保 存</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { getSingleOfficeInfo, viewRoom, addRoom, editRoom, removeRoomDevice } from '../../../api/api'
import roomList from './RoomList'
import deviceList from './DeviceList'
import addRoomList from './AddRoomList'
export default {
  props: ['officeId', 'officeData'],
  components: {
    roomList,
    deviceList,
    addRoomList
  },
  data() {
    return {
      office: this.officeId,
      dialogFormVisible: false,
      dialogFormVisibleAdd: false,
      editRoomform: {
        roomId: '',
        roomName: '',
        deviceList: []
      },
      addAreaform: [],
      formLabelWidth: '200px',
      data: {
        // pic:'http://pic.58pic.com/58pic/15/35/07/65D58PICt4Q_1024.jpg',
        // familyName:'欧瑞博A7栋7层',
        // count:20,
        // familyId:'393f018905634285b8b1386d2c203695',
        // roomList:[]
      },
      roomAll: [{ 'roomName': '' }],
      rules: {
        name: [
          { required: true, message: '请输入区域名称', trigger: 'blur' },
          { max: 32, message: '不得超过32个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // console.log(this.office);
    this.getOfficeInfo();
  },
  watch: {
    officeData: function (val, oldVal) {
      if (JSON.stringify(val) != JSON.stringify(oldVal)) {
        this.getOfficeInfo();
      }
    }
  },
  methods: {
    // editOfficeCounter() {
    //   this.$emit('editOfficeDemo');
    // },
    editOffice: function () {
      this.$emit('editOffice');
    },
    deleteOffice: function () {
      this.$emit('deleteOffice')
    },
    getOfficeInfo() {
      // console.log(this.officeId);
      let singleOfficeParams = { 'officeId': this.office };
      getSingleOfficeInfo(singleOfficeParams).then(data => {
        let { code } = data;
        if (code !== 200) {
          this.$message({
            message: data.msg,
            type: 'error'
          });
        } else {
          // console.log(data.data);
          this.data = data.data;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    showRoomInfo(roomId) {
      // console.log('编辑事件 '+roomId);
      // this.roomId = roomId;
      let viewParams = { 'roomId': roomId };//'2c8721a5e9fb47689774cc3001572b75'
      viewRoom(viewParams).then(res => {
        let { code } = res;
        if (code != 200) {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        } else {
          this.dialogFormVisible = true;
          // this.editRoomform = res.data;
          this.editRoomform.roomName = res.data.roomName;
          this.editRoomform.roomId = res.data.roomId;
          this.editRoomform.deviceList = res.data.deviceList;
        }
      }).catch(error => {
        console.error(error);
      });
    },
    cancelRoomInfo() {
      this.dialogFormVisible = false;
      this.getOfficeInfo();
    },
    closeRommInfo() {
      this.dialogFormVisible = false;
      this.getOfficeInfo();
    },
    saveRoomInfo(formName, roomId) {
      if (this.editRoomform.roomName.trim() == "") {
        this.$message({
          message: '区域名称不能为空',
          type: 'warning'
        });
        return false;
      } else if (this.editRoomform.roomName.length > 32) {
        this.$message({
          message: '区域名称不能超过32个字节',
          type: 'warning'
        });
        return false;
      }
      else {
        let editParams = { 'roomId': roomId, 'roomName': this.editRoomform.roomName };
        editRoom(editParams).then(res => {
          let { code } = res;
          if (code != 200) {
            this.$message({
              message: res.msg,
              type: 'error'
            });
          } else {
            this.dialogFormVisible = false;
            this.getOfficeInfo();
            this.$message({
              message: res.data,
              type: 'success'
            });
          }
        }).catch(error => {
          console.error(error);
        });
      }
    },
    removeRoomDevice(device) {
      let deviceParams = { 'deviceId': device.deviceId, 'officeId': this.office };
      removeRoomDevice(deviceParams).then(res => {
        let { code } = res;
        if (code != 200) {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        } else {
          this.getOfficeInfo();
          this.editRoomform.deviceList.splice(this.editRoomform.deviceList.indexOf(device), 1);
          this.$message({
            message: res.data,
            type: 'success'
          });
        }
      }).catch(error => {
        console.error(error);
      });
    },
    addArea(officeId) {
      this.dialogFormVisibleAdd = true;
    },
    addOneArea() {
      this.roomAll.push({ 'roomName': '' });
    },
    minusOneArea(index) {
      this.roomAll.splice(index, 1);
    },
    cancelAddArea() {
      this.dialogFormVisibleAdd = false;
      this.roomAll = [{ 'roomName': '' }];
    },
    savaAddArea() {
      let hasNull = this.roomAll.some(item => {
        return item.roomName.trim() == '';
      });
      let hasLong = this.roomAll.some(item => {
        return item.roomName.length > 32;
      });
      if (hasNull) {
        this.$message({
          message: '区域名称不能为空',
          type: 'warning'
        });
        return false;
      } else if (hasLong) {
        this.$message({
          message: '区域名称不能超过32个字节',
          type: 'warning'
        });
        return false;
      } else {
        let roomList = [];
        for (let i = 0; i < this.roomAll.length; i++) {
          let inpName = this.roomAll[i].roomName;
          roomList.push(inpName);
        }

        let addParams = { 'officeId': this.office, 'roomNames': roomList };
        addRoom(addParams).then(res => {
          let { code } = res;
          if (code != 200) {
            this.$message({
              message: res.msg,
              type: 'error'
            });
          } else {
            this.dialogFormVisibleAdd = false;
            this.getOfficeInfo();
            this.roomAll = [{ 'roomName': '' }];
            this.$message({
              message: res.data,
              type: 'success'
            });
          }
        }).catch(error => {
          console.error(error);
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.singleOffice {
  padding: 25px 70px 200px 70px;
  .officePic {
    width: 150px;
    height: 150px;
    border-radius: 6px;
  }
  .p-office-name {
    font-size: 20px;
    padding: 2px 0 10px 0;
    color: #121212;
    height: 24px;
  }
  .span-area {
    font-size: 16px;
  }
  .btns-office {
    margin-top: 55px;
  }
  .hr-office {
    height: 1px;
    background: #f1f1f1;
    border: none;
    margin-top: 40px;
  }
  .roomList {
    padding: 0;
    margin: 0;
    li {
      // display: inline-block;
      float: left;
      list-style: none;
      width: calc(20% - 60px);
      height: 70px;
      font-size: 14px;
      margin-top: 30px;
      padding: 30px 10px 0 10px;
      background: #f7f8fa;
      border-radius: 8px;
      margin-right: 50px;
      text-align: center;
      word-wrap: break-word;
      cursor: pointer;
      position: relative;
    }
    li:nth-of-type(5n) {
      margin-right: 0;
    }
    li:last-child {
      border: 1px dashed #8c8ea2;
      .add {
        font-size: 24px;
        color: #8c8ea2;
      }
    }
    li:hover {
      box-shadow: 0px 20px 30px rgba(51, 51, 51, 0.1);
    }
  }
}
</style>
