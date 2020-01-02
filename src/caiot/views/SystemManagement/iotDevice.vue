<template>
    <div class="report inspection-item">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="700px" class="zw-dialog">
            <el-form :model="addInfo" inline ref="form" label-width="100px">
<!--                 <el-form-item label="项目名称"  prop='ProjectID'  :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.ProjectID"  value-key="ProjectID" filterable  placeholder="请选择" @change="queryUAreaList">
                    <el-option v-for="list in projectList" :key="list.ProjectID" :label="list.ShortName" :value="list.ProjectID"></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="设备编码" prop="DeviceCode" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.DeviceCode">
                    </el-input>
                </el-form-item>
<!--                 <el-form-item label="设备ID" prop="DeviceID" :rules="[{ required: true, message: '请输入'}]">
                    <el-input  v-model="addInfo.DeviceID">
                    </el-input>
                </el-form-item> -->
                <el-form-item label="设备名称" prop="DeviceName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.DeviceName">
                    </el-input>
                </el-form-item>
                <el-form-item label="设备简称" prop="DeviceShortName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.DeviceShortName">
                    </el-input>
                </el-form-item>
                <el-form-item label="设备类型" prop="DeviceTypeID" :rules="[{ required: true, message: '请输入'}]">
                  <el-select v-model="addInfo.DeviceTypeID"   filterable  placeholder="请选择" >
                    <el-option v-for="list in deviceTypeList" :key="list.DeviceTypeID" :label="list.DeviceTypeName" :value="list.DeviceTypeID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="区域名称" prop="AreaID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.AreaID"   filterable  placeholder="请选择" >
                    <el-option v-for="list in areaList" :key="list.AreaID" :label="list.AreaName" :value="list.AreaID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否控制设备" prop="IsControl">
                    <el-select v-model="addInfo.IsControl">
                        <el-option  label="是" :value="true"></el-option>
                        <el-option  label="否" :value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="第三方ID" prop="OtherSourceID">
                    <el-input v-model="addInfo.OtherSourceID">
                    </el-input>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" v-submit="addOrUpdateUDevice">确定</button>
            </div>
        </el-dialog>    
        <ul class="report-header clearfix">
            <li class="l"><button class="zw-btn zw-btn-add" @click="beforeAdd">新增</button></li>
            <li class="l"><button class="zw-btn zw-btn-export" @click="exportFile">导出</button></li>
            <li class="r">
                <el-input class="search-input" placeholder="搜索关键字" v-model="filterText">
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
                 :width="item.width"
                 :label="item.label"
                 :sortable="item.sortble"
                 :formatter="item.formatter"
                 show-overflow-tooltip
                >
               </el-table-column>
               <el-table-column
                 prop=""
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer" @click="updatedProject(scoped.row)">编辑</span>
                        <span class="pointer" @click="deleteUDevice(scoped.row)">删除</span>
                     </div>
                 </template>
               </el-table-column>
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
    </div>
</template>
<script>
import table from '@/caiot/mixins/table' //表格混入数据
import {project,system,Device} from '@/caiot/request/api.js';
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
                    prop:'ProjectName',
                    label:'项目名称'
                },
                {
                    prop: 'DeviceCode',
                    label: '设备编码',
                },
                {
                    prop: 'DeviceName',
                    label: '设备名称',
                },
                {
                    prop: 'DeviceTypeName',
                    label: '设备类型',
                },
                {
                    prop: 'AreaName',
                    label: '区域名称',
                },
                {
                    prop:'SystemParamName',
                    label:'系统类型',
                    width:120
                },
                {
                    prop: 'IsControl',
                    label: '是否控制设备',
                    formatter:row => row.IsControl?'是':'否'
                },
                {
                    prop:'OtherSourceID',
                    label:'第三方ID',
                },
            ],
            type:0,
            projectName:localStorage.getItem('projectname'),
            defaultAddInfo:{//新增项目参数默认数据
                ProjectID:parseInt(localStorage.getItem('projectid')),
                DeviceID:0,
                DeviceName:null,
                DeviceShortName:null,
                DeviceTypeID:null,
                IsVirtualDevice:null,
                AreaID:null,
                SortID:null,
                ExtendAddress:null,
                OtherSourceID:0,
                DeviceCode:null,
                IDStr:null,
                IsControl:''
            },
            addInfo:{ //新增或修改项目参数
                ProjectID:null,
                DeviceID:0,
                DeviceName:null,
                DeviceShortName:null,
                DeviceTypeID:null,
                IsVirtualDevice:null,
                AreaID:null,
                SortID:null,
                ExtendAddress:null,
                OtherSourceID:0,
                DeviceCode:null,
                IDStr:null,
                IsControl:''
            },
            title:'新增',
            show:false,
            areaList:[], //区域类型
            deviceTypeList:[], //设备类型 
        }
    },
    computed:{
        projectList(){
            return this.$store.state.projectList
        }
    },
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    created(){
        this.queryData()
        this.queryUAreaList()
        this.queryDeviceType()
    },
    methods:{
        /**
         * 273.分页查询物联设备列表
         */
        queryData(){
            Device({
                FAction:'QueryPageUDevice',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            },true)
            .then((data) => {
                this.total = data.FObject.Table ? data.FObject.Table[0].FTotalCount : 0
                this.tableData = data.FObject.Table1 ? data.FObject.Table1 : []
                /**
                 * 删除操作时，当前页面无数据时跳到上一页
                 */
                if(this.tableData.length === 0&&this.pageIndex > 1){
                    --this.pageIndex
                    this.queryData()
                }
            })
            .catch((err) => {
                
            });
        },
        /**
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryData()
        },
        /**
         * 根据项目ID获取区域（66.获取所有区域）
         */
        queryUAreaList(id = localStorage.getItem('projectid')){
            this.addInfo.AreaID = null
            this.addInfo.DeviceTypeID = null
            return new Promise((resolve,reject) => {
                system({
                    FAction:'QueryUAreaList',
                    ProjectID:id
                })
                .then(data => {
                    this.areaList = data.FObject
                    resolve()
                })
                .catch(err => {reject()})
            })
        },
        /**
         * 241.获取设备类型
         */
        queryDeviceType(){
            system({
                FAction:'QueryDeviceType',
                ProjectID:0
            })
            .then(data => {
                this.deviceTypeList = data.FObject
            })
            .catch(err => {})
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.type = 0
            this.addInfo = Object.assign({},this.defaultAddInfo)
        },
        /**
         * 修改物联设备
         */
        async updatedProject(row) {
            this.show = true
            this.type = 1
            await this.queryUAreaList(row.ProjectID)
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
        },
        /**
         * 271.新增/修改物联设备
         */
        addOrUpdateUDevice(){
            this.show = false
            return new Promise((resolve,reject) => {
                Device({
                    FAction:'AddOrUpdateUDevice',
                    IDStr:this.addInfo.IDStr,
                    mUDevice:this.addInfo
                })
                .then(data => {
                    this.queryData()
                    resolve(data)
                })
                .catch(err => {
                    console.log(err);
                    reject(err)
                })
            })
        },
        /**
         * 272.删除物联设备
         */
        async deleteUDevice(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除区域信息'])
                .then(() => {
                    resove()
                })
                .catch(error => {

                })
            })
            Device({
                FAction:'DeleteUDevice',
                IDStr:row.IDStr
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {})
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            Device({
                FAction:'QueryExportUDevice',
                SearchKey:this.filterText,
            })
            .then(data => {
                window.location = "http://www.szqianren.com/" + data.FObject;
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: '导出失败!请重试'
                });
            })
        },
    }
}
</script>
<style lang="scss">

</style>
