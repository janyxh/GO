<template>
  <el-col class="lis" :class="item.value1 ? 'off' : 'on'">
    <el-row class="title" type="flex" justify="center">{{item.deviceName}}</el-row>
    <div class="detail" @click="checkDetail(item)">
      <i class="icon-detail"></i>
      <span>详情</span>
    </div>
    <el-row class="picWrap" type="flex" justify="center">
      <el-col class="picture"></el-col>
    </el-row>
    <el-row class="switch" type="flex" justify="center">
      <el-col class="switchBtn" :span="10">
        <el-button size="small" @click="openDevice(item,getList)" :class="{'el-button--primary':!item.value1}">开启</el-button>
        <el-button size="small" @click="closeDevice(item,getList)">关闭</el-button>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
  import { controlDevice } from '../../../api/api';
  export default {
    name: "flashLight",
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
      .picWrap{
        .picture{
          background: url("../../../assets/img/icon_light_p.png") no-repeat center center;
        }
      }
    }
    &.off{
      border: 1px solid #e8e8e8;
      background: #e8e8e8;
      .picWrap{
        .picture{
          background: url("../../../assets/img/icon_light.png") no-repeat center center;
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
    .picWrap{
      .picture{
        width: 90px;
        height: 90px;
        margin: 70px 0;
      }
    }
    .switch{
      .switchBtn{
        display: flex;
        justify-content: space-between;
        .el-button{
          width:40%;
        }
      }
    }
  }
</style>
