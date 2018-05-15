<template lang="html">
  <section>
      <div class="navHeadBtns">
        <div id="navHeadSelects">
          <el-select v-model="formInline.office" placeholder="请选择办公室" @change="officeChange(formInline.office)" clearable>
            <el-option v-for="office in formInline.offices" key="office.familyId" :label="office.officeName" :value="office.officeId"></el-option>
          </el-select>
        </div>
      </div>
      <p class="tit-green-border">节能提醒</p>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        stripe
        style="width: 100%; overflow-x:hidden;overflow-y:auto;"
        height="241"
        empty-text="非常棒，您已处于最佳节能状态，暂无节能提醒！"
        >
        <el-table-column
          prop="notes"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="messageDescription"
          label="事项">
        </el-table-column>
        <el-table-column
          prop="familyName"
          label="办公楼">
        </el-table-column>
        <el-table-column
          prop="roomName"
          label="区域">
        </el-table-column>
        <el-table-column
           label="操作"
           width="100">
           <template scope="scope">
             <el-button @click="energyClose(scope.$index, tableData)" type="text" size="small">关闭</el-button>
           </template>
         </el-table-column>
      </el-table>

      <p class="tit-green-border">常用情景</p>
      <ul class="desk-scene">
        <SceneList
          v-for="scene in sceneData"
          :key="scene.sceneno"
          :scene="scene">
        </SceneList>
      </ul>
      <div class="more-scene"><router-link to="/SceneEnergy" class="a-primary">更多情景</router-link></div>


      <p class="tit-green-border">区域控制<span>目前有{{this.turnOnByRoom}}个区域未关闭</span></p>
      <ul class="ul-control-box">
        <AreaList
          v-for="area in allRoomsData"
          :key="area.roomid"
          :area="area"
          :officeid="formInline.office"
          :refresh = "officeChange"
          >
        </AreaList>
        <div class="clearFix"></div>
      </ul>
  </section>
</template>

<script>

  import { getOffice, getWorkbenchMessage, getWorkbenchScene, getWorkbenchArea, closeEnergyMessage } from '../../api/api';
  import SceneList from './SceneList';
  import AreaList from './AreaList';
  export default {
    name: "WorkBench",
    components:{
        SceneList,
        AreaList
    },
    data() {
      return {
          formInline: {
            office: '',
            offices:[]
          },
          tableData:[],
          loading:true,
          sceneData:[],
          allRoomsData:[],
          turnOnByRoom:0,
          energy:{
            messageId:'',
            deviceIds:''
          }
      }
    },
    created(){
      this.ready()
    },
    methods:{
      officeChange(officeid){
        let offceidParams = {"familyId":officeid};
        getWorkbenchMessage(offceidParams).then(data=>{
          let { code } = data;
          if(code!=200){
            this.$message({
              message:data.msg,
              type:'error'
            });
          }else{
            // console.log(data.data.messageCenters);
            this.tableData = data.data.messageCenters;
            this.loading = false;
          }
        }).catch(error=>{
          console.log(error);
        });

        getWorkbenchScene(offceidParams).then(data=>{
          let { code } = data;
          if(code!=200){
            this.$message({
              message:data.msg,
              type:'error'
            });
          }else{
            // console.log(data.data.sceneList);
            this.sceneData = data.data.sceneList;
          }
        }).catch(error=>{
          console.log(error);
        });

        getWorkbenchArea(offceidParams).then(data=>{
          let { code } = data;
          if(code!=200){
            this.$message({
              message:data.msg,
              type:'error'
            });
          }else{
            // console.log(data.data.allRooms);
            this.allRoomsData = data.data.allRooms;
            this.turnOnByRoom = data.data.turnOnByRoom;
          }
        }).catch(error=>{
          console.log(error);
        });
      },
      ready(){
        let offceParams = {};
        getOffice(offceParams).then(data => {
          let {  code } = data;
          if (code !== 200) {
            this.$message({
              message:  data.msg,
              type: 'error'
            });
          }else {
            // console.log(data.data);
            this.formInline.offices = data.data;
          }
        }).catch((error)=>{
          console.log(error);
        });

        this.officeChange("");



      },
      energyClose(index, tableData){
          // console.log("关闭设备");
          // console.log('messageId:'+ tableData[index].messageId);
          // console.log('deviceIds:'+ tableData[index].deviceIds);
          let messageParams = {'messageId':tableData[index].messageId,'deviceIds':tableData[index].deviceIds};
          closeEnergyMessage(messageParams).then(data => {
            let {  code } = data;
            if (code !== 200) {
              this.$message({
                message: data.msg,
                type: 'error'
              });
            }else {
              // console.log(data.data);
              this.$message({
                message: data.data,
                type: 'success'
              });
              this.officeChange(this.formInline.office);
            }
          }).catch((error)=>{
            console.log(error);
          });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .tit-green-border{
    height: 18px;
    line-height: 18px;
    border-left: 4px solid #00d58c;
    padding-left: 22px;
    margin: 30px 0 10px 0;
    font-weight: normal;
    color: #121212;
    span{
      color: #8c8ea2;
      margin-left: 20px;
      font-size: 12px;
    }
  }
  .more-scene{
    text-align: right;
    padding: 10px 0;
  }
  .desk-scene{
  	min-width: 1060px;
  	padding: 0;
  	margin: 0;
  }
  .desk-scene li{
    display: inline-block;
    list-style: none;
  	width: calc(20% -  60px);
  	font-size:14px;
  	/* min-width:400px; */
  	padding:30px 10px;
  	background: #fff;
  	border-radius:8px;
  	box-shadow:1px 1px 3px rgba(0,0,0,0.2);
  	margin-right:50px;
    cursor: pointer;
  }
  .desk-scene li:last-child{
    margin-right:0;
  }
  // .ul-control-box:after{
  //   clear: both;
  // }
</style>
