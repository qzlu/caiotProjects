<template>
    <div class="height-100">
        <Table
          ref="table"
          :tableLabel="tableLabel"
          :getData="queryData"
          :showAdd="false"
          @editItem = 'editItem'
          :filter="false"
          :exportData="exportFile" 
          @submit="addOrUpdate"
        >
            <el-form slot="dialog" :model="addData" inline ref="form">
                <el-form-item label="工单类型"  prop='ObjectType'  :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addData.ObjectType"   filterable  placeholder="请选择">
                    <el-option v-for="(list,i) in objectType" :key="i" :label="list" :value="i+1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="签到方式" prop="SignTypeID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addData.SignTypeID"   placeholder="请选择" >
                    <el-option v-for="(list,i) in signType" :key="i" :label="list" :value="i+1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="派单方式" prop="DispatchMethod" :rules="[{ required: true, message: '请选择'}]">
                    <el-select v-model="addData.DispatchMethod">
                        <el-option v-for="(item,i) in dispatchType.slice(1)" :key="i" :label="item" :value="i+1"></el-option>
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
                    prop:'ShortName',
                    label:'项目名称'
                },
                {
                    prop: 'ObjectName',
                    label: '工单类型',
                },
                {
                    prop: 'SignTypeName',
                    label: '签到方式',
                },
                {
                    prop:'DispatchMethod',
                    label:'派单方式',
                    formatter:(row) => this.dispatchType[row.DispatchMethod]
                }
            ],
            dispatchType:['','手动派单','自动派单','抢单模式'],
            defaultAddData:null, //新增默认数据
            addData:{ //新增或修改签到信息
                ID:0,
                SignTypeID:null,
                ObjectType:null,
                ObjectName:null,
                DispatchMethod:null,
                FDescription:''
            },
            signType:['蓝牙签到','二维码签到','NFC签到'],
            objectType:['巡检','巡更','抄表']
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
            return this.$post('/QueryPageUProjectSignType',param,true)
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
            this.$post('/AddOrUpdateUProjectSignType',{
                UProjectSignType:this.addData
            })
            .then((result) => {
                this.$refs.table.show = false
                this.$refs.table.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 导出集团信息
         */
        exportFile(that){
            return this.$post('/ExportUProjectSignType',{SearchKey:''})
        }
    }
}
</script>