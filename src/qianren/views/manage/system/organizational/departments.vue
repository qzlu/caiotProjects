<template>
    <div class="report">
        <Table
          ref='table'
          :tableLabel = 'tableLabel' 
          :getData='queryData' 
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow = 'deleteItem' 
          :exportData="exportFile" 
          @submit="addOrUpdate"
        >
           <el-form slot="dialog" :model="addData" inline ref="form">
               <el-form-item label="部门编码" prop="FDepartmentCode" :rules="[{ required: true, message: '请输入'}]">
                   <el-input v-model="addData.FDepartmentCode"></el-input>
               </el-form-item>
               <el-form-item label="部门名称" prop="FDepartmentName" :rules="[{ required: true, message: '请输入'}]">
                   <el-input v-model="addData.FDepartmentName"></el-input>
               </el-form-item>
               <el-form-item label="范围">
                    <el-checkbox-group v-model="LevelArr">
                        <el-checkbox v-for="item in mainDBTORGLevel" :key="item.FGUID" :label="item.FGUID">{{item.FLevelName}}</el-checkbox>
                    </el-checkbox-group>
               </el-form-item>
           </el-form>
        </Table>
    </div>
</template>
<script>
import { mapState} from 'vuex'
import formatDate from '@/utils/formatDate.js'
import Table from '../../components/table.vue'
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop: 'FDepartmentCode',
                    label: '部门编码',
                },
                {
                    prop: 'FDepartmentName',
                    label: '部门名称',
                },
                {
                    prop: 'FLevelName',
                    label: '行政架构范围',
                },
            ],
            defaultAddData:{//新增部门信息默认参数
                FGUID:'',
                FDepartmentCode:'',
                FDepartmentName:'',
                FCreateTime: formatDate(new Date()),
                FDescription:'',
                LevelStr:''
            },
            addData:{ //新增部门信息参数
                FGUID:'',
                FDepartmentCode:'',
                FDepartmentName:'',
                FCreateTime: formatDate(new Date()),
                FDescription:'',
                LevelStr:''
            },
            LevelArr:[]
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
    created(){
    },
    methods:{
        /**
         * 查询部门信息
         * @param {Vue Component} that 传入子组件
         */
        queryData(that){
            let param = {
                PageIndex:that.pageIndex,
                PageSize:10,
                SearchKey:that.filterText
            }
            return this.$post('/QueryPageTORGDepartment',param,true) 
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.addData = Object.assign({},this.defaultAddData)
            this.LevelArr = []
        },
        /**
         * 编辑部门
         */
        editItem(row){
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = row[key]
            })
            if(row.FORGLevelGUID){
                this.LevelArr = row.FORGLevelGUID.split(',')
            }else{
                this.LevelArr = []
            }
        },
        /**
         * 新增或编辑部门信息
         */
        addOrUpdate(){
            this.addData.LevelStr = this.LevelArr.join(',')
            this.$post('/AddOrUpdateTORGDepartment',{
                MTORGDepartment:this.addData
            })
            .then((result) => {
                this.$refs.table.queryData()
                this.$refs.table.show = false
            }).catch((err) => {
                
            });
        },
        /**
         * 删除部门信息
         */
        async deleteItem(item){
            return this.$post('/DeleteTORGDepartment',{FGUID:item.FGUID})
        },
        /**
         * 导出部门信息
         */
        exportFile(that){
            return this.$post('/ExportTORGDepartment',{SearchKey:that.filterText})
        }
    }
}
</script>
<style lang="scss">
    
</style>