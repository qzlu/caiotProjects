<template>
    <div class="height-100 role-config">
        <el-button class="back" @click="$router.back()">
            <i class="el-icon-arrow-left"></i>返回
        </el-button>
        <h5>
            <p class="l"><span class="label">角色全称：</span>{{role.name}}</p>
            <p class="l"><span class="label">角色描述：</span>{{role.description||'--'}}</p>
            <el-button @click="upadteTRoleMenu()">保存</el-button>
        </h5>
        <div class="role-config-main">
            <div class="role-config-left">
                <h5>选择平台</h5>
                <ul class="form-list"> 
                    <li :class="{active:currentForm.FGUID == item.FGUID}" v-for="item in formList" :key="item.FGUID" @click="handleClick(item)">
                        {{item.FormName}}
                    </li>
                </ul>
            </div>
            <div class="role-config-body">
                <ul class="role-config-tab-heaher">
                    <li class="active">PC功能</li>
                </ul>
                <div class="role-config-tab-content">
                    <div class="role-config-tab-content-header">
                        <span>功能菜单</span>
                        <span>功能权限</span>
                    </div>
                    <div class="menu-tree-table">
                        <el-scrollbar>
                            <el-tree
                                ref="tree"
                                show-checkbox
                               :data="menuData"
                               :props="treeProp"
                               highlight-current
                               node-key='FGUID'
                               @check-change='handleChange'
                               default-expand-all
                               :default-checked-keys="defaultCheckedMenu"
                               :expand-on-click-node="false"
                            >
                                <template v-slot="{node,data}">
                                    <div style="display:flex">
                                        <span class="label" style="width:120px;text-align:left">{{data.FMenuName}}</span>
                                        <ul class="button-list" v-if="data.ButtonList">
                                            <li v-for="item in data.ButtonList" :key="item.FGUID" >
                                                <el-checkbox v-model="item.IsExit">{{item.FMenuName}}</el-checkbox>
                                            </li>
                                        </ul>
                                    </div>
                                </template>
                            </el-tree>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            formList:[],
            currentForm:{},
            menuData:[],
            treeProp:{
                children:'ListData'
            },
            defaultCheckedMenu:[],
            role:{}
        }
    },
    created(){
        this.role =JSON.parse(this.$route.params.role)
        this.queryTUserForm()
    },
    methods:{
                /**
         * 平台管理—查询用户平台信息
         */
        queryTUserForm(type = '1',user = ''){
           this.$post('QueryTUserForm',{FType:type,FUserGuid:user})
           .then((result) => {
               this.formList = result.FObject
               let form = this.formList[0]
               if(form){
                   this.currentForm = form
                   this.queryTRoleMenu(form.FGUID)
               }
           }).catch((err) => {
               
           });

        },
        handleClick(form){
            this.currentForm = form
            this.queryTRoleMenu(form.FGUID)
        },
        /**
         * 获取用户菜单
         */
        queryTRoleMenu(id){
            this.$post('QueryTRoleMenu',{FGUID:this.role.FGUID,FFormID:id})
            .then((result) => {
                this.menuData = result.FObject;
                this.defaultCheckedMenu = []
                //递归获取树形菜单已有权限的菜单
                const findChecked = (data) => {
                    data.forEach(item => {
                        if(item.IsExit == 1&&(!item.ListData||!item.ListData.length)){
                            this.defaultCheckedMenu.push(item.FGUID)
                            let buttonList = item.ButtonList
                            if(buttonList&&buttonList.length>0){
                                buttonList.forEach(obj => {
                                    obj.IsExit = Boolean(obj.IsExit)
                                })
                            }
                        } 
                        if(item.ListData&&item.ListData.length>0){
                            findChecked(item.ListData)
                        }
                    })
                }
                findChecked(result.FObject)
            }).catch((err) => {
            });
        },
        handleChange(node,checked){
            if(node.ButtonList&&node.ButtonList.length){
                node.ButtonList.forEach(item => {
                    item.IsExit = checked
                })
            }
        },
        upadteTRoleMenu(){
            let checkedList = this.$refs.tree.getCheckedNodes(), 
            halfcheckedList = this.$refs.tree.getHalfCheckedNodes(),
            checkButtonList = []
            checkedList.forEach(item => {
                let buttonList = item.ButtonList
                if(buttonList&&buttonList.length>0){
                    buttonList.forEach(obj => {
                        if(obj.IsExit){
                            checkButtonList.push(obj)
                        }
                    })
                }
            })
            checkedList = [...checkedList,...halfcheckedList,...checkButtonList]
            let idStr = checkedList.map(item => item.FGUID).join(',')
            this.$post('UpadteTRoleMenu',{
                FGUID:this.role.FGUID,
                IDStr:idStr,
                FFormID:this.currentForm.FGUID
            },true)
            .then((result) => {
                this.$message({
                    message:'保存成功',
                    type:'success',
                    duration:'500'
                })
                this.queryTRoleMenu(this.currentForm.FGUID)
            }).catch((err) => {
                this.$message({
                    message:'保存失败',
                    type:'error',
                    duration:'500'
                })
            });
        }
    }
}
</script>
<style lang="scss">
    .role-config{
        position: relative;
        .el-button.back{
            width:92px;
            height:50px;
            position: absolute;
            left: -20px;
            top: -90px;
            background:rgba(220,223,222,0.16);
            border: none;
            font-size: 20px;
            color: #607AB3;
            border-radius: 0;
        }
        >h5{
            height: 78px;
            line-height: 78px;
            padding-left: 20px;
            position: relative;
            p{
                font-size: 17px;
                font-weight:400;
                color: #F1F1F2;
                .label{
                    margin-right: 30px;
                    color:rgba(115,115,115,1);
                }
            }
            p+p{
                margin-left: 50px
            }
            .el-button{
                width: 92px;
                height: 45px;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                border: none;
                border-radius: 0;
                background: #042E74;
                -webkit-box-shadow: inset 0 0 10px 2px #005099;
                box-shadow: inset 0 0 10px 2px #005099;
                color: white;
            }
        }
        .role-config-main{
            height: 760px;
            display: flex;
            justify-content: space-between;
            .role-config-left{
                width: 332px;
                height: 100%;
                border:2px solid rgba($color: #143590, $alpha: 0.53);
                border-radius:10px 6px 6px 10px;
                color: #2A91FC;
                text-align: left;
                h5{
                    line-height: 100px;
                    padding-left: 30px;
                    font-size: 20px;
                    font-weight: normal;
                }
                .form-list{
                    li{
                        height:66px;
                        line-height: 66px;
                        padding-left: 80px;
                        font-size: 18px;
                        cursor: pointer;
                    }
                    li.active{
                        background:linear-gradient(90deg,rgba(4,28,63,1),rgba(6,46,113,1),rgba(13,58,132,1),rgba(2,35,82,1));
                    }
                }
            }
            .role-config-body{
                width: 1200px;
                height: 100%;
                padding-top: 20px;
                box-sizing: border-box;
                ul.role-config-tab-heaher{
                    padding-left: 10px;
                    li{
                        width: 187px;
                        height: 48px;
                        line-height: 48px;
                        box-sizing: border-box;
                        border:1px solid rgba(143,156,191,1);
                        color: white;
                        cursor: pointer;
                        font-size: 20px;
                    }
                    li.active{
                        background: rgba($color: #2A91FC, $alpha: 0.64);
                        border: none;
                    }
                }
                .role-config-tab-content{
                    height:673px;
                    margin-top: 4px;
                    border:2px solid rgba(14,50,112,1);
                    &-header{
                        height:66px;
                        line-height: 66px;
                        background:rgba(3,35,74,1);
                        text-align: left;
                        font-size:17px;
                        color: #F1F1F2;
                        span{
                            margin-left: 225px;
                        }
                    }
                    .menu-tree-table{
                        height: 607px;
                        .el-tree{
                            background: none;
                            font-size: 14px;
                            color: #F1F1F2;
                            .el-tree-node:focus {
                                >.el-tree-node__content {
                                    background:linear-gradient(90deg,rgba(4,28,63,1),rgba(6,46,113,1),rgba(13,58,132,1),rgba(2,35,82,1));
                                }
                            }
                            &-node__content{
                                height: 59px;
                                line-height: 59px;
                                padding-left: 180px!important;
                                border-bottom: 2px solid rgba($color: #0E3270, $alpha: 0.5);
                                .button-list{
                                    width: 710px;
                                    display: flex;
                                    margin-left: 166px;
                                    line-height: 30px;
                                    flex-wrap: wrap;
                                    align-items: center;
                                    justify-content: flex-start;
                                    li{
                                        margin-right: 50px;
                                        .el-checkbox{
                                            font-size:14px;
                                            font-weight:400;
                                            color:rgba(241,241,242,1);
                                        }
                                    }
                                }
                            }
                            &-node__content:hover {
                                background:linear-gradient(90deg,rgba(4,28,63,1),rgba(6,46,113,1),rgba(13,58,132,1),rgba(2,35,82,1));
                            }
                            /* .el-tree-node__label{
                                font-size: 18px;
                            } */
                            .el-tree-node__expand-icon{
                                font-size: 20px;
                            }
                            .el-tree-node__children{
                                .el-tree-node__content{
                                    padding-left: 200px!important;
                                    .button-list{
                                        margin-left: 146px;
                                    }
                                }
                            }
                        }
                        .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
                           background:linear-gradient(90deg,rgba(4,28,63,1),rgba(6,46,113,1),rgba(13,58,132,1),rgba(2,35,82,1));
                        }
                    }
                }
            }
        }
    }
</style>