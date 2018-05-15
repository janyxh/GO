<template>
    <section>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        style="width: 100%"
        max-height="250">
        <el-table-column
          prop="templeteName"
          label="模板名称">
        </el-table-column>
        <el-table-column
          prop="templeteType"
          label="计价类型"
          :formatter="formatterTempleteType">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="最近更新时间">
        </el-table-column>
        <el-table-column
          prop="templeteStatus"
          label="状态"
          :formatter="formatterStatus">
        </el-table-column>
        <el-table-column
          label="操作">
          <template scope="scope">
            <el-button
              @click.native.prevent="haddleRow(scope.$index, tableData)"
              type="text"
              size="small">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="模板详情" :visible.sync="dialogTableVisible" size="tiny">
        <el-table :data="tableData">
          <el-table-column
            label="用电时段">
            <template scope="scope">
              全天默认平期
            </template>
          </el-table-column>
          <el-table-column property="normalTimePrice" label="收费标准"></el-table-column>
        </el-table>
        <p class="text-center wrap-btn">
          <el-button type="primary" @click="haddleClose">我知道了</el-button>
        </p>
      </el-dialog>
    </section>
</template>

<script>
    import {getElectricityPricing} from '../../api/api';
    export default {
        name: "",
        data() {
            return {
                tableData:[],
                loading: true,
                dialogTableVisible:false,
            }
        },
        created(){
          this.ready();
        },
        methods:{
            ready(){
                let pricingParams = null;
                getElectricityPricing(pricingParams).then(data=>{
                  let {code} = data;
                  if(code != 200){
                    this.$message({
                      message: data.msg,
                      type: 'error'
                    });
                  }else {
                    // console.log(code);
                    // console.log(data.data);
                    this.tableData = data.data;
                    this.loading = !this.loading;
                  }
                }).catch(error=>{
                  console.log(error);
                });
            },
            haddleRow(index, rows) {
              // rows.splice(index, 1);
              this.dialogTableVisible = !this.dialogTableVisible;
            },
            haddleClose(){
              this.dialogTableVisible = !this.dialogTableVisible;
            },
            formatterTempleteType(row, column) {
              if(row.templeteType == 0){
                return '平期'
              }else {
                return '峰谷'
              }
            },
            formatterStatus(row, column) {
              if(row.templeteStatus == 0){
                return '禁用模板'
              }else {
                return '启用模板'
              }
            }
        }
    }
</script>

<style lang="scss" scoped>
  .wrap-btn{
    padding: 40px 0 10px 0;
  }
</style>
