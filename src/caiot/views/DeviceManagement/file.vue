<template>
    <div>
        <div>
            <el-table
               :data="fileList"
               :height="350"
               style="width: 100%"
               header-row-class-name="el-table-header"
               :row-class-name="tableRowClassName"
               >
               <el-table-column type="index" label="序号" width="80"></el-table-column>
               <el-table-column
                 v-for="item in tableLabel"
                 :key="item.prop"
                 :prop="item.prop"
                 :label="item.label"
                 :sortable="item.sortble"
                 show-overflow-tooltip
                >
               </el-table-column>
               <el-table-column
                 prop=""
                 label="查看">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <a :href="`http://www.szqianren.com/${scoped.row.InfoAddress}`"  download="" style="color:white">下载</a>
                     </div>
                 </template>
               </el-table-column>
            </el-table>
        </div>
        <!-- <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination> -->
    </div>
</template>
<script>
import table from '@/caiot/mixins/table' //表格混入数据
import { Device } from '@/caiot/request/api.js';
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop:'InfoName',
                    label:'资料名称'
                },
                {
                    prop: 'FLastUpdateTime',
                    label: '上传时间',
                },
            ],
            fileList:[]
        }
    },
    props:{
        deviceID:{
            type:String
        },
    },
    computed:{
    },
    created(){
        this.queryData()
    },
    methods:{
        /**
         * 
         */
        queryData(){
            Device({
                FAction:'QueryUDeviceLedgerFiles',
                ID:this.$props.deviceID
            })
            .then(data => {
                console.log(data);
                this.fileList = data.FObject
            })
            .catch(err => {})
        }
    }
}
</script>