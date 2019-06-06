<template>
    <div class="report">
        <el-dialog  :title="type?'编辑':'新增'" :visible.sync="show" append-to-body width="695px" class="zw-dialog">
            <el-form :model='addData' ref='form' inline>
                <el-form-item label="角色全称" prop="FName" >
                    <el-input v-model="addData.FName"></el-input>
                </el-form-item>
                <el-form-item label="角色简称" prop="FSimpleName" >
                    <el-input v-model="addData.FSimpleName"></el-input>
                </el-form-item>
                <el-form-item label="角色类型" prop="FType" >
                    <el-select v-model="addData.FType"   placeholder="请选择角色类型">
                      <el-option  label="户主" :value="1"></el-option>
                      <el-option  label="物业" :value="2"></el-option>
                      <el-option  label="中物" :value="3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrUpdate()">确 定</el-button>
                <el-button @click="show = false">取 消</el-button>
            </span>
        </el-dialog>
        <ul class="operation clearfix">
            <li class="l" @click="beforeAdd"><el-button type='primary'><i class="el-icon-plus"></i></el-button></li>
            <li class="l" ><el-button type='primary'><i class="iconfont icon-Export"></i></el-button></li>
            <li class="r">
                <el-input class="search-input" placeholder="搜索关键字" v-model="filterText">
                    <i class="el-icon-search" slot="suffix"></i>
                </el-input>
            </li>
        </ul>       
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
                  :width="item.width"
                  :formatter="item.formatter"
                 >
                </el-table-column>
                <el-table-column
                    label="操作"
                >
                    <template slot-scope="scoped">
                        <div>
                            <span @click="update(scoped.row)" title="编辑"><i class="el-icon-document"></i></span>
                            <span @click="deleteUser(scoped.row)"><i class="el-icon-delete"></i></span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination> 
    </div>
</template>
<script>
import table from '@/xiaoFangCloud/mixins/table.js'
import {System} from '@/xiaoFangCloud/request/api.js';
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
                    prop: 'FName',
                    label: '角色名称'
                },
                {
                    prop: 'FSimpleName',
                    label: '角色简称'
                },
                {
                    prop: 'CreatorBy',
                    label: '创建人'
                },
                {
                    prop: 'FLastUpdateTime',
                    label: '最后修改时间'
                }
            ],
            //新增角色默认数据
            defaultData:{
                FGUID:"00000000-0000-0000-0000-000000000000",
                FName:'',
                FSimpleName:'',
                FType:''
            },
            //新增角色数据
            addData:{
                FGUID:"00000000-0000-0000-0000-000000000000",
                FName:'',
                FSimpleName:'',
                FType:''
            },
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
         * 分页查询角色
         */
        queryData(){
            System({
                FRouteName:'System',
                FAction:'QueryPageTRole',
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
            }).catch((err) => {
                
            });
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.type = 0
            this.show = true,
            this.addData = Object.assign({},this.defaultData)
        },
        /**
         * 编辑角色
         */
        update(item){
            this.show = true
            this.type = 1
            for(let key in this.addData){
                this.addData[key] = item [key]?item [key]:''
            }
        },
        /**
         * 新增或修改角色
         */
        addOrUpdate(){
            this.show = false
            System({
                FRouteName:'System',
                FAction:'AddOrUodateTRole',
                FType:this.addData.FType,
                TypeId:this.type,
                FName:this.addData.FName,
                FSimpleName:this.addData.FSimpleName,
                FGUID:this.addData.FGUID
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 删除用户
         */
        async deleteUser(row){
            await this.beforeDelete()
            System({
                FRouteName:'System',
                FAction:'DleteTRole',
                FGuid:row.FGUID
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
                
            });
        }
    }
}
</script>
<style lang="scss">
</style>