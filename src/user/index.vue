<template>
    <div>
        <main-layout>
            <router-view :buttonList = 'buttonList'></router-view>
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
            let FGUID = this.$route.meta.formList&&this.$route.meta.formList[formIndex-1]
            console.log(FGUID)
            if(!FGUID) return
            this.$post('QueryTMenuListButton',{FFormID:'3F2F8DAA-4396-46A4-953D-FCBACA4AF117',FGUID})
            .then((result) => {
                this.buttonList = result.FObject || []
            }).catch((err) => {
                
            });
        }
    }
}
</script>