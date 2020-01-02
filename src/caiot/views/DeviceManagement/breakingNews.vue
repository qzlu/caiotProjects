<template>
    <div>
        <breaking-new :data='dataList' :showTitle="false" :props="{title:'EventsTypeName',time:'EventsTime'}"></breaking-new>
    </div>
</template>
<script>
import breakingNew from '@/caiot/views/monitoring/d_l_a.vue'
import {Device} from '@/caiot/request/api.js'
export default {
    data(){
        return{
            dataList:[],
            // deviceID:''
        }
    },
    props:{
        deviceID:{
            type:String
        }
    },
    components:{
        breakingNew,
    },
    created(){
        // this.deviceID = this.$route.params.deviceID
    },
    mounted(){
        this.queryUDeviceLedgerEvents()
    },
    methods:{
        /**
         * 248.查询设备台账大事件
         */
        queryUDeviceLedgerEvents(){
            Device({
                FAction:'QueryUDeviceLedgerEvents',
                ID:this.$props.deviceID
            })
            .then((data) => {
                this.dataList = data.FObject
            }).catch((err) => {
                
            });
        }
    }
}
</script>