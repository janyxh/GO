<!------------------------------------------------------------------------------------------------
 about: 此文件是获取短信按钮组件，带网络请求和定时器。发送短信后不可再点击，倒计时结束后可以获取。
    调用例子：
    <getCheckCodeBtn :account="要传输的号码" type="短信功能选择" @handleSend="注册的获取成功函数，会自动触发并在回调中返回true">
    </getCheckCodeBtn>
 author: 马兆铿
 date: 2017-8-31
------------------------------------------------------------------------------------------------>
<template>
	<el-button id="get-check-code" class="border-radius-6px" @click.stop="handleClick" :disabled="isDisabled">
		{{text}}
	</el-button>
</template>

<script>
  import Vue from 'vue';
  import {verificationNum} from '../api/api';
  import {Message} from "element-ui";
  import { phoneRegCheck, emailRegCheck} from '../utils/regularCheck'
  //
  export default {
    name: "getCheckCodeBtn",
    /*---------------------------------------- 数据 ----------------------------------------*/
    props: [
      'account',  //要发送到的号码
      'type', //验证功能，具体看接口文件
    ],
    data() {
      return {
        text: '获取验证码',
        isDisabled: false,
      }
    },
    methods: {
      /*---------------------------------------- 绑定函数 ----------------------------------------*/
      /*  点击函数：容器左右滑动
			 * */
      handleClick: function () {
        let that = this;
        if (!that.account || that.account.trim() == "") {
          this.$message({
            message: '账号不能为空',
            type: 'warning'
          });
          return false;
        }else if(!phoneRegCheck(that.account.trim()) && !emailRegCheck(that.account.trim())){
					return false;
        }
        const WAIT_TOTAL_TIME_CNT = 180;  //最多180s获取一次
        let cnt = WAIT_TOTAL_TIME_CNT;
        //获取验证码
        verificationNum({
          account: that.account,
          type: that.type
        }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '验证码已经发送到' + that.account,
              type: 'success'
            });
            //定时控制按钮可按
            that.isDisabled = true;
            let timer = setInterval(() => {
              that.text = cnt-- + 's';
              if (cnt < 0) {
                cnt = WAIT_TOTAL_TIME_CNT;
                that.isDisabled = false;
                that.text = '获取验证码';
                clearInterval(timer);
              }
            }, 1000);
            //是否发送验证码
            this.$emit('handleSend', true);
          } else {
            Message.error(res.msg)
          }
        });
      }
    }
  }
</script>

<style scoped>
	#get-check-code {
		width: 120px;
		color: #15cea3;
		font-size: 16px;
	}
</style>
