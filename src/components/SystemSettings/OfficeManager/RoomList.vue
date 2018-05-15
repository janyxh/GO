<template lang="html">
  <li class="room" @click="editArea(room.roomId)">
        <i class="room-close el-icon-close" @click.stop="delRoom(room.roomId,refresh)"></i>
        <p class="area-name">{{room.roomName}}</p>
        <p>当前{{room.count}}个设备</p>
  </li>
</template>

<script>
import { deleteRoom } from '../../../api/api'
export default {
  props:['room','refresh'],
  methods:{
    delRoom(roomid,refresh){
      // console.log('删除');
      let roomParams = { 'roomId':roomid };
      deleteRoom(roomParams).then(res=>{
        let {code} = res;
        if(code!= 200){
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }else{
          this.$message({
            message: res.data,
            type: 'success'
          });
          refresh();
        }
      }).catch(error=>{
        console.error(error);
      });
    },
    editArea(roomid){
      this.$emit('sendRoomId',roomid);
    }
  }
}
</script>

<style lang="scss" scoped>
  .room{
    .room-close{
      position: absolute;
      top: 10px;
      right:10px;
      color: #8c8ea2;
      font-size: 12px;
      display: none;
    }
    .area-name{
      font-size:16px;
      color: #121212;
      padding-bottom: 5px;
      width: 100%;
      height: 20px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
  .room:hover{
    .room-close{
      display: block;
    }
  }
</style>
