<template>
    <div class="report inspection-item">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="700px" class="zw-dialog">
            <el-form :model="addProject" inline ref="form">
                <el-form-item label="集团简称"  prop='BlocID'  :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addProject.BlocID"  value-key="DeviceID" filterable  placeholder="请选择" >
                    <el-option v-for="list in blocList" :key="list.BlocID" :label="list.ShortName" :value="list.BlocID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="项目名称" prop="ProjectName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addProject.ProjectName">
                    </el-input>
                </el-form-item>
                <el-form-item label="项目简称" prop="ShortName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addProject.ShortName">
                    </el-input>
                </el-form-item>
                <el-form-item label="建筑面积" prop="BuildArea" :rules="[{ required: true, message: '请输入'}]">
                    <el-input type="number" v-model="addProject.BuildArea">
                        <i slot="suffix" class="unit">m²</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="城市" prop="CityID" filterable :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addProject.CityID" filterable  placeholder="请选择">
                    <el-option v-for="city in cityList" :key="city.CityID" :label="city.CityName" :value="city.CityID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="建筑类型" prop="BuildTypeID" filterable :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addProject.BuildTypeID" filterable  value-key="ParamID"  placeholder="请选择">
                    <el-option v-for="item in buildTypeList" :key="item.ParamID" :value="item.ParamID" :label="item.Value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="地址" prop="Address" :rules="[{ required: true, message: '请输入'}]">
                    <el-input class="block"  v-model="addProject.Address"></el-input>
                </el-form-item>
                <el-form-item label="所属系统" filterable prop="SystemType" :rules="[{ required: true, message: '请选择'}]">
                  <el-select class="block" v-model="systemType" filterable multiple  value-key="ParamID"  placeholder="请选择">
                    <el-option v-for="system in systemList" :key="system.ParamID" :value="system.ParamID" :label="system.ParamValue">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="第三方ID" prop="OtherSourceID" :rules="[{ required: true, message: '请输入'}]">
                    <el-input  v-model="addProject.OtherSourceID"></el-input>
                </el-form-item>
                <el-form-item label="上线时间" prop="OnlineDateTime" :rules="[{ required: true, message: '请选择'}]">
                    <el-date-picker
                        type="date"
                        v-model="addProject.OnlineDateTime"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="项目描述" prop="Detail">
                    <el-input class="block" type="textarea "  v-model="addProject.Detail"></el-input>
                </el-form-item>
                <el-form-item label="项目宣传图">
                    <div class="image" v-if="addProject.FigureImg">
                        <img :src="`http://47.106.64.130:56090/${addProject.FigureImg}`" alt="">
                        <i class="el-icon-delete" @click="addProject.FigureImg = ''"></i>
                    </div>
                    <el-upload
                      v-else
                      action="http://47.106.64.130:56090/Caiot/FileUploadContext"
                      list-type="picture-card"
                      :limit = '1'
                      :on-success="handleSuccess"
                      :data="{FAction:'UpLoadFile',FVersion:'1.0.0',FTokenID:token,ProjectID:projectId,FName:''}"
                     >
                        <p><i class="el-icon-plus"></i><br><span>上传</span></p>
                    </el-upload>                
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" :disabled="isDisabled" @click="addOrUpdateUProject()">确定</button>
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
                        <span class="pointer" @click="deleteUProject(scoped.row)">删除</span>
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
                    label:'集团名称'
                },
                {
                    prop: 'ProjectName',
                    label: '项目名称',
                },
                {
                    prop: 'ShortName',
                    label: '项目简称'
                },
                {
                    prop: 'BuildArea',
                    label: '建筑面积（m²）',
                    width:150
                },
                {
                    prop: 'CityName',
                    label: '城市',
                    width:100
                },
                {
                    prop: 'Address',
                    label: '地址',
                },
                {
                    prop:'SystemTypeName',
                    label:'所属系统',
                }
            ],
            type:0,
            defaultProject:{//新增项目参数默认数据
                ProjectName:null,
                ShortName:null,
                BlocID:null,
                CityID:null,
                Address:null,
                BuildArea:null,
                BuildTypeID:null,
                OtherSourceID:0,
                SystemType:null,
                OnlineDateTime:null,
                ProjectID:0,
                FigureImg:'',
                Detail:''
            },
            addProject:{ //新增或修改项目参数
                ProjectName:null,
                ShortName:null,
                BlocID:null,
                CityID:null,
                Address:null,
                BuildArea:null,
                BuildTypeID:null,
                OtherSourceID:0,
                SystemType:null,
                OnlineDateTime:null,
                ProjectID:0,
                FigureImg:'',
                Detail:''
            },
            device:{},//所选设备
            title:'新增',
            show:false,
            blocList:[],
            cityList:[],
            systemList:[],
            systemType:[],
            buildTypeList:[],
            token:localStorage.getItem("Token"),
            projectId:localStorage.getItem('projectid'),
        }
    },
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    created(){
        this.queryData()
        this.QueryUBlocList()
        this.querySCityList()
        this.querySystemType()
        this.queryBuildType()
    },
    mounted() {
    },
    methods:{
        /**
         * 262.分页查询项目信息
         */
        queryData(){
            project({
                FAction:'QueryPageUProject',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            },undefined,true)
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
         * 258.获取集团信息列表
         */
        QueryUBlocList(){
            project({
                FAction:'QueryUBlocList',
            })
            .then((data) => {
                this.blocList = data.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 259.获取城市列表
         */
        querySCityList(){
            project({
                FAction:'QuerySCityList'
            })
            .then((data) => {
                this.cityList = data.FObject
            })
            .catch((err) => {
                
            });
        },
        /**
         * 64.获取设备分类(系统类别)
         */
        querySystemType(){
            system({
                FAction:'SSystemParam'
            })
            .then(data => {
                this.systemList = data.FObject
            })
            .catch(err => {

            })
        },
        /***
         * 获取建筑类型
         */
        queryBuildType(){
            project({
                FAction:'QuerySSystemParamByParamName',
                ParamName:'建筑类型'
            })
            .then(data => {
                this.buildTypeList = data.FObject
            })
        },
        /**
         * 选择设备
         */
        selectDevice(){
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.type = 0
            this.systemType = []
            this.addProject = Object.assign({},this.defaultProject)
        },
        /**
         * 修改项目
         */
        updatedProject(row) {
            this.show = true
            this.type = 1
            this.systemType = row.SystemType.split(',').map(item => parseInt(item))
            Object.keys(this.addProject).forEach(key => {
                this.addProject[key] = row[key]
            })
        },
            /**
         * 上传设备图片
         */
        handleSuccess(res,file){
            this.addProject.FigureImg = res.FObject.FilePath
        },
        /**
         * 256.新增/修改项目
         */
        async addOrUpdateUProject(){
            this.addProject.SystemType = this.systemType.join(',')
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.isDisabled = true
            this.show = false
            project({
                FAction:'AddOrUpdateUProject',
                mUProject:this.addProject
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.isDisabled = false
            })
        },
        /**
         * 260.删除项目
         */
        async deleteUProject(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除`,'删除项目信息'])
                .then(() => {
                    resove()
                })
                .catch(error => {

                })
            })
            project({
                FAction:'DeleteUProject',
                ID:row.ProjectID
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
                FAction:'QueryExporteUProject',
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
.inspection-item {
    .el-form-item{
        .condition{
            .el-input {
                width: 120px;
                &__inner{
                    width: 120px
                }
            }
        }
        .limit-value{
            display: inline-block;
            padding: 0 4px;
            background: #2a90fb;
            position: relative;
            left: -8px;
            border-radius: 4px;
        }
        .el-input__inner,.el-textarea__inner{
            height:39px;
            background:rgba(24,64,107,1);
            border:1px solid rgba(5,103,158,1);
        }
        .el-textarea__inner{
            height: 60px;
            color: #F1F1F2
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
        .image{
            width:165px;
            height:128px;
            border:1px solid rgba(5,103,158,1);
            border-radius: 4px;
            text-align: center;
            position: relative;
            image{
                max-width: 165px;
                max-height: 128px;
                vertical-align: middle;
            }
            .el-icon-delete{
                position: absolute;
                font-size: 30px;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                cursor: pointer;
                display: none
            }
        }
        .image:hover{
            .el-icon-delete{
                display: block
            }
        }
    }
}
 


</style>
