<template>
    <div class="standard">
        <div class="l device-type">
            <h3 v-if="userType != 1"><el-button type="primary" @click="importInsepection">导入标准</el-button></h3>
            <h3>设备类型</h3>
            <div class="device-container">
                <el-scrollbar>
                    <el-tree
                        :data='deviceData'
                        :props="defaultProps"
                        highlight-current
                        @node-click='handleClick'
                    >
                    <template v-slot="{ node, data }">
                         <span style="display:flex;align-items:center">
                            <i class='icon iconfont' :class="data.IconName" style="margin-right:4px;"></i>
                            <span style="font-size:18px">{{data.SystemParamName||data.DeviceTypeName}}</span>
                        </span>
                    </template>
                    </el-tree>
                </el-scrollbar>
            </div>
        </div>
        <div class="main">
            <div class="main-item-header">
                <span><img src="@/caiot/static/image/task/speed.png"/>抄表项</span>
                <el-button type="primary" @click="importItem">编辑</el-button>
            </div>
            <!-- 导入数据参数弹框 -->
            <el-dialog title="编辑" class="zw-dialog" width="480px" append-to-body :visible.sync='show'>
                <div class="container">
                    <p><span>设备类型</span>{{device?device.DeviceTypeName:''}}</p>
                    <div class="item-content">
                        <h4>抄表内容</h4>
                        <div class="">
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                            <el-checkbox-group v-model="checkedItems" @change="handleCheckChange">
                                <el-checkbox v-for="item in allItem" :label="item.DataItemID" :key="item.DataItemID">{{item.DataItemName}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>
                <div slot="footer"><el-button @click="changeItems(1,changeItems)">确定</el-button></div>
            </el-dialog>
            <div class="main-item zhiwei-table">
                <el-table
                    :data='tableData'
                    height="371"
                    style="width: 100%"
                    header-row-class-name="el-table-header"
                    :row-class-name="tableRowClassName"
                >
                    <el-table-column
                      prop="DataItemName"
                      label="抄表内容">
                    </el-table-column>
                    <el-table-column
                      prop=""
                      label="操作">
                      <template slot-scope="scoped">
                          <div class="role-operation">
                             <span class="pointer" @click="deleteItem(scoped.row)">删除</span>
                          </div>
                      </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="main-item-header">
                <span><img src="@/caiot/static/image/task/editor.png"/>检查项</span>
                <el-button type="primary" class="zw-btn zw-btn-add" @click="add">新增</el-button>
            </div>
            <!-- 新增检查项弹框 -->
            <el-dialog :title="title" class="zw-dialog" append-to-body width="400px" :visible.sync='show1'>
                <div class="container">
                    <p><span>设备类型</span>{{device?device.DeviceTypeName:''}}</p>
                    <div class="item-content">
                        <h4>检查内容</h4>
                        <div >
                            <el-input type="textarea" v-model="inspectionItem"></el-input>
                        </div>
                    </div>
                </div>
                <div slot="footer"><el-button @click="addItems">确定</el-button></div>
            </el-dialog>
            <div class="main-item  zhiwei-table">
                <el-table
                    :data='tableData1'
                    height="371"
                    style="width: 100%"
                    header-row-class-name="el-table-header"
                    :row-class-name="tableRowClassName"
                >
                    <el-table-column
                      prop="DataItemName"
                      label="检查内容">
                    </el-table-column>
                    <el-table-column
                      prop=""
                      label="操作">
                      <template slot-scope="scoped">
                          <div class="role-operation">
                             <span class="pointer" @click="deleteItem(scoped.row)">删除</span>
                              <span class="pointer" @click="editor(scoped.row)">编辑</span>
                          </div>
                      </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import './InspectionStandard.scss';
export default {
    data(){
        return{
            tableData:[],
            deviceData:[], //所有设备类型
            defaultProps:{
                label:'DeviceTypeName',
                children:'ListData'
            },
            tableData1:[],
            userType:sessionStorage.getItem('FUserType'),
            device:null,
            allItem:[],
            show:false,
            checkedItems:[],
            show1:false,
            title:'新增',
            inspectionItem:'',
            type:0, //0为新增 1编辑
            isIndeterminate:false,
            checkAll: false,
            standardType:1, 
            itemID:null
        }
    },
    components:{
    },
    computed:{

    },
    watch:{

    },
    created(){
        this.standardType = this.$route.params.id
        this.queryDeviceType()
    },
    mounted(){

    },
    methods:{
        /**
         * 获取所有设备类型
         */
        queryDeviceType(){
            this.$post('/QuerySystemDeviceTypeToTree')
            .then(data => {
                console.log(data);
                this.deviceData = data.FObject
            })
            .catch(error => {

            })
        },
        /**
         * 103.查询指定设备类型所有的数据项
         */
        queryDeviceAllItem(id){
            this.$post('/QueryDeviceTypeDataItemInfo',{
                DeviceTypeID:id
            })
            .then(data => {
                console.log(data);
                this.allItem = data.FObject
            })
            .catch(error => {
                console.log(error);
            })
        },
        /**
         * 288.巡检标准--查询巡检标准
         */
        queryInspectionStandards(id){
            this.$post('/QueryInspectionStandards',{
                DeviceTypeID:id
            },true)
            .then((result) => {
                this.checkedItems = []
                this.tableData = result.FObject.Table||[]
                this.tableData1 = result.FObject.Table1||[]
                this.tableData.forEach(item => {
                    this.checkedItems.push(item.DataItemID)
                }); 
            }).catch((err) => {
                console.log(err);
            });
        },
        /**
        /**
         * 点击设备时
         */
        handleClick(data){
            if(data.DeviceTypeID){
                this.device = data
                this.queryDeviceAllItem(data.DeviceTypeID)
                this.queryInspectionStandards(data.DeviceTypeID)
            }else{
                this.device = null
            }
        },
        /**
         * 点击导入数据参数
         */
        importItem(){
            if(!this.device){
                this.$message({
                    type:'warning',
                    message:'请选择设备'
                })
                return
            }
            this.show = true
        },
        /**
         * 289.巡检标准-新增修改运营巡检标准
         */
        changeItems(type,items){
            if(items.length ===0){
                return
            }
            this.$post('/AddOrUpdateInspectionStandards',{
                DeviceTypeID:this.device.DeviceTypeID,
                DataItemID:type==1?this.checkedItems.join(','):'',
                DataItemName:type == 2?items:'',
                FInspectionType:type,
                FGUID:(type == 2&&this.type == 1)?this.itemID:''
            })
            .then((result) => {
                this.show = false
                this.show1 = false
                this.queryInspectionStandards(this.device.DeviceTypeID)
            }).catch((err) => {
                
            });
        },
        handleCheckAllChange(val){
            this.checkedItems = val ? this.allItem.map(item => item.DataItemID) : []
            this.isIndeterminate = false
        },
        handleCheckChange(val){
            let len = val.length
            this.checkAll = len === this.allItem.length;
            this.isIndeterminate = len > 0 && len <this.allItem.length
        },
        /**
         * 点击新增
         */
        add(){
            if(!this.device){
                this.$message({
                    type:'warning',
                    message:'请选择设备'
                })
                return
            }
            this.type = 0
            this.title = '新增'
            this.show1 =true
            this.inspectionItem = ''
        },
        /**
         * 点击编辑
         */
        editor(row){
            this.type = 1
            this.title = '编辑'
            this.show1 =true
            this.inspectionItem = row.DataItemName
            this.itemID = row.FGUID
        },
        /**
         * 新增或编辑检查项
         */
        addItems(){
            this.changeItems(2,this.inspectionItem)
        },
        /**
         * 导入巡检标准
         */
        async importInsepection(){
            await new Promise(resolve => {
                this.$DeleteMessage([`确定要导入巡检标准`,'导入巡检标准'])
                .then(() => {
                    resolve()
                })
                .catch(() => {
                })
            })
            Inspection({
                FAction: 'ImportUInspectionDeviceTypeCheckItem'
            })
            .then((result) => {
                if(this.device.DeviceTypeID){
                    this.querySInspectionDeviceTypeDataItem(this.device.DeviceTypeID)
                }
                this.$message({
                    message: '导入成功',
                    type: 'success'
                })
            }).catch((err) => {
                this.$message({
                    message: '导入失败',
                    type: 'error'
                })
            });
        },
        async deleteItem(row){
            await this.$confirm(`此操作将删除, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            this.$post('/DeleteTInspectionStandards',{
                FGUID:row.FGUID
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '删除成功！'
                });
                this.queryInspectionStandards()
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: '删除失败！'
                });
            })
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 === 1) {
              return 'odd-row';
            } else if (rowIndex%2 === 0) {
              return 'even-row';
            }
        },
    }
}
</script>
<style lang="scss">
</style>
