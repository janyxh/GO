<template>
  <section>
      <div class="navHeadBtns">
        <div id="navHeadSelects">
          <el-select v-model="formInline.office" placeholder="请选择办公室" @change="officeChange(formInline.office)" clearable>
            <el-option v-for="office in formInline.offices" key="office.familyId" :label="office.officeName" :value="office.officeId"></el-option>
          </el-select>
        </div>
      </div>
      <div class="cardStyle div-gateway">
        <div v-show="!numGateway">没有主机</div>
        <el-row :gutter="50">
          <el-col :span="6" v-for="gateway in dataList" key="gateway.uid">
            <div>
              <div class="gateway-top">
                <p :class="{'online':gateway.online}">{{gateway.onlineName}}</p>
                <img src="../../assets/img/icon_gateway.png" alt="" />
                <h5>ZigBee 网关</h5>
              </div>
              <el-row :gutter="20">
                 <el-col :span="8">子设备数：</el-col>
                 <el-col :span="16">{{gateway.deviceCount}}</el-col>
              </el-row>
              <el-row :gutter="20">
                 <el-col :span="8">MAC地址：</el-col>
                 <el-col :span="16">{{gateway.uid}}</el-col>
              </el-row>
              <el-row :gutter="20">
                 <el-col :span="8">IP地址：</el-col>
                 <el-col :span="16">{{gateway.ip}}</el-col>
              </el-row>
              <el-row :gutter="20">
                 <el-col :span="8">固件版本：</el-col>
                 <el-col :span="16">{{gateway.hardwareVersion}}</el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
  </section>
</template>

<script>
  import { getOffice,getGateWay } from '../../api/api';
  export default {
      name: "Gateway",
      created(){
        this.ready();
      },
      data() {
        return {
          formInline: {
            office: '',
            offices:[]
          },
          numGateway:false,
          dataList:[]
        }
      },
      methods:{
        officeChange(officeid){
          let gatewayParams = {"officeId":officeid};
          getGateWay(gatewayParams).then(data => {
            let { msg, code } = data;
            if (code !== 200) {
              this.$message({
                message: data.msg,
                type: 'error'
              });
            }else {
              // console.log(data.data);
              this.dataList = data.data.gatewayList;
              if(data.data.gatewayList.length == 0){
                this.numGateway = false;
              }else {
                this.numGateway = true;
              }
            }
          });
        },
        ready(){
          let offceParams = null;
          getOffice(offceParams).then(data => {
            let { msg, code } = data;
            if (code !== 200) {
              this.$message({
                message: data.msg,
                type: 'error'
              });
            }else {
              // console.log(data.data);
              this.formInline.offices = data.data;
            }
          });

          this.officeChange("");
        }
      }
  }
</script>

<style lang="scss" scoped>
  .div-gateway{
    padding: 25px 50px;
    font-size: 12px;
    color: #333;
  }
  .div-gateway .el-col-6{
    padding: 25px 0;
    min-width: 340px;
  }
  .div-gateway .el-col-6 > div{
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .div-gateway .el-col-6 .el-col{
    padding: 15px 0;
  }
  .div-gateway .gateway-top{
    text-align: center;
  }
  .div-gateway .gateway-top p{
    font-size: 12px;
    color: red;
    text-align: right;
  }
  .div-gateway .gateway-top p.online{
    color: #00d58c;
  }
  .div-gateway .gateway-top img{
    width: 160px;
    height: 160px;
    margin: auto;
  }
  .div-gateway .gateway-top h5{
    padding: 10px 0 20px 0;
    font-size: 16px;
    font-weight: normal;
    color: #666;
  }
</style>
