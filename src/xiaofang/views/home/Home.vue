<template>
  <div class="home">
    <!-- 反馈弹框 -->
    <el-dialog :visible.sync="show" class="zw-dialog" width="695px" append-to-body title="反馈信息">
        <el-form   inline ref="form">
            <el-form-item label="报警位置" >
              <el-input  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="报警时间" >
              <el-date-picker
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="业主" >
              <el-input  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认时间" >
              <el-date-picker
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="处理人" >
              <el-input  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="解除时间" >
              <el-date-picker
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="报警描述" >
              <el-input class="block" type="textarea" max="200"  autocomplete="off">
              </el-input>
              <span class="str-length">0/200</span>
            </el-form-item>
            <el-form-item label="处理描述" >
              <el-input class="block" type="textarea" max="200"  autocomplete="off">
              </el-input>
              <span class="str-length">0/200</span>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="">确 定</el-button>
            <el-button @click="show = false">取 消</el-button>
        </span>
    </el-dialog>                               
    <h1>天安数码城掌上应急云平台<router-link :to="{name:'system'}" :exact ='false' style="float:right;margin-right:52px;cursor:poitner"><img src="@/assets/image/index/nav_button_1.png" alt=""></router-link></h1>
    <!-- 楼宇单元分布 -->
    <div class="l left-content aside">
      <zw-card :width='414' :height='995' title="楼宇单元分布" :titleWidth='276'>
      <div class="list">
        <el-scrollbar>
          <ul class="cards">
              <li v-for="i in 10" :key='i'>
                  <h5>创新科技大厦1期-东座</h5>
                  <div class="info">
                    <div class="state l">
                      <div class="sx1"></div>
                      <span>正常</span>
                    </div>
                    <ul>
                      <li class="l"><i class="iconfont icon-ZS-Thestairs"></i><span>1300</span></li>
                      <li class="l"><i class="iconfont icon-ZS-Overallnumberofpeople"></i><span>1300</span></li>
                      <li class="l"><i class="iconfont icon-ZS-Ownermanagement"></i><span>1300</span></li>
                      <li class="l"><i class="iconfont icon-ZS-Online"></i><span>1300</span></li>
                      <li class="l"><i class="iconfont icon-FireAlarm"></i><span>1300</span></li>
                      <li class="l"><i class="iconfont icon-ZS-Off-lineequipment"></i><span>1300</span></li>
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
      <zw-card :width='545' :height='500' title="火警信息" :titleWidth='224'>
        <el-scrollbar>
          <ul class="alarm-info">
            <li v-for="n in 10" :key="n" class="l">
              <div class="room-title">
                <button class="fire-alarm ">火警</button>
                <div class="room-number">{{n}}</div>
                <button class="">误报</button>
              </div>
              <div class="room-info">
                  <p class="name">
                    张三
                  </p>
                  <ul class="clearfix">
                    <li v-for="n in 4" class="l">
                      <i class="sex-icon">男</i>
                      <p><span>张宇</span><br><span>35</span></p>
                      <span>15112341234</span>
                    </li>
                  </ul>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </zw-card>
      <zw-card :width='545' :height='486' style="margin-top:8px;" >
      </zw-card>
    </div>
    <!-- 中间部分 -->
    <div class="center">
      <div class="header">
        <ul class="l">
          <li class="l">
            <p><i class="iconfont icon-ZS-Ownermanagement"></i><span>总户数</span></p>
            <p>1366</p>
          </li>
          <li class="l">
            <p><i class="iconfont icon-ZS-Overallnumberofpeople"></i><span>总人数</span></p>
            <p>1366</p>
          </li>
          <li class="l" style="width:33.33%">
            <p><i class="iconfont icon-ZS-Thetotalnumberofbuildings"></i><span>总栋数</span></p>
            <p>1366</p>
          </li>
          <li class="l" style="width:33.33%">
            <p><i class="iconfont icon-ZS-Thetotalnumberofunits"></i><span>总单元数</span></p>
            <p>1366</p>
          </li>
          <li class="l" style="width:33.33%;text-align:left">
            <p><i class="iconfont icon-ZS-Thestairs"></i><span>总层数</span></p>
            <p>1366</p>
          </li>
        </ul>
        <ul class="l">
          <li class="l">
            <p><i class="iconfont icon-FireAlarm"></i><span>火警数</span></p>
            <p>1366</p>
          </li>
          <li class="l">
            <p><i class="iconfont icon-ZS-Countoffbymistake"></i><span>误报数</span></p>
            <p>1366</p>
          </li>
          <li class="l" style="width:33.33%">
            <p><i class="iconfont icon-SmokeSence"></i><span>总烟感数</span></p>
            <p>1366</p>
          </li>
          <li class="l" style="width:33.33%">
            <p><i class="iconfont icon-ZS-Online"></i><span>在线烟感</span></p>
            <p>1366</p>
          </li>
          <li class="l" style="width:33.33%;text-align:left">
            <p><i class="iconfont icon-ZS-Off-lineequipment"></i><span>离线烟感</span></p>
            <p>1366</p>
          </li>
        </ul>
      </div>
      <div class="floors l">
        <zw-card :width='326' :height='774' title="楼层分布" :titleWidth='224'>
          <div class="floor-list">
            <el-scrollbar>
              <ul class="clearfix">
                <li v-for="n in 30" :key="n" class="l">
                  <div class="icon"></div>
                  <p>{{n}}</p>
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
              <li v-for="n in 10" :key="n" class="l">
                <div class="room-number">{{n}}</div>
                <div class="room-info">
                    <div class="state l">
                      <div class="sx1"></div>
                      <span>正常</span>
                    </div>
                    <p>
                      <span>张三</span><br>
                      <span>3人</span>
                    </p>
                </div>
              </li>
            </ul>
          </el-scrollbar>
        </zw-card>
      </div>
    </div>
  </div>
</template>
<script>
import {zwCard} from '@/components/index.js';
export default {
  name: 'home',
  data(){
    return{
      arr:[
        {
          text:'创新科技大厦1期-东座'
        }
      ],
      show:false
    }
  },
  components: {
    zwCard
  },
  created(){
    this.queryData()
  },
  methods:{
    handleData(data){
      console.log(data);
    },
    queryData(){
      this.socket({
        FRouteName:'HomePage',
        FAction:'QueryMonitorDataCount',
        FlatsID:0,
        FloorID:0
      },this.handleData)
    }
  }
}
</script>
<style lang="scss" src='./index.scss'>
</style>
