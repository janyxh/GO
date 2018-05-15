<!-- 子设备信息 -->
<template lang="html">
    <el-row :gutter="20">
      <el-col :offset="2" :span="8">
        <el-form-item label="设备名称：" class="is-required">

          <el-input v-model="item.deviceName" placeholder="请输入设备名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :offset="1" :span="12">
        <el-form-item label="设备功率：" class="is-required">

          <el-col :span="15" style="padding:0 18px 0 0;">
            <el-input v-model="item.power" placeholder="请输入设备功率" min="0"></el-input>
          </el-col>
          <span :span="4">W</span>
        </el-form-item>
      </el-col>
    </el-row>
</template>

<script>
export default {
  props:['item','subDeviceList'],
  data(){
    return{}
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
  // .el-input,.el-select{
  //   width: 90%;
  // }
}
.sub-device{
  margin-bottom: 50px;
}
.sub-device:last-child{
  margin-bottom: 0;
}
</style>
