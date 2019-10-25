<template>
  <div class="clearfix transfer">
    <div class="l transfer-item">
      <div class="border border-left-top"></div>
      <div class="border border-right-top"></div>
      <div class="border border-right-bottom"></div>
      <div class="border border-left-bottom"></div>
      <p class="transfer-item-head">{{leftTitle}}</p>
      <div style="height:250px">
        <el-scrollbar>
          <el-tree
            :data="data"
            show-checkbox
            default-expand-all
            :node-key="nodeKey"
            :check-strictly="checkStrictly"
            ref="tree"
            :default-checked-keys="defaultChecked"
            @check-change="checkChange"
            :render-content="renderContent"
            :props="defaultProps"
          >
          </el-tree>
        </el-scrollbar>
      </div>
    </div>
    <i class="arrow"></i>
    <div class="r transfer-item">
      <div class="border border-left-top"></div>
      <div class="border border-right-top"></div>
      <div class="border border-right-bottom"></div>
      <div class="border border-left-bottom"></div>
      <p class="transfer-item-head">{{rightTitle}}</p>
      <div style="height:250px">
        <el-scrollbar>
          <el-tree
            :data="data1"
            empty-text="无"
            class="checked"
            default-expand-all
            :node-key="nodeKey1"
            ref="tree1"
            :filter-node-method="filterNode"
            :render-content="renderContent1"
            :props="defaultProps"
          ></el-tree>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return{

      }
  },
  props: {
    leftTitle: {
      default: "",
      type: String
    },
    rightTitle: {
      default: "",
      type: String
    },
    data: {
      default:[],
      type:Array,
      required: true
    },
    data1: {
      default:[],
      type:Array,
      required: true
    },
    nodeKey: {
      type: String
    },
    nodeKey1:{
      type: String
    },
    filterNode: {
      type: Function
    },
    defaultProps:{
        type:Object
    },
    defaultChecked:{

    },
    renderContent:{
        type:Function
    },
    renderContent1:{
        type:Function
    },
    checkStrictly:{
      type:Boolean,
      default:false
    }
  },
  methods: {
    checkChange(data, check) {
      this.$emit("check-change", data, check);
    }
  }
};
</script>
<style lang="scss">
$img-url: "../../static/image/";
.transfer {
  position: relative;
  &-item-head{
    text-align: center
  }
  &-item {
    width: 173px;
    height: 283px;
    background: #18406b;
    position: relative;
    .border {
      width: 20px;
      height: 4px;
      background: rgba(38, 83, 148, 1);
      opacity: 0.7;
      border-radius: 2px;
      position: absolute;
    }
    .border-left-top {
      left: -6px;
      top: -2px;
    }
    .border-right-top {
      right: -6px;
      top: -2px;
    }
    .border-right-bottom {
      right: -6px;
      bottom: -2px;
    }
    .border-left-bottom {
      left: -6px;
      bottom: -2px;
    }
    &-head {
      font-size: 14px;
      color: #6ea7e4;
      margin-top: 10px;
    }
    .el-tree {
      /* height: 232px; */
      // overflow: auto;
      background: #18406b;
      margin-top: 19px;
      color: white;
      &-node__content:hover {
        background-color: #18406b;
        opacity: 0.5;
      }
    }
    .el-tree.checked {
      color: #a0a0a3;
    }
    .el-tree::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 5px;
    }
    .el-tree::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px #1752ba;
      background: #c1c1c1;
    }
    .el-tree::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px #1752ba;
      border-radius: 10px;
    }
  }
  .arrow {
    display: inline-block;
    width: 22px;
    height: 16px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: url("#{$img-url}admin/icon_1.png");
    animation: arrow 1.5s linear infinite;
  }
  @keyframes arrow {
    from {
      left: 173px;
    }
    to {
      left: 300px;
    }
  }
}
</style>