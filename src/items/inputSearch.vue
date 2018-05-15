<!------------------------------------------------------------------------------------------------
 about: 此文件是搜索框。
    调用例子：
    html:
      <inputSearch :formInline="筛选form的监听值" :iconSearch="搜索图标"></inputSearch>

      例如：<inputSearch :formInline="formInline" :iconSearch="iconSearch"></inputSearch>

    data:
          data(){
            ruturn(){
                formInline:{
                  keyword:'' // 筛选form下监听的搜索框关键字，用于搜索
                },
                iconSearch:{
                  iconIsDelKeyword:'' // 搜索框的删除图标，默认搜索框没值时，不显示删除图片，传''空值
                }
            }
          }
 author: 谢梅花
 date: 2017-9-7
------------------------------------------------------------------------------------------------>
<template lang="html">
  <div id="wrap-input-search">
    <i class="iconfont icon-search"></i>
    <el-input v-model="formInline.keyword" placeholder="请输入搜索关键字" :icon="iconSearch.iconIsDelKeyword" :on-icon-click="delKeyword" @change="hasKeyword" :autofocus="isFocusSearch"></el-input>
  </div>
</template>

<script>
  export default {
    props:['formInline','iconSearch'],
    data(){
      return{
        isFocusSearch:false,
      }
    },
    methods:{
      delKeyword(){
        this.formInline.keyword = "";
        this.iconSearch.iconIsDelKeyword = "";
        this.isFocusSearch = true;
      },
      hasKeyword(){
        if(this.formInline.keyword != ""){
          this.iconSearch.iconIsDelKeyword = "circle-close";
        }else{
          this.iconSearch.iconIsDelKeyword = "";
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>
