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
                <el-form-item label="告警类型" prop="AlarmTypeName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.AlarmTypeName">
                    </el-input>
                </el-form-item>
                <el-form-item label="告警级别" prop="AlarmLevel">
                  <el-select v-model="addData.AlarmLevel" filterable placeholder="请选择">
                    <el-option v-for="item in alarmLevel" :key="item.id" :value="item.id" :label="item.label"></el-option>
                  </el-select>
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
                    prop:'AlarmTypeID',
                    label:'告警类型ID'
                },
                {
                    prop: 'AlarmTypeName',
                    label: '告警类型名称',
                },
                {
                    prop: 'AlarmLevelName',
                    label: '告警级别',
                    formatter:row => this.alarmLevel[Number(row.AlarmLevel)-1].label
                }
            ],
            alarmLevel:[
                {
                    id:1,
                    label:'提示',
                },
                {
                    id:2,
                    label:'一般'
                },
                {
                    id:3,
                    label:'严重'
                }
            ],
            defaultAddData:null, //新增默认数据
            addData:{ //新增或修改项目参数
                AlarmTypeID:0,
                AlarmTypeName:null,
                AlarmLevel:null,
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
            return this.$post('/QueryPageSAlarmType',param,true)
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
            this.$post('/AddOrUpdateSAlarmType',{
                SAlarmType:this.addData
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
            return this.$post('/DeleteSAlarmType',{ID:item.AlarmTypeID})
        },
        /**
         * 导出
         */
        exportFile(that){
            return this.$post('/ExportAlarmType',{SearchKey:''})
        }
    }
}
</script>