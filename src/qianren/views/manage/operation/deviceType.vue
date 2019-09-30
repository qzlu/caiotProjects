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
            <el-form slot="dialog" label-width="110px" :model="addData" inline ref="form">
                <el-form-item label="设备类型名称" prop="DeviceTypeName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.DeviceTypeName">
                    </el-input>
                </el-form-item>
                <el-form-item label="系统类型" prop="DeviceItemID" :rules="[{ required: true, message: '请输入'}]">
                    <el-select v-model="addData.DeviceItemID" filterable  placeholder="请选择">
                      <el-option v-for="item in systemList" :key="item.ParamID" :label="item.Value" :value="item.ParamID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="能源类型" prop="EnergyTypeID" :rules="[{ required: true, message: '请输入'}]">
                  <el-select v-model="addData.EnergyTypeID" filterable  placeholder="请选择">
                    <el-option v-for="item in energyTypeList" :key="item.ID" :label="item.EnergyTypeName" :value="item.ID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否物联设备" prop="IsIOTDeviceType">
                    <el-select v-model="addData.IsIOTDeviceType">   
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
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
                    prop:'DeviceTypeID',
                    label:'设备类型ID'
                },
                {
                    prop: 'DeviceTypeName',
                    label: '设备类型名称',
                },
                {
                    prop: 'SystemParamName',
                    label: '所属系统类型',
                },
                {
                    prop: 'EnergyTypeName',
                    label: '所属能源类型',
                },
/*                 {
                    prop: 'IsIOTDeviceType',
                    label: '是否物联设备',
                    formatter:row => row.IsIOTDeviceType?'是':'否'
                } */
            ],
            iconList:Icon.glyphs,
            systemList:[], //系统列表
            energyTypeList:[], //能源类型
            defaultAddData:null, //新增默认数据
            addData:{ //新增或修改项目参数
                DeviceTypeID:0,
                ParentID:0,
                DeviceTypeName:null,
                DeviceItemID:null,
                IconName:'',
                EnergyTypeID:null,
                IsIOTDeviceType:1
            },
        }
    },
    components:{
        Table
    },
    created(){
        this.defaultAddData = Object.assign({},this.addData)
        this.queryPageSSystemParam()
        this.querySEnergyType()
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
            return this.$post('/QueryPageSDeviceType',param,true)
        },
        /**
         * 查询系统类型
         */
        queryPageSSystemParam(){
            this.$post('/QueryPageSSystemParam',{
                SearchKey:'',
                PageIndex:1,
                PageSize:10000
            })
            .then((data) => {
                this.systemList = data.FObject.Data || []
            }).catch((err) => {
            });
        },
        /**
         * 查询能耗类型
         */
        querySEnergyType(){
            this.$post('QueryPageSEnergyType',{
                SearchKey:'',
                PageIndex:1,
                PageSize:10000
            })
            .then(data => {
                this.energyTypeList = data.FObject.Data || []
            })
            .catch(error => {

            })
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
            this.$post('/AddOrUpdateSDeviceType',{
                SDeviceType:this.addData
            })
            .then((result) => {
                this.$refs.table.show = false
                this.$refs.table.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 删除设备类型
         */
        deleteItem(item){
            return this.$post('/DeleteSDeviceType',{ID:item.DeviceTypeID})
        },
        /**
         * 导出设备类型
         */
        exportFile(that){
            return this.$post('/ExportSDeviceType',{SearchKey:that.filterText})
        }
    }
}
</script>