<template lang="html">
    <li class="cardStyle card">
      <el-row :gutter="20" class="office-base">
          <el-col :span="20"><label class="text-right" style="width:170px;display:block; float:left; margin-right:15px;">办公室：</label>{{data.family.familyName}}</el-col>
          <el-col :span="3" class="text-right"><i class="el-icon-d-arrow-right" :class="{'active':isSlide}" @click="panelHide"></i></el-col>
      </el-row>
      <div v-show="isSlide">
          <!-- 作息时间 -->
          <p class="tit-base">
              作息时间
              <span class="timeTip">（* 根据作息时间，将定时执行所选情景）</span>
          </p>
          <el-form label-width="200px">
            <el-row>
                <el-col :span="24">
                  <el-form-item label="上班周期：">
                    <el-checkbox-group v-model="dataList.weekList" fill="#00d58c">
                      <el-checkbox-button v-for="days in weeklist" :label="days.id" :key="days.id">{{days.value}}</el-checkbox-button>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              <el-col :span="14">
                  <el-form-item label="上班时间：">
                    <span @click="openMorningScene">
                      <el-time-picker
                        v-model="morningTime"
                        format="HH:mm"
                        >
                      </el-time-picker>
                    </span>
                  </el-form-item>
                  <el-form-item label=" ">
                    <el-tag
                      v-for="morning in tagMorningScene"
                      :key="morning.sceneno"
                      :closable="true"
                      :close-transition="false"
                      @close="morningClose(morning)"
                    >
                        {{morning.scenename}}
                    </el-tag>
                  </el-form-item>
              </el-col>
                <el-col :span="10" class="wrap-scene-list">
                    <div class="base-scene-list base-scene-list-top" v-show="morningScene">
                        <p>选择上班时间情景</p>
                        <div>
                          <!-- 上班时间 -->
                          <el-checkbox-group v-model="checkboxGroupSceneMorning">
                             <el-checkbox v-for="mscene in sceneList" :label="mscene.sceneno" :key="mscene.sceneno" @change="checkMorning(mscene,mscene.sceneno,mscene.scenename)">{{mscene.scenename}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                    </div>
                </el-col>
                <el-col :span="14">
                    <el-form-item label="午休时间：">
                      <span @click="openNoonScene">
                        <el-time-picker
                          v-model="noonTime"
                          format="HH:mm"
                          >
                        </el-time-picker>
                      </span>
                    </el-form-item>
                    <el-form-item label=" ">
                      <el-tag
                        v-for="noon in tagNoonScene"
                        :key="noon.sceneno"
                        :closable="true"
                        :close-transition="false"
                        @close="noonClose(noon)"
                      >
                          {{noon.scenename}}
                      </el-tag>
                    </el-form-item>
                </el-col>
                <el-col :span="10" class="wrap-scene-list">
                  <div class="base-scene-list base-scene-list-top" v-show="noonScene">
                      <p>选择午休时间情景</p>
                      <div>
                          <!-- 午休时间 -->
                          <el-checkbox-group v-model="checkboxGroupSceneNoon">
                             <el-checkbox v-for="nscene in sceneList" :label="nscene.sceneno" :key="nscene.sceneno" @change="checkNoon(nscene,nscene.sceneno,nscene.scenename)">{{nscene.scenename}}</el-checkbox>
                          </el-checkbox-group>
                      </div>
                  </div>
                </el-col>
              <el-col :span="14">
                  <el-form-item label="下午上班时间：">
                    <span @click="openAfternoonScene">
                      <el-time-picker
                        v-model="afternoonTime"
                        format="HH:mm"
                        >
                      </el-time-picker>
                    </span>
                  </el-form-item>
                  <el-form-item label=" ">
                      <el-tag
                        v-for="afternoon in tagAfternoonScene"
                        :key="afternoon.sceneno"
                        :closable="true"
                        :close-transition="false"
                        @close="afternoonClose(afternoon)"
                      >
                          {{afternoon.scenename}}
                      </el-tag>
                  </el-form-item>
              </el-col>
              <el-col :span="10" class="wrap-scene-list">
                  <div class="base-scene-list base-scene-list-middle" v-show="afternoonScene">
                      <p>选择下午上班时间情景</p>
                      <div>
                        <!-- 下午上班时间 -->
                        <el-checkbox-group v-model="checkboxGroupSceneAfternoon">
                           <el-checkbox v-for="ascene in sceneList" :label="ascene.sceneno" :key="ascene.sceneno" @change="checkAfternoon(ascene,ascene.sceneno,ascene.scenename)">{{ascene.scenename}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                  </div>
              </el-col>
              <el-col :span="14">
                  <el-form-item label="下班时间：">
                    <span @click="openEndWorkScene">
                      <el-time-picker
                        v-model="endWorkTime"
                        format="HH:mm"
                        >
                      </el-time-picker>
                    </span>
                  </el-form-item>
                  <el-form-item label=" ">
                      <el-tag
                        v-for="endWork in tagEndWordScene"
                        :key="endWork.sceneno"
                        :closable="true"
                        :close-transition="false"
                        @close="endWorkClose(endWork)"
                      >
                          {{endWork.scenename}}
                      </el-tag>
                  </el-form-item>
              </el-col>
              <el-col :span="10" class="wrap-scene-list">
                  <div class="base-scene-list base-scene-list-bottom" v-show="endWorkScene">
                      <p>选择下班时间情景</p>
                      <div>
                        <!-- 下班时间 -->
                        <el-checkbox-group v-model="checkboxGroupSceneEndWork">
                           <el-checkbox v-for="escene in sceneList" :label="escene.sceneno" :key="escene.sceneno" @change="checkEndWord(escene,escene.sceneno,escene.scenename)">{{escene.scenename}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                  </div>
              </el-col>
              <el-col :span="14">
                  <el-form-item label="加班下班时间：">
                    <span @click="openEndExtraWorkScene">
                      <el-time-picker
                        v-model="endExtraWorkTime"
                        format="HH:mm"
                        >
                      </el-time-picker>
                    </span>
                  </el-form-item>
                  <el-form-item label=" ">
                      <el-tag
                        v-for="endExtraWork in tagEndExtraWorkScene"
                        :key="endExtraWork.sceneno"
                        :closable="true"
                        :close-transition="false"
                        @close="endExtraWorkClose(endExtraWork)"
                      >
                          {{endExtraWork.scenename}}
                      </el-tag>
                  </el-form-item>
              </el-col>
              <el-col :span="10" class="wrap-scene-list">
                  <div class="base-scene-list base-scene-list-bottom" v-show="endExtraWorkScene">
                      <p>选择加班下班时间情景</p>
                      <div>
                        <!-- 加班下班时间 -->
                        <el-checkbox-group v-model="checkboxGroupSceneEndExtraWork">
                           <el-checkbox v-for="eescene in sceneList" :label="eescene.sceneno" :key="eescene.sceneno" @change="checkEndExtraWork(eescene,eescene.sceneno,eescene.scenename)">{{eescene.scenename}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                  </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="office-base">
                <el-col :span="24">
                      <!-- 其他预设 -->
                      <p class="tit-base">
                          其他预设
                      </p>
                      <el-form-item label="健康饮水时间：">
                        <el-time-picker
                          v-model="healthWaterStar"
                          format="HH:mm"
                          >
                        </el-time-picker>
                        -
                        <el-time-picker
                          v-model="healthWaterEnd"
                          format="HH:mm"
                          >
                        </el-time-picker>
                      </el-form-item>
                      <el-form-item label="空调舒适度：" class="wrap-air">
                        当空调设定温度低于
                        <el-input v-model="airLow"></el-input>
                        度以下，空调自动调控到
                        <el-input v-model="airUp" prop="airUpRule"></el-input>
                        度。
                      </el-form-item>
                </el-col>
                <el-col :span="24" class="text-center btns-submit">
                  <el-button type="primary" @click="submitForm(refresh)" :loading="btnSaveLoading">保存</el-button>
                </el-col>
            </el-row>
          </el-form>
      </div>
    </li>
</template>

<script>
import { getOfficeSceneList,updateBaseSetting } from '../../../api/api'
// import ListMorning from './ListMorning'
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
    props:['data','refresh'],
    data(){
      // let week = this.data.weekList.map((item)=>{
      //   return '一二三四五六七'[item-1];
      // });
      // this.checkboxGroup = week;
      return{
        isSlide:false,
        btnSaveLoading:false,
        dataList:this.data,
        sceneList:[],
        weeklist: daysOptions,
        morningTime:'',
        noonTime:'',
        afternoonTime:'',
        endWorkTime:'',
        endExtraWorkTime:'',
        healthWaterStar:'',
        healthWaterEnd:'',
        airLow:'',
        airUp:'',
        checkboxGroupSceneMorning:[],
        checkboxGroupSceneNoon:[],
        checkboxGroupSceneAfternoon:[],
        checkboxGroupSceneEndWork:[],
        checkboxGroupSceneEndExtraWork:[],
        arrMorning:[],
        arrNoon:[],
        arrAfternoon:[],
        arrEndWork:[],
        arrEndExtraWork:[],
        morningScene:false,
        noonScene:false,
        afternoonScene:false,
        endWorkScene:false,
        endExtraWorkScene:false,
        tagMorningScene:[],
        tagNoonScene:[],
        tagAfternoonScene:[],
        tagEndWordScene:[],
        tagEndExtraWorkScene:[],
      }
    },
    created(){
        this.ready();
    },
    methods:{
      panelHide(){
        this.isSlide = !this.isSlide;
      },
      ready(){
        // let scenelistParams = {'familyId':this.dataList.family.familyid};
        let scenelistParams = {'familyId':this.dataList.family.familyId};
        getOfficeSceneList(scenelistParams).then(data=>{
          let {msg,code} = data;
          if (code !== 200) {
            this.$message({
              message: data.msg,
              type: 'error'
            });
          }else{
            // console.log(data.data);
            this.sceneList = data.data;
          }
        }).catch(error=>{
          console.log(error);
        });
        //
        //   console.log(this.dataList);
        // console.log(this.dataList.weekList);
        // console.log(this.dataList.startWorkTimeScene);
        this.tagMorningScene = this.dataList.startWorkTimeScene.filter(function (item) {
          return item
        });
        this.tagNoonScene = this.dataList.noonTimeScene.filter(function (item) {
          return item
        });
        this.tagAfternoonScene = this.dataList.startWorkTimeAfternoonScene.filter(function (item) {
          return item
        });
        this.tagEndWordScene = this.dataList.endWorkTimeAfternoonScene.filter(function (item) {
          return item
        });
        this.tagEndExtraWorkScene = this.dataList.endExtraWorkTimeScene.filter(function (item) {
          return item
        });


        if(this.dataList.startWorkTimeScene.length >0){
          let resM = this.dataList.startWorkTimeScene.map((item)=>{
              return item.sceneno;
          });
          // console.log(resM);
          this.checkboxGroupSceneMorning = resM;
        }

        if(this.dataList.noonTimeScene.length >0){
          let resN = this.dataList.noonTimeScene.map((item)=>{
              return item.sceneno;
          });
          // console.log(resN);
          this.checkboxGroupSceneNoon = resN;
        }

        if(this.dataList.startWorkTimeAfternoonScene.length >0){
          let resA = this.dataList.startWorkTimeAfternoonScene.map((item)=>{
              return item.sceneno;
          });
          // console.log(resA);
          this.checkboxGroupSceneAfternoon = resA;
        }

        if(this.dataList.endWorkTimeAfternoonScene.length >0){
          let resE = this.dataList.endWorkTimeAfternoonScene.map((item)=>{
              return item.sceneno;
          });
          // console.log(resE);
          this.checkboxGroupSceneEndWork = resE;
        }

        if(this.dataList.endExtraWorkTimeScene.length > 0){
            let resEE = this.dataList.endExtraWorkTimeScene.map((item)=>{
                return item.sceneno;
            });
            // console.log(resEE);
            this.checkboxGroupSceneEndExtraWork = resEE;
        }

        // console.log(this.data.baseSetting.startWorkTimeMorning);
        if(this.data.baseSetting.startWorkTimeMorningHour && this.data.baseSetting.startWorkTimeMorningHour != ''){
            this.morningTime = new Date(2017, 1, 1, parseInt(this.data.baseSetting.startWorkTimeMorningHour), parseInt(this.data.baseSetting.startWorkTimeMorningMinute), 0);
        }

        if(this.data.baseSetting.noonBreakTimeHour && this.data.baseSetting.noonBreakTimeHour != ''){
            this.noonTime = new Date(2017, 1, 1, parseInt(this.data.baseSetting.noonBreakTimeHour), parseInt(this.data.baseSetting.noonBreakTimeMinute), 0);
        }

        // console.log(this.data.baseSetting.startWorkTimeAfternoon);
        if(this.data.baseSetting.startWorkTimeAfternoonHour && this.data.baseSetting.startWorkTimeAfternoonHour != ''){
            this.afternoonTime = new Date(2017, 1, 1, parseInt(this.data.baseSetting.startWorkTimeAfternoonHour), parseInt(this.data.baseSetting.startWorkTimeAfternoonMinute), 0);
        }

        if(this.data.baseSetting.endWorkTimeAfternoonHour && this.data.baseSetting.endWorkTimeAfternoonHour != ''){
            this.endWorkTime = new Date(2017, 1, 1, parseInt(this.data.baseSetting.endWorkTimeAfternoonHour), parseInt(this.data.baseSetting.endWorkTimeAfternoonMinute), 0);
        }

        if(this.data.baseSetting.endExtraWorkTimeHour && this.data.baseSetting.endExtraWorkTimeHour != ''){
            this.endExtraWorkTime = new Date(2017, 1, 1, parseInt(this.data.baseSetting.endExtraWorkTimeHour), parseInt(this.data.baseSetting.endExtraWorkTimeMinute), 0);
        }

        if(this.data.baseSetting.healthWaterStartTimeHour && this.data.baseSetting.healthWaterStartTimeHour != ''){
            this.healthWaterStar = new Date(2017, 1, 1, parseInt(this.data.baseSetting.healthWaterStartTimeHour),parseInt(this.data.baseSetting.healthWaterStartTimeMinute),0);
        }

        if(this.data.baseSetting.healthWaterEndTimeHour && this.data.baseSetting.healthWaterEndTimeHour != ''){
            this.healthWaterEnd = new Date(2017, 1, 1, parseInt(this.data.baseSetting.healthWaterEndTimeHour),parseInt(this.data.baseSetting.healthWaterEndTimeMinute),0);
        }

        // console.log(this.data.baseSetting.settingLowTemperature);
        if(this.data.baseSetting.settingLowTemperature && this.data.baseSetting.settingLowTemperature != ''){
            this.airLow = this.data.baseSetting.settingLowTemperature.toString();
        }

        if(this.data.baseSetting.suitableTemperature && this.data.baseSetting.suitableTemperature != ''){
            this.airUp = this.data.baseSetting.suitableTemperature.toString();
        }
          // console.log(`familyId: ${this.dataList.family.familyid}`);
          // console.log(`settingId: ${this.dataList.baseSetting.id}`);

      },
      submitForm(refresh) {

        // if(!Number.isInteger(Number(this.airLow))){
        //   this.$message({
        //     message:'空调设定温度请输入整数',
        //     type:'warning'
        //   });
        //   return false;
        // }
        // if(!Number.isInteger(Number(this.airUp))){
        //   this.$message({
        //     message:'空调设定温度请输入整数',
        //     type:'error'
        //   });
        //   return false;
        // }
        if(!Number.isInteger(Number(this.airLow)) || !Number.isInteger(Number(this.airUp))){
          this.$message({
            message:'空调舒适度请输入整数',
            type:'warning'
          });
          return false;
        }else{

        // let morningTime = '';
        // console.log(this.morningTime);
        this.btnSaveLoading = true;
        let mtime = '';
        if(this.morningTime && this.morningTime != ''){
          mtime = `${this.parseInt0(this.morningTime.getHours())}:${this.parseInt0(this.morningTime.getMinutes())}`;
            // this.morningTime = `${this.parseInt0(this.morningTime.getHours())}:${this.parseInt0(this.morningTime.getMinutes())}`;
        }else{
          mtime = '';
        }

        // let noonTime = '';
        // console.log(this.noonTime);
        let ntime = '';
        if(this.noonTime && this.noonTime != ''){
          ntime = `${this.parseInt0(this.noonTime.getHours())}:${this.parseInt0(this.noonTime.getMinutes())}`;
        }else{
          ntime = '';
        }

        // let afternoonTime = '';
        let atime = '';
        if(this.afternoonTime && this.afternoonTime != ''){
          atime = `${this.parseInt0(this.afternoonTime.getHours())}:${this.parseInt0(this.afternoonTime.getMinutes())}`;
        }else{
          atime = '';
        }

        // let endWorkTime = '';
        let etime = '';
        if(this.endWorkTime && this.endWorkTime != ''){
          etime = `${this.parseInt0(this.endWorkTime.getHours())}:${this.parseInt0(this.endWorkTime.getMinutes())}`;
        }else{
          etime = '';
        }

        let eetime = '';
        // let endExtraWorkTime = '';
        if(this.endExtraWorkTime && this.endExtraWorkTime != ''){
          eetime = `${this.parseInt0(this.endExtraWorkTime.getHours())}:${this.parseInt0(this.endExtraWorkTime.getMinutes())}`;
        }else{
          eetime = '';
        }

        // let healthWaterStar = '';
        let hstar = '';
        if(this.healthWaterStar && this.healthWaterStar != ''){
          hstar = `${this.parseInt0(this.healthWaterStar.getHours())}:${this.parseInt0(this.healthWaterStar.getMinutes())}`;
        }else{
          hstar = '';
        }

        // let healthWaterEnd = '';
        let hend = '';
        if(this.healthWaterEnd && this.healthWaterEnd != ''){
            hend = `${this.parseInt0(this.healthWaterEnd.getHours())}:${this.parseInt0(this.healthWaterEnd.getMinutes())}`;
        }else{
          hend = '';
        }

        if(this.tagMorningScene.length >0){
          this.tagMorningScene.map((item)=>{
              this.arrMorning.push(item.sceneno);
          });
        }

        if(this.tagNoonScene.length >0){
          this.tagNoonScene.map((item)=>{
              this.arrNoon.push(item.sceneno);
          });
        }

        if(this.tagAfternoonScene.length >0){
          this.tagAfternoonScene.map((item)=>{
              this.arrAfternoon.push(item.sceneno);
          });
        }

        if(this.tagEndWordScene.length >0){
          this.tagEndWordScene.map((item)=>{
              this.arrEndWork.push(item.sceneno);
          });
        }

        if(this.tagEndExtraWorkScene.length >0){
          this.tagEndExtraWorkScene.map((item)=>{
              this.arrEndExtraWork.push(item.sceneno);
          });
        }


        // console.log(mtime);
        let updateParams = {
          // 'familyId':this.dataList.family.familyid,
          'familyId':this.dataList.family.familyId,
          'settingId':this.dataList.baseSetting.id,//基础设置ID
          'endExtraWorkTime':eetime,//加班下班时间 如：09:00
          'endWorkTimeAfternoon':etime,//下班时间 如：09:00
          'healthWaterEndTime':hend,//健康饮水结束时间 如：09:00
          'healthWaterStartTime':hstar,//健康饮水开始时间 如：09:00
          'noonBreakTime':ntime,//午休时间 如：09:00
          'settingLowTemperature':this.airLow,//空调设定温度
          'startWorkTimeAfternoon':atime,//下午上班时间 如：09:00
          'startWorkTimeMorning':mtime,//上班时间 如：09:00
          'suitableTemperature':this.airUp,//空调自动调控温度
          'week':this.dataList.weekList,//this.checkboxGroupWeek,//上班周期 格式为：[1,2,3,4]
          'sceneByStartWorkTime':this.arrMorning,//上班时间对应的情景，后台接收的格式为：["情景编号1","情景编号2".....]
          'sceneByNoonTime':this.arrNoon,//午休时间对应的情景，后台接收的格式为：["情景编号1","情景编号2".....]
          'sceneByStartWorkTimeAfternoon':this.arrAfternoon,//下午上班时间时间对应的情景
          'sceneByEndWorkTimeAfternoon':this.arrEndWork,//下班时间对应的情景
          'sceneByEndExtraWorkTime':this.arrEndExtraWork//加班下班时间对应的情景
        };
        updateBaseSetting(updateParams).then(data=>{

          let { code,msg} = data;
          if(code != 200){
            this.$message({
              message: data.msg,
              type: 'error'
            });
            this.btnSaveLoading = false;
          }else{
            // alert('submit!');
            this.$message({
              message: data.data,
              type: 'success'
            });
            this.arrMorning = [];
            this.arrNoon = [];
            this.arrAfternoon = [];
            this.arrEndWork = [];
            this.arrEndExtraWork = [];
            refresh();
          }
        }).catch(error=>{
          console.error(error);
        });


        }
      },
      parseInt0(num){
          if(parseInt(num) <10){
            return '0'+ num;
          }else{
            return num;
          }
      },
      openMorningScene(){
        this.morningScene = true;
        this.noonScene = false;
        this.afternoonScene = false;
        this.endWorkScene = false;
        this.endExtraWorkScene = false;
      },
      openNoonScene(){
        this.morningScene = false;
        this.noonScene = true;
        this.afternoonScene = false;
        this.endWorkScene = false;
        this.endExtraWorkScene = false;
      },
      openAfternoonScene(){
        this.morningScene = false;
        this.noonScene = false;
        this.afternoonScene = true;
        this.endWorkScene = false;
        this.endExtraWorkScene = false;
      },
      openEndWorkScene(){
        this.morningScene = false;
        this.noonScene = false;
        this.afternoonScene = false;
        this.endWorkScene = true;
        this.endExtraWorkScene = false;
      },
      openEndExtraWorkScene(){
        this.morningScene = false;
        this.noonScene = false;
        this.afternoonScene = false;
        this.endWorkScene = false;
        this.endExtraWorkScene = true;
      },
      morningClose(morning){
        // console.log("删除上班时间情景");
        // this.dataList.startWorkTimeScene.splice(this.dataList.startWorkTimeScene.indexOf(morning), 1);
        this.tagMorningScene.splice(this.tagMorningScene.indexOf(morning), 1);
        this.checkboxGroupSceneMorning.splice(this.checkboxGroupSceneMorning.indexOf(morning.sceneno), 1);
      },
      noonClose(noon){
        // console.log("删除午休时间情景");
        this.tagNoonScene.splice(this.tagNoonScene.indexOf(noon), 1);
        this.checkboxGroupSceneNoon.splice(this.checkboxGroupSceneNoon.indexOf(noon.sceneno), 1);
      },
      afternoonClose(afternoon){
        // console.log("删除下午上班时间情景");
        this.tagAfternoonScene.splice(this.tagAfternoonScene.indexOf(afternoon), 1);
        this.checkboxGroupSceneAfternoon.splice(this.checkboxGroupSceneAfternoon.indexOf(noon.sceneno), 1);
      },
      endWorkClose(endWork){
        // console.log("删除下班时间情景");
        this.tagEndWordScene.splice(this.tagEndWordScene.indexOf(endWork), 1);
        this.checkboxGroupSceneEndWork.splice(this.checkboxGroupSceneEndWork.indexOf(noon.sceneno), 1);
      },
      endExtraWorkClose(endExtraWork){
        // console.log("删除加班下班时间情景");
        this.tagEndExtraWorkScene.splice(this.tagEndExtraWorkScene.indexOf(endExtraWork), 1);
        this.checkboxGroupSceneEndExtraWork.splice(this.checkboxGroupSceneEndExtraWork.indexOf(endExtraWork), 1);
      },
      checkMorning(item,sceneno,scenename){
        if(event.target.checked){
            this.tagMorningScene.push({'scenename':scenename,'sceneno':sceneno});
        }else{
            this.tagMorningScene.splice(this.tagMorningScene.indexOf(item),1);
        }
      },
      checkNoon(item,sceneno,scenename){
        if(event.target.checked){
            this.tagNoonScene.push({'scenename':scenename,'sceneno':sceneno});
        }else{
            this.tagNoonScene.splice(this.tagNoonScene.indexOf(item),1);
        }
      },
      checkAfternoon(item,sceneno,scenename){
        if(event.target.checked){
            this.tagAfternoonScene.push({'scenename':scenename,'sceneno':sceneno});
        }else{
            this.tagAfternoonScene.splice(this.tagAfternoonScene.indexOf(item),1);
        }
      },
      checkEndWord(item,sceneno,scenename){
        if(event.target.checked){
            this.tagEndWordScene.push({'scenename':scenename,'sceneno':sceneno});
        }else{
            this.tagEndWordScene.splice(this.tagEndWordScene.indexOf(item),1);
        }
      },
      checkEndExtraWork(item,sceneno,scenename){
        if(event.target.checked){
            this.tagEndExtraWorkScene.push({'scenename':scenename,'sceneno':sceneno});
        }else{
            this.tagEndExtraWorkScene.splice(this.tagEndExtraWorkScene.indexOf(item),1);
        }
      }
    }
}
</script>

<style lang="scss" scoped>
  .card{
    margin-bottom: 30px;
  }
  .office-base{
    // padding: 15px 0;
    // height:60px;
    color: #48576a;
    line-height: 24px;
    .el-icon-d-arrow-right{
      font-size: 20px;
      color: #00d58c;
      transform: rotate(90deg);
      transition: 500ms;
      cursor: pointer;
    }
    .el-icon-d-arrow-right.active{
      transform: rotate(-90deg);
    }
  }
  .tit-base{
    border-left: 4px solid #00d58c;
    padding-left: 22px;
    margin: 30px 0 30px 20px;
    font-size: 16px;
    .timeTip{
      color: #a7a7a7;
    }
  }
  .el-tag{
    margin-right: 10px;
  }
  .wrap-air .el-input{
      width: 80px;
  }
  .wrap-scene-list{
    position: relative;
  }
  .base-scene-list-top{
    top: 0;
  }
  .base-scene-list-middle{
    top: -100px;
  }
  .base-scene-list-bottom{
    top: -250px;
  }
  .base-scene-list{
    position: absolute;
    left: 0;
    border: 1px solid #00d58c;
    padding: 30px 0px 30px 30px;
    width: 250px;
    p{
      font-size: 16px;
    }
    >div{
      height: 500px;
      overflow-x: hidden;
      overflow-y: auto;
      padding-top:30px;
    }
    .el-checkbox-group label{
      width: 100%;
      margin-bottom: 20px;
    }
    .el-checkbox+.el-checkbox{
      margin-left: 0;
    }
  }
  .btns-submit{
    padding: 30px 0;
    button{
      min-width: 80px;
    }
  }
</style>
