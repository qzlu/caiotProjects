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
            <el-form slot="dialog" :model="addData" inline ref="form" class="add-block">
                <el-form-item label="集团全称" prop="BlocName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.BlocName"></el-input>
                </el-form-item>
                <el-form-item label="集团简称" prop="ShortName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.ShortName"></el-input>
                </el-form-item>
                <el-form-item label="平台名称" prop="PlatformName">
                    <el-input class="block" v-model="addData.PlatformName"></el-input>
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
                        <img :src="url.replace(/DigitalAPI/,'')+fileList[0]" alt="">
                    </div>
                    <el-upload
                      v-else
                      :action="url+'/FileUploadContext'"
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
            defaultAddData:{
                BlocID:'',
                BlocName:null,
                ShortName:null,
                IndustryID:null,
                FLogo:null,
                PlatformName:'数字应急云平台',
                Describe:'',
                Address:''
            }, //新增默认数据
            addData:{ //新增或修改项目参数

            },
            token:sessionStorage.getItem('FToken'),
            fileList:[],
            provins:[],
            province:{},
            city:{},
            area:{},
            url:axios.defaults.baseURL
        }
    },
    components:{
        Table
    },
    created(){
        this.provins = citys
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
           this.addData = {...this.defaultAddData}
           this.fileList = []
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
        beforeSubmit(){
            this.addData.Address = (this.province.p||'') + (this.city.n||'') + (this.area.s||'') + this.addData.Address
            this.addData.FLogo = this.fileList[0]||''
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
            return System({
                FAction:'AddUpdateBloc',
                uBloc:this.addData
            },true)
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
</style>