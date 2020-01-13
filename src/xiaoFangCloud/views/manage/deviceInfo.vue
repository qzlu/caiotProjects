<template>
    <div class="report">
        <Table
          ref="table"
          dialogWidth="1100px"
          :tableLabel="tableLabel"
          :getData="queryData"
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow = 'deleteItem' 
          :exportData="exportFile"
          :submitFun="addOrUpdate"
        >
            <el-form slot="dialog" class="add-device" inline :model='deviceInfo' ref="form">
                <el-form-item label="项目名称">
                    <el-input readonly :value="projectName"></el-input>
                </el-form-item>
                <el-form-item label="设备编码" prop="DeviceCode" :rules="[{ required: true, message: '请输入'}]"><el-input v-model="deviceInfo.DeviceCode"></el-input></el-form-item>
                <el-form-item label="设备名称" prop="DeviceLedgerName" :rules="[{ required: true, message: '请输入'}]"><el-input v-model="deviceInfo.DeviceLedgerName"></el-input></el-form-item>
                <el-form-item label="系统类型" prop="FormID" :rules="[{ required: true, message: '请选择'}]">
                    <el-select v-model="deviceInfo.FormID">
                        <el-option v-for="(item,index) in formList" :key="index" :value="item.ID" :label="item.FormName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备类型" prop="DeviceTypeID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="deviceInfo.DeviceTypeID"   placeholder="请选择">
                    <el-option v-for="device in allDevice" :key="device.DeviceTypeID" :label="device.DeviceTypeName" :value="device.DeviceTypeID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="区域名称" prop="AreaID" >
                    <el-select v-model="deviceInfo.AreaID"  value-key="AreaID" filterable  placeholder="请选择" >
                      <el-option v-for="list in areaList" :key="list.AreaID" :label="list.AreaName" :value="list.AreaID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生产厂家" prop="Manufacturer"><el-input v-model="deviceInfo.Manufacturer"></el-input></el-form-item>
                <el-form-item label="规格型号" prop="SpecificationsCode"><el-input v-model="deviceInfo.SpecificationsCode"></el-input></el-form-item>
                <el-form-item label="使用年限" prop="ServiceLife"><el-input v-model="deviceInfo.ServiceLife" type="number"></el-input></el-form-item>
                <el-form-item label="出厂日期" prop="ManufacturingTime">
                    <el-date-picker
                        type="date"
                        v-model="deviceInfo.ManufacturingTime"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="启用日期" prop="OperatingDateTime">
                    <el-date-picker
                        type="date"
                        v-model="deviceInfo.OperatingDateTime"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="设备参数" class="param">
                    <el-input type="textarea" v-model="deviceInfo.DeviceLedgerParam"></el-input>
                </el-form-item>
                <el-form-item label="配套设备参数" class="param">
                    <el-input type="textarea" v-model="deviceInfo.AcsDeviceLedgerParam"></el-input>
                </el-form-item>
                <el-form-item label="设备图片">
                    <el-upload
                      :action="url+'FileUploadContext'"
                      list-type="picture-card"
                      :limit = '1'
                      :on-success="handleSuccess1"
                      :data="{FAction:'UpLoadFile',FVersion:'1.0.0',FTokenID:token,ProjectID:projectId,FName:''}"
                     >
                        <p><i class="el-icon-plus"></i><br><span>上传</span></p>
                    </el-upload>                
                </el-form-item>
                <el-form-item label="设备二维码" v-if="deviceInfo.DeviceLedgerQrCode">
                    <img :src="url1+deviceInfo.DeviceLedgerQrCode" style="width:165px;height:128px" alt="">
                </el-form-item>
            </el-form>
            <li slot="operation" class="l">
                <el-dropdown>
                    <el-button><i class="el-icon-document"></i>导入</el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <a href="http://www.caszyj.com/CreateFile/1/设备台账.xls">导出模板</a>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-upload
                                :action="url+'FileUploadContext'"
                                :on-success="handleSuccess"
                                :data="{FAction:'ImportUDeviceLedge',FVersion:'1.0.0',FTokenID:token,ProjectID:projectId}"
                            >
                                选择文件
                            </el-upload>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </li>
            <template v-slot:row-operation={row}>
                <span class="pointer" @click="detail(row)">查看详情</span>
            </template>
        </Table>
        <el-dialog class="zw-dialog" title="查看详情" append-to-body width="800px" :visible.sync="show1">
            <ul class="device-detail">
                <li v-for="(item,i) in deviceLabel" :key="i">
                    <span class="label">{{item.label}}:</span>
                    <span class="project-item" v-if="item.formatter">{{item.formatter(deviceDetail)}}</span>
                    <span class="project-item" v-else>{{deviceDetail[item.prop]}}</span>
                </li>
                <li style="height:200px;line-height:200px;">
                    <span class="label">设备图片:</span>
                    <span class="project-item">
                        <img  :src="url1+deviceDetail.DeviceLedgerPhoto" alt="">
                    </span>
                </li>
                <li style="height:200px;line-height:200px;">
                    <span class="label">设备二维码:</span>
                    <span class="project-item">
                        <img :src="url1+deviceDetail.DeviceLedgerQrCode" alt="">
                    </span>
                </li>
            </ul>
        </el-dialog>
    </div>
</template>
<script>
import {Device,System,Project} from '@/xiaoFangCloud/request/api.js'
import Table from './layout/table.vue'
import axios from 'axios';
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop:'BlocName',
                    label:'集团名称'
                },
                {
                    prop: 'ProjectName',
                    label: '项目名称',
                },
                {
                    prop: 'DeviceCode',
                    label: '设备编码',
                    width:120
                },
                {
                    prop: 'DeviceLedgerName',
                    label: '设备名称',
                    width:180
                },
                {
                    prop: 'FormName',
                    label: '系统类型',
                    width:100
                },
                {
                    prop: 'DeviceTypeName',
                    label: '设备类型',
                    width:100
                },
                {
                    prop: 'AreaName',
                    label: '区域名称'
                },
                {
                    prop: 'IsIOTDevice',
                    label: '是否物联设备',
                    formatter: row => row.IsIOTDevice?'是':'否',
                    width:130
                },
                {
                    prop: 'Online',
                    label: '设备状态',
                    formatter: row => row.Online?'在线':'离线',
                    width:100
                }
            ],
            deviceLabel:[
                {
                    prop: 'DeviceLedgerName',
                    label: '设备名称'
                },
                {
                    prop: 'DeviceCode',
                    label: '设备编码'
                },
                {
                    prop: 'SpecificationsCode',
                    label: '规格型号'
                },
                {
                    prop: 'DeviceTypeName',
                    label: '设备类型'
                },
                {
                    prop: 'Manufacturer',
                    label: '生产厂家',
                },
                {
                    prop: 'SystemParamName',
                    label: '系统类型',
                },
                {
                    prop: 'ServiceLife',
                    label: '使用年限',
                },
                {
                    prop: 'AreaName',
                    label: '区域名称',
                },
                {
                    prop: 'ManufacturingTime',
                    label: '出厂日期',
                    formatter:(row, column, cellValue, index) => row.ManufacturingTime?row.ManufacturingTime.split(' ')[0]:'',
                },
                {
                    prop: 'OperatingDateTime',
                    label: '启用日期',
                    formatter:(row, column, cellValue, index) => row.ManufacturingTime?row.ManufacturingTime.split(' ')[0]:'',
                },
                {
                    prop: 'DeviceLedgerParam',
                    label: '相关参数'
                },
                {
                    prop: 'AcsDeviceLedgerParam',
                    label: '配置参数'
                }

            ],
            defaultDeviceInfo:{
                DeviceLedgerID:'',
                DeviceLedgerName:'',
                DeviceCode:'',
                SpecificationsCode:'',
                Manufacturer:'',
                ManufacturingTime:'',
                ManufacturingNumber:'',
                DeviceLedgerParam:'',
                ServiceLife:'',
                EditorDateTime:'',
                DeviceLedgerPhoto:'',
                DeviceLedgerQrCode:'',
                DeviceTypeID:'',
                AreaID:0,
                PurchaseDateTime:'',
                InstallationDateTime:'',
                AcceptanceDateTime:'',
                OperatingDateTime:'',
                SystemParamID:'',
                DeviceTypeName:'',
                AcsDeviceLedgerParam:'',
                IsIOTDevice:1,
                FormID:null
            },
            deviceInfo:{ //详情请看接口文档
                DeviceLedgerID:'',
                DeviceLedgerName:'',
                DeviceCode:'',
                SpecificationsCode:'',
                Manufacturer:'',
                ManufacturingTime:'',
                ManufacturingNumber:'',
                DeviceLedgerParam:'',
                ServiceLife:'',
                EditorDateTime:'',
                DeviceLedgerPhoto:'',
                DeviceLedgerQrCode:'',
                DeviceTypeID:'',
                AreaID:0,
                PurchaseDateTime:'',
                InstallationDateTime:'',
                AcceptanceDateTime:'',
                OperatingDateTime:'',
                SystemParamID:'',
                DeviceTypeName:'',
                AcsDeviceLedgerParam:'',
                IsIOTDevice:1,
                FormID:null
            },
            projectId:sessionStorage.getItem('projectId'),
            projectName:sessionStorage.getItem('projectName'),
            areaList:[],
            systemList:[],
            allDevice:[],
            fileList:[],
            type:0, //0新增 ，1编辑
            show1:false,
            deviceDetail:{}, //设备详情
            url:axios.defaults.baseURL,
            url1:axios.defaults.baseURL.replace(/DigitalAPI/,''),
        }
    },
    props:{
        id:Number
    },
    components:{
        Table
    },
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    computed:{
        token(){
            return this.$store.state.token
        },
        formList(){
            return this.$store.state.sysTemList
        }
    },
    created(){
        this.queryUArea()
        this.querySystemType()
        this.queryAllDeviceType()
    },
    mounted(){

    },
    methods:{
        /**
         * 233.查询分页设备台账
         */
        queryData(data){
           return Device({
                FAction:'QueryPageUDeviceLedger',
                ...data
            })
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.fileList = []
            this.deviceInfo = Object.assign({},this.defaultDeviceInfo)
        },
        /**
         * 新增或编辑设备台账
         */
        async addOrUpdate(){
            this.deviceInfo.DeviceLedgerQrCode = ''
            return Device({
                FAction:'AddOrUpdateUDeviceLedger',
                FormID:this.deviceInfo.FormID,
                uDeviceLedger:this.deviceInfo
            },true)
        },
        /**
         * 编辑设备台账
         */
        editItem(row){
            Object.keys(this.deviceInfo).forEach(key => {
                this.deviceInfo[key] = row[key] || ''
            })
            if(this.deviceInfo.ServiceLife == null){
                this.deviceInfo.ServiceLife = 0
            }

        },
        detail(row){
            this.deviceDetail = row
            this.show1 = true
        },
        /**
         * 62.获取区域类型
         */
        queryUArea(){
            Project({
                FAction:'QueryUAreaList'
            })
            .then(data => {
                this.areaList = data.FObject
            })
            .catch(err => {

            })
        },
        /**
         * 64.获取设备分类(系统类别)
         */
        querySystemType(){
            System({
                FAction:'GetSystemParam',
                FName:'系统分类'
            })
            .then(data => {
                this.systemList = data.FObject
            })
            .catch(err => {

            })
        },
        /**
         * 获取所有设备类型（241.获取设备类型）
         */
        queryAllDeviceType(){
            Device({
                FAction:'QuerySDeviceType',
            })
            .then(data => {
                this.allDevice = data.FObject
            })
            .catch(err => {})
        },
        /**
         * 302.导出设备台账
         */
        exportFile(){
            return Device({
                FAction:'ExportExcelUDeviceLedger',
                SearchKey:this.filterText
            })
        },
        /**
         * 导入excel
         */
        handleSuccess(res,file){
            if(res.Result == 200){
                this.queryData()
            }
        },
        /**
         * 上传设备图片
         */
        handleSuccess1(res,file){
            this.deviceInfo.DeviceLedgerPhoto = res.FObject.FilePath
        },
        /**
         * 上传资料
         */
        handleSuccess2(res,file){
            if(res.Result == 200){
                this.fileList.push(res.FObject)
            }
        },
        /**
         * 236.删除设备台账信息
         */
        async deleteItem(row){
            return Device({
                FAction:'DeleteUDeviceLedger',
                ID:row.DeviceLedgerID
            })
        },
        /**
         * 导出二维码
         */
        exportUDeviceLedgerQRCode(){
            Device({
                FAction:'ExportUDeviceLedgerQRCode'
            })
            .then(data => {
                window.location = "http://www.szqianren.com/" + data.FObject;
            })
            .catch(err => {

            })
        }
    }
}
</script>
<style lang="scss">
$img-url:'/static/image/';
.zw-dialog{
    .add-device{
 
        h5{
            margin-bottom: 20px;
            .icon-border{
                width:4px;
                height:12px;
                margin-right: 6px;
                vertical-align: middle;
                display: inline-block;
                background:rgba(44,146,252,1);
            }
            >div{
                display: inline-block
            }
        }
        .el-form{
            &-item{
                &__label{
                    width: 100px;
                    text-align: right;
                    font-size: 14px;
                    color: #F1F1F2
                }
                &__content{
                    width:220px;
                }
                .el-input{
                    width: 220px;
                }
                .el-date-editor.el-input, .el-date-editor.el-input__inner{
                    width:220px;
                }
                .el-input__inner,.el-textarea__inner{
                    height:39px;
                    background:rgba(24,64,107,1);
                    border:1px solid rgba(5,103,158,1);
                }
                .el-textarea__inner{
                    height: 60px;
                    color: #F1F1F2
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
    }
}
.zw-dialog .el-dialog__body{
    ul.device-detail{
        /* height: 455px; */
        background:rgba(14,49,83,1);
        border:1px solid rgba(101,168,224,1);
        /* border-radius:6px; */
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        li{
            width: 50%;
            /* height: 16.66%; */
            height: 50px;
            line-height: 50px;
            box-sizing: border-box;
            border-bottom: 2px solid #65A8E0;
            display: flex;
            overflow: hidden;
            span{
                display: inline-block;
                box-sizing: border-box;
                height: 100%;
            }
            .label{
                width: 172px;
                padding-right: 10px;
                text-align: right;
                background: #0D3F72;
            }
            .project-item{
                width: 426px;
                padding-left: 10px;
                text-align: left;
                img{
                    width: 150px;
                    height: 150px;
                    vertical-align: middle;
                }
            }
        }
        li:last-of-type,li:nth-last-of-type(2){
            border-bottom: none;
        }
    }
}

</style>

