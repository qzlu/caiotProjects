<template>
    <div class="report">
        <el-dialog :title="type?'编辑':'新增设备台账'"  class="zw-dialog add-device" :visible.sync='show' top="100">
            <el-scrollbar>
                <h5><span class="icon-border"></span>设备铭牌</h5>
                <el-form inline :model='deviceInfo' ref="form">
                    <el-form-item label="设备名称" prop="DeviceLedgerName" :rules="[{ required: true, message: '请输入'}]"><el-input v-model="deviceInfo.DeviceLedgerName"></el-input></el-form-item>
                    <el-form-item label="设备编码" prop="DeviceCode" :rules="[{ required: true, message: '请输入'}]"><el-input v-model="deviceInfo.DeviceCode"></el-input></el-form-item>
                    <el-form-item label="生产厂家" prop="Manufacturer"><el-input v-model="deviceInfo.Manufacturer"></el-input></el-form-item>
                    <el-form-item label="出厂型号" prop="SpecificationsCode"><el-input v-model="deviceInfo.SpecificationsCode"></el-input></el-form-item>
                    <el-form-item label="出厂编号" prop="ManufacturingNumber"><el-input v-model="deviceInfo.ManufacturingNumber"></el-input></el-form-item>
                    <el-form-item label="使用年限" prop="ServiceLife"><el-input v-model="deviceInfo.ServiceLife" type="number"></el-input></el-form-item>
                    <el-form-item label="出厂日期" prop="ManufacturingTime">
                        <el-date-picker
                            type="date"
                            v-model="deviceInfo.ManufacturingTime"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <br>
                    <el-form-item label="设备图片">
                        <el-upload
                          action="http://47.106.64.130:56090/Caiot/FileUploadContext"
                          list-type="picture-card"
                          :limit = '1'
                          :on-success="handleSuccess1"
                          :data="{FAction:'UpLoadFile',FVersion:'1.0.0',FTokenID:token,ProjectID:projectId,FName:''}"
                         >
                            <p><i class="el-icon-plus"></i><br><span>上传</span></p>
                        </el-upload>                
                    </el-form-item>
                    <el-form-item label="设备二维码" v-if="deviceInfo.DeviceLedgerQrCode">
                        <img :src="`http://szqianren.com/${deviceInfo.DeviceLedgerQrCode}`" style="width:165px;height:128px" alt="">
                    </el-form-item>
                </el-form>
                <h5><span class="icon-border"></span>使用登记</h5>
                <el-form inline :model="deviceInfo">
                    <el-form-item label="购买日期" prop="PurchaseDateTime">
                        <el-date-picker
                            type="date"
                            v-model="deviceInfo.PurchaseDateTime"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="安装日期" prop="InstallationDateTime">
                        <el-date-picker
                            type="date"
                            v-model="deviceInfo.InstallationDateTime"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="验收日期" prop="AcceptanceDateTime">
                        <el-date-picker
                            type="date"
                            v-model="deviceInfo.AcceptanceDateTime"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="投运日期" prop="OperatingDateTime">
                        <el-date-picker
                            type="date"
                            v-model="deviceInfo.OperatingDateTime"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="项目名称">
                        <el-input readonly v-model="projectName"></el-input>
                    </el-form-item>
                    <el-form-item label="设备类型" prop="DeviceTypeName" :rules="[{ required: true, message: '请选择'}]">
                      <el-select v-model="deviceInfo.DeviceTypeName"   placeholder="请选择">
                        <el-option v-for="device in allDevice" :key="device.DeviceTypeID" :label="device.DeviceTypeName" :value="device.DeviceTypeName"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="区域名称" :rules="[{ required: true, message: '请选择'}]">
                        <el-select v-model="deviceInfo.AreaName">
                            <el-option v-for="area in areaList" :key="area.AreaID" :value="area.AreaName" :label="area.AreaName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="系统类别" :rules="[{ required: true, message: '请选择'}]">
                        <el-select v-model="deviceInfo.SystemParamName">
                            <el-option v-for="system in systemList" :key="system.ParamValue" :value="system.ParamValue" :label="system.ParamValue">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备参数" class="param">
                        <el-input type="textarea" v-model="deviceInfo.DeviceLedgerParam"></el-input>
                    </el-form-item>
                    <el-form-item label="配套设备参数" class="param">
                        <el-input type="textarea" v-model="deviceInfo.AcsDeviceLedgerParam"></el-input>
                    </el-form-item>
                </el-form>
                <h5>
                    <span class="icon-border"></span>相关资料
                        <el-upload
                          action="http://47.106.64.130:56090/Caiot/FileUploadContext"
                          :on-success="handleSuccess2"
                          :show-file-list='false'
                          :data="{FAction:'UpLoadFile',FVersion:'1.0.0',FTokenID:token,ProjectID:projectId,FName:''}"
                         >
                            <button class="zw-btn zw-btn-add" style="margin-left:20px;">新增</button>
                        </el-upload>                
                </h5>
                <el-table
                   v-if="fileList.length>0"
                   :data="fileList"
                   style="width: 100%"
                   header-row-class-name="el-table-header"
                   :row-class-name="tableRowClassName"
                >
                    <el-table-column
                        type="index"
                        label="序号"
                        width="80"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="FileName"
                        label="资料名称"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="CreateDate"
                        label="上传时间"
                        align="center"
                    >
                    </el-table-column>
                   <el-table-column
                     align="center"
                     prop=""
                     label="操作">
                     <template slot-scope="scoped">
                         <div class="role-operation">
                            <span class="pointer" @click="fileList.splice(scoped.$index,1)">删除</span>
                         </div>
                     </template>
                   </el-table-column>
                </el-table>
                <div style="text-align:center;margin-top:20px"><button class="zw-btn" @click="addOrUpdated()">确定</button></div>
            </el-scrollbar>
        </el-dialog>
        <ul class="clearfix report-header">
            <li class="l"><button class="zw-btn zw-btn-add" @click="beforeAddDevice">新增</button></li>
            <li class="l">
                <el-dropdown>
                    <button class="zw-btn zw-btn-import">导入</button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <a href="http://47.106.64.130:56090/CreateFile/1/设备台账.xls">导出模板</a>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-upload
                                action="http://47.106.64.130:56090/Caiot/FileUploadContext"
                                :on-success="handleSuccess"
                                :data="{FAction:'ImportUDeviceLedge',FVersion:'1.0.0',FTokenID:token,ProjectID:projectId}"
                            >
                                选择文件
                            </el-upload>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </li>
            <li class="l"><button class="zw-btn zw-btn-export" @click="queryExportDeviceInfo">导出</button></li>
            <li class="l"><button class="zw-btn" style="width:120px;padding:0 10px" @click="exportUDeviceLedgerQRCode"><i class="iconfont icon-QRcode" style="color:#3593ed"></i>导出二维码</button></li>
            <li class="r">
                <el-input class="search-input" placeholder="搜索设备关键字" v-model="filterText">
                    <i class="el-icon-search" slot="suffix"></i>
                </el-input>
            </li>
        </ul>
        <div class="zw-table">
            <el-table
               :data="tableData"
               style="width: 100%"
               header-row-class-name="el-table-header"
               :row-class-name="tableRowClassName"
               >
               <el-table-column
                 v-for="item in tableLabel"
                 :key="item.prop"
                 :prop="item.prop"
                 :label="item.label"
                 :width="item.width"
                 :formatter="item.formatter"
                 show-overflow-tooltip
                >
               </el-table-column>
               <el-table-column label="操作" width="160">
                   <template slot-scope="scoped">
                       <div>
                           <!--  <router-link :to="`/DeviceManagement/DeviceInfo/${scoped.row.DeviceLedgerID}`"> -->
                                <span class="pointer" style="color:white" @click="$router.push(`/DeviceManagement/DeviceInfo/${scoped.row.DeviceLedgerID}`)">详情</span>
                           <!--  </router-link> -->
                            <span class="pointer" style="margin-left:16px;" @click="editDevice(scoped.row)">编辑</span>  
                            <span class="pointer" @click="deleteDeviceInfo(scoped.row)">删除</span>    
                       </div>
                   </template>
               </el-table-column>
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
    </div>
</template>
<script>
import {Device,FileUploadContext,system} from '@/caiot/request/api.js'
import table from '@/caiot/mixins/table' //表格混入数据
import {zwPagination} from '@/caiot/zw-components/index'
import axios from 'axios';
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowNum',
                    label: '序号',
                    width:80
                },
                {
                    prop: 'DeviceLedgerName',
                    label: '设备名称',
                    width:120

                },
                {
                    prop: 'DeviceCode',
                    label: '设备编码',
                    width:160
                },
                {
                    prop: 'Manufacturer',
                    label: '生产厂家',
                    width:120
                },
                {
                    prop: 'SpecificationsCode',
                    label: '出厂型号',
                    width:90
                },
                {
                    prop: 'ManufacturingNumber',
                    label: '出厂编号',
                    width:100
                },
                {
                    prop: 'ManufacturingTime',
                    label: '出厂日期',
                    width:'100',
                    formatter:(row, column, cellValue, index) => row.EditorDateTime?row.ManufacturingTime.split(' ')[0]:'',
                },
                {
                    prop: 'ServiceLife',
                    label: '使用年限',
                    width:90
                },
                {
                    prop: 'EditorDateTime',
                    label: '质保截止',
                    width:'100',
                    formatter:(row, column, cellValue, index) => row.EditorDateTime?row.EditorDateTime.split(' ')[0]:''
                },
                {
                    prop: 'EnergyTypeName',
                    label: '能源类型',
                    width:90
                },
                {
                    prop: 'IsIOTDevice',
                    label: '是否物联设备',
                    width:130,
                    formatter:(row, column, cellValue, index) => row.IsIOTDevice?'是':'否'
                },
                {
                    prop: 'IsControl',
                    label: '是否控制设备',
                    width:130,
                    /* formatter:row => row.IsControl?'是':'否' */
                }
            ],
            show:false,
            defaultDeviceInfo:{
                DeviceLedgerID:null,
                DeviceLedgerName:null,
                DeviceCode:null,
                SpecificationsCode:null,
                Manufacturer:null,
                ManufacturingTime:null,
                ManufacturingNumber:null,
                DeviceLedgerParam:null,
                ServiceLife:null,
                EditorDateTime:null,
                DeviceLedgerPhoto:null,
                DeviceLedgerQrCode:null,
                DeviceTypeID:null,
                AreaName:null,
                InfoNameStr:null,
                PurchaseDateTime:null,
                InstallationDateTime:null,
                AcceptanceDateTime:null,
                OperatingDateTime:null,
                SystemParamName:null,
                DeviceTypeName:null,
                AcsDeviceLedgerParam:null
            },
            deviceInfo:{ //详情请看接口文档
                DeviceLedgerID:null,
                DeviceLedgerName:null,
                DeviceCode:null,
                SpecificationsCode:null,
                Manufacturer:null,
                ManufacturingTime:null,
                ManufacturingNumber:null,
                DeviceLedgerParam:null,
                ServiceLife:null,
                EditorDateTime:null,
                DeviceLedgerPhoto:null,
                DeviceLedgerQrCode:null,
                DeviceTypeID:null,
                AreaName:null,
                InfoNameStr:null,
                PurchaseDateTime:null,
                InstallationDateTime:null,
                AcceptanceDateTime:null,
                OperatingDateTime:null,
                SystemParamName:null,
                DeviceTypeName:null,
                AcsDeviceLedgerParam:null
            },
            token:localStorage.getItem("Token"),
            projectId:localStorage.getItem('projectid'),
            projectName:localStorage.getItem('projectname'),
            areaList:[],
            systemList:[],
            allDevice:[],
            fileList:[],
            type:0 //0新增 ，1编辑
        }
    },
    components:{
        zwPagination
    },
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    computed:{

    },
    created(){
        this.queryData()
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
        queryData(){
            Device({
                FAction:'QueryPageUDeviceLedger',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then(data => {
                console.log(data);
                this.total = data.FObject.Table[0].FTotalCount
                this.tableData = data.FObject.Table1
                /**
                 * 删除操作时，当前页面无数据时跳到上一页
                 */
                if(this.tableData.length === 0&&this.pageIndex > 1){
                    --this.pageIndex
                    this.queryData()
                }
            })
            .catch(err => {})
        },
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryData()
        },
        /**
         * 点击新增
         */
        beforeAddDevice(){
            this.show = true
            this.type = 0
            this.fileList = []
            this.deviceInfo = Object.assign({},this.defaultDeviceInfo)
        },
        /**
         * 新增或编辑设备台账
         */
        async addOrUpdated(){
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  }
                });
            })
            this.deviceInfo.InfoNameStr = this.fileList.map(item => `${item.FileName}-${item.FilePath}`).join(',')
            this.show = false
            Device({
                FAction:this.type?'UpdateUDeviceLedge':'AddUDeviceLedge',
                mUDeviceLedge:this.deviceInfo
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {})
        },
        /**
         * 编辑设备台账
         */
        editDevice(row){
            this.show = true
            this.type = 1
            Object.keys(this.deviceInfo).forEach(key => {
                if(row[key]){
                    this.deviceInfo[key] = row[key]
                }
            })
            if(this.deviceInfo.ServiceLife == null){
                this.deviceInfo.ServiceLife = 0
            }
            if(row.LedgerFiles){
                this.fileList = row.LedgerFiles.split(',').map(item => {
                    let arr = item.split('!')
                    return {
                        FileName:arr[1],
                        FilePath:arr[2],
                        CreateDate:arr[3]
                    }
                })
            }else{
                this.fileList = []
            }

        },
        /**
         * 62.获取区域类型
         */
        queryUArea(){
            system({
                FAction:'QueryUArea'
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
            system({
                FAction:'SSystemParam'
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
            system({
                FAction:'QueryDeviceType',
            })
            .then(data => {
                this.allDevice = data.FObject
            })
            .catch(err => {})
        },
        /**
         * 302.导出设备台账
         */
        queryExportDeviceInfo(){
            Device({
                FAction:'QueryExportUDeviceLedger',
                SearchKey:this.filterText
            })
            .then(data => {
                window.location = "http://www.szqianren.com/" + data.FObject;
            })
            .catch(err => {})
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
        async deleteDeviceInfo(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除设备台账'])
                .then(() => {
                    resove()
                })
                .catch(error => {

                })
            })
            Device({
                FAction:'DeleteUDeviceLedger',
                IDStr:row.DeviceLedgerID
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {})
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
$img-url:'../../static/image/';
.zw-dialog.add-device{
    .el-dialog{
        width: 950px;
        max-height: 970px;
        background: url(#{$img-url}admin/btn3.png);
        background-size: 100% 100%;
        padding-left: 48px!important;
        .el-dialog__body{
            height: 800px;
            overflow: hidden;
            .el-scrollbar{
                height: 100%;
                .el-scrollbar__wrap{
                    overflow-x: hidden
                }
            }
        }
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
                    width:165px;
                }
                .el-date-editor.el-input, .el-date-editor.el-input__inner{
                    width:165px;
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
</style>

