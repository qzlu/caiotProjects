<template>
    <div class="report inspection-item">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="700px" class="zw-dialog">
            <el-form :model="addInfo" inline ref="form">
                <el-form-item label="项目名称"  prop='DeviceID'  :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.ProjectID"  value-key="ProjectID" filterable  placeholder="请选择" >
                    <el-option v-for="list in projectList" :key="list.ProjectID" :label="list.ShortName" :value="list.ProjectID"></el-option>
                  </el-select>
                  <!-- <el-input readonly :value="projectName"></el-input> -->
                </el-form-item>
                <el-form-item label="网关名称" prop="LDasName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.LDasName">
                    </el-input>
                </el-form-item>
<!--                 <el-form-item label="网关ID" prop="LDasID" :rules="[{ required: true, message: '请输入'}]">
                    <el-input type="number" placeholder="网关ID只能输入数字" v-model="addInfo.LDasID">
                    </el-input>
                </el-form-item> -->
                <el-form-item label="网关位置" prop="Position" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.Position">
                    </el-input>
                </el-form-item>
                <el-form-item label="ICCID" prop="LDasPhoneNumber">
                    <el-input v-model="addInfo.LDasPhoneNumber">
                    </el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="IsEnable" :rules="[{ required: true, message: '请输入'}]">
                    <el-switch v-model="addInfo.IsEnable"></el-switch>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" @click="addOrUpdateULdas()">确定</button>
            </div>
        </el-dialog>    
        <ul class="report-header clearfix">
            <li class="l"><button class="zw-btn zw-btn-add" @click="beforeAdd">新增</button></li>
            <li class="l"><button class="zw-btn zw-btn-export" @click="exportFile">导出</button></li>
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
                 prop="status"
                 label="指令是否下发">
               </el-table-column>
               <el-table-column
                 prop=""
                 width="200"
                 label="配置">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer" @click="createLdasConfig(scoped.row)">生成LDAS</span>
                        <span class="pointer" v-if="scoped.row.ConfigFileAddress !=''&&scoped.row.ConfigFileAddress !=null" @click="sendFile(scoped.row)">下发指令</span>
                        <span style="color:#999;cursor: not-allowed;" v-else>下发指令</span>
                     </div>
                 </template>
               </el-table-column>
               <el-table-column
                 prop=""
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer" @click="updatedProject(scoped.row)">编辑</span>
                        <span class="pointer" @click="deleteULdas(scoped.row)">删除</span>
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
                    prop:'ProjectName',
                    label:'项目名称'
                },
                {
                    prop: 'LDasName',
                    label: '网关名称',
                },
                {
                    prop: 'LDasID',
                    label: '网关ID',
                },
                {
                    prop: 'LDasPhoneNumber',
                    label: 'ICCID',
                },
                {
                    prop: 'Position',
                    label: '网关位置',
                },
                {
                    prop: 'IsEnableName',
                    label: '是否启用',
                },
            ],
            type:0,
            projectName:localStorage.getItem('projectname'),
            defaultAddInfo:{//新增项目参数默认数据
                ProjectID:parseInt(localStorage.getItem('projectid')),
                LDasID:0,
                IsEnable:true,
                LDasName:null,
                Position:null,
                OldLDasID:0,
                LDasPhoneNumber:null
            },
            addInfo:{ //新增或修改项目参数
                ProjectID:null,
                LDasID:0,
                IsEnable:true,
                LDasName:null,
                Position:null,
                OldLDasID:0,
                LDasPhoneNumber:null
            },
            title:'新增',
            show:false,
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
    },
    methods:{
        /**
         * 269.分页查询网关列表
         */
        queryData(){
            project({
                FAction:'QueryPageULdas',
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
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.type = 0
            this.addInfo = Object.assign({},this.defaultAddInfo)
        },
        /**
         * 修改网关
         */
        updatedProject(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            this.addInfo.OldLDasID = this.addInfo.LDasID
        },
        /**
         * 265.新增/修改网关
         */
        addOrUpdateULdas(){
            this.show = false
            project({
                FAction:'AddOrUpdateULdas',
                mULdas:this.addInfo
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 268.删除网关
         */
        async deleteULdas(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除网关信息'])
                .then(() => {
                    resove()
                })
                .catch(error => {
                })
            })
            project({
                FAction:'DeleteULdas',
                ID:row.LDasID
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {})
        },
        /**
         * 308.创建Ldas配置文件
         */
        createLdasConfig(row){
            project({
                FAction:'CreateLdasConfig',
                ID:row.LDasID
            },false)
            .then(data => {
                this.$message({
                  type: 'success',
                  message: 'LDAS生成成功'
                });
                this.queryData()
            })
            .catch(err => {
                this.$message({
                    type: 'error',
                    message:err
                })
            })
        },
        /**
         * 309.发送文件命令
         */
        sendFile(row){
            this.$set(row,'status','下发中。。。')
            project({
                FAction:'SendFile',
                ID:row.LDasID,
                ConfigFileAddress:row.ConfigFileAddress
            })
            .then(data => {
                this.$set(row,'status','成功')
            })
            .catch(err => {
                this.$set(row,'status','失败')
            })
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
