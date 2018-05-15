<template>
  <el-row class="device_Info cardStyle">
    <span class="del" @click="$emit('remove')">+</span>

    <el-row :gutter="20">
      <el-col :offset="2" :span="8">
        <el-form-item label="定时时间：" class="is-required">

          <el-time-picker v-model="item.temp" format="HH:mm" :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"></el-time-picker>
        </el-form-item>
      </el-col>
      <el-col :offset="1" :span="13">
        <el-form-item label="执行频率：" class="is-required">
          <el-checkbox-group v-model="item.weekName" fill="#00d58c" @change="setDesText" >
            <el-checkbox-button v-for="fr in frequency" :label="fr.value" :key="fr.value">{{fr.label}}</el-checkbox-button>
          </el-checkbox-group>
          <span>{{this.desText}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <!--
        <el-row class="text-right gap" type="flex" align="middle">
          <el-col :span="2" :offset="2">
            定时时间：
          </el-col>
          <el-col :span="5">
            <el-time-picker v-model="item.temp" format="HH:mm" :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"></el-time-picker>
          </el-col>
          <el-col :span="2" :offset="3">
            执行频率：
          </el-col>
          <el-col :span="6" style="width: 21.7%;">
            <el-checkbox-group v-model="item.weekName" fill="#00d58c">
              <el-checkbox-button v-for="fr in frequency" :label="fr.value" :key="fr.value">{{fr.label}}</el-checkbox-button>
            </el-checkbox-group>
          </el-col>
        </el-row> -->

    <el-row :gutter="20">
      <el-col :offset="2" :span="8">
        <el-form-item label="设备开关：">

          <el-radio-group v-model="item.openStatus" class="radioBtn">
            <el-radio class="radio" label="0">开启</el-radio>
            <el-radio class="radio" label="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- <el-row class="text-right" type="flex" align="middle">
          <el-col :span="2" :offset="2">
            设备开关：
          </el-col>
          <el-col :span="5">
            <el-radio-group v-model="item.openStatus" class="radioBtn">
              <el-radio class="radio" label="0">开启</el-radio>
              <el-radio class="radio" label="1">关闭</el-radio>
            </el-radio-group>
          </el-col>
        </el-row> -->

  </el-row>
</template>

<script>
export default {
  name: "timingTask",
  props: ['item'],
  data() {
    return {
      frequency: [
        {
          "value": 1,
          "label": "一"
        },
        {
          "value": 2,
          "label": "二"
        }, {
          "value": 3,
          "label": "三"
        },
        {
          "value": 4,
          "label": "四"
        }, {
          "value": 5,
          "label": "五"
        },
        {
          "value": 6,
          "label": "六"
        }, {
          "value": 7,
          "label": "日"
        }
      ],
      desText: '当不选择周期时,执行频率为单次',
      weekName: this.item.weekName,
    }
  },
  created() {
    if (this.item.hour) {
      this.item.temp = new Date(2017, 7, 10, this.item.hour, this.item.minute);
      console.log(this.item)
      this.setDesText()
    }
  },
  methods: {
    setDesText: function() {

      if (this.item.weekName.length <= 0) {
        this.desText = "当不选择周期时,执行频率为单次"
        return
      }
      if (this.item.weekName.length == 7) {
        this.desText = "重复频率: 每天"
        return
      }
      if (this.item.weekName.length == 2 && this.item.weekName.find((item => item == 6)) && this.item.weekName.find((item => item == 7))) {
        this.desText = "重复频率: 周末"
        return
      }
      if (this.item.weekName.length == 5 && !this.item.weekName.find((item => item == 6)) && !this.item.weekName.find((item => item == 7))) {
        this.desText = "重复频率: 工作日"
        return
      }
      const _desList = []
      this.item.weekName.sort().map(item => {
        switch (item) {
          case 1:
            _desList.push("周一")
            break;
          case 2:
            _desList.push("周二")
            break;
          case 3:
            _desList.push("周三")
            break;
          case 4:
            _desList.push("周四")
            break;
          case 5:
            _desList.push("周五")
            break;
          case 6:
            _desList.push("周六")
            break;
          case 7:
            _desList.push("周日")
            break;
          default:
            break;
        }
      })
      this.desText = "重复频率: " + _desList.join("、")
    }
  },
}
</script>

<style lang="scss" scoped>
.device_Info {
  position: relative;
  .redStar {
    color: #f84a51;
    font-size: 16px;
    margin-right: 6px;
    position: absolute;
    top: 0;
    left: -100px;
  }
}

.gap {
  margin-bottom: 50px;
}

.radioBtn {
  width: 100%;
  display: flex;
  margin-top: 10px; // float: right;
  justify-content: space-around;
}

.cardStyle {
  padding: 40px 0;
  margin-bottom: 30px;
  .del {
    float: right;
    margin: -30px 16px 0 -40px;
    display: inline-block;
    color: #f84a51;
    font-size: 30px;
    font-weight: 700;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    cursor: pointer;
  }
  .el-date-editor {
    width: 100%;
  }
}
</style>
