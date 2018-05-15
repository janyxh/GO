<template>
  <section>
    <div class="navHeadBtns">
      <div id="navHeadSelects">
        <el-select v-model="formInline.office" placeholder="请选择办公室" @change="officeChange(formInline.office)" clearable>
          <el-option v-for="office in formInline.offices" key="office.familyId" :label="office.officeName" :value="office.officeId"></el-option>
        </el-select>
      </div>
    </div>

    <!-- 仪表盘统计 -->
    <div class="gauge">

      <div class="chart-gauge gauge-energy-statistics">
        <h5>节能统计<em class="icon-gauge-energy-statistics"></em></h5>
          <!-- 节能统计 -->
        <div id="chartGaugeEnergy"></div>
        <div class="index-data-wrap">
          <label class="savePowerMonth">{{this.gaugeEnergy}}kWh</label>
          <p>本月节能</p>
        </div>
        <div class="index-data-wrap">
          <el-row :gutter="20">
            <el-col :span="12">
              <label class="saveTimeMonth">{{this.txtEnergyMonth}}h</label>
              <p>本月节能总时长</p>
            </el-col>
            <el-col :span="12">
              <label class="savePowerYesterday">{{this.txtEnergyYesterday}}kWh</label>
              <p>昨日节能</p>
            </el-col>
          </el-row>
        </div>
          <div class="index-data-wrap">
            <span>与上月同比</span>
            <span :class=" isUpperEnergy ?'data-upper':'data-lower' ">{{this.txtPercentEnergy}}%</span>
          </div>
      </div>

      <div class="chart-gauge gauge-energy-cost">
        <h5>节省费用<em class="icon-gauge-energy-cost"></em></h5>
        <!-- 节省费用 -->
        <div id="chartGaugeCost"></div>
        <div class="index-data-wrap">
          <label class="savePriceMonth">¥{{this.gaugeCost}}</label>
          <p>本月节省费用</p>
        </div>
        <div class="index-data-wrap">
              <label class="savePriceYesterday">¥{{this.txtPriceYesterday}}</label>
              <p>昨日节省费用</p>
        </div>
          <div class="index-data-wrap">
            <span>与上月同比</span>
            <span :class=" isUpperPrice ?'data-upper':'data-lower' ">{{this.txtPercentPrice}}%</span>
          </div>
      </div>

      <div class="chart-gauge gauge-power-statistics">
        <h5>电量统计<em class="icon-gauge-power-statistics"></em></h5>
        <!-- 电量统计 -->
        <div id="chartGaugePower"></div>
        <div class="index-data-wrap">
          <label class="workPowerMonth">{{this.gaugePower}}kWh</label>
          <p>本月用电量</p>
        </div>
        <div class="index-data-wrap">
          <el-row :gutter="20">
            <el-col :span="12">
              <label class="workTimeMonth">{{this.txtPowerMonth}}h</label>
              <p>本月用电时长</p>
            </el-col>
            <el-col :span="12">
              <label class="workPowerYesterday">{{this.txtPowerYesterday}}kWh</label>
              <p>昨日已使用电量</p>
            </el-col>
          </el-row>
        </div>
          <div class="index-data-wrap">
            <span>与上月同比</span>
            <span :class=" isUpperPower ?'data-upper':'data-lower' ">{{this.txtPercentPower}}%</span>
          </div>
      </div>
    </div>

		<div class="power-statistics-wrap">
			<p class="index-title">电量统计分析</p>
			<div class="btns-date">
        <el-button @click="month">月</el-button>
        <el-button @click="quarter">季</el-button>
        <el-button @click="year">年</el-button>
			</div>
    <div>
      <!-- Nav tabs -->
      <ul class="index-tabs">
        <li :class="{ active: isFirst }" @click="tabFirst">
          <a>
            <el-row :gutter="20">
              <el-col :offset="4" :span="8">
                  <p>节能量</p>
                  <label>{{this.sumSavePower}}kWh</label>
              </el-col>
              <el-col :span="8">
                  <p>节能费用</p>
                  <label>{{this.sumSaveMoney}}元</label>
              </el-col>
            </el-row>
          </a>
        </li>
        <li :class="{ active: !isFirst }" @click="tabSec">
          <a>
            <p>电量统计</p>
            <label>{{this.sumWorkPower}}kWh</label>
          </a>
        </li>
      </ul>
      <!-- Tab panes -->
      <div class="tab-content">
        <div :class="{'tab-pane':true,'tab-show':isFirst}">
            <div id="chartBarEnergy"></div>
        </div>
        <div :class="{'tab-pane':true,'tab-show':!isFirst}">
            <div id="chartBarPower"></div>
        </div>
      </div>
    </div>

  </div>
    <!-- chartPieDevice -->
    <div class="gauge">
			<div class="chart-gauge">
				<p class="index-title">本月设备类型节能情况</p>
				<div id="chartPieDevice" v-show="isShowPieDevice"></div>
        <div class="pieNotData" v-show="!isShowPieDevice">暂无数据</div>
			</div>
			<div class="chart-gauge">
				<p class="index-title">本月区域节能情况</p>
				<div id="chartPieArea" v-show="isShowPieArea"></div>
        <div class="pieNotData" v-show="!isShowPieArea">暂无数据</div>
			</div>
			<div class="chart-gauge">
				<p class="index-title">本月设备类型用电情况</p>
				<div id="chartPieDeviceType" v-show="isShowPieDeviceType"></div>
        <div class="pieNotData" v-show="!isShowPieDeviceType">暂无数据</div>
			</div>
		</div>
  </section>
</template>

<script>
import { getOffice, getIndexGauge, getIndexPie, getIndexBar } from '../api/api';
export default {
  name:'Home',
  data(){
    return{
      value2: "",
      formInline: {
        office: '',  //当前办公室
        offices:[]  //办公室列表
      },
      isFirst:true,
      objGaugeEnergy:{},
      objGaugeCost:{},
      objGaugePower:{},
      gaugeEnergy:0,   //仪表盘-本月节能
      gaugeCost:0,   //仪表盘-本月节省费用
      gaugePower:0,   //仪表盘-本月用电量
      txtEnergyMonth:0, //本月节能总时长
      txtEnergyYesterday:0,  //昨日节能
      txtPriceYesterday:0, //昨日节省费用
      txtPowerMonth:0, // 本月用电时长
      txtPowerYesterday:0,   //昨日已使用电量
      txtPercentEnergy:0,   //节能与上月同比 比例
      txtPercentPrice:0,   //节能费用与上月同比 比例
      txtPercentPower:0,  //节能费用与上月同比 比例
      isUpperEnergy:true,  //节能与上月同比  上升
      isUpperPrice:true,  //节能费用与上月同比  上升
      isUpperPower:true,  //节能费用与上月同比   上升
      objPieDevice:{},
      objPieArea:{},
      objPieDeviceType:{},
      isShowPieDevice:true,
      isShowPieArea:true,
      isShowPieDeviceType:true,
      dataPieDevice:[],  //饼图-本月设备节能情况
      dataPieArea:[],  //饼图-本月区域节能情况
      dataPieDeviceType:[],  //饼图-本月设备类型能耗占比情况
      dataPieDeviceName:[],
      dataPieAreaName:[],
      dataPieDeviceTypeName:[],
      sumSavePower:0,//节能量
      sumSaveMoney:0,//节省费用
      sumWorkPower:0,//电量统计
      timeListEnergy:[],//节能量-x轴刻度
      timeListPrice:[],//节能费用-x轴刻度
      timeListPower:[],//电量统计-x轴刻度
      energyList:[],// 电量统计-节能数组
      priceList:[],//电量统计-节省费用
      powerList:[],//电量统计-电量
      startValueEnergy:"2016-01-01",
      // startValuePrice:"2016-01-01",
      startValuePower:"2016-01-01",
      objBarEnergy:{},
      objBarPower:{},
      bodywidth:0,
      bodyWidthOldDevice:0,
      bodyWidthOldArea:0,
      bodyWidthOldDeviceType:0,
      // pieNamesDevice:[],//
      // pieNamesArea:[],
      // pieNamesDeviceType:[],
      // pieDataDevice:[],
      // pieDataArea:[],
      // pieDataDeviceType:[]
    }
  },
  created(){
    this.ready();
    this.bodywidth = this.bodyWidthOldDevice = this.bodyWidthOldArea = this.bodyWidthOldDeviceType = document.documentElement.clientWidth || document.body.clientWidth;
    // console.log(this.bodywidth);
  },
  mounted(){
    this.drawCharts();
    let that = this;
    window.onresize = function(){
      that.handleClick();
      this.bodywidth = document.documentElement.clientWidth || document.body.clientWidth;
      // console.log(this.bodywidth);
      // that.showPieDevice(this.bodywidth);
      that.showPieArea(this.bodywidth);
      // that.showPieDeviceType(this.bodywidth);
    };
  },
  beforeDestroy(){
    window.onresize = '';
  },
  methods:{
    ready(){
      let offceParams = null;
      getOffice(offceParams).then(data => {
        let { code } = data;
        if (code !== 200) {
          this.$message({
            message: data.msg,
            type: 'error'
          });
        }else {
          // console.log(data);
          this.formInline.offices = data.data;
        }
      }).catch((error)=>{
        console.log(error);
      });
      this.officeChange(this.formInline.office);
    },
    officeChange(officeid){
      this.loadGauge(officeid);
      this.loadBar(officeid);
      this.loadPie(officeid);
    },
    loadGauge(officeid){

            //仪表盘
            for(let i = 0; i < 3; i++){
              // console.log(i);
              let gaugeParams = {"flag": i,"officeId" : officeid};
              getIndexGauge(gaugeParams).then(data => {
                let { code } = data;
                if (code !== 200) {
                  this.$message({
                    message:data.msg,
                    type:'error'
                  });
                }else {
                  if(i == 0){

                    this.gaugeEnergy = data.data.quantity;  //仪表盘-本月节能
                    this.objGaugeEnergy.series[0].data[0].value = data.data.quantity;
                    this.chartGaugeEnergy.setOption(this.objGaugeEnergy,true);

                    this.txtEnergyMonth = data.data.time;  //本月节能总时长
                    this.txtEnergyYesterday = data.data.day;  //昨日节能

                    this.txtPercentEnergy = data.data.scale;   //节能与上月同比 比例
                    this.isUpperEnergy = data.data.scaleFlag;  //节能与上月同比  上升

                  }else if(i == 1){

                    this.gaugeCost = data.data.quantity;   //仪表盘-本月节省费用
                    this.objGaugeCost.series[0].data[0].value = data.data.quantity;
                    this.chartGaugeCost.setOption(this.objGaugeCost,true);

                    this.txtPriceYesterday =  data.data.day; //昨日节省费用

                    this.txtPercentPrice = data.data.scale;   //节能费用与上月同比 比例
                    this.isUpperPrice = data.data.scaleFlag;  //节能费用与上月同比  上升

                  }else if(i == 2){

                    this.gaugePower = data.data.quantity;   //仪表盘-本月用电量
                    this.objGaugePower.series[0].data[0].value = data.data.quantity;
                    this.chartGaugePower.setOption(this.objGaugePower,true);

                    this.txtPowerMonth = data.data.time; // 本月用电时长
                    this.txtPowerYesterday = data.data.day;   //昨日已使用电量

                    this.txtPercentPower = data.data.scale;  //电量费用与上月同比 比例
                    this.isUpperPower = data.data.scaleFlag;  //电量费用与上月同比   上升

                  }
                }
              }).catch(error=>{
                console.error(error);
              });
            }

    },
    loadBar(officeid){
            //柱状图
            let powerParams = {"flag": 0,"officeId" : officeid};
            getIndexBar(powerParams).then(data => {
              let { code } = data;
              if (code !== 200) {
                this.$message({
                  message:data.msg,
                  type:'error'
                });
              }else {
                data.data.forEach((item)=>{
                  if(item.name == "节能量"){

                    this.sumSavePower = item.quantity;  //节能量
                    this.timeListEnergy = item.xAxis; //日期数组
                    this.objBarEnergy.xAxis[0].data = item.xAxis;

                    this.energyList = item.yAxis;//节能数组
                    this.objBarEnergy.series[0].data = item.yAxis;

                    this.objBarEnergy.dataZoom[0].startValueEnergy = item.startTime;

                    this.chartBarEnergy.setOption(this.objBarEnergy,true);

                  }else if(item.name == "节能费用"){

                    this.sumSaveMoney = item.quantity; //节省费用
                    this.timeListPrice = item.xAxis; //日期数组
                    this.objBarEnergy.xAxis[0].data = item.xAxis;

                    this.priceList = item.yAxis;//节省费用数组
                    this.objBarEnergy.series[1].data = item.yAxis;

                    this.objBarEnergy.dataZoom[0].startValueEnergy = item.startTime;

                    this.chartBarEnergy.setOption(this.objBarEnergy,true);

                  }else if(item.name == "电量统计"){

                    this.sumWorkPower = item.quantity; //电量统计
                    this.timeListPower = item.xAxis; //日期数组
                    this.objBarPower.xAxis.data = item.xAxis;

                    this.powerList = item.yAxis;//电量数组
                    this.objBarPower.series[0].data = item.yAxis;

                    this.objBarPower.dataZoom[0].startValuePower = item.startTime;

                    this.chartBarPower.setOption(this.objBarPower,true);

                  }
                });

              }
            }).catch(error=>{
              console.error(error);
            });
    },
    loadPie(officeid){

            //饼图
            for(let i = 0; i < 3; i++){
              // console.log(i);
              let pieParams = {"flag": i,"officeId" : officeid};
              getIndexPie(pieParams).then(data => {
                let { code } = data;
                if (code !== 200) {
                  this.$message({
                    message:data.msg,
                    type:'error'
                  });
                }else {
                  if(i == 0){
                    if(data.data.powerPieVoList && data.data.powerPieVoList.length == 0){
                      this.isShowPieDevice = false;
                    }else{
                      this.isShowPieDevice = true;
                      this.objPieDevice.legend.data = data.data.names;  //饼表-本月设备节能情况
                      // this.dataPieDeviceName  = data.data.names;
                      this.objPieDevice.series[0].data = data.data.powerPieVoList;
                      // this.dataPieDevice  = data.data.powerPieVoList;
                      this.chartPieDevice.setOption(this.objPieDevice,true);
                      // this.showPieDevice(this.bodywidth);
                    }
                  }else if(i == 1){
                    if(data.data.powerPieVoList && data.data.powerPieVoList.length == 0){
                      this.isShowPieArea = false;
                    }else {
                      this.isShowPieArea = true;
                      // this.objPieArea.legend.data = data.data.names;  //饼表-本月区域节能情况
                      this.dataPieAreaName  = data.data.names;
                      // this.objPieArea.series[0].data = data.data.powerPieVoList;
                      this.dataPieArea = data.data.powerPieVoList;
                      // this.chartPieArea.setOption(this.objPieArea,true);
                      // this.showPieArea(this.bodywidth);
                      if(this.bodywidth >= 1920){
                        this.loadAreaLarge(this.bodywidth);
                      }else if(this.bodywidth > 1366 && this.bodywidth < 1920){
                        this.loadAreaMiddle(this.bodywidth);
                      }else if(this.bodywidth <= 1366){
                        this.loadAreaSmall(this.bodywidth);
                      }
                    }
                  }else if(i == 2){
                    if(data.data.powerPieVoList && data.data.powerPieVoList.length == 0){
                      this.isShowPieDeviceType = false;
                    }else {
                      this.isShowPieDeviceType = true;
                      this.objPieDeviceType.legend.data = data.data.names;  //饼表-本月设备类型能耗占比情况
                      // this.dataPieDeviceTypeName = data.data.names;  //饼表-本月设备类型能耗占比情况
                      this.objPieDeviceType.series[0].data = data.data.powerPieVoList;
                      // this.dataPieDeviceType = data.data.powerPieVoList;
                      this.chartPieDeviceType.setOption(this.objPieDeviceType,true);
                      // this.showPieDeviceType(this.bodywidth);
                    }
                  }
                }
              }).catch(error=>{
                console.error(error);
              });
            }
    },
    // showPieDevice(bodywidth){
    //   // console.log('饼图1');
    //   // console.log( bodywidth + '/' + this.bodyWidthOldDevice);
    //   if(bodywidth >= 1920 && this.bodyWidthOldDevice < 1920){
    //     // console.log('大屏幕' + bodywidth);
    //     // console.log('old'+this.bodyWidthOldDevice);
    //     if(this.dataPieDeviceName && this.dataPieDeviceName.length > 0){
    //       let arrNamesDevice = this.dataPieDeviceName.map((item)=>{
    //         if(item.length > 8){
    //           return item.substr(0,8)+'...';
    //         }
    //         return item;
    //       });
    //       this.objPieDevice.legend.data = arrNamesDevice;
    //     }
    //     if(this.dataPieDevice && this.dataPieDevice.length > 0){
    //       let arrDataDevice = this.dataPieDevice.map((item)=>{
    //         if(item.name.length > 8){
    //           item.name = item.name.substr(0,8)+'...';
    //         }
    //         return item;
    //       });
    //       this.objPieDevice.series[0].data = arrDataDevice;
    //     }
    //     this.chartPieDevice.setOption(this.objPieDevice,true);
    //     this.bodyWidthOldDevice = bodywidth;
    //     // console.log('原来的值'+this.bodyWidthOldDevice);
    //   }else if(bodywidth > 1366 && bodywidth < 1920 && (this.bodyWidthOldDevice <= 1366 || this.bodyWidthOldDevice >= 1920) ){
    //       // console.log('比笔记本大' + bodywidth);
    //       // console.log('old'+this.bodyWidthOldDevice);
    //     if(this.dataPieDeviceName && this.dataPieDeviceName.length > 0){
    //       let arrNamesDevice = this.dataPieDeviceName.map((item)=>{
    //         if(item.length > 5){
    //           return item.substr(0,5)+'...';
    //         }
    //         return item;
    //       });
    //       this.objPieDevice.legend.data = arrNamesDevice;
    //     }
    //     if(this.dataPieDevice && this.dataPieDevice.length > 0){
    //       let arrDataDevice = this.dataPieDevice.map((item)=>{
    //         if(item.name.length > 5){
    //           item.name = item.name.substr(0,5)+'...';
    //         }
    //         return item;
    //       });
    //       this.objPieDevice.series[0].data = arrDataDevice;
    //     }
    //     this.chartPieDevice.setOption(this.objPieDevice,true);
    //     this.bodyWidthOldDevice = bodywidth;
    //     // console.log('原来的值'+this.bodyWidthOldDevice);
    //   }else if(bodywidth <= 1366 && this.bodyWidthOldDevice > 1366){
    //     // console.log('笔记本' + bodywidth);
    //     // console.log('old'+this.bodyWidthOldDevice);
    //     if(this.dataPieDeviceName && this.dataPieDeviceName.length > 0){
    //       let arrNamesDevice = this.dataPieDeviceName.map((item)=>{
    //         if(item.length > 3){
    //           return item.substr(0,3)+'...';
    //         }
    //         return item;
    //       });
    //       this.objPieDevice.legend.data = arrNamesDevice;
    //     }
    //     if(this.dataPieDevice && this.dataPieDevice.length > 0){
    //       let arrDataDevice = this.dataPieDevice.map((item)=>{
    //         if(item.name.length > 3){
    //           item.name = item.name.substr(0,3)+'...';
    //         }
    //         return item;
    //       });
    //       this.objPieDevice.series[0].data = arrDataDevice;
    //     }
    //     this.chartPieDevice.setOption(this.objPieDevice,true);
    //     this.bodyWidthOldDevice = bodywidth;
    //     // console.log('原来的值'+this.bodyWidthOldDevice);
    //   }
    // },
    loadAreaLarge(bodywidth){
      if(this.dataPieAreaName && this.dataPieAreaName.length > 0){
        let arrL = this.dataPieAreaName.concat();
        // console.log(arrL);
        let arrNamesArea = arrL.map((item,index)=>{
          if(item.length > 8){
            return item.substr(0,8)+'...';
          }
          return item;
        });
        this.objPieArea.legend.data = arrNamesArea;
        // console.log(arrNamesArea);
      }else{
        this.objPieArea.legend.data = this.dataPieAreaName;
      }
      if(this.dataPieArea && this.dataPieArea.length > 0){
        let arrLD = JSON.parse(JSON.stringify(this.dataPieArea));
        // console.log(arrLD);
        let arrDataArea = arrLD.map((item)=>{
          if(item.name.length > 8){
            item.name = item.name.substr(0,8)+'...';
          }
          return item;
        });
        this.objPieArea.series[0].data = arrDataArea;
        // console.log(arrLD);
      }else{
        this.objPieArea.series[0].data = this.dataPieArea;
      }
      this.chartPieArea.setOption(this.objPieArea,true);
      this.bodyWidthOldArea = bodywidth;
    },
    loadAreaMiddle(bodywidth){
      if(this.dataPieAreaName && this.dataPieAreaName.length > 0){
        let arrM = this.dataPieAreaName.concat();
        // console.log(arrM);
        let arrNamesArea2 = arrM.map((item,index)=>{
          if(item.length > 5){
            return item.substr(0,5)+'...';
          }
          return item;
        });
        this.objPieArea.legend.data = arrNamesArea2;
        // console.log(arrNamesArea2);
      }else {
        this.objPieArea.legend.data = this.dataPieAreaName;
      }
      if(this.dataPieArea && this.dataPieArea.length > 0){
        let arrMD = JSON.parse(JSON.stringify(this.dataPieArea));
        // console.log(arrMD);
        let arrDataArea2 = arrMD.map((item)=>{
          if(item.name.length > 5){
            item.name = item.name.substr(0,5)+'...';
          }
          return item;
        });
        this.objPieArea.series[0].data = arrDataArea2;
        // console.log(arrMD);
      }else{
        this.objPieArea.series[0].data = this.dataPieArea;
      }
      this.chartPieArea.setOption(this.objPieArea,true);
      this.bodyWidthOldArea = bodywidth;
    },
    loadAreaSmall(bodywidth){
      if(this.dataPieAreaName && this.dataPieAreaName.length > 0){
        let arrS = this.dataPieAreaName.concat();
        // console.log(arrS);
        let arrNamesArea3 = arrS.map((item)=>{
          if(item.length > 3){
            return item.substr(0,3)+'...';
          }
          return item;
        });
        this.objPieArea.legend.data = arrNamesArea3;
        // console.log(arrNamesArea3);
      }else {
        this.objPieArea.legend.data = this.dataPieAreaName;
      }
      if(this.dataPieArea && this.dataPieArea.length > 0){
        let arrSD = JSON.parse(JSON.stringify(this.dataPieArea));
        let arrDataArea3 = arrSD.map((item)=>{
          if(item.name.length > 3){
            item.name = item.name.substr(0,3)+'...';
          }
          return item;
        });
        this.objPieArea.series[0].data = arrDataArea3;
      }else {
        this.objPieArea.series[0].data = this.dataPieArea;
      }
      this.chartPieArea.setOption(this.objPieArea,true);
      this.bodyWidthOldArea = bodywidth;
    },
    showPieArea(bodywidth){
      // console.log('饼图2');
      // console.log( bodywidth + '/' + this.bodyWidthOldArea);
      if(bodywidth >= 1920 && this.bodyWidthOldArea < 1920){
        this.loadAreaLarge(bodywidth);
      }else if(bodywidth > 1366 && bodywidth < 1920 && (this.bodyWidthOldArea <= 1366 || this.bodyWidthOldArea >= 1920) ){
        this.loadAreaMiddle(bodywidth);
      }else if(bodywidth <= 1366 && this.bodyWidthOldArea > 1366){
        this.loadAreaSmall(bodywidth);
      }
    },
    // showPieDeviceType(bodywidth){
    //   if(bodywidth >= 1920 && this.bodyWidthOldDeviceType < 1920){
    //     if(this.dataPieDeviceTypeName && this.dataPieDeviceTypeName.length > 0){
    //       let arrNamesDeviceType = this.dataPieDeviceTypeName.map((item)=>{
    //         if(item.length > 8){
    //           return item.substr(0,8)+'...';
    //         }
    //         return item;
    //       });
    //       this.objPieDeviceType.legend.data = arrNamesDeviceType;
    //     }
    //     if(this.dataPieDeviceType && this.dataPieDeviceType.length > 0){
    //       let arrDataDeviceType = this.dataPieDeviceType.map((item)=>{
    //         if(item.name.length > 8){
    //           item.name = item.name.substr(0,8)+'...';
    //         }
    //         return item;
    //       });
    //       this.objPieDeviceType.series[0].data = arrDataDeviceType;
    //     }
    //     this.chartPieDeviceType.setOption(this.objPieDeviceType,true);
    //     this.bodyWidthOldDeviceType = bodywidth;
    //     console.log('原来的值'+this.bodyWidthOldDeviceType);
    //   }else if(bodywidth > 1366 && bodywidth < 1920 && (this.bodyWidthOldDeviceType < 1366 || this.bodyWidthOldDeviceType >= 1920)){
    //     console.log('比笔记本大' + bodywidth);
    //     console.log('old'+this.bodyWidthOldDeviceType);
    //       if(this.dataPieDeviceTypeName && this.dataPieDeviceTypeName.length > 0){
    //         let arrNamesDeviceType = this.dataPieDeviceTypeName.map((item)=>{
    //           if(item.length > 5){
    //             return item.substr(0,5)+'...';
    //           }
    //           return item;
    //         });
    //         this.objPieDeviceType.legend.data = arrNamesDeviceType;
    //       }
    //       if(this.dataPieDeviceType && this.dataPieDeviceType.length > 0){
    //         let arrDataDeviceType = this.dataPieDeviceType.map((item)=>{
    //           if(item.name.length > 5){
    //             item.name = item.name.substr(0,5)+'...';
    //           }
    //           return item;
    //         });
    //         this.objPieDeviceType.series[0].data = arrDataDeviceType;
    //       }
    //       this.chartPieDeviceType.setOption(this.objPieDeviceType,true);
    //       this.bodyWidthOldDeviceType = bodywidth;
    //       console.log('原来的值'+this.bodyWidthOldDeviceType);
    //   }else if(bodywidth <= 1366 && this.bodyWidthOldDeviceType > 1366){
    //       console.log('笔记本' + bodywidth);
    //       console.log('old'+this.bodyWidthOldDeviceType);
    //       if(this.dataPieDeviceTypeName && this.dataPieDeviceTypeName.length > 0){
    //         let arrNamesDeviceType = this.dataPieDeviceTypeName.map((item)=>{
    //           if(item.length > 3){
    //             return item.substr(0,3)+'...';
    //           }
    //           return item;
    //         });
    //         this.objPieDeviceType.legend.data = arrNamesDeviceType;
    //       }
    //       if(this.dataPieDeviceType && this.dataPieDeviceType.length > 0){
    //         let arrDataDeviceType = this.dataPieDeviceType.map((item)=>{
    //           if(item.name.length > 3){
    //             item.name = item.name.substr(0,3)+'...';
    //           }
    //           return item;
    //         });
    //         this.objPieDeviceType.series[0].data = arrDataDeviceType;
    //       }
    //       this.chartPieDeviceType.setOption(this.objPieDeviceType,true);
    //       this.bodyWidthOldDeviceType = bodywidth;
    //       console.log('原来的值'+this.bodyWidthOldDeviceType);
    //   }
    // },
    tabFirst(){
        this.isFirst = true;
    },
    tabSec(){
        this.isFirst = false;
    },
    handleClick(){
      this.chartGaugeEnergy.resize();
      this.chartGaugeEnergy.resize();
      this.chartGaugeCost.resize();
      this.chartGaugePower.resize();
      this.chartBarEnergy.resize();
      this.chartBarPower.resize();
      this.chartPieDevice.resize();
      this.chartPieArea.resize();
      this.chartPieDeviceType.resize();
    },
    drawCharts(){
      this.drawChartGaugeEnergy();
      this.drawChartGaugeCost();
      this.drawChartGaugePower();
      this.drawChartBarEnergy();
      this.drawChartBarPower();
      this.drawChartPieDevice();
      this.drawChartPieArea();
      this.drawChartPieDeviceType();
    },
    month(){
      this.period(0);
    },
    quarter(){
      this.period(1);
    },
    year(){
      this.period(2);
    },
    period(period){

        //柱状图-月，季，年
        // console.log(period);
        // console.log(this.formInline.office);
        let periodParams = {"flag":period, "officeId":this.formInline.office};
        getIndexBar(periodParams).then(data => {
          let { code } = data;
          if (code !== 200) {
            this.$message({
              message: data.msg,
              type: 'error'
            });
          }else {
            data.data.forEach((item)=>{
              if(item.name == "节能量"){

                this.sumSavePower = item.quantity;  //节能量
                this.timeListEnergy = item.xAxis; //日期数组
                this.objBarEnergy.xAxis[0].data = item.xAxis;

                this.energyList = item.yAxis;//节能数组
                this.objBarEnergy.series[0].data = item.yAxis;

                this.objBarEnergy.dataZoom[0].startValueEnergy = item.startTime;
                this.chartBarEnergy.setOption(this.objBarEnergy,true);

              }else if(item.name == "节能费用"){

                this.sumSaveMoney = item.quantity; //节省费用
                this.timeListPrice = item.xAxis; //日期数组
                this.objBarEnergy.xAxis[0].data = item.xAxis;

                this.priceList = item.yAxis;//节省费用数组
                this.objBarEnergy.series[1].data = item.yAxis;

                this.objBarEnergy.dataZoom[0].startValueEnergy = item.startTime;
                this.chartBarEnergy.setOption(this.objBarEnergy,true);

              }else if(item.name == "电量统计"){

                this.sumWorkPower = item.quantity; //电量统计
                this.timeListPower = item.xAxis; //日期数组
                this.objBarPower.xAxis.data = item.xAxis;

                this.powerList = item.yAxis;//电量数组
                this.objBarPower.series[0].data = item.yAxis;

                this.objBarPower.dataZoom[0].startValuePower = item.startTime;
                this.chartBarPower.setOption(this.objBarPower,true);

              }
            });
          }
        }).catch((error)=>{
          console.log(error);
        });
    },
    drawChartGaugeEnergy(){
      this.chartGaugeEnergy = this.$echarts.init(document.getElementById('chartGaugeEnergy'));
      let option1 = {
          tooltip : {
              formatter: "{a} <br/>{c} {b}"
          },
          toolbox: {
              show: true,
              feature: {
                  saveAsImage: {show: true}
              },
              right:20
          },
          series : [
              {
                  name: '本月节能',
                  type: 'gauge',
                  center: ['50%', '75%'],    // 默认全局居中
                  radius: '140%',
                  min:0,
                  max:6000,
                  startAngle:180,
                  endAngle:0,
                  splitNumber:4,
                  axisLine: {            // 坐标轴线
                      lineStyle: {       // 属性lineStyle控制线条样式
                          width: 35,
                          color:[[0.25, '#f3f587'], [0.5, '#aef873'], [0.75, '#50eb66'], [1, '#00d58c']]
                      }
                  },
                  axisTick: {            // 坐标轴小标记
                      length:40,        // 属性length控制线长
                      lineStyle: {       // 属性lineStyle控制线条样式
                          color: 'auto'
                      }
                  },
                  axisLabel:{
                      textStyle:{
                          color:"#000",
                          fontSize: 8
                      }
                    },
                  splitLine: {           // 分隔线
                      length:45,         // 属性length控制线长
                      lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                          color: 'auto'
                      }
                  },
                  pointer: {
                      width:4,
                      length:80
                  },
                  title : {
                      offsetCenter: [0, '-20%'],       // x, y，单位px
                      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                          fontWeight: 'bolder',
                          fontSize: 14,
                          fontStyle: 'italic'
                      }
                  },
                  detail: {
                  	offsetCenter:[0, '20%'],
                      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                          color:"#000",
                          fontSize:'18'
                      }
                  },
                  data:[{value: this.gaugeEnergy, name: 'kWh'}]
              }
          ]};
          this.chartGaugeEnergy.setOption(option1);
          this.objGaugeEnergy = option1;
    },
    drawChartGaugeCost(){
        this.chartGaugeCost = this.$echarts.init(document.getElementById('chartGaugeCost'));
        let option2 = {
          tooltip : {
              formatter: "{a} <br/>{c} {b}"
          },
          toolbox: {
              show: true,
              feature: {
                  saveAsImage: {show: true}
              },
              right:20
          },
          series : [
      		{
                  name: '本月节省费用',
                  type: 'gauge',
                  center: ['50%', '75%'],    // 默认全局居中
                  radius: '140%',
                  min:0,
                  max:6000,
                  startAngle:180,
                  endAngle:0,
                  splitNumber:4,
                  axisLine: {            // 坐标轴线
                      lineStyle: {       // 属性lineStyle控制线条样式
                          width: 35,
                          color:[[0.25, '#f3f587'], [0.5, '#aef873'], [0.75, '#50eb66'], [1, '#00d58c']]
                      }
                  },
                  axisTick: {            // 坐标轴小标记
                      length:40,        // 属性length控制线长
                      lineStyle: {       // 属性lineStyle控制线条样式
                          color: 'auto'
                      }
                  },
                  axisLabel:{
                      textStyle:{
                          color:"#000",
                          fontSize: 8
                      }
                    },
                  splitLine: {           // 分隔线
                      length:45,         // 属性length控制线长
                      lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                          color: 'auto'
                      }
                  },
                  pointer: {
                      width:4,
                      length:80
                  },
                  title : {
                      offsetCenter: [0, '-20%'],       // x, y，单位px
                      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                          fontWeight: 'bolder',
                          fontSize: 14,
                          fontStyle: 'italic'
                      }
                  },
                  detail: {
                  	offsetCenter:[0, '20%'],
                      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                          color:"#000",
                          fontSize:'18'
                      }
                  },
                  data:[{value: this.gaugeCost, name: '¥'}]
              }
          ]};
        this.chartGaugeCost.setOption(option2);
        this.objGaugeCost = option2;
    },
    drawChartGaugePower(){
        this.chartGaugePower = this.$echarts.init(document.getElementById('chartGaugePower'));
        let option3 = {
          tooltip : {
              formatter: "{a} <br/>{c} {b}"
          },
          toolbox: {
              show: true,
              feature: {
                  saveAsImage: {show: true}
              },
              right:20
          },
          series : [
          {
              name: '本月用电量',
              type: 'gauge',
              center: ['50%', '75%'],    // 默认全局居中
              radius: '140%',
              min:0,
              max:10000,
              startAngle:180,
              endAngle:0,
              splitNumber:4,
              axisLine: {            // 坐标轴线
                  lineStyle: {       // 属性lineStyle控制线条样式
                      width: 35,
                      // color:[[0.25, '#f3f587'], [0.5, '#aef873'], [0.75, '#50eb66'], [1, '#00d58c']]
                      color:[[0.25, '#00d58c'], [0.5, '#50eb66'], [0.75, '#aef873'], [1, '#f3f587']]
                  }
              },
              axisTick: {            // 坐标轴小标记
                  length:40,        // 属性length控制线长
                  lineStyle: {       // 属性lineStyle控制线条样式
                      color: 'auto'
                  }
              },
              axisLabel:{
                  textStyle:{
                      color:"#000",
                      fontSize: 8
                  }
                },
              splitLine: {           // 分隔线
                  length:45,         // 属性length控制线长
                  lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                      color: 'auto'
                  }
              },
              pointer: {
                      width:4,
                      length:80
              },
              title : {
                  offsetCenter: [0, '-20%'],       // x, y，单位px
                  textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                      fontWeight: 'bolder',
                      fontSize: 14,
                      fontStyle: 'italic'
                  }
              },
              detail: {
                offsetCenter:[0, '20%'],
                  textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                      color:"#000",
                      fontSize:'18'
                  }
              },
              data:[{value: this.gaugePower, name: 'kWh'}]
          }
          ]};
        this.chartGaugePower.setOption(option3);
        this.objGaugePower = option3;
    },
    drawChartBarEnergy(){
          this.chartBarEnergy = this.$echarts.init(document.getElementById('chartBarEnergy'));
          let option4 = {
                  tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                          type: 'cross',
                          crossStyle: {
                              color: '#999'
                          }
                      }
                  },
                  toolbox: {
                      feature: {
                          dataView: {
                            show: true,
                            readOnly: true,
                            buttonColor: '#00d58c',
                            optionToContent: function(opt) {
                                var axisData = opt.xAxis[0].data;
                                var series = opt.series;
                                var table = '<div class="dataview"><table cellspacing="0" cellpadding="0" style="width:100%;border-top:1px solid #ddd;border-left:1px solid #ddd;"><tbody><tr>'
                                             + '<td style="border-bottom:1px solid #ddd;border-right:1px solid #ddd;padding:8px 5px;text-align:center;">时间</td>'
                                             + '<td style="border-bottom:1px solid #ddd;border-right:1px solid #ddd;padding:8px 5px;text-align:center;">' + series[0].name + '</td>'
                                             + '<td style="border-bottom:1px solid #ddd;border-right:1px solid #ddd;padding:8px 5px;text-align:center;">' + series[1].name + '</td>'
                                             + '</tr>';
                                for (var i = 0, l = axisData.length; i < l; i++) {
                                  var series0 = null;
                                  var series1 = null;
                                  if(series[0].data[i]){
                                    series0 = series[0].data[i];
                                  }else{
                                    series0 = "";
                                  }
                                  if(series[1].data[i]){
                                    series1 = series[1].data[i];
                                  }else{
                                    series1 = "";
                                  }
                                    table += '<tr>'
                                             + '<td style="border-bottom:1px solid #ddd;border-right:1px solid #ddd;padding:8px 5px;text-align:center;">' + axisData[i] + '</td>'
                                             + '<td style="border-bottom:1px solid #ddd;border-right:1px solid #ddd;padding:8px 5px;text-align:center;">' + series0 + '</td>'
                                             + '<td style="border-bottom:1px solid #ddd;border-right:1px solid #ddd;padding:8px 5px;text-align:center;">' + series1 + '</td>'
                                             + '</tr>';
                                }
                                table += '</tbody></table></div>';
                                return table;
                            }
                          },
                          magicType: {show: true, type: ['line', 'bar']},
                          restore: {show: true},
                          saveAsImage: {show: true}
                      },
                      right:20
                  },
                  dataZoom: [{
                      startValue: this.startValueEnergy
                  }, {
                      type: 'inside'
                  }],
                  legend: {
                      data:['节能量','节能费用'],
                  },
                  xAxis: [
                      {
                          type: 'category',
                          data: this.timeListEnergy,//['1月','1月','1月','1月','1月','1月','1月','1月','1月','1月','1月','1月','1月'],
                          axisPointer: {
                              type: 'shadow'
                          },
                      }
                  ],
                  yAxis: [
                      {
                          type: 'value',
                          name: '电量',
      //	    	            min: 0,
      //	    	            max: 250,
      //	    	            interval: 50,
                          axisLabel: {
                              formatter: '{value} kwh'
                          }
                      },
                      {
                          type: 'value',
                          name: '电费',
      //	    	            min: 0,
      //	    	            max: 25,
      //	    	            interval: 5,
                          splitLine: {
                            show: false
                          },
                          axisLabel: {
                              formatter: '{value} 元'
                          }
                      }
                  ],
                  series: [
                      {
                          name:'节能量',
                          type:'bar',
                          barWidth:20,
                          itemStyle: {
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#22c3af'},
                                        {offset: 1, color: '#02bd82'}
                                    ]
                                ),
                                barBorderRadius: [10, 10, 0, 0]
                            },
                            emphasis: {
                                color: new this.$echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#02bd82'},
                                        {offset: 1, color: '#22c3af'}
                                    ]
                                )
                            }
                        },
                        data:this.energyList  //[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 150.2, 48.7, 18.8, 6.0, 2.3,20]
                      },
                      {
                          name:'节能费用',
                          type:'line',
                          barWidth:20,
                          itemStyle:{
          	                	normal:{
          	                		color:["#35d6fc"]
          	                	}
        	                },
      	    	            lineStyle:{
          	                	normal:{
          	                		color:["#35d6fc"]
          	                	}
        	                },
                          yAxisIndex: 1,
                          data:this.priceList//[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 26.5, 12.0, 6.2,18]
                      }
                  ]};
          this.chartBarEnergy.setOption(option4);
          this.objBarEnergy = option4;
    },
    drawChartBarPower(){
          this.chartBarPower = this.$echarts.init(document.getElementById('chartBarPower'));
          let option5 = {
                    tooltip: {
                      trigger: 'axis',
                      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                          type : 'cross'        // 默认为直线，可选为：'line' | 'shadow'
                      }
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            magicType: {type: ['line', 'bar']},
                            restore: {},
                            saveAsImage: {}
                        },
                        right:20
                    },
                    legend: {
                        data:['电量']
                    },
                    dataZoom: [{
                        startValue: this.startValuePower
                    }, {
                        type: 'inside'
                    }],
                    xAxis: {
                        data: this.timeListPower,//['4月', '4月', '4月', '4月', '4月', '4月']
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: '电量',
                        axisLabel: {
                            formatter: '{value} kwh'
                        }
                    },
                    series: [{
                        name: '电量',
                        type: 'bar',
                        barWidth:20,
                        itemStyle: {
                          normal: {
                              color: new this.$echarts.graphic.LinearGradient(
                                  0, 0, 0, 1,
                                  [
                                      {offset: 0, color: '#22c3af'},
                                      {offset: 1, color: '#02bd82'}
                                  ]
                              ),
                              barBorderRadius: [10, 10, 0, 0]
                          },
                          emphasis: {
                              color: new this.$echarts.graphic.LinearGradient(
                                  0, 0, 0, 1,
                                  [
                                      {offset: 0, color: '#02bd82'},
                                      {offset: 1, color: '#22c3af'}
                                  ]
                              )
                          }
                      },
                        data: this.powerList //[5, 20, 36, 10, 10, 20]
                    }]};
          this.chartBarPower.setOption(option5);
          this.objBarPower = option5;
    },
    drawChartPieDevice(){
        this.chartPieDevice = this.$echarts.init(document.getElementById('chartPieDevice'));
        let option6 = {
            tooltip: {
                 trigger: 'item',
                 formatter: "{a} <br/>{b}: {c} ({d}%)"
             },
             toolbox: {
                 feature: {
                     saveAsImage: {show: true}
                 },
                 right:20
             },
            //  color:['#015a86','#2d94b9', '#7ab7ff', '#8cdbf5', '#0f6ee8'],
             color:['#15d1a5','#fe7073', '#ffc84d', '#ffef97', '#c2e6da','#46c2e1', '#ff73c7', '#a872f9', '#ffad3a', '#0670a5'],
             legend: {
                 orient: 'vertical',
                 x: 'left',
                //  data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                data:this.dataPieDeviceName
             },
             series: [
                 {
                     name:'本月设备类型节能情况',
                     type:'pie',
                     center: ['65%', '50%'],
                     radius: ['50%', '70%'],
                     avoidLabelOverlap: false,
                     label: {
                         normal: {
                             show: false,
                             position: 'center',
                         },
                         emphasis: {
                             show: true,
                             textStyle: {
                                 fontSize: '30',
                                 fontWeight: 'bold'
                             }
                         }
                     },
                     labelLine: {
                         normal: {
                             show: false
                         }
                     },
                     data:this.dataPieDevice
                    // data:[
                    //     {value:335, name:'直接访问'},
                    //     {value:310, name:'邮件营销'},
                    //     {value:234, name:'联盟广告'},
                    //     {value:135, name:'视频广告'},
                    //     {value:1548, name:'搜索引擎'}
                    // ]
                 }
             ]};
        this.chartPieDevice.setOption(option6);
        this.objPieDevice = option6;
    },
    drawChartPieArea(){
        this.chartPieArea = this.$echarts.init(document.getElementById('chartPieArea'));
        let option7 = {
          tooltip: {
    	    		        trigger: 'item',
    	    		        formatter: "{a} <br/>{b}: {c} ({d}%)"
    	    		    },
    	    		    toolbox: {
    	    		        feature: {
    	    		            saveAsImage: {show: true}
    	    		        },
                      right:20
    	    		    },
                  color:['#fe7073','#ffc84d', '#ffef97', '#c2e6da', '#46c2e1','#ff73c7', '#a872f9', '#ffad3a', '#0670a5', '#15d1a5'],
    	    		    legend: {
    	    		        orient: 'vertical',
    	    		        x: 'left',
    	    		        // data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                      data:this.dataPieAreaName
    	    		    },
    	    		    series: [
    	    		        {
    	    		            name:'本月区域节能情况',
    	    		            type:'pie',
                          center: ['65%', '50%'],
    	    		            radius: ['50%', '70%'],
    	    		            avoidLabelOverlap: false,
    	    		            label: {
    	    		                normal: {
    	    		                    show: false,
    	    		                    position: 'center'
    	    		                },
    	    		                emphasis: {
    	    		                    show: true,
    	    		                    textStyle: {
    	    		                        fontSize: '30',
    	    		                        fontWeight: 'bold'
    	    		                    }
    	    		                }
    	    		            },
    	    		            labelLine: {
    	    		                normal: {
    	    		                    show: false
    	    		                }
    	    		            },
    	    		            data:this.dataPieDeviceArea
    	    		        }
    	    		    ]};
        this.chartPieArea.setOption(option7);
        this.objPieArea = option7;
    },
    drawChartPieDeviceType(){
        this.chartPieDeviceType = this.$echarts.init(document.getElementById('chartPieDeviceType'));
        let option8 = {
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          toolbox: {
              feature: {
                  saveAsImage: {show: true}
              },
              right:20
          },
          color:['#ffc84d','#ffef97', '#c2e6da', '#46c2e1', '#ff73c7','#a872f9', '#ffad3a', '#0670a5', '#15d1a5', '#fe7073'],
          legend: {
              orient: 'vertical',
              x: 'left',
              // data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
              data:this.dataPieDeviceTypeName
          },
          series: [
              {
                  name:'本月设备类型用电情况',
                  type:'pie',
                  center: ['65%', '50%'],
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                      normal: {
                          show: false,
                          position: 'center'
                      },
                      emphasis: {
                          show: true,
                          textStyle: {
                              fontSize: '30',
                              fontWeight: 'bold'
                          }
                      }
                  },
                  labelLine: {
                      normal: {
                          show: false
                      }
                  },
                  data:this.dataPieDeviceType
              }
          ]};
        this.chartPieDeviceType.setOption(option8);
        this.objPieDeviceType = option8;
    },
  }
}
</script>

<style lang="scss" scoped>
  #chartGaugeEnergy,#chartGaugeCost,#chartGaugePower{
    width:100%;
    height:180px;
  }
  #chartBarEnergy,#chartBarPower{
    width:100%;
    height:400px;
  }
  #chartPieDevice,#chartPieArea,#chartPieDeviceType{
    width:100%;
    height:300px;
  }
  .index-tabs{
    display: flex;
  	background:#f7f7f7;
  }
  .index-tabs li{
  	width:50%;
    text-align: center;
    cursor: pointer;
  	color:#32323b;
    padding: 15px 0;
    margin-bottom: -1px;
  }
  .index-tabs .active{
    border: 1px solid #ccc;
  	border-bottom-color: transparent;
    border-radius: 4px 4px 0 0;
    background: #fff;
    margin-right: -2px;
  	background:#fff;
    z-index: 2;
  }
  .index-tabs > li >a p{
    margin-bottom: 12px;
  	font-size:14px;
  }
  .index-tabs > li >a label{
  	font-size:18px;
  }
  .tab-content{
    position: relative;
  }
  .tab-pane{
    opacity: 0;
    padding: 25px 0;
  }
  .tab-show{
    opacity: 1;
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }




  .gauge{
  	display:flex;
  	width:100%;
  	margin-top:30px;
  }
  .chart-gauge{
  	flex:1;
  	/* min-width:400px; */
  	padding:10px;
  	background: #fff;
  	box-shadow:1px 1px 3px rgba(0,0,0,0.2);
  	margin-right:60px;
  }
  .chart-gauge:last-child{
  	margin-right: 0;
  }
  .chart-gauge h5{
  	height:45px;
  	padding-left:15px;
  	font-size:14px;
    font-weight: normal;
  	color:#32323b;
  	border-bottom:1px solid #ccc;
  	line-height:35px;
  }
  .chart-gauge em{
  	display:block;
  	width:22px;
  	height:22px;
  	float:right;
  	margin:5px 15px 0 0;
  }
  .pieNotData{
    height: 300px;
    line-height: 300px;
    text-align: center;
    font-size: 14px;
  }
  .icon-gauge-energy-statistics{
  	background:url(../assets/img/icon_energy.png) no-repeat;
  }
  .icon-gauge-energy-cost{
  	background:url(../assets/img/icon_money.png) no-repeat;
  }
  .icon-gauge-power-statistics{
  	background:url(../assets/img/icon_electricity.png) no-repeat;
  }
  .index-data-wrap{
  	border-top:1px solid #ccc;
  	padding:10px 25px;
  	color:#32323b;
  	font-size:14px;
  }
  .index-data-wrap .el-col-12:nth-of-type(2){
  	border-left:1px solid #ccc;
  }
  .index-data-wrap label{
  	font-size:24px;
  }
  .data-upper{
  	background:url(../assets/img/icon_up.png) no-repeat 0 2px;
  	margin-left:20px;
  	padding-left:20px;
  	color:#00d58c;
  }
  .data-lower{
  	background:url(../assets/img/icon_down.png) no-repeat 0 2px;
  	margin-left:20px;
  	padding-left:20px;
  	color:#f84a51;
  }
  .power-statistics-wrap{
  	padding:30px;
  	margin-top:30px;
  	background:#fff;
  	box-shadow:1px 1px 3px rgba(0,0,0,0.2);
  }
  .index-title{
  	font-size:14px;
  	color:#32323b;
  }
  .btns-date{
  	padding:30px;
  	text-align:center;
  }
  .btns-date button{
  	margin-right:60px;
  }
  .btns-date button:last-child{
  	margin-right:0;
  }

  .tab-pane{
  	border:1px solid #ccc;
  }
  .tab-energy{
  	text-align:left;
  }
  .p-chart-color{
  	position:relative;
  	padding-left:20px;
  }
  .p-chart-color em{
  	display:block;
  	width:12px;
  	height:12px;
  	position:absolute;
  	top:4px;
  	left:0;
  }
  .icon-color-number{
  	background:#0099e1;
  }
  .icon-color-cost{
  	background:#9fe4f1;
  }
</style>
