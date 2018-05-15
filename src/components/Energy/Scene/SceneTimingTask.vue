<template lang="html">
  <div class="cardStyle card-time">
    <el-row :gutter="20">
      <el-col :offset="2" :span="8">
        <el-form-item label="定时时间：" class="is-required">
          
           <el-time-picker
             v-model="settime.notes"
             format="HH:mm">
           </el-time-picker>
        </el-form-item>
      </el-col>
      <el-col :offset="1" :span="13">
        <el-form-item label="执行频率：">
          <el-checkbox-group v-model="settime.weekList" fill="#00d58c">
            <el-checkbox-button v-for="days in weeklist" :label="days.id" :key="days.id">{{days.value}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>
      <span class="del" @click="delTim(settime,timings)">+</span>
  </div>
</template>

<script>
import { deleteTimerScenesEnergyDetail } from  '../../../api/api'
const daysOptions = [
  {id:7,value:'日'},
  {id:1,value:'一'},
  {id:2,value:'二'},
  {id:3,value:'三'},
  {id:4,value:'四'},
  {id:5,value:'五'},
  {id:6,value:'六'},
];
export default {
  props:['settime','timings','sceneNo'],
  data(){
    return{
      timing:'',
      weeklist: daysOptions
    }
  },
  created(){
    this.ready();
  },
  methods:{
    ready(){
      // console.log(this.settime);
      // let hours = parseInt(this.settime.timingTime.substring(0,2));
      // let min = parseInt(this.settime.timingTime.substring(3,5));
      // if(this.settime.timingTime){
      //   this.settime.timingTime =  new Date(2017,1,1,hours,min,0);
      // }
      if(this.settime.timingTime){
        let hours = parseInt(this.settime.timingTime.substring(0,2));
        let min = parseInt(this.settime.timingTime.substring(3,5));
        this.settime.notes =  new Date(2017,1,1,hours,min,0);
      }
    },
    delTim(item,timingList){
      let index = timingList.indexOf(item);
      // console.log(index);
      if(item.timingid){
        let delParams = {'timingId':item.timingid,'sceneNo':this.sceneNo};
        deleteTimerScenesEnergyDetail(delParams).then(data=>{
          let {code} = data;
          if(code != 200){
            this.$message({
              message:data.msg,
              type:'error'
            });
          }else {
            if(index !== -1){
              timingList.splice(index,1);
            }
            // console.log(data);
          }
        }).catch(error=>{
          console.log(error);
        });
      }else{
        if(index !== -1){
          timingList.splice(index,1);
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .cardStyle{
    position: relative;
    .redStar{
      color: #f84a51;
      font-size: 16px;
      margin-right: 6px;
      position: absolute;
      top: 0;
      left: -100px;
    }
  }
 .card-time{
    margin-top: 30px;
    .el-date-editor{
      width: 100%;
    }
 }
 .del{
   position: absolute;
   top: 10px;
   right: 10px;
   // float: right;
   // margin: -30px 16px 0 -40px;
   display: inline-block;
   color: #f84a51;
   font-size: 30px;
   font-weight: 700;
   -webkit-transform: rotate(-45deg);
   transform: rotate(-45deg);
   cursor: pointer;
 }
</style>
