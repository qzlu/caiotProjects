<template>
    <div class="height-100">
        <Table
          ref="table"
          :tableLabel="tableLabel"
          :getData="queryData"
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow = 'deleteItem' 
          :exportData="exportFile" 
          @submit="addOrUpdate"
        >
            <el-form slot="dialog" :model="addData" inline ref="form" class="add-block">
                <el-form-item label="集团全称" prop="FGroupName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.FGroupName"></el-input>
                </el-form-item>
                <el-form-item label="集团简称" prop="FSimpleName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addData.FSimpleName"></el-input>
                </el-form-item>
                <el-form-item label="行政架构" prop="PlatformName">
                    <el-input class="block" v-model="addData.PlatformName"></el-input>
                </el-form-item>
                <el-form-item  label="详细地址" prop="FAddress" :rules="[{ required: true, message: '请输入'}]">
                    <el-input class="block" v-model="addData.FAddress"></el-input>
                </el-form-item>
                <el-form-item label="集团LOGO">
                    <div class="thumb-img" v-if="fileList[0]">
                        <div class="delete">
                            <i class="el-icon-delete" @click="fileList = [] "></i>
                        </div>
                        <img :src="'http://47.107.224.8:8080/'+fileList[0]" alt="">
                    </div>
                    <el-upload
                      v-else
                      action="http://47.107.224.8:8080/UploadFile"
                      list-type="picture-card"
                      :limit = '1'
                      :on-success="handleSuccess1"
                      :data="{FTokenID:token}"
                     >
                        <p><i class="el-icon-plus"></i><br><span>上传(160*60)</span></p>
                    </el-upload>                
                </el-form-item>
                <el-form-item label="集团宣传图" style="margin-left:74px">
                    <div class="thumb-img" v-if="fileList[0]">
                        <div class="delete">
                            <i class="el-icon-delete" @click="fileList = [] "></i>
                        </div>
                        <img :src="'http://47.107.224.8:8080/'+fileList[0]" alt="">
                    </div>
                    <el-upload
                      v-else
                      action="http://47.107.224.8:8080/UploadFile"
                      list-type="picture-card"
                      :limit = '1'
                      :on-success="handleSuccess1"
                      :data="{FTokenID:token}"
                     >
                        <p><i class="el-icon-plus"></i><br><span>上传</span></p>
                    </el-upload>                
                </el-form-item>
                <el-form-item  label="集团描述" prop="FDescription">
                    <el-input class="block" v-model="addData.FDescription"></el-input>
                </el-form-item>
            </el-form>
        </Table>
    </div>
</template>
<script>
import Table from '../component/table.vue'
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop:'FGroupCode',
                    label:'集团编码'
                },
                {
                    prop:'FGroupName',
                    label:'集团全称'
                },
                {
                    prop: 'FSimpleName',
                    label: '集团简称',
                },
                {
                    prop: 'FAreaName',
                    label: '所属区域',
                    formatter:row => {
                        let area = this.areaList.find(item => item.id == row.FAreaCode)
                        return area?area.name:''
                    }
                },
/*                 {
                    prop: 'ParamNameValue',
                    label: 'LOGO图标',
                }, */
                {
                    prop: 'FAddress',
                    label: '地址',
                }
            ],
            areaList:[
                {
                    id:'102',
                    name:'华东地区'
                },
                {
                    id:'105',
                    name:'华中地区'
                },
                {
                    id:'107',
                    name:'华北地区'
                },
                {
                    id:'106',
                    name:'西南地区'
                },
                {
                    id:'104',
                    name:'东北地区'
                },
                {
                    id:'103',
                    name:'华南地区'
                },
                {
                    id:'101',
                    name:'西北地区'
                },
                {
                    id:'108',
                    name:'台湾'
                },
            ],
            defaultAddData:null, //新增默认数据
            addData:{ //新增或修改项目参数
                FGUID:'',
                FGroupCode:null,
                FGroupName:null,
                FSimpleName:null,
                FGrouplng:null,
                FGrouplat:null,
                FAddress:null,
                FAreaCode:null,
                FDescription:null,
                FGroupLogo:'',
                PlatformName:'千仞智服设施管控云平台',
                ProjectPlatFormName:'千仞智服设施管控云平台'
            },
            token:sessionStorage.getItem('FToken'),
            fileList:[]
        }
    },
    components:{
        Table
    },
    created(){
        this.defaultAddData = Object.assign({},this.addData)
    },
    methods:{
        /**
         * 查询数据
         * @param {Vue Component} that 传入子组件
         */
        queryData(that){
            let param = {
                PageIndex:that.pageIndex,
                PageSize:10,
                SearchKey:that.filterText
            }
            return this.$post('QueryPageDTORGGroup',param,true)
        },
        /**
         * 点击新增
         */
        beforeAdd(){
           this.addData = Object.assign({},this.defaultAddData)
           this.fileList = []
        },
        /**
         * 编辑
         */
        editItem(row){
            this.fileList = []
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = row[key] || ''
            })
            this.fileList.push(row.FGroupLogo)
        },
        /**
         * 上传集团LOGO图片
         */
        handleSuccess1(res,file){
            this.fileList.push(res.FObject)
        },
        /**
         * 新增或编辑
         */
        async addOrUpdate(){
            let myGeo = new BMap.Geocoder()
            let address = this.addData.FAddress
            this.addData.FGroupLogo = this.fileList[0]
            await new Promise((resolve) => {
                myGeo.getPoint(address,point => {
                    this.addData.FGrouplng = point.lng||this.addData.FGrouplng
                    this.addData.FGrouplat = point.lat||this.addData.FGrouplat
                    resolve()
                })
            })
            this.$post('AddOrUpdateDTORGGroup',{
                MTORGGroup:this.addData
            })
            .then((result) => {
                this.$refs.table.show = false
                this.$refs.table.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 删除集团
         */
        deleteItem(item){
            return this.$post('DeleteDTORGGroup',{FGUID:item.FGUID})
        },
        /**
         * 导出集团信息
         */
        exportFile(that){
            return this.$post('ExportDTORGGroup',{SearchKey:that.filterText})
        }
    }
}
</script>
<style lang="scss">
.el-dialog{
    .add-block{
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
                color: #9EE5F3;
                i{
                    font-size: 30px;
                    color: #9EE5F3;
                }
            }
        }
    }
}
</style>