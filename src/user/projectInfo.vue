<template>
    <div class="height-100">
            <Table
               ref="table"
              :tableLabel="tableLabel"
              :getData='queryData'
              :filter='false'
              @beforeAdd = 'beforeAdd'
              @editItem = 'editItem'
              :deleteRow = 'deleteItem'
              :exportData="exportFile" 
              @submit="addOrUpdate"
            >
                <el-form class="add-block" slot="dialog" :model="addData" inline ref="form">
                    <el-form-item label="项目全称" prop="FProjectName" :rules="[{ required: true, message: '请输入'}]">
                        <el-input v-model="addData.FProjectName"></el-input>
                    </el-form-item>
                    <el-form-item label="项目简称"  prop="FSimpleName" :rules="[{ required: true, message: '请输入'}]">
                        <el-input  v-model="addData.FSimpleName"></el-input>
                    </el-form-item>
                    <el-form-item label="建筑业态" prop="BuildTypeID" :rules="[{ required: true, message: '请选择'}]">
                        <el-select v-model="addData.BuildTypeID">
                            <el-option :value="31" label="商住"></el-option>
                            <el-option :value="32" label="商业"></el-option>
                            <el-option :value="33" label="住宅"></el-option>
                            <el-option :value="34" label="酒店会所"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="建筑面积" prop="BuildArea" :rules="[{ required: true, message: '请输入'}]">
                        <el-input class="unit" type="number" v-model="addData.BuildArea" autocomplete="off">
                           <span slot="suffix">m²</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="项目经理" prop="BuildTypeID" :rules="[{ required: true, message: '请选择'}]">
                        <el-select v-model="addData.BuildTypeID">
                            <el-option :value="31" label="商住"></el-option>
                            <el-option :value="32" label="商业"></el-option>
                            <el-option :value="33" label="住宅"></el-option>
                            <el-option :value="34" label="酒店会所"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="联系电话"  prop="FSimpleName" :rules="[{ required: true, message: '请输入'}]">
                        <el-input  v-model="addData.FSimpleName"></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="Address" :rules="[{ required: true, message: '请输入'}]">
                        <el-input class="block" type="textarea" v-model="addData.Address"></el-input>
                    </el-form-item>
                    <el-form-item label="行政架构" prop="BuildTypeID" :rules="[{ required: true, message: '请选择'}]">
                        <el-select class="block" v-model="addData.BuildTypeID">
                            <el-option :value="31" label="商住"></el-option>
                            <el-option :value="32" label="商业"></el-option>
                            <el-option :value="33" label="住宅"></el-option>
                            <el-option :value="34" label="酒店会所"></el-option>
                        </el-select>
                    </el-form-item>
                <el-form-item  label="项目描述" prop="FDescription">
                    <el-input class="block" v-model="addData.FDescription"></el-input>
                </el-form-item>
                    <el-form-item label="项目宣传图">
                        <div class="thumb-img" v-if="fileList[0]">
                            <div class="delete">
                                <i class="el-icon-delete" @click="fileList = [] "></i>
                            </div>
                            <img :src="'http://47.107.224.8:8080/'+fileList[0]" alt="">
                        </div>
                        <el-upload
                          v-else
                          action="http://47.107.224.8:8080/UploadFile"
                          list-type="picture-card"
                          :limit = '1'
                          :on-success="handleSuccess1"
                          :data="{FTokenID:token}"
                         >
                            <p><i class="el-icon-plus"></i><br><span>上传</span></p>
                        </el-upload>                
                    </el-form-item>
                </el-form>
            </Table>
    </div>
</template>
<script>
import Table from '../component/table.vue'
/* import provinceList from '@/mapJson/provinceList.json' */
const param = {
    PageIndex:1,
    PageSize:1000,
    SearchKey:''
}
export default {
    data(){
        return{
            show:false,
            filterText:'',
            tableLabel:[
                {
                    prop: 'FProjectName',
                    label: '项目全称',
                },
                {
                    prop: 'FSimpleName',
                    label: '项目简称称',
                },
                {
                    prop: 'FAreaName',
                    label: '行政架构',
                },
                {
                    prop: 'SystemParamName',
                    label: '详细地址',
                },
                {
                    prop: 'SystemParamName',
                    label: '建筑业态',
                },
                {
                    prop: 'BuildArea',
                    label: '建筑面积',
                },
                {
                    prop: 'FContact',
                    label: '项目负责人',
                },
                {
                    prop: 'FPhone',
                    label: '联系方式',
                },
            ],
            treeData:[],
            treeProp:{
                children:'ListData',
                label:'FAreaName'
            },
            defaultAddData:{ //新增默认数据
            },
            provinces:[],
            addData:{
                ProjectID:0,         
                FORGNodeGUID:'',      
                FProjectName:'',
                FSimpleName:'',   
                FProjectCode:'',  
                FAreaName:'',
                FAreaCode:'',  
                FProjectlng:'',  
                FProjectlat:'',    
                FSortID:'',    
                Address:'',
                BuildArea:'',   
                BuildTypeID:'',     
                OtherSourceID:0,   
                SystemType:0,   
                OnlineDateTime:'',
                FContact:'',
                FPhone:'',
                FDescription:''
            },
            FAreaCode:[],
            currentNode:{}, //当前选中节点
            fileList:[],
        }
    },
    components:{
        Table
    },
    computed:{
        disabledAdd(){
            let value = this.currentNode.FGUID?false:true
            return value
        }
    },
    watch:{
        filterText(val){
            this.$refs.tree.filter(val);
        },
    },
    created(){
        this.defaultAddData = JSON.parse(JSON.stringify(this.addData))
        this.provinces = provinceList
    },
    methods:{
        /**
         * 查询项目信息
         */
        queryData(that){
            let param = {
                FGUID: '',
                PageIndex:that.pageIndex,
                FAreaCode:this.currentNode.FAreaCode,
                FAreaLevel:this.currentNode.FAreaLevel,
                PageSize:10,
                SearchKey:''
            }
            return this.$post('QueryPageTORGProject',param,true)
        },
        QueryMainTORGNodeArea(){
            this.$post('QueryMainTORGNodeArea',{
                
            })
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.addData = Object.assign({},this.defaultAddData)
            this.FAreaCode = []
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
         * 新增或修改项目
         */
        async addOrUpdate(){
            this.addData.FORGNodeGUID = this.currentNode.FGUID
            this.addData.FAreaCode = this.currentNode.FAreaCode
            this.addData.FPublicityPhoto = this.fileList[0]||''
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            let myGeo = new BMap.Geocoder()
            let address = this.addData.Address
            await new Promise((resolve) => {
                myGeo.getPoint(address,point => {
                    this.addData.FProjectlng = point.lng||this.addData.FProjectlng
                    this.addData.FProjectlat = point.lat||this.addData.FProjectlat
                    resolve()
                })
            })
            this.$post('AddOrUpdateTORGProject',{
                MTORGProject:this.addData
            })
            .then((result) => {
                this.$refs.table.queryData()
                this.$refs.table.show = false
            }).catch((err) => {
                
            });
        },
        /**
         * 删除项目
         */
        deleteItem(row){
            return this.$post('DeleteTORGProject',{ProjectID:row.ProjectID})
        },
        exportFile(){
            return this.$post('ExportTORGProject',{FGUID:this.currentNode.FGUID,SearchKey:''})
        }
    }
}
</script>
<style lang="scss">
.el-dialog{
    .add-block{
        .thumb-img{
            width: 165px;
            height:128px;
            position: relative;
            border: 1px solid #05679e;
            border-radius: 6px;
            .delete{
                display: none;
                position: absolute;
                width: 100%;
                height: 100%;
                line-height: 128px;
                left: 0;
                top: 0;
                background: rgba($color: #000000, $alpha: 0.3);
                cursor: pointer;
                font-size: 40px;
                text-align: center;
                color: white;
            }
            img{
                width: 100%;
                height: 100%;
            }
        }
        .thumb-img:hover{
            .delete{
                display: block;
            }
        }
        .el-upload--picture-card{
            width:165px;
            height:128px;
            background:rgba(24,64,107,1);
            border:1px solid rgba(5,103,158,1);
            p{
                line-height: 26px;
                display: inline-block;
                color: #9EE5F3;
                i{
                    font-size: 30px;
                    color: #9EE5F3;
                }
            }
        }
    }
}
</style>