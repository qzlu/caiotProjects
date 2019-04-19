<template>
    <div class="report">
        <h3>设备列表</h3>
        <ul class="operation clearfix">
            <li class="l" @click="beforeAdd"><el-button type='primary'><i class="el-icon-plus"></i></el-button></li>
            <li class="l" ><el-button type='primary'><i class="iconfont icon-Export"></i></el-button></li>
            <li class="r">
                <el-input class="search-input" placeholder="搜索关键字" v-model="filterText">
                    <i class="el-icon-search" slot="suffix"></i>
                </el-input>
            </li>
        </ul>
        <el-dialog :visible.sync="show" class="zw-dialog" width="695px" append-to-body :title="type?'编辑':'新增'">
            <el-form :model="addData"  inline ref="form">
                <el-form-item label="项目全称" prop='ProjectName'>
                  <el-input v-model="addData.ProjectName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目简称" prop='ShortName'>
                    <el-input v-model="addData.ShortName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="建筑面积" prop='BuildArea'>
                  <el-input class="unit" type="number" v-model="addData.BuildArea" autocomplete="off">
                     <span slot="suffix">m²</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="地区" prop='County'>
                  <el-select v-model="addData.County"  filterable  placeholder="请选择" >
                    <!-- <el-option v-for="list in typeList" :key="list.DeviceTypeID" :label="list.name" :value="list.DeviceTypeID"></el-option> -->
                  </el-select>
                </el-form-item>
                <el-form-item label="地址" prop='Address'>
                    <el-input v-model="addData.Address" class="block"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrUpdate()">确 定</el-button>
                <el-button @click="show = false">取 消</el-button>
            </span>
        </el-dialog>                               
        <div>
            <div class="table-header"></div>
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
                 >
                </el-table-column>
                <el-table-column
                    label="操作"
                >
                    <template slot-scope="scoped">
                        <div>
                            <span @click="updated(scoped.row)" title="编辑"><i class="el-icon-document"></i></span>
                            <span @click="deleteProject(scoped.row)" title="删除"><i class="el-icon-delete"></i></span>
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
                    prop: 'ProjectName',
                    label: '项目名称'
                },
                {
                    prop: 'ShortName',
                    label: '项目简称'
                },
                {
                    prop: 'BuildArea',
                    label: '建筑面积（m²）'
                },
                {
                    prop: 'County',
                    label: '地区'
                },
                {
                    prop: 'Address',
                    label: '地址'
                },
                {
                    prop: 'FContacts',
                    label: '创建人'
                },
            ],
            defaultAddData:{
                ID:0,
                ProjectName:'',
                ShortName:'',
                Address:'',
                BuildArea:'',
                Province:'',
                City:'',
                County:'',
                FState:1,
                FDescribe:'',
            },
            addData:{ //添加设备对象参数
                ID:0,
                ProjectName:'',
                ShortName:'',
                Address:'',
                BuildArea:'',
                Province:'',
                City:'',
                County:'',
                FState:1,
                FDescribe:'',
            },
            typeList:[{name:'烟感',addDataTypeID:1}]
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
    },
    methods:{
        /**
         * 分页查询设备
         */
        queryData(){
            this.socket({
                FRouteName:'Project',
                FAction:'QueryPageUProjectByFUserGUID',
                SearchKey:this.filterText,
                PageIndex:1,
                PageSize:10
            },this.handleData)
        },
        handleData(data){
            console.log(data);
            this.total = data.FObject.Table ? data.FObject.Table[0].FTotalCount : 0
            this.tableData = data.FObject.Table1 ? data.FObject.Table1 : []
            /**
             * 删除操作时，当前页面无数据时跳到上一页
             */
            if(this.tableData.length === 0&&this.pageIndex > 1){
                --this.pageIndex
                this.queryData()
            }
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.addData = Object.assign({},this.defaultAddData)
            this.type = 0
            this.show = true
        },
        /**
         * 点击编辑
         */
        updated(row) {
            Object.keys(this.addData).forEach(key  => {
                this.addData[key] = row[key]
            })
            this.type = 1
            this.show = true
        },
        /**
         * 新增,修改或删除之后调用
         */
        afterAddOrUpdate(data){
            console.log(data)
            if(data.Result == 200){
                this.queryData()
            }
        },
        /**
         * 新增或编辑项目
         */
        addOrUpdate(){
            this.show = false
            this.socket({
                FRouteName:'Project',
                FAction:'AddOrUpdateUProject',
                ID:0,
                mUProject:this.addData
            },this.afterAddOrUpdate)
        },
        async deleteProject(row){
            await new Promise((resolve,reject) => {
                this.$confirm(`此操作将删除${row.ShortName}, 是否继续?`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    resolve()
                }).catch(() => {
                    reject()
                });
            })
            this.socket({
                FRouteName:'Project',
                FAction:'DeleteUProjectByID',
                ID:row.ID
            },this.afterAddOrUpdate)
        }
    }
}
</script>
<style lang="scss">

</style>