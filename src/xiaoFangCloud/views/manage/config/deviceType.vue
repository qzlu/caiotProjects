<template>
    <div class="report"> 
        <el-dialog :title="type?'编辑':'新增'" append-to-body :visible.sync="show" width="720px" class="zw-dialog device-type">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="设备类型名称" prop="DeviceTypeName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.DeviceTypeName">
                    </el-input>
                </el-form-item>
                <el-form-item label="系统类型" prop="DeviceItemID" :rules="[{ required: true, message: '请输入'}]">
                    <el-select v-model="addInfo.DeviceItemID" filterable  placeholder="请选择">
                      <el-option v-for="item in systemList" :key="item.ParamID" :label="item.Value" :value="item.ParamID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="能源类型" prop="EnergyTypeID" :rules="[{ required: true, message: '请输入'}]">
                  <el-select v-model="addInfo.EnergyTypeID" filterable  placeholder="请选择">
                    <el-option v-for="item in energyTypeList" :key="item.ID" :label="item.EnergyTypeName" :value="item.ID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否物联设备" prop="IsIOTDeviceType">
                    <el-select v-model="addInfo.IsIOTDeviceType">   
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图标" prop="IconName">
                  <el-select v-model="addInfo.IconName" filterable placeholder="请选择">
                    <el-option v-for="(item,i) in iconList"  :key="i" :value="item.name">
                        <i :class="['iconfont',item.name]" style="font-size:24px;"></i>
                        <span>{{item.name}}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div class="submit" slot="footer">
                <el-button  @click="addOrUpdate()">确定</el-button>
                <el-button @click="show = false">取消</el-button>
            </div>
        </el-dialog>    
        <ul class="operation clearfix">
            <li class="l"><el-button  @click="beforeAdd"><i class="el-icon-plus"></i>新增</el-button></li>
            <li class="l"><el-button  @click="exportFile"><i class="iconfont icon-Export"></i>导出</el-button></li>
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
                 label="图标">
                 <template slot-scope="scoped">
                     <div>
                         <i :class="['iconfont',scoped.row.IconName]"></i>
                     </div>
                 </template>
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
import table from '@/xiaoFangCloud/mixins/table' //表格混入数据
import {System} from '@/xiaoFangCloud/request/api.js';
import iconJson from '@/assets/css-font/iconfont.json'
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowIndex',
                    label: '序号',
                    width:80
                },
                {
                    prop:'DeviceTypeID',
                    label:'设备类型ID'
                },
                {
                    prop: 'DeviceTypeName',
                    label: '设备类型名称',
                },
                {
                    prop: 'SystemParamName',
                    label: '所属系统类型',
                },
                {
                    prop: 'EnergyTypeName',
                    label: '所属能源类型',
                },
                {
                    prop: 'IsIOTDeviceType',
                    label: '是否物联设备',
                    formatter:row => row.IsIOTDeviceType?'是':'否'
                }
            ],
            type:0,
            defaultAddInfo:{//新增项目参数默认数据
                DeviceTypeID:0,
                ParentID:0,
                DeviceTypeName:null,
                DeviceItemID:null,
                IconName:'',
                EnergyTypeID:null,
                IsIOTDeviceType:1
            },
            addInfo:{ //新增或修改项目参数
                DeviceTypeID:0,
                ParentID:0,
                DeviceTypeName:null,
                DeviceItemID:null,
                IconName:'',
                EnergyTypeID:null,
                IsIOTDeviceType:1
            },
            title:'新增',
            show:false,
            systemList:[],
            energyTypeList:[],
            iconList:[]
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
        this.queryData()
        this.querySEnergyType()
        this.queryPageSSystemParam()
        this.iconList = iconJson.map(item => JSON.parse(item))
    },
    methods:{
        /**
         * 269.分页查询系统分类
         */
        queryData(){
            System({
                FAction:'QueryPageSDeviceType',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then((data) => {
                this.total = data.FObject.FTotalCount || 0
                this.tableData = data.FObject.Data || []
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
         * 查询能耗类型
         */
        querySEnergyType(){
            System({
                FAction:'QuerySEnergyType',
            })
            .then(data => {
                this.energyTypeList = data.FObject
            })
            .catch(error => {

            })
        },
        /**
         * 查询系统类型
         */
        queryPageSSystemParam(){
            System({
                FAction:'GetSystemParam',
                FName:'系统分类'
            })
            .then((data) => {
                this.systemList = data.FObject || []
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
        },
        /**
         * 修改系统分类
         */
        updatedProject(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
        },
        /**
         * 265.新增/修改系统分类
         */
        async addOrUpdate(){
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.show = false
            System({
                FAction:'AddOrUpdateSDeviceType',
                sDeviceType:this.addInfo
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
         * 268.删除设备类型
         */
        async deleteItem(row){
            await this.beforeDelete()
            System({
                FAction:'DeleteSDeviceType',
                ID:row.DeviceTypeID
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
            System({
                FAction:'ExportSDeviceType',
                SearchKey:this.filterText,
            })
            .then(data => {
                this.downloadFile(data)
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
.device-type.zw-dialog {
    .el-form-item {
        .el-form-item__label{
            width: 120px
        }
    }
    
}
</style>
