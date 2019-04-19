<template>
    <div class="report">
        <!-- 新增弹框 -->
        <el-dialog class="zw-dialog" :title="type?'编辑':'新增'" append-to-body :visible.sync="show" width="695px">
            <el-form inline ref="form">
                <el-form-item label="结点类型">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="结点名称">
                    <el-input></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary">确 认</el-button>
                <el-button @click="show = false">取 消</el-button>
            </span>
        </el-dialog>
        <ul class="operation clearfix">
            <li class="l" @click="show = true"><el-button type='primary'><i class="el-icon-plus"></i></el-button></li>
            <li class="l" @click="createNewFloor()"><el-button type='primary'><i class="iconfont icon-Export"></i>批量生成楼层</el-button></li>
            <li class="l" ><el-button type='primary'><i class="iconfont icon-Export"></i>批量生成房间</el-button></li>
        </ul>
        <div class="clearfix" style="height:785px">
            <div class="buildings l">
                <h3>天安数码城</h3>
                <div class="border"></div>
                <div class="tree">
                    <el-scrollbar>
                        <el-tree
                            :data="data"
                            node-key="id"
                            default-expand-all
                            :expand-on-click-node="false">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                              <span>{{ node.label }}</span>
                              <span style="position:absolute;right:45px;">
                                  <i class="el-icon-plus"></i>
                                  <i class="el-icon-delete" style="margin-left:20px;"></i>
                              </span>
                            </span>
                        </el-tree>
                    </el-scrollbar>
                </div>
            </div>
            <zw-card class="floor-info" :width='1225' :height='785'></zw-card>
        </div>
    </div>
</template>
<script>
import {zwCard} from '@/components/index.js';
export default {
    data(){
        return{
            show:false,
            type:0,
            data:[{
                id: 1,
                label: '一级 1',
                children: [{
                  id: 4,
                  label: '二级 1-1',
                  children: [{
                    id: 9,
                    label: '三级 1-1-1'
                  }, {
                    id: 10,
                    label: '三级 1-1-2'
                  }]
                }]
              }, {
                id: 2,
                label: '一级 2',
                children: [{
                  id: 5,
                  label: '二级 2-1'
                }, {
                  id: 6,
                  label: '二级 2-2'
                }]
              }, {
                id: 3,
                label: '一级 3',
                children: [{
                  id: 7,
                  label: '二级 3-1'
                }, {
                  id: 8,
                  label: '二级 3-2'
                }]
              }]
        }
    },
    components: {
      zwCard
    },
    created(){

    },
    methods:{
        handleCreate(data){
            console.log(data);
        },
        /**
         * .楼宇管理-批量生成楼层
         */
        createNewFloor(){
            this.socket({
                FRouteName:'Building',
                FAction:'CreateNewFloor',
                mFlatsFloor:'',
                BuildingName:'',
                FlatsName:'',
                FloorName:'',
                mFlatsFloor:''
            },this.handleCreate)
        },
        /**
         * .楼宇管理-批量生成房间
         */
        createNewDoorplate(){
            this.socket({
                FRouteName:'Building',
                FAction:'CreateNewDoorplate',
                mUDoorplate:'',
                BuildingID:'',
                FloorID:'',
                FlatsID:'',
                DoorplateCode:'',
                mUDoorplate:'',
            },this.handleCreate)
        }
    }
}
</script>
<style lang="scss">
$img-url:'../../../../assets/image/';
.report{
    .buildings{
        width: 397px;
        height: 100%;
        box-sizing: border-box;
        padding-left: 6px;
        padding-right: 4px;
        background: url(#{$img-url}tree-bg.png) left;
        h3{
            margin-top: 32px;
            text-align: center;
        }
        .border{
            width:389px;
            height:2px;
            margin:29px 5px; 
            background:rgba(45,160,203,1);
            opacity:0.62;
        }
        .tree{
            height: 650px;
            .el-tree{
                background: none;
                padding-left: 20px;
                .el-tree-node:focus {
                    >.el-tree-node__content {
                        background:#818643
                    }
                }
                &-node__content{
                    height: 40px;
                    line-height: 40px;
                    span{
                        font-size: 16px;
                        color: #9EE5F3
                    }
                    .el-tree-node__expand-icon.is-leaf{
                        color: transparent
                    }
                }
                &-node__content:hover {
                    background:#818643;
                }
            }
        }

    }
    .floor-info{
        margin-left: 408px;
    }
}
</style>
