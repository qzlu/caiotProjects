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
          :beforeSubmit="beforeSubmit" 
          :submitFun="addOrUpdate"
        >
            <el-form slot="dialog" :model="addData" inline ref="form">
                <el-form-item label="系统名称" prop="FormName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.FormName"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="IconName">
                  <el-select v-model="addData.IconName" filterable placeholder="请选择">
                    <el-option v-for="(item,i) in iconList"  :key="i" :value="`icon-${item.font_class}`">
                        <i :class="['iconfont',`icon-${item.font_class}`]" style="font-size:24px;"></i>
                        <span>{{`icon-${item.font_class}`}}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
               <el-table-column
                 prop=""
                 label="图标">
                 <template slot-scope="scoped">
                     <div>
                         <i :class="['iconfont',scoped.row.IconName]"></i>
                     </div>
                 </template>
               </el-table-column>
        </Table>
    </div>
</template>
<script>
import Table from '../layout/table.vue'
import {System} from '@/xiaoFangCloud/request/api.js';
import iconJson from '@/assets/css-font/iconfont.json'
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop:'FormName',
                    label:'系统名称'
                },
            ],
            defaultAddData:{
                ID:0,
                FormName:null,
                IconName:null,
            }, //新增默认数据
            addData:{ //新增或修改项目参数
            },
            iconList:[]
        }
    },
    components:{
        Table
    },
    created(){
        this.iconList = iconJson.glyphs
    },
    methods:{
        /**
         * 查询数据
         * @param {Vue Component} data 传入参数
         */
        queryData(data){
            let param = {
                FAction:'QueryPageSForm',
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
            this.beforeAdd()
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = row[key] || ''
            })
        },
        beforeSubmit(){
        },
        /**
         * 新增或编辑
         */
        async addOrUpdate(){
            return System({
                FAction:'AddOrUpdateSForm',
                sForm:this.addData
            },true)
        },
        /**
         * 删除
         */
        deleteItem(item){
            return System({FAction:'DeleteSForm',ID:item.ID})
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