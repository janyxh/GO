<template>
  <el-col class="lis">
    <el-row class="title" type="flex" justify="center">{{item.deviceName}}</el-row>
    <div class="detail" @click="checkDetail(item)">
      <i class="icon-detail"></i>
      <span>详情</span>
    </div>
    <el-row class="temperature" type="flex" justify="center" align="middle">
      <div class="leftPic" @click="minus(item,getList)"></div>
      <el-col class="tempNum" :class="{'isTemp':isTemp}" :span="10">{{this.sTemperature}}°</el-col>
      <div class="rightPic" @click="plus(item,getList)"></div>
      <!-- <el-col class="environTemp">环境温度 <span>{{item.eTemperature}}</span>°</el-col> -->
    </el-row>
    <el-row class="switch" type="flex" justify="center">
      <el-col class="switchBtn" :span="10">
        <el-button size="small" @click="openDevice(item,getList)" :class="{'el-button--primary':control.open}" :plain="!learned.open" :disabled="!learned.open">开启</el-button>
        <el-button size="small" @click="closeDevice(item,getList)" :class="{'el-button--primary':control.close}" :plain="!learned.close" :disabled="!learned.close">关闭</el-button>
      </el-col>
    </el-row>
    <el-row class="model">
      <el-col :span="3">模式</el-col>
      <el-col :span="15" class="btn" >
        <el-button size="small" @click="refrigerate(item,getList)" :class="{'el-button--primary':control.cold}" :plain="!learned.cold" :disabled="!learned.cold">制冷</el-button>
        <el-button size="small" @click="heating(item,getList)" :class="{'el-button--primary':control.hot}" :plain="!learned.hot" :disabled="!learned.hot">制热</el-button>
        <el-button size="small" @click="airExhaust(item,getList)" :class="{'el-button--primary':control.arefaction}" :plain="!learned.arefaction" :disabled="!learned.arefaction">抽湿</el-button>
      </el-col>
    </el-row>
    <el-row class="speed">
      <el-col :span="3">风速</el-col>
      <el-col :span="15" class="btn" >
        <el-button size="small" @click="tempBig(item,getList)" :class="{'el-button--primary':control.highwind}" :plain="!learned.highwind" :disabled="!learned.highwind">高速</el-button>
        <el-button size="small" @click="tempMiddle(item,getList)" :class="{'el-button--primary':control.wind}" :plain="!learned.wind" :disabled="!learned.wind">中速</el-button>
        <el-button size="small" @click="tempSmall(item,getList)" :class="{'el-button--primary':control.lowwind}" :plain="!learned.lowwind" :disabled="!learned.lowwind">低速</el-button>
      </el-col>
    </el-row>
    <el-row class="swing">
      <el-col :span="3">摆风</el-col>
      <el-col :span="15" class="btn" >
        <el-button size="small" @click="directionAuto(item,getList)" :class="{'el-button--primary':control.autowind}" :plain="!learned.autowind" :disabled="!learned.autowind">自动</el-button>
        <el-button size="small" @click="directionStop(item,getList)" :class="{'el-button--primary':control.stopwind}" :plain="!learned.stopwind" :disabled="!learned.stopwind">停止</el-button>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
    import { controlDevice, isCodeLearning } from '../../../api/api'
    export default {
      name: "airCondition",
      props: ['item','getList'],
      data() {
          return {
            air:this.item,
            sTemperature:0,
            isTemp:true,
            learned:{
              open:false,
              close:false,
              cold:false,
              hot:false,
              arefaction:false,
              lowwind:false,
              wind:false,
              highwind:false,
              autowind:false,
              stopwind:false
            },
            control:{
              open:false,
              close:false,
              cold:false,
              hot:false,
              arefaction:false,
              lowwind:false,
              wind:false,
              highwind:false,
              autowind:false,
              stopwind:false
            }
          }
      },
      created(){
        this.ready();
      },
      methods:{
        ready(){

          this.sTemperature = this.air.sTemperature ? this.air.sTemperature : 23;
          this.learned.open = this.air.codeLearning.open;
          this.learned.close = this.air.codeLearning.shutdown;
          this.learned.cold = this.air.codeLearning.cool;
          this.learned.hot = this.air.codeLearning.hot;
          this.learned.arefaction = this.air.codeLearning.arefaction;
          this.learned.lowwind = this.air.codeLearning.lowwind;
          this.learned.wind = this.air.codeLearning.wind;
          this.learned.highwind = this.air.codeLearning.highwind;
          this.learned.autowind = this.air.codeLearning.autowind;
          this.learned.stopwind = this.air.codeLearning.stopwind;

          if(this.sTemperature){
            let codeParams = { "deviceId": this.air.deviceId, "command": Number('3110'+ this.sTemperature) };
            isCodeLearning(codeParams).then((res) => {
              let { code } = res;
              if(code != 200){
                this.$message({
                  message:res.msg,
                  type:'error'
                });
              }else{
                if(res.data){
                  this.isTemp = false;
                }else {
                  this.isTemp = true;
                }
              }
            }).catch(error=>{
              console.error(error);
            });
          }
        },
        checkDetail(item){
          let deviceId = item.deviceId;
          // sessionStorage.setItem('deviceId', JSON.stringify(deviceId));
          // this.$router.push('/DeviceDetail');
          this.$router.push({path:'/DeviceList/DeviceDetail',query:{id:deviceId}});
        },
//         tempAuto(item,getList){
//           //调用接口
//           let para = {
//             "deviceId": item.deviceId,
//             "innerFanSpeed": 0
//           };
//           controlDevice(para).then((res) => {
// //            console.log(res);
//             if(res.code == 200){
//               setTimeout(() => {
//                 getList();
//               },1500);
//             }
//           }).catch(function (error) {
//             console.log(error);
//           });
//         },
        tempBig(item,getList){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "innerFanSpeed": 311007
          };
          controlDevice(para).then((res) => {
            if(res.code == 200){
              this.control.highwind = true;
              this.control.wind = false;
              this.control.lowwind = false;
            }
          }).catch(function (error) {
            console.error(error);
          });
        },
        tempMiddle(item,getList){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "innerFanSpeed": 311006
          };
          controlDevice(para).then((res) => {
            if(res.code == 200){
              this.control.highwind = false;
              this.control.wind = true;
              this.control.lowwind = false;
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        tempSmall(item,getList){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "innerFanSpeed": 311005
          };
          controlDevice(para).then((res) => {
            if(res.code == 200){
              this.control.highwind = false;
              this.control.wind = false;
              this.control.lowwind = true;
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        airExhaust(item,getList){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "mode": 311001
          };
          controlDevice(para).then((res) => {
            if(res.code == 200){
              this.control.cold = false;
              this.control.hot = false;
              this.control.arefaction = true;
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        heating(item,getList){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "mode": 311003
          };
          controlDevice(para).then((res) => {
            if(res.code == 200){
              this.control.cold = false;
              this.control.hot = true;
              this.control.arefaction = false;
            }else{
              this.$message({
                message:res.msg,
                type:'error'
              });
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        refrigerate(item,getList){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "mode": 311000
          };
          controlDevice(para).then((res) => {
            if(res.code == 200){
              this.control.cold = true;
              this.control.hot = false;
              this.control.arefaction = false;
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
              // setTimeout(() => {
              //   getList();
              // },1500);
              this.control.open = true;
              this.control.close = false;
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
              // setTimeout(() => {
              //   getList();
              // },1500);
              this.control.open = false;
              this.control.close = true;
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        controlTemperature(item,sTemperature,mode){
          let codeParams = { "deviceId": item.deviceId, "command": sTemperature };
          isCodeLearning(codeParams).then((res) => {
            let { code } = res;
            if(code != 200){
              this.$message({
                message: res.msg,
                type:'warning'
              });
            }else{
              // console.log(res.data);
              if(res.data){
                let para = {
                  "deviceId": item.deviceId,
                  "sTemperature": sTemperature
                };
                controlDevice(para).then((res) => {
                  if(res.code == 200){
                    this.isTemp = false;
                  }
                }).catch(function (error) {
                  console.log(error);
                });
              }else{
                this.$message({
                  message:`${sTemperature.toString().slice(-2)}度还未学习红外码`,
                  type:'warning'
                });
                this.isTemp = true;
              }
            }
          });
        },
        minus(item,getList){
          // if(this.control.arefaction){
          //   this.$message({
          //     message:'此模式不能操作温度',
          //     type:'warning'
          //   });
          // }else if(!this.learned.cold && !this.learned.hot && !this.learned.arefaction){
          //   return false;
          // }else if(!this.control.cold && !this.control.hot){
          //   this.$message({
          //     message:'请选择制冷或制热模式',
          //     type:'warning'
          //   });
          // }else{

            if(this.sTemperature > 16){
              this.sTemperature--;

              //获取设备id
//              console.log(item.deviceId);

              //调用接口
              // if(this.control.cold){
                this.controlTemperature(item,Number('3110'+ this.sTemperature),'制冷');
              // }else{
              //   this.controlTemperature(item,Number('3111'+ this.sTemperature),'制热');
              // }

            }
          // }
        },
        plus(item,getList){
          // if(this.control.arefaction){
          //   this.$message({
          //     message:'此模式不能操作温度',
          //     type:'warning'
          //   });
          // }else if(!this.learned.cold && !this.learned.hot && !this.learned.arefaction){
          //   return false;
          // }else if(!this.control.cold && !this.control.hot){
          //   this.$message({
          //     message:'请选择制冷或制热模式',
          //     type:'warning'
          //   });
          // }else{
            if(this.sTemperature < 30) {
              this.sTemperature++;

              //调用接口
              // if(this.control.cold){
                this.controlTemperature(item,Number('3110'+ this.sTemperature),'制冷');
              // }else{
              //   this.controlTemperature(item,Number('3111'+ this.sTemperature),'制热');
              // }
            }
          // }
        },
        directionAuto(item){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "innerFanSpeed": 311009
          };
          controlDevice(para).then((res) => {
            if(res.code == 200){
              this.control.autowind = true;
              this.control.stopwind = false;
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        directionStop(item){
          //调用接口
          let para = {
            "deviceId": item.deviceId,
            "innerFanSpeed": 311010
          };
          controlDevice(para).then((res) => {
            if(res.code == 200){
              this.control.autowind = false;
              this.control.stopwind = true;
            }
          }).catch(function (error) {
            console.log(error);
          });
        }
      }
    }
</script>

<style lang="scss" scoped>
  .lis {
    background: #ffffff;
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
    .leftPic{
      background: url("../../../assets/img/icon_less.png") no-repeat center center;
      &:active{
        background: url("../../../assets/img/icon_less_p.png") no-repeat center center;
      }
    }
    .leftPicDisabled{
      background: url("../../../assets/img/icon_less_d.png") no-repeat center center;
      cursor:default;
    }
    .rightPic{
      background: url("../../../assets/img/icon_plus.png") no-repeat center center;
      &:active{
        background: url("../../../assets/img/icon_plus_p.png") no-repeat center center;
      }
    }
    .rightPicDisabled{
      background: url("../../../assets/img/icon_plus_d.png") no-repeat center center;
    }
    // &.on{
    //   background:#ffffff;
    //   border:1px solid #00d58c;
    //   .temperature{
    //     .leftPic{
    //       background: url("../../../assets/img/icon_less.png") no-repeat center center;
    //       &:active{
    //         background: url("../../../assets/img/icon_less_p.png") no-repeat center center;
    //       }
    //     }
    //     .rightPic{
    //       background: url("../../../assets/img/icon_plus.png") no-repeat center center;
    //       &:active{
    //         background: url("../../../assets/img/icon_plus_p.png") no-repeat center center;
    //       }
    //     }
    //   }
    // }
    // &.off{
    //   border: 1px solid #e8e8e8;
    //   background: #e8e8e8;
    //   .temperature{
    //     .leftPic{
    //       background: url("../../../assets/img/icon_less_d.png") no-repeat center center;
    //     }
    //     .rightPic{
    //       background: url("../../../assets/img/icon_plus_d.png") no-repeat center center;
    //     }
    //   }
    //   .switch{
    //     .switchBtn{
    //       .el-button{
    //         background: #e8e8e8;
    //         color: #a7a7a7;
    //         border: 1px solid #a7a7a7;
    //       }
    //     }
    //   }
    //   .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
    //     background: #e8e8e8;
    //     color: #a7a7a7;
    //     cursor: not-allowed;
    //     border: 1px solid #a7a7a7;
    //   }
    // }
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
      height: 110px;
      .leftPic,.rightPic,.leftPicDisabled,.rightPicDisabled{
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
      .isTemp{
        color: #dddfe8;
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
    .model,.speed,.swing{
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
      .btn{
        display: flex;
        // justify-content: space-between;
        .el-button{
          width:26%;
        }
      }
    }
  }
</style>
