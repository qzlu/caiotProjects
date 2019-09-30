<template>
    <div class="report inspection-item">
        <el-dialog :title="title" :visible.sync="show" width="426" class="zw-dialog patrol-point">
            <el-form :model="addPointData" ref="form">
                <el-form-item label="巡更点名称"  prop='PointName' :rules="[{ required: true, message: '请输入巡更点名称'}]">
                    <el-input v-model="addPointData.PointName"></el-input>
                </el-form-item>
                <el-form-item label="关联蓝牙" prop="BluetoothConfigID">
                    <el-select v-model="addPointData.BluetoothConfigID">
                        <el-option v-for="(list,i) in blueTooth" :key="i" :label="list.BluetoothName" :value="list.ID"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" @click="addOrUpdatedPoint()">确定</button>
            </div>
        </el-dialog>
        <ul class="clearfix report-header">
            <li class="l" @click="add()"><button class="zw-btn zw-btn-add">新增</button></li>
            <li class="l" @click="exportFile"><button class="zw-btn zw-btn-export">导出</button></li>
            <li class="l"><button class="zw-btn" style="width:120px;padding:0 10px" @click="exportPatrolPointQrCode"><i class="iconfont icon-QRcode" style="color:#3593ed"></i>导出二维码</button></li>
            <!-- <li class="l" @click="queryAreaTypeDeviceInfo"><button class="zw-btn zw-btn-import">设备导入</button></li> -->
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
import {system,Patrol} from '@/caiot/request/api.js'//api接口（接口统一管理）;
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
                    prop: 'PatrolPointName',
                    label: '巡更点'
                },
                {
                    prop:'BluetoothCode',
                    label:'蓝牙识别码'
                },
                {
                    prop: 'ShortName',
                    label: '所属项目'
                }
            ],
            title:'新增',
            show:false,
            addPointData:{ //新增或编辑巡更点数据
                PointName:'',
                BluetoothConfigID:''
            },
            areaList:[], //区域列表
            energyTypeList:[], //能源类型分类
            systemTypeList:[], //系统分类
            type:0,
            showImportDialog:false,
            allDefaultPoint:[],//设备导入的所有巡更检点
            defaultProps:{children:'list',disabled:'disabled'},
            defaultChecked:[],//已经导入的，
            blueTooth:[],//蓝牙列表
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
        this.queryBluetooth()
    },
    mounted(){

    },
    methods:{
        renderContent(h, { node, data, store }){
            return(
                <span>{data.AreaName?data.AreaName:data.DeviceName}</span>
            )
        },
        /**
         * 查询巡更点
         */
        queryData(){
            const loading = this.$loading({
              customClass: 'hahahah',
              background: 'rgba(0, 0, 0, 0.7)',
              text:'正在加载......'
            });
            Patrol({
                FAction:'QueryPageUPatrolPoint',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then(data => {
                console.log(data)
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
         * 查询所有蓝牙
         */
        queryBluetooth(){
            system({
                FAction:'QueryPageUBluetoothConfig',
                SearchKey:'',
                PageIndex:this.pageIndex,
                PageSize:10000
            })
            .then((data) => {
                this.blueTooth = data.FObject.Table1 ? data.FObject.Table1 : []
            })
            .catch((err) => {
                
            });
        },
        /**
         * 新增或编辑巡更点
         */
        async addOrUpdatedPoint(){
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            Patrol({
                FAction:this.type?'UpdateUPatrolPoint':'AddUPatrolPoint',
                FName:this.addPointData.PointName,
                FDescription:'',
                ID:this.addPointData.ID,
                BluetoothConfigID:this.addPointData.BluetoothConfigID
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
            this.addPointData.PointName = null
            this.addPointData.BluetoothConfigID = null
        },
        /**
         * update 修改巡更点
         */
        update(item) {
            this.title = '修改'
            this.show = true
            this.type = 1
            this.addPointData.PointName = item.PatrolPointName
            this.addPointData.ID = item.ID
            this.addPointData.BluetoothConfigID = item.BluetoothConfigID
        },
        /**
         * deleteItem 删除巡更点
         * @param {type Object} item 巡更点
         */
        async deleteItem(item){
            console.log(item);
            await new Promise(resolve => {
                this.$DeleteMessage([`确定要删除　　${item.PatrolPointName}`,'删除巡更点'])
                .then(() => {
                    resolve()
                })
                .catch(() => {
                })
            })
            Patrol({
                FAction:'DeleteUPatrolPoint',
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
            Patrol({
                FAction:'QueryExportUPatrolPoint',
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
         * 导出二维码
         */
        exportPatrolPointQrCode(){
            Patrol({
                FAction:'ExportPatrolPointQrCode'
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
</style>
