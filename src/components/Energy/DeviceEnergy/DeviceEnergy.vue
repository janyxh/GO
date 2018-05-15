<template>
    <section>
      <div class="cardStyle" id="deviceEnergy">
      <!-- 筛选 -->
      <el-row class="table-header" :gutter="20" id="demo-form-inline">

        <el-col :span="6">
          <!-- <el-input v-model="selector.deviceName" placeholder="请输入设备名称"></el-input> -->
          <inputSearch :formInline="selector" :iconSearch="iconSearch"></inputSearch>
        </el-col>

        <el-col :span="3">
          <el-select v-model="selector.officeType" filterable placeholder="请选择办公室" :filter-method="areaDropDown" clearable>
            <el-option v-for="item in office_options" :key="item.officeId" :label="item.officeName" :value="item.officeId"></el-option>
          </el-select>
        </el-col>

        <el-col :span="3">
          <el-select v-model="selector.areaType" filterable placeholder="请选择区域" clearable>
            <el-option v-for="item in area_options" :key="item.roomId" :label="item.roomName" :value="item.roomId"></el-option>
          </el-select>
        </el-col>

        <el-col :span="3">
          <el-select v-model="selector.deviceType" filterable placeholder="请选择设备类型" clearable>
            <el-option v-for="item in device_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>

        <el-col :span="3">
          <el-select v-model="selector.timingType" filterable placeholder="是否已设置定时" clearable>
            <el-option v-for="item in timing_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>

        <el-col :span="3">
          <el-button @click="getList" style="width: 100%;">搜索</el-button>
        </el-col>

        <el-col :span="3">
          <el-button @click="onReset" style="width: 100%;">重置</el-button>
        </el-col>

      </el-row>
      <!-- 面板 -->

      <div class="wrap-table-list">
      <el-row class="deviceList">
        <div class="list" v-for="item in deviceLists" :key="item.deviceId">
          <flashLight v-if="item.deviceType==1" :item="item" :getList="getList"></flashLight>
          <colorLight v-if="item.deviceType==38" :item="item" :getList="getList"></colorLight>
          <dimmingLight v-if="item.deviceType==0" :item="item" :getList="getList"></dimmingLight>
          <airCondition v-if="item.deviceType==36" :item="item" :getList="getList"></airCondition>
          <airConditionVRV v-if="item.deviceType==81" :item="item" :getList="getList"></airConditionVRV>
          <airConditionInfrared v-if="item.deviceType==5" :item="item" :getList="getList"></airConditionInfrared>
          <shuntController v-if="item.deviceType==64" :item="item" :getList="getList"></shuntController>
          <curtain v-if="item.deviceType==4||item.deviceType==8||item.deviceType==34||item.deviceType==35||item.deviceType==42" :item="item" :getList="getList"></curtain>
          <!-- <drinkingFountains v-if="item.deviceType==2&&item.office_device_type==2" :item="item" :getList="getList"></drinkingFountains>
          <standbyEquipment v-if="(item.deviceType==2&&item.office_device_type==3)||(item.deviceType==2&&item.office_device_type==6)" :item="item" :getList="getList"></standbyEquipment>
          <otherDevice v-if="item.deviceType==2&&item.office_device_type==9" :item="item" :getList="getList"></otherDevice>
          <projector v-if="item.deviceType==2&&item.office_device_type==4" :item="item" :getList="getList"></projector> -->
          <standbyEquipment v-if="item.deviceType==2" :item="item" :getList="getList"></standbyEquipment>
          <div class="clearFix"></div>
        </div>
      </el-row>
    </div>
  </div>

    </section>
</template>

<script>
    import { getDeviceSavingList, getOffice, getArea } from '../../../api/api';
    import flashLight from './flashLight'
    import colorLight from './colorLight'
    import dimmingLight from './dimmingLight'
    import airCondition from './airCondition'
    import airConditionVRV from './airConditionVRV'
    import airConditionInfrared from './airConditionInfrared'
    import shuntController from './shuntController'
    import curtain from './curtain'
    import drinkingFountains from './drinkingFountains'
    import standbyEquipment from './standbyEquipment'
    import otherDevice from './otherDevice'
    import projector from './projector'
    import inputSearch from '../../../items/inputSearch'
    export default {
      components:{
        flashLight,
        colorLight,
        dimmingLight,
        airCondition,
        airConditionVRV,
        airConditionInfrared,
        shuntController,
        curtain,
        drinkingFountains,
        standbyEquipment,
        otherDevice,
        projector,
        inputSearch //搜索输入框
      },
      data() {
        return {
          iconSearch:{
            iconIsDelKeyword:""
          },
          deviceLists:[],
          device_options: [
            {
              "value": "0",
              "label": "照明灯"
            },
            {
              "value": "1",
              "label": "空调"
            },
            {
              "value": "2",
              "label": "饮水机"
            },
            {
              "value": "3",
              "label": "打印机"
            },
            {
              "value": "4",
              "label": "投影仪"
            },
            {
              "value": "5",
              "label": "窗帘"
            },
            {
              "value": "6",
              "label": "待机设备"
            },
            {
              "value": "64",
              "label": "空气开关"
            }
          ],
          office_options: [],
          area_options: [],
          timing_options: [
            {
              "value": "1",
              "label": "是"
            },
            {
              "value": "0",
              "label": "否"
            }
          ],
          selector: {
            keyword:'',
            deviceType: '',
            officeType: '',
            areaType: '',
            timingType: ''
          }
        }
      },
      created(){
        this.getList();
        this.officeDropDown();
      },
      mounted(){
        // 回车搜索事件
        document.onkeyup = ((event)=>{
            var e = event || window.event;
             if(e && e.keyCode==13){ // enter 键
               this.getList();
            }
        });
      },
      beforeDestroy(){
        document.onkeyup = '';
      },
      methods: {
        //重置按钮
        onReset(){
          this.selector = {
            keyword:'',
            deviceType: '',
            officeType: '',
            areaType: '',
            timingType: ''
          }
          this.iconSearch.iconIsDelKeyword = "";
          this.getList();
        },
        //选择区域
        areaDropDown(){
          this.selector.areaType = "";
          // console.log( this.selector.officeType );
          if(this.selector.officeType == ""){
  					this.area_options = '';
  				}else{
            let areaParams = { "officeId": this.selector.officeType };
            getArea(areaParams).then((res) =>{
              if(res.code != 200){
                this.$message({
                  message: res.msg,
                  type: 'error'
                });
              }else {
                this.area_options = res.data;
                // console.log(this.area_options);
              }
            }).catch(function (error) {
              console.log(error);
            });
          }
        },
        //选择办公楼
        officeDropDown(){
          let para = {};
          getOffice(para).then((res) =>{
            if(res.code == 200){
              this.office_options = res.data;

//          console.log(res.data.officeList);
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        //获取列表
        getList(){
          let para = {
            "deviceType": this.selector.deviceType,
            "officeId": this.selector.officeType,
            "deviceName": this.selector.keyword,
            "timingId": this.selector.timingType,
            "roomId": this.selector.areaType
          };
          getDeviceSavingList(para).then((res) => {
            if(res.code == 200){
             console.log(res);
              this.deviceLists = res.data.resultList;
            }
          }).catch(function (error) {
            console.log(error);
          });
        }
      }
    }
</script>

<style lang="scss" scoped>

  .deviceList{
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    .list{
      box-shadow:1px 1px 3px 0 rgba(0,0,0,0.20);
      border-radius:8px;
      // width:22.3%;
      width: calc(25% - 38px);
      // min-width:260px;
      // min-width:240px;
      height:370px;
      position: relative;
      // margin: 0 20px 50px 20px;
      margin-right: 50px;
      margin-bottom: 50px;
      .lis{
        height: 100%;
        border-radius:8px;
      }
    }
    .list:nth-of-type(4n){
      margin-right: 0;
    }
  }
  @media screen and (max-width: 1387px) {
      .deviceList {
          .list{
            margin-right: 30px;
          }
      }
  }
  @media screen and (max-width: 1327px) {
      .deviceList {
          .list{
            margin-right: 20px;
          }
      }
  }
</style>
