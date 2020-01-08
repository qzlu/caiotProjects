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
            <el-form slot="dialog" :model="addData" inline ref="form" class="add-block">
                <el-form-item label="集团全称" prop="BlocName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.BlocName"></el-input>
                </el-form-item>
                <el-form-item label="集团简称" prop="ShortName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.ShortName"></el-input>
                </el-form-item>
                <el-form-item label="平台名称" prop="PlatformName">
                    <el-input v-model="addData.PlatformName"></el-input>
                </el-form-item>
                <el-form-item  label="选择区域">
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
                <el-form-item  label="详细地址" prop="Address" :rules="[{ required: true, message: '请输入'}]">
                    <el-input class="block" v-model="addData.Address"></el-input>
                </el-form-item>
                <el-form-item  label="集团描述" prop="Describe">
                    <el-input class="block" v-model="addData.Describe"></el-input>
                </el-form-item>
                <el-form-item label="集团LOGO">
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
import {System} from '@/xiaoFangCloud/request/api.js';
import citys from './city.json'
import axios from 'axios';
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop:'BlocName',
                    label:'集团全称'
                },
                {
                    prop: 'ShortName',
                    label: '集团简称',
                },
                {
                    prop: 'PlatformName',
                    label: '平台名称',
                },
                {
                    prop: 'Address',
                    label: '地址',
                }
            ],
            defaultAddData:null, //新增默认数据
            addData:{ //新增或修改项目参数
                BlocID:'',
                BlocName:null,
                ShortName:null,
                IndustryID:null,
                FLogo:null,
                PlatformName:'数字应急',
                Describe:'',
                Address:''
            },
            token:sessionStorage.getItem('FToken'),
            fileList:[],
            provins:[],
            province:{},
            city:{},
            area:{},
            url:''
        }
    },
    components:{
        Table
    },
    created(){
        this.url = axios.defaults.baseURL
        this.provins = citys
        this.defaultAddData = Object.assign({},this.addData)
    },
    methods:{
        /**
         * 查询数据
         * @param {Vue Component} data 传入参数
         */
        queryData(data){
            let param = {
                FAction:'QueryPageUBloc',
                ...data
            }
            return System(param,true)
        },
        /**
         * 点击新增
         */
        beforeAdd(){
           this.addData = Object.assign({},this.defaultAddData)
           this.fileList = []
           this.province = {}
           this.city = {}
           this.area = {}

        },
        /**
         * 编辑
         */
        editItem(row){
            this.fileList = []
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = row[key] || ''
            })
           this.province = {}
           this.city = {}
           this.area = {}
           row.FLogo&&this.fileList.push(row.FLogo)
        },
        /**
         * 上传集团LOGO图片
         */
        handleSuccess1(res,file){
            if(res){
                this.fileList.push(res.FObject.FilePath)
                console.log(this.fileList)
            }
        },
        /**
         * 新增或编辑
         */
        async addOrUpdate(){
/*             let myGeo = new BMap.Geocoder()
            let address = this.addData.FAddress
            this.addData.FGroupLogo = this.fileList[0]
            await new Promise((resolve) => {
                myGeo.getPoint(address,point => {
                    this.addData.FGrouplng = point.lng||this.addData.FGrouplng
                    this.addData.FGrouplat = point.lat||this.addData.FGrouplat
                    resolve()
                })
            }) */
            this.addData.Address = (this.province.p||'') + (this.city.n||'') + (this.area.s||'') + this.addData.Address
            this.addData.FLogo = this.fileList[0]||''
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  }
                }) 
            });
            System({
                FAction:'AddUpdateBloc',
                uBloc:this.addData
            },true)
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
            return System({FAction:'DeleteUBloc',ID:item.BlocID})
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
            }
        }
    }
}
</style>