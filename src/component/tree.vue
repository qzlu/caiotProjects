<template>
    <div class="left-tree-list">
        <div class="filter-box">
            <el-input
              placeholder="搜索关键字"
              v-model="filterText">
              <i class="el-input__icon el-icon-search" slot="suffix"></i>
            </el-input>
        </div>
        <div class="tree-content">
            <el-scrollbar>
                <el-tree
                    ref="tree"
                   :data="treeData"
                   :props="treeProp"
                   highlight-current
                   node-key='FGUID'
                   @node-click="handleClick"
                   :expand-on-click-node="false"
                   :filter-node-method="filterNode"
                >
                </el-tree>
            </el-scrollbar>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            filterText:'',
            projectList:[],
        }
    },
    props:{
        treeData:Array,
        treeProp:{
            default:() => {
                return{
                    children:'ListData',
                    label:'FSimpleName'
                }
            }
        }
    },
    watch:{
        filterText(val){
            this.$refs.tree.filter(val);
        },
    },
    created(){
    },
    methods:{
        handleClick(node){
            this.$emit('nodeClick',node)
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.FSimpleName.indexOf(value) !== -1;
        },
    }
}
</script>
<style lang="scss">
.left-tree-list{
    width: 100%;
    height: 100%;
    border-radius:10px 6px 6px 10px;
    border-radius:10px 6px 6px 10px;
    background: rgba($color: #0A1C39, $alpha: 0.69);
    border:2px solid rgba($color: #143691, $alpha: 0.89);
    .filter-box{
        width: 274px;
        height:56px;
        margin-top: 36px;
        margin-left:15px;
        .el-input{
            height: 100%;
            &__inner{
                height: 100%;
                color: #FFFFFF;
                background: #042E74;
                box-shadow: inset 0 0 6px 2px #005099;
                border: none;
                border-radius: 0;
            }
            .el-input__suffix{
                top: 6px;
                right: 10px;
                font-size: 24px;
                color: #2A91FC
            }
        }
    }
    .tree-content{
        height: calc(100% - 130px);
        margin-top: 29px;
        .el-tree{
            background: none;
            color: #18A1EC;
            .el-tree-node:focus {
                >.el-tree-node__content {
                    background:linear-gradient(90deg,rgba(4,28,63,1),rgba(6,46,113,1),rgba(13,58,132,1),rgba(2,35,82,1));
                }
            }
            &-node__content{
                height: 66px;
                line-height: 66px;
                /* padding-left: 60px!important; */
                .el-tree-node__expand-icon{
                    margin-left: 20px;
                }
                .iconfont{
                    vertical-align: middle;
                    font-size: 24px
                }
            }
            &-node__content:hover {
                background:linear-gradient(90deg,rgba(4,28,63,1),rgba(6,46,113,1),rgba(13,58,132,1),rgba(2,35,82,1));
            }
            .el-tree-node__label{
                font-size: 18px;
            }
            .el-tree-node__expand-icon{
                font-size: 20px;
            }
        }
        .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
           background:linear-gradient(90deg,rgba(4,28,63,1),rgba(6,46,113,1),rgba(13,58,132,1),rgba(2,35,82,1));
        }
        .el-tree.checked {
            color: #a0a0a3;
        }
    }
}
</style>