<template>
    <div class="report framework">
        <div class="main">
            <div class="l left-side">
                <div class="filter-box">
                    <el-input
                      placeholder="请输入"
                      v-model="filterText">
                      <i class="el-icon-search" slot="suffix"></i>
                    </el-input>
                </div>
                <div class="framework-level">
                    <el-button @click="show2 = true">架构级别</el-button>
                </div>
                <div class="tree-content">
                    <el-scrollbar>
                        <el-tree
                            ref="tree"
                           :data="treeData"
                           :props="treeProp"
                           default-expand-all
                           node-key='FGUID'
                           highlight-current
                           @node-click="QueryMainDBTORGArea"
                           :expand-on-click-node='false'
                           :filter-node-method="filterNode"
                        >
                        <template v-slot="{node,data}">
                            <span class="node-row">
                                {{node.label}}
                                <span class="r node-operation"> 
                                    <span class="pointer iconfont icon-Edit1" v-if="node.level>1" title="编辑" @click="beforeEditNode(data)"></span>
                                    <span class="pointer iconfont  icon-Added" v-if="data.FLevel<levelArr.length" title="新增" @click="beforeAddNode(data)"></span>
                                    <span class="pointer iconfont icon-TrashBins" v-if="node.level>1" title="删除" @click="deleteTORGNode(data)"></span>
                                    <span class="pointer iconfont icon-System" title="配置" @click="configArea(data)"></span>
                                </span>
                            </span>
                        </template>
                        </el-tree>
                    </el-scrollbar>
                </div>
            </div>
            <el-dialog :title="type?'编辑':'新增'" append-to-body :visible.sync="show" width="400px" class="zw-dialog">
                <el-form :model="addData"  ref="form">
                    <el-form-item v-if="!type" label="上级节点">
                        <span>{{selectNode.FORGName}}</span>
                    </el-form-item>
                    <el-form-item label="节点名称" prop="FORGName" :rules="[{ required: true, message: '请输入'}]">
                        <el-input v-model="addData.FORGName"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button  @click="submit()">确定</el-button>
                    <el-button @click="show = false ">取消</el-button>
                </div>
            </el-dialog>
            <el-dialog title="配置" append-to-body :visible.sync="show1" width="400px" class="zw-dialog">
                <el-form>
                    <el-form-item  label="节点名称">
                        <span>{{selectNode.FORGName}}</span>
                    </el-form-item>
                    <el-form-item label="配置范围">
                        <el-cascader
                            ref="city"
                            v-model="selectCitys"
                            :options="provinceList"
                            :show-all-levels='false'
                            :props="{ multiple: true, checkStrictly: false,label:'name',value:'id' }"
                            collapse-tags
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button  @click="confirmConfig()">确定</el-button>
                    <el-button @click="show1 = false ">取消</el-button>
                </div>
            </el-dialog>
            <el-dialog title="架构级别" append-to-body :visible.sync="show2" width="500px" class="zw-dialog config-level">
                <ul>
                    <li v-for="(item,i) in levelArr" :key="i">
                        <span class="label">{{leveIndex[i]}}</span>
                        <el-input :ref="`input${i}`" :readonly="item.readonly" v-model="item.FLevelName" @blur="editLevel(item)">
                        </el-input>
                        <span class=" iconfont icon-Edit1" title="编辑" @click="beforeEditLevel(item,i)"></span>
                        <span class=" iconfont icon-TrashBins" title="删除" @click="deleteLeve(item)"></span>
                    </li>
                </ul>
<!--                 <div class="add-level" @click="beforeAddLevel">
                    <span class="el-icon-plus"></span>
                    添加
                </div> -->
                <el-dialog title="添加架构级别" append-to-body :visible.sync="show3" width="400px" class="zw-dialog">
                    <ul>
                        <li>
                            <span class="label">{{leveIndex[levelArr.length]}}</span>
                            <el-input v-model="addLevel.FLevelName"></el-input>
                        </li>
                    </ul>
                    <div slot="footer">
                        <el-button  @click="addMainDBTORGLevel()">确定</el-button>
                        <el-button @click="show3 = false ">取消</el-button>
                    </div>
                </el-dialog>
            </el-dialog>
            <div class="main-body">
                <div id="map" class="height-100">
                    <echarts-map ref="map"></echarts-map>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
/* import echartsMap from '@/views/component/map.vue' */
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
            addData:{
                FParentGUID:'',
                FORGLevelGUID:'',
                FORGName:''
            },
            selectNode:{},
            levelArr:[], //行政架构等级
            leveIndex:['一级','二级','三级','四级','五级','六级','七级','八级','九级','十级'],
            type:0, //0:新增 1:编辑
            provinceList:[],
            show1:false,
            show2:false,
            show3:false,
            selectCitys:[],
            addLevel:{
                FLevel:'',
                FLevelName:''
            },
            activeLevel:1,
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
        this.queryData()
        await this.QueryMainDBTORGLevel()
    },
    methods:{
        /**
         * 查询左边树形数据(220.组织架构--查询树状组织)
         */
        queryData(){
            this.$post('/QueryTOPEAreaProjectTree')
            .then((result) => {
                this.treeData = result.FObject||[]
            }).catch((err) => {
                
            });
        },

        /**
         * 新增子节点(点击每个节点的新增按钮)
         */
        beforeAddNode(node){
            this.type = 0
            this.selectNode = node
            this.show = true
            this.addData.FORGName = ''
        },
        /**
         * 新增节点
         */
        addNode(){
            this.addData.FParentGUID = this.selectNode.FGUID
            this.addData.FORGLevelGUID = this.levelArr[this.selectNode.FLevel].FGUID
            if(this.addData.FORGName.length>0){
                this.$post('/AddTORGNode',{
                    MTORGNode:this.addData
                })
                .then((result) => {
                    this.show = false
                    this.queryData()
                }).catch((err) => {
                    
                });
            }
        },
        /**
         * 点击编辑节点
         */
        beforeEditNode(node){
            this.type = 1 
            this.selectNode = node
            this.show = true
            this.addData.FORGName = node.FORGName
        },
        /**
         * 修改节点
         */
        editNode(){
            this.$post('/UpdateTORGNode',{
                MTORGNode:{
                    FGUID:this.selectNode.FGUID,
                    FORGName:this.addData.FORGName
                }
            })
            .then((result) => {
                this.show = false
                this.queryData()
                this.queryMapData()
            }).catch((err) => {
                
            });
        },
        submit(){
            if(this.type){
                this.editNode()
            }else{
                this.addNode()
            }
        },
        /**
         * 配置区域
         */
        configArea(data){
            this.selectNode = data
            this.show1 = true
            this.selectCitys = []
            this.$post('/QueryMainDBTORGArea',{
                FGUID:data.FGUID
            })
            .then((result) => {
                this.selectCitys = result.FObject.map(item => {
                    if(item.FAreaLevel==1){
                        return [Number(item.FAreaCode)]
                    }else{
                        return [Number(item.FParentCode),Number(item.FAreaCode)]
                    }
                })
                let data = result.FObject.map(item => Number(item.FAreaCode))
                this.queryMainDBUsedTORGArea(data)
                this.queryMapData()
            }).catch((err) => {
                
            });
        },
        /**
         * 配置区域
         */
        confirmConfig(){
            let citys = this.$refs.city.getCheckedNodes()
            //过滤省份下面的城市
            let province = citys.filter(item => item.level == 1).map(item => item.value)
            let filterCity = citys.filter(item => {
                if(item.level == 1||item.level == 2&&!province.includes(item.parent.value)){
                    return item
                }
            })
            let data = filterCity.map(item => {
                let parentName = '', parentCode = ''
                if(item.level == 2){
                    parentName = item.parent.label
                    parentCode = item.parent.value
                }
                return {
                    FORGNodeGUID:this.selectNode.FGUID,
                    FAreaLevel: item.level,
                    FAreaName: item.label,
                    FAreaCode: item.value,
                    FParentName: parentName,
                    FParentCode: parentCode
                }
            })
            this.$post('/UpdateMainDBTORGArea',{
                MTORGAreas:data
            })
            .then((result) => {
                this.queryData()
                this.queryMapData()
                this.show1 = false
            }).catch((err) => {
                
            });
        },
        /**
         * 删除节点
         */
        async deleteTORGNode(node){
            console.log(node)
            await this.$confirm(`此操作将删除, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            this.$post('/DeleteTORGNode',{
                FGUID:node.FGUID
            })
            .then((result) => {
                this.queryData()
                this.$message({
                    message:'删除成功',
                    type:'success',
                    duration:'500'
                })
            }).catch((err) => {
                this.$message({
                    message:'删除失败',
                    type:'error',
                    duration:'500'
                })
            });
        },
        /**
         * 229.行政架构等级--查询行政架构等级
         */
        QueryMainDBTORGLevel(){
            return new Promise((resolve,reject) => {
                this.$post('/QueryMainDBTORGLevel')
                .then((result) => {
                    this.levelArr = result.FObject || []
                    this.levelArr.forEach(item =>{
                        this.$set(item,'readonly',true)
                    })
                    this.levelArr.sort((a,b) => a.FLevel - b.FLevel)
                    this.activeLevel = this.levelArr[0].FLevel
                    resolve()
                }).catch((err) => {
                    console.log(err);
                    reject()
                });
            })
        },
        /**
         * 242.行政架构区域范围--查询该集团所有已被选取的城市
         */
        queryMainDBUsedTORGArea(arr){
            this.$post('/QueryMainDBUsedTORGArea')
            .then((result) => {
                let data = result.FObject.map(item => Number(item.FAreaCode)).filter(item => !arr.includes(item))
                this.provinceList = province.map(item => {
                    if(!item.isProvince) return Object.assign(item,{disabled:data.includes(item.id)})
/*                     let citys = require(`@/mapJson/${item.jsonName}.json`)
                    return Object.assign(item,{
                        disabled:data.includes(item.id),
                        children:citys.features.map(obj => {
                            //如果省份已被选择，则相对应的城市也被勾选
                            if(arr.includes(item.id)){
                                this.selectCitys.push([item.id,obj.properties.adcode])
                            }
                            return {
                                name:obj.properties.name,
                                id:obj.properties.adcode,
                                disabled:data.includes(obj.properties.adcode)
                            }
                        })
                    }) */
                })
            }).catch((err) => {
                console.log(err)
            });
        },
        /**
         * 查询行政架构区域节点范围
         */
        QueryMainDBTORGArea(node){
            this.$post('/QueryMainDBTORGArea',{
                FGUID:node.FGUID
            })
            .then((result) => {
                /* console.log(result); */
            }).catch((err) => {
                
            });
        },
        beforeAddLevel(){
            this.show3 = true
            this.addLevel.FLevel = this.levelArr.length+1
            this.addLevel.FLevelName = ''
        },
        /**
         * 230.行政架构等级--新增行政架构等级
         */
        addMainDBTORGLevel(){
            this.show3 = false
            this.$post('/AddMainDBTORGLevel',{
                MTORGLevel:{
                    FLevel:this.addLevel.FLevel,
                    FLevelName:this.addLevel.FLevelName
                }
            })
            .then((result) => {
                this.QueryMainDBTORGLevel()
            }).catch((err) => {
                
            });
        },
        /**
         * 点击每个架构级别的编辑时
         */
        beforeEditLevel (item,i){
            item.readonly = false;
            this.$refs[`input${i}`][0].focus()
        },
        /**
         * 修改行政架构等级
         */
        editLevel(item){
            this.$post('/UpdateMainDBTORGLevel',{
                MTORGLevel:{
                    FGUID:item.FGUID,
                    FLevel:item.FLevel,
                    FLevelName:item.FLevelName
                }
            })
            .then((result) => {
                this.QueryMainDBTORGLevel()
            }).catch((err) => {
                
            });
        },
        async deleteLeve(item){

            await this.$confirm(`此操作将删除, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            this.$post('/DeleteMainDBTORGLevel',{
                FGUID:item.FGUID
            })
            .then((result) => {
                this.QueryMainDBTORGLevel()
            }).catch((err) => {
                
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
        height: 860px;
        margin-top: 20px;
        >div{
            height: 840px;
            border:1px solid rgba(35,159,221,1);
            border-radius:10px;
        }
        .left-side{
            width: 394px;
            background: rgba($color: #1C385D, $alpha: 0.6);
            .filter-box{
                height: 94px;
                padding: 0 20px;
                border-bottom: 2px solid #2DA0CB;
                .el-input{
                    margin-top: 30px;
                    &__inner{
                        height:46px;
                        border:2px solid #33C4F1;
                        border-radius:10px;
                        background: #092D53;
                        color: #C7FEFF;
                    }
                }
                .el-input__suffix{
                    top: 6px;
                    right: 10px;
                    font-size: 24px;
                    color: #ffffff
                }
            }
            .framework-level{
                text-align: left;
                margin: 10px;
                .el-button{
                    width:89px;
                    height:34px;
                    padding: 0;
                    background:#1E3E67;
                    border: 1px solid #33C4F1;
                    color: #C7FEFF;
                    font-size: 16px;
                }
                .el-button:hover{
                    background:rgba($color: #33C4F1, $alpha: 0.5);
                }
            }
            .tree-content{
                height: 690px;
                .el-tree{
                    background: none;
                    .el-input__inner{
                        background: none;
                        border: none;
                        font-size: 16px;
                        color: #C7FEFF
                    }
                    .el-tree-node:focus {
                        >.el-tree-node__content {
                            background:rgba(51,196,241,0.36);
                        }
                    }
                    &-node__content{
                        height: 40px;
                        line-height: 40px;
                        span{
                            font-size: 16px;
                            color: #C7FEFF
                        }
                        .node-row{
                            width: 100%;
                            text-align: left;
                            .node-operation{
                                margin-right: 20px;
                                display: none;
                                span{
                                    font-size: 22px;
                                }
                                span+span{
                                    margin-left: 10px;
                                }
                            }
                        }
                        .node-row:hover{
                            .node-operation{
                                display: block
                            }
                        }
                        .el-tree-node__expand-icon.is-leaf{
                            color: transparent
                        }
                    }
                    &-node__content:hover {
                        background:rgba(51,196,241,0.36);
                    }
                }
                .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
                   background:rgba(51,196,241,0.36);
                }
            }
        }
        &-body{
            margin-left: 420px;
            position:relative;
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
        li{
            margin-bottom:10px;
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