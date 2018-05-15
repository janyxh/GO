<template>
  <!-- <form> -->
  <el-row class="device_Info cardStyle">
    <span class="del" @click="$emit('remove')">+</span>


    <el-row :gutter="20">
      <el-col :offset="2" :span="8">
        <el-form-item label="定时时间：" class="is-required">
          
          <el-time-picker v-model="item.temp" format="HH:mm" :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"></el-time-picker>
        </el-form-item>
      </el-col>
      <el-col :offset="1" :span="13">
        <el-form-item label="执行频率：">
          <el-checkbox-group v-model="item.weekName" fill="#00d58c">
            <el-checkbox-button v-for="fr in frequency" :label="fr.value" :key="fr.value">{{fr.label}}</el-checkbox-button>
          </el-checkbox-group>
         
        </el-form-item>
       
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :offset="2" :span="8">
        <el-form-item label="设备开关：">
          <el-radio-group v-model="item.status" class="radioBtn" @change="changStatus(item.status)">
            <el-radio class="radio" label="311011" :disabled="!learned.status.open">开启</el-radio>
            <el-radio class="radio" label="311004" :disabled="!learned.status.shutdown">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :offset="1" :span="8">
        <el-form-item label="模式：">
          <el-select v-model="item.mode" placeholder="请选择模式" @change="changMode(item.mode)">
            <el-option
              v-for="item in learned.mode.learningList"
              :key="item.command"
              :label="item.name"
              :value="item.command">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :offset="2" :span="8">
        <el-form-item label="温度：">
          <el-select v-model="item.temperature" placeholder="请选择温度" @change="changTemp(item.temperature)">
            <el-option
              v-for="item in learned.temperature.learningList"
              :key="item.command"
              :label="item.name"
              :value="item.command">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :offset="1" :span="8">
        <el-form-item label="风速：">
        <el-radio-group v-model="item.windSpeed" fill="#00d58c" @change="changSpeed(item.windSpeed)">
          <el-radio-button class="radio" label="311005" :disabled="!learned.windSpeed.lowwind">低速</el-radio-button>
          <el-radio-button class="radio" label="311006" :disabled="!learned.windSpeed.wind">中速</el-radio-button>
          <el-radio-button class="radio" label="311007" :disabled="!learned.windSpeed.highwind">高速</el-radio-button>
        </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :offset="2" :span="8">
        <el-form-item label="风向：">
          <el-radio-group v-model="item.windDirection" fill="#00d58c" @change="changDirection(item.windDirection)">
            <el-radio-button class="radio" label="311009" :disabled="!learned.windDirection.autowind">自动摆风</el-radio-button>
            <el-radio-button class="radio" label="311010" :disabled="!learned.windDirection.stopwind">停止摆风</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

  </el-row>
</template>

<script>
  export default {
    name: "timingAir",
    props: ['item','learned','deviceId'],
    data() {
      return {
        frequency: [
          {
            "value": 1,
            "label": "一"
          },
          {
            "value": 2,
            "label": "二"
          },{
            "value": 3,
            "label": "三"
          },
          {
            "value": 4,
            "label": "四"
          },{
            "value": 5,
            "label": "五"
          },
          {
            "value": 6,
            "label": "六"
          },{
            "value": 7,
            "label": "日"
          }
        ],
        task:{
          status:'',
          mode:'',
          temperature:'',
          windSpeed:'',
          windDirection:''
        },
        temperatureList:[]
      }
    },
    created(){
      if(this.item.hour){
        this.item.temp = new Date(2017, 7, 10, this.item.hour, this.item.minute);
      }
    },
    methods:{
      changStatus(val){
        this.item.mode = '';
        this.item.temperature = '';
        this.item.windSpeed = '';
        this.item.windDirection = '';
        if(val != ''){
          this.task.status = val;
          setTimeout(()=>{
            this.item.status = this.task.status;
            this.item.command = this.task.status;
            console.log(this.item);
          },10);
        }
      },
      changMode(val){
        this.item.status = '';
        this.item.temperature = '';
        this.item.windSpeed = '';
        this.item.windDirection = '';
        if(val != ''){
          this.task.mode = val;
          setTimeout(()=>{
            this.item.mode = this.task.mode;
            this.item.command = this.task.mode;
            // console.log(this.item);
          },10);
        }
      },
      changTemp(val){
        this.item.status = '';
        this.item.mode = '';
        this.item.windSpeed = '';
        this.item.windDirection = '';
        if(val != ''){
          this.task.temperature = val;
          setTimeout(()=>{
            this.item.temperature = this.task.temperature;
            this.item.command = this.task.temperature;
            console.log(this.item);
          },10);
        }
      },
      changSpeed(val){
        this.item.status = '';
        this.item.mode = '';
        this.item.temperature = '';
        this.item.windDirection = '';
        if(val != ''){
          this.task.windSpeed = val;
          setTimeout(()=>{
            this.item.windSpeed = this.task.windSpeed;
            this.item.command = this.task.windSpeed;
            console.log(this.item);
          },10);
        }
      },
      changDirection(val){
        this.item.status = '';
        this.item.mode = '';
        this.item.temperature = '';
        this.item.windSpeed = '';
        if(val != ''){
          this.task.windDirection = val;
          setTimeout(()=>{
            this.item.windDirection = this.task.windDirection;
            this.item.command = this.task.windDirection;
            console.log(this.item);
          },10);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
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
  }
  .gap{
    margin-bottom: 50px;
  }
  .radioBtn{
    width: 100%;
    display: flex;
    float: right;
    margin-top: 10px;
    justify-content: space-around;
  }
  .cardStyle{
    padding: 40px 0;
    margin-bottom: 30px;
    .del{
      float: right;
      margin: -30px 16px 0 -40px;
      display: inline-block;
      color: #f84a51;
      font-size: 30px;
      font-weight: 700;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      cursor: pointer;
    }
    .el-date-editor{
      width: 100%;
    }
    .el-select{
      width: 100%;
    }
  }
</style>
