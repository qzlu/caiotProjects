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
               <el-form-item label="角色名称" prop="FDepartmentCode" :rules="[{ required: true, message: '角色名称不能为空'}]">
                   <el-input v-model="addData.FName"></el-input>
               </el-form-item>
               <el-form-item label="角色简称" prop="FDepartmentName" :rules="[{ required: true, message: '角色简称不能为空'}]">
                   <el-input v-model="addData.FSimpleName"></el-input>
               </el-form-item>
           </el-form>
           <template v-slot:row-operation="row">
                <span class="iconfont icon-System" title="权限"  @click="test(row)">
                    {{row.FName}}
                </span>
           </template>
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
                    prop: 'FName',
                    label: '角色名称',
                },
                {
                    prop: 'FUserCount',
                    label: '员工数量',
                },
                {
                    prop: 'FUserName',
                    label: '创建账号',
                },
                {
                    prop: 'FLastUpdateTime',
                    label: '创建时间',
                },
            ],
            defaultAddData:{//新增默认参数
                FName:'',
                FSimpleName:'',
            },
            addData:{ //新增参数
                FName:'',
                FSimpleName:'',
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
         * 查询
         * @param {Vue Component} that 传入子组件
         */
        queryData(that){
            let param = {
                PageIndex:that.pageIndex,
                PageSize:10,
                SearchKey:that.filterText
            }
            return this.$post('/QueryPageTRole',param,true) 
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
                this.addData[key] = row[key]
            })
        },
        /**
         * 新增或编辑
         */
        addOrUpdate(){
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
         * 删除
         */
        async deleteItem(item){
            return this.$post('/DeleteTRole',{FGUID:item.FGUID})
        },
        /**
         * 导出
         */
        exportFile(that){
            return this.$post('/ExportTRole',{SearchKey:that.filterText})
        },
        test(item){
            console.log(item)
        }
    }
}
</script>
<style lang="scss">
    
</style>