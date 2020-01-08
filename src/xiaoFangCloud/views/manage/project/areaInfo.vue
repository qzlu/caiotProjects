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
          :submitFun="addOrUpdate"
        >
            <el-form slot="dialog" :model="addData" inline ref="form" class="add-block">
                <el-form-item label="项目名称" >
                  <el-input readonly :value="projectName"></el-input>
                </el-form-item>
                <el-form-item label="区域名称" prop="AreaName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.AreaName"></el-input>
                </el-form-item>
                <el-form-item label="区域位置" prop="Position" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.Position"></el-input>
                </el-form-item>
            </el-form>
        </Table>
    </div>
</template>
<script>
import Table from '../layout/table.vue'
import {System} from '@/xiaoFangCloud/request/api.js';
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop:'BlocName',
                    label:'集团全称'
                },
                {
                    prop: 'ProjectName',
                    label: '项目名称',
                },
                {
                    prop: 'AreaName',
                    label: '区域名称',
                },
                {
                    prop: 'Position',
                    label: '区域位置',
                }
            ],
            defaultAddData:null, //新增默认数据
            projectName:sessionStorage.getItem('projectName'),
            addData:{ //新增或修改项目参数
                AreaID:null,
                AreaName:null,
                Position:null,
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
         * @param {Vue Component} data 传入参数
         */
        queryData(data){
            let param = {
                FAction:'QueryPageUArea',
                ...data
            }
            return System(param,true)
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
            return System({
                FAction:'AddOrUpdateUArea',
                uArea:this.addData
            },true)
        },
        /**
         * 删除
         */
        deleteItem(item){
            return System({FAction:'DeleteUArea',AreaID:item.AreaID})
        },
        /**
         * 导出
         */
        exportFile(that){
            return this.$post('/ExportDTORGGroup',{SearchKey:that.filterText})
        }
    }
}
</script>
<style lang="scss">

</style>