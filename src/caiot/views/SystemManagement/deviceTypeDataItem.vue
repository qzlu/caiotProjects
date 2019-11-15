<template>
    <div class="report inspection-item system-type">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" :close-on-click-modal='false' width="700px" class="zw-dialog">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="设备类型" prop="DeviceTypeID" :rules="[{ required: true, message: '请选择'}]">
                    <el-select v-model="addInfo.DeviceTypeID" rules="[{ required: true, message: '请选择'}]">
                        <el-option v-for="(item,i) in deviceTypeList" :key="i" :label="item.DeviceTypeName" :value="item.DeviceTypeID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据标识" prop="DataItemID" :rules="[{ required: true, message: '请选择'}]">
                   <el-select v-model="dataItem" value-key="DataItemID" @change="addInfo.DataItemID = dataItem.DataItemID">
                       <el-option v-for="(item,i) in dataItemList" :key="i" :label="item.DataItemName" :value="item"></el-option>
                   </el-select>
                </el-form-item>
                <el-form-item label="数据组名称" prop="DataGroupText">
                    <el-input  v-model="addInfo.DataGroupText"></el-input>
                </el-form-item>
                <el-form-item label="状态1" prop="ZeroShowText">
                    <el-input v-model="addInfo.ZeroShowText"></el-input>
                </el-form-item>
                <el-form-item label="状态2" prop="OneShowText">
                    <el-input  v-model="addInfo.OneShowText"></el-input>
                </el-form-item>
                <el-form-item label="展示位置" prop="ShowPosition">
                    <el-input  v-model="addInfo.ShowPosition"></el-input>
                </el-form-item>
                <el-form-item label="是否检查" prop="IsInspection">
                    <el-select v-model="addInfo.IsInspection">
                        <el-option  label="是" :value="true"></el-option>
                        <el-option  label="否" :value="false"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" @click="addOrUpdate()">确定</button>
            </div>
        </el-dialog>    
        <ul class="report-header clearfix">
            <li class="l"><button class="zw-btn zw-btn-add" @click="beforeAdd">新增</button></li>
            <!-- <li class="l"><button class="zw-btn zw-btn-export" @click="exportFile">导出</button></li> -->
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
                        <span class="pointer" @click="deleteItem(scoped.row)">删除</span>
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
                    prop:'DeviceTypeName',
                    label:'设备类型'
                },
                {
                    prop: 'DataItemName',
                    label: '数据标识',
                },
                {
                    prop: 'DataGroupText',
                    label: '数据组名称',
                },
                {
                    prop: 'ZeroShowText',
                    label: '状态1',
                },
                {
                    prop: 'OneShowText',
                    label: '状态2',
                },
                {
                    prop: 'ShowPosition',
                    label: '展示位置',
                },
                {
                    prop: 'IsInspection',
                    label: '是否检查',
                    formatter:row => row.IsInspection?'是':'否'
                }
            ],
            type:0,
            defaultAddInfo:null,
            addInfo:{ //新增或修改项目参数
                ID:'',
                DeviceTypeID:'',
                DataItemID:'',
                DataItemName:null,
                OneShowText:null,
                ZeroShowText:null,
                DataGroupText:null,
                ShowPosition:0,
                IsInspection:null
            },
            title:'新增',
            show:false,
            deviceTypeList:[],
            dataItemList:[],
            dataItem:null
    
        }
    },
    computed:{
    },
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    created(){
        this.defaultAddInfo = JSON.parse(JSON.stringify(this.addInfo))
        this.queryData()
        this.queryDeviceType()
        this.querySDataItemList()
    },
    methods:{
        /**
         * 334.标准配置-分页查询数据标识
         */
        queryData(){
            system({
                FAction:'QueryPageSDeviceTypeDataItem',
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
         * 241.获取设备类型
         */
        queryDeviceType(){
            system({
                FAction:'QueryDeviceType',
            })
            .then((result) => {
                this.deviceTypeList = result.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 67.获取所有数据标识
         */
        querySDataItemList(){
            system({
                FAction:'QuerySDataItemList'
            })
            .then((result) => {
                this.dataItemList = result.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.type = 0
            this.addInfo = Object.assign({},this.defaultAddInfo)
            this.dataItem = null
        },
        /**
         * 编辑
         */
        updatedProject(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            this.dataItem = {
                DataItemID:row.DataItemID,
                DataItemName:row.DataItemName
            }
        },
        /**
         * 335.标准配置-新增/修改数据标识
         */
        async addOrUpdate(){
            this.addInfo.DataItemID = this.dataItem.DataItemID
            this.addInfo.DataItemName = this.dataItem.DataItemName
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.show = false
            system({
                FAction:'AddOrUpdateSDeviceTypeDataItem',
                FType:this.type,
                sDeviceTypeDataItem:this.addInfo
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '配置成功！'
                });
                this.queryData()
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 336.标准配置-删除数据标识
         */
        async deleteItem(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除数据标识'])
                .then(() => {
                    resove()
                })
                .catch(error => {
                })
            })
            system({
                FAction:'DeleteSDeviceTypeDataItem',
                ID:row.ID
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
            project({
                FAction:'QueryExportULdas',
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
