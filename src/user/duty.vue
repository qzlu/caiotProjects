<template>
    <div class="height-100">
        <Table ref="station" 
          :tableLabel = 'tableLabel' 
          :getData='queryData' 
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow = 'deleteItem' 
          :exportData="exportFile" 
          @submit="addOrUpdate">
            <el-form slot="dialog" :model="addData" inline ref="form">
               <el-form-item label="职责编码" prop="FDutyCode" :rules="[{ required: true, message: '请输入'}]">
                   <el-input v-model="addData.FDutyCode"></el-input>
               </el-form-item>
               <el-form-item label="职责名称" prop="FDutyName" :rules="[{ required: true, message: '请输入'}]">
                   <el-input v-model="addData.FDutyName"></el-input>
               </el-form-item>
               <el-form-item label="职责描述" prop="FDescription">
                    <el-input
                      class="block"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      v-model="addData.FDescription">
                    </el-input>
               </el-form-item>
           </el-form>
        </Table>
    </div>
</template>
<script>
import Table from '../component/table.vue'
import { mapState} from 'vuex'
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop: 'FDutyCode',
                    label: '职责编码',
                },
                {
                    prop: 'FDutyName',
                    label: '职责名称',
                },
                {
                    prop: 'FDescription',
                    label: '职责描述',
                },
            ],
            defaultAddData:{//新增职责信息默认参数
                FGUID:'',
                FDutyCode:'',
                FDutyName:'',
                FDescription:'',
            },
            addData:{ //新增职责信息参数
                FGUID:'',
                FDutyCode:'',
                FDutyName:'',
                FDescription:'',
            },
        }
    },
    components:{
        Table
    },
    computed:{
        ...mapState([
            'mainDBTORGLevel'
        ])
    },
    methods:{
        /**
         * 查询数据
         * @param {Vue Component} that 传入子组件
         */
        queryData(that){
            let param = {
                PageIndex:that.pageIndex,
                PageSize:10,
                SearchKey:that.filterText
            }
            return this.$post('QueryPageTORGDuty',param,true)
        },
        /**
         * 点击新增
         */
        beforeAdd(){
           this.addData = Object.assign({},this.defaultAddData)
           this.LevelArr = []
        },
        /**
         * 编辑
         */
        editItem(row){
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = row[key]
            })
        },
        /**
         * 新增或编辑
         */
        addOrUpdate(){
            this.$post('AddOrUpdateTORGDuty',{
                MTORGDuty:this.addData
            })
            .then((result) => {
                this.$refs.station.show = false
                this.$refs.station.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 删除
         * @param {Object} item 删除的对象
         *          
         */
        deleteItem(item){
            return this.$post('DeleteTORGDuty',{FGUID:item.FGUID})
        },
        /**
         * 导出岗位信息
         */
        exportFile(that){
            return this.$post('ExportTORGDuty',{SearchKey:that.filterText})
        }
    }
}
</script>