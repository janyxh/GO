<template>
  <div>
    <div v-show="powerEdit.powerShow">
      {{scope.row.power}}
      <span v-if="scope.row.power!='--'">W</span>
      <span class="powerEdit" v-if="scope.row.power!='--'&&scope.row.deviceType!='64'&&scope.row.deviceType!='4'&&scope.row.deviceType!='8'&&scope.row.deviceType!='34'&&scope.row.deviceType!='35'&&scope.row.deviceType!='42'&&scope.row.deviceType!='11'" @click="powerEdit.powerShow=!powerEdit.powerShow">
        <i class="el-icon-edit" style="margin-left: 10px"></i>
      </span>
    </div>
    <div v-show="!powerEdit.powerShow">
      <input type="number" min="0" v-model="scope.row.power" style="width:60px;">W
      <el-button size="mini" @click="SavePower(scope.$index, scope.row,refresh)">保存</el-button>
    </div>
  </div>

</template>

<script>
    import { setPower } from '../../../api/api';
    export default {
      name:'powerEdits',
      props: ['scope','refresh'],
      data(){
        return {
          powerEdit:{
            powerShow:true
          }
        }
      },
      methods:{
        //设置设备功率
        SavePower(index,row,refresh){
          if(row.power == ''){
            this.$message({
              message: '设备功率不能为空！',
              type: 'warning'
            });
            return false;
          }else if(Number(row.power) < 0){
            this.$message({
              message: '设备功率不能为负数！',
              type: 'warning'
            });
            return false;
          }else if(Number(row.power) > 100000){
            this.$message({
              message: '设备功率不能大于100000！',
              type: 'warning'
            });
            return false;
          }else{
            let para = {
              "deviceId": row.deviceId,
              "power": row.power
            };
            setPower(para).then(() =>{
              //退出编辑
              this.powerEdit.powerShow=!this.powerEdit.powerShow;
              if(row.deviceType == 5){
                refresh();
              }
            }).catch(function (error) {
              console.log(error);
            });
          }
        }
      }
    }
</script>

<style lang="scss" scoped>
.powerEdit{
  cursor: pointer;
}
</style>
