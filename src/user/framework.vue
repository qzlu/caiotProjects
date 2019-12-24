<template>
    <div class="framework">
        <div class="main">
            <div class="l left-side">
                <div class="filter-box">
                    <el-input
                      placeholder="搜索关键字"
                      v-model="filterText">
                      <i class="el-icon-search" slot="suffix"></i>
                    </el-input>
                    <el-select v-model="currentBlock" value-key="FGUID" @change="selectBlock">
                        <el-option v-for="item in blockList" :key="item.FGUID" :value="item" :label="item.FSimpleName"></el-option>
                    </el-select>
                </div>
                <div class="tree-content">
                    <el-button @click="queryMainDBTORGLevel()">架构级别</el-button>
                    <el-scrollbar>
<!--                         <el-tree
                            ref="tree"
                           :data="treeData"
                           :props="treeProp"
                           node-key='FGUID'
                           highlight-current
                           default-expand-all
                           :expand-on-click-node='false'
                           :filter-node-method="filterNode"
                        >
                            <template v-slot="{node,data}">
                                <span class="node-row">
                                    {{node.label}}
                                </span>
                            </template>
                        </el-tree> -->
                        <el-tree
                          :key="currentBlock.FGUID"
                          ref="tree"
                          :props="props"
                          :load="loadNode"
                          lazy
                          >
                        </el-tree>
                    </el-scrollbar>
                </div>
            </div>
            <el-dialog title="架构级别" append-to-body :visible.sync="show" width="600px" class="zw-dialog config-level">
                <ul>
                    <li v-for="(item,i) in levelArr" :key="i">
                        <div>
                            <el-checkbox v-model="item.IsExit" v-if="item.IsUpdate"></el-checkbox>
                        </div>
                        <span class="level-index">{{leveIndex[i]}}</span>
                        <el-input  v-model="item.FLevelName" readonly></el-input>
                    </li>
                </ul>
                <div slot="footer">
                    <el-button  @click="configLevel()">确定</el-button>
                    <el-button @click="show1 = false ">取消</el-button>
                </div>
            </el-dialog>
            <div class="main-body">
                <div class="button">地图预览</div>
                <div id="map" class="height-100">
                    <echarts-map ref="map"></echarts-map>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import echartsMap from '@/component/map.vue'
export default {
    data(){
        return{
            filterText:null,
            treeData:[],
            treeProp:{
                children:'ListData',
                label:'FAreaName'
            },
            show:false,
            selectNode:{},
            levelArr:[], //行政架构等级
            leveIndex:['一级','二级','三级','四级','五级','六级','七级','八级','九级','十级'],
            type:0, //0:新增 1:编辑
            provinceList:[],
            selectCitys:[],
            activeLevel:1,
            blockList:[],
            currentBlock:{},
            props:{
                label: 'FAreaName',
                children: 'zones',
                isLeaf: 'leaf'
            }
        }
    },
    components:{
        echartsMap
    },
    watch:{
        filterText(val){
            this.$refs.tree.filter(val);
        },
    },
    async created(){
        this.queryTORGGroupList()
    },
    methods:{
        async loadNode(node, resolve) {
            console.log(node,resolve)
            if (node.level === 0) {
              let result = await this.queryTORGLevelFArea()
              console.log(result)
              return resolve(result.FObject||[]);
            }
            if (node.level > 0) {
                let {FAreaCode,LastFAreaLevel,FAreaLevel} = node.data
                let result = await this.queryTORGLevelFArea(FAreaCode,LastFAreaLevel,FAreaLevel)
                console.log(result)
                let data = result.FObject || []
                let treeData = data.map(item => {
                    return {
                        ...item,
                        leaf:item.FAreaLevel == 5?true:false
                    }
                })
                return resolve(treeData);
            }
        },
        /**
         * 409.查询级别行政架构
         */
        queryTORGLevelFArea(areaCode = -1,nextLevel = 0,currentLevel = 0){
            return this.$post('QueryTORGLevelFArea',{
                FAreaCode:areaCode,
                LastFAreaLevel:nextLevel,
                FAreaLevel:currentLevel,
                FORGGroupGUID:this.currentBlock.FGUID||''
            })
        },
        /**
         * 查询左边树形数据(220.组织架构--查询树状组织)
         */
        queryData(id){
            this.$post('QueryTOPEAreaProjectTree',{
                FORGGroupGUID:id
            })
            .then((result) => {
                this.treeData = result.FObject||[]
            }).catch((err) => {
                
            });
        },
        loadMapData(){
            this.$refs.map.queryMapData(this.currentBlock.FGUID)
        },
        /**
         * 组织架构—查询集团列表
         */
        queryTORGGroupList(){
            this.$post('QueryTORGGroupList')
            .then((result) => {
                this.blockList = result.FObject || []
                this.loadMapData()
            }).catch((err) => {
                
            });
        },
        configLevel(){
            let checkedLevel = this.levelArr.filter(item => item.IsExit).map(item => item.FLevel)
            this.$post('AddUpdateMainDBTORGLevel',{
                FORGGroupGUID:this.currentBlock.FGUID,
                IDStr:checkedLevel.join(','),
                Ftype:2
            })
            .then((result) => {
                this.show  = false
                this.$message({
                    type:'success',
                    message:'修改成功'
                })
            }).catch((err) => {
                this.$message({
                    type:'success',
                    message:'修改失败'
                })
            });
        },
        selectBlock(block){
            this.loadMapData()
        },
        /**
         * 229.行政架构等级--查询行政架构等级
         */
        queryMainDBTORGLevel(){
            this.show = true
            this.$post('QueryMainDBTORGLevel',{FORGGroupGUID:this.currentBlock.FGUID})
            .then((result) => {
                this.levelArr = result.FObject || []
                this.levelArr.forEach(item => {
                    item.IsExit = Boolean(item.IsExit)
                })
                
            }).catch((err) => {
                console.log(err);
            });
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.FAreaName.indexOf(value) !== -1;
        },
    }
}
</script>
<style lang="scss">
.framework{
    header{
        padding-left: 10px;
        text-align: left;
        line-height: 44px;
        font-size: 22px;
        border-bottom: 1px solid rgba(143,156,191,1);
    }
    .main{
        height: 100%;
        margin-top: 16px;
        >div{
            height: 100%;
            /* border:1px solid rgba(35,159,221,1); */
            border-radius:10px;
        }
        .left-side{
            width: 332px;
            height: 820px;
            border-radius:10px 6px 6px 10px;
            background: rgba($color: #0A1C39, $alpha: 0.69);
            border:2px solid rgba($color: #143691, $alpha: 0.89);
            .filter-box{
                height: 46px;
                margin-top: 30px;
                padding-left: 4px;
                text-align: left;
                .el-input{
                    width: 156px;
                    height: 100%;
                    &__inner{
                        height: 100%;
                        color: #FFFFFF;
                        background: #042E74;
                        box-shadow: inset 0 0 6px 2px #005099;
                        border: none;
                        border-radius: 0;
                        /* border:1px solid rgba(12,55,110,1); */
                    }
                }
                .el-input__suffix{
                    top: 6px;
                    right: 10px;
                    font-size: 24px;
                    color: #2A91FC
                }
                .el-select{
                    .el-input{
                        width: 130px;
                        height:35px;
                        line-height: 35px;
                        margin-left: 30px;
                        &__inner{
                            background:rgba(42,145,252,0.46);
                            border-radius:4px 4px 0px 0px;
                            color: #FFFFFF;
                            text-align: center;
                            font-size: 18px;
                        }
                    }
                }
                .el-dropdown{
                    .select-block{
                        width:134px;
                        margin-left: 30px;
                       
                        cursor: pointer;
                    }
                }
            }
            .tree-content{
                height: 700px;
                margin-top: 29px;
                position: relative;
                font-size: 18px;
                .el-scrollbar__wrap{
                   overflow-x: hidden;
                }
                .el-button{
                    width:89px;
                    height:46px;
                    line-height: 46px;
                    margin-left: 100px;
                    position: absolute;
                    top: 0;
                    right: 20px;
                    z-index: 10;
                    padding: 0;
                    font-size: 16px;
                    border: none;
                    border-radius: 0;
                    background: #042E74;
                    box-shadow: inset 0 0 10px 2px #005099;
                    color: white;
                    &:hover{
                        background: rgba($color: #042E74, $alpha: 0.6);
                        box-shadow: inset 0 0 10px 2px rgba($color: #005099, $alpha: 0.6);
                    }
                }
                .el-tree{
                    background: none;
                    color: #2A91FC;
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
        &-body{
            height: 812px;
            margin-left: 342px;
            position:relative;
            box-sizing: border-box;
            .button{
                position: absolute;
                top:38px;
                left:550px;
                z-index: 10;
                width:145px;
                height:61px;
                line-height: 61px;
                font-size: 22px;
                color: #9EE5F3;
                background:linear-gradient(94deg,rgba(26,85,149,1),rgba(17,136,175,1),rgba(26,85,149,1));
                border-radius:29px 27px 27px 29px;
            }
            ul.level{
                position:absolute;
                z-index: 100;
                top:80px;
                left: 50%;
                transform:translateX(-50%);
                li{
                    width:60px;
                    height:44px;
                    line-height:44px;
                    border:1px solid #8F9CBF;
                    display: inline-block;
                    box-sizing:border-box;
                    cursor: pointer;
                }
                li:first-of-type{
                    border-radius: 4px 0 0 4px;
                }
                li:last-of-type{
                    border-radius:0 4px 4px 0;
                }
                li+li{
                    border-left: none;
                }
                li.active{
                    background:rgba(8,148,199,1);
                    border-color:rgba(8,148,199,1);
                }
            }
        }
    }
}
.config-level{
    ul{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        li{
            width: 250px;
            margin-bottom:20px;
            >div{
                width: 14px;
                display: inline-block;
            }
            .level-index{
                margin-left: 8px;
                margin-right: 20px;
                font-size: 16px;
                color: #C7FEFF;
            }
            .el-input{
                width: 170px!important;
            }
            .iconfont{
                color: #C7FEFF;
                font-size: 24px;
                cursor: pointer;
                margin-left: 14px;
            }
        }
    }
    .add-level{
        width:202px;
        height:42px;
        line-height: 42px;
        margin: 20px 112px;
        border:1px dashed rgba(158, 229, 243, 0.27);
        border-radius:2px;
        cursor: pointer;
        text-align: center;
        font-size: 16px;
        color: #C7FEFF
    }
}
</style>