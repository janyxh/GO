<template lang="html">
  <el-row :gutter="30">
    <el-col :span="18">
      <el-form-item :label="'区域名' + (index +1) + '：'" label-width="200px" prop="name">
         <el-input v-model="aRoom.roomName" :maxlength="32" placeholder="请输入区域名称"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="4">
        <button type="button" class="el-icon-plus btnsOperate" v-if="!index" @click="addArea"></button>
        <button type="button" class="el-icon-minus btnsOperate" v-if="index" @click="delArea(index)"></button>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    props:['aRoom','roomList','index'],
    data(){
      return{
        // input: '',
        // room: this.aRoom,
        // roomAll: this.roomList
      }
    },
    methods:{
      addArea(){
        // console.log('添加区域');
        this.$emit('handleAddArea','');
      },
      delArea(index){
        // console.log('删除区域');
        this.$emit('handleMinusArea',index);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btnsOperate{
    color: #dddfe8;
    font-size: 18px;
    margin-top: 8px;
    border: none;
    background: none;
    outline: none;
    cursor: pointer;
  }
</style>
