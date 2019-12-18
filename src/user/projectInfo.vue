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
                    <el-form-item label="所属集团" prop="FORGGroupGUID" :rules="[{ required: true, message: '请选择'}]">
                        <el-select v-model="addData.FORGGroupGUID">
                            <el-option v-for="item in blockList" :key="item.FGUID" :value="item.FGUID" :label="item.FSimpleName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="行政架构" prop="FAreaCode" :rules="[{ required: true, message: '请选择'}]">
                        <el-select v-model="addData.FAreaCode">
                            <el-option v-for="item in cityList" :key="item.FGUID" :value="item.FAreaCode" :label="item.FAreaName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="建筑业态" prop="FBuildTypeID" :rules="[{ required: true, message: '请选择'}]">
                        <el-select v-model="addData.FBuildTypeID">
                            <el-option :value="31" label="商住"></el-option>
                            <el-option :value="32" label="商业"></el-option>
                            <el-option :value="33" label="住宅"></el-option>
                            <el-option :value="34" label="酒店会所"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="建筑面积" prop="FBuildArea" :rules="[{ required: true, message: '请输入'}]">
                        <el-input class="unit" type="number" v-model="addData.BuildArea" autocomplete="off">
                           <span slot="suffix">m²</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="项目经理" prop="FContact">
                        <el-input v-model="addData.FContact"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话"  prop="FPhone" :rules="FTelephoneRule">
                        <el-input  v-model="addData.FPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="FAddress" :rules="[{ required: true, message: '请输入'}]">
                        <el-input class="block"  v-model="addData.FAddress"></el-input>
                    </el-form-item>
                    <el-form-item  label="项目描述" prop="FDescription">
                        <el-input class="block" type="textarea" v-model="addData.FDescription"></el-input>
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
                          action="/api/uploadFiles"
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
        const phoneNumbre = (rule, value, callback) => {
            var isPhone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;//手机号码
            var isMob= /^([0-9]{3,4}-)?[0-9]{7,8}$/;// 座机格式
            if(isMob.test(value)||isPhone.test(value)){
                callback();
            }
            else{
               callback(new Error('请输入正确的电话号码'));
            }
        }
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
                    label: '项目简称',
                },
                {
                    prop:'FGroupName',
                    label:'所属集团'
                },
                {
                    prop: 'FAreaName',
                    label: '行政架构',
                    /* formatter:row => row.FAreaInfo.FAreaName||'' */
                },
                {
                    prop: 'FAddress',
                    label: '详细地址',
                },
                {
                    prop: 'FSystemParamName',
                    label: '建筑业态',
                },
                {
                    prop: 'FBuildArea',
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
                FAddress:'',
                FBuildArea:'',   
                FBuildTypeID:'',     
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
            token:sessionStorage.getItem('FToken'),
            cityList:[],
            FTelephoneRule:[{required: true, validator: phoneNumbre}], //联系方式规则
            blockList:[],
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
        this.queryTORGGroupList()
        this.queryTOPEAreaByFAreaLevel()
        /* this.provinces = provinceList */
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
        /**
         * 组织架构—查询集团列表
         */
        queryTORGGroupList(){
            this.$post('QueryTORGGroupList')
            .then((result) => {
                this.blockList = result.FObject || []
            }).catch((err) => {
                
            });
        },
        /**
         * 408.查询城市
         */
        queryTOPEAreaByFAreaLevel(){
            this.$post('QueryTOPEAreaByFAreaLevel',{
                FAreaLevel:3,
            })
            .then((result) => {
                this.cityList = result.FObject || []
            }).catch((err) => {
                
            });
        },
        /**
         * 上传项目宣传图片
         */
        handleSuccess1(res,file){
            res.FObject&&this.fileList.push(res.FObject)
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
            await new Promise((resolve,reject) => {
                myGeo.getPoint(address,point => {
                    try{
                        this.addData.FProjectlng = point.lng||this.addData.FProjectlng
                        this.addData.FProjectlat = point.lat||this.addData.FProjectlat
                        resolve()
                    }catch(err){
                        reject()
                    } 
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