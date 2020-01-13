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
                <el-form-item label="监管单位" prop="Name" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.Name"></el-input>
                </el-form-item>
                <el-form-item  label="安全负责人">
                    <el-select multiple collapse-tags v-model="checkedUsers">
                        <el-option v-for="item in userList" :key="item.FGUID" :value="item.FGUID" :label="item.FContacts"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="选择区域" prop="Province" :rules="[{ required: true, message: '选择'}]">
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
                <el-form-item  label="详细地址" prop="Address" >
                    <el-input class="block" v-model="addData.Address"></el-input>
                </el-form-item>
                <el-form-item  label="平台名称" prop="PlatformName">
                    <el-input class="block" v-model="addData.PlatformName"></el-input>
                </el-form-item>
                <el-form-item  label="单位描述" prop="FDescribe">
                    <el-input class="block" v-model="addData.FDescribe"></el-input>
                </el-form-item>
                <el-form-item label="集团LOGO">
                    <div class="thumb-img" v-if="addData.FLogo">
                        <div class="delete">
                            <i class="el-icon-delete" @click="addData.FLogo = '' "></i>
                        </div>
                        <img :src="url.replace(/DigitalAPI/,'')+addData.FLogo" alt="">
                    </div>
                    <el-upload
                      v-else
                      :action="url+'/FileUploadContext'"
                      list-type="picture-card"
                      :limit = '1'
                      :show-file-list="false"
                      :on-success="handleSuccess"
                      :data="{FTokenID:token,FAction:'UpLoadFile',ProjectID:1,FType:''}"
                     >
                        <p><i class="el-icon-plus"></i><br><span>上传(160*60)</span></p>
                    </el-upload>                
                </el-form-item>
            </el-form>
            <el-table-column label="管辖范围" prop=''>
                <template v-slot={row}>
                    <div>
                        <el-button round @click="queryURegulatoryForm(row)">配置</el-button>
                    </div>
                </template>
            </el-table-column>
        </Table>
        <el-dialog title="管辖范围配置" append-to-body :visible.sync="show" width="750px" class="zw-dialog regulatory">
            <div class="config-box">
                <div class="form-list">
                    <h5><el-checkbox :indeterminate="isIndeterminate" v-model="checkAllForm" @change="handleCheckAllForm"></el-checkbox>应急系统</h5>
                    <div class="content">
                        <el-scrollbar>
                            <el-checkbox-group v-model="checkedForm" @change="handleCheckedForm">
                                <ul>
                                    <li :class="{active:activeItem.ID == item.ID}" v-for="item in formList" :key="item.ID" @click="queryURegulatoryProject(item)">
                                        <el-checkbox :label="item.ID">{{''}}</el-checkbox>
                                        <span class="form-name">{{item.FormName}}</span>
                                        <el-radio v-model="item.RegulatoryType" :label="1">直管</el-radio>
                                        <el-radio v-model="item.RegulatoryType" :label="2">监管</el-radio>
                                        <i class="el-icon-arrow-right"></i>
                                    </li>
                                </ul>
                            </el-checkbox-group>
                        </el-scrollbar>
                    </div>
                </div>
                <div class="projects">
                    <h5><el-checkbox :indeterminate="isIndeterminate1" v-model="checkAllProject" @change="handleCheckAllProjectChange"></el-checkbox>应急项目</h5>
                    <div class="content">
                        <el-scrollbar>
                            <el-checkbox-group v-if="activeItem&&activeItem.projectList" v-model="activeItem.checkedProject" @change="handleCheckedProject">
                                <el-checkbox v-for="item in activeItem.projectList" :label="item.ProjectID" :key="item.ProjectID">{{item.ProjectName}}</el-checkbox>
                            </el-checkbox-group>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <el-button @click="show = false ">取消</el-button>
                <el-button @click="updateURegulatoryForm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Table from '../layout/table.vue'
import {System} from '@/xiaoFangCloud/request/api.js';
import citys from './city.json'
import axios from 'axios'
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop:'Name',
                    label:'监管单位名称'
                },
                {
                    prop: '',
                    label: '详细地址',
                    formatter:row => row.Province + row.City + row.County +row.Address
                },
                {
                    prop: 'UsersName',
                    label: '安全负责人',
                },
                {
                    prop: 'PlatformName',
                    label:'平台名称'
                }
            ],
            defaultAddData:{
                ID:'',
                Name:null,
                Province:null,
                City:null,
                County:null,
                Address:'',
                FDescribe:'',
                PlatformName:'数字应急云平台',
                FLogo:''
            }, //新增默认数据
            addData:{ //新增或修改项目参数

            },
            provins:[],
            province:{},
            city:{},
            area:{},
            userList:[],
            checkedUsers:[],
            show:false,
            formList:[],
            projectList:[],
            activeItem:{
            },
            checkAllForm:false,
            isIndeterminate:false,
            checkAllProject:false, //是否全选所有项目
            isIndeterminate1:false,
            activeRow:null,
            checkedForm:[],
            token:sessionStorage.getItem('FToken'),
            url:axios.defaults.baseURL
        }
    },
    components:{
        Table
    },
    created(){
        this.provins = citys
        this.queryURegulatoryUser()
    },
    methods:{
        /**
         * 查询数据
         * @param {Vue Component} data 传入参数
         */
        queryData(data){
            let param = {
                FAction:'QueryPageURegulatory',
                ...data
            }
            return System(param,true)
        },
        /**
         * 533.标准配置-查询安全负责人员列表
         */
        queryURegulatoryUser(){
            System({
                FAction:'QueryURegulatoryUser',
                ID:0
            })
            .then((result) => {
                this.userList = result.FObject || []
            }).catch((err) => {
                
            });
        },
        /**
         * 536.标准配置-查询应急系统
         */
        queryURegulatoryForm(row){
            this.activeRow = row
            System({
                FAction:'QueryURegulatoryForm',
                ID:row.ID
            })
            .then((result) => {
                this.show = true
                this.formList = result.FObject.map(item => {
                    return {
                        ...item,
                        checkedProject:[]
                    }
                })
                this.checkedForm = this.formList.filter(item => item.RegulatoryFormID).map(item => item.ID)
                this.queryURegulatoryProject(this.formList[0]||{})
            }).catch((err) => {
                console.log(err)
            });
        },
        /**
         * 537.标准配置-查询应急项目
         */
        queryURegulatoryProject(item){
            this.activeItem = item
            if(this.activeItem.projectList) return
            System({
                FAction:'QueryURegulatoryProject',
                RegulatoryFormID:item.RegulatoryFormID,
                FormID:item.ID
            })
            .then((result) => {
                let data = result.FObject
                this.$set(this.activeItem,'projectList',data)
                let checked = data.filter(item => item.IsExists).map(item => item.ProjectID)
                this.activeItem.checkedProject.push(...checked)
            }).catch((err) => {
                
            });
        },
        handleCheckAllForm(val){
            let allForm = this.formList.map(item => item.ID)
            this.checkedForm = val ? allForm : [];
            this.isIndeterminate = false;
        },
        handleCheckedForm(value){
            let checkedCount = value.length;
            this.checkAllForm = checkedCount === this.formList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.formList.length;
        },
        handleCheckAllProjectChange(val){
            if(!this.activeItem.projectList) return
            let allProject = this.activeItem.projectList.map(item => item.ProjectID)
            this.activeItem.checkedProject = val ? allProject : [];
            this.isIndeterminate1 = false;
        },
        handleCheckedProject(value){
            let checkedCount = value.length;
            if(!this.activeItem.projectList) return
            this.checkAllProject = checkedCount === this.activeItem.projectList.length;
            this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.activeItem.projectList.length;
        },
        /**
         * 534.标准配置-更新监管监管范围
         */
        updateURegulatoryForm(){
            let data = this.formList.filter(item => this.checkedForm.includes(item.ID)).map(item => {
                return {
                    FormID:item.ID,
                    RegulatoryType:item.RegulatoryType,
                    ProjectIDStr:item.checkedProject.join(',')
                }
            })
            System({
                FAction:'UpdateURegulatoryForm',
                ID:this.activeRow.ID,
                regulatoryFormProjects:data
            })
            .then((result) => {
                this.show = false
                this.$message({
                    message:'操作成功',
                    type:'success',
                    duration:'500'
                })
            }).catch((err) => {
                this.$message({
                    message:'操作失败',
                    type:'error',
                    duration:'500'
                })
            });

        },
        handleSuccess(res){
            if(res){
                this.addData.FLogo = res.FObject.FilePath
            }
        },
        /**
         * 点击新增
         */
        beforeAdd(){
           this.addData = {...this.defaultAddData}
           this.province = {}
           this.city = {}
           this.area = {}

        },
        /**
         * 编辑
         */
        editItem(row){
            this.beforeAdd()
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = row[key] || ''
            })
            this.checkedUsers=row.UsersGUID?row.UsersGUID.split(','):[]
            this.province = this.provins.find(item => item.p == row.Province) || {}
            this.city = this.province.c&&this.province.c.find(item => item.n == row.City||item.n+'市' == row.City) || {}
            this.area = this.city.a&&this.city.a.find(item => item.s == row.County||item.s.slice(0,2) == row.County.slice(0,2)) || {}
        },
        beforeSubmit(){
            let {addData,province,city,area} = this
            addData.Province = province.p||''
            addData.City = city.n||''
            addData.County = area.s||''
        },
        /**
         * 新增或编辑
         */
        async addOrUpdate(){
            return System({
                FAction:'AddUpdateURegulatory',
                UserGUIDStr:this.checkedUsers.join(','),
                uRegulatory:this.addData
            },true)
        },
        /**
         * 删除
         */
        deleteItem(item){
            return System({FAction:'DeleteURegulatory',ID:item.ID})
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
.regulatory{
    .el-dialog{
        .config-box{
            width: 100%;
            display: flex;
            color: #2a91fc;
            justify-content: space-between;
            h5{
                height: 40px;
                line-height: 40px;
                padding-left: 10px;
                font-size: 18px;
                font-weight: normal;
                background:linear-gradient(90deg, #105389, #092f52, #092f52, #05203c);
                .el-checkbox{
                    margin-right: 6px;
                }
            }
            .form-list,.projects{
                border-radius: 4px;
                overflow: hidden;
                .content{
                    height: 200px;
                    padding: 20px 0;
                    background: #092f52;
                    overflow: hidden;
                    .el-checkbox{
                        margin-right: 0px
                    }
                    ul{
                        >li{
                            padding-left: 20px;
                            line-height: 36px;
                            font-size: 16px;
                            cursor: pointer;
                            .form-name{
                                display: inline-block;
                                width: 120px;
                            }
                            .el-radio__label{
                                color: white
                            }
                        }
                        >li:hover,>li.active{
                            background: linear-gradient(90deg, rgba(42, 145, 252, 0.5), rgba(33, 111, 193, 0.5), rgba(5, 30, 63, 0.5));
                        }
                    }
                    .el-checkbox-group{
                        >.el-checkbox{
                            display: block;
                            padding-left: 20px;
                            line-height: 36px;
                            font-size: 16px;
                            color: #2a91fc;
                        }
                    }
                }

            }
            .form-list{
                width: 350px;
                
            }
            .projects{
                width: 300px;
            }
        }
    }
}
</style>