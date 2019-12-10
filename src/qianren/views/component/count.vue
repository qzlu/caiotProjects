<template>
    <div class="count-container">
        <div class="count-left count-box-bg">
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
        <div class="count-main">
            <div class="count-main-header">
                <i :class="['iconfont', titleIcon]"></i>
                <span>{{title}}</span>
                <div class="r">
                    <ul>
                      <li :class="{active:active==i}" v-for="(item,i) in dateTypeList" :key="i" @click="selectDateType(i)">
                        {{item.label}}
                      </li>
                    </ul>
                    <div class="time">
                      <i class="iconfont icon-Leftparentheses pointer" @click="pre()"></i>
                      <div >
                        <el-date-picker
                          v-model="time"
                          :clearable="false"
                          :type="dateTypeList[active].type"
                          placeholder="选择日期"
                        ></el-date-picker>
                      </div>
                      <i class="iconfont icon-Rightparentheses pointer" @click="next()"></i>
                    </div>
<!--                     <el-button>
                        <i class="iconfont icon-Export"></i>
                        导出
                    </el-button> -->
                </div>
            </div>
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            dateTypeList:[
              { 
                label:'日统计',
                type:'date',
                pre:'昨日',
                current:'当日',
                preFun:() => {
                  return new Date(this.time).setDate(this.time.getDate()-1)
                },
                nextFun:() => {
                  return new Date(this.time).setDate(this.time.getDate()+1)
                }
              },
              {
                label:'月统计',
                type:'month',
                pre:'上月',
                current:'本月',
                preFun:() => {
                  return new Date(this.time).setMonth(this.time.getMonth()-1)
                },
                nextFun:() => {
                  return new Date(this.time).setMonth(this.time.getMonth()+1)
                }
              },
              {
                label:'年统计',
                type:'year',
                pre:'上年',
                current:'今年',
                preFun:() => {
                  return new Date(this.time).setFullYear(this.time.getFullYear()-1)
                },
                nextFun:() => {
                  return new Date(this.time).setFullYear(this.time.getFullYear()+1)
                }
              },
            ],
            active:0,
            time:new Date(),
            projectList:[],
            treeProp:{
                children:'ListData',
                label:'FSimpleName'
            },
            filterText:'',
        }
    },
    props:{
        title:String,
        titleIcon:String
    },
    watch:{
        time(val){
            console.log(val);
            this.$emit('timeChange',val)
        },
        filterText(val){
            this.$refs.tree.filter(val);
        },
        active(val){
            this.$emit('typeChange',val)
        }
    },
    created(){
        this.queryProject()
    },
    mounted(){
    },
    methods:{
        /**
         * 查询左边树形数据(258.组织架构--查询树状集团项目)
         */
        queryProject(){
            this.$post('/QueryTORGGroupProjectTree',{
              FORGGroupGUID: '',
            })
            .then((result) => {
                console.log(result);
                this.projectList = [{
                   FSimpleName:sessionStorage.getItem('FGroupName')||'全部',
                   FGUID:'0000-0000-00000',
                   ProjectStr:'',
                   ListData:result.FObject||[]
                }]
                let node = this.projectList[0]
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(node.FGUID)
                })
                this.handleClick(node)
            }).catch((err) => {
                console.log(err);
            });
        },
        selectDateType(index){
            this.active = index
            this.time = new Date()
            this.$emit('typeChange',index)
        },
        pre(){
          let date = this.dateTypeList[this.active].preFun()
          this.time = new Date(date)
        },
        next(){
          let date = this.dateTypeList[this.active].nextFun()
          this.time = new Date(date)
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
.count-container{
    width:1907px;
    height:881px;
    margin: 10px auto;
    border:2px solid rgba(64, 120, 143, 0.59);
    border-radius:10px;
    display: flex;
    .count-box-bg{
        border-radius:10px 6px 6px 10px;
        background: rgba($color: #052256, $alpha: 0.29);
        box-shadow: 0 0 10px 4px rgba($color: #3068d1, $alpha: 0.29) inset;
    }
    .count-left{
        width:357px;
        height:850px;
        margin: 12px 14px 0 24px;
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
            height: 730px;
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
    .count-main{
        width: 1503px;
        height: 100%;
        h5{
            margin-top: 24px;
            padding-left: 16px;
            text-align: left;
            font-size: 18px;
            color: #AABED2;
            box-sizing: border-box;
        }
        &-header{
            height:55px;
            line-height: 55px;
            margin-top: 4px;
            padding-left: 18px;
            background:linear-gradient(90deg,rgba(17,45,69,0.34),rgba(16,52,78,0.34),rgba(15,60,89,0.34),rgba(15,64,94,0.34),rgba(16,71,101,0.34),rgba(15,66,95,0.34),rgba(15,61,87,0.34),rgba(16,50,77,0.34),rgba(18,45,72,0.34));
            border-radius:10px 6px 6px 10px;
            text-align: left;
            font-size: 20px;
            >i.iconfont{
                margin-right: 6px;
                font-size: 24px;
            }
            >div.r{
                margin-top: 6px;
                margin-right: 40px;
                display: flex;
                >ul,.time{
                    height: 40px;
                    line-height: 40px;
                    display: flex;
                    overflow: hidden;
                }
                >ul{
                    margin-right: 30px; 
                    border:1px solid rgba(143,156,191,1);
                    border-radius:4px;
                    li{
                        width: 76px;
                        box-sizing: border-box;
                        text-align: center;
                        cursor: pointer;
                        font-size: 18px;
                        color: #FFFFFF;
                    }
                    li.active{
                        background: #2774C8
                    }
                    li:nth-of-type(2){
                        border-left: 1px solid rgba(143,156,191,1);
                        border-right: 1px solid rgba(143,156,191,1);
                    }
                }
                .time{
                    .el-input{
                        width: 160px;
                        &__inner{
                            background-color: transparent;
                            border: none;
                            color: #A5EFFC;
                            font-size: 18px;
                        }
                        .el-input__prefix{
                            left: 0;
                            font-size: 20px;
                            color: #A5EFFC;
                        }
                    }
                    .iconfont{
                        cursor: pointer;
                    }
                    .icon-Leftparentheses{
                        margin-right: 10px;
                    }
                    .icon-Rightparentheses{
                        margin-left: -10px;
                        position: relative;
                        z-index: 10
                    }
                }
                .el-button{
                    margin-left: 30px;
                    width:114px;
                    height:46px;
                    background:rgba(0,80,153,1);
                    border:1px solid rgba(12,55,110,1);
                    color: #A5EFFC
                }
                .el-button:hover{
                    background:rgba(0,80,153,0.5);
                }
            }
        }
        .total-count{
            display: flex;
            height: 215px;
            margin-top: 8px;
            &-left{
                width: 456px;
                height: 100%;
                h5{
                    font-weight:400;
                }
                .content{
                    height: 173px;
                    position: relative;
                    z-index: 10;
                    display: flex;
                    .border-dashed{
                        position: absolute;
                        width: 142px;
                        height: 142px;
                        border: 1px dashed #1a478b;
                        border-radius: 50%;
                        left: 140px;
                        top: 0;
                        z-index: 5;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        .title {
                          font-size: 12px;
                          color: #f1f1f2;
                        }
                        .value {
                          margin-top: 10px;
                          font-size: 22px;
                          color: #00d294;
                        }
                    }
                    .current,.pre{
                        width:154px;
                        height:125px;
                        margin-top: 23px;
                        margin-left: 42px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        color: #B6C0DC;
                        .label{
                            font-size: 22px;
                        }
                        .value{
                            margin-top: 28px;
                            font-size: 32px;
                        }
                    }
                    .current{
                        background:rgba(12,50,117,0.59);
                        .value{
                            width: 100%;
                            overflow: hidden;
                            text-overflow: ellipsis
                        }
                    }
                }
            }
            &-right{
                width: 1037px;
                height: 100%;
                margin-left: 10px;
                .bar-chart{
                    height: 100%;
                    margin-left: 175px;
                    
                }
            }
        }
        .count-item,.count-ranking{
            height: 278px;
            margin-top: 13px;
                h5{
                    p{
                        text-align: center;
                        line-height: 30px;
                    }
                }
                .bar-chart{
                    height: 100%;
                    margin-left: 210px;
                }
        }
    }
}
</style>