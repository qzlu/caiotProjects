<template>
    <div class="report standard">
        <div class="l device-type">
            <h3 v-if="standardType == 1"><button class="zw-btn import" @click="importInsepection">导入标准</button></h3>
            <h3>设备类型</h3>
            <div class="device-container">
                <el-scrollbar>
                    <el-tree
                        :data='deviceData'
                        highlight-current
                        :props="defaultProps"
                        @node-click='handleClick'
                    >
                        <span slot-scope="{ node, data }">
                            <i class='icon iconfont' :class="data.IconName"></i>
                            <span style="font-size:18px">{{data.DeviceTypeName}}</span>
                        </span>
                    </el-tree>
                </el-scrollbar>
            </div>
        </div>
        <div class="main">
            <div class="main-item-header">
                <span><img src="../../static/image/task/speed.png"/>抄表项</span>
                <button class="zw-btn" @click="importItem">编辑</button>
            </div>
            <!-- 导入数据参数弹框 -->
            <el-dialog title="编辑" class="zw-dialog" :visible.sync='show'>
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
                    <div style="text-align:center"><button class="zw-btn zw-btn-primary" @click="changeItems">确定</button></div>
                </div>
            </el-dialog>
            <div class="main-item">
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
                <span><img src="../../static/image/task/editor.png"/>检查项</span>
                <button class="zw-btn zw-btn-add" @click="add">新增</button>
            </div>
            <!-- 新增检查项弹框 -->
            <el-dialog :title="title" class="zw-dialog" :visible.sync='show1'>
                <div class="container">
                    <p><span>设备类型</span>{{device?device.DeviceTypeName:''}}</p>
                    <div class="item-content">
                        <h4>检查内容</h4>
                        <div >
                            <el-input v-model="inspectionItem"></el-input>
                        </div>
                    </div>
                    <div style="text-align:center"><button class="zw-btn zw-btn-primary" @click="addItems">确定</button></div>
                </div>
            </el-dialog>
            <div class="main-item standard">
                <el-table
                    :data='tableData1'
                    height="371"
                    style="width: 100%"
                    header-row-class-name="el-table-header"
                    :row-class-name="tableRowClassName"
                >
                    <el-table-column
                      prop="DataItemName"
                      align="left"
                      label="检查内容">
                    </el-table-column>
                    <el-table-column
                      prop=""
                      align="left"
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
import {system,Inspection} from '@/caiot/request/api.js'//api接口（接口统一管理）;
import table from '@/caiot/mixins/table' //表格混入数据
export default {
    mixins:[table],
    data(){
        return{
            deviceData:[], //所有设备类型
            defaultProps:{
                label:'DeviceTypeName',
                children:'DeviceTypes'
            },
            tableData1:[],
            device:{},
            allItem:[],
            show:false,
            checkedItems:[],
            show1:false,
            title:'新增',
            inspectionItem:'',
            type:0, //0为新增 1编辑
            isIndeterminate:false,
            checkAll: false,
            standardType:1 //1为任务管理下的巡检标准 ， 2//标准配置下的巡检标准
        }
    },
    components:{

    },
    computed:{

    },
    watch:{

    },
    created(){
        this.standardType = this.$route.name == 'InspectionDeviceTypeDataItem'? 2 : 1
        this.queryDeviceType()
    },
    mounted(){

    },
    methods:{
        /**
         * 获取所有设备类型
         */
        queryDeviceType(){
            system({
                FAction:'QuerySystemDeviceTypeToTree',
                ProjectID:this.standardType == 1?localStorage.getItem('projectid'):0
            })
            .then(data => {
                this.deviceData = data.FObject
            })
            .catch(error => {

            })
        },
        /**
         * 103.查询指定设备类型所有的数据项
         */
        queryDeviceAllItem(id){
            system({
                FAction:'QuerySDataItemsByDeviceTypeID',
                DeviceTypeID:id
            })
            .then(data => {
                this.allItem = data.FObject
            })
            .catch(error => {
                console.log(error);
            })
        },
        /**
         * 100.100.查询巡检设备类型数据项
         */
        querySInspectionDeviceTypeDataItem(id){
            Inspection({
                FAction:this.standardType==1?'QuerySInspectionDeviceTypeDataItem':'QueryUBasisInspectionDeviceTypeDataItem',
                DeviceTypeID:id
            })
            .then(data => {
                this.checkedItems = []
                this.tableData = data.FObject.Table
                this.tableData1 = data.FObject.Table1
                this.tableData.forEach(item => {
                    this.checkedItems.push(item.DataItemID)
                }); 
            })
            .catch(error => {
                console.log(error);
            })
        },
        /**
         * 点击设备时
         */
        handleClick(data){
            if(data.TreeLevel == 2){
                this.device = data
                this.queryDeviceAllItem(data.DeviceTypeID)
                this.querySInspectionDeviceTypeDataItem(data.DeviceTypeID)
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
        changeItems(){
            if(this.checkedItems.length ===0){
                return
            }
            Inspection({
                FAction:this.standardType == 1 ? 'AddSInspectionDeviceTypeDataItem':'AddUBasisInspectionDeviceTypeDataItem',
                DeviceTypeID:this.device.DeviceTypeID,
                DataItemIDs:this.checkedItems.join(',')
            })
            .then(data => {
                this.show = false
                this.querySInspectionDeviceTypeDataItem(this.device.DeviceTypeID)
            })
            .catch(error => {
                console.log(error);
            })
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
            this.itemID = row.ID
        },
        /**
         * 新增或编辑检查项
         */
        addItems(){
            let action = this.standardType == 1?(this.type?'UpdateSInspectionDeviceTypeCheckItem':'AddSInspectionDeviceTypeCheckItem'):'AddOrUpdateUBasisInspectionDeviceTypeCheckItem'
            Inspection({
                FAction:action,
                ID:this.type?this.itemID:0,
                DeviceTypeID:this.device.DeviceTypeID,
                FName:this.inspectionItem.replace(/,/,'，')
            })
            .then(data => {
                this.show1 = false
                this.querySInspectionDeviceTypeDataItem(this.device.DeviceTypeID)
            })
            .catch(error => {

            })
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
            await new Promise(resolve => {
                this.$DeleteMessage([`确定要删除　　${row.DataItemName}`,'删除'])
                .then(() => {
                    resolve()
                })
                .catch(() => {
                })
            })
            Inspection({
                FAction:this.standardType == 1? 'DeleteSInspectionDeviceTypeDataItemByID':'DeleteUBasisInspectionDeviceTypeDataItemByID',
                ID:row.ID
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '删除成功！'
                });
                this.querySInspectionDeviceTypeDataItem(this.device.DeviceTypeID)
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: '删除失败！'
                });
            })
        }
    }
}
</script>
<style lang="scss">
$img-url:'../../static/image/';
.standard.report{
    padding: 30px 20px 27px 20px;
    .import{
        width: 148px;
        padding-left: 30px;
        background: url(#{$img-url}task/import.png)
    }
    .import:hover,.import:active{
        background: url(#{$img-url}task/import-1.png)
    }
    .device-type{
        width:333px;
        height:850px;
        border:2px solid #134FA4;
        border-radius:10px 6px 6px 10px;
        h3{
            margin-top: 42px;
            padding-left:30px;
            text-align: left;
            font-size: 20px;
            color: #18A1EC
        }
        .device-container{
            height: 650px;
            margin-top: 36px;
            .el-tree{
                background: none;
                color: #18A1EC;
                .el-tree-node:focus {
                    >.el-tree-node__content {
                        background:linear-gradient(90deg,rgba(4,28,63,1),rgba(6,46,113,1),rgba(13,58,132,1),rgba(2,35,82,1));
                    }
                }
                &-node__content{
                    height: 66px;
                    line-height: 66px;
                    padding-left: 100px!important;
                    .iconfont{
                        vertical-align: middle;
                        font-size: 24px
                    }
                }
                &-node__content:hover {
                    background:linear-gradient(90deg,rgba(4,28,63,1),rgba(6,46,113,1),rgba(13,58,132,1),rgba(2,35,82,1));
                }
                .el-tree-node__label{
                    font-size: 17px;
                }
                .el-tree-node__expand-icon{
                    font-size: 20px;
                }
            }
            .el-tree.checked {
                color: #a0a0a3;
            }
        }
    }
    .main{
        margin-left: 337px;
        height: 100%;
        &-item-header{
            height: 55px;
            line-height: 55px;
            text-align: left;
            padding-left: 51px;
            background:linear-gradient(90deg,rgba(17,45,69,0.34),rgba(16,52,78,0.34),rgba(15,60,89,0.34),rgba(15,64,94,0.34),rgba(16,71,101,0.34),rgba(15,66,95,0.34),rgba(15,61,87,0.34),rgba(16,50,77,0.34),rgba(18,45,72,0.34));
            border-radius:10px 6px 6px 10px;
            span{
                color: #18A1EC;
                font-size: 16px;
                img{
                    vertical-align: middle;
                    margin-right: 10px;
                }
                margin-right: 30px;
            }
        }
        &-item.standard{
            padding: 0 30px;
            .el-table{
                color: red;
                th{
                    text-align: left!important;
                }
            }
        }
    }
    .el-dialog{
        width: 420px;
        background: url(#{$img-url}task/inspection.png);
        background-size: 100% 100%;
        padding-left: 48px;
        .container{
            padding-left: 20px;
            margin-top: 47px;
            p{
                span{
                    margin-right: 20px;
                }
            }
            .item-content{
                margin-top: 40px;
                >div{
                    margin-top: 14px;
                    .el-checkbox{
                        width: 50%;
                        height: 30px;
                        line-height: 30px;
                        color: #F1F1F2
                    }
                    .el-checkbox+.el-checkbox{
                        margin-left: 0
                    }
                    .el-input{
                        width:270px;
                        height:39px;
                        &__inner{
                            background:rgba(24,64,107,1);
                            border:1px solid rgba(5,103,158,1);
                        }

                    }
                }
            }
        }
        .zw-btn{
            margin-top: 20px;
        }
    }
}

</style>
