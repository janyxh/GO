<template>
  <el-col class="lis" :class="item.value1 ? 'off' : 'on'">
    <el-row class="title" type="flex" justify="center">{{item.deviceName}}</el-row>
    <div class="detail" @click="checkDetail(item)">
      <i class="icon-detail"></i>
      <span>详情</span>
    </div>
    <el-row class="temperature" type="flex" justify="center" align="middle">
      <div class="leftPic" @click="minus(item,getList)"></div>
      <el-col class="tempNum" :span="10">{{item.sTemperature}}°</el-col>
      <div class="rightPic" @click="plus(item,getList)"></div>
      <el-col class="environTemp">环境温度 <span>{{item.eTemperature}}</span>°</el-col>
    </el-row>
    <el-row class="switch" type="flex" justify="center">
      <el-col class="switchBtn" :span="10">
        <el-button size="small" @click="openDevice(item,getList)" :class="{'el-button--primary':!item.value1}">开启</el-button>
        <el-button size="small" @click="closeDevice(item,getList)">关闭</el-button>
      </el-col>
    </el-row>
    <el-row class="model">
      <el-col :span="3">模式</el-col>
      <el-col :span="15" class="btn" >
        <el-button size="small" :disabled="!!item.value1" @click="refrigerate(item,getList)" :class="{'el-button--primary':item.mode==3}">制冷</el-button>
        <el-button size="small" :disabled="!!item.value1" @click="heating(item,getList)" :class="{'el-button--primary':item.mode==4}">制热</el-button>
        <el-button size="small" :disabled="!!item.value1" @click="airExhaust(item,getList)" :class="{'el-button--primary':item.mode==7}">通风</el-button>
      </el-col>
    </el-row>
    <el-row class="speed">
      <el-col :span="3">风速</el-col>
      <el-col :span="15" class="btn" >
        <!-- <el-button size="small" :disabled="!!item.value1" @click="tempAuto(item,getList)" :class="{'el-button--primary':item.innerFanSpeed==0}">自动</el-button> -->
        <el-button size="small" :disabled="!!item.value1" @click="tempBig(item,getList)" :class="{'el-button--primary':item.innerFanSpeed==3}">高</el-button>
        <el-button size="small" :disabled="!!item.value1" @click="tempMiddle(item,getList)" :class="{'el-button--primary':item.innerFanSpeed==2}">中</el-button>
        <el-button size="small" :disabled="!!item.value1" @click="tempSmall(item,getList)" :class="{'el-button--primary':item.innerFanSpeed==1}">低</el-button>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
    import { controlDevice } from '../../../api/api'
    export default {
      name: "airCondition",
      props: ['item','getList'],
      data() {
          return {}
      },
      methods:{
        checkDetail(item){
          let deviceId = item.deviceId;
          // sessionStorage.setItem('deviceId', JSON.stringify(deviceId));
          // this.$router.push('/DeviceDetail');
          this.$router.push({path:'/DeviceList/DeviceDetail',query:{id:deviceId}});
        },
        tempAuto(item,getList){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "innerFanSpeed": 0
          };
          controlDevice(para).then((res) => {
//            console.log(res);
            if(res.code == 200){
              setTimeout(() => {
                getList();
              },1500);
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        tempBig(item,getList){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "innerFanSpeed": 3
          };
          controlDevice(para).then((res) => {
            if(res.code == 200){
              setTimeout(() => {
                getList();
              },1500);
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        tempMiddle(item,getList){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "innerFanSpeed": 2
          };
          controlDevice(para).then((res) => {
            if(res.code == 200){
              setTimeout(() => {
                getList();
              },1500);
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        tempSmall(item,getList){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "innerFanSpeed": 1
          };
          controlDevice(para).then((res) => {
            if(res.code == 200){
              setTimeout(() => {
                getList();
              },1500);
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        airExhaust(item,getList){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "mode": 7
          };
          controlDevice(para).then((res) => {
            if(res.code == 200){
              setTimeout(() => {
                getList();
              },1500);
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        heating(item,getList){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "mode": 4
          };
          controlDevice(para).then((res) => {
            if(res.code == 200){
              setTimeout(() => {
                getList();
              },1500);
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        refrigerate(item,getList){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "mode": 3
          };
          controlDevice(para).then((res) => {
            if(res.code == 200){
              setTimeout(() => {
                getList();
              },1500);
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        openDevice(item,getList){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "status": 0
          };
          controlDevice(para).then((res) => {
            if(res.code == 200){
              setTimeout(() => {
                getList();
              },1500);
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        closeDevice(item,getList){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "status": 1
          };
          controlDevice(para).then((res) => {
            if(res.code == 200){
              setTimeout(() => {
                getList();
              },1500);
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        minus(item,getList){
          if(item.value1 == 0 && item.mode != 7){
            if(item.sTemperature > 16){
              item.sTemperature--;

              //获取设备id
//              console.log(item.deviceId);

              //调用接口
              let para = {
                "deviceId": item.deviceId,
                "sTemperature": item.sTemperature
              };
              controlDevice(para).then((res) => {
                if(res.code == 200){
                  setTimeout(() => {
                    getList();
                  },3000);
                }
              }).catch(function (error) {
                console.log(error);
              });
            }
          }
        },
        plus(item,getList){
          if(item.value1 == 0 && item.mode != 7){
            if(item.sTemperature < 32) {
              item.sTemperature++;

              //调用接口
              let para = {
                "deviceId": item.deviceId,
                "sTemperature": item.sTemperature
              };
              controlDevice(para).then((res) => {
                if(res.code == 200){
                  setTimeout(() => {
                    getList();
                  },3000);
                }
              }).catch(function (error) {
                console.log(error);
              });
            }
          }
        }
      }
    }
</script>

<style lang="scss" scoped>
  .lis {
    // box-shadow:1px 1px 3px 0 rgba(0,0,0,0.20);
    // border-radius:8px;
    // width:22.3%;
    // min-width:260px;
    // height:358px;
    // position: relative;
    // margin: 0 20px 50px 20px;
    .el-button.el-button--primary {
      background: #00d58c;
      color: #fff;
      border: 1px solid #00d58c;
    }
    &.on{
      background:#ffffff;
      border:1px solid #00d58c;
      .temperature{
        .leftPic{
          background: url("../../../assets/img/icon_less.png") no-repeat center center;
          &:active{
            background: url("../../../assets/img/icon_less_p.png") no-repeat center center;
          }
        }
        .rightPic{
          background: url("../../../assets/img/icon_plus.png") no-repeat center center;
          &:active{
            background: url("../../../assets/img/icon_plus_p.png") no-repeat center center;
          }
        }
      }
    }
    &.off{
      border: 1px solid #e8e8e8;
      background: #e8e8e8;
      .temperature{
        .leftPic{
          background: url("../../../assets/img/icon_less_d.png") no-repeat center center;
        }
        .rightPic{
          background: url("../../../assets/img/icon_plus_d.png") no-repeat center center;
        }
      }
      .switch{
        .switchBtn{
          .el-button{
            background: #e8e8e8;
            color: #a7a7a7;
            border: 1px solid #a7a7a7;
          }
        }
      }
      .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
        background: #e8e8e8;
        color: #a7a7a7;
        cursor: not-allowed;
        border: 1px solid #a7a7a7;
      }
    }
    .title{
      margin-top: 18px;
      font-size:14px;
      color:#32323b;
      line-height:14px;
    }
    .detail{
      position: absolute;
      top: 20px;
      right: 20px;
      cursor: pointer;
      i{
        width: 18px;
        height: 18px;
        display: block;
        float: right;
      }
      span{
        width: 28px;
        color: #a7a7a7;
        display: none;
        position: absolute;
        top: 32px;
        right:0;
      }
      &:hover span{
        display: block;
      }
    }
    .temperature{
      height: 150px;
      .leftPic,.rightPic{
        width: 48px;
        height: 48px;
        cursor: pointer;
      }
      .tempNum{
        font-size:58px;
        color:#32323b;
        display: flex;
        align-items:center;
        justify-content: center;
      }
      .environTemp{
        font-size:12px;
        color:#32323b;
        position: absolute;
        bottom: 10%;
        left: 70%;
      }
    }
    .switch{
      margin: 10px 0 26px 0;
      .switchBtn{
        display: flex;
        justify-content: space-between;
        .el-button{
          width:40%;
        }
      }
    }
    .model,.speed{
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
      .btn{
        display: flex;
        justify-content: space-between;
        .el-button{
          width:26%;
        }
      }
    }
  }
</style>
