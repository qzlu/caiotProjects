<template>
    <div class="report inspection-item">
        <el-dialog :title="this.areaInfo.FType?'编辑':'新增'" :visible.sync="show" width="700px" class="zw-dialog">
            <el-form :model="areaInfo" inline ref="form">
                <el-form-item label="项目名称" >
<!--                   <el-select v-model="areaInfo.ProjectID"  value-key="ProjectID" filterable  placeholder="请选择" >
                    <el-option v-for="list in projectList" :key="list.ProjectID" :label="list.ShortName" :value="list.ProjectID"></el-option>
                  </el-select> -->
                  <el-input readonly :value="projectName"></el-input>
                </el-form-item>
                <el-form-item label="区域名称" prop="AreaName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="areaInfo.AreaName">
                    </el-input>
                </el-form-item>
<!--                 <el-form-item label="区域类型"  prop='AreaTypeID'>
                  <el-select v-model="areaInfo.AreaTypeID"  value-key="DeviceID" filterable  placeholder="请选择" >
                    <el-option v-for="list in areaTypeList" :key="list.AreaTypeID" :label="list.AreaTypeName" :value="list.AreaTypeID"></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="区域位置" prop="Location" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="areaInfo.Location">
                    </el-input>
                </el-form-item>
                <el-form-item label="关联蓝牙" prop="BluetoothConfigID">
                    <el-select v-model="areaInfo.BluetoothConfigID">
                        <el-option v-for="(list,i) in blueTooth" :key="i" :label="list.BluetoothName" :value="list.ID"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" v-submit="addUpdateUArea">确定</button>
            </div>
        </el-dialog>    
        <ul class="report-header clearfix">
            <li class="l"><button class="zw-btn zw-btn-add" @click="beforeAdd">新增</button></li>
            <li class="l"><button class="zw-btn zw-btn-export" @click="exportFile">导出</button></li>
            <li class="l"><button class="zw-btn" style="width:120px;padding:0 10px" @click="exportUAreaQrCode"><i class="iconfont icon-QRcode" style="color:#3593ed"></i>导出二维码</button></li>
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
<!--                <el-table-column
                label="二维码"
               >
                 <template slot-scope="scoped">
                     <div>
                         <img :src="`http://www.szqianren.com/${scoped.row.AreaQrCode}`" style="height:50px;width:60px;vertical-align: middle;" alt="">
                     </div>
                 </template>
               </el-table-column> -->
               <el-table-column
                 prop=""
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer" @click="updatedProject(scoped.row)">编辑</span>
                        <span class="pointer" @click="deleteUArea(scoped.row)">删除</span>
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
                    prop:'ShortName',
                    label:'项目名称'
                },
                {
                    prop: 'AreaName',
                    label: '区域名称',
                },
                {
                    prop: 'Location',
                    label: '区域位置',
                },
                {
                    prop:"BluetoothName",
                    label:'蓝牙名称'
                }
            ],
            projectName:localStorage.getItem('projectname'),
            defaultAreaInfo:{//新增项目参数默认数据
                AreaID:null,
                AreaName:null,
                Location:null,
                AreaTypeID:null,
                FType:0,
                BluetoothConfigID:null
            },
            areaInfo:{ //新增或修改项目参数
                AreaID:null,
                AreaName:null,
                Location:null,
                AreaTypeID:null,
                FType:0,
                BluetoothConfigID:null
            },
            title:'新增',
            show:false,
            areaTypeList:[],
            blueTooth:[],//蓝牙列表
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
        this.queryUArea()
        this.queryBluetooth()
    },
    methods:{
        /**
         * 263.分页查询区域
         */
        queryData(){
            system({
                FAction:'QueryPageUArea',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            },true)
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
         * 270.查询区域类型信息
         */
        queryUArea(){
            system({
                FAction:'QuerySAreaType'
            })
            .then(data => {
                this.areaTypeList = data.FObject
            })
            .catch(err =>{})
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
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.areaInfo = Object.assign({},this.defaultAreaInfo)
        },
        /**
         * 修改项目
         */
        updatedProject(row) {
            this.show = true
            Object.keys(this.areaInfo).forEach(key => {
                this.areaInfo[key] = row[key]
            })
            if(this.areaInfo.AreaTypeID == 0) this.areaInfo.AreaTypeID = null
            this.areaInfo.FType = 1
        },
        /**
         * 256.新增/修改区域
         */
        async addUpdateUArea(){
            this.show = false
            if(this.areaInfo.AreaTypeID ==null){
                this.areaInfo.AreaTypeID = 0
            }
            system({
                FAction:'AddUpdateUArea',
                mUArea:this.areaInfo
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 264.删除区域
         */
        async deleteUArea(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除区域信息'])
                .then(() => {
                    resove()
                })
                .catch(error => {

                })
            })
            system({
                FAction:'DeleteUArea',
                ID:row.AreaID
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
                FAction:'ExportUArea',
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
         * 254.导出区域二维码
         */
        exportUAreaQrCode(){
            system({
                FAction:'ExportUAreaQrCode'
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
        }
    }
}
</script>
<style lang="scss">


</style>
