<template>
    <div class="report inspection-item">
        <el-dialog :title="title" :visible.sync="show" width="426" class="zw-dialog">
            <el-form :model="addPoint" ref="form">
                <el-form-item label="巡检点名称"  prop='InspectionPointName' :rules="[{ required: true, message: '请输入巡检点名称'}]">
                    <el-input v-model="addPoint.InspectionPointName"></el-input>
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
                <el-form-item label="设备类型" prop="DeviceTypeID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addPoint.DeviceTypeID"   placeholder="请选择">
                    <el-option v-for="device in allDevice" :key="device.DeviceTypeID" :label="device.DeviceTypeName" :value="device.DeviceTypeID"></el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" @click="addUInspectionPoint()">确定</button>
            </div>
        </el-dialog>
        <el-dialog title="导入巡检点" :visible.sync="showImportDialog" class="zw-dialog import-point">
            <zw-tree
            ref='pointTree' 
             title="选择巡检点" 
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
                <el-input class="search-input" placeholder="搜索关键字" v-model="filterText">
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
                 :width="item.width"
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
import {system,Inspection,MeterReading,ReportMatter} from '@/caiot/request/api.js'//api接口（接口统一管理）;
import table from '@/caiot/mixins/table' //表格混入数据
import {zwTree} from '@/caiot/zw-components/index'
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowNum',
                    label: '序号',
                    width: '80'
                },
                {
                    prop: 'InspectionPointName',
                    label: '巡检点'
                },
                {
                    prop: 'DeviceTypeName',
                    label: '设备类型'
                },
                {
                    prop: 'AreaName',
                    label: '区域名称'
                },
                {
                    prop: 'Value',
                    label: '系统名称'
                }
            ],
            title:'新增',
            show:false,
            defalutAddPoint:{//新增巡检点默认数据
                InspectionPointName:'',
                ProjectID:localStorage.getItem('projectid'),
                AreaID:null,
                FDescription:'',
                SystemParamID:null,
                DeviceTypeID:null
            },
            addPoint:{ //新增或编辑巡检点数据
                InspectionPointName:'',
                ProjectID:localStorage.getItem('projectid'),
                AreaID:null,
                FDescription:'',
                SystemParamID:null,
                ID:null,
                DeviceTypeID:null
            },
            areaList:[], //区域列表
            systemTypeList:[], //系统分类
            type:0,
            showImportDialog:false,
            allDefaultPoint:[],//设备导入的所有巡检点
            defaultProps:{children:'list',disabled:'disabled'},
            defaultChecked:[],//已经导入的
            allDevice:[] //所有设备
        }
    },
    components:{
        zwTree
    },
    watch:{
        filterText(){
            clearTimeout(timer)
            var timer = setTimeout(() => {
                this.queryData(this.filterText)
            },500)
        }
    },
    created(){
        this.queryData()
        this.queryAreaType()
        this.querySystemType()
        this.queryAllDeviceType()
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
         * 查询巡检点
         */
        queryData(){
            const loading = this.$loading({
              customClass: 'hahahah',
              background: 'rgba(0, 0, 0, 0.7)',
              text:'正在加载......'
            });
            Inspection({
                FAction:'QueryPageUInspectionPointInfo',
                FName:this.filterText,
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
         * 获取巡检点区域设备
         */
        queryAreaTypeDeviceInfo(){
            this.showImportDialog = true
            this.defaultChecked = []
            MeterReading({
                FAction:'QueryAreaTypeDeviceInfo',
                FType:1
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
         * 获取所有设备类型
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
         * 新增或编辑巡检点
         */
        async addUInspectionPoint(){
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            Inspection({
                FAction:this.type?'UpdateUInspectionPoint':'AddUInspectionPoint',
                mUInspectionPoint:this.addPoint
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
         * update 修改巡检点
         */
        update(item) {
            this.title = '编辑'
            this.show = true
            this.type = 1
            for(let key in this.addPoint){
                if(key != 'ProjectID'){
                    this.addPoint[key] = item [key] || ''
                }
            }
        },
        /**
         * deleteItem 删除巡检点
         * @param {type Object} item 巡检点
         */
        async deleteItem(item){
            await new Promise(resolve => {
                this.$DeleteMessage([`确定要删除　　${item.InspectionPointName}`,'删除巡检点'])
                .then(() => {
                    resolve()
                })
                .catch(() => {
                })
            })
            Inspection({
                FAction:'DeleteUInspectionPoint',
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
                  message: '删除失败!'
                });
            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            Inspection({
                FAction:'QueryExportUInspectionPointInfo',
                FName:this.filterText,
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
            Inspection({
                FAction:'AddImportUInspectionPoint',
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
</style>

