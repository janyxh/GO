<template lang="html">
  <section>
    <div class="cardStyle">
      <!-- <el-row :gutter="20">
        <el-col :span="3">消息类型：</el-col>
        <el-col :span="21">{{this.message.typeValue}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">发送时间：</el-col>
        <el-col :span="21">{{this.message.createtime}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">内容：</el-col>
        <el-col :span="21">{{this.message.content}}</el-col>
      </el-row> -->
      <el-row>
        <el-col :offset="6" :span="12">
          <p class="tit-msg">{{this.message.typeValue}}</p>
          <p class="content-msg">{{this.message.content}}</p>
          <p class="time-msg">{{this.time}}</p>
          <p class="wrap-btns">
            <el-button @click="delMsg">删除</el-button>
            <router-link to="/Message"><el-button>返回</el-button></router-link>
          </p>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import { getMessageDetail, delMessage, getMessageAmount } from '../../api/api'
export default {
  props: ['getMessageNum'],
  data() {
    return {
      msgId: '',
      message: {},
      time: 0
    }
  },
  created() {
    this.ready()
    Date.prototype.format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

        }
      }
      return fmt;
    }
  },
  methods: {
    ready() {
      this.msgId = this.$route.query.id;
      let msgDetailParams = { 'msgId': this.msgId };
      getMessageDetail(msgDetailParams).then(res => {
        let { code } = res;
        console.log(code);
        if (code != 200) {
          this.$message({
            message: res.msg,
            type: 'error'
          });
          this.$router.push('/Message');
        }else {
          // console.log(res.data);
          this.message = res.data.message;
          let date = new Date(res.data.message.createtime);
          // this.time = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()} : ${date.getMinutes()}`;
          this.time = date.format('yyyy年MM月dd日 hh:mm')
          this.getMessageNum();
        }
      }).catch(error => {
        console.error(error);
      });
    },
    delMsg() {
      let arrMsg = [];
      arrMsg.push(this.msgId);
      let delParams = { 'msgIds': arrMsg };
      delMessage(delParams).then(res => {
        let { code } = res;
        if (code != 200) {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }else {
          // console.log(res.data);
          this.$message({
            message: res.data,
            type: 'success'
          });
          this.$router.push('/Message');
        }
      }).catch(error => {
        console.error(error);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
// <p class="tit-msg">{{this.message.typeValue}}</p>
// <p class="content-msg">{{this.message.content}}</p>
// <p class="time-msg">{{this.message.createtime}}</p>
.tit-msg {
  text-align: center;
  font-size: 18px;
  padding-top: 50px;
}

.content-msg {
  padding: 50px 0;
  min-height: 100px;
}

.time-msg {
  padding: 35px 0;
  text-align: right;
}

.wrap-btns {
  padding: 110px 0 77px 0;
  text-align: center;
  .el-button {
    min-width: 80px;
    margin: 0 10px;
  }
}
</style>
