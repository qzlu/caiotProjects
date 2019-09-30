<template>
  <div id="app" :style="style">
      <header>
        <img class="logo" src="./assets/image/logo.png" alt="">
        <span class="project-name">{{projectName}}</span>
        <div>
          <p><span class="time">{{time}}</span><span>{{date}}</span></p>
          <p>
            <i :class="['iconfont',weather.WeatherIconID]"></i>
            {{weather.LowTemp}}°C ~ {{weather.HighTemp}}°C
          </p>
        </div>
      </header>
      <div class="main">
        <div class="main-top">
          <div class="image-content border l">
            <div class="image-active l">
              <div class="news">
                <i class="iconfont icon-ZS-news"></i>
                热烈欢迎天安智慧园区领导莅临新都汇交流指导
              </div>
              <img src="./assets/image/main-img.jpg" alt="">
            </div>
            <div class="image-list r">
              <img src="./assets/image/bg_img_2.jpg" alt="">
              <img src="./assets/image/bg_img_3.jpg" alt="">
              <img src="./assets/image/bg_img_4.jpg" alt="">
            </div>
          </div>
          <ul class="system border r">
            <li :class="[{'un-use':item.FState==2,'alarm':item.FState==1||item.FState==3}]" v-for="(item,i) in systemList" :key="i">
              <div class="statu">
                {{state[item.FState]}}
              </div>
              <div>
                <p>{{item.SystemParamName}}</p>
                <p><i :class="['iconfont',item.IconName]"></i></p>
              </div>
            </li>
          </ul>
        </div>
        <div class="main-bottom">
          <div class="calendar border">
            <Calendar
             :week-title='weekTitle'
             week-title-align='center'
             :show-term='false'
             :show-lunar='false'
             :show-festival='false'
             :week-count ='5'
             :render-content='renderContent'
            >
            </Calendar>
          </div> 
          <div class="order border">
            <div class="title">
              本月完成
            </div>
            <div class="time-line">
              <el-scrollbar>
                <el-timeline>
                  <el-timeline-item
                    v-for="(activity, index) in activities"
                    :key="index"
                   >
                    <i :class="['iconfont',activity.OrderTypeIcon]"></i>
                    {{activity.OrderTypeName}}次数
                    <div class="dotted"></div>
                    <span class="times">{{activity.OrdersCount}}</span> 次
                  </el-timeline-item>
                </el-timeline>
              </el-scrollbar>
            </div>
          </div>
          <div>
            <p><img src="./assets/image/caiot.png" alt=""></p>
            <p>扫一扫关注详情</p>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import {project,ProjectTrend,Orders} from '../caiot/request/api'
import formatDate from '@/utils/formatDate'
import lunarDateString from '@/utils/lunarDateString.js';
import Calendar from 'himmas-vue-calendar'
export default {
  name: 'App',
  data(){
    return{
      ratioHeigt:null,
      ratioWidth:null,
      time:null, //日期时间
      time1:null,
      date:null,
      date1:null,
      timer:null,
      timer1:null,
      projectName:localStorage.getItem('projectname')||'中物互联总部',
      state:['正常','异常','未开通','异常'],
      eventList:[],
      weather:{
          HighTemp:null,
          LowTemp:null,
          WhetherIconID:null
      },
      systemList:[],
      weekTitle:['SUN 日','MON 一','TUE 二','WED 三','THU 四','FRI 五','SAT 六'],
      activities: []
    }
  },
  components:{
    Calendar
  },
  computed:{
    style(){
      return {
        transform: "scale("+ this.ratioWidth + ',' + this.ratioHeigt + ")",
        transformOrigin: "left top ",
        backgroundSize: "100%" + ' 100%',
      }
    }
  },
  created(){
    window.addEventListener('resize',this.getHeight)
    this.getHeight()
    this.getTime()
    this.getWeather()
    this.getSystem()
    this.queryOrderByMonth()
  },
  methods:{
    getHeight(){
      this.ratioWidth = window.innerWidth/1920
      this.ratioHeigt=window.innerHeight/1080
    },
    renderContent(h, data){
      if(data.isOtherMonthDay){
        return
      }
      let date = formatDate(data.date,'YYYY-MM-DD')
      let event = this.eventList.find(item => item.FDate == date )
      return(
        <div class={{'today':data.isToday}}>
          <span class='event'>{
            event&&event.OrderContent
          }</span>
          <span class="day">
            <i class="circle" v-show={!data.isToday&&event}></i>
            {data.day}
          </span>
        </div>
      )
    },
    /**
     * 获取时间
     */
    getTime(){
        this.time = formatDate(new Date(),'YYYY/MM/DD')
        this.time1 = formatDate(new Date(),'YYYY-MM-DD')
        this.date = formatDate(new Date(),'EEE')
        this.date1 = lunarDateString(this.time1)
        this.timer = setTimeout(this.getTime,1000*60)
    },
    /**
     * getWeather 获取天气信息
     * 
     */
    getWeather() {
      project({
	      FAction: "GetPrjWeatherData",
	    })
	    .then(data => {
            this.weather = data.FObject[0]
	    })
	    .catch(error => {
	    })
    },
    /**
     * 获取八大系统
     */
    getSystem(){
      ProjectTrend({
          FAction: 'QuerySystemAlarmState'
      })
      .then((result) => {
          this.systemList = result.FObject
          console.log(result);
      }).catch((err) => {
          console.log(err)
      });
    },
    /**
     * 获取当月工单事件
     */
    queryOrderByMonth(){
      Orders({
        FAction: 'QueryOrderByMonth',
      })
      .then((result) => {
        console.log(result);
        this.activities = result.FObject.Table || []
        this.eventList = result.FObject.Table1 || []
      }).catch((err) => {
        
      });
    }
  }
}
</script>
<style lang="scss">
$url:'./assets/image/';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  -webkit-transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  background: url(#{$url}bg.jpg);
  .border{
    border:1px solid rgba(47,23,247,1);
  }
  header{
    height: 116px;
    position: relative;
    background: url(#{$url}nav_1.png) 96px no-repeat;
    img{
      position: absolute;
      left: 78px;
      top:27px;
    }
    .project-name{
      font-size:40px;
      font-family:Adobe Heiti Std;
      font-weight:normal;
      color:rgba(255,255,255,1);
      line-height:64px;
    }
    div{
      position: absolute;
      top: 20px;
      right: 20px;
      color: white;
      p{
        font-size: 22px;
        line-height: 40px;
        .time{
          margin-right: 10px;
        }
        .iconfont{
          font-size: 30px;
        }
      }
    }
  }
  .main{
    width: 100%;
    height: 964px;
    box-sizing: border-box;
    padding: 0 20px 24px 20px;
    &-top{
      width: 100%;
      height: 597px;
      .image-content{
        width: 1237px;
        height: 597px;
        .image-active{
          width: 1017px;
          height: 100%;
          position: relative;
          .news{
            width: 100%;
            height: 70px;
            line-height: 70px;
            position: absolute;
            top:0;
            left: 0;
            background:rgba(206,208,208,0.17);
            font-size: 24px;
            color: white;
            text-align: left;
            text-indent: 37px;
            i{
              font-size: 36px;
              vertical-align: bottom;
            }
          }
          img{
            width: 100%;
            height: 100%;
          }
        }
        .image-list{
          width: 219px;
          height: 100%;
          border-left: 1px solid rgba(47,23,247,1);
          img{
            width: 100%;
            height: 184px;
          }
        }
      }
      .system{
        width: 619px;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        color: rgba(255, 255, 255, 1);
        li{
          width: 304px;
          height: 140px;
          padding:0 34px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(36, 43, 92, 0.39);
          border-left: 4px solid rgba(17, 146, 165, 1);
            .statu{
                width:72px;
                height:124px;
                line-height: 124px;
                border:1px solid rgba(1,150,7,1);
                border-radius:9px;
                box-shadow:  0 0 14px rgba(1,150,7,1);
                position: relative;
                font-size: 28px;
                font-weight: 500;
                color: #02CD35;
            }
            .statu::after{
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
            @keyframes radar-beam {
                from{transform: rotate(0deg)}
                to{transform: rotate(360deg)}
            }
            div:last-of-type{
              width: 120px;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              p:first-of-type{
                font-size: 24px;
                line-height: 50px;
              }
              p:last-of-type{
                .iconfont{
                  font-size: 50px;
                }
              }
            }
        }
        li.un-use{
            .statu{
                border:1px solid #737373;
                box-shadow:  0 0 14px #737373;
                color:#737373;
                font-size: 22px;
            }
            .statu::after{
                background-image: linear-gradient(44deg, rgba($color: #fb0d0d,$alpha:0) 42%,rgba($color: #737373,$alpha:1));
            }
        }
        li.alarm{
          background: rgba(198, 41, 41, 0.39);
          border-left-color: rgba(207,31,74,1);
          .statu{
              border:1px solid #fb0d0d;
              box-shadow:  0 0 14px #fb0d0d;
              color: #fb0d0d;
          }
          .statu::after{
              background-image: linear-gradient(44deg, rgba($color: #fb0d0d,$alpha:0) 42%,rgba($color: #fb0d0d,$alpha:1));
          }
        }
      }
    }
    &-bottom{
      width: 100%;
      height: 332px;
      margin-top: 18px;
      display: flex;
      justify-content: space-between;
      .calendar{
        width: 957px;
        height: 332px;
        box-sizing: border-box;
        .kl-calendar{
          background: none;
          &_title-bar{
            display: none;
          }
          &_body{
            &-week-title{
              height: 58px;
              background: rgba(143, 145, 145, 0.2);
              color: white;
              font-size: 24px;
              border-bottom: none;
              &-item{
                line-height: 58px;
              }
            }
            &-week{
              font-size: 24px;
              color: rgba(143, 141, 141, 1);
              border-left: none;
              .kl-calendar_body-day{
                border-color: rgba(145, 146, 147, .7);
                >div{
                  width: 100%;
                  height: 100%;
                  position: relative;
                  .event{
                    width: 90px;
                    max-height: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    position: absolute;
                    left: 0;
                    bottom: 4px;
                    font-size:14px;
                    font-family:Microsoft YaHei;
                    font-weight:400;
                    color:rgba(132,242,255,1);
                  }
                  .day{
                    position: absolute;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    i{
                      position: absolute;
                      width:13px;
                      height:13px;
                      background:rgba(241,33,38,1);
                      border-radius:50%;
                      top: -6px;
                      right:-16px;
                    }
                  }
                }
                >div.today{
                  .day{
                    color: white
                  }
                }
              }
              .kl-calendar_body-day:last-of-type{
                border-right: none;
              }
            }
            &-week:last-of-type{
              .kl-calendar_body-day{
                border-bottom: none;
              }
            }
          }
        }
      }
      >div:last-child{
        width: 260px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img{
          width: 235px;
          height: 235px;
        }
        p{
          line-height: 40px;
          font-size:20px;
          font-family:Microsoft YaHei;
          font-weight:400;
          color:rgba(240,251,255,1);
        }
      }
      .order{
        width: 632px;
        height: 100%;
        .title{
          width: 166px;
          height: 86px;
          background:rgba(39,224,246,0.45);
          border-radius:10px 0px 0px 10px;
          font-size:22px;
          font-weight:400;
          color:rgba(246,247,243,1);
          line-height:40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .time-line{
          height: 100%;
          box-sizing: border-box;
          margin-top: 30px;
          margin-left: 52px;
          .el-timeline{
            padding-left: 10px;
            .el-timeline-item {
              padding-bottom: 14px;
            }
            .el-timeline-item__node{
              background-color: transparent;
              border: 1px solid rgba(193, 197, 197, 1)
            }
            .el-timeline-item__tail{
              position: absolute;
              top: 14px;
              left: 5px;
              height: calc(100% - 14px);
              border-left: 1px solid rgba(193, 197, 197, 1);
            }
            .el-timeline-item__content{
              display: flex;
              align-items: center;
              color: rgba(255, 255, 255, 1);
              text-align: left;
              font-size:18px;
              .iconfont{
                font-size: 24px;
                margin-right: 33px;
              }
              div.dotted{
                width: 217px;
                height: 0;
                margin: 0 20px;
                border-top: 1px dotted rgba(158, 160, 160, 1);
              }
              .times{
                color:rgba(132,242,255,1);
                font-size: 20px;
                margin-right: 6px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
