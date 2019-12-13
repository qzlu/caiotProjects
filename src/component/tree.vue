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
                   :data="projectList"
                   :props="treeProp"
                   highlight-current
                   node-key='FGUID'
                   @node-click="handleClick"
                   default-expand-all
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
            treeProp:{
                children:'ListData',
                label:'FSimpleName'
            },
            filterText:'',
            projectList:[],
        }
    },
    watch:{
        filterText(val){
            this.$refs.tree.filter(val);
        },
    },
    created(){
        this.queryProject()
    },
    methods:{
        /**
         * 查询左边树形数据(258.组织架构--查询树状集团项目)
         */
        queryProject(){
            this.$post('QueryTORGGroupProjectTree',{
              FORGGroupGUID: '',
            })
            .then((result) => {
                this.projectList = result.FObject||[]
                let node = this.projectList[0]
                if(node){
                    this.$nextTick(() => {
                        this.$refs.tree.setCurrentKey(node.FGUID)
                    })
                    this.handleClick(node)
                }
            }).catch((err) => {
                console.log(err);
            });
        },
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
    background: rgba($color: #052256, $alpha: 0.29);
    box-shadow: 0 0 10px 4px rgba($color: #3068d1, $alpha: 0.29) inset;
    border:2px solid rgba($color: #18297D, $alpha: 1);
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
                background:rgba(0,80,153,1);
                border:1px solid rgba(12,55,110,1);
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