<template lang="html">
  <li @click.stop="onOpen(scene.sceneno)">
    <el-row :gutter="20">
      <el-col :span="8">
        <em class="icon-scene" :class="'scene_icon_'+scene.pic" v-show="!isOpen"></em>
        <em class="img-rotate" v-show="imgRotate"></em>
        <em class="img-ok" v-show="imgOk"></em>
      </el-col>
      <el-col :span="16" class="txt-scene">{{scene.scenename}}</el-col>
    </el-row>
  </li>
</template>

<script>
import {startScene} from '../../api/api';
export default {
  props:['scene'],
  data(){
      return{
          isOpen:false,
          imgRotate:false,
          imgOk:false,
          isLock:false
      }
  },
  methods:{
    onOpen(sceneno){
      if(this.isLock){
        this.$message({
          message:'操作太过频繁，请稍后再操作',
          type:'warning'
        });
        return false;
      }else {
        this.openScene(sceneno);
      }
      setTimeout(()=>{
         this.isLock = false;
      },7500);
    },
    openScene(sceneno){
      this.isLock = true;
      let startSceneParams = { "sceneNo": sceneno};
      startScene(startSceneParams).then(data => {
        let {  code } = data;
        // console.log(data);
        if (code !== 200) {
          this.$message({
            message: data.msg,
            type: 'error'
          });
        } else {
          // console.log("执行成功");
            this.isOpen = !this.isOpen;
            this.imgRotate = !this.imgRotate;
            setTimeout(()=>{
              this.imgRotate = !this.imgRotate;
              this.imgOk = !this.imgOk;
            },5000);
            setTimeout(()=>{
              this.imgOk = !this.imgOk;
              this.isOpen = !this.isOpen;
            },7000);
          }
        }).catch(error =>{
          console.log(error);
        });
    }
  }
}
</script>

<style lang="css" scoped>
  .el-col-8{
      min-width: 65px;
  }
  .txt-scene{
      padding-top:20px;
  }
  .icon-scene{
      width: 62px;
      height: 62px;
      display: block;
      margin: auto;
  }
  .scene_icon_0{
      background: url('../../assets/img/icon-scene/scene_icon_0.png');
  }
  .scene_icon_1{
      background: url('../../assets/img/icon-scene/scene_icon_1.png');
  }
  .scene_icon_2{
      background: url('../../assets/img/icon-scene/scene_icon_2.png');
  }
  .scene_icon_3{
      background: url('../../assets/img/icon-scene/scene_icon_3.png');
  }
  .scene_icon_4{
      background: url('../../assets/img/icon-scene/scene_icon_4.png');
  }
  .scene_icon_5{
      background: url('../../assets/img/icon-scene/scene_icon_5.png');
  }
  .scene_icon_6{
      background: url('../../assets/img/icon-scene/scene_icon_6.png');
  }
  .scene_icon_7{
      background: url('../../assets/img/icon-scene/scene_icon_7.png');
  }
  .scene_icon_8{
      background: url('../../assets/img/icon-scene/scene_icon_8.png');
  }
  .scene_icon_9{
      background: url('../../assets/img/icon-scene/scene_icon_9.png');
  }
  .scene_icon_10{
      background: url('../../assets/img/icon-scene/scene_icon_10.png');
  }
  .scene_icon_11{
      background: url('../../assets/img/icon-scene/scene_icon_11.png');
  }
  .img-rotate{
  	display: block;
  	width: 62px;
    height: 62px;
  	background: url('../../assets/img/icon_loading_sm.png') no-repeat center center;
    background-size: 45px 45px;
  	animation: iconrotate 1s infinite linear;
  }
  @keyframes iconrotate{
  	from{
  		transform: rotate(0deg);
  	}
  	to{
  		transform: rotate(360deg);
  	}
  }
  .img-ok{
  	display: block;
  	width: 62px;
    height: 62px;
  	background: url('../../assets/img/icon_loading_succeed_sm.png') no-repeat center center;
  }
</style>
