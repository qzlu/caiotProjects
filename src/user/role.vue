<template>
    <div class="height-100">
        <Table
          ref='table'
          :tableLabel = 'tableLabel' 
          :getData='queryData' 
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow = 'deleteItem' 
          :exportData="exportFile" 
          @submit="addOrUpdate"
          :buttonList = "buttonList"
        >
           <el-form slot="dialog" :model="addData" inline ref="form">
               <el-form-item label="角色名称" prop="FName" :rules="[{ required: true, message: '角色名称不能为空'}]">
                   <el-input v-model="addData.FName"></el-input>
               </el-form-item>
               <el-form-item label="角色简称" prop="FSimpleName" :rules="[{ required: true, message: '角色简称不能为空'}]">
                   <el-input v-model="addData.FSimpleName"></el-input>
               </el-form-item>
           </el-form>
           <template v-slot:row-operation="{row}">
                <span>
                    <router-link :to="`/1/manage/roleDetail/${row.FGUID}`">
                        分配权限
                    </router-link>
                </span>
           </template>
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
                    prop: 'FName',
                    label: '角色名称',
                },
                {
                    prop: 'FUserCount',
                    label: '员工数量',
                },
                {
                    prop: 'FUserName',
                    label: '创建账号',
                },
                {
                    prop: 'FLastUpdateTime',
                    label: '创建时间',
                },
            ],
            defaultAddData:{//新增默认参数
                FGUID:'',
                FName:'',
                FORGNodeGUID:'',
                FORGDepartmentGUID:'',
                FSimpleName:'',
                FDescription:'',
                FType:0,
            },
            addData:{ //新增参数
                FGUID:'',
                FName:'',
                FORGNodeGUID:'',
                FORGDepartmentGUID:'',
                FSimpleName:'',
                FDescription:'',
                FType:0,
            },
            show1:false,
            tabIndex:1,
            role:null,
        }
    },
    props:{
        buttonList:Array
    },
    components:{
        Table,
    },
    computed:{
    },
    created(){
    },
    mounted(){
    },
    methods:{
        /**
         * 查询
         * @param {Vue Component} that 传入子组件
         */
        queryData(that){
            let param = {
                PageIndex:that.pageIndex,
                PageSize:10,
                SearchKey:that.filterText
            }
            return this.$post('QueryPageTRole',param,true) 
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.addData = Object.assign({},this.defaultAddData)
        },
        /**
         * 编辑
         */
        editItem(row){
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = row[key]
            })
        },
        /**
         * 新增或编辑
         */
        addOrUpdate(){
            this.$post('AddOrUpdateTRole',{
                MTRole:this.addData
            })
            .then((result) => {
                this.$refs.table.queryData()
                this.$refs.table.show = false
            }).catch((err) => {
                
            });
        },
        /**
         * 删除
         */
        async deleteItem(item){
            return this.$post('DeleteTRole',{FGUID:item.FGUID})
        },
        /**
         * 导出
         */
        exportFile(that){
            return this.$post('ExportTRole',{SearchKey:that.filterText})
        }
    }
}
</script>
<style lang="scss">
.role-config{
    .el-dialog{
        .tab-header{
            position: relative;
            color: white;
            font-size: 14px;
            padding: 5px 6px;
            li{
                height: 25px;
                line-height: 25px;
                padding: 0 12px;
                cursor: pointer;
                border-bottom:1px solid#7EF7FE;
                opacity:0.5;
                background-color:rgba(20,107,214,0.22);
                background-clip:content-box;
                div{
                    padding: 0 12px;
                }
            }
            li.active{
                border:1px solid#7EF7FE;
                border-bottom: none;
                background:none
            }
            li:last-of-type{
                width: 100px;
                background:none
            }
        }
        .tab-content{
            padding: 20px 30px;
            .submit{
                text-align: right;
                .zw-btn{
                    margin-top: 26px;
                    color: #9EE5F3;
                    border:1px solid rgba(81, 128, 205, 0.82);
                    background: radial-gradient(#133E6B,#1E4F8F)
                }
            }
        }
    }
}
</style>