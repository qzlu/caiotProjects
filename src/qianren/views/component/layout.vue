<template>
  <div class="home qianren child-system">
    <div class="header">
      <router-link to="/">
        <div class="logo">
          <img :src="logoImg" alt="">
        </div>
      </router-link>
      <span class="title">{{formName}}</span>
      <ul class="clearfix" style="top:10px;right:16px">
        <li class="l">
            <div id="tree-project" class="r" >
                  <p @click="showProjectList = !showProjectList">项目导航 <i :class="showProjectList?'el-icon-caret-top':'el-icon-caret-bottom'"></i></p>
                  <div class="tree-project" v-if="showProjectList">
                      <div class="filter-box">
                          <el-input
                            placeholder="搜索关键字"
                            v-model="filterText">
                            <i class="el-icon-search" slot="suffix"></i>
                          </el-input>
                      </div>
                      <div class="tree-content">
                          <el-scrollbar>
                              <el-tree
                                  ref="tree"
                                 :data="treeData"
                                 :props="treeProp"
                                 default-expand-all
                                 @node-click="slectBlock"
                                 :expand-on-click-node="false"
                                 :filter-node-method="filterNode"
                              >
                                <template v-slot="{node,data}">
                                  <div style="width:100%;text-align:left">
                                    <span v-if="data.FNodeType == 1">{{data.FSimpleName}}</span><!-- www.szqianren.com -->
                                    <a v-if="data.FNodeType == 2" style="display:block;width:100%;height:100%" :href="`http://www.szqianren.com/#/?token=${token}&projectID=${data.ProjectID}&showMenu=2&user=${user}`" target="_blank">{{data.FSimpleName}}</a>
                                  </div>
                                </template>
                              </el-tree>
                          </el-scrollbar>
                      </div>
                  </div>
            </div>
        </li>
        <li class="l icon" v-if="systemMenu&&systemMenu.length>0">
            <router-link :to="`/manage`"  class="icon-item">
                <i class="iconfont icon-zs-backstage"></i>
            </router-link>
        </li>
        <li class="l icon" @click="switchAudio">
          <i :class="['iconfont', {'icon-ZS-news':isOpen == 1,'icon-Soundoff':isOpen == 0}]"></i>
        </li>
        <li class="l icon">
          <el-dropdown>
            <div class="el-dropdown-link icon-item">
              <i class="iconfont icon-User"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="show = true">设置密码</el-dropdown-item>
              <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li class="l user-name">{{user}}</li>
        <!-- <set-password :show.sync='show' @confirm="changePassword"></set-password> -->
      </ul>
    </div>
    <div class="compre-hensive">
        <slot></slot>
    </div>
  </div>
</template>
<script>
import { setPassword } from "@/components/index.js";
import("@/assets/css/index.scss");
export default {
  data() {
    return {
      user: sessionStorage.getItem("FContacts"), //用户名
      projectName: sessionStorage.getItem("FGroupName"),
      isOpen: 1,
      treeData:[],
      showProjectList:false, //项目导航下拉
      treeProp:{
          children:'ListData',
          label:'FSimpleName'
      },
      filterText:'',
      systemMenu:JSON.parse(sessionStorage.getItem('systemMenu')),//后台管理菜单
      logoImg:sessionStorage.getItem('logo')?`http://47.107.224.8:8080/${sessionStorage.getItem('logo')}`:require("@/assets/image/logo-caiot.png"),
    };
  },
  props:{
      formName:{
        type:String
      }
  },
  components: {
    setPassword,
  },
  watch: {
    filterText(val){
        this.$refs.tree.filter(val);
    },
  },
  beforeCreate() {},
  created() {},
  mounted() {
    this.$nextTick(() => {
      let el = document.querySelector('#tree-project')
      document.addEventListener('click', (e) => {
        if(!el.contains(e.target)){
          this.showProjectList = false
        }
      })
    })
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
      this.$router.push("/login");
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
        return data.FORGName.indexOf(value) !== -1;
    },

    /**
     * 选择集团
     */
    slectBlock(node){
      if(node.FNodeType == 1){
        this.currentBlock = node
        this.queryData()
        this.$refs.map.queryMapData(node.FGUID)
        this.queryBlocEnergyByMonth();
        this.queryBlocQueryEnergyByMonth()
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
        background: url(#{$url}qianren/menu-bg.png);
        color: #84f2ff;
        font-size: 20px;
        cursor: pointer;
      }
      .menu-item.active {
        background: url(#{$url}qianren/menu-active.png);
        color: #F5DCAD
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
  .compre-hensive {
    margin-top: 16px;
    .aside {
      width: 413px;
      .side-content {
        height: 890px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
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
                top: -10px;
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
                a{
                  width: 100%;
                  height: 100%;
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
                    height: 170px;
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
.child-system{
  .header{
    >ul{
      >li{
        >#tree-project{
          position: absolute;
          left: -120px;
          top: 17px;
          cursor: pointer;
          font-size: 16px;
          .tree-project{
              position: absolute;
              width: 164px;
              height: 320px;
              top: 34px;
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
    }
  }
  .aside{
    .side-content{
      ul{
        li{
          .chart{
            height:180px;
            position:relative;
            .border-dashed{
              width: 162px;
              height: 162px;
              position:absolute;
              top: 0;
              left: 118px;
              border: 1px dashed #1A478BFF;
              border-radius:50%;
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
              margin-top: 10px;
              li {
                display: flex;
                align-items: center;
                line-height: 20px;
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
                  height: 10px;
                  .bar-inner {
                    width: 0;
                    height: 100%;
                    transition: 0.3s;
                    background: #18de94;
                    border-radius: 2px;
                  }
                }
                .value {
                  width: 50px;
                  text-align: right;
                }
              }
            }
          }
          .video-container{
            height: 620px;
            .video-list{
              padding: 10px;
              display: flex;
              flex-wrap: wrap;
              justify-content:space-between;
              li{
                width: 192px;
                height: 190px;
                margin-top: 0px;
                img{
                  width: 192px;
                  height: 190px;
                }
              }
              li.top10{
                margin-top: 10px;
              }
            }
          }
        }
      }
    }
  }
  .aside.project-list{
    .side-content{
      ul.list{
        >li{
          h4{
            width: 188px;
            height: 44px;
            line-height: 36px;
            padding-top: 0!important;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            background: url('../../../assets/image/cloud/index/bg_4.png') no-repeat;
            font-size: 18px;
            font-weight: 400;
            color: #9ee5f3;
            text-align: center;
          }
          .project-video{
            height: 180px;
            padding: 0 8px 0 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            img{
              width: 360px;
              height: 150px;
            }
            >div.more{
              width: 21px;
              height: 115px;
              line-height: 30px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              background: #3968AF;
            }
          }
        }
      }
    }
  }
  .main{
    .monitor-alarm{
        width: 100%;
        height: 288px;
        border-radius: 10px;
        background: rgba($color: #14336B, $alpha: 0.34);
        h5{
            padding-left: 30px;
            line-height: 38px;
            /* color: #18A1EC; */
            cursor: pointer;
            font-size: 16px;
            text-align: left;
            .iconfont:first-of-type{
                font-size: 20px;
                margin-right: 10px;
            }
            .icon-Up{
                margin-left: 10px;
                display: inline-block;
                transform: rotate(90deg);
            }
        }
        .border{
            height: 1px;
            margin: 0px 25px 0 13px;
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
        .table-header{
            width: 100%;
            tr{
                th{
                    font-size: 16px;
                }
            }
        }
        tr{
            height: 38px;
            line-height: 38px;
            th{
                font-size: 14px;
                text-align: center;
                color: #F1F1F2
            }
        }
        .table-body{
            height: 200px;
            table{
                width: 100%;
                tr{
                    line-height: 38px;
                    cursor: pointer;
                    text-align: center;
                    td{
                        display: inline-block;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    td.warning{
                      color: #E0E213
                    }
                }
                tr:nth-of-type(2n+1){
                    background: rgba(158,229,243,.2);
                }
                tr:nth-of-type(2n){
                    background:rgba($color: #102E58, $alpha: .2);
                }
              }
        }
    }
    #map{
      height: 600px;
      position: relative;
      ul.map-aside{
        position: absolute;
        bottom: 20px;
        li{
          width:254px;
          height:78px;
          margin-top: 40px;
          background:linear-gradient(90deg,rgba(3,20,50,0.5),rgba(24,90,157,0.5));
          border-radius:39px;
          color: #2A91FC;
          display: flex;
          align-items: center;
          justify-content: space-around;
          .icon{
              font-size: 14px;
              .iconfont{
                  font-size: 36px;
              }
          }
          .value{
              font-size: 30px;
              font-weight:bold;
          }
        }
      }
      ul.map-left{
        left: 0px;
      }
      ul.map-right{
        right: 0px;
        li{
          background:linear-gradient(90deg,rgba(24,90,157,0.5),rgba(3,20,50,0.5));
        }
      }
    }
  }
}
</style>
