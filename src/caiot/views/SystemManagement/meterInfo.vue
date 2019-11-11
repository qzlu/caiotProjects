<template>
    <div class="report inspection-item meter">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="750px" class="zw-dialog">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="项目名称"  prop='ProjectID'  :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.ProjectID"  value-key="ProjectID" filterable  placeholder="请选择" @change="queryUAreaList">
                    <el-option v-for="list in projectList" :key="list.ProjectID" :label="list.ShortName" :value="list.ProjectID"></el-option>
                  </el-select>
                  <!-- <el-input readonly :value="projectName"></el-input> -->
                </el-form-item>
                <el-form-item label="网关名称" prop="LDasID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.LDasID"  value-key="" filterable  placeholder="请选择" >
                    <el-option v-for="list in ldasList" :key="list.LDasID" :label="list.LDasName" :value="list.LDasID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="区域名称" prop="AreaID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.AreaID"  value-key="AreaID" filterable  placeholder="请选择" >
                    <el-option v-for="list in areaList" :key="list.AreaID" :label="list.AreaName" :value="list.AreaID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="仪表名称" prop="MeterName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input  v-model="addInfo.MeterName">
                    </el-input>
                </el-form-item>
                <el-form-item label="仪表型号" prop="MeterModelID" :rules="[{ required: true, message: '请选择'}]">
                    <el-select v-model="addInfo.MeterModelID" filterable>
                        <el-option v-for="(item,index) in meterModel" :key="index" :label="item.MeterModelName" :value="item.MeterModelID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="通信IP地址" prop="Ip" >
                    <el-input v-model="addInfo.Ip">
                    </el-input>
                </el-form-item>
                <el-form-item label="Modbus通讯地址" prop="ModbusAddr" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.ModbusAddr">
                    </el-input>
                </el-form-item>
                <el-form-item label="通信端口" prop="Port">
                    <el-input v-model="addInfo.Port">
                    </el-input>
                </el-form-item>
                <el-form-item label="第三方ID" prop="OtherSourceID">
                    <el-input v-model="addInfo.OtherSourceID">
                    </el-input>
                </el-form-item>
                <el-form-item label="是否有效" prop="EnReg">
                    <el-input v-model="addInfo.EnReg" placeholder="true/false/寄存器地址"></el-input>
                </el-form-item>
                <el-form-item label="是否为识别ID" prop="IsDISId" >
                    <el-switch v-model="addInfo.IsDISId"></el-switch>
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
                        <span class="pointer" @click="deleteUMeter(scoped.row)">删除</span>
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
import {project,system} from '@/caiot/request/api.js';
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
                    prop: 'LDasName',
                    label: '网关名称',
                },
                {
                    prop: 'MeterName',
                    label: '仪表名称',
                },
                {
                    prop: 'Ip',
                    label: '通讯IP地址',
                },
                {
                    prop: 'ModbusAddr',
                    label: 'Modbus通讯',
                },
                {
                    prop:'EnReg',
                    label:'是否有效'
                },
                {
                    prop: 'IsDISId',
                    label: '是否为识别ID',
                    formatter:(row, column, cellValue, index) => row.IsDISId?'是':'否'
                },
                {
                    prop: 'Port',
                    label: '通讯端口',
                },
            ],
            type:0,
            projectName:localStorage.getItem('projectname'),
            defaultAddInfo:{//新增仪表信息参数默认数据
                ProjectID:parseInt(localStorage.getItem('projectid')),
                MeterID:0,
                MeterName:null,
                LDasID:null,
                AreaID:null,
                MeterModelID:null,
                Ip:'127.0.0.1',
                Port:0,
                ModbusAddr:null,
                IsDISId:false,
                OtherSourceID:0,
                EnReg:''
            },
            addInfo:{ //新增或修改仪表信息参数
                ProjectID:parseInt(localStorage.getItem('projectid')),
                MeterID:0,
                MeterName:null,
                LDasID:null,
                AreaID:null,
                MeterModelID:null,
                Ip:'127.0.0.1',
                Port:0,
                ModbusAddr:null,
                IsDISId:false,
                OtherSourceID:0,
                EnReg:''
            },
            title:'新增',
            show:false,
            areaList:[],//区域
            ldasList:[], //网关
            meterModel:[],//仪表型号列表
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
        this.queryULdasByProjectID()
        this.queryUAreaList()
        this.queryPageSMeterModel()
    },
    methods:{
        /**
         * 274.分页查询仪表信息
         */
        queryData(){
            system({
                FAction:'QueryUMeter',
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
        queryUAreaList(id = localStorage.getItem('projectid')){
            this.addInfo.AreaID = null
            this.addInfo.LDasID = null
            this.queryULdasByProjectID(id)
            return new Promise((resolve,reject) => {
                system({
                    FAction:'QueryUAreaList',
                    ProjectID:id
                })
                .then(data => {
                    this.areaList = data.FObject
                })
                .catch(err => {})
            })
        },
        /**
         * 查询仪表型号
         */
        queryPageSMeterModel(){
            system({
                FAction:'QueryPageSMeterModel',
                SearchKey:'',
                PageIndex:1,
                PageSize:1000000
            })
            .then((data) => {
                this.meterModel = data.FObject.Table1?data.FObject.Table1:[]
            }).catch((err) => {
                
            });
        },
        /**
         * 284.获取项目网关信息
         */
        queryULdasByProjectID(id = localStorage.getItem('projectid')){
            system({
                FAction:'QueryULdasByProjectID',
                ProjectID:id
            })
            .then(data => {
                this.ldasList = data.FObject
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
         * 修改网关
         */
        updatedProject(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            this.addInfo.IsDISId = Boolean(this.addInfo.IsDISId)
        },
        /**
         * 275.新增/修改仪表信息
         */
        addUpdateUMeter(){
            this.show = false
            this.addInfo.IsDISId = Number(this.addInfo.IsDISId)
            system({
                FAction:'AddUpdateUMeter',
                FType:this.type,
                mUMeter:this.addInfo
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 268.删除网关
         */
        async deleteUMeter(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除网关信息'])
                .then(() => {
                    resove()
                })
                .catch(error => {

                })
            })
            system({
                FAction:'DeleteUMeter',
                ID:row.MeterID
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
                FAction:'QueryExportUMeter',
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
.meter.inspection-item{
    .el-form-item{
        .el-form-item__label{
            width: 134px;
        }
    }
}


</style>
