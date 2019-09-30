<template>
    <div class="left-aside-common">
        <card title="天气信息" :showMoreIcon = 'false' :height='214'>
            <div class="weather">
                <p class="time">{{time}}</p>
                <p class="date">{{date}}</p>
                <p>
                  <i :class="['iconfont', weather.WeatherIconID]"></i>
                  <i class="high-temp"><span>{{weather.HighTemp}}</span>℃</i>/<i class="" style="margin-left: 5px;">{{weather.LowTemp}}℃</i>
                </p>
            </div>
        </card>
        <card title="实时告警"  :height='328' @click="$router.push('/foreshow')">
            <div class="alarm-list">
                <el-scrollbar v-if="alarmData.length">
                    <ul>
                        <li v-for="(item,i) in alarmData" :key="i" @click="$router.push('/foreshow')">
                            <span>{{item.AlarmTime}}</span>
                            <span>{{item.AlarmText}}</span>
                        </li>
                    </ul>
                </el-scrollbar>
                <div v-else class="statu">
                    正常
                </div>
            </div>
        </card>
        <card title="实时工单"  :height='331' @click="$router.push('/TaskManagement/Worklist')">
            <div class="alarm-list">
                <el-scrollbar>
                    <ul>
                        <li v-for="(item,i) in orderData" :key="i" @click="$router.push('/TaskManagement/Worklist')">
                            <span>{{item.OrderCreateDateTime}}</span>
                            <span>{{item.OrderContent}}</span>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
        </card>
    </div>
</template>
<script>
import formatDate from '@/utils/formatDate'
import {project, Orders} from '@/caiot/request/api.js'
import Card from './card.vue'
export default {
    data(){
        return{
            time:null, //日期时间
            date:null,
            timer:null,
            timer1:null,
            weather:{
                HighTemp:null,
                LowTemp:null,
                WhetherIconID:null
            },
            alarmData:[], //实时告警数据
            orderData: [], //实时工单数据
        }
    },
    components:{
        Card
    },
    created(){
        this.getTime()
        this.queryData()
    },
    beforeDestroy(){
        clearTimeout(this.timer)
        clearTimeout(this.timer1)
        this.timer = null
        this.timer1 = null
    },
    methods:{
        /**
         * 获取时间
         */
        getTime(){
            this.time = formatDate(new Date(),'YYYY-MM-DD HH:mm')
            this.date = formatDate(new Date(),'EEE')
            this.timer = setTimeout(this.getTime,1000)
        },
        queryData(){
            this.getWeather()
            this.getAlarmRealData()
            this.queryPageUOrdersByDate()
            this.timer1 = setTimeout(this.queryData,5000)
        },
        /**
         * getWeather 获取天气信息
         * @private
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
         * 7.获取项目实时未恢复告警
         */
        getAlarmRealData(){
            project({
                FAction: 'GetAlarmRealData'
            })
            .then((result) => {
                this.alarmData = result.FObject||[]
            }).catch((err) => {
                
            });
        },
        /**
         * 实时工单
         */
        queryPageUOrdersByDate(){
            Orders({
                FAction: 'QueryPageUOrdersByDate',
                FState: -1,
                PageIndex:1,
                PageSize: 1000
            })
            .then((result) => {
                this.orderData = result.FObject
            }).catch((err) => {
                
            });
        },
    }
}
</script>
<style lang="scss">
.left-aside-common{
    width: 300px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .weather{
        margin-top: 23px;
        font-size:20px;
        font-family:BigYoungBoldGB20;
        font-weight:400;
        color:rgba(96,122,179,1);
        p:last-of-type{
            line-height: 60px;
            .iconfont{
                color: #2A91FC;
                font-size: 60px;
                vertical-align: middle;
            }
            .high-temp{
                color: #2A91FC;
                span{
                    font-size: 32px;
                }
            }
        }
    }
    .alarm-list{
        margin-top: 10px;
        height: 260px;
        padding:  0 10px;
        position: relative;
        ul{
            li{
                line-height: 50px;
                display: flex;
                justify-content: space-between;
                border-bottom: 1px dashed #FFFFFF;
                cursor: pointer;
            }
        }
        .statu{
            width:72px;
            height:124px;
            line-height: 124px;
            border:1px solid rgba(1,150,7,1);
            border-radius:9px;
            box-shadow:  0 0 14px rgba(1,150,7,1);
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
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
    }
}
</style>