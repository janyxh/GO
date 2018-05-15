<template>
  <section>
    <div class="navHeadBtns">
      <el-button @click="addTiming">添加定时任务</el-button>
    </div>
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="170px">
      <p class="tit-green-border">情景信息</p>
      <div class="cardStyle">
        <el-row :gutter="20">
          <el-col :offset="2" :span="8">
            <el-form-item label="情景图标：">
              <em class="icon-scene-sm" :class="'scene_icon_'+ scene.pic"></em>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="8">
            <el-form-item label="情景名称：" prop="name">
              <el-input v-model="form.name" placeholder="请输入情景名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :offset="2" :span="8">
            <el-form-item label="办公室：">
              <el-input
                v-model="scene.familyName"
                :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="8">
            <el-form-item label="创建时间：">
              <el-input
                v-model="scene.createTimeString"
                :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
              <el-col :span="2">
                &nbsp;
              </el-col>
              <label class="text-right" style="width:108px; color:#121212;font-size: 16px; line-height: 1;padding: 15px 50px 15px 0; display:block; float:left;" v-if="scenebinds.length > 0">
                执行任务：
              </label>
              <el-col :span="18">
                <el-row :gutter="20" v-for="item in scenebinds" :key="Date.now()" class="task">
                  <el-col :span="6">
                    <el-input
                      v-model="item.actionname"
                      :disabled="true">
                    </el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-input
                      v-model="item.commondValue"
                      :disabled="true">
                    </el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-input
                      v-model="item.delayTimeString"
                      :disabled="true">
                    </el-input>
                  </el-col>
                </el-row>
              </el-col>


        </el-row>
      </div>
      <p id="settime" name="settime" class="tit-green-border" v-show="timings.length>0">定时任务</p>
      <timingList
        v-for="settime in timings"
        :key = "settime.timingid"
        :settime = "settime"
        :timings = "timings"
        :sceneNo = "sceneNo"
        >
      </timingList>
      <p class="wrap-btns">
          <router-link to="/SceneEnergy"><el-button type="info">取消</el-button></router-link>
          <el-button type="primary" @click="submitForm('ruleForm')" :loading = "btnSaveLoading">保存</el-button>
      </p>
    </el-form>
  </section>
</template>

<script>
import { getScenesEnergyDetail,updateScenesEnergyDetail } from '../../../api/api'
import timingList from './SceneTimingTask'

export default {
  name:"",
  components:{
    timingList
  },
  data(){
    var validateName = (rule, value, callback) => {
        if (value.trim() == '') {
          return callback(new Error('情景名称不能为空'));
        }else {
          callback();
        }
      };
    return{
      // dataList:{},
      btnSaveLoading:false,
      scenebinds:[],
      timings:[],
      scene:{},
      sceneNo:'',
      form:{
        name:'',
        time:'',
      },
      rules:{
          name:[
             { required: true, message: '请输入情景名称', trigger: 'blur' },
             { validator: validateName, trigger: 'blur' }
          ],
          // time:[
          //     { required: true, message: '请输入定时时间', trigger: 'blur' }
          // ]
      }
    }
  },
  created(){
    this.ready();
  },
  methods:{
    ready(){
        this.sceneNo = this.$route.query.id;
        let sceneDetailParams = {'sceneNo':this.sceneNo};
        getScenesEnergyDetail(sceneDetailParams).then(data=>{
          let { code,msg } = data;
          if(code != 200){
             this.$message({
                message:data.msg,
                type:'error'
             });
          }else {
            // console.log(data.data);
            // this.dataList = data.data;
            this.scenebinds = data.data.scenebinds;
            this.timings = data.data.timings;
            this.scene = data.data.scene;
            this.form.name = data.data.scene.scenename;
            // console.log(this.timings);
          }
        }).catch(error=>{
          console.log(error);
        });
    },
    addTiming(){
      this.timings.push({timingid:'',timingTime:'',notes:'',weekList:[]});
    },
    parseInt0(num){
        if(parseInt(num) <10){
          return '0'+ num;
        }else{
          return num;
        }
    },
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let hasNull = this.timings.some(timing=>{
            return timing.notes == '';
          });

          if(hasNull){
            this.$message({
              message:'定时时间不能为空',
              type:'warning'
            });
            return false;
          }else{
            this.btnSaveLoading = true;
            for(let i = 0; i < this.timings.length; i++){
              let inpTime = `${this.parseInt0(this.timings[i].notes.getHours())}:${this.parseInt0(this.timings[i].notes.getMinutes())}`;
              this.timings[i].timingTime = inpTime;
            }

            let updateParams = {
              'sceneNo':this.sceneNo,
              'sceneName':this.form.name,
              'timingList':this.timings
            };
            // console.log(this.timings);
            updateScenesEnergyDetail(updateParams).then(data=>{
              let {code} = data;
              if(code != 200){
                this.$message({
                  message:data.msg,
                  type:'error'
                });
                  this.btnSaveLoading = false;
                // console.log(data.data);
              }else {
                this.$message({
                  message:data.data,
                  type:'success'
                });
                this.$router.push('/SceneEnergy');
              }
            }).catch(error=>{
              console.log(error);
            });
          }
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .cardStyle{
    padding: 40px 0 20px 0;
  }
  .tit-green-border{
    height: 18px;
    line-height: 18px;
    border-left: 4px solid #00d58c;
    padding-left: 22px;
    margin: 30px 0 10px 0;
    font-weight: normal;
  }
  .icon-scene-sm{
      width: 32px;
      height: 32px;
      display: block;
  }
  .scene_icon_0{
      background: url('../../../assets/img/icon-scene-sm/scene_icon_0.png');
  }
  .scene_icon_1{
      background: url('../../../assets/img/icon-scene-sm/scene_icon_1.png');
  }
  .scene_icon_2{
      background: url('../../../assets/img/icon-scene-sm/scene_icon_2.png');
  }
  .scene_icon_3{
      background: url('../../../assets/img/icon-scene-sm/scene_icon_3.png');
  }
  .scene_icon_4{
      background: url('../../../assets/img/icon-scene-sm/scene_icon_4.png');
  }
  .scene_icon_5{
      background: url('../../../assets/img/icon-scene-sm/scene_icon_5.png');
  }
  .scene_icon_6{
      background: url('../../../assets/img/icon-scene-sm/scene_icon_6.png');
  }
  .scene_icon_7{
      background: url('../../../assets/img/icon-scene-sm/scene_icon_7.png');
  }
  .scene_icon_8{
      background: url('../../../assets/img/icon-scene-sm/scene_icon_8.png');
  }
  .scene_icon_9{
      background: url('../../../assets/img/icon-scene-sm/scene_icon_9.png');
  }
  .scene_icon_10{
      background: url('../../../assets/img/icon-scene-sm/scene_icon_10.png');
  }
  .scene_icon_11{
      background: url('../../../assets/img/icon-scene-sm/scene_icon_11.png');
  }
  .card-time{
    position: relative;
  }
  .wrap-btns{
    margin-top: 30px;
    text-align: center;
  }
  .el-button{
    min-width: 80px;
    margin: 0 10px;
  }
  .task{
    margin-bottom: 20px;
  }
</style>
