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
    <h1>{{count.ProjectName}}e应急云平台
      <div>
        <p class="r">{{$store.state.FContacts}}</p>
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
        <router-link :to="{name:'system'}" :exact ='false' class="icon-item r"><i class="iconfont icon-zs-backstage"></i></router-link>
        <router-link v-if="userType == 3||userType == 4" to="/" class="icon-item r" title="集团">
          <i class="iconfont icon-ZS-bloc"></i>
        </router-link>
      </div>
    </h1>
    <!-- 楼宇单元分布 -->
    <div class="l left-content aside">
      <zw-card :width='414' :height='995' title="楼栋单元分布" :titleWidth='276'>
        <div class="list">
          <el-scrollbar>
            <ul class="cards">
                <li v-for="(item,i) in buildings" :key='i' @click="queryData(item.ID)">
                    <h5>{{item.BuildingName}}-{{item.FlatsName}}</h5>
                    <div :class="['info',{alarm:item.FireAlarmCount>0,help:item.HelpCount>0,'active':item.ID == floors[0].FlatsID}]">
                      <div class="state l" >
<!--                         <div class="sx1"></div>
                        <span>{{item.FireAlarmCount>0?'火警':'正常'}}</span> -->
                      </div>
                      <ul >
                        <!-- <li class="l"><i class="iconfont icon-ZS-Thestairs"></i><span>{{item.FloorCount?item.FloorCount:0}}</span></li> -->
                        <li class="l"><i class="iconfont icon-ZS-Overallnumberofpeople"></i><span>{{item.UsersCount?item.UsersCount:0}}</span></li>
                        <li class="l"><i class="iconfont icon-ZS-Ownermanagement"></i><span>{{item.DoorplateCount?item.DoorplateCount:0}}</span></li>
                        <li class="l"><i class="iconfont icon-ZS-Online"></i><span>{{item.OnlineDeviceCount?item.OnlineDeviceCount:0}}</span></li>
                        <!-- <li class="l"><i class="iconfont icon-FireAlarm"></i><span>{{item.FireAlarmCount	?item.FireAlarmCount	:0}}</span></li> -->
                        <li class="l"><i class="iconfont icon-ZS-Off-lineequipment"></i><span>{{item.OfflineDeviceCount?item.OfflineDeviceCount:0}}</span></li>
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
              <li v-for="(item,n) in alarmList" :key="n" class="l">
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
      <zw-card :width='545' :height='486' title="逃生图" :titleWidth='200' style="margin-top:8px;" >
        <img style="width:506px;height:346px;margin:70px auto" src="@/assets/image/index/bg_3.jpg" alt="">
      </zw-card>
    </div>
    <!-- 中间部分 -->
    <div class="center">
      <div class="header">
        <ul class="l">
          <li class="l">
            <p><i class="iconfont icon-ZS-Ownermanagement"></i><span>总户数</span></p>
            <p>{{count.DoorplateCount?count.DoorplateCount:0}}</p>
<!--             <transition>
              <p>{{test}}</p>
            </transition> -->
          </li>
          <li class="l">
            <p><i class="iconfont icon-ZS-Overallnumberofpeople"></i><span>总人数</span></p>
            <p>{{count.UsersCount?count.UsersCount:0}}</p>
          </li>
          <li class="l" style="width:33.33%">
            <p><i class="iconfont icon-ZS-Thetotalnumberofbuildings"></i><span>总栋数</span></p>
            <p>{{count.BuildingCount?count.BuildingCount:0}}</p>
          </li>
          <li class="l" style="width:33.33%">
            <p><i class="iconfont icon-ZS-Thetotalnumberofunits"></i><span>总单元数</span></p>
            <p>{{count.FlatsCount?count.FlatsCount:0}}</p>
          </li>
          <li class="l" style="width:33.33%;">
            <p><i class="iconfont icon-ZS-Thestairs"></i><span>总层数</span></p>
            <p>{{count.FloorCount?count.FloorCount:0}}</p>
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
            <p><i class="iconfont icon-SmokeSence"></i><span>总烟感数</span></p>
            <p>{{count.DeviceCount?count.DeviceCount:0}}</p>
          </li>
          <li class="l" style="width:33.33%">
            <p><i class="iconfont icon-ZS-Online"></i><span>在线烟感</span></p>
            <p>{{count.OnlineDeviceCount?count.OnlineDeviceCount:0}}</p>
          </li>
          <li class="l" style="width:33.33%;">
            <p><i class="iconfont icon-ZS-Off-lineequipment"></i><span>离线烟感</span></p>
            <p>{{count.OfflineDeviceCount?count.OfflineDeviceCount:0}}</p>
          </li>
        </ul>
      </div>
      <div class="floors l">
        <zw-card :width='326' :height='774' title="楼层分布" :titleWidth='224'>
          <div class="floor-list">
            <el-scrollbar>
              <ul class="clearfix">
                <li v-for="(item,n) in floors" :key="n" :class="['l',{active:item.ID == rooms[0].FloorID,help:item.HelpCount>0,alarm:item.FireAlarmCount>0}]" @click="queryData(item.FlatsID,item.ID)">
                  <div class="icon"></div>
                  <p>{{item.FloorCode}}</p>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </zw-card>
      </div>
      <div class="rooms l">
        <zw-card :width='597' :height='774'>
          <el-scrollbar>
            <ul class="clearfix">
              <li v-for="(item,n) in rooms" :key="n" :class="['l',{uninstalled:item.DeviceCount == 0,help:item.HelpCount>0,alarm:item.FireAlarmCount>0,'off-line':item.OfflineDeviceCount>0}]">
                <div class="room-number">{{item.DoorplateName}}</div>
                <div class="room-info">
                    <div class="state l">
                    </div>
                    <p>
                      <span>{{item.FContacts?item.FContacts:'--'}}</span><br>
                      <span>{{item.UsersCount}}人</span>
                    </p>
                </div>
              </li>
            </ul>
          </el-scrollbar>
        </zw-card>
      </div>
      <set-password :show.sync="show1"></set-password>
    </div>
  </div>
</template>
<script>
import {zwCard,setPassword} from '@/components/index.js';
import {Alarm} from '@/xiaofang/request/api.js';
import './index.scss'
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
      projectName:'',
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
    userType(){
      return this.$store.state.userType
    }
  },
  created(){
    this.queryData()
    this.projectName = this.$route.params.name
/*     setInterval(() => {
      this.test = Math.round(Math.random()*100)
    },1000) */
  },
  methods:{
    handleData(data){
      console.log(new Date(),data);
      this.count = data.FObject&&data.FObject.Table&&data.FObject.Table[0]?data.FObject.Table[0]:{}
      this.alarmList = data.FObject.Table1?data.FObject.Table1:[]
      this.buildings = data.FObject&&data.FObject.Table2?data.FObject.Table2:[]
      this.floors = data.FObject&&data.FObject.Table3?data.FObject.Table3.reverse():[]
      this.rooms = data.FObject&&data.FObject.Table4?data.FObject.Table4:[]
      this.$store.state.projectName = this.count.ProjectName
    },
    queryData(flatsID = 0,floorID = 0){
      sendSock({
        FRouteName:'HomePage',
        FAction:'QueryMonitorDataCount',
        TerminalType:'PC',
        FlatsID:flatsID,
        FloorID:floorID
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
    }
  }
}
</script>
<style lang="scss">
/* @import './index.scss'; */
</style>
