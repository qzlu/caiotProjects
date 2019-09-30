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
                <el-form-item label="集团编码" prop="FGroupCode" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.FGroupCode"></el-input>
                </el-form-item>
                <el-form-item label="集团全称" prop="FGroupName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.FGroupName"></el-input>
                </el-form-item>
                <el-form-item label="集团简称" prop="FSimpleName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.FSimpleName"></el-input>
                </el-form-item>
                <el-form-item label="所属区域" prop="FAreaCode" :rules="[{ required: true, message: '请选择'}]">
                    <el-select v-model="addData.FAreaCode">
                        <el-option v-for="(item,i) in areaList" :key="i" :value="item.id" :label="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="详细地址" prop="FAddress" :rules="[{ required: true, message: '请输入'}]">
                    <el-input class="block" v-model="addData.FAddress"></el-input>
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
                    prop:'FGroupCode',
                    label:'集团编码'
                },
                {
                    prop:'FGroupName',
                    label:'集团全称'
                },
                {
                    prop: 'FSimpleName',
                    label: '集团简称',
                },
                {
                    prop: 'FAreaName',
                    label: '所属区域',
                    formatter:row => {
                        let area = this.areaList.find(item => item.id == row.FAreaCode)
                        return area?area.name:''
                    }
                },
/*                 {
                    prop: 'ParamNameValue',
                    label: 'LOGO图标',
                }, */
                {
                    prop: 'FAddress',
                    label: '地址',
                }
            ],
            areaList:[
                {
                    id:'102',
                    name:'华东地区'
                },
                {
                    id:'105',
                    name:'华中地区'
                },
                {
                    id:'107',
                    name:'华北地区'
                },
                {
                    id:'106',
                    name:'西南地区'
                },
                {
                    id:'104',
                    name:'东北地区'
                },
                {
                    id:'103',
                    name:'华南地区'
                },
                {
                    id:'101',
                    name:'西北地区'
                },
                {
                    id:'108',
                    name:'台湾'
                },
            ],
            defaultAddData:null, //新增默认数据
            addData:{ //新增或修改项目参数
                FGUID:'',
                FGroupCode:null,
                FGroupName:null,
                FSimpleName:null,
                FGrouplng:null,
                FGrouplat:null,
                FAddress:null,
                FAreaCode:null,
                FDescription:null
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
            return this.$post('/QueryPageDTORGGroup',param,true)
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
            let myGeo = new BMap.Geocoder()
            let address = this.addData.FAddress
            await new Promise((resolve) => {
                myGeo.getPoint(address,point => {
                    this.addData.FGrouplng = point.lng||this.addData.FGrouplng
                    this.addData.FGrouplat = point.lat||this.addData.FGrouplat
                    resolve()
                })
            })
            this.$post('/AddOrUpdateDTORGGroup',{
                MTORGGroup:this.addData
            })
            .then((result) => {
                this.$refs.table.show = false
                this.$refs.table.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 删除集团
         */
        deleteItem(item){
            return this.$post('/DeleteDTORGGroup',{FGUID:item.FGUID})
        },
        /**
         * 导出集团信息
         */
        exportFile(that){
            return this.$post('/ExportDTORGGroup',{SearchKey:that.filterText})
        }
    }
}
</script>