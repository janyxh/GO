<template lang="html">
    <el-row class="wrap-add">
       <el-input v-model="aRoom.roomName" :maxlength="32" placeholder="请输入办公区域"></el-input>
       <button type="button" class="el-icon-plus btnsOperate" v-if="!index" @click="addArea"></button>
       <button type="button" class="el-icon-minus btnsOperate" v-if="index" @click="delArea(index)"></button>
    </el-row>
</template>

<script>
  export default {
    props:['aRoom','index'],
    // props:['roomAll'],
    data(){
      return{
        roomList:this.roomAll
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
  .wrap-add{
    position: relative;
    button{
      position: absolute;
      top: 5px;
      right: -50px;
    }
  }
</style>
