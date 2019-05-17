<template>
    <div class="home cloud">
        <div class="header">
            <span class="title">中物互联数字消防云平台</span>
            <ul class="clearfix">
                <li class="l icon">
                    <el-dropdown>
                      <div class="el-dropdown-link icon-item">
                        <i class="iconfont icon-User"></i>
                      </div>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="show1 = true">设置密码</el-dropdown-item>
                        <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                </li>
                <li class="l user-name">张三</li>
            </ul>
        </div>
        <div class="left-side l">
            <div class="side-header clearfix">
                <number class="l" :data="fireAlarmData?fireAlarmData.FTotalCount:0"></number>
                <span>火警总数</span>
            </div>
            <div class="side-content">
                 <el-scrollbar>
                     <ul class="list">
                         <li :class="{alarm:i===0}" v-for="(item,i) in systemList" :key="i">
                             <h4>
                                <i class="iconfont icon-Lift"></i>
                                {{item[0].SystemParamName}}
                            </h4>
                            <div class="list-content">
                                <div class="statu">
                                </div>
                                <ul class="param">
                                    <li v-for="(obj,j) in item" :key="j">
                                        <p class="l">
                                            <i :class="['iconfont',obj.IconName]"></i>
                                            {{obj.CountName}}
                                        </p>
                                        <span class="value">
                                            10 / 0
                                        </span>
                                    </li>
                                </ul>
                            </div>
                         </li>
                     </ul>
                 </el-scrollbar>
            </div>
        </div>
        <div class="right-side r">
            <div class="side-header clearfix">
                <number class="l" :data="wariningData?wariningData.FTotalCount:0"></number>
                <span>预警总数</span>
            </div>
            <div class="side-content">
                 <el-scrollbar>
                     <ul class="list">
                         <li :class="{alarm:item.FireCount>0}" v-for="(item,i) in fireList" :key="i">
                             <h4>{{item.ProjectName}}</h4>
                             <div class="list-content">
                                <div class="statu"></div>
                                <ul  class="param clearfix">
                                    <li class="l" style="margin-bottom: 30px;">
                                        <i class="iconfont icon-FireAlarm"></i>
                                        <span class="value">{{item.FireCount}}</span>
                                    </li>
                                    <li class="l" style="margin-bottom: 30px;">
                                        <i class="iconfont icon-Numberofwarning"></i>
                                        <span class="value">{{item.FaultCount}}</span>
                                    </li>
                                    <li class="l">
                                        <i class="iconfont icon-Numberofwarning"></i>
                                        <span class="value">{{item.WarningCount}}</span>
                                    </li>
                                    <li class="l">
                                        <i class="iconfont icon-Numberofwarning"></i>
                                        <span class="value">{{item.MaintenanceCount}}</span>
                                    </li>
                                </ul>
                             </div>
                         </li>
                     </ul>
                 </el-scrollbar>
            </div>
        </div>
        <div class="main">
            <ul class="main-header">
                <li>
                    <div class="l">
                        <p><i class="iconfont icon-Equipment"></i></p>
                        <p>项目数</p>
                    </div>
                    <p class="l">{{count.ProjectCount}}</p>
                </li>
                <li>
                    <div class="l">
                        <p><i class="iconfont icon-Equipment"></i></p>
                        <p>设备数</p>
                    </div>
                    <p class="l">{{count.BlocDeviceCount}}</p>
                </li>
                <li>
                    <div class="l">
                        <p><i class="iconfont icon-Equipment"></i></p>
                        <p>故障数</p>
                    </div>
                    <p class="l">{{count.FaultCount}}</p>
                </li>
                <li>
                    <div class="l">
                        <p><i class="iconfont icon-Equipment"></i></p>
                        <p>运维数</p>
                    </div>
                    <p class="l">{{count.MaintenanceCount}}</p>
                </li>
            </ul>
            <div id="map">

            </div>
            <div class="main-footer">
                <zw-table icon='icon-FireAlarm' title="实时预警" :width='545' :bodyHeight='170' :labels='tableLabel' :data='wariningData?wariningData.Data:[]' ></zw-table>
                <zw-table icon='icon-FireAlarm' title="实时火警" :width='545' :bodyHeight='170' :labels='tableLabel' :data='fireAlarmData?fireAlarmData.Data:[]' ></zw-table>
            </div>
        </div>
    </div>
</template>
<script>
import '@/assets/css/index.scss'
import {number,zwTable} from '@/components/index.js'
import {HomePage} from '@/xiaoFangCloud/request/api.js'
export default {
    data(){
        return{
            map:null,
            count:{},
            systemList:[], //系统列表（左侧数据）
            fireList:[], //火警信息列表（右侧数据）
            fireAlarmData:null,
            wariningData:null,
            tableLabel:[
                {
                    label:'项目',
                    prop:'ShortName',
                    width:'25%'
                },
                {
                    label:'告警时间',
                    prop:'AlarmTime',
                    width:'25%'
                },
                {
                    label:'告警内容',
                    prop:'AlarmText',
                    width:'25%'
                },
                {
                    label:'当前值',
                    prop:'AlarmData',
                    width:'25%'
                }
            ],
            data:[
                {
                    name:'中物互联',
                    time:'10:00',
                    content:'过流',
                    value:'100A'
                },
                {
                    name:'中物互联',
                    time:'10:00',
                    content:'过流',
                    value:'100A'
                },
                {
                    name:'中物互联',
                    time:'10:00',
                    content:'过流',
                    value:'100A'
                },
                {
                    name:'中物互联',
                    time:'10:00',
                    content:'过流',
                    value:'100A'
                },
                {
                    name:'中物互联',
                    time:'10:00',
                    content:'过流',
                    value:'100A'
                },
                {
                    name:'中物互联',
                    time:'10:00',
                    content:'过流',
                    value:'100A'
                },
            ]
        }
    },
    components:{
        number,
        zwTable
    },
    created(){
    },
    mounted(){
        this.$nextTick(() => {
            this.initMap()
            this.queryData()
        })
    },
    methods:{
        queryData(){
            HomePage({
                FAction:'QueryBlocHomePageCount'
            })
            .then((data) => {
                let a,b,c,d,e
                [this.systemList,this.fireList,this.wariningData,this.fireAlarmData,this.count] = data.FObject
                console.log(this.fireAlarmData)
            }).catch((err) => {
                console.log(err)
            });
        },
        /**百度地图 */
        initMap(){
            this.map =  new BMap.Map('map')
	        this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
	        //添加地图类型控件
	        this.map.setCurrentCity("深圳");          // 设置地图显示的城市 此项是必须设置的
            this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            this.map.setMapStyle({style:'midnight'});
        },
    }
}
</script>
<style lang="scss">
    $url:'../../../assets/image/cloud/index/';
    .cloud{
       padding: 2px;
       background: url('#{$url}bg_img.jpg');
    }
</style>
