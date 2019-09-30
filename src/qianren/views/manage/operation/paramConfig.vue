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
            <el-table-column
                 prop=""
                 label="图标">
                 <template v-slot={row}>
                     <div>
                         <i :class="['iconfont',row.IconName]"></i>
                     </div>
                 </template>
            </el-table-column>
            <el-form slot="dialog" :model="addData" label-width="110px" inline ref="form">
                <el-form-item label="系统分类名称" prop="ParamName" :rules="[{ required: true, message: '请输入'}]">
                    <el-select v-model="addData.ParamName">
                        <el-option label="建筑类型" value="建筑类型"></el-option>
                        <el-option label="区域分类" value="区域分类"></el-option>
                        <el-option label="设备分类" value="设备分类"></el-option>
                        <el-option label="行业分类" value="行业分类"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系统参数值" prop="Value" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.Value">
                    </el-input>
                </el-form-item>
                <el-form-item label="扩展采纳数值" prop="Extend" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.Extend">
                    </el-input>
                </el-form-item>
                <el-form-item label="图标" prop="IconName">
                  <el-select v-model="addData.IconName" filterable placeholder="请选择">
                    <el-option v-for="(item,i) in iconList"  :key="i" :value="'icon-'+item.font_class">
                        <i :class="['iconfont','icon-'+item.font_class]" style="font-size:24px;"></i>
                        <span>{{'icon-'+item.font_class}}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
        </Table>
    </div>
</template>
<script>
import Table from '../components/table.vue'
import Icon from '@/assets/css-font/iconfont.json'
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop:'ParamName',
                    label:'分类名称'
                },
                {
                    prop: 'ParamID',
                    label: '参数编号',
                },
                {
                    prop:'Value',
                    label:'参数值'
                },
                {
                    prop: 'Extend',
                    label: '扩展参数值',
                }
            ],
            iconList:Icon.glyphs,
            defaultAddData:null, //新增默认数据
            addData:{ //新增或修改项目参数
                ParamID:0,
                ParamName:null,
                Value:null,
                Extend:null,
                IconName:''
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
            return this.$post('/QueryPageSSystemParam',param,true)
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
            this.$post('/AddOrUpdateSSystemParam',{
                SSystemParam:this.addData
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
            return this.$post('/DeleteSSystemParam',{ID:item.ParamID})
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