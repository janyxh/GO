<template>
  <li>
    <div class="position-wrap">
      <a class="a-time" @click="handleJump">
          <i :class="{'icon-interval': true, set: scene.timing }"></i>
          <span class="txt-left">
            <span v-if="scene.timing">{{parseInt0(scene.timing.hour)}}:{{parseInt0(scene.timing.minute)}}</span>
            <br>
            <span v-if="scene.timing && scene.timing.week_temp">{{scene.timing.week_temp}}</span>
          </span>
      </a>
      <router-link :to="{path:'/SceneEnergyDetail',query:{id:scene.sceneno}}" class="a-details">
          <i class="icon-detail"></i>
          <span class="txt-right">详情</span>
      </router-link>
    </div>
      <!-- <p :class=" isOpen ? 'tit-sence-control' : 'tit-sence-control-top' " :key="Date.now()">{{scene.scenename}}</p> -->
    <p :class="{ 'tit-sence-control':true,'tit-sence-control-top':isOpen }">{{scene.scenename}}</p>
    <el-button type="primary" v-if="!isOpen" @click.stop="onOpen(scene.sceneno)" :loading="loading" class="btn-open">启动情景</el-button>
    <div v-if="imgRotate" class="img-sceneing"><em class="imgrotate"></em><p>正在执行...</p></div>
    <div v-if="imgOk" class="img-sceneing"><em class="imgok"></em><p>执行成功</p></div>
  </li>
</template>

<script>
import {startScene} from '../../../api/api';
export default {
  name:'SceneList',
  props:['scene'],
  data(){
    return{
      loading:false,
      isOpen:false,
      imgRotate:false,
      imgOk:false
    }
  },
  methods: {
    onOpen(sceneno){
      let startSceneParams = { "sceneNo": sceneno};
      startScene(startSceneParams).then(data => {
        let { msg, code } = data;
        // console.log(data);
        if (code !== 200) {
          this.$message({
            message: data.msg,
            type: 'error'
          });
        } else {
          // console.log("执行成功");
          this.loading = true;
          this.isOpen = !this.isOpen;
          setTimeout(()=>{
            this.imgRotate = !this.imgRotate;
          },500);
          setTimeout(()=>{
            this.imgRotate = !this.imgRotate;
            this.imgOk = !this.imgOk;
          },5500);
          setTimeout(()=>{
            // console.log("重新启动情景");
            this.imgOk = !this.imgOk;
            this.loading = !this.loading;
            this.isOpen = !this.isOpen;
          },7500);
          }
        }).catch(error =>{
          console.log(error);
        });
    },
    parseInt0(num){
        if(parseInt(num) <10){
          return '0'+ num;
        }else{
          return num;
        }
    },
    handleJump(){
      // this.$router.push("/SceneEnergyDetail");
      this.$router.push({ path: '/SceneEnergyDetail', query: { id: this.scene.sceneno }});
      setTimeout(()=>{
        location.hash = "#settime";
      },500);
    }
  }
}
</script>

<style lang="scss" scoped>
/*     控制盒子   */
.ul-control-box{
  padding: 0;
  margin: 0;
  // min-width: 1060px;
}
.ul-control-box li{
  list-style: none;
  width: calc(25% - 37.5px);
  min-height: 320px;
  margin-right: 50px;
  margin-bottom: 50px;
  padding-bottom: 20px;
  background: #fff;
  border-radius:8px;
  box-shadow:1px 1px 3px 0 rgba(0,0,0,0.20);
  text-align: center;
  float: left;
  position: relative;
  .btn-open{
    position: absolute;
    top: 50%;
    left: calc(50% - 44px);
  }
}
.ul-control-box li:nth-of-type(4n){
  margin-right: 0;
}
.ul-control-box li.off{
  border:1px solid #e8e8e8;
  background: #e8e8e8;
}
.ul-control-box li.on{
  background: #fff;
  border:1px solid #00d58c;
}
.position-wrap{
	position: relative;
}
.position-wrap i{
	display:block;
	width: 18px;
	height:18px;
	position: absolute;
	top: 20px;
}
.icon-interval{
	left:20px;
    background: url('../../../assets/img/icon_time_d.png');
}
.icon-interval.set{
	left:20px;
	background: url('../../../assets/img/icon_time_p.png');
}
.position-wrap span{
	color:#a7a7a7;
}

.a-time .txt-left{
	position: absolute;
	top: 50px;
	left:20px;
  display: none;
  text-align: left;
}
.a-time:hover .txt-left{
  display: block;
}
.a-details .txt-right{
	position: absolute;
	top: 50px;
	right:20px;
  display: none;
}
.a-details:hover .txt-right{
  display: block;
}

.tit-sence-control{
	margin: 100px 0 50px 0;
  transform: translateY(0px);
  transition: all 1s ease;
}
.tit-sence-control-top{
  // margin: 20px 0 50px 0;
  transform: translateY(-80px);
  transition: all 1s ease;
}
.img-sceneing{
  margin-top: -50px;
	height: 90px;
	margin-bottom: 45px;
}
@keyframes iconrotate{
	from{
		transform: rotate(0deg);
	}
	to{
		transform: rotate(360deg);
	}
}
.imgrotate{
	display: block;
	width: 90px;
	height: 90px;
	margin: 27px auto 0 auto;
	background: url(../../../assets/img/icon_loading.png) no-repeat center center;
	background-size: cover;
	animation: iconrotate 1s infinite linear;
}
.imgok{
	display: block;
	width: 90px;
	height: 90px;
	margin: 27px auto 0 auto;
	background: url(../../../assets/img/icon_loading_succeed.png) no-repeat;
}
.img-sceneing p{
	margin: 40px 0;
	font-size:14px;
}
.card-span{
	padding: 30px 0;
}
.icon-set-interval-add,.icon-set-interval-minus{
	display: block;
	width: 34px;
	height: 34px;
	line-height: 30px;
	margin-top: 5px;
	font-size: 30px;
	text-decoration: none;
	color:#000;
	border:1px solid #ccc;
	border-radius: 50%;
}
.icon-set-interval-add:hover,.icon-set-interval-minus:hover{
	text-decoration: none;
	color: #fff;
	background: #00d58c;
	border:1px solid #00d58c;
}
</style>
