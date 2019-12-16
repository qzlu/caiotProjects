<template>
    <div>
        <main-layout>
            <router-view></router-view>
        </main-layout>
    </div>
</template>
<script>
import mainLayout from '../layout/mainLayout.vue'
export default {
    data(){
        return{
            buttonList:[]
        }
    },
    provide(){
        return {
            buttonList:this.buttonList
        }
    },
    components:{
        mainLayout,
    },
    watch:{
        $route(){
            this.queryTMenuListButton()
        }
    },
    created(){
       /*  console.log(this.$route) */
       this.queryTMenuListButton()
    },
    methods:{
        /**
         * 用户管理—查询树状角色菜单
         */
        queryTMenuListButton(){
            let formIndex = this.$route.params.id
            let FGUID = this.$route.meta.FGUID
            this.$post('QueryTMenuListButton',{FFormID:this.$store.state.formID,FGUID})
            .then((result) => {
                let data = result.FObject || []
                this.buttonList.length = 0
                this.buttonList.push(...data)
            }).catch((err) => {
                
            });
        }
    }
}
</script>