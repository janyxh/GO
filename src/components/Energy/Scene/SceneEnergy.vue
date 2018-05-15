<template>
  <section>

    <div class="cardStyle">
      <el-form :model="formInline" id="demo-form-inline">
        <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item>
                <!-- <el-input v-model="formInline.keyword" placeholder="请输入搜索关键字"></el-input> -->
                <inputSearch :formInline="formInline" :iconSearch="iconSearch"></inputSearch>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-select v-model="formInline.office" placeholder="请选择办公室" @change="officeChange(formInline.office)" clearable>
                  <el-option v-for="office in formInline.offices" key="office.familyId" :label="office.officeName" :value="office.officeId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-select v-model="formInline.settime" placeholder="是否已设置定时" clearable>
                  <el-option v-for="settime in formInline.settimeType" key="settime.set" :label="settime.name" :value="settime.set"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="min-width:100px;">
                <el-form-item>
                  <el-button @click="onSubmit" style="width: 100%">搜索</el-button>
                </el-form-item>
            </el-col>
            <el-col :span="3" style="min-width:100px;">
              <el-form-item>
                <el-button @click="onReset" style="width: 100%">重置</el-button>
              </el-form-item>
            </el-col>
        </el-row>
      </el-form>

      <div class="wrap-table-list">
        <ul class="ul-control-box" id="ul-scene">
          <SceneList
            v-for="scene in tableData"
            :key="scene.sceneno"
            :scene="scene">
          </SceneList>
            <div class="clearFix"></div>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
  import SceneList from './SceneList';
  import { getScenesEnergy,getOffice } from '../../../api/api';
  import inputSearch from '../../../items/inputSearch';

  export default {
    components:{
      SceneList,
      inputSearch
    },
    props: {
      scene:{
          type: Object, // 类型按需求
      }
    },
    data() {
      return {
        iconSearch:{
          iconIsDelKeyword:""
        },
        formInline: {
          keyword: '',
          office: '',
          settime:'',
          settimeType:[
          {
            set:1,
            name:'是'
          },
          {
            set:0,
            name:'否'
          }],
          offices:[]
        },
        tableData: []
      }
    },
    created() {
      this.fetchData();
    },
    mounted(){
      // 回车搜索事件
      document.onkeyup = ((event)=>{
          var e = event || window.event;
           if(e && e.keyCode==13){ // enter 键
             this.onSubmit();
          }
      });
    },
    beforeDestroy(){
      document.onkeyup ="";
    },
    methods: {
      fetchData(){
        let sceneParams = { "sceneName": "", "familyId": "", "isTiming": null};
        getScenesEnergy(sceneParams).then(data => {
          let { msg, code } = data;
          if (code !== 200) {
            this.$message({
              message: data.msg,
              type: 'error'
            });
          }else {
            // console.log(data);
            this.tableData = data.data;
          }
        });
        let offceParams = null;
        getOffice(offceParams).then(data => {
          let { msg, code } = data;
          if (code !== 200) {
            this.$message({
              message: data.msg,
              type: 'error'
            });
          }else {
            // console.log(data);
            this.formInline.offices = data.data;
            // if(this.formInline.offices.length > 1){
            //   this.formInline.offices.unshift({"familyId":"","familyName":"全部办公室"});
            // }

          }
        });

      },
      onSubmit() {
        let sceneParams = { "sceneName": this.formInline.keyword, "familyId": this.formInline.office, "isTiming": this.formInline.settime};
        getScenesEnergy(sceneParams).then(data => {
          let { code } = data;
          if (code !== 200) {
            this.$message({
              message: data.msg,
              type: 'error'
            });
          }else {
            this.tableData = data.data;
          }
        });
      },
      onReset() {
        this.formInline.keyword = "";
        this.formInline.office = "";
        this.formInline.settime = "";
        this.iconSearch.iconIsDelKeyword = "";
        this.fetchData();
      },
    }
  }
</script>

<style lang="scss" scoped>
  #ul-scene{
    margin-top: 50px;
    li{
      background:#F7F8FA;
    }
  }
</style>
