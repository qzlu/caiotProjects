<template>
    <div class="role-main report">
        <!-- 新增或编辑角色弹框 -->
        <div class="config-dialog">
            <el-dialog  :title="title" :visible.sync="show" width="676" class="zw-dialog">
                <el-form :model='addFormData' ref='form' inline>
                    <el-form-item v-for="item in addFormList" :key="item.prop" :prop="item.prop" :label="item.label" :rules="item.rule">
                      <el-input v-model="addFormData[item.prop]"></el-input>
                    </el-form-item>
<!--                     <el-form-item label="角色类型" :rules="[{ required: true, message: '请选择'}]">
                      <el-select v-model="addFormData.FType" placeholder="请选择角色类型">
                        <el-option label="超级管理员" value="0"></el-option>
                        <el-option label="系统管理员" value="1"></el-option>
                        <el-option label="其他" value="2"></el-option>
                      </el-select>
                    </el-form-item> -->
                </el-form>
                <div class="submit">
                    <button class="zw-btn zw-btn-primary" v-submit="submit">确定</button>
                </div>
            </el-dialog>
        </div>
        <!-- 权限修改弹框 -->
        <div class="role-config">
            <el-dialog :visible.sync="show1" width="560">
                <ul class="tab-header clearfix">
                   <!--  <li :class="{'active': tabIndex === 1,'l':true}" @click="tabIndex = 1"><div>集团项目权限</div></li> -->
                    <li :class="{'active': tabIndex === 2,'l':true}" @click="tabIndex = 2"><div>PC功能点</div></li>
                    <!-- <li :class="{'active': tabIndex === 3,'l':true}" @click="tabIndex = 3"><div>APP功能点</div></li> -->
                    <li class="l"></li>
                    <!-- <div class="border">
                    
                    </div> -->
                </ul>
<!--                 <div class="tab-content clearfix" v-show="tabIndex === 1">
                    <tree-transfer
                    :data="data"
                    :data1="data1"
                    leftTitle="所有权限"
                    rightTitle="已选权限"
                    nodeKey="ProjectID"
                    nodeKey1="BlocID"
                    :defaultChecked="defaultChecked"
                    @check-change="checkChange"
                    :defaultProps="defaultProps"
                    :renderContent="renderContent"
                    :renderContent1="renderContent"
                    >
                    </tree-transfer>
                    <div class="submit">
                        <button class="zw-btn zw-btn-primary" @click="updateTRoleProject()">确定</button>
                    </div>
                </div> -->
                <div class="tab-content clearfix">
                    <tree-transfer
                        :data='menuData'
                        :data1='menuData'
                        :checkStrictly="checkStrictly"
                        leftTitle='所有权限'
                        rightTitle='已选权限'
                        nodeKey="FGUID"
                        :defaultProps="defaultProps1"
                        :filterNode="filterNode"
                        :defaultChecked="defaultCheckedMenu"
                         @check-change="checkChange1"
                        ref="transfer"
                    >

                    </tree-transfer>
                    <div class="submit">
                        <button class="zw-btn zw-btn-primary" @click="updateTRoleMenu()">确定</button>
                    </div>
                </div>
                <div class="tab-content clearfix" v-show="tabIndex === 3">
                    app功能点
                </div>
            </el-dialog>
        </div>
        <ul class="report-header clearfix">
            <li class="l role-head-add" @click="add"><button class="zw-btn zw-btn-add">新增</button></li>
            <li class="l role-head-export" @click="exportFile"><button class="zw-btn zw-btn-export">导出</button></li>
            <li class="l role-head-refrest" @click="pageIndex=1;queryData()"><button class="zw-btn zw-btn-refrest">刷新</button></li>
        </ul>
        <div class="role-table">
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
                 :label="item.label"
                 :width="item.width"
                >
               </el-table-column>
               <el-table-column
                 prop=""
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span @click="updateRole(scoped.row)">修改</span>
                        <span @click="deleteRole(scoped.row)">删除</span>
                        <span @click="queryTRoleBloc(scoped.row.FGUID)">权限</span>
                     </div>
                 </template>
               </el-table-column>
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
    </div>
</template>
<script>
import {system} from '@/caiot/request/api.js'//api接口（接口统一管理）;
import table from '@/caiot/mixins/table' //表格混入数据
import {zwPagination,treeTransfer} from '@/caiot/zw-components/index'
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
                    prop: 'LastUpdateby',
                    label: '最后修改人'
                },
                {
                    prop: 'FLastUpdateTime',
                    label: '最后修改时间'
                }
            ],
            //新增角色默认数据
            defaultFormData:{
                FType:'2', //角色类型 0:超级管理员 1：系统管理与那 2：其他
                FName:null, // 角色名称
                FSimpleName:null, //角色简称
                FDescription:'', //角色描述 ，设计图无描述框
                FState:1, //角色状态 0：禁用 1：启用
                FGUID:null // 角色guid,修改时需要
            },
            //新增角色数据
            addFormData:{
                FType:'2',
                FName:null,
                FSimpleName:null,
                FDescription:'',
                FState:1,
                FGUID:null
            },
            //新增角色选项
            addFormList:[
                {
                    label: '角色名称',
                    prop: 'FName',
                    rule:[
                        { required: true, message: '角色名称不能为空'},
                    ]
                },
                {
                    label: '角色简称',
                    prop: 'FSimpleName',
                    rule:[
                        { required: true, message: '角色简称不能为空'},
                    ]
                }
            ],
            title:'新增', //新增或修改角色弹框标题
            show:false, //控制新增弹框是否显示
            type:0,  // 0 :新增角色 1：修改角色
            show1:false, //控制权限弹框是否显示
            tabIndex:2, // 选项卡索引
            data:[], //权限弹框所有项目数据
            data1:[], //权限弹框已选项目数据
            defaultChecked:[], //权限弹框已选项目，控制所有项目默认选中
            roleGuid:null, //角色guid
            defaultProps: { //
                children: 'data',
                label: 'BlocName'
            }, 
            menuData:[], //权限菜单数据
            // checkedMenuData:null,
            defaultCheckedMenu:[], //已选菜单数据，控制所有菜单的选中
            defaultProps1:{  //el-tree props指向
                children: 'list',
                label: 'FMenuName'
            },
            showDelete:false,
            checkStrictly:false
        }
    },
    components:{
        zwPagination,
        treeTransfer
    },
    watch:{
        tabIndex(){
            if(this.tabIndex === 2){
                this.$refs.transfer.$refs.tree1.filter()
            }
        },
        show1(){
            if(!this.show1){
                this.tabIndex = 1
            }
        }
    },
    created(){
        this.queryData()
    },
    mounted(){

    },
    methods:{
        renderContent(h, { node, data, store }){
            return(
                <span>{data.BlocName?data.BlocName:data.ProjectName}</span>
            )
        },
        /**
         * queryRole 分页查询查询角色
         * @param {type Number} pageIndex 页码
         */
        queryData() {
            system({
                FAction:"QueryPageDataByTRole",
                FName:"",
                PageIndex:this.pageIndex,
                PageSize:10
            },true)
            .then(data => {
                this.total = data.FObject.Table[0].count
                this.tableData = data.FObject.Table1
                /**
                 * 删除操作时，当前页面无数据时跳到上一页
                 */
                if(this.tableData.length === 0&&this.pageIndex > 1){
                    --this.pageIndex
                    this.queryData()
                }
            })
            .catch(err => {

            })
        },
        /**
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryData()
        },
        /**
         * add 点击新增按钮
         */
        add(){
            this.title = '新增'
            this.type = 0
            this.show = true,
            this.addFormData = Object.assign({},this.defaultFormData)
        },
        /**
         * updateRole 修改角色
         */
        updateRole(item) {
            this.title = '修改'
            this.show = true
            this.type = 1
            for(let key in this.addFormData){
                this.addFormData[key] = typeof item [key] ==='number'?item [key].toString():item [key]
            }
        },
        async submit(){
            this.addRole()
        },
        /**
         * addRole 新增或修改角色
         * 
         */
        addRole(){
            system({
                FAction:this.type?'UpdateTRole':'AddTRole',
                mTrole:this.addFormData
            })
            .then(data => {
                this.show = false
                this.queryData()
                this.$message({
                  type: 'success',
                  message: this.type?'修改成功！':'新增成功！'
                });
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: this.type?'修改失败！':'新增失败！'
                });
            })
        },
        /**
         * deleteRole 删除角色
         * @param {type String} role 角色
         */
        async deleteRole(role){
            await new Promise(resolve => {
                this.$DeleteMessage([`确定要删除　　${role.FName}`,'删除角色'])
                .then(() => {
                    resolve()
                })
                .catch(() => {
                })
            })
            system({
                FAction:'DeleteTRole',
                FGUID:role.FGUID
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.queryData()
            })
            .catch(error => {
                console.log(error);
                this.$DeleteMessage([`删除失败!${error}`,'提示信息'],false)
/*                 this.$message({
                  type: 'error',
                  message: '删除失败!'+error
                }); */
            })
        },
        /**
         * 查询菜单权限
         * @param {type Numer} type 0:查询所有菜单 1：根据角色guid查询已有权限菜单
         */
        queryUsersMenuTree(type,key){
            system({
                FAction:'QueryUsersMenuTree',
                FRoleGUID:this.roleGuid,
                FmenuLevle:type
            })
            .then(data =>{
                this.defaultCheckedMenu = []
                let _this = this
                //递归获取树形菜单已有权限的菜单
                function findTree(data) {
                    data.forEach(item => {
                        if(item.IsExist == 1&&(!item.list||!item.list.length)){
                            _this.defaultCheckedMenu.push(item.FGUID)
                        } 
                        if(item.list){
                            findTree(item.list)
                        }
                    })
                }
                this[key] = data.FObject
                findTree(data.FObject)
            })
            .catch(error => {
                console.log(error);
            })
        },
        /**
         * queryTRoleBloc 查询角色对应的集团权限
         * @param {type String} guid 角色的唯一guid
         */
        queryTRoleBloc(guid) {
            this.show1 = true
            this.roleGuid = guid
            // 获取所有菜单
            this.queryUsersMenuTree(2,'menuData')
            // this.queryUsersMenuTree(1,'checkedMenuData')
            system({
                FAction:'QueryTRoleBloc',
                FRoleGUID:guid
            })
            .then(data => {
                this.defaultChecked = []
                this.data = data.FObject.table
                this.data1 = data.FObject.table1
                this.data.forEach(item => {
                    item.data.forEach(obj => {
                        if(obj.IsExist == 1){
                            this.defaultChecked.push(obj.ProjectID)
                        }
                    })
                });
            })
            .catch(error => {

            })
        },
        /**
         * 项目集团关系树形节点发生改变时 改变右边树形框数据
         */
        changeCheck(){
            let data = JSON.parse(JSON.stringify(this.data))
            data.forEach(item => {
                item.data=item.data.filter(obj => {
                    return obj.IsExist>0
                })
            })
            this.data1 = data.filter(item => {
                return item.data.length > 0
            })
        },
        /**
         * 项目集团关系树形节点选择发生改变触发
         */
        checkChange(data,check){
            if(data.IsExist&&check){
                data.IsExist = '1'
            }else if(data.IsExist&&!check){
                data.IsExist = '0'
            }
            clearTimeout(this.changeCheck.timer)
            this.changeCheck.timer = setTimeout(() => {
                this.changeCheck()
            },100)
        },
        /**
         * 修改项目权限
         */
        updateTRoleProject(){
            let projectArr = []
            this.findTree(this.data1,'data','ProjectID',projectArr)
            system({
                FAction:'UpdateTRoleProject',
                FGUID:this.roleGuid,
                FProjectIDStr:projectArr.join(',')
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '设置成功!'
                });
                this.show1 = false
            })
            .catch(error => {
                this.$message({
                  type: 'error',
                  message: '设置失败!'
                });
            })
        },
        /**
         * 菜单选择发生改变
         */
        checkChange1(data,check){
            if(data.IsExist == null){
                data.IsExist = '0'
            }
            if(data.IsExist&&check){
                data.IsExist = '1'
            }else if(data.IsExist&&!check){
                data.IsExist = '0'
            }
            this.$refs.transfer.$refs.tree1.filter()
        },
        /**
         * 修改菜单权限
         * menuArr全√菜单
         * halfMenuArr 半选中菜单
         */
        updateTRoleMenu(){
            let menuArr = [], halfMenuArr = []
            this.findTree(this.menuData,'list','FGUID',menuArr)
            halfMenuArr = this.$refs.transfer.$refs.tree.getHalfCheckedNodes().map(item => item.FGUID)
            menuArr.push(...halfMenuArr)
            system({
                FAction:'UpdateTRoleMenu',
                FGUID:this.roleGuid,
                FMenuGUIDStr:menuArr.join(',')
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '设置成功!'
                });
                this.show1 = false
            })
            .catch(error => {
                console.log('错误',error);
                this.$message({
                  type: 'error',
                  message: '设置失败!'
                });
            })
        },
        /**
         * 过滤树形结构
         */
        filterNode(value, data, node){
            return data.IsExist == 1
        },
        /**
         * 循环树形结构
         */
        findTree(data,children,id,arr){
            data.forEach(item => {
                if(item.IsExist&&item.IsExist==1){
                    arr.push(item[id])
                }
                if(item.IsExist&&item[children]){
                    this.findTree(item[children],children,id,arr)
                }
                if(!item.IsExist){
                    if(item[children]) this.findTree(item[children],children,id,arr)
                }
            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            system({
                FAction:'QueryExportTRole',
                FName:''
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
<style lang='scss'>
    $img-url:'../../static/image/';
    .role-operation{
        span{
            cursor: pointer;
        }
        span:nth-of-type(2){
            margin: 0 20px;  
        }
    }
    // 新增或编辑弹框样式
    .config-dialog{
        .el-dialog{
            width: 676px;
            height: 528px;
            box-sizing: border-box;
            background: url('#{$img-url}admin/btn3.png') center no-repeat;
            text-align: left;
            padding-left: 48px;
            &__title{
                color: #F1F1F2;
                font-size: 17px;
                font-weight:400;
            }
            &__headerbtn{
                right: 40px;
                .el-dialog__close{
                    color: #9FC1FD;
                    font-size: 16px;
                }
            }
            .el-form{
                &-item{
                    .el-form-item__label{
                        width: 80px;
                        color: #F1F1F2;
                    }
                    .el-input{
                        width: 165px;
                        .el-input__inner{
                            background: #05679E;
                            border-color: #18406B;
                            color: #F1F1F2;
                        }
                    }
                }
                &-item:nth-of-type(2n){
                    margin-left: 64px;
                }
            }
            .submit{
                text-align: center;
                margin-top: 37px;
            }
        }
    }
    .role-config{
        .el-dialog{
            width:680px;
            height: 480px;
            box-sizing: border-box;
            background: url('#{$img-url}admin/btn3.png') center no-repeat;
            background-size: 100% 100%;
            padding: 0px 32px 20px 32px;
            &__headerbtn{
                right: 40px;
                .el-dialog__close{
                    color: #9FC1FD;
                    font-size: 16px;
                }
            }
            &__body{
                padding: 0px;
            }
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
                height: 290px;
                padding: 20px 30px;
                .zw-btn{
                    margin-top: 26px;
                }
            }
        }
    }
</style>
