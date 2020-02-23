<template>
  <div :class="['device-params',{'device-params-border':showBorder&&data[defaultProps.statu] != 5,alarm:data[defaultProps.statu] == 5}]">
    <h6>
      {{data.DeviceName}}
      <i :class="['r',{'el-icon-star-off':data.IsFocus == 0,'el-icon-star-on':data.IsFocus == 1}]" @click="store(data)"></i>
    </h6>
    <div class="device-param">
      <ul>
        <li :class="[`param-${item[defaultProps.position]}`,{active:acitveItem[defaultProps.position] == item[defaultProps.position]&&showActive}]" v-for="item in data[defaultProps.children]" @click="dataItemClick(item)" :key="item[defaultProps.position]">
          <el-tooltip placement="top center" effect="light" v-if="Array.isArray(item[defaultProps.value])">
            <div slot="content">
              <span v-for="(value, i) in item[defaultProps.value]" :key="i" class="value">
                {{value.DValue}}
                <i v-if="i<item[defaultProps.value].length-1">/</i>
              </span>
            </div>
            <p>
              <span v-for="(value, i) in item[defaultProps.value]" :key="i" class="value">
                {{value.DValue}}
                <i v-if="i<item[defaultProps.value].length-1">/</i>
              </span>
            </p>
          </el-tooltip>
          <el-tooltip placement="top center" effect="light"  v-else>
            <div slot="content">
              {{item[defaultProps.value]}}
            </div>
            <p><span class="value">{{item[defaultProps.value]}}</span></p>
          </el-tooltip>
          <p class="value-label">
            {{item[defaultProps.label]}}
            <span v-if="item[defaultProps.unil]">({{item[defaultProps.unil]}})</span>
          </p>
        </li>
      </ul>
      <div :class="['device-status',`device-status-${data[defaultProps.statu]}`]">
        <p>
          <i :class="['iconfont',data[defaultProps.icon]]"></i>
        </p>
        <p>{{data[defaultProps.statuText]}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        defaultProps:{

        },
        acitveItem:{}
    };
  },
  props: {
    data: {
      type: Object
    },
    showBorder: {
      type: Boolean,
      default: true
    },
    showActive:false,
    props:{
        default:() => {return {}}
    }
  },
  watch:{
    data(){
      this.acitveItem = this.data[this.defaultProps.children]&&this.data[this.defaultProps.children][0] || {}
    }
  },
  created(){
      this.defaultProps = {
          icon:'IconName',
          children:'DataDetail',
          statu:'DeviceStatus',
          statuText:"DeviceStatusName",
          position:'SDataID',
          label:'ShowName',
          value:'SDataValue',
          unil:'Unit',
          ...this.props
      }
      this.acitveItem = this.data[this.defaultProps.children]&&this.data[this.defaultProps.children][0] || {}
  },
  methods: {
    store(data) {
      this.$emit("store", data);
    },
    dataItemClick(data){
      this.acitveItem = data
      this.$emit('data-item-click',data)
    }
  }
};
</script>

<style lang="scss">
$url:'../../assets/image/cloud/index';
.device-params {
  height: 100%;
  padding: 20px 14px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  h6 {
    font-size: 16px;
    color: #525e7e;

    i {
      font-size: 24px;
      color: #2a91fc;
      cursor: pointer;
    }
  }

  .device-param {
    height: calc(100% - 20px);
    position: relative;

    ul {
      width: 100%;
      height: 100%;

      li {
        width: calc(50% - 30px);
        overflow: hidden;
        position: absolute;
        text-align: left;
        cursor: pointer;
        p {
          line-height: 24px;

          .value {
            font-size: 16px;
            color: #03cd82;
          }
        }

        p.value-label {
          font-size: 12px;
          color: #a0a0a3;
        }
      }
      li.active{
        background:rgba(12,50,117,0.59);
      }
      li.param-1 {
        left: 0px;
        top: 20px;
      }

      li.param-2 {
        top: 20px;
        right: 0px;
        text-align: right;
      }

      li.param-3 {
        left: 0px;
        top: 80px;
      }

      li.param-4 {
        right: 0px;
        top: 80px;
        text-align: right;
      }

      li.param-5 {
        left: 0px;
        top: 140px;
      }

      li.param-6 {
        right: 0px;
        top: 140px;
        text-align: right;
      }

      li.param-7,
      li.param-8,
      li.param-9 {
        display: none;
      }
    }

    .device-status {
      position: absolute;
      top: 50px;
      left: 50%;
      transform: translateX(-50%);
      color: #03cd82;
      p {
        text-align: center;
        line-height: 30px;
        font-size: 16px;
        .iconfont {
          font-size: 50px;
        }
      }
    }
    .device-status.device-status-1{
        color: #1bd1a1
    }
    .device-status.device-status-2{
        color: #73777a
    }
    .device-status.device-status-3{
        color: #0091fe
    }
    .device-status.device-status-4{
        color: #fef500
    }
    .device-status.device-status-5{
        color: #9c1428
    }
  }
}

.device-params-border {
  &:before {
    display: block;
    width: 193px;
    height: 4px;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    bottom: 4px;
    content: "";
    background: url(#{$url}/border-bottom.png)
  }

  &:after {
    display: block;
    width: 4px;
    height: 193px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 4px;
    content: "";
    background: url(#{$url}/border-right.png);
  }
}
.device-params.alarm{
    border-radius: 10px 6px 6px 10px;
    background: rgba($color: #560505, $alpha: 0.2);
    box-shadow: 0 0 100px 20px rgba(150, 14, 14, 0.3) inset;
}
</style>
