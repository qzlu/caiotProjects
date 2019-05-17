<template>
  <div class="home">
    <!-- 反馈弹框 -->
    <el-dialog v-if="alarmItem.FType ==='Alarm'" :visible.sync="show" class="zw-dialog" width="695px" append-to-body title="火警-反馈信息">
        <el-form   inline ref="form">
            <el-form-item label="火警位置" >
              <el-input  autocomplete="off" :value="`${alarmItem.FAddress}`" readonly></el-input>
            </el-form-item>
            <el-form-item label="预警时间" >
              <el-date-picker
                type="datetime"
                v-model="alarmItem.FCreateTime"
                readonly
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="业主" >
              <el-input v-model="alarmItem.FOwnersName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认时间" >
              <el-date-picker
                type="datetime"
                v-model="alarmItem.ProcessingDateTime"
                readonly
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="处理人" >
              <el-input readonly v-model="alarmItem.LeaderName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="解除时间" >
              <el-date-picker
                readonly
                v-model="alarmItem.LiftedDateTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="火警描述" >
              <el-input class="block" v-model="alarmContent" type="textarea" maxlength="200"  autocomplete="off">
              </el-input>
              <span class="str-length">{{alarmContentLength}}/200</span>
            </el-form-item>
            <el-form-item label="处理描述" >
              <el-input class="block" v-model="processingContent" type="textarea" maxlength="200"  autocomplete="off">
              </el-input>
              <span class="str-length">{{processingContentLength}}/200</span>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updateAlarmContent">确 定</el-button>
            <el-button @click="show = false">取 消</el-button>
        </span>
    </el-dialog>
    <!-- 求助反馈 -->
    <el-dialog v-else :visible.sync="show" class="zw-dialog" width="695px" append-to-body title="求助-反馈信息">
        <el-form   inline ref="form">
            <el-form-item label="求助类型" >
              <el-input  autocomplete="off" :value="alarmItem.FLevel == 1?'SOS求助':'一般求助'" readonly></el-input>
            </el-form-item>
            <el-form-item label="求助位置" >
              <el-input  autocomplete="off" :value="`${alarmItem.FAddress}`" readonly></el-input>
            </el-form-item>
            <el-form-item label="求助人" >
              <el-input :value="alarmItem.FOwnersName" autocomplete="off" readonly></el-input>
            </el-form-item>
            <el-form-item label="联系方式" >
              <el-input :value="alarmItem.FamilyMembers?alarmItem.FamilyMembers.split('_')[3]:''" autocomplete="off" readonly></el-input>
            </el-form-item>
            <el-form-item label="处理人" >
              <el-input readonly :value="alarmItem.LeaderName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="求助时间" >
              <el-date-picker
                type="datetime"
                v-model="alarmItem.FCreateTime"
                readonly
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="确认时间" >
              <el-date-picker
                type="datetime"
                v-model="alarmItem.ProcessingDateTime"
                readonly
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="解救时间" >
              <el-date-picker
                readonly
                v-model="alarmItem.LiftedDateTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="求助描述" >
              <el-input class="block" readonly  :value="alarmItem.FLevel == 1?'SOS求助':alarmItem.FContent" type="textarea" maxlength="200"  autocomplete="off">
              </el-input>
              <span class="str-length">{{'SOS求助'.length}}/200</span>
            </el-form-item>
            <el-form-item label="处理描述" >
              <el-input class="block" placeholder="请输入处理描述" v-model="processingContent" type="textarea" maxlength="200"  autocomplete="off">
              </el-input>
              <span class="str-length">{{processingContentLength}}/200</span>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="changeHelpState(alarmItem,3)">确 定</el-button>
            <el-button @click="show = false">取 消</el-button>
        </span>
    </el-dialog>                               
    <h1>中物互联e应急云平台
        <div>
            <p class="r">{{userName}}</p>
            <el-dropdown class="r" style="top: 13px;right: 10px;">
              <div class="el-dropdown-link icon-item">
                <i class="iconfont icon-User"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="show1 = true">设置密码</el-dropdown-item>
                <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div class="icon-item r" style="margin-right:20px;">
              <i class="iconfont icon-ZS-news"></i>
            </div>
           <!--  <router-link :to="{name:'system'}" :exact ='false' class="icon-item r"><i class="iconfont icon-zs-backstage"></i></router-link> -->
        </div>
    </h1>
    <!-- 楼宇单元分布 -->
    <div class="l left-content aside">
      <zw-card :width='414' :height='995' title="项目分布" :titleWidth='276'>
        <div class="list">
          <el-scrollbar>
            <ul class="cards">
                <li v-for="(item,i) in buildings" :key='i' @click="active = i;selectProject(item)" @dblclick="changeRoute(item)">
                    <h5>{{item.ProjectName}}</h5>
                    <div :class="['info',{active:active ==i, alarm:item.FireAlarmCount>0,help:item.HelpCount>0}]">
                      <div class="state l" >
                      </div>
                      <ul >
                        <li class="l"><i class="iconfont icon-ZS-Online"></i><span>{{item.OnlineDeviceCount?item.OnlineDeviceCount:0}}</span></li>
                        <li class="l"><i class="iconfont icon-ZS-Off-lineequipment"></i><span>{{item.OfflineDeviceCount?item.OfflineDeviceCount:0}}</span></li>
                        <li class="l" style="width:100%"><i class="iconfont icon-ZS-certifiedproperty"></i><span>{{item.PropertyName?item.PropertyName:'--'}}</span></li>
                        <li class="l" style="width:100%"><i class="iconfont icon-ZS-themanonwatch"></i><span>{{item.PropertyLeader?item.PropertyLeader:'--'}}　{{item.PropertyPhone?item.PropertyPhone:'--'}}</span></li>
                      </ul>
                    </div>
                </li>
            </ul>
          </el-scrollbar>
        </div>
      </zw-card>
    </div>
    <!-- 火警信息 -->
    <div class="r right-content aside">
      <zw-card :width='545' :height='500' title="火警/求助信息" :titleWidth='224'>
        <div class="list">
          <el-scrollbar>
            <ul class="alarm-info">
              <li v-for="(item,n) in alarmList" :key="n" class="l" @click="setEndPlace(item)">
                <div class="room-title" v-if="item.FType == 'Alarm'">
                  <button class="fire-alarm" v-if="item.ProcessingDateTime==null" @click="changeAlarmState(item,1)">火警</button>
                  <button class="fire-alarm" v-else-if="item.LiftedDateTime ==null||item.LiftedDateTime ==''"  @click="changeAlarmState(item,3)">解除</button>
                  <button v-else>解除</button>
                  <div class="room-number">
                    <span >火警信息</span>
                  </div>
                  <button class="fire-alarm" v-if="item.ProcessingDateTime==null"  @click="changeAlarmState(item,2)">误报</button>
                  <button class="fire-alarm" v-else-if="item.LiftedDateTime !=null&&item.LiftedDateTime !=''" @click="feedback(item)">反馈</button>
                  <button v-else>反馈</button>
                </div>
                <!-- 求助 -->
                <div class="room-title" v-else>
                  <button class="fire-alarm" v-if="item.MsgState==0" @click="changeHelpState(item,1)">确认</button>
                  <button class="fire-alarm" v-else-if="item.MsgState==1"  @click="changeHelpState(item,2)">解救</button>
                  <button v-else>解除</button>
                  <div class="room-number">
                    <span v-if='item.FLevel == 1'>SOS求助</span>
                    <span v-else>一般求助</span>
                  </div>
                  <button class="fire-alarm" v-if="item.MsgState==2" @click="feedback(item)">反馈</button>
                  <button v-else>反馈</button>
                </div>
                <div class="room-info">
                    <p class="name">
                      <i class="iconfont icon-ZS-location" style="font-size:24px;margin-right:6px"></i>{{item.FAddress}}
                    </p>
                    <table class="table-header">
                      <tr>
                        <th width='25%'>姓名</th>
                        <th width='25%'>性别</th>
                        <th width='25%'>年龄</th>
                        <th width='25%'>电话</th>
                      </tr>
                    </table>
                    <div class="table-body">
                        <table v-if="item.FamilyMembers != null">
                          <tr v-for="(obj,i) in item.FamilyMembers.split(',')" :key="i">
                            <td width='25%'>{{obj.split('_')[0]}}</td>
                            <td width='25%'>{{obj.split('_')[1]==1?'男':'女'}}</td>
                            <td width='25%' :class="{warning:Number(obj.split('_')[4])>= 60||Number(obj.split('_')[4]) <= 12}">{{obj.split('_')[4]}}</td>
                            <td width='25%'>{{obj.split('_')[3]}}</td>
                          </tr>
                        </table>
                    </div>
                    <p v-if="item.FType ==='Help'&&item.FLevel == 2" style="margin-top:10px;padding-right:20px;">
                      <a class="r" href="javascript:void(0)" style="color:#04a9e1" @click="processingContent = item.FContent;show2 = true">求助详情</a>
                    </p>
                    <el-dialog class="zw-dialog" :visible.sync="show2" title="求助详情" append-to-body width="500px">
                        <div>
                          <span class="label l">求助描述</span>
                          <p style="margin-left:120px">{{processingContent}}</p>
                        </div>
                    </el-dialog>
                </div>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </zw-card>
      <zw-card :width='545' :height='486' title="路线图" :titleWidth='200' style="margin-top:8px;" >
        <div class="search-box">
          <div class="arrow" @click="changePlace">
            <i class="iconfont icon-ZS-arrows"></i>
          </div>
          <div class="inputs">
              <input id="startPlace" placeholder="输入起点或在图区上选点" v-model="startPlace"/><br/>
              <input id="endPlace" placeholder="输入终点" v-model="endPlace" />
              <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
          </div>
          <div class="arrow" style="left:100%;margin-left:-30px;font-size:26px;" @click="searchRoad">
            <i class="el-icon-search"></i>
          </div>
        </div>
        <div class="map1" id="map1">
        </div>
      </zw-card>
    </div>
    <!-- 中间部分 -->
    <div class="center">
      <div class="header">
        <ul class="l">
          <li class="l">
            <p><i class="iconfont icon-ZS-Ownermanagement"></i><span>总户数</span></p>
            <p>{{count.DoorplateCount?count.DoorplateCount:0}}</p>
          </li>
          <li class="l">
            <p><i class="iconfont icon-ZS-Overallnumberofpeople"></i><span>总人数</span></p>
            <p>{{count.UsersCount?count.UsersCount:0}}</p>
          </li>
          <li class="l" style="width:33.33%">
            <p><i class="iconfont icon-SmokeSence"></i><span>总烟感数</span></p>
            <p>{{count.DeviceCount?count.DeviceCount:0}}</p>
          </li>
          <li class="l" style="width:33.33%;">
            <p><i class="iconfont icon-ZS-Thestairs"></i><span>总层数</span></p>
            <p>{{count.FloorCount?count.FloorCount:0}}</p>
          </li>
          <li class="l" style="width:33.33%">
            <p><i class="iconfont icon-ZS-Thetotalnumberofbuildings"></i><span>总栋数</span></p>
            <p>{{count.BuildingCount?count.BuildingCount:0}}</p>
          </li>
        </ul>
        <ul class="l">
          <li class="l">
            <p><i class="iconfont icon-FireAlarm"></i><span>火警数</span></p>
            <p>{{count.FireAlarmCount?count.FireAlarmCount:0}}</p>
          </li>
          <li class="l">
            <p><i class="iconfont icon-ZS-Countoffbymistake"></i><span>误报数</span></p>
            <p>{{count.FalsePositivesCount?count.FalsePositivesCount:0}}</p>
          </li>
          <li class="l" style="width:33.33%">
            <p><i class="iconfont icon-ZS-Online"></i><span>在线烟感</span></p>
            <p>{{count.OnlineDeviceCount?count.OnlineDeviceCount:0}}</p>
          </li>
          <li class="l" style="width:33.33%;">
            <p><i class="iconfont icon-ZS-Off-lineequipment"></i><span>离线烟感</span></p>
            <p>{{count.OfflineDeviceCount?count.OfflineDeviceCount:0}}</p>
          </li>
          <li class="l" style="width:33.33%;">
            <p><i class="iconfont icon-ZS-Off-lineequipment"></i><span>未安装烟感</span></p>
            <p>{{count.NoInstallationCount?count.NoInstallationCount:0}}</p>
          </li>
        </ul>
      </div>
        <zw-card class="map-container" :width='944' :height='774'>
          <div id="map" class="map">

          </div>
        </zw-card>
      <set-password :show.sync="show1"></set-password>
    </div>
  </div>
</template>
<script>
import {zwCard,setPassword} from '@/components/index.js';
import {sendSock,closeSocket} from '@/xiaofang/request/socket.js'
import {Alarm} from '@/xiaofang/request/api.js';
import styleJson  from './custom_map_config.json';
import './index.scss';
export default {
  name: 'home',
  data(){
    return{
      count:{},
      buildings:[],
      alarmList:[],
      floors:[],
      rooms:[],
      show:false,
      alarmItem:{},
      alarmContent:'',
      processingContent:'',
      show1:false,
      show2:false,
      test:1,
      map:null,
      map1:null,
      startPlace:'深圳市创新科技广场二期西座1905',
      endPlace:'',
      active:0
    }
  },
  components: {
    zwCard,
    setPassword
  },
  computed:{
    alarmContentLength(){
      return this.alarmContent?this.alarmContent.length:0
    },
    processingContentLength(){
      return this.processingContent?this.processingContent.length:0
    },
    userName(){
      return this.$store.state.FContacts
    }
  },
  created(){
    /**
     * 没有集团权限直接跳转到项目
     */
    if(this.$store.state.userType != 3 && this.$store.state.userType != 4){
      this.$router.push(`/home`)
    }
  },
  mounted(){
    this.$nextTick(() => {
        this.initMap()
        this.initMap1()
        this.queryData()
    })
  },
  methods:{
    handleData(data){
      console.log(new Date(),data);
      this.count = data.FObject&&data.FObject.Table&&data.FObject.Table[0]?data.FObject.Table[0]:{}
      this.alarmList = data.FObject.Table1?data.FObject.Table1:[]
      this.buildings = data.FObject&&data.FObject.Table2?data.FObject.Table2:[]
      this.floors = data.FObject&&data.FObject.Table3?data.FObject.Table3.reverse():[]
      this.rooms = data.FObject&&data.FObject.Table4?data.FObject.Table4:[]
      if(this.map !==null){
          this.map.clearOverlays()
          this.buildings.forEach((item,i) => {
                if(item.Flat < 0 || item.Flat == null ||item.Flng < 0 || item.Flng == null){
                  return
                }
                const point = new BMap.Point(item.Flat,item.Flng)
                let marker,icon,img
                if(item.FireAlarmCount > 0){
                  img = require('@/assets/image/index/icon_1.png')
                  icon = this.setIcon(img,124,70)
                  marker = new BMap.Marker(point,{icon:icon})
                }else if(item.HelpCount > 0){
                  img = require('@/assets/image/index/icon_3.png')
                  icon = this.setIcon(img,97,110)
                  marker = new BMap.Marker(point,{icon:icon})
                }else{
                  img = require('@/assets/image/index/icon_2.png')
                  icon = this.setIcon(img)
                  marker = new BMap.Marker(point,{icon:icon})
                }
                this.map.addOverlay(marker)
                this.map.centerAndZoom(point, 11);
                this.setLabel(marker,item.ProjectName)
                let temp = this.content(item)
                if(item.FireAlarmCount > 0||item.HelpCount > 0){
                  this.openInfoWindow(temp,point)
                }
                marker.addEventListener('mouseover',e => {
                  let p = e.target;
                  let point = new BMap.Point(p.getPosition().lng,p.getPosition().lat)
                  this.openInfoWindow(temp,point)
                })
                marker.addEventListener('dblclick',e => {
                  this.changeRoute(item)
                })
          })
      }
      this.endPlace = this.alarmList[0]?this.alarmList[0].FAddress:''
      this.searchRoad()
    },
    content(item){
      let temp
      if(item.FireAlarmCount > 0){
        temp = `<ul class='info-window'>
                  <li>项目名称:<span>${item.ProjectName}</span></li>
                  <li>项目地址:<span>${item.ProjectAddress}</span></li>
                  <li>火警地址:<span>${item.FireAddress}</span></li>
                </ul>
        
        `
      }else if(item.HelpCount > 0){
        temp = `<ul class='info-window'>
                  <li>项目名称:<span>${item.ProjectName}</span></li>
                  <li>项目地址:<span>${item.ProjectAddress}</span></li>
                  <li>sos地址:<span>${item.HelpAddress}</span></li>
                </ul>
        
        `
      }else{
        temp = `<ul class='info-window clearfix'>
                  <li>项目名称:<span>${item.ProjectName}</span></li>
                  <li>项目地址:<span>${item.ProjectAddress}</span></li>
                  <li>物业公司:<span>${item.PropertyName}</span></li>
                  <li>负责人:<span>${item.PropertyLeader}</span><span>${item.PropertyPhone}</span></li>
                  <li class="l" style="width:100px;overflow:hidden">楼栋数:<span>${item.BuildingCount}</span></li>
                  <li class="l" style="width:50%;">户数:<span>${item.DoorplateCount}</span></li><br>
                  <li class="l" style="width:100px;overflow:hidden">烟感数:<span>${item.DeviceCount}</span></li>
                  <li class="l" >在线:<span>${item.OnlineDeviceCount}</span></li>
                  <li class="l" style="margin-left:50px">离线:<span>${item.OfflineDeviceCount}</span></li>
                </ul>
        
        `
      }
      return temp
    },
    queryData(){
      sendSock({
        FRouteName:'HomePage',
        FAction:'QueryGroupMonitorDataCount',
        TerminalType:'PC',
      },this.handleData)
    },
    /**
     * 修改火警状态
     * @param {} state  2 误报 1 火警 3 解除火警
     */
    async changeAlarmState(item,state){
      await new Promise((resolve,reject) => {
          let text
          if(state == 1){
            text = '确认有火警吗？'
          }else if(state ==2){
            text = '确认误报？'
          }else{
            text = '确认火警已解除？'
          }
          this.$confirm(text, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            });
      })
      Alarm({
        FRouteName:'Alarm',
        FAction:'UpdateAlarmStates',
        ID:item.ID,
        AlarmType:state
      })
      .then((data) => {
        this.queryData()
      }).catch((err) => {
        
      });
    },
    /**
     * 点击反馈
     */
    feedback(item){
      if(item.LiftedDateTime !==null&&item.LiftedDateTime !==''){
        this.alarmItem = item
        this.show  = true
        this.alarmContent = ''
        this.processingContent = ''
      }
    },
    /**
     * 
     */
    updateAlarmContent(){
      if(this.alarmContent == ''||this.processingContent == ''){
        this.$message({
          type:'warning',
          message:'请输入反馈信息'
        })
        return
      }
      this.show = false
      Alarm({
        FRouteName:'Alarm',
        FAction:'UpdateAlarmContent',
        ID:this.alarmItem.ID,
        AlarmContent:this.alarmContent,
        ProcessingContent:this.processingContent
      })
      .then((data) => {
        this.queryData()
      }).catch((err) => {
      });
    },
    /**
     * 修改求助状态
     */
    async changeHelpState(item,state){
      await new Promise((resolve,reject) => {
          let text
          if(state == 1){
            text = '确认求助吗？'
          }else if(state ==2){
            text = '确认已解救？'
          }
          if(state == 3){
            this.show = false
            resolve()
          }else{
            this.$confirm(text, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            });
          }
      })
      Alarm({
        FAction:"UpdateHelpRecordByHelpState",
        ID:item.ID,
        FType:0,
        mUHelpRecord:{
          HelpState:state,
          ProcessingContent:this.processingContent
        }
      })
      .then(data => {
        console.log(data);
        this.queryData()
      })
      .catch(err => {

      })
    },
    loginOut(){
      closeSocket()
      this.$router.push('/login')
    },
    selectProject(item){
      let temp = this.content(item)
      let point = new BMap.Point(item.Flat, item.Flng)
      this.map.centerAndZoom(point, 11)
      this.openInfoWindow(temp,point)
    },
    changeRoute(item){
      this.$store.state.projectId = item.ID
      sessionStorage.setItem('projectId',item.ID)
      this.$router.push(`/home`)
    },
    /**百度地图 */
    initMap(){
      this.map =  new BMap.Map('map')
	    this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
	    //添加地图类型控件
/* 	    this.map.addControl(new BMap.MapTypeControl({
	    	mapTypes:[
                BMAP_NORMAL_MAP,
                BMAP_HYBRID_MAP
            ]}));	   */
	    this.map.setCurrentCity("深圳");          // 设置地图显示的城市 此项是必须设置的
      this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
      this.map.setMapStyleV2({styleJson:styleJson})
    },
    initMap1(){
      this.map1  = new BMap.Map('map1')
	    this.map1.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
	    //添加地图类型控件
/* 	    this.map1.addControl(new BMap.MapTypeControl({
	    	mapTypes:[
                BMAP_NORMAL_MAP,
                BMAP_HYBRID_MAP
            ]}));	   */
	    this.map1.setCurrentCity("深圳");          // 设置地图显示的城市 此项是必须设置的
      this.map1.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
      let menu = new BMap.ContextMenu();
      this.map1.setMapStyle({style:'light'});
      let txtMenuItem = [
      	{
      		text:'以此为起点',
      		callback:(e) => {
            let geoc = new BMap.Geocoder();
            geoc.getLocation(e, (rs) => {
		        	var addComp = rs.addressComponents;
		        	this.startPlace = addComp.province  + addComp.city + addComp.district + addComp.street  + addComp.streetNumber;
		        });          
          }
      	},
      	{
      		text:'以此为终点',
      		callback:(e) => {
            let geoc = new BMap.Geocoder();
            geoc.getLocation(e, (rs) => {
		        	var addComp = rs.addressComponents;
		        	this.endPlace = addComp.province  + addComp.city + addComp.district + addComp.street  + addComp.streetNumber;
		        });          
          }
      	}
      ];
      for(var i=0; i < txtMenuItem.length; i++){
	    	menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,txtMenuItem[i].callback,100));
	    }
	    this.map1.addContextMenu(menu); 
      this.smartSearch('startPlace') 
      this.smartSearch('endPlace')
    },
    /**
     * 绘制点
     * map 地图
     * point 地图坐标点
     */
    addMark(map,point){
      let marker = new BMap.Marker(point)
      map.addOverlay(marker)
    },
    setIcon(url,x = 32, y = 34){
      var myIcon = new BMap.Icon(url, new BMap.Size(x,y));
      return myIcon
    },
    /**
     * 给覆盖物设置label
     * @param {} marker 覆盖物
     * @param {type String} text 文字
     * @param {type Number} x 水平距离
     * @param {type Number} y 垂直距离
     */
    setLabel(marker,text,x=20,y=-10){
      let label = new BMap.Label(text,{offset:new BMap.Size(x,y)})
      label.setStyle({
        color:'#999999 ',
        borderColor:'white',
        padding:'0 10px',
      })
      marker.setLabel(label)
    },
    /**
     * 设置信息窗口
     * @param {String} content 信息窗口内容
     * @param {*}
     */
    openInfoWindow(content,point){
      let infoWindow = new BMap.InfoWindow(content,{
        height:0,
      })
      this.map.openInfoWindow(infoWindow,point)
    },
    /**
     * 智能提示
     */
    smartSearch(id){
	    // 百度地图API功能
	    function G(id) {
	    	return document.getElementById(id);
	    }
	    var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
	    	{"input" : id
        ,"location" : this.map1
	    });
    
	    ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
	    	if (e.fromitem.index > -1) {
	    		value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
	    	}    
	    	str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
    
	    	value = "";
	    	if (e.toitem.index > -1) {
	    		_value = e.toitem.value;
	    		value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
	    	}    
	    	str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
	    });
    
	    var myValue;
	    ac.addEventListener("onconfirm", (e) => {    //鼠标点击下拉列表后的事件
	    var _value = e.item.value;
	    	myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
	    	G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
        this[id] = myValue
	    	this.setPlace(myValue);
      });
     
    },
    setPlace(value){
	    	this.map1.clearOverlays();    //清除地图上所有覆盖物
	    	const myFun = (e) => {
	    		var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
	    		this.map1.centerAndZoom(pp, 18);
	    		this.map1.addOverlay(new BMap.Marker(pp));    //添加标注
	    	}
	    	var local = new BMap.LocalSearch(this.map1, { //智能搜索
	    	  onSearchComplete: myFun
	    	});
	    	local.search(value);
    },
    /**
     * 交换起点，终点
     */
    changePlace(){
      [this.startPlace,this.endPlace] = [this.endPlace,this.startPlace]
    },
    setEndPlace(item){
      this.endPlace = item.FAddress
      this.searchRoad()
    },
    /**
     * 搜素路线
     */
    async searchRoad(){
      this.map1.clearOverlays()
      var myGeo = new BMap.Geocoder();
      var point1,point2
      await new Promise(resolve => {
        myGeo.getPoint(this.startPlace,point => {
          console.log(point)
          point1 = point
          resolve()
        })
      })
      await new Promise(resolve => {
        myGeo.getPoint(this.endPlace,point => {
          point2 = point
          resolve()
        })
      })
      var driving = new BMap.DrivingRoute(this.map1,{renderOptions:{map: this.map1, autoViewport: true}})
      driving.search(point1,point2);
    }
  }
}
</script>
<style lang="scss" >
ul.info-window{
  margin-bottom: 10px;
  li{
    max-width: 300px;
    margin-top: 10px;
    color: #5fbef9;
    span{
      margin-left: 16px;
    }
  }
}
</style>
