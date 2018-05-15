<template>
    <section>
        <ul>
            <BaseSettingList
              v-for="data in dataList"
              :key="+new Date()"
              :data="data"
              :refresh="ready"
            >
            </BaseSettingList>
        </ul>
    </section>
</template>

<script>
    import { getBaseSetting } from '../../../api/api'
    import BaseSettingList from './BaseSettingList'
    export default {
        name: "",
        components:{
            BaseSettingList
        },
        data() {
            return {
                dataList:[]
            }
        },
        created(){
          this.ready();
        },
        methods:{
          ready(){
                let baseParams = {};
                getBaseSetting(baseParams).then(data=>{
                  // console.log(data.data);
                  this.dataList = data.data;
                }).catch(error=>{
                  console.log(error);
                });
          },
        }
    }
</script>

<style lang="scss" scoped>

</style>
