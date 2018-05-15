<template>
  <section>
    <!--顶部按钮-->
    <div class="navHeadBtns" v-if="deviceType != 11">
      <el-button @click="addTiming">添加定时任务</el-button>
    </div>

    <el-form :label-position="labelPosition" label-width="200px">

      <el-row class="cardStyle" >
        <el-row :gutter="20">
          <el-col :offset="2" :span="8">
            <el-form-item label="在线状态：">
              {{ this.Online_formatter(this.Online) }}
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="8">
            <el-form-item label="当前状态：">
              <template v-if="deviceType!=4 && deviceType!=8 && deviceType!=34 && deviceType!=35 && deviceType!=42">
                  {{ this.status_formatter(this.status) }}
                  <el-switch v-model="switchValue" on-text="" off-text="" @change="switchBtn" on-color="#00d58c" v-if="this.status != -2"></el-switch>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>



    <el-row class="card_head" type="flex" align="middle">设备信息</el-row>
    <el-row class="device_Info cardStyle" v-if="this.deviceType == 5">

            <!-- <el-row class="device_Info_content cardStyle"> -->

        <el-row :gutter="20">
          <el-col :offset="2" :span="9">
            <el-form-item label="红外转发器名称：" class="is-required">
              <el-col :span="21" style="padding:0 12px 0 0;">
                <el-input v-model="parentDeviceName" placeholder="请输入红外转发器名称"></el-input>
              </el-col>
              <el-col :span="3">
                <el-button @click="toParent">查看</el-button>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备名称：" prop="name" class="is-required">

              <el-input v-model="deviceName" placeholder="请输入设备名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row :gutter="20">
          <el-col :offset="2" :span="8">
            <el-form-item label="设备类型：" class="is-required">

              <el-select v-model="selector.deviceType" filterable placeholder="请选择设备类型">
                <el-option v-for="item in device_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="12">
            <el-form-item label="设备功率：" class="is-required">

                <!--如果为空开、窗帘、红外转发器则隐藏-->
                <template v-if="deviceType!=64 && this.deviceType!=4 && this.deviceType!=8 && this.deviceType!=34 && this.deviceType!=35 && this.deviceType!=42">
                  <el-col :span="15" style="padding:0 22px 0 0;">
                    <el-input v-model="devicePower" placeholder="请输入设备功率" min="0" :disabled="this.deviceType==11"></el-input>
                  </el-col>
                  <span :span="4">W</span>
                </template>
            </el-form-item>
          </el-col>
        </el-row>


        <!--如果为空开则显示-->
        <el-row :gutter="20" v-if="deviceType==64">
          <el-col :offset="2" :span="8">
            <el-form-item label="禁止控制电源：">
              <el-radio-group v-model="radio" class="radioBtn" @change="chooseKKRadio">
                <el-radio class="radio" label="True">是</el-radio>
                <el-radio class="radio" label="False">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="12">
            <el-form-item label="电流阈值：">
            <el-col :span="15" style="padding:0 18px 0 0;">
              <el-input v-model="currentThreshold" placeholder="请输入2-25A之间的电流阈值" type="number" min="2" max="25"></el-input>
            </el-col>
            <span :span="4">A</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :offset="2" :span="8">
            <el-form-item label="办公室：" class="is-required">

              <el-input v-model="officeType" placeholder="请输入办公室" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="8">
            <el-form-item label="办公区域：" class="is-required">

              <el-select v-model="selector.areaType" filterable placeholder="请选择办公区域" :disabled="deviceType==5">
                <el-option v-for="item in area_options" :key="item.roomId" :label="item.roomName" :value="item.roomId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

    </el-row>
    <el-row class="device_Info cardStyle" v-if="this.deviceType != 5">

            <!-- <el-row class="device_Info_content cardStyle"> -->

          <el-row :gutter="20">
            <el-col :offset="2" :span="8">
              <el-form-item label="设备名称：" prop="name" class="is-required">

                <el-input v-model="deviceName" placeholder="请输入设备名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="8">
              <el-form-item label="设备类型：" class="is-required">

                <el-select v-model="selector.deviceType" filterable placeholder="请选择设备类型">
                  <el-option v-for="item in device_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>


        <el-row :gutter="20">
          <el-col :offset="2" :span="8">
            <el-form-item label="设备型号：">
              <el-input v-model="deviceModel" placeholder="请输入设备型号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="12">
            <el-form-item label="设备功率：" class="is-required">

                <!--如果为空开、窗帘、红外转发器则隐藏-->
                <template v-if="deviceType!=64 && this.deviceType!=4 && this.deviceType!=8 && this.deviceType!=34 && this.deviceType!=35 && this.deviceType!=42">
                  <el-col :span="15" style="padding:0 22px 0 0;">
                    <el-input v-model="devicePower" placeholder="请输入设备功率" min="0" :disabled="this.deviceType==11"></el-input>
                  </el-col>
                  <span :span="4">W</span>
                </template>
            </el-form-item>
          </el-col>
        </el-row>

        <!--如果为空开则显示-->
        <el-row :gutter="20" v-if="deviceType==64">
          <el-col :offset="2" :span="8">
            <el-form-item label="禁止控制电源：">
              <el-radio-group v-model="radio" class="radioBtn" @change="chooseKKRadio">
                <el-radio class="radio" label="True">是</el-radio>
                <el-radio class="radio" label="False">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="12">
            <el-form-item label="电流阈值：">
            <el-col :span="15" style="padding:0 18px 0 0;">
              <el-input v-model="currentThreshold" placeholder="请输入2-25A之间的电流阈值" type="number" min="2" max="25"></el-input>
            </el-col>
            <span :span="4">A</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :offset="2" :span="8">
            <el-form-item label="办公室：" class="is-required">

              <el-input v-model="officeType" placeholder="请输入办公室" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="8">
            <el-form-item label="办公区域：" class="is-required">

              <el-select v-model="selector.areaType" filterable placeholder="请选择办公区域" :disabled="deviceType==5">
                <el-option v-for="item in area_options" :key="item.roomId" :label="item.roomName" :value="item.roomId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

    </el-row>

    <el-row class="device_Info" v-if="subDeviceList && subDeviceList.length > 0">
        <el-row class="card_head" type="flex" align="middle">子设备信息</el-row>
        <el-row class="device_Info_content cardStyle">
          <subDeviceList
            v-for = "subDevice in subDeviceList"
            :key = "subDevice.deviceId"
            :item = "subDevice"
            :subDeviceList = "subDeviceList"
          >
          </subDeviceList>
        </el-row>
    </el-row>

    <el-row class="timing_Task" v-if="timingList.length!==0 && this.deviceType !=5">

      <el-row class="card_head" type="flex" align="middle">定时任务</el-row>

      <timingTask v-for="(item, index) in timingList" :key="index" :item="item" @remove="removeTim(item,index)"></timingTask>

    </el-row>

    <el-row class="timing_Task" v-if="timingList.length!==0 && this.deviceType ==5">

      <el-row class="card_head" type="flex" align="middle">定时任务</el-row>

      <timingAirConditionInfrared v-for="(item, index) in timingList" :key="index" :item="item" @remove="removeTim(item,index)" :learned="learnedAir" :deviceId="deviceId"></timingAirConditionInfrared>

    </el-row>


    <el-row type="flex" justify="center">
      <el-col :span="4" class="confirmBtn">
        <el-button type="info" @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="confirmY">确定</el-button>
      </el-col>
    </el-row>

    </el-form>
  </section>
</template>

<script>
  import { deviceDetail, switchDevice, getArea, checkKKPower, powerKKOnOff, saveDeviceInfo, deleteTim } from '../../../api/api';
  import timingTask from './timingTask'
  import timingAirConditionInfrared from './timingAirConditionInfrared'
  // import timingAirConditionInfrared from './timing'
  import subDeviceList from './subDeviceList'
  export default {
    name: "DeviceDetail",
    components:{
      timingTask,
      timingAirConditionInfrared,
      subDeviceList
    },
    data() {
      return {
        labelPosition: 'right',
        deviceId:'',
        status:'',
        Online:'',
        device_options: [
          {
            "value": "0",
            "label": "照明灯"
          },
          {
            "value": "1",
            "label": "空调"
          },
          {
            "value": "2",
            "label": "饮水机"
          },
          {
            "value": "3",
            "label": "打印机"
          },
          {
            "value": "4",
            "label": "投影仪"
          },
          {
            "value": "5",
            "label": "窗帘"
          },
          {
            "value": "6",
            "label": "待机设备"
          }
        ],
        area_options: [],
        selector: {
          deviceType: '',
          areaType: '',
        },
        parentDeviceId:'',
        parentDeviceName:'',
        deviceName:'',
        deviceModel:'',
        devicePower:'',
        officeType:'',
        officeId:'',
        switchValue: true,
        //判断是否为空开
        deviceType:'',
        radio: 'False',
        currentThreshold:'',
        timingList:[],
        subDeviceList:[],
        timingAirList:[
            {
                "timingId": "cdbc6455a6954fc2ab080d29b32f5efe",
                "order_t": "311006",
                "value1": 0,
                "value2": 0,
                "value3": 0,
                "value4": 0,
                "hour": 14,
                "minute": 25,
                "second": 0,
                "week": 0,
                "weekName": [ ],
                "openStatus": "0",
                "temp": "",
                status:'',
                mode:'',
                temperature:'',
                windSpeed:'',
                windDirection:'',
                command:''
            }
        ],
        learnedAir:{},
      }
    },
    created(){
      this.getDetail();
    },
    methods:{
      removeTim(item,index){
      //  console.log(item.timingId);
        if(item.timingId){
          let para = {
            "timingId": item.timingId,
            "deviceId": this.deviceId
          };
          deleteTim(para).then((res) =>{
            if(res.code == 200){
              this.timingList.splice(index, 1);
            }
          }).catch(function (error) {
            console.log(error);
          });
        }else{
          this.timingList.splice(index, 1);
        }
      },
      confirmY(){
        if(this.deviceName.trim() == ''){
          this.$message({
            message: '设备名称不能为空！',
            type: 'warning'
          });
        }else if(this.deviceType!=5 && !this.selector.deviceType || this.selector.deviceType == ''){
          this.$message({
            message: '设备类型不能为空！',
            type: 'warning'
          });
        }else if(this.deviceType==64 && this.currentThreshold < 2 || this.currentThreshold > 25 || (this.currentThreshold + '').indexOf('.') != -1){
          this.$message({
            message: '请输入2-25A之间的整数电流阈值！',
            type: 'warning'
          });
        }else if(this.deviceType!=64 && this.deviceType!=4 && this.deviceType!=8 && this.deviceType!=34 && this.deviceType!=35 && this.deviceType!=42 && this.deviceType!=11 && (this.devicePower.trim() == '' ||  isNaN(Number(this.devicePower)) || Number(this.devicePower) > 100000)){
          if(this.devicePower.trim()  == ''){
            this.$message({
              message: '设备功率不能为空！',
              type: 'warning'
            });
          }else if(isNaN(Number(this.devicePower))){
            this.$message({
              message: '设备功率格式不正确！',
              type: 'warning'
            });
          }
          else if(!isNaN(Number(this.devicePower)) && Number(this.devicePower) > 100000){
            this.$message({
              message: '设备功率不能超过100000！',
              type: 'warning'
            });
          }
        }else if(this.deviceType!=64 && this.deviceType!=4 && this.deviceType!=8 && this.deviceType!=34 && this.deviceType!=35 && this.deviceType!=42 && Number(this.devicePower) < '0'){
          // console.log(typeof this.devicePower);
          this.$message({
            message: '设备功率不能为负数！',
            type: 'warning'
          });
        }else if(this.selector.areaType == '' && this.deviceType!=5){
          this.$message({
            message: '办公区域不能为空！',
            type: 'warning'
          });
        }else {
          for(let i = 0; i < this.timingList.length; i++){
            if(this.timingList[i].temp == ''){
              this.$message({
                message: '定时时间不能为空！',
                type: 'warning'
              });
              return;
            }
          }

          for(let i = 0; i < this.timingList.length; i++){
//            console.log(this.timingList[i].temp);
            this.timingList[i].hour = this.timingList[i].temp.getHours();
            this.timingList[i].minute = this.timingList[i].temp.getMinutes();
          }

          if(this.deviceType == 11 ){
            let hasSubDeviceName = this.subDeviceList.some(item=>{
              return item.deviceName.trim() == ""
            });
            let hasSubDevicePowerEmpty = this.subDeviceList.some(item=>{
              return item.power.trim() == ""
            });
            let hasSubDevicePowerNegative = this.subDeviceList.some(item=>{
              return Number(item.power) < 0
            });
            let hasSubDevicePowerNumber = this.subDeviceList.some(item=>{
              return isNaN(Number(item.power))
            });
            let hasSubDevicePowerOverload = this.subDeviceList.some(item=>{
              return !isNaN(Number(item.power)) && Number(item.power) > 100000
            });
            if(hasSubDeviceName){
              this.$message({
                message: '子设备名称不能为空！',
                type: 'warning'
              });
              return false;
            }else if(hasSubDevicePowerEmpty){
              this.$message({
                message: '子设备功率不能为空！',
                type: 'warning'
              });
              return false;
            }else if(hasSubDevicePowerNegative){
              this.$message({
                message: '子设备功率不能为负数！',
                type: 'warning'
              });
              return false;
            }else if(hasSubDevicePowerNumber){
              this.$message({
                message: '子设备功率格式不正确！',
                type: 'warning'
              });
              return false;
            }else if(hasSubDevicePowerOverload){
              this.$message({
                message: '子设备功率不能超过100000！',
                type: 'warning'
              });
              return false;
            }
          }

          if(this.deviceType == 5 ){
            let hasCommand = this.timingList.some(item=>{
              return item.command == ""
            });
            if(hasCommand){
              this.$message({
                message: '定时动作不能为空！',
                type: 'warning'
              });
              return false;
            }else if(this.parentDeviceName.trim() == '' ){
              this.$message({
                message: '红外转发器名称不能为空！',
                type: 'warning'
              });
              return false;
            }
          }


          let para = {};
          if(this.deviceType == 64){
            para = {
              "deviceId": this.deviceId,
              "deviceName": this.deviceName,
              "type": this.selector.deviceType,
              "roomId": this.selector.areaType,
              "deviceModel": this.deviceModel,
              "electri": this.currentThreshold,
              "timingList": this.timingList
            };
          }else if(this.deviceType == 11){
            para = {
              "deviceId": this.deviceId,
              "deviceName": this.deviceName,
              "type": this.selector.deviceType,
              "roomId": this.selector.areaType,
              "deviceModel": this.deviceModel,
              "electri": this.currentThreshold,
              "deviceSubList": this.subDeviceList
            };
          }else if(this.deviceType == 5){
            para = {
              "deviceId": this.deviceId,
              "parentDeviceId": this.parentDeviceId,
              "parentDeviceName": this.parentDeviceName,
              "deviceName": this.deviceName,
              "type": this.selector.deviceType,
              "power": this.devicePower,
              "roomId": this.selector.areaType,
              "deviceModel": this.deviceModel,
              "timingList": this.timingList,
            };
          }else if(this.deviceType==4 && this.deviceType==8 && this.deviceType==34 && this.deviceType==35 && this.deviceType==42){
            para = {
              "deviceId": this.deviceId,
              "deviceName": this.deviceName,
              "type": this.selector.deviceType,
              "roomId": this.selector.areaType,
              "deviceModel": this.deviceModel,
              "timingList": this.timingList
            };
          }else {
            para = {
              "deviceId": this.deviceId,
              "deviceName": this.deviceName,
              "type": this.selector.deviceType,
              "power": this.devicePower,
              "roomId": this.selector.areaType,
              "deviceModel": this.deviceModel,
              "timingList": this.timingList
            };
          }

          saveDeviceInfo(para).then(data=>{
            let {code} = data;
            if(code != 200){
              this.$message({
                message:data.msg,
                type:'error'
              });
              // console.log(data.data);
            }else {
              this.$message({
                message:data.data,
                type:'success'
              });
              setTimeout(()=>{
                // this.$router.push('/DeviceList');
                this.$router.go(-1);
              },1000);

            }
          }).catch(error=>{
            console.log(error);
          });
        }
      },
      //添加定时任务
      addTiming(){
//        console.log(this.timingList);
        let timItem = {
          "hour": '',
          "minute": '',
          "temp":'',
          "openStatus": "0",
          "weekName":[],
          "command":'',
          "status":'',
          "mode":'',
          "temperature":'',
          "windSpeed":'',
          "windDirection":'',
        };
        this.timingList.push(timItem);
      },
      chooseKKRadio(){
//        console.log(this.radio);
        let para = {
          "isEnable": this.radio,
          "deviceId": this.deviceId
        };
        powerKKOnOff(para).then((res) =>{

        }).catch(function (error) {
          console.log(error);
        });
      },
      //查询空开是否禁止关闭电源
      checkKK(){
        let para = {
          "deviceId": this.deviceId
        };
        checkKKPower(para).then((res) =>{
          if(res.code == 200){
            this.radio = res.data.enable_shutdown;
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      //选择办公区域
      areaDropDown(){
        let para = { "officeId": this.officeId };
        getArea(para).then((res) =>{
          this.area_options = res.data;
//          console.log(res.data.officeList);
        }).catch(function (error) {
          console.log(error);
        });
      },
      switchBtn(){
        // console.log('当前状态'+this.switchValue);
        if(this.deviceType == 64 && this.radio == 'True'){
          this.$alert('抱歉，您已禁止控制电源，如需控制，请将“禁止控制电源”设置为“否”。', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {
              // console.log('是空开，这里是返回函数取反前'+this.switchValue);
              this.switchValue = !this.switchValue;
              // console.log('是空开，这里是返回函数'+this.switchValue);
            }
          });
          // console.log('是空开，并且是禁止控制电源');
        }else{
          this.switchValue = !this.switchValue;
          // console.log('传参前状态'+this.switchValue);
          let statusVal =  { "true": 0, "false": 1 }[this.switchValue];
          // console.log('传参'+statusVal);
          let para = {
            "deviceId": this.deviceId,
            "status": statusVal
          };
          switchDevice(para).then((res) => {
          //  console.log(res);
            if(res.code == 200){
              setTimeout(() =>{
                this.getDetail();
              },1000);
                // console.log('状态200时的开关按钮状态'+this.switchValue);
                // console.log('状态200');
            }else{
              // console.log('页面交互不是200');
              this.switchValue = !this.switchValue;
            }
          }).catch(function (error) {
            console.log(error);
          });
        }
      },
      //当前状态转换
      status_formatter(status){
        let Status  = { "0":"开启中", "1":"关闭中","-2":"--" }[status];

        return Status;
      },
      //在线状态转换
      Online_formatter(Online){
        let online  = { "0":"离线", "1":"在线","-2":"--" }[Online];

        return online;
      },
      getDetail(){
        // this.deviceId = JSON.parse(sessionStorage.getItem('deviceId'));
        this.deviceId = this.$route.query.id;;
        let para = {
          "deviceId": this.deviceId
        };
        deviceDetail(para).then((res) =>{
          if(res.code == 200){
          //  console.log(res.data);
            this.status = res.data.deviceInfo.status;
            this.Online = res.data.deviceInfo.online;
            this.switchValue = { "0": true, "1": false }[this.status];
            this.parentDeviceId  = res.data.deviceInfo.parentDeviceId;
            this.parentDeviceName = res.data.deviceInfo.parentDeviceName;
            this.deviceName = res.data.deviceInfo.deviceName;
            this.selector.deviceType = res.data.deviceInfo.office_device_type;
            this.deviceModel = res.data.deviceInfo.device_model;
            //判断空开
            this.deviceType = res.data.deviceInfo.deviceType;
            if(this.deviceType != 64){
              this.devicePower = res.data.deviceInfo.power_rate;
            }else if(this.deviceType == 64){
              this.checkKK();
              this.currentThreshold = res.data.deviceInfo.electric_value;
            }
            this.officeType = res.data.deviceInfo.familyName;
            this.officeId = res.data.deviceInfo.familyId;
            this.areaDropDown();
            this.selector.areaType = res.data.deviceInfo.roomId;
            this.timingList = res.data.timingList;
            this.learnedAir = res.data.learnedAir;
            this.subDeviceList = res.data.deviceInfo.deviceSubList;
          }else if(res.code == 500){
            this.$router.push('/DeviceEnergy');
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      toParent(){
        this.$router.push({path:'/DeviceList/DeviceDetail',query:{id:this.parentDeviceId}});
        this.getDetail();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cardStyle{
    padding: 40px 0 30px 0 ;
    margin-bottom: 30px;
  }
  .gap{
    margin-bottom: 50px;
  }
  .radioBtn{
    width: 90%;
    display: flex;
    float: right;
    justify-content: space-around;
  }
  .confirmBtn{
    display: flex;
    justify-content: space-around;
    .el-button{
      width: 36%;
    }
  }
  .card_head{
    font-size: 14px;
    color: #32323b;
    margin-bottom: 1em;
    &:before{
      content: "";
      background: #00d58c;
      width: 4px;
      height: 18px;
      display: inline-block;
      margin-right: 18px;
      margin-left: 8px;
    }
  }
  .device_Info{
    position: relative;
    .redStar{
      color: #f84a51;
      font-size: 16px;
      margin-right: 6px;
      position: absolute;
      top: 0;
      left: -100px;
    }
    .el-input,.el-select{
      width: 100%;
    }
    .el-select{
      width: 100%;
    }
  }
</style>
