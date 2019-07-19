<template>
    <div class="report">
        <h3>设备列表</h3>
        <ul class="operation clearfix">
            <li class="l" @click="beforeAdd"><el-button type='primary'><i class="el-icon-plus"></i></el-button></li>
            <li class="l" @click="exportFile"><el-button type='primary'><i class="iconfont icon-Export"></i></el-button></li>
            <li class="r">
                <el-input class="search-input" placeholder="搜索关键字" v-model="filterText">
                    <i class="el-icon-search" slot="suffix"></i>
                </el-input>
            </li>
        </ul>
        <el-dialog :visible.sync="show" class="zw-dialog" width="695px" append-to-body :title="type?'编辑':'新增'">
            <el-form :model="device"  inline ref="form">
                <el-form-item label="设备类型" prop='DeviceTypeID'>
                  <el-select v-model="device.DeviceTypeID"  filterable  placeholder="请选择" >
                    <el-option v-for="item in deviceTypes" :key="item.ID" :value="item.ID" :label="item.DeviceTypeName"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备名称" prop='DeviceName'>
                  <el-input v-model="device.DeviceName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="唯一标识" prop='DeviceCode'>
                  <el-input v-model="device.DeviceCode" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrUpdate()">确 定</el-button>
                <el-button @click="show = false">取 消</el-button>
            </span>
        </el-dialog>                               
        <div class="zw-table">
            <el-table
             :data='tableData'
             :row-class-name="tableRowClassName"
            >
                <el-table-column
                  v-for="item in tableLabel"
                  show-overflow-tooltip
                  :key="item.prop"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  :formatter="item.formatter"
                 >
                </el-table-column>
                <el-table-column
                    label="操作"
                >
                    <template slot-scope="scoped">
                        <div>
                            <span @click="updated(scoped.row)" title="编辑"><i class="iconfont icon-Edit"></i></span>
                            <span @click="deleteDevice(scoped.row)" title="删除"><i class="el-icon-delete"></i></span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination> 
    </div>
</template>
<script>
import table from '@/xiaofang/mixins/table.js'
import {Device} from '@/xiaofang/request/api.js'
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
                    prop: 'DeviceName',
                    label: '设备名称'
                },
                {
                    prop: 'DeviceTypeName',
                    label: '设备类型',
                },
                {
                    prop: 'DeviceCode',
                    label: '唯一标识'
                },
                {
                    prop: 'IsOnline',
                    label: '设备状态',
                    formatter:(row) => row.IsOnline ==0?'离线':'在线'
                },
                {
                    prop: 'FAddress',
                    label: '安装地址',
                    width:'350'
                },
            ],
            defaultDevice:{
                ID:0,
                DoorplateID:0,
                DeviceTypeID:'',
                DeviceCode:null,
                InstallationLocation:'',
                DeviceName:null,
                OtherSourceID:0,
                FState:1,
                FDescribe:'',
                InstallationDate:''
            },
            device:{ //添加设备对象参数
                ID:0,
                DoorplateID:0,
                DeviceTypeID:1,
                DeviceCode:null,
                InstallationLocation:'',
                DeviceName:null,
                OtherSourceID:0,
                FState:1,
                FDescribe:'',
                InstallationDate:''
            },
            deviceTypes:[]
        }
    },
    created(){

    },
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    mounted(){
        this.queryData()
        this.queryDeviceType()
    },
    methods:{
        /**
         * 分页查询设备
         */
        queryData(){
            Device({
                FRouteName:'Device',
                FAction:'QueryPageUDevice',
                SearchKey:this.filterText,
                PageIndex:1,
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
            }).catch((err) => {
                
            });
        },
        /**
         * 查询设备类型
         */
        queryDeviceType(){
            Device({
                FRouteName:'Device',
                FAction:'QueryDeviceType'
            })
            .then((data) => {
                this.deviceTypes = data.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.device = Object.assign({},this.defaultDevice)
            this.type = 0
            this.show = true
        },
        /**
         * 点击编辑
         */
        updated(row) {
            Object.keys(this.device).forEach(key  => {
                this.device[key] = row[key]
            })
            this.type = 1
            this.show = true
        },
        /**
         * 新增或编辑设备
         */
        addOrUpdate(){
            this.show = false
            Device({
                FRouteName:'Device',
                FAction:this.type?'UpdateUDevice':'AddUDevice',
                mUDevice:this.device
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
                
            });
        },
        async deleteDevice(row){
            await this.beforeDelete(row.DeviceName)
            Device({
                FRouteName:'Device',
                FAction:'DeleteUDevice',
                ID:row.ID
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 导出
         */
        exportFile(){
            Device({
                FRouteName:'Device',
                FAction:'QueryExportUDevice',
                SearchKey:this.filterText
            })
            .then((data) => {
                this.downloadFile(data)
            }).catch((err) => {
                
            });
        }
    }
}
</script>
<style lang="scss">

</style>