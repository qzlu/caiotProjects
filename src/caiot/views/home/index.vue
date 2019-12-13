<template>
  <div class="home qianren">
    <Layout :formIndex='2'>
      <router-view></router-view>
    </Layout>
   <!-- <router-view></router-view> -->
  </div>
</template>
<script>
import Layout from '@/layout/layout.vue'
import("@/assets/css/index.scss");
export default {
  data() {
    return {
      user: sessionStorage.getItem("FContacts"), //用户名
      projectName: sessionStorage.getItem("FGroupName"),
      token:sessionStorage.getItem('FToken'),
      isOpen: 1,
      guid:{IDStr:0}, //查询的IDStr
      currentBlock:{},
      userType:sessionStorage.getItem('FUserType'),
      count:{},
      alarmData:[],
      orderData:[],
      treeData:[],
      showProjectList:false, //项目导航下拉
      treeProp:{
          children:'ListData',
          label:'FSimpleName'
      },
      filterText:'',
      timer:null,
      systemMenu:JSON.parse(sessionStorage.getItem('systemMenu')),//后台管理菜单
      formName:sessionStorage.getItem("formName")||'中物运营智服云平台',
      logoImg:sessionStorage.getItem('logo')?`http://47.107.224.8:8080/${sessionStorage.getItem('logo')}`:require("@/assets/image/logo-caiot.png"),
    };
  },
  components: {
    Layout
  },
  watch: {
    filterText(val){
        this.$refs.tree.filter(val);
    },
  },
  beforeCreate() {},
  created() {
 /*    this.queryProject()
    this.queryData() */
  },
  mounted() {
/*     this.$nextTick(() => {
      let el = document.querySelector('#tree-project')
      document.addEventListener('click', (e) => {
        if(!el.contains(e.target)){
          this.showProjectList = false
        }
      })
    }) */
  },
  beforeDestroy(){
    clearTimeout(this.timer)
    this.timer = null
  },
  methods: {
    /**
     * 退出
     */
    logOut() {
      location.href = 'login.html'
    },
    /**
     * 修改密码
     */
    changePassword(newPsd, oldPsd) {
      System({
        FAction: "UpadatePassword",
        NewFPassword: newPsd,
        FPassword: oldPsd
      })
        .then(data => {
          this.$message({
            type: "success",
            message: "密码修改成功,3秒后退出登录",
            druration: 1000
          });
          setTimeout(() => {
            this.$router.push("/login");
          }, 3000);
        })
        .catch(err => {});
    },
    /**
     * 切换声音开关
     */
    switchAudio() {
      if (this.isOpen == 1) {
        this.isOpen = 0;
        localStorage.setItem("open", 0);
        document.getElementById("myAudio").pause();
      } else {
        this.isOpen = 1;
        localStorage.setItem("open", 1);
      }
    },
    queryData(){
      clearTimeout(this.timer)
      this.timer = null
      this.queryBlocAlarmRealData()
      this.queryBlocPageUOrdersByDate()
      this.queryUSituationStatistics()
      this.timer = setTimeout(() => {
        this.queryData()
      },1000*10)
    },
    /**
     * 57.集团首页--查询集团实时未恢复告警
     */
    queryBlocAlarmRealData(){
        this.$post('/QueryBlocAlarmRealData',{
          FORGGroupGUID: this.currentBlock.FGUID||'',
            ...this.guid
        })
        .then((result) => {
            this.alarmData = result.FObject||[]
        }).catch((err) => {
            
        });
    },
    /**
     * 56查询未恢复任务
     */
    queryBlocPageUOrdersByDate(){
        this.$post('/QueryBlocPageUOrdersByDate',{
          FORGGroupGUID: this.currentBlock.FGUID||'',
            ...this.guid,
            OrderState:-1,
            PageIndex:1,
            PageSize:1000
        })
        .then((result) => {
            this.orderData = result.FObject||[]
        }).catch((err) => {
            
        });
    },
    /**
     * 386.综合态势（设备统计  告警统计 任务统计）
     */
    queryUSituationStatistics() {
        this.$post('/QueryBlocUSituationStatistics',{
          FORGGroupGUID: this.currentBlock.FGUID||'',
          ...this.guid
        })
        .then(result => {
          this.count = result.FObject[0] || {};
        })
        .catch(err => {});
    },
    /**
     * 查询左边树形数据(258.组织架构--查询树状集团项目)
     */
    queryProject(){
        this.$post('/QueryTORGGroupProjectTree',{
          FORGGroupGUID: '',
        })
        .then((result) => {
          this.treeData = result.FObject||[]
          if(this.userType == 1){
            this.treeData.unshift({
              FGUID: "",
              FGroupCode: "",
              FGroupName: "中物运营",
              FNodeType: 1,
              FSimpleName: "中物运营",
            })
          }
        }).catch((err) => {
            
        });
    },
    filterNode(value, data) {
        if (!value) return true;
        return data.FSimpleName.indexOf(value) !== -1;
    },
    /**
     * 选择集团
     */
    slectBlock(node){
      if(node.FNodeType == 1){
        this.currentBlock = node
        this.queryData()
      }
    }
  }
};
</script>
<style lang="scss">
$url: "../../../assets/image/";
.home.qianren {
  padding: 2px;
  background: url("#{$url}qianren/index-bg.jpg");
  .header {
    position: relative;
    .logo{
      width:160px;
      height: 60px;
      line-height: 60px;
      position: absolute;
      top: 10px;
      left: 10px;
      img{
        max-width: 160px;
        max-height: 60px;
        vertical-align: middle;
      }
    }
    ul.menu {
      position: absolute;
      top: 48px;
      .menu-item {
        width: 170px;
        height: 44px;
        line-height: 44px;
        position: relative;
        float: left;
        /* display: inline-block; */
        color: #84f2ff;
        font-size: 20px;
        cursor: pointer;
        a{
          display: block;
          width: 100%;
          height: 100%;
          color: #84f2ff;
          font-size: 20px;
          background: url(#{$url}qianren/menu-bg.png);
        }
        a.router-link-active{
          background: url(#{$url}qianren/menu-active.png);
          color: #F5DCAD
        }
      }
    }
    .menu-left{
      right: 1226px;
    }
    .menu-right{
      left:1226px;
    }
    >#tree-project{
      right: 90px;
      top: 60px;
      position: absolute;
      .tree-project{
          position: absolute;
          width: 164px;
          height: 320px;
          top: 20px;
          z-index: 100;
          background: #0D2F60;
          .filter-box{
              padding: 10px;
              .el-input__suffix{
                line-height: 34px;
              }
          }
          .tree-content{
              height: 280px;
              .el-tree{
                  color:#F1F1F2;
                  font-size: 18px;
                  background: #0D2F60;
                  &-node__content{
                      height: 40px;
                      line-height: 40px;
                      span{
                          font-size: 16px;
                      }
                      a{
                        color:#F1F1F2;
                        font-size: 16px;
                      }
                  }
                  .el-tree-node:hover,.el-tree-node:focus {
                      >.el-tree-node__content {
                          background:#355B95;
                      }
                  }
              }
          }
      }
    }
  }
  .count-data{
    height: 77px;
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    &-side{
      width: 366px;
      position: relative;
      background: url('#{$url}/cloud/index/number.png');
      >span{
          position: absolute;
          bottom: 10px;
          right: 16px;
      }
    }
    &-center{
      width: 1070px;
      display: flex;
      justify-content: center;
      .iconfont{
          font-size: 28px;
          line-height: 40px;
      }
      li{
          >div{
              p{
                  
              }
          }
          >p{
              margin-left: 20px;
              font-size:36px;
              font-family:MicrosoftYaHeiUI-Bold;
              font-weight:bold;
              color:rgba(132,242,255,1);
              line-height: 64px;
          }
      }
      li+li{
          margin-left: 50px;
      }
    }

  }
  .compre-hensive {
    .aside {
      width: 413px;
      .side-content {
        height: 890px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .border{
            height: 1px;
            margin: 9px 25px 0 13px;
            background: #07A6FF;
        }
        .icon{
            width: 100px;
            height: 6px;
            margin-left:13px;
            position: relative;
            background: #07A6FF;
        }
        .icon:after{
            display: block;
            width: 0px;
            height: 0px;
            position: absolute;
            right: -6px;
            border: 3px solid transparent;
            border-top-color: #07A6FF;
            border-left-color: #07A6FF;
            content: ""
        }
        .card {
          width: 100%;
          height: 440px;
          background: url(#{$url}cloud/index/leftbar.png);
          background-size: 100% 100%;
          h4.title {
            /* line-height: 40px; */
            padding: 20px 37px 0 6px;
            text-align: left;
            font-size: 18px;
            font-weight: 400;
            .iconfont.icon-Up {
              display: inline-block;
              transform: rotate(90deg);
              font-size: 24px;
            }
            p {
              position: relative;
              .sort-type {
                position: absolute;
                width: 16px;
                height: 18px;
                line-height: 18px;
                left: -20px;
                top: -4px;
                cursor: pointer;
                background: rgba(170, 29, 48, 1);
                border-radius: 4px;
                text-align: center;
                font-size: 16px;
                .iconfont {
                  font-size: 12px;
                  margin-right: 0;
                }
              }
              .sort-type.sort-type-true {
                background: #00d294;
              }
            }
          }
          .pie-chart {
            width: 100%;
            height: 142px;
            margin: 22px 0;
            position: relative;
            .border-dashed {
              position: absolute;
              width: 142px;
              height: 142px;
              border: 1px dashed #1a478b;
              border-radius: 50%;
              left: 27px;
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
            ul {
              position: absolute;
              height: 100%;
              top: 0;
              right: 40px;
              text-align: right;
              font-size: 17px;
              color: #f1f1f2;
              display: flex;
              flex-direction: column;
              justify-content: center;
              li{
                line-height: 24px;
              }
            }
          }
          .top5 {
            padding: 0 22px;
            h5 {
              display: flex;
              justify-content: space-between;
              font-size: 14px;
              p {
                position: relative;
                .sort-type {
                  position: absolute;
                  width: 16px;
                  height: 18px;
                  line-height: 18px;
                  left: -20px;
                  top: -4px;
                  cursor: pointer;
                  background: rgba(170, 29, 48, 1);
                  border-radius: 4px;
                  .iconfont {
                    margin-right: 0;
                    font-size: 12px;
                  }
                }
                .sort-type.sort-type-true {
                  background: #00d294;
                }
              }
            }
            ul {
              margin-top: 10px;
              li {
                display: flex;
                align-items: center;
                line-height: 30px;
                font-size: 14px;
                .index {
                    display: inline-block;
                    width: 40px;
                    margin-right: 10px;
                }
                .device-type {
                  width: 100px;
                  text-align: left;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                .bar-out {
                  width: 190px;
                  height: 8px;
                  .bar-inner {
                    width: 0;
                    height: 100%;
                    transition: 0.3s;
                    background: #18de94;
                  }
                }
                .value {
                  width: 50px;
                  text-align: right;
                }
              }
            }
          }
          .top5.energy-rate{
            ul{
              li{
                .bar-out{
                  width: 130px;
                  height: auto;
                }
                .value{
                  width: 130px;
                  text-align: center
                }
              }
            }
            ul.list-body{
              .bar-out,.value{
                font-size: 20px;
              }
            }
          }
          .item-list {
            margin-top: 20px;
            display: flex;
            justify-content: space-around;
            line-height: 40px;
            color: #607ab3;
            li {
              .label {
                font-size: 16px;
              }
              .value {
                font-size: 24px;
              }
            }
          }
          .chart {
            width: 100%;
            height: 313px;
          }
        }
        .list{
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            >li{
                position: relative;
                height: 219px;
                overflow: hidden;
                a{
                  width: 100%;
                  height: 219px;
                  display: block;
                  color: #a5effc;
                  position: absolute;
                  z-index: 10;
                }
                h4{
                    padding-top: 10px;
                    .iconfont.icon-Up{
                        display: inline-block;
                        transform: rotate(90deg);
                        font-size: 24px;
                    }
                    p.r{
                        margin-right: 20px;
                        .iconfont{
                          font-size: 20px;
                        }
                    }
                }
                .list-content{
                    height: 160px;
                    display: flex;
                    align-items: center;
                    .statu1{
                        width:72px;
                        height:124px;
                        line-height: 124px;
                        border:1px solid rgba(1,150,7,1);
                        border-radius:9px;
                        box-shadow:  0 0 14px rgba(1,150,7,1);
                        position: relative;
                        left:14px;
                        font-size: 28px;
                        font-weight: 500;
                        color: #02CD35;
                    }
                    .statu1::after{
                        content: "";
                        display: block;
                        background-image: linear-gradient(44deg, rgba(0, 255, 51, 0) 42%, #00ff33 100%);
                        width: 36px;
                        height: 36px;
                        position: absolute;
                        top: 26px;
                        left: 0;
                        animation: radar-beam 3s infinite;
                        animation-timing-function: linear;
                        transform-origin: bottom right;
                        border-radius: 100% 0 0 0;
                    }
                    .statu1.alarm{
                        border:1px solid #fb0d0d;
                        box-shadow:  0 0 14px #fb0d0d;
                        color: #fb0d0d;
                    }
                    .statu1.alarm::after{
                        background-image: linear-gradient(44deg, rgba($color: #fb0d0d,$alpha:0) 42%,rgba($color: #fb0d0d,$alpha:1));
                    }
                    @keyframes radar-beam {
                        from{transform: rotate(0deg)}
                        to{transform: rotate(360deg)}
                    }
                    .param {
                        right: 38px;
                        li{
                            height: 30px;
                            display: flex;
                            justify-content: space-between;
                            p{
                                display: flex;
                                align-items: center;
                            }
                        }
                    }
                }
            }
        }
      }
    }
    .main {
      margin: 0 423px;
    }
  }
}
</style>
