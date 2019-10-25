<template>
    <div class="report inspection-item">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="700px" class="zw-dialog add-block">
            <el-form :model="addInfo" inline ref="form" label-width="120px">
                <el-form-item label="集团全称" prop="BlocName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.BlocName">
                    </el-input>
                </el-form-item>
                <el-form-item label="集团简称"  prop='ShortName'  :rules="[{ required: true, message: '请选择'}]">
                    <el-input v-model="addInfo.ShortName">
                    </el-input>
                </el-form-item>
                <el-form-item label="行业类型" prop="IndustryID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.IndustryID"  value-key="" filterable  placeholder="请选择" >
                    <el-option v-for="list in industryList" :key="list.ParamID" :label="list.Value" :value="list.ParamID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="集团平台名称" prop="PlatformName">
                    <el-input v-model="addInfo.PlatformName"></el-input>
                </el-form-item>
                <el-form-item label="项目平台名称" prop="ProjectPlatFormName">
                    <el-input v-model="addInfo.ProjectPlatFormName"></el-input>
                </el-form-item>
                <el-form-item label="集团LOGO">
                    <div class="thumb-img" v-if="fileList[0]">
                        <div class="delete">
                            <i class="el-icon-delete" @click="fileList = [] "></i>
                        </div>
                        <img :src="'http://47.106.64.130:56090/'+fileList[0]" alt="">
                    </div>
                    <el-upload
                      v-else
                      action="http://47.106.64.130:56090/Caiot/FileUploadContext"
                      list-type="picture-card"
                      :limit = '1'
                      :on-success="handleSuccess1"
                      :data="{FAction:'UpLoadFile',FVersion:'1.0.0',FTokenID:token,ProjectID:projectId,FName:''}"
                     >
                        <p><i class="el-icon-plus"></i><br><span>上传(160*60)</span></p>
                    </el-upload>                
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" @click="addUpdateUBloc()">确定</button>
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
                 prop=""
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer" @click="updatedProject(scoped.row)">编辑</span>
                        <span class="pointer" @click="deleteUBloc(scoped.row)">删除</span>
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
                    prop:'BlocName',
                    label:'集团全称'
                },
                {
                    prop: 'ShortName',
                    label: '集团简称',
                },
                {
                    prop: 'ParamNameValue',
                    label: '行业类型',
                }
            ],
            projectName:localStorage.getItem('projectname'),
            type:0,
            defaultaddInfo:{//新增项目参数默认数据
                BlocID:0,
                BlocName:null,
                ShortName:null,
                IndustryID:null,
                BlocLogo:"",
                PlatformName:"千仞智服设施管控云平台",
                ProjectPlatFormName:"千仞智服设施管控云平台",
            },
            addInfo:{ //新增或修改项目参数
                BlocID:0,
                BlocName:null,
                ShortName:null,
                IndustryID:null,
                BlocLogo:"",
                PlatformName:"千仞智服设施管控云平台",
                ProjectPlatFormName:"千仞智服设施管控云平台",
            },
            title:'新增',
            show:false,
            industryList:[],
            token:localStorage.getItem("Token"),
            projectId:localStorage.getItem('projectid'),
            fileList:[]
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
        this.queryIndustry()
    },
    methods:{
        /**
         * 288.分页查询集团信息
         */
        queryData(){
            system({
                FAction:'QueryPageUBloc',
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
         * 上传集团LOGO图片
         */
        handleSuccess1(res,file){
            this.fileList.push(res.FObject.FilePath)
        },
        queryIndustry(){
            project({
                FAction:'QuerySSystemParamByParamName',
                ParamName:'行业分类'
            })
            .then(data => {
                this.industryList = data.FObject
            })
            .catch(err => {})
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.type = 0
            this.addInfo = Object.assign({},this.defaultaddInfo)
            this.fileList = []
        },
        /**
         * 修改项目
         */
        updatedProject(row) {
            this.fileList = []
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            if(this.addInfo.AreaTypeID == 0) this.addInfo.AreaTypeID = null
            this.fileList.push(row.BlocLogo)
            this.addInfo.FType = 1
        },
        /**
         * 256.新增/修改集团
         */
        addUpdateUBloc(){
            this.addInfo.BlocLogo = this.fileList[0]
            this.show = false
            system({
                FAction:'AddUpdateUBloc',
                FType:this.type,
                mUBloc:this.addInfo
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 291.删除集团信息
         * 
         */
        async deleteUBloc(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除集团信息'])
                .then(() => {
                    resove()
                })
                .catch(error => {

                })
            })
            system({
                FAction:'DeleteUBloc',
                ID:row.BlocID
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
                FAction:'QueryExporteUBloc',
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
.add-block{
    .el-dialog{
        .thumb-img{
            width: 165px;
            height:128px;
            position: relative;
            border: 1px solid #05679e;
            border-radius: 6px;
            .delete{
                display: none;
                position: absolute;
                width: 100%;
                height: 100%;
                line-height: 128px;
                left: 0;
                top: 0;
                background: rgba($color: #000000, $alpha: 0.3);
                cursor: pointer;
                font-size: 40px;
                text-align: center;
                color: white;
            }
            img{
                width: 100%;
                height: 100%;
            }
        }
        .thumb-img:hover{
            .delete{
                display: block;
            }
        }
        .el-upload--picture-card{
            width:165px;
            height:128px;
            background:rgba(24,64,107,1);
            border:1px solid rgba(5,103,158,1);
            p{
                line-height: 26px;
                display: inline-block;
            }
        }
    }
}
 


</style>
