<template lang="html">
  <li :class="area.hasDeviceTrunOn ? 'on' : 'off'">
    <p class="tit-desk-control">{{area.roomname}}</p>
    <div class="icons-desk-control">
      <em :class="{'icon-air':true,'on':area.hasDeviceTrunOn}" title="空调"></em>
      <em :class="{'icon-full':true,'on':area.hasDeviceTrunOn}" title="照明灯"></em>
      <em :class="{'icon-fan':true,'on':area.hasDeviceTrunOn}" title="风扇"></em>
    </div>
    <el-button @click.stop="onSwitch(area.roomid,area.hasDeviceTrunOn,refresh,officeid)" :class="{'el-button--primary':area.hasDeviceTrunOn}">
      {{ area.hasDeviceTrunOn ? '关闭' : '开启' }}
    </el-button>

  </li>
</template>

<script>
    import {closeArea} from '../../api/api';
    export default {
      name:'',
      props:['area','refresh','officeid'],
      methods:{
        onSwitch(roomid,hasDeviceTrunOn,refresh,officeid){
            console.log(roomid);
            let areaParams = {"roomId":roomid,'status':hasDeviceTrunOn};
            closeArea(areaParams).then(data=>{
              let { code } = data;
              if (code !== 200) {
                this.$message({
                  message: data.msg,
                  type: 'error'
                });
              }else {
                // console.log(data);
                setTimeout(()=>{
                  refresh(officeid);
                  this.$message({
                    message: data.data,
                    type: 'success'
                  });
                },1000);
              }

            }).catch((error)=>{
              console.log(error);
            });
        }
      }
    }
</script>

<style lang="scss" scoped>
  /*     控制盒子   */
  .ul-control-box{
    padding: 0;
    margin: 0;
    min-width: 1060px;
  }
  .ul-control-box li{
    list-style: none;
    width: calc(25% - 40px);
    min-height: 320px;
    margin-right: 50px;
    margin-bottom: 50px;
    padding-bottom: 20px;
    background: #fff;
    border-radius:8px;
    box-shadow:1px 1px 3px 0 rgba(0,0,0,0.20);
    text-align: center;
    float: left;
  }

  .ul-control-box li:nth-of-type(4n){
    margin-right: 0;
  }
  .ul-control-box li.off{
    border:1px solid #e8e8e8;
    background: #e8e8e8;
    .el-button{
        background: #e8e8e8;
        border: 1px solid #a7a7a7;
        color: #a7a7a7;
    }
    .el-button:hover{
      background:#a7a7a7;
      color:#FFFFFF;
    }
  }
  .ul-control-box li.on{
    background: #fff;
    border:1px solid #00d58c;
  }
  .tit-desk-control{
    margin-top: 60px;
    padding: 0 10px;
    font-size: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icons-desk-control{
  	padding: 50px 35px;
  }
  .icons-desk-control p{
  	font-size: 20px;
  	height: 20px;
  	color: #a7a7a7;
  }
  .icons-desk-control em{
  	display: inline-block;
  	width: 42px;
  	height: 42px;
  	margin: 0 20px;
  }
  .icons-desk-control em.icon-air{
  	background: url('../../assets/img/icon-device/icon_air_condition.png');
  }
  .icons-desk-control em.icon-full{
  	background: url('../../assets/img/icon-device/icon_full.png');
  }
  .icons-desk-control em.icon-fan{
  	background: url('../../assets/img/icon-device/icon_fan.png');
  }
  .icons-desk-control em.icon-projector{
  	background: url('../../assets/img/icon-device/icon_projector.png');
  }
  .icons-desk-control em.icon-window{
  	background: url('../../assets/img/icon-device/icon_window_curtains.png');
  }
  .icons-desk-control em.icon-witer{
  	background: url('../../assets/img/icon-device/icon_witer.png');
  }

  .icons-desk-control em.icon-air.on{
  	background: url('../../assets/img/icon-device/icon_air_condition_p.png');
  }
  .icons-desk-control em.icon-full.on{
  	background: url('../../assets/img/icon-device/icon_full_p.png');
  }
  .icons-desk-control em.icon-fan.on{
  	background: url('../../assets/img/icon-device/icon_fan_p.png');
  }
  .icons-desk-control em.icon-projector.on{
  	background: url('../../assets/img/icon-device/icon_projector_p.png');
  }
  .icons-desk-control em.icon-window.on{
  	background: url('../../assets/img/icon-device/icon_window_curtains_p.png');
  }
  .icons-desk-control em.icon-witer.on{
  	background: url('../../assets/img/icon-device/icon_witer_p.png');
  }
</style>
