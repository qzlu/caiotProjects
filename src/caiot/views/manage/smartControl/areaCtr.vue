<template>
    <div class="report inspection-item system-type">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="400px" class="zw-dialog">
            <el-form :model="addInfo"  ref="form">
                <el-form-item label="区域名称" prop="AreaID" :rules="[{ required: true, message: '请输入'}]">
                  <el-select v-model="addInfo.AreaID" filterable placeholder="请选择">
                    <el-option v-for="item in areaList" :key="item.AreaID" :label="item.AreaName"  :value="item.AreaID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="控制指令" prop="GroupID">
                  <el-select v-model="addInfo.GroupID" filterable placeholder="请选择">
                    <el-option v-for="item in groupCmdList" :key="item.GroupID" :label="item.GroupName"  :value="item.GroupID"></el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" v-submit="addOrUpdate">确定</button>
            </div>
        </el-dialog>    
        <ul class="report-header clearfix">
            <li class="l"><button class="zw-btn zw-btn-add" @click="beforeAdd">新增</button></li>
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
<!--                <el-table-column label="控制明细">
                   <template v-slot={row}> 
                       <div>
                           查看
                       </div>
                   </template>
               </el-table-column> -->
               <el-table-column
                 prop=""
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer" @click="updatedRow(scoped.row)">编辑</span>
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
import {Control,system} from '@/caiot/request/api.js';
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
                    prop: 'ProjectName',
                    label:'项目名称'
                },
                {
                    prop:'AreaName',
                    label:'区域名称'
                },
                {
                    prop: 'GroupName',
                    label: '群控指令全称',
                },
                {
                    prop: 'GroupShortName',
                    label: '群控指令简称',
                },
            ],
            type:0,
            defaultAddInfo:{//新增参数默认数据
            },
            addInfo:{ //新增或修改
                AreaControlID:0,
                AreaID:null,
                GroupID:null,
            },
            title:'新增',
            show:false,
            areaList:[], //所有区域
            groupCmdList:[] //所有群控指令
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
        this.queryAreaList()
        this.queryAllGroupCmd()
    },
    methods:{
        /**
         * 5.管理后台—查询分页区域控制
         */
        queryData(){
            Control({
                FAction:'QueryPageUAreaControl',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            },true)
            .then((data) => {
                this.total = data.FObject.Table ? data.FObject.Table[0].FTotalCount : 0
                this.tableData = data.FObject.Table1 || []
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
        queryAreaList(){
            system({
                FAction:'QueryPageUArea',
                SearchKey:'',
                PageIndex:1,
                PageSize:1000
            })
            .then((data) => {
                this.areaList = data.FObject.Table1 || []
            })
            .catch((err) => {
                
            });
        },
        /**
         * 查询所有群控指令
         */
        queryAllGroupCmd(){
            Control({
                FAction:'QueryPageUGroup',
                PageIndex:1,
                PageSize:1000,
                SearchKey:''
            })
            .then((result) => {
                this.groupCmdList = result.FObject.Table1||[]
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
         * 修改告
         */
        updatedRow(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
        },
        /**
         * 新增/修改
         */
        async addOrUpdate(){
            this.show = false
            Control({
                FAction:'AddUpdateUAreaControl',
                mUAreaControl:this.addInfo
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
         * 268.删除区域控制
         */
        async deleteItem(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除区域控制'])
                .then(() => {
                    resove()
                })
                .catch(error => {
                })
            })
            Control({
                FAction:'DeleteUAreaControl',
                ID:row.AreaControlID
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {})
        }
    }
}
</script>
<style lang="scss">
</style>
