<template>
    <div class="height-100">
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
               <el-form-item label="上级部门" prop="FDepartmentCode">
                  <el-select v-model="addData.FParentGUID">
                      <el-option v-for="item in departmentList" :key="item.FGUID" :value="item.FGUID" :label="item.FDepartmentName"></el-option>
                  </el-select>
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
import Table from '../component/table.vue'
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop: 'FDepartmentName',
                    label: '部门名称',
                },
                {
                    prop: 'FParentName',
                    label: '上级部门',
                },
                {
                    prop: 'FLevelName',
                    label: '行政架构范围',
                    formatter:row => {
                        let checkedLevelName = []
                        let levelArr = row.FORGLevelGUID? row.FORGLevelGUID.split(','):[]
                        this.mainDBTORGLevel.forEach(item => {
                            if(levelArr.find((obj) => obj == item.FGUID)){
                                checkedLevelName.push(item.FLevelName)
                            }
                        })
                        return checkedLevelName.join(',')
                    }
                },
            ],
            defaultAddData:{//新增部门信息默认参数
            },
            addData:{ //新增部门信息参数
                FGUID:'',
                FORGGroupGUID:'',
                FDepartmentCode:'',
                FDepartmentName: formatDate(new Date()),
                FDescription:'',
                LevelStr:'',
                FParentGUID:''
            },
            LevelArr:[],
            mainDBTORGLevel:[
                {   
                    FGUID:0,
                    FLevelName:'集团'
                },                
                {   
                    FGUID:1,
                    FLevelName:'区域'
                },
                {
                    FGUID:2,
                    FLevelName:'省份'
                },
                {   
                    FGUID:3,
                    FLevelName:'城市'
                },
                {   
                    FGUID:4,
                    FLevelName:'项目'
                },
            ],
            departMentTreeData:[],
            departmentList:[]
        }
    },
    components:{
        Table
    },
    computed:{
/*         ...mapState([
            'mainDBTORGLevel'
        ]) */
    },
    created(){
        this.$emit('loadDepartment')
        this.querydepartmentList()
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
            return this.$post('QueryPageTORGDepartment',param,true) 
        },
        querydepartmentList(){
            let param = {
                PageIndex:1,
                PageSize:1000,
                SearchKey:''
            }
            this.$post('QueryPageTORGDepartment',param)
            .then((result) => {
                this.departmentList = result.FObject.Data || []
            }).catch((err) => {
                
            });
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
            this.$post('AddOrUpdateTORGDepartment',{
                MTORGDepartment:this.addData
            })
            .then((result) => {
                this.$refs.table.queryData()
                this.$refs.table.show = false
                this.$emit('loadDepartment')
            }).catch((err) => {
                
            });
        },
        /**
         * 删除部门信息
         */
        async deleteItem(item){
            return this.$post('DeleteTORGDepartment',{FGUID:item.FGUID})
        },
        /**
         * 导出部门信息
         */
        exportFile(that){
            return this.$post('ExportTORGDepartment',{SearchKey:that.filterText})
        }
    }
}
</script>
<style lang="scss">
    
</style>