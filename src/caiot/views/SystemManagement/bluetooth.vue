<template>
    <div class="report inspection-item meter">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="450px" class="zw-dialog">
            <el-form :model="addInfo" ref="form">
                <el-form-item label="蓝牙名称"  prop='BluetoothName'  :rules="[{ required: true, message: '请输入'}]">
                  <el-input v-model="addInfo.BluetoothName"></el-input>
                </el-form-item>
                <el-form-item label="识别码" prop="BluetoothCode" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.BluetoothCode"></el-input>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" @click="addUpdate()">确定</button>
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
                    prop:'BluetoothName',
                    label:'蓝牙名称'
                },
                {
                    prop: 'BluetoothCode',
                    label: '识别码',
                }
            ],
            type:0,
            projectName:localStorage.getItem('projectname'),
            defaultAddInfo:{//新增或修改签到信息参数默认数据
                ID:0,
                BluetoothName:null,
                BluetoothCode:null,
                BluetoothUUID:null,
                BluetoothMajor:null,
                BluetoothMinor:null,
                BatteryValue:null,
                BindingType:null,
                BindingID:null
            },
            addInfo:{ //新增或修改蓝牙信息
                ID:0,
                BluetoothName:null,
                BluetoothCode:null,
                BluetoothUUID:null,
                BluetoothMajor:null,
                BluetoothMinor:null,
                BatteryValue:null,
                BindingType:null,
                BindingID:null
            },
            title:'新增',
            show:false,
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
    },
    methods:{
        /**
         * 274.分页查询蓝牙信息
         */
        queryData(){
            system({
                FAction:'QueryPageUBluetoothConfig',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then((data) => {
                console.log(data)
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
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.type = 0
            this.addInfo = Object.assign({},this.defaultAddInfo)
        },
        /**
         * 修改蓝牙信息
         */
        updatedProject(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
        },
        /**
         * 275.新增/修改蓝牙信息
         */
        async addUpdate(){
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.show = false
            system({
                FAction:'AddOrUpdateUBluetoothConfig',
                mUBluetoothConfig:this.addInfo
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 268.删除蓝牙信息
         */
        async deleteUMeter(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除蓝牙信息'])
                .then(() => {
                    resove()
                })
                .catch(error => {

                })
            })
            system({
                FAction:'DeleteUBluetoothConfig',
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


</style>
