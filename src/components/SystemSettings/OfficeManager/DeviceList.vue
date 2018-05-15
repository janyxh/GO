<template lang="html">
    <div class="device">
      {{device.deviceName}}
      <el-button @click="removeRoomDevice(device)">移除</el-button>
    </div>
</template>

<script>
  import { removeRoomDevice } from '../../../api/api'
  export default {
    props:['item','office'],
    data(){
      return{
        device:this.item,
        officeId:this.office,
      }
    },
    methods:{
      removeRoomDevice(device){
        this.$emit('sendDeviceId',device);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .device{
    padding: 10px 15px;
    margin-bottom: 22px;
    position: relative;
    button{
      position: absolute;
      top: 0;
      right: 0;
    }
  }
</style>
