<template>
    <div class="report inspection-item">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="750px" class="zw-dialog">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="项目名称"  prop='ProjectID'  :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.ProjectID"  value-key="" filterable  placeholder="请选择" @change="queryUAreaList">
                    <el-option v-for="list in projectList" :key="list.ProjectID" :label="list.ShortName" :value="list.ProjectID"></el-option>
                  </el-select>
                  <!-- <el-input readonly :value="projectName"></el-input> -->
                </el-form-item>
                <el-form-item label="区域名称" prop="AreaID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.AreaID"  value-key="AreaID" filterable  placeholder="请选择" >
                    <el-option v-for="list in areaList" :key="list.AreaID" :label="list.AreaName" :value="list.AreaID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备名称" prop="" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="selectDevice"  value-key="DeviceID" filterable  placeholder="请选择" @change="select">
                    <el-option v-for="list in deviceList" :key="list.DeviceID" :label="list.DeviceName" :value="list"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="数据标识" prop="DataItemID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.DataItemID"  value-key="" filterable  placeholder="请选择" >
                    <el-option v-for="list in dataItemList" :key="list.DataItemID" :label="list.DataItemName" :value="list.DataItemID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="显示名称" prop="ShowName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input  v-model="addInfo.ShowName">
                    </el-input>
                </el-form-item>
                <el-form-item label="显示单位" prop="ShowUnit" :rules="[{ required: true, message: '请输入'}]">
                    <el-input  v-model="addInfo.ShowUnit">
                    </el-input>
                </el-form-item>
                <el-form-item label="位置" prop="Postion" >
                    <el-input v-model="addInfo.Postion">
                    </el-input>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" @click="addUpdateUAreaMapingData()">确定</button>
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
                        <span class="pointer" @click="deleteUAreaMapingData(scoped.row)">删除</span>
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
                    prop: 'AreaName',
                    label: '区域名称',
                },
                {
                    prop: 'DeviceName',
                    label: '设备名称',
                },
                {
                    prop: 'DataItemName',
                    label: '数据标识',
                },
                {
                    prop: 'ShowName',
                    label: '显示名称',
                },
                {
                    prop: 'ShowUnit',
                    label: '显示单位',
                    // formatter:(row, column, cellValue, index) => row.IsDISId?'是':'否'
                },
                {
                    prop: 'Postion',
                    label: '位置',
                },
            ],
            type:0,
            projectName:localStorage.getItem('projectname'),
            defaultAddInfo:{//新增区域映射参数默认数据
                ID:0,
                ProjectID:parseInt(localStorage.getItem('projectid')),
                AreaID:null,
                DeviceID:null,
                AreaID:null,
                DataItemID:null,
                ShowName:null,
                ShowUnit:null,
                Postion:0,
            },
            addInfo:{ //新增或修改区域映射
                ID:0,
                ProjectID:null,
                AreaID:null,
                DeviceID:null,
                AreaID:null,
                DataItemID:null,
                ShowName:null,
                ShowUnit:null,
                Postion:0,
            },
            title:'新增',
            show:false,
            areaList:[],
            deviceList:[],
            dataItemList:[],
            selectDevice:{}
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
    },
    methods:{
        /**
         *281.分页查询区域映射
         */
        queryData(){
            system({
                FAction:'QueryUAreaMapingData',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            })
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
        async queryUAreaList(id = localStorage.getItem('projectid')){
            this.addInfo.AreaID = null
            this.addInfo.DeviceID = null
            this.addInfo.DataItemID = null
            this.dataItemList = []
            this.selectDevice = {}
            await this.queryUDevice(id)
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
         * 292.查询所有物联设备列表
         */
        queryUDevice(id){
            return new Promise((resolve,reject) => {
                Device({
                    FAction:'QueryUDeviceList',
                    ProjectID:id,
                    SearchKey:''
                })
                .then(data => {
                    this.deviceList = data.FObject
                    resolve()
                })
                .catch(err => { reject() })
            })
        },
        select(item){
            this.addInfo.DeviceID = item.DeviceID
            this.addInfo.DataItemID = null
            this.querySDataItemsByDeviceTypeID(item.DeviceTypeID)
        },
        /**
         * 103.查询指定设备类型所有的数据项
         */
        querySDataItemsByDeviceTypeID(type){
            return new Promise((resolve,reject) => {
                system({
                    FAction:'QuerySDataItemsByDeviceTypeID',
                    DeviceTypeID:type
                })
                .then(data => {
                    this.dataItemList = data.FObject
                    resolve()
                })
                .catch(err => {reject()})
            })
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.type = 0
            this.addInfo = Object.assign({},this.defaultAddInfo)
            this.selectDevice = {}
        },
        /**
         * 修改区域映射
         */
        async updatedProject(row) {
            this.show = true
            this.type = 1
            await this.queryUAreaList(row.ProjectID)
            await this.querySDataItemsByDeviceTypeID(row.DeviceTypeID)
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            this.$set(this.selectDevice,'DeviceID',row.DeviceID)
        },
        /**
         * 282.新增/修改区域映射
         */
        addUpdateUAreaMapingData(){
            this.show = false
            system({
                FAction:'AddUpdateUAreaMapingData',
                FType:this.type,
                mUAreaMapingData:this.addInfo
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 283.删除区域映射
         */
        async deleteUAreaMapingData(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除区域映射'])
                .then(() => {
                    resove()
                })
                .catch(error => {

                })
            })
            system({
                FAction:'DeleteUAreaMapingData',
                IDStr:row.ID
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
            system({
                FAction:'QueryExportUAreaMapingData',
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
