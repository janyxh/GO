<template lang="html">
  <section>
    <!-- 顶部按钮 -->
    <div class="navHeadBtns">
      <router-link to="/UserManagerAdd"><el-button type="primary" size="large">添加企业用户</el-button></router-link>
      <el-button @click="delUser" size="large">删除用户</el-button>
    </div>
    <div class="cardStyle">
    <!-- 筛选 搜索 -->
    <el-form :model="formInline" id="demo-form-inline">
      <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item>
              <inputSearch :formInline="formInline" :iconSearch="iconSearch"></inputSearch>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="formInline.officeId" placeholder="请选择办公室" @change="officeChange(formInline.office)" clearable>
                <el-option v-for="item in arrOffice" key="item.familyId" :label="item.officeName" :value="item.officeId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="formInline.roomId" filterable placeholder="请选择区域" clearable>
                <el-option v-for="item in arrRoom" :key="item.roomId" :label="item.roomName" :value="item.roomId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="formInline.isSystem" filterable placeholder="请选择角色" clearable>
                <el-option v-for="item in arrRole" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select v-model="formInline.status" placeholder="请选择账号状态" clearable>
                <el-option v-for="item in arrStatus" key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="min-width:100px;">
              <el-form-item>
                <el-button @click="search" style="width: 100%">搜索</el-button>
              </el-form-item>
          </el-col>
          <el-col :span="2" style="min-width:100px;">
            <el-form-item>
              <el-button @click="reset" style="width: 100%">重置</el-button>
            </el-form-item>
          </el-col>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <div class="wrap-table-list">
    <el-table
      v-loading.body="loading"
      :data="tableData"
      style="width: 100%"
      stripe
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="accountName"
        label="登录账号">
      </el-table-column>
      <el-table-column
        prop="isSystemName"
        label="角色">
      </el-table-column>
      <el-table-column
        prop="trueName"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="contactNumber"
        label="联系方式">
      </el-table-column>
      <el-table-column
        prop="familyName"
        label="办公室">
      </el-table-column>
      <el-table-column
        prop="deptName"
        label="部门">
      </el-table-column>
      <el-table-column
        prop="statusName"
        label="账号状态">
      </el-table-column>
      <el-table-column
        prop="status"
        label="操作">
        <template scope="scope">
          <el-button
            @click.native.prevent="useRow(scope.$index, tableData,0)"
            type="primary"
            size="small"
            v-if="scope.row.status">
            启用
          </el-button>
          <el-button
            @click.native.prevent="useRow(scope.$index, tableData,1)"
            type="text"
            size="small"
            v-if="!scope.row.status">
            冻结
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="isShowEdit"
        width="100">
        <template scope="scope">
          <span class="edit-arrow"
            @click.prevent="editRow(scope.$index, tableData)"
            v-if="scope.row.isShowEdit"
          >
            <i class="iconfont icon-next"></i>
          </span>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!-- 分页条 -->
    <el-pagination
      small
      layout="total,prev, pager, next"
      :total="total"
      :page-size = "formInline.pageSize"
      :current-page="formInline.pageIndex"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="pagination">
    </el-pagination>
    </div>
  </section>
</template>

<script>
  import { getOffice, getArea } from '../../api/api'
  import { getUserList, updateUserStatus, deleteUser } from '../../api/user'
  import inputSearch from '../../items/inputSearch'

  export default {
    components:{
      inputSearch
    },
    // -----------------------------------------     data  ----------------------------------------------------------
    data(){
      return{
          loading:true,
          iconSearch:{
            iconIsDelKeyword:""
          },
          formInline: {
            keyword: '',
            officeId: '',
            roomId:'',
            isSystem:'',
            status:'',
            pageIndex:1,//当前页
            pageSize:10//一页显示多少条
          },
          total:0,//总共多少条消息
          arrOffice:[],
          arrRoom:[],
          arrRole:[
            {
              id:39,
              name:'普通管理员'
            },
            {
              id:40,
              name:'普通用户'
            }
          ],
          arrStatus:[
            {
              id:1,
              name:'冻结'
            },
            {
              id:0,
              name:'正常'
            }
          ],
          tableData: [],
          multipleSelection: []
      }
    },
    // -----------------------------------------     加载页面  ----------------------------------------------------------
    mounted(){
        //获取办公室信息
        let offceParams = null;
        getOffice(offceParams).then(data => {
          let {  code } = data;
          if (code !== 200) {
            this.$message({
              message: data.msg,
              type: 'error'
            });
          }else {
            this.arrOffice = data.data;
          }
        });
        this.getList();

        // 回车搜索事件
        document.onkeyup = ((event)=>{
            var e = event || window.event;
             if(e && e.keyCode==13){ // enter 键
               this.search();
            }
        });
    },
    beforeDestroy(){
      document.onkeyup = '';
    },
    // -----------------------------------------   函数   ----------------------------------------------------------
    methods:{
    // -----------------------------------------   筛选  ----------------------------------------------------------
      //选择区域
      officeChange(){
        this.formInline.roomId = "";
        // console.log( this.formInline.officeId );
        if(this.formInline.officeId == ""){
          this.arrRoom = '';
        }else{
          let areaParams = { "officeId": this.formInline.officeId };
          getArea(areaParams).then((res) =>{
            if(res.code != 200){
              this.$message({
                message: res.msg,
                type: 'error'
              });
            }else {
              this.arrRoom = res.data;
              // console.log(this.arrRoom);
            }
          }).catch(function (error) {
            console.log(error);
          });
        }
      },
      // 搜索
      search(){
        this.getList();
      },
      // 重置
      reset(){
        this.formInline.keyword = "";
        this.formInline.officeId = "";
        this.formInline.roomId = "";
        this.formInline.isSystem = "";
        this.formInline.status = "";
        this.iconSearch.iconIsDelKeyword = "";
        this.getList();
      },
      // -----------------------------------------   表格   ----------------------------------------------------------
      getList(){

        //获取用户列表
        let userParams = {...this.formInline};
        getUserList(userParams).then(res => {
          let { code } = res;
          if (code !== 200) {
            this.$message({
              message: res.msg,
              type: 'error'
            });
          }else {
            this.loading = false;
            this.tableData = res.data.pageResult;
            this.total = res.data.totalCount;
            this.formInline.pageSize = res.data.count;
          }
        });
      },
      //取消选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 启用，冻结用户
      useRow(index,tableData,status){
        let useParams = { 'userId':tableData[index].userId, 'status': status};
        updateUserStatus(useParams).then(res=>{
          console.log(res);
          let {code} = res;
          if(code!=200){
            this.$message({
              message:res.msg,
              type:'error'
            });
          }else {
            this.$message({
              message:res.data,
              type:'success'
            });
            setTimeout(()=>{
              this.getList();
            },1000);
          }
        }).catch(error=>{
          console.error(error);
        });
      },
      // 是否显示编辑,查看
      cellMouseEnter(row){
        row.isShowEdit = true;
      },
      cellMouseLeave(row){
        row.isShowEdit = false;
      },
      // 编辑用户
      editRow(index,tableData){
        this.$router.push({path:'/UserManagerEdit',query:{id:tableData[index].userId,officeId:tableData[index].familyId}});
      },
      // -----------------------------------------   分页   ----------------------------------------------------------
      handleSizeChange(val) {
        this.formInline.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.formInline.pageIndex = val;
        this.getList();
      },
      // -----------------------------------------   顶部   ----------------------------------------------------------
      // 删除用户
      delUser(){
        if(this.multipleSelection.length == 0){
          //选择为空弹出警告
          this.$message({
            message: '请选择用户',
            type: 'warning'
          });
        }else{
          // console.log('进入删除');
          this.$alert('确定要删除该用户吗?', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            console.log(this.multipleSelection);
            let strUsers = '';
            strUsers += this.multipleSelection.map((item)=>{
                return item.userId;
            });
            console.log(strUsers);
            let usersParams = {'userIds':strUsers};
            deleteUser(usersParams).then(res=>{
              let {code} = res;
              if(code!=200){
                this.$message({
                  message:res.msg,
                  type:'error'
                });
              }else {
                this.$message({
                  message:res.data,
                  type:'success'
                });
                setTimeout(()=>{
                  this.getList();
                },1000);
              }
            }).catch(error=>{
              console.error(error);
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pagination{
    margin-top: 90px;
    text-align: center;
  }
  .edit-arrow{
    display: block;
    width: 30px;
    height: 20px;
    cursor: pointer;
  }
  .icon-next{
    font-size: 30px;
    color: #CACCD6;
  }
</style>
