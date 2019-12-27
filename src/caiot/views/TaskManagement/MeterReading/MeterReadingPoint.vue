<template>
    <div class="report inspection-item">
        <el-dialog :title="title" :visible.sync="show" width="426" class="zw-dialog meter-reading-point">
            <el-form :model="addPoint" ref="form">
                <el-form-item label="抄表点名称"  prop='MeterReadingPointName' :rules="[{ required: true, message: '请输入抄表点名称'}]">
                    <el-input v-model="addPoint.MeterReadingPointName"></el-input>
                </el-form-item>
                <el-form-item label="能耗类型" prop="EnergyTypeID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addPoint.EnergyTypeID"   placeholder="请选择">
                    <el-option v-for="item in energyTypeList" :key="item.ID" :label="item.EnergyTypeName" :value="item.ID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="区域名称" prop="AreaID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addPoint.AreaID"   placeholder="请选择">
                    <el-option v-for="area in areaList" :key="area.AreaID" :label="area.AreaName" :value="area.AreaID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="系统名称" prop="SystemParamID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addPoint.SystemParamID"   placeholder="请选择">
                    <el-option v-for="system in systemTypeList" :key="system.Key" :label="system.ParamValue" :value="system.Key"></el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" v-submit="addUInspectionPoint">确定</button>
            </div>
        </el-dialog>
        <el-dialog title="导入抄表点" :visible.sync="showImportDialog" class="zw-dialog import-point">
            <zw-tree
            ref='pointTree' 
             title="选择抄表点" 
             :data='allDefaultPoint' 
             :renderContent='renderContent' 
             :defaultProps='defaultProps'
             nodeKey='DeviceLedgerID'
             :defaultChecked='defaultChecked'
             showCheckbox>
            </zw-tree>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" @click="importDevice">确定</button>
            </div>
        </el-dialog>
        <ul class="clearfix report-header">
            <li class="l" @click="add()"><button class="zw-btn zw-btn-add">新增</button></li>
            <li class="l" @click="exportFile"><button class="zw-btn zw-btn-export">导出</button></li>
             <li class="l" @click="queryAreaTypeDeviceInfo"><button class="zw-btn zw-btn-import">设备导入</button></li>
            <li class="l" @click="pageIndex=1;filterText = '';queryData()"><button class="zw-btn zw-btn-refrest">刷新</button></li>
            <li class="r">
                <el-input class="search-input" placeholder="搜索设备关键字" v-model="filterText">
                    <i class="el-icon-search" slot="suffix"></i>
                </el-input>
                <button class="zw-btn zw-btn-primary" @click="filterText = '' ">重置</button>
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
                >
               </el-table-column>
               <el-table-column
                 prop=""
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer" @click="deleteItem(scoped.row)">删除</span>
                        <span class="pointer" @click="update(scoped.row)">编辑</span>
                     </div>
                 </template>
               </el-table-column>
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
    </div>
</template>
<script>
import {system,MeterReading} from '@/caiot/request/api.js'//api接口（接口统一管理）;
import table from '@/caiot/mixins/table' //表格混入数据
import {zwTree} from '@/caiot/zw-components/index'
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowNum',
                    label: '序号'
                },
                {
                    prop: 'MeterReadingPointName',
                    label: '抄表点'
                },
                {
                    prop: 'EnergyTypeName',
                    label: '能耗类型'
                },
                {
                    prop: 'AreaName',
                    label: '所属区域'
                },
                {
                    prop: 'ShortName',
                    label: '所属项目'
                }
            ],
            title:'新增',
            show:false,
            defalutAddPoint:{//新增抄表点默认数据
                MeterReadingPointName:'',
                EnergyTypeID:'',
                ProjectID:localStorage.getItem('projectid'),
                AreaID:null,
                FDescription:'',
                SystemParamID:null,
                ID:null
            },
            addPoint:{ //新增或编辑抄表点数据
                MeterReadingPointName:'',
                EnergyTypeID:'',
                ProjectID:localStorage.getItem('projectid'),
                AreaID:null,
                FDescription:'',
                SystemParamID:null,
                ID:null
            },
            areaList:[], //区域列表
            energyTypeList:[], //能源类型分类
            systemTypeList:[], //系统分类
            type:0,
            showImportDialog:false,
            allDefaultPoint:[],//设备导入的所有抄表检点
            defaultProps:{children:'list',disabled:'disabled'},
            defaultChecked:[]//已经导入的
        }
    },
    components:{
        zwTree
    },
    watch:{
        filterText(){
            clearTimeout(timer)
            var timer = setTimeout(() => {
                this.queryData()
            },500)
        }
    },
    created(){
        this.queryData()
        this.queryAreaType()
        this.querySEnergyType()
        this.querySystemType()
    },
    mounted(){

    },
    methods:{
        renderContent(h, { node, data, store }){
            return(
                <span>{data.AreaName?data.AreaName:data.DeviceLedgerName}</span>
            )
        },
        /**
         * 查询抄表点
         */
        queryData(){
            const loading = this.$loading({
              customClass: 'hahahah',
              background: 'rgba(0, 0, 0, 0.7)',
              text:'正在加载......'
            });
            MeterReading({
                FAction:'QueryPageUMeterReadingPoint',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then(data => {
                this.total = data.FObject.Table[0].Count
                this.tableData = data.FObject.Table1
                /**
                * 删除操作时，当前页面无数据时跳到上一页
                */
                if(this.tableData.length === 0&&this.pageIndex > 1){
                    --this.pageIndex
                    this.queryData()
                }
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setTimeout(() => {
                    loading.close()
                },200)
            })
        },
        /**
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryData(this.filterText,val)
        },
        /**
         * 查询区域分类
         */
        queryAreaType(){
            system({
                FAction:'QueryUArea',
                ProjectID:localStorage.getItem("projectid")
            })
            .then(data => {
                this.areaList = data.FObject
            })
            .catch(error => {
                
            })
        },
        /**
         * 查询能耗类型
         */
        querySEnergyType(){
            MeterReading({
                FAction:'QuerySEnergyType',
            })
            .then(data => {
                this.energyTypeList = data.FObject
            })
            .catch(error => {

            })
        },
        /**
         * 查询系统分类
         */
        querySystemType(){
            system({
                FAction:'SSystemParam',
                FName:''
            })
            .then(data => {
                this.systemTypeList = data.FObject
            })
            .catch(error => {

            })
        },
        /**
         * 获取抄表点区域设备
         */
        queryAreaTypeDeviceInfo(){
            this.showImportDialog = true
            this.defaultChecked = []
            MeterReading({
                FAction:'QueryAreaTypeDeviceInfo',
                FType:2
            })
            .then(data => {
                this.allDefaultPoint = data.FObject
                this.allDefaultPoint.forEach(item => {
                    item.list.forEach(node => {
                        if(node.IsExist == 1){
                            this.defaultChecked.push(node.DeviceLedgerID)
                            node.disabled = true
                        }else{
                            node.disabled = false
                        }
                    })
                })
            })
            .catch(error => {

            })
        },
        /**
         * 新增或编辑抄表点
         */
        async addUInspectionPoint(){
            MeterReading({
                FAction:this.type?'UpdateUMeterReadingPoint':'AddUMeterReadingPoint',
                mUMeterReading:this.addPoint
            })
            .then(data => {
                this.show = false
                this.$message({
                  type: 'success',
                  message: this.type?'修改成功！':'新增成功！'
                });
                this.queryData()
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: error
                });
            })
        },
         /**
         * add 点击新增按钮
         */
        add(){
            this.title = '新增'
            this.type = 0
            this.show = true,
            this.addPoint = Object.assign({},this.defalutAddPoint)
        },
        /**
         * update 修改抄表点
         */
        update(item) {
            this.title = '修改'
            this.show = true
            this.type = 1
            for(let key in this.addPoint){
                if(key != 'ProjectID'){
                    this.addPoint[key] = item [key]?item [key]:''
                }
            }
        },
        /**
         * deleteItem 删除抄表点
         * @param {type Object} item 抄表点
         */
        async deleteItem(item){
            await new Promise(resolve => {
                this.$DeleteMessage([`确定要删除　　${item.MeterReadingPointName}`,'删除抄表点'])
                .then(() => {
                    resolve()
                })
                .catch(() => {
                })
            })
            MeterReading({
                FAction:'DeleteUMeterReadingPoint',
                ID:item.ID
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.queryData()
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: error
                });
            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            MeterReading({
                FAction:'QueryExportUMeterReadingPoint',
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
        /**
         * 设备导入
         * 
         */
        importDevice(){
            let arr = this.$refs.pointTree.$refs.tree.getCheckedNodes()
            //过滤区域节点
            arr = arr.filter(item => {
                return item.DeviceLedgerID
            })
            arr = arr.map(item => {
                return item.DeviceLedgerID
            })
            MeterReading({
                FAction:'AddImportUMeterReadingPoint',
                IDStr:arr.join(',')
            })
            .then(data => {
                this.showImportDialog = false
                this.queryData()
                this.$message({
                  type: 'success',
                  message: '设备导入成功!'
                });
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: '设备导入失败!请重试'
                });
            })
        }
    }
}
</script>
<style lang="scss">
// 样式同抄表点（InspectionItem）
.zw-dialog.meter-reading-point{
    .el-dialog{
        height: 420px;
        background-size: 100% 100%;
    }
}
</style>
