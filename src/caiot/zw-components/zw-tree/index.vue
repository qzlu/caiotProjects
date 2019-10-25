<template>
  <div class="clearfix zw-tree">
      <div class="border border-left-top"></div>
      <div class="border border-right-top"></div>
      <div class="border border-right-bottom"></div>
      <div class="border border-left-bottom"></div>
      <p class="zw-tree-head">{{title}}</p>
      <div style="height:250px">
        <el-scrollbar>
          <el-tree
            :data="data"
            :show-checkbox='showCheckbox'
            default-expand-all
            :node-key="nodeKey"
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
</template>
<script>
export default {
  data() {
      return{

      }
  },
  props: {
    title: {
      default: "",
      type: String
    },
    data: {
      default:[],
      type:Array,
      required: true
    },
    nodeKey: {
      type: String
    },
    defaultProps:{
        type:Object
    },
    defaultChecked:{

    },
    renderContent:{
        type:Function
    },
    showCheckbox:{
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
.zw-tree {
  width: 173px;
  height: 283px;
  background: #18406b;
  position: relative;
  &-head{
    text-align: center
  }
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
      height: 232px;
      // overflow: auto;
      background: #18406b;
      margin-top: 19px;
      color: white;
      .el-tree-node:focus>.el-tree-node__content {
          background:rgba(19,79,164,1);
          opacity:0.5;
      }
      &-node__content:hover {
        background-color: #18406b;
        opacity: 0.5;
      }
    }
    .el-tree.checked {
      color: #a0a0a3;
    }
}
</style>