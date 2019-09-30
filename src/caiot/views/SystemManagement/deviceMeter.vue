<template>
    <div class="report inspection-item meter">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="750px" class="zw-dialog">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="项目名称" >
                  <el-input readonly :value="projectName"></el-input>
                </el-form-item>
                <el-form-item label="设备名称" prop="DeviceID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.DeviceID"  value-key="DeviceID" filterable  placeholder="请选择" >
                    <el-option v-for="list in deviceList" :key="list.DeviceID" :label="list.DeviceName" :value="list.DeviceID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="仪表名称" prop="MeterID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.MeterID"  value-key="" filterable  placeholder="请选择" >
                    <el-option v-for="list in meterList" :key="list.MeterID" :label="list.MeterName" :value="list.MeterID"></el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" @click="addUpdateUMeter()">确定</button>
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
                        <span class="pointer" @click="deleteUDeviceMeter(scoped.row)">删除</span>
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
import {project,system,Device,ReportMatter} from '@/caiot/request/api.js';
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
                    prop: 'DeviceName',
                    label: '设备名称',
                },
                {
                    prop: 'MeterName',
                    label: '仪表名称',
                }
            ],
            type:0,
            projectName:localStorage.getItem('projectname'),
            defaultAddInfo:{//新增仪表信息参数默认数据
                DeviceID:null,
                MeterID:null,
                IDStr:null,
            },
            addInfo:{ //新增或修改仪表信息参数
                DeviceID:null,
                MeterID:null,
                IDStr:null,
            },
            title:'新增',
            show:false,
            meterList:[], //仪表
            deviceList:[] , //设备列表
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
        this.queryUMeterList()
        this.queryUDevice()
    },
    methods:{
        /**
         * 278.分页查询设备仪表
         */
        queryData(){
            Device({
                FAction:'QueryPageUDeviceMeter',
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
         * 291.查询所有物联设备列表
         */
        queryUDevice(){
            Device({
                FAction:'QueryUDeviceList',
                SearchKey:''
            })
            .then(data => {
                this.deviceList = data.FObject
            })
            .catch(err => {})
        },
        /**
         * 277.查询仪表列表
         */
        queryUMeterList(){
            Device({
                FAction:'QueryUMeterList'
            })
            .then(data => {
                this.meterList = data.FObject
            })
            .catch(err => {

            })
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
         * 修改网关
         */
        updatedProject(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
        },
        /**
         * 新增/修改设备仪表
         */
        addUpdateUMeter(){
            this.show = false
            Device({
                FAction:'AddOrUpdateUDeviceMeter',
                DeviceID:this.addInfo.DeviceID,
                MeterID:this.addInfo.MeterID,
                IDStr:this.addInfo.IDStr
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 279.删除设备仪表
         */
        async deleteUDeviceMeter(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除设备仪表'])
                .then(() => {
                    resove()
                })
                .catch(error => {

                })
            })
            Device({
                FAction:'DeleteUDeviceMeter',
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
                FAction:'QueryExportUDeviceMeter',
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
