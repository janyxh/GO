<template lang="html">
  <section>
    <!-- 右上角 - 删除 -->
    <div class="navHeadBtns">
      <el-button @click="allRead" size="large">全部已读</el-button>
      <el-button @click="delMsg" size="large">删除</el-button>
    </div>

    <div class="cardStyle">
    <!--筛选-->
    <el-form :model="formInline" id="demo-form-inline">
      <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item>
              <!-- <el-input v-model="formInline.keyword" placeholder="请输入关键字"></el-input> -->
              <inputSearch :formInline="formInline" :iconSearch="iconSearch"></inputSearch>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="formInline.isread" placeholder="全部" clearable>
                <el-option v-for="read in formInline.readtype" key="read.id" :label="read.status" :value="read.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="min-width:100px;">
              <el-form-item>
                <el-button @click="onSubmit" style="width: 100%">搜索</el-button>
              </el-form-item>
          </el-col>
          <el-col :span="2" style="min-width:100px;">
            <el-form-item>
              <el-button @click="onReset" style="width: 100%">重置</el-button>
            </el-form-item>
          </el-col>
      </el-row>
    </el-form>


    <!--表格-->
    <div class="wrap-table-list">
    <el-table
      :data="tableData"
      v-loading="table_loading"
      element-loading-text="拼命加载中"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center">
      </el-table-column>
      <!-- <el-table-column
        label="消息状态"
        prop="isread"
        width="200"
        align="center"
        :filters="[{ text: '全部', value: '' }, { text: '已读', value: 0 }, { text: '未读', value: 1 }]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
        >
        <template scope="scope">
          <em class="icon-msg" :class="'msg'+scope.row.isread"></em>
        </template>
      </el-table-column> -->
      <el-table-column
        label="消息状态"
        prop="isread"
        width="100"
        align="center"
        >
        <template scope="scope">
          <em class="icon-msg" :class="'msg'+scope.row.isread"></em>
        </template>
      </el-table-column>
      <el-table-column
        prop="typeValue"
        label="消息类型"
        width="100"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createtime"
        label="发送时间"
        align="center">
      </el-table-column>
      <!-- <el-table-column
        label="内容"
        align="center">
        <template scope="scope">
            <span v-html="scope.row.content">{{scope.row.content}}</span>
        </template>
      </el-table-column> -->

      <el-table-column
        prop="content"
        label="内容"
        align="center">
        <template scope="scope">
            <span v-html="scope.row.content">{{scope.row.content}}</span>
            <!-- {{lll()}} -->
          <!-- {{firstStr(scope.row.content,scope.row.deviceName)}}  <router-link to="/Home">{{scope.row.deviceName}}</router-link>{{secondStr(scope.row.content,scope.row.deviceName)}} -->
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template scope="scope">
          <el-button
            @click.native.prevent="view(scope.row.msgid)"
            type="text"
            size="small">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!--分页-->
    <el-pagination
     @size-change="handleSizeChange"
     @current-change="handleCurrentChange"
     :current-page="currentPage"
     :page-sizes="[10, 20, 30, 40, 50]"
     :page-size="count"
     layout="total, prev, pager, next"
     :total="total"
     class="pagination">
   </el-pagination>
   </div>
  </section>
</template>

<script>
import { getMessageList, delMessage, updateAllRead } from '../../api/api'
import inputSearch from '../../items/inputSearch'
export default {
  props:['getMessageNum','msgArrAlert'],
  components:{
    inputSearch
  },
  data(){
    return{
      // 搜索输入 x图标
      iconSearch:{
        iconIsDelKeyword:""
      },
      table_loading:true,
      tableData:[],
      multipleSelection:[],
      currentPage:1,  //当前第几页
      count:10, //一页显示10条
      total:0, //共几条
      formInline:{
        keyword:'',
        isread:'',
        readtype:[
          {
            id:0,
            status:'已读'
          },{
            id:1,
            status:'未读'
          }
        ]
      },
    }
  },
  created(){
    this.getMsgList()
    // console.log(this.msgAlert);

    // 回车搜索事件
    document.onkeyup = ((event)=>{
        var e = event || window.event;
         if(e && e.keyCode==13){ // enter 键
           this.getMsgList();
        }
    });
  },
  beforeDestroy(){
    document.onkeyup = '';
  },
  watch:{
    msgArrAlert: {
　　　　handler(newValue, oldValue) {
        const oldData = {
           list:oldValue
        }
        const newData ={
          list:newValue
        }
        if(JSON.stringify(oldData)!=JSON.stringify(newData)){
          // let oldPage = this.currentPage;
          this.getMsgList()
        }
　　　　},
　　　　deep: true
　　}
  },
  methods:{
    // firstStr(content,name){
    //   if(content.indexOf('网关') != -1){
    //     //content = content.replace(/网关/g, "<a class='a-primary' href='/GatewayManage'>网关</a>");
    //   }else if(content.indexOf(name) && content.indexOf(name) != -1){
    //     content = content.replace(name, "<a class='a-primary' onClick='alert()' href='/DeviceDetail?id="+ item.deviceid +"'>"+name+"</a>");
    //   }
    // },
    // secondStr(content,name){
    //     console.log(11111);
    //     alert(11211)
    // },
    getMsgList(){
      let msgParams = { 'currentPage':this.currentPage, 'count':this.count, 'content': this.formInline.keyword, 'type': this.formInline.isread };
      getMessageList(msgParams).then(res=>{
        let {code} = res;
        if(code != 200){
          this.$message({
            message:res.msg,
            type:'error'
          });
        }else {
          // console.log(res.data);
          this.tableData = res.data.page.pageResult;
          let that = this;
          this.tableData.map((item)=>{
            // let date = new Date(item.createtime);
            return item.createtime = this.$moment(item.createtime).format('YYYY-MM-DD HH:mm:ss');
            // return item.createtime = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${that.parseInt0(date.getHours())}:${that.parseInt0(date.getMinutes())}`;
          });
          this.tableData.map((item)=>{
            let txt = item.content;
            if(txt.indexOf('网关') != -1){
              txt = txt.replace(/网关/g, "<a class='a-primary' href='/GatewayManage'>网关</a>");
            }else if(txt.indexOf(item.deviceName) && txt.indexOf(item.deviceName) != -1){
              txt = txt.replace(item.deviceName, "<a class='a-primary' href='/DeviceList/DeviceDetail?id="+ item.deviceid +"'>"+item.deviceName+"</a>");
            }
            return item.content = txt;
          });
          this.total = res.data.page.totalCount;
          this.table_loading = false;
            // console.log(this.tableData);
        }
      }).catch(error=>{
        console.error(error);
      });
    },
    handleSizeChange(val) {
      this.count = val;
      this.getMsgList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMsgList();
    },
    // filterTag(value, row) {
    //   return row.isread === value;
    // },
    view(msgid){
      this.$router.push({ path: '/MessageDetail', query: { id: msgid }});
    },
    onSubmit(){
      this.getMsgList();
      this.getMessageNum();
    },
    onReset(){
      this.formInline.keyword = '';
      this.formInline.isread = '';
      this.iconSearch.iconIsDelKeyword = "";
      this.getMsgList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection);
    },
    delMsg(){
      if(this.multipleSelection.length == 0){
        //选择为空弹出警告
        this.$message({
          message: '请选择消息',
          type: 'warning'
        });
      }else{
        let arrMsg = this.multipleSelection.map((item)=>{
            return item.msgid;
        });
        let delParams = {'msgIds':arrMsg};
        delMessage(delParams).then(res=>{
          let { code } = res;
          if(code != 200){
            this.$message({
              message:res.msg,
              type:'error'
            });
          }else{
            // console.log(res.data);
            this.$message({
              message:res.data,
              type:'success'
            });
            this.getMsgList();
          }
        }).catch(error=>{
          console.error(error);
        });
      }
    },
    allRead(){
      let allReadParams = {};
      updateAllRead(allReadParams).then(res=>{
        let { code } = res;
        if(code != 200){
          this.$message({
            message:res.msg,
            type:'error'
          });
        }else{
          // console.log(res.data);
          this.$message({
            message:res.data,
            type:'success'
          });
          this.getMsgList();
          this.getMessageNum();
        }
      }).catch(error=>{
        console.error(error);
      });
    },
    parseInt0(num){
        if(parseInt(num) <10){
          return '0'+ num;
        }else{
          return num;
        }
    },
  }
}
</script>

<style lang="scss" scoped>
  .icon-msg{
    display: block;
    width: 24px;
    height: 24px;
    margin: auto;
  }
  .msg0{
    background: url('../../assets/img/ui21/icon_mail.png');
  }
  .msg1{
    background: url('../../assets/img/ui21/icon_mail_p.png');
  }
  .pagination{
    text-align: center;
    margin-top: 90px;
  }
</style>
