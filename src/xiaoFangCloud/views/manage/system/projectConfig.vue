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
              :beforeSubmit="beforeSubmit" 
              :submitFun="addOrUpdate"
            >
                <el-form slot="dialog" :model="addData"  inline ref="form" class="add-block">
                    <el-form-item label="项目全称" prop='ProjectName' :rules="[{ required: true, message: '请输入'}]">
                      <el-input v-model="addData.ProjectName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="项目简称" prop='ShortName'>
                        <el-input v-model="addData.ShortName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="所属集团" prop="BlocID" :rules="[{ required: true, message: '请选择'}]">
                        <el-select v-model="addData.BlocID" >
                            <el-option v-for="item in blockList" :key="item.BlocID" :value="item.BlocID" :label="item.ShortName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="项目经理" prop='PropertyLeader'>
                        <el-input v-model="addData.PropertyLeader" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop='PropertyPhone' :rules="FTelephoneRule"> 
                        <el-input v-model="addData.PropertyPhone" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="建筑面积" prop='BuildArea'>
                      <el-input class="unit" type="number" v-model="addData.BuildArea" autocomplete="off">
                         <span slot="suffix">m²</span>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="建筑类型">
                        <el-select v-model="addData.BuildTypeName">
                            <el-option value="综合" label="综合"></el-option>
                            <el-option value="物业" label="物业"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属平台" :rules="[{ required: true, message: '请选择'}]">
                        <el-select v-model="selectFrom" multiple collapse-tags>
                            <el-option value="1" label="数字消防"></el-option>
                            <el-option value="2" label="数字电梯"></el-option>
                            <el-option value="3" label="数字充电桩"></el-option>
                            <el-option value="4" label="数字有限空间"></el-option>
                        </el-select>
                    </el-form-item>
<!--                     <el-form-item label="系统类型" prop="SystemType" :rules="[{ required: true, message: '请选择'}]"> 
                        <el-select v-model="addData.SystemType">
                            <el-option v-for="item in systemTypeList" :key="item.ParamID" :value="item.ParamID" :label="item.Value"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="第三方ID" prop='OtherSourceID'>
                        <el-input v-model="addData.OtherSourceID"  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="选择区域" prop='Province' :rules="[{ required: true, message: '请选择'}]">
                        <el-select v-model="province" value-key="p" filterable style="width:160px;" @change="city = {}">
                            <el-option v-for="(item,i) in provins" :key="i" :value="item" :label="item.p">
                            </el-option>
                        </el-select>
                        <el-select v-model="city" value-key="n" filterable style="width:160px;margin-left:17px">
                            <el-option v-for="(item,i) in province.c||[]" :key="i" :value="item" :label="item.n">
                            </el-option>
                        </el-select>
                        <el-select v-model="area" value-key="s" filterable style="width:160px;margin-left:17px">
                            <el-option v-for="(item,i) in city.a||[]" :key="i" :value="item" :label="item.s">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="地址" prop='Address'>
                        <el-input v-model="addData.Address" class="block"></el-input>
                    </el-form-item>
                    <el-form-item label="项目描述" prop='FDescribe'>
                        <el-input v-model="addData.FDescribe" class="block"></el-input>
                    </el-form-item>
                    <el-form-item label="项目宣传图">
                        <div class="thumb-img" v-if="fileList[0]">
                            <div class="delete">
                                <i class="el-icon-delete" @click="fileList = [] "></i>
                            </div>
                            <img :src="url.replace(/\/DigitalAPI/,'')+fileList[0]" alt="">
                        </div>
                        <el-upload
                          v-else
                          :action="url+'FileUploadContext'"
                          list-type="picture-card"
                          :limit = '1'
                          :show-file-list="false"
                          :on-success="handleSuccess1"
                          :data="{FTokenID:token,FAction:'UpLoadFile',ProjectID:1,FType:''}"
                         >
                            <p><i class="el-icon-plus"></i><br><span>上传(160*60)</span></p>
                        </el-upload>                
                    </el-form-item>
                </el-form>
            </Table>
    </div>
</template>
<script>
import Table from '../layout/table.vue'
import {Project,System} from '@/xiaoFangCloud/request/api.js';
import citys from './city.json'
import axios from 'axios';
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
                    prop: 'ProjectName',
                    label: '项目全称',
                },
                {
                    prop: 'ShortName',
                    label: '项目简称',
                },
                {
                    prop:'BlocName',
                    label:'所属集团'
                },
                {
                    prop: 'Address',
                    label: '详细地址',
                },
                {
                    prop: 'BuildTypeName',
                    label: '建筑业态',
                },
                {
                    prop: 'BuildArea',
                    label: '建筑面积',
                },
                {
                    prop: 'PropertyLeader',
                    label: '项目负责人',
                },
                {
                    prop: 'PropertyPhone',
                    label: '联系方式',
                },
            ],
            defaultAddData:{ //新增默认数据
            },
            selectFrom:[],
            provinces:[],
            addData:{
                ProjectID:'',
                ProjectName:'',
                ShortName:'',
                BlocID:null,
                Address:'',
                BuildArea:'',
                BuildTypeName:null,
                OtherSourceID:0,
                SystemType:0,
                OnlineDateTime:null,
                Province:'',
                City:'',
                County:'',
                Flng:'',
                Flat:'',
                FState:1,
                FDescribe:'',
                PropertyName:'',
                PropertyLeader:'',
                PropertyPhone:'',
            },
            fileList:[],
            token:sessionStorage.getItem('FToken'),
            systemTypeList:[],
            blockList:[],
            cityList:[],
            FTelephoneRule:[{required: true, validator: phoneNumbre}], //联系方式规则
            provins:[],
            province:{},
            city:{},
            area:{},
            url:""
        }
    },
    components:{
        Table
    },
    computed:{
    },
    watch:{

    },
    created(){
        this.provins = citys
        this.defaultAddData = JSON.parse(JSON.stringify(this.addData))
        this.queryTORGGroupList()
        this.url = axios.defaults.baseURL
        /* this.getSystemParam() */
        /* this.provinces = provinceList */
    },
    methods:{
        /**
         * 查询项目信息
         */
        queryData(data){
            let param = {
              FAction:'QueryPageUProject',
              ...data
            }
            return Project(param,true)
        },
        /**
         * —查询集团列表
         */
        queryTORGGroupList(){
           System({
               FAction:'QueryPageUBloc',
               ...param
           })
            .then((result) => {
                this.blockList = result.FObject.Data || []
            }).catch((err) => {
                
            });
        },
        /**
         * 获取系统分类
         */
/*         getSystemParam(){
            System({
                FAction:'GetSystemParam',
                FName:'系统分类'
            })
            .then((result) => {
                this.systemTypeList = result.FObject || []
            }).catch((err) => {
                
            });
        }, */
        /**
         * 上传项目宣传图片
         */
        handleSuccess1(res,file){
            if(res){
                this.fileList.push(res.FObject.FilePath)
            }
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.addData = Object.assign({},this.defaultAddData)
            this.selectFrom = []
            this.province = {}
            this.city = {}
            this.area = {}
        },
        /**
         * 编辑
         */
        editItem(row){
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = row[key]
            })
            this.addData.SystemType = Number(this.addData.SystemType)
            this.selectFrom = row.FormID?row.FormID.split(','):[]
            this.province = this.provins.find(item => item.p == row.Province) || {}
            this.city = this.province.c&&this.province.c.find(item => item.n == row.City||item.n+'市' == row.City) || {}
            this.area = this.city.a&&this.city.a.find(item => item.s == row.County||item.s.slice(0,2) == row.County.slice(0,2)) || {}
        },
        beforeSubmit(){
            let {addData,fileList,province,city,area} = this
            addData.FPublicityPhoto = fileList[0]||''
            addData.Province = province.p||''
            addData.City = city.n||''
            addData.County = area.s||''
        },
        /**
         * 新增或修改项目
         */
        async addOrUpdate(){
            let {addData} = this
            let myGeo = new BMap.Geocoder()
            let address = addData.Province + addData.City + addData.County + addData.Address
            await new Promise((resolve,reject) => {
                myGeo.getPoint(address,point => {
                    try{
                        addData.Flng = point.lng||addData.Flng
                        addData.Flat = point.lat||addData.Flat
                        resolve()
                    }catch(err){
                        reject()
                    } 
                })
            })
            return Project({
                FAction:'AddOrUpdateUProject',
                IDStr:this.selectFrom.join(','),
                uProject:addData
            })
           
        },
        /**
         * 删除项目
         */
        deleteItem(row){
            return Project({FAction:'DeleteUProject',ProjectID:row.ProjectID})
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