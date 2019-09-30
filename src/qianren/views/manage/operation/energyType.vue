<template>
    <div class="height-100">
        <Table
          ref="table"
          :tableLabel="tableLabel"
          :getData="queryData"
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow = 'deleteItem' 
          :exportData="exportFile" 
          @submit="addOrUpdate"
        >
            <el-form slot="dialog" :model="addData" inline ref="form">
                <el-form-item label="能源类型" prop="EnergyTypeName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.EnergyTypeName">
                    </el-input>
                </el-form-item>
                <el-form-item label="单位" prop="EnergyTypeUnit">
                    <el-input v-model="addData.EnergyTypeUnit">
                    </el-input>
                </el-form-item>
            </el-form>
        </Table>
    </div>
</template>
<script>
import Table from '../components/table.vue'
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop:'ID',
                    label:'能源类型ID'
                },
                {
                    prop: 'EnergyTypeName',
                    label: '能源类型名称',
                },
                {
                    prop: 'EnergyTypeUnit',
                    label: '单位',
                }
            ],
            defaultAddData:null, //新增默认数据
            addData:{ //新增或修改项目参数
                ID:0,
                EnergyTypeName:null,
                EnergyTypeUnit:null,
                EnergyTypeIcon:''
            },
        }
    },
    components:{
        Table
    },
    created(){
        this.defaultAddData = Object.assign({},this.addData)
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
            return this.$post('/QueryPageSEnergyType',param,true)
        },
        /**
         * 点击新增
         */
        beforeAdd(){
           this.addData = Object.assign({},this.defaultAddData)
        },
        /**
         * 编辑
         */
        editItem(row){
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = row[key] || ''
            })
        },
        /**
         * 新增或编辑
         */
        async addOrUpdate(){
            this.$post('/AddOrUpdateSEnergyType',{
                SEnergyType:this.addData
            })
            .then((result) => {
                this.$refs.table.show = false
                this.$refs.table.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 删除
         */
        deleteItem(item){
            return this.$post('/DeleteSEnergyType',{ID:item.ID})
        },
        /**
         * 导出
         */
        exportFile(that){
            return this.$post('/ExportSEnergyType',{SearchKey:that.filterText})
        }
    }
}
</script>