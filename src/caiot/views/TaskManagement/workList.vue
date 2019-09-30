<template>
    <div class="work-list">
        <ul class="tab-header clearfix">
            <li :class="{active:tabIndex === 1}" @click="tabIndex = 1">全部</li>
            <li :class="{active:tabIndex === 5}" @click="tabIndex = 5">待派单</li>
            <li :class="{active:tabIndex === 4}" @click="tabIndex = 4">待接单</li>
            <li :class="{active:tabIndex === 2}" @click="tabIndex = 2">待处理</li>
            <li :class="{active:tabIndex === 3}" @click="tabIndex = 3">已完成</li>
            <!-- <li :class="{active:tabIndex === 6}" @click="tabIndex = 6">其他</li> -->
            <li class="select">
                <span>工单类型</span> 
                <div class="select-box" @click="showSelectOption = !showSelectOption">{{selectType.name}}<i :class="{'el-icon-caret-bottom':!showSelectOption,'el-icon-caret-top':showSelectOption}"></i></div>
                <ul class="select-option" v-if="showSelectOption">
                    <li v-for="item in workTypeList" :key="item.value" @click="selectType = item;showSelectOption = false">{{item.name}}</li>
                </ul>
            </li>
            <li class="select-time">
                <span>时间段</span>
                <el-date-picker
                  v-model="time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
                <button class="zw-btn" style="background:#042E74;" @click="queryAllOrders()"><i class="el-icon-search"></i>查询</button>
                <button class="zw-btn zw-btn-export" @click="exportFile()">导出</button>
            </li>
        </ul>
        <div class="tab-content" >
            <div class="tab-item" v-if="tabIndex === 1">
                <div>
                    <el-table
                       :data="tableData0"
                       style="width: 100%"
                       header-row-class-name="el-table-header"
                       :row-class-name="tableRowClassName"
                       >
                       <el-table-column
                         v-for="item in tableLabel"
                         :key="item.label"
                         :prop="item.prop"
                         :label="item.label"
                         :width="item.width"
                         show-overflow-tooltip
                        >
                       </el-table-column>
                       <el-table-column
                         prop=""
                         label="操作">
                         <template slot-scope="scoped">
                             <div class="detail">
                                <span v-if="(scoped.row.OrderType==3||scoped.row.OrderType==5||scoped.row.OrderType==6)&&(scoped.row.OrderState==3||scoped.row.OrderState==4)&&FUserType != 4" @click="beforeChangeUser(scoped.row)">派单</span>
                                <span v-else @click="queryDetail(scoped.row)">详情</span>
                             </div>
                         </template>
                       </el-table-column>
                    </el-table>
                </div>
                <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex0' :total='total0'></zw-pagination>
            </div>
            <div class="tab-item" v-if="tabIndex === 2">
                <div>
                    <el-table
                       :data="tableData1"
                       style="width: 100%"
                       header-row-class-name="el-table-header"
                       :row-class-name="tableRowClassName"
                       >
                       <el-table-column
                         v-for="item in tableLabel1"
                         :key="item.label"
                         :prop="item.prop"
                         :label="item.label"
                         :width="item.width"
                          show-overflow-tooltip
                        >
                       </el-table-column>
                       <el-table-column
                         prop=""
                         label="操作">
                         <template slot-scope="scoped">
                             <div class="detail" @click="queryDetail(scoped.row)">
                                <span>详情</span>
                             </div>
                         </template>
                       </el-table-column>
                    </el-table>
                </div>
                <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex1' :total='total1'></zw-pagination>
            </div>
            <div class="tab-item" v-if="tabIndex === 3">
                <div>
                    <el-table
                       :data="tableData2"
                       style="width: 100%"
                       header-row-class-name="el-table-header"
                       :row-class-name="tableRowClassName"
                       >
                       <el-table-column
                         v-for="item in tableLabel1"
                         :key="item.label"
                         :prop="item.prop"
                         :label="item.label"
                         :width="item.width"
                         show-overflow-tooltip
                        >
                       </el-table-column>
                       <el-table-column
                         prop=""
                         label="操作">
                         <template slot-scope="scoped">
                             <div class="detail" @click="queryDetail(scoped.row)">
                                <span>详情</span>
                             </div>
                         </template>
                       </el-table-column>
                    </el-table>
                </div>
                <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex2' :total='total2'></zw-pagination>
            </div>
            <div class="tab-item" v-if="tabIndex === 4">
                <div>
                    <el-table
                       :data="tableData3"
                       style="width: 100%"
                       header-row-class-name="el-table-header"
                       :row-class-name="tableRowClassName"
                       >
                       <el-table-column
                         v-for="item in tableLabel1"
                         :key="item.label"
                         :prop="item.prop"
                         :label="item.label"
                         :width="item.width"
                         show-overflow-tooltip
                        >
                       </el-table-column>
                       <el-table-column
                         prop=""
                         label="操作">
                         <template slot-scope="scoped">
                             <div class="detail">
                                <span v-if="(scoped.row.OrderType==3||scoped.row.OrderType==5||scoped.row.OrderType==6)&&FUserType != 4" @click="beforeChangeUser(scoped.row)">派单</span>
                                <span v-else @click="queryDetail(scoped.row)">详情</span>
                             </div>
                         </template>
                       </el-table-column>
                    </el-table>
                </div>
                <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex3' :total='total3'></zw-pagination>
            </div>
            <div class="tab-item" v-if="tabIndex === 5">
                <div>
                    <el-table
                       :data="tableData4"
                       style="width: 100%"
                       header-row-class-name="el-table-header"
                       :row-class-name="tableRowClassName"
                       >
                       <el-table-column
                         v-for="item in tableLabel1"
                         :key="item.label"
                         :prop="item.prop"
                         :label="item.label"
                         :width="item.width"
                         show-overflow-tooltip
                        >
                       </el-table-column>
                       <el-table-column
                         prop=""
                         label="操作">
                         <template slot-scope="scoped">
                             <div class="detail">
                                <span v-if="(scoped.row.OrderType==3||scoped.row.OrderType==5||scoped.row.OrderType==6)&&FUserType != 4" @click="beforeChangeUser(scoped.row)">派单</span>
                                <span v-else @click="queryDetail(scoped.row)">详情</span>                             
                            </div>
                         </template>
                       </el-table-column>
                    </el-table>
                </div>
                <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex4' :total='total4'></zw-pagination>
            </div>
            <div class="tab-item" v-if="tabIndex === 6">
                <div>
                    <el-table
                       :data="tableData5"
                       style="width: 100%"
                       header-row-class-name="el-table-header"
                       :row-class-name="tableRowClassName"
                       >
                       <el-table-column
                         v-for="item in tableLabel1"
                         :key="item.label"
                         :prop="item.prop"
                         :label="item.label"
                         :width="item.width"
                         show-overflow-tooltip
                        >
                       </el-table-column>
                       <el-table-column
                         prop=""
                         label="操作">
                         <template slot-scope="scoped">
                             <div class="detail" @click="queryDetail(scoped.row)">
                                <span>详情</span>
                             </div>
                         </template>
                       </el-table-column>
                    </el-table>
                </div>
                <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex5' :total='total5'></zw-pagination>
            </div>
        </div>
        <el-dialog title="派单" class="zw-dialog order-dialog" :visible.sync="showOrder">
            <ul>
                <li>
                    <span>工单情况</span>
                    <el-input v-model="workObj.OrderContent"></el-input>
                </li>
                <li>
                    <span>接单人员</span>
                    <el-select v-model="workObj.OrderUserGUID"   placeholder="请选择">
                        <el-option v-for="user in users" :key="user.FGUID" :label="user.FContacts" :value="user.FGUID"></el-option>
                    </el-select>
                </li>
                <li>
                    <span>计划工时（小时）</span>
                    <el-input v-model="workObj.PlanFinishTime"></el-input>
                </li>
            </ul>
            <div style="margin-top:50px;text-align:center">
                <button class="zw-btn zw-btn-primary" @click="changeUser()">确定</button>
                <button class="zw-btn zw-btn-primary" style="margin-left:20px" v-if="workObj.OrderType == 5" @click="deleteOrdersByAlarm()">误报</button>
            </div>
        </el-dialog>
        <el-dialog title="工单详情" class="show-detail" :visible.sync="showDetail">
            <div style="height:760px">
            <el-scrollbar>
                <div>
                    <div>
                        <p class="title"><span class="icon-title"></span>工单信息</p>
                        <ul class="info" v-if="workInfo">
                            <li class="l">
                                <span class="item-title">工单类型:</span>
                                <span class="item-info">{{workInfo.OrderTypeName}}</span>
                            </li>
                            <li class="l">
                                <span class="item-title">工单进度:</span>
                                <span class="item-info">{{workInfo.OrderStateName}}</span>
                            </li>
                            <li class="l">
                                <span class="item-title">工单名称:</span>
                                <span class="item-info">{{workInfo.OrderContent}}</span>
                            </li>
                            <li class="l" v-if="workInfo.OrderType==9">
                                <span class="item-title">路线名称:</span>
                                <span class="item-info">{{workInfo.PatrolLineName}}</span>
                            </li>
                            <li class="l" v-else>
                                <span class="item-title">创建时间:</span>
                                <span class="item-info">{{workInfo.OrderCreateDateTime}}</span>
                            </li>
                            <li class="l">
                                <span class="item-title">计划时间:</span>
                                <span class="item-info">{{workInfo.RunningOrderDateTime}}</span>
                            </li>
                            <li class="l">
                                <span class="item-title">负责人:</span>
                                <span class="item-info">{{workInfo.FContacts}}</span>
                            </li>
                        </ul>
                    </div>
                    <div style="margin-top:39px;">
                        <p class="title"><span class="icon-title"></span>工单进度</p>
                        <!-- 巡检 -->
                        <ul class="progress clearfix" v-if="areaArr.Table2&&workInfo.OrderType==1">
                            <li class="clearfix" v-for="(item,index) in areaArr.Table2" :key="index">
                                <div class="l area-name">
                                    <div>
                                        <span>{{item.AreaName}}</span>
                                        <div :class="{circle:true,finish:!item.FaultCount&&item.AreaState==1,error:item.FaultCount>0,running:!item.FaultCount&&item.AreaState==2,waiting:item.AreaState==3}">
                                            <div class="circle-inner"></div>
                                        </div>
                                    </div>
                                    <div class="border r"></div>
                                </div>
                                <ul class="area-info clearfix">
                                    <li class="l "><span>待巡检:</span>{{item.WaitingCount}}</li>
                                    <li class="l "><span>正常:</span>{{item.NormalCount}}</li>
                                    <li class="l "><span>异常:</span>{{item.FaultCount}}</li><br>
                                    <li class="time"><span>开始时间:{{item.FStartInspectionTime}}</span><span>结束时间:{{item.FLastInspectionTime}}</span></li>
                                </ul>
                            </li>
                        </ul>
                        <!-- 抄表 -->
                        <ul class="progress clearfix" v-if="areaArr.Table1&&workInfo.OrderType==4">
                            <li class="clearfix" v-for="(item,index) in areaArr.Table1" :key="index">
                                <div class="l area-name">
                                    <div>
                                        <span>{{item.AreaName}}</span>
                                        <div :class="{circle:true,finish:!item.FaultCount&&item.AreaState==1,error:item.FaultCount>0,running:!item.FaultCount&&item.AreaState==2,waiting:item.AreaState==3}">
                                            <div class="circle-inner"></div>
                                        </div>
                                    </div>
                                    <div class="border r"></div>
                                </div>
                                <ul class="area-info clearfix">
                                    <li class="l "><span>待抄表:</span>{{item.WaitingCount}}</li>
                                    <li class="l "><span>正常:</span>{{item.NormalCount}}</li>
                                    <li class="l "><span>异常:</span>{{item.FaultCount}}</li><br>
                                    <li class="time"><span>开始时间:{{item.FStartInspectionTime}}</span><span>结束时间:{{item.FLastInspectionTime}}</span></li>
                                </ul>
                            </li>
                        </ul>
                        <!-- 巡更 -->
                        <ul class="progress clearfix" v-if="areaArr.Table1&&workInfo.OrderType==9">
                            <li class="clearfix" v-for="(item,index) in areaArr.Table1" :key="index">
                                <div class="l area-name">
                                    <div>
                                        <span :title="item.PatrolPointName">{{item.PatrolPointName}}</span>
                                        <div :class="{circle:true,waiting:item.PatrolState==0,running:item.PatrolState==1,finish:item.PatrolState==2,error:item.PatrolResult=='异常',}">
                                            <div class="circle-inner"></div>
                                        </div>
                                        <div class="photo" v-if="item.IsTaking">
                                            <i class="iconfont icon-vidicon"></i>
                                            <div class="img-container">
                                                <img :src="'http://www.szqianren.com/'+item.ImgPath" alt="">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="border r"></div>
                                </div>
                                <ul class="area-info clearfix">
<!--                                     <li class="l "><span>待抄表:</span>{{item.WaitingCount}}</li>
                                    <li class="l "><span>正常:</span>{{item.NormalCount}}</li>
                                    <li class="l "><span>异常:</span>{{item.FaultCount}}</li><br> -->
                                    <li style="text-align:left"><span>完成时间:{{item.FLastInspectionTime}}</span><span :class="['r',{red:item.PatrolResult==='异常'}]" style="margin-right:40px;">{{item.PatrolResult}}</span></li>
                                    <li class="l" v-if="item.PatrolNote != ''&&item.PatrolNote !=null" style="color:red"><span>异常描述:</span>{{item.PatrolNote}}</li>
                                </ul>
                            </li>
                        </ul>
                        <!-- 保养 -->
                        <ul class="progress clearfix" v-if="areaArr.Table5&&workInfo.OrderType==2">
                            <li class="clearfix" v-for="(item,index) in areaArr.Table5" :key="index">
                                <div v-if="index !==2">
                                    <div class="l area-name">
                                        <div>
                                            <span>{{item.Name}}</span>
                                            <div class="circle finish">
                                                <div class="circle-inner"></div>
                                            </div>
                                        </div>
                                        <div class="border r"></div>
                                    </div>
                                    <ul class="area-info clearfix">
                                        <li class="l "><span>{{item.FContacts}}　</span>{{item.FDateTime}}</li>
                                    </ul>
                                </div>
                                <div class="clearfix" v-else>
                                    <div class="area-name">
                                        <div>
                                            <span>{{item.Name}}</span>
                                            <div class="circle finish">
                                                <div class="circle-inner"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix collapse" >
                                        <el-collapse accordion >
                                          <el-collapse-item name="1">
                                            <template slot="title">
                                                <ul class="area-info clearfix">
                                                    <li class="l "><span>{{item.FContacts}}　</span>{{item.FDateTime}}</li>
                                                </ul>
                                            </template>
                                            <div class="collapse-content">
                                                <div class="collapse-content-item" v-if="areaArr.Table3">
                                                    <h5>保养前</h5>
                                                    <ul class="clearfix">
                                                        <li class="l" v-for="img in areaArr.Table3">
                                                            <img :src="'http://www.szqianren.com/'+img.MaintenanceBeforeImg" alt="">
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="collapse-content-item">
                                                    <h5>保养内容</h5>
                                                    <p style="">
                                                        <span v-for="(content,i) in areaArr.Table1">{{i+1}}.{{content.MaintenanceDetail}}　</span>
                                                    </p>
                                                </div>
                                                <div class="collapse-content-item" v-if="areaArr.Table4">
                                                    <h5>保养后</h5>
                                                    <ul class="clearfix">
                                                        <li class="l" v-for="img in areaArr.Table4">
                                                            <img :src="'http://www.szqianren.com/'+img.MaintenanceAfterImg" alt="">
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="collapse-content-item">
                                                    <h5>处理情况</h5>
                                                    <p>{{areaArr.Table[0].FDescription}}</p>
                                                </div>
                                                <div class="collapse-content-item">
                                                    <h5>实际耗材</h5>
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                      <tr class="table-header">
                                                        <td width="12.5%">序号</td>
                                                        <td width="12.5%">耗材名称</td>
                                                        <td width="12.5%">型号</td>
                                                        <td width="12.5%">单位</td>
                                                        <td width="12.5%">数量</td>
                                                      </tr>
                                                      <tr v-for="(item,key) in areaArr.Table2" :class="{'odd-row':key%2==0}" :key="key">
                                                        <td>{{key+1}}</td>
                                                        <td>{{item.SuppliesName}}</td>
                                                        <td>{{item.SuppliesTypeName}}</td>
                                                        <td>{{item.SuppliesUnit}}</td>
                                                        <td>{{item.SuppliesCount}}</td>
                                                      </tr>
                                                    </table>
                                                </div>
                                            </div>
                                          </el-collapse-item>
                                        </el-collapse>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <!-- 维修 (报事)-->
                        <ul class="progress clearfix" v-if="areaArr.Table1&&(workInfo.OrderType==3||workInfo.OrderType==6||workInfo.OrderType==5)">
                            <li class="clearfix" v-for="(item,index) in areaArr.Table1" :key="index">
                                <div v-if="item.ordername !=='处理'">
                                    <div class="l area-name">
                                        <div>
                                            <span>{{item.ordername}}</span>
                                            <div class="circle finish">
                                                <div class="circle-inner"></div>
                                            </div>
                                        </div>
                                        <div class="border r"></div>
                                    </div>
                                    <ul class="area-info clearfix">
                                        <li class="l " v-if="workInfo.OrderType==5"><span>{{item.FContacts}}　</span>{{item.Fdatetime}}</li>
                                        <li class="l " v-else><span>{{item.FContacts}}　</span>{{item.Fdatetime}}</li>
                                    </ul>
                                </div>
                                <div class="clearfix" v-else>
                                    <div class="area-name">
                                        <div>
                                            <span>{{item.ordername}}</span>
                                            <div class="circle finish">
                                                <div class="circle-inner"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix collapse" v-if="workInfo.OrderType==3||workInfo.OrderType==6">
                                        <el-collapse accordion >
                                          <el-collapse-item name="1">
                                            <template slot="title">
                                                <ul class="area-info clearfix">
                                                    <li class="l "><span>{{item.FContacts}}　</span>{{item.Fdatetime}}</li>
                                                </ul>
                                            </template>
                                            <div class="collapse-content">
                                                <div class="collapse-content-item" v-if="areaArr.Table&&areaArr.Table[0].ReportMatterBeforeImg">
                                                    <h5>{{workInfo.OrderType==3?'维修前':'处理前'}}</h5>
                                                    <ul class="clearfix">
                                                        <li class="l" v-for="img in areaArr.Table[0].ReportMatterBeforeImg.split(',')">
                                                            <img :src="'http://www.szqianren.com/'+img" alt="">
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div class="collapse-content-item" v-if="areaArr.Table&&areaArr.Table[0].ReportMatterBeforeImg">
                                                    <h5>{{workInfo.OrderType==3?'维修后':'处理后'}}</h5>
                                                    <ul class="clearfix">
                                                        <li class="l" v-for="img in areaArr.Table[0].ReportMatterAfterImg.split(',')">
                                                            <img :src="'http://www.szqianren.com/'+img" alt="">
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="collapse-content-item">
                                                    <h5>处理情况</h5>
                                                    <p>{{areaArr.Table[0].ReportMatterAfterDescription}}</p>
                                                </div>
                                                <div class="collapse-content-item" v-if="workInfo.OrderType==3">
                                                    <h5>实际耗材</h5>
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                      <tr class="table-header">
                                                        <td width="12.5%">序号</td>
                                                        <td width="12.5%">耗材名称</td>
                                                        <td width="12.5%">型号</td>
                                                        <td width="12.5%">单位</td>
                                                        <td width="12.5%">数量</td>
                                                      </tr>
                                                      <tr v-for="(item,key) in areaArr.Table2" :class="{'odd-row':key%2==0}" :key="key">
                                                        <td>{{key+1}}</td>
                                                        <td>{{item.SuppliesName}}</td>
                                                        <td>{{item.SuppliesTypeName}}</td>
                                                        <td>{{item.SuppliesUnit}}</td>
                                                        <td>{{item.SuppliesCount}}</td>
                                                      </tr>
                                                    </table>
                                                </div>
                                            </div>
                                          </el-collapse-item>
                                        </el-collapse>
                                    </div>
                                    <div class="clearfix collapse" v-else>
                                        <el-collapse accordion >
                                          <el-collapse-item name="1">
                                            <template slot="title">
                                                <ul class="area-info clearfix">
                                                    <li class="l "><span>{{item.FContacts}}　</span>{{item.AlarmTime}}</li>
                                                </ul>
                                            </template>
                                            <div class="collapse-content">
                                                <div class="collapse-content-item" v-if="areaArr.Table&&areaArr.Table[0].HandlingEventsBeforeImg">
                                                    <h5>处理前</h5>
                                                    <ul class="clearfix">
                                                        <li class="l" v-for="img in areaArr.Table[0].HandlingEventsBeforeImg.split(',')">
                                                            <img :src="'http://www.szqianren.com/'+img" alt="">
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div class="collapse-content-item" v-if="areaArr.Table&&areaArr.Table[0].HandlingEventsAfterImg">
                                                    <h5>处理后</h5>
                                                    <ul class="clearfix">
                                                        <li class="l" v-for="img in areaArr.Table[0].HandlingEventsAfterImg.split(',')">
                                                            <img :src="'http://www.szqianren.com/'+img" alt="">
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="collapse-content-item">
                                                    <h5>处理情况</h5>
                                                    <p>{{areaArr.Table[0].HandlingEventsAfterDescription}}</p>
                                                </div>
                                            </div>
                                          </el-collapse-item>
                                        </el-collapse>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-scrollbar>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {Inspection,Orders,system} from '@/caiot/request/api.js'//api接口（接口统一管理）;
import table from '@/caiot/mixins/table' //表格混入数据
import {zwPagination} from '@/caiot/zw-components/index'
export default {
    mixins:[table],
    data(){
        return{
            tabIndex:1,
            tableLabel:[
                {
                    prop: 'RowNum',
                    label: '序号',
                    width:'80'
                },
                {
                    prop: 'OrderTypeName',
                    label: '工单类型',
                },
                {
                    prop: 'OrderContent',
                    label: '工单名称',
                    width:'160'
                },
                {
                    prop: 'OrderStateName',
                    label: '工单状态',
                },
                {
                    prop: 'OrderCreateDateTime',
                    label: '创建时间',
                    width:'160'
                },
                {
                    prop: 'RunningOrderDateTime',
                    label: '计划/处理时间',
                    width:'160'
                },
                {
                    prop:'ReceivingOrderDateTime',
                    label: '接单时间',
                    width:'160'
                },
                {
                    prop: 'EndOrderDateTime',
                    label: '完成时间',
                    width:'160'
                },
                {
                    prop: 'FContacts',
                    label: '负责人'
                }
            ],
            tableLabel1:[
                {
                    prop: 'RowNum',
                    label: '序号',
                    width:'80'
                },
                {
                    prop: 'OrderTypeName',
                    label: '工单类型',
                },
                {
                    prop: 'OrderContent',
                    label: '工单名称',
                },
                {
                    prop: 'OrderCreateDateTime',
                    label: '创建时间',
                    width:'160'
                },
                {
                    prop: 'RunningOrderDateTime',
                    label: '计划/处理时间',
                    width:'160'
                },
                {
                    prop:'ReceivingOrderDateTime',
                    label: '接单时间',
                    width:'160'
                },
                {
                    prop: 'EndOrderDateTime',
                    label: '完成时间',
                    width:'160'
                },
                {
                    prop: 'FContacts',
                    label: '负责人'
                }
            ],
            workTypeList:[
                {
                    name:'全部',
                    value:0
                },
                {
                    name:'巡检',
                    value:1
                },
                {
                    name:'巡更',
                    value:9
                },
                {
                    name:'抄表',
                    value:4
                },
                {
                    name:'保养',
                    value:2
                },
                {
                    name:'报事',
                    value:6
                },
                {
                    name:'维修',
                    value:3
                },
                {
                    name:'告警',
                    value:5
                },
/*                 {
                    name:'工单池',
                    value:7
                },
                {
                    name:'故障',
                    value:8
                }, */
            ],
            selectType:{
                name:'全部',
                value:0
            },
            showSelectOption:false,
            time:[new Date(),new Date()],
            tableData0:[],
            tableData1:[],
            tableData2:[],
            tableData3:[],
            tableData4:[],
            tableData5:[],
            pageIndex0:1,
            pageIndex1:1,
            pageIndex2:1,
            pageIndex3:1,
            pageIndex4:1,
            pageIndex5:1,
            total0:0,
            total1:0,
            total2:0,
            total3:0,
            total4:0,
            total5:0,
            showDetail:false,
            workInfo:null,
            areaArr:[],
            showOrder:false,//显示派单弹框
            workObj:{},
        }
    },
    computed:{
        users(){
            return this.$store.state.orderUser //负责人
        }
    },
    components:{
        zwPagination
    },
    watch:{

    },
    created(){
        this.queryAllOrders()
        this.$store.dispatch('queryOrderTUsers')
    },
    mounted(){
    },
    methods:{
        handleCurrentChange(val){
            let pageIndex = 'pageIndex' + (this.tabIndex-1)
            this[pageIndex] = val
            this.queryOrders(val, this.tabIndex-1)
        },
        /**
         * 分页查询工单列表
         * 
         * state 状态 0全部 1处理中 2已完成 3已接单 4未派单 5已派单
         */
        queryOrders(pageIndex,state){
            Orders({
                FAction:'QueryPageUOrders',
                PageIndex:pageIndex,
                PageSize:10,
                mSearchUOrders:{
                    StartDateTime:this.time[0].toLocaleDateString() + ' 00:00',
                    EndDateTime:this.time[1].toLocaleDateString() + ' 23:59',
                    OrderType:this.selectType.value,
                    OrderState:state
                }
            })
            .then((data) => {
                let key = 'tableData' + state
                this[key] = data.FObject.Table1
                this['total'+state] = data.FObject.Table[0].FTotalCount
            }).catch((err) => {
                
            });
        },
        /**
         * 查询所有状态的
         */
        queryAllOrders(){
            this.queryOrders(this.pageIndex0,0)
            this.queryOrders(this.pageIndex1,1)
            this.queryOrders(this.pageIndex2,2)
            this.queryOrders(this.pageIndex3,3)
            this.queryOrders(this.pageIndex4,4)
            this.queryOrders(this.pageIndex5,5)
        },
        /**
         * 查看详情
         */
        queryDetail(row){
            this.showDetail = true
            this.workInfo = row
            this.areaArr = []
            console.log(this.workInfo)
            Orders({
                FAction:'QueryOrdersRecordDetail',
                ID:row.ID
            })
            .then(data => {
                this.areaArr = data.FObject
            })
            .catch(error => {
                this.areaArr = []
            })
        },
        /**
         * 点击派单
         */
        beforeChangeUser(row){
            this.showOrder = true
            this.workObj = row
        },
        /**
         * 派单
         */
        changeUser(){
            Orders({
                FAction:'UpdateUOrdersSendOrderUser',
                ID:this.workObj.ID,
                FGUID:this.workObj.OrderUserGUID,
                FDateTime:this.workObj.PlanFinishTime
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '派单成功!'
                });
                this.queryAllOrders()
            })
            .catch(err => {
                this.$message({
                  type: 'error',
                  message: '派单失败!'
                });
            })
            .finally(() => {
                this.showOrder = false
            })
        },
        /**
         * 误报（255.删除工单告警）
         */
        deleteOrdersByAlarm(){
            Orders({
                FAction:'DeleteOrdersByAlarm',
                ID:this.workObj.ID
            })
            .then(data => {
                this.showOrder = false
                this.queryAllOrders()
            })
            .catch(err => {

            })
        },
        /**
         * 导出工单
         */
        exportFile(){
            Orders({
                FAction:'ExportPageUOrders',
                mSearchUOrders:{
                    StartDateTime:this.time[0].toLocaleDateString() + ' 00:00',
                    EndDateTime:this.time[1].toLocaleDateString() + ' 23:59',
                    OrderType:this.selectType.value,
                    OrderState:this.tabIndex - 1
                }
            })
            .then(data => {
                window.location = "http://www.szqianren.com/" + data.FObject;
            })
            .catch(err => {})
        }
    }

}
</script>
<style lang="scss">
    $img-url:'../../static/image/';
    .work-list{
        .tab-header{
            >li{
                width: 100px;
                height: 46px;
                line-height: 46px;
                font-size: 16px;
                margin: 0 3px;
                float: left;
                background: url(#{$img-url}task/t2.png);
                background-size: 100% 100%;
                cursor: pointer;
            }
            >li.active{
                background: url(#{$img-url}task/t1.png);
                background-size: 100% 100%;
            }
            .select{
                width: auto;
                position: relative;
                margin-left: 230px;
                background: none;
                &-box{
                    display: inline-block;
                    width: 100px;
                    height: 46px;
                    line-height: 46px;
                    box-sizing: border-box;
                    margin-left:10px;
                    padding-left: 10px;
                    border:1px solid #134FA4;
                    cursor: pointer;
                    text-align: left;
                    i{
                        position: absolute;
                        top: 14px;
                        right: 4px;
                        font-size: 18px;
                        color: #134FA4
                    }
                }
                &-option{
                    position: absolute;
                    right: 0;
                    z-index: 1000;
                    li{
                        width: 100px;
                        height: 30px;
                        line-height: 30px;
                        background: #134FA4;
                        cursor: pointer;
                    }
                    li:hover{
                        background: #cccccc
                    }
                }
            }
            .select-time{
                width: auto;
                margin-left: 10px;
                background: none;
                .el-date-editor--daterange.el-input__inner{
                    width: 250px;
                    height: 46px;
                    line-height: 46px;
                    background: none;
                    border:1px solid rgba(12,55,110,1);
                    .el-range-separator{
                        line-height: 38px;
                        color: #F1F1F2;
                    }
                    .el-range-input{
                        color: #F1F1F2;
                        background: inherit                   
                    }
                }
            }
        }
        .tab-content{
            height: 864px;
            background: url(#{$img-url}task/bg_1.png)  no-repeat;
            padding: 56px 46px 85px 57px;
            box-sizing: border-box;
            position: relative;
            .detail{
                width: 100%;
                height: 100%;
                cursor: pointer;
                span{
                    cursor: pointer;
                }
            }
        }
        .show-detail {
            .el-dialog{
                width: 1084px;
                background: #EDF1F4;
                &__title{
                    font-size:26px;
                    font-family:MicrosoftYaHei-Bold;
                    font-weight:bold;
                    color:rgba(0,0,0,1);
                }
                .title{
                    font-size:24px;
                    color:rgba(0,0,0,1);
                    text-align: left;
                    line-height: 30px;
                    .icon-title{
                        width:4px;
                        height:19px;
                        margin-right: 10px;
                        vertical-align: middle;
                        display: inline-block;
                        background:rgba(44,146,252,1);
                    }
                }
                .red{
                    color: #EF0F24;
                }
                .info{
                    width: 982px;
                    height: 228px;
                    margin-left: 14px;
                    margin-top: 17px;
                    background:rgba(243,246,247,1);
                    border:1px solid rgba(223,221,221,1);
                    border-radius:6px;
                    li{
                        width: 50%;
                        height: 76px;
                        line-height: 76px;
                        box-sizing: border-box;
                        text-align: left;
                        font-size:20px;
                        .item-title{
                            width: 172px;
                            height: 100%;
                            display: inline-block;
                            background: #D9EAF4;
                            text-align: center;
                            color: #000000
                        }
                        .item-info{
                            padding-left: 10px;
                            color: #6D6D6D
                        }
                        .collapse-content{

                        }
                    }
                    li:nth-of-type(3),li:nth-of-type(4){
                        border-top: 2px solid #EDEDED;
                        border-bottom: 2px solid #EDEDED;
                    }
                }
                .progress{
                    width: 990px;
                    margin-top: 14px;
                    padding: 30px 20px 80px 20px;
                    box-sizing: border-box;
                    border:1px solid rgba(223,221,221,1);
                    li:first-of-type,li:last-of-type{
                        .area-name{
                            >div:first-child{
                                height: 30px;
                                line-height: 30px;
                            }
                            .circle{
                                width:30px;
                                height:30px;
                                line-height: 25px;
                                position: relative;
                                top:-10px;
                                &-inner{
                                    width:22px;
                                    height:22px;
                                }
                            }
                        }
                        .area-info{
                            margin-left: 250px;
                        }
                    }
                    li:last-of-type{
                        .area-name{
                            .border{
                                display: none
                            }
                        }
                    }
                    li{
                        .area-name{
                            >div:first-child{
                                width: 240px;
                                height: 22px;
                                line-height: 22px;
                                position: relative;
                            }
                            span{
                                width:183px;
                                display: inline-block;
                                font-size:24px;
                                font-family:MicrosoftYaHei;
                                font-weight:bold;
                                color:rgba(0,0,0,1);
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                text-align: right;
                                margin-right: 20px;
                            }
                            .photo{
                                position: absolute;
                                right: 40px;
                                .iconfont{
                                    display: inline-block;
                                    vertical-align: top;
                                    color: #2c92fc;
                                    font-size: 30px;
                                }
                                .img-container{
                                    width: 60px;
                                    height: 60px;
                                    display: inline-block;
                                    position: relative;
                                }
                                img{
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%,-50%);
                                    width: 60px;
                                    height: 60px;
                                    transition: all 0.5s;
                                    z-index: 1000;
                                }
                                img:hover{
                                    width: 300px;
                                    height: 300px;
                                    z-index: 1001;
                                }
                            }
                            .circle{
                                width:24px;
                                height:24px;
                                border:1px solid ;
                                box-sizing: border-box;
                                border-radius:50%;
                                display: inline-block;
                                line-height: 20px;
                                position: relative;
                                top:-7px;
                                &-inner{
                                    width:18px;
                                    height:18px;
                                    display: inline-block;
                                    border-radius:50%;
                                    vertical-align: middle;
                                }
                            }
                            .circle.finish{
                                border-color: rgba(0,210,148,1);
                                .circle-inner{
                                    background:rgba(0,210,148,1);
                                }
                            }
                            .circle.error{
                                border-color: #EF0F24;
                                .circle-inner{
                                    background:#EF0F24;
                                }
                            }
                            .circle.running{
                                border-color: #2C92FC;
                                .circle-inner{
                                    background:#2C92FC;
                                }
                            }
                            .circle.waiting{
                                border-color: #D7D3D3;
                                .circle-inner{
                                    background:#D7D3D3;
                                }
                            }
                            .border{
                                width:2px;
                                height:121px;
                                background:rgba(215,211,211,1);
                                border-radius:1px;
                                margin-right: 16px;
                            }
                        }
                        .area-info{
                            position: relative;
                            // top: -20px;
                            margin-left: 252px;
                            font-size:22px;
                            font-family:MicrosoftYaHei;
                            font-weight:400;
                            color:rgba(0,0,0,1);
                            li{
                                margin-left: 20px;
                            }
                            li.time{
                                margin-top: 28px;
                                text-align: left;
                                color: #6D6D6D;
                                span+span{
                                    margin-left: 28px;
                                }
                            }
                        }
                        .collapse{
                            min-height: 210px;
                            margin-left: 222px;
                            padding-left: 40px;
                            border-left: 2px solid rgba(215,211,211,1);
                            .area-info{
                                margin-left: -12px
                            }
                        }
                        .el-collapse{
                            margin-top: -34px;
                        }
                        .el-collapse-item{
                            .area-name {
                                .circle{
                                    line-height: 18px;
                                }
                            }
                            
                        }
                        .el-collapse-item.is-active{
                            .area-name{
                                .border{
                                   height: 637px;
                                }
                            }
                        }
                        .el-collapse-item__header,.el-collapse-item__wrap{
                            background: none
                        }
                        .el-collapse-item__arrow.el-icon-arrow-right{
                            font-size: 30px;
                            font-weight: bold;
                        }
                        .collapse-content{
                            background: #f2f2f2;
                            padding-left: 40px;
                            &-item{
                                h5{
                                    font-size: 18px;
                                    text-align: left;
                                    margin: 10px 0px;
                                    color: #646464
                                }
                                p{
                                    text-align:left;
                                    padding-left:20px;
                                    font-size:18px;
                                    font-weight:bold
                                }
                                img{
                                    width: 110px;
                                    height: 90px;
                                    margin-left: 20px;
                                }
                                table{
                                    margin-left: 20px;
                                    border: 1px solid #f3afaf;
                                    font-size:18px;
                                    font-weight:bold
                                }
                                .table-header{
                                    height: 36px;
                                    line-height: 36px;
                                    background: #f5c8c8;
                                }
                                tr{
                                    border: 1px solid #f3afaf;
                                }
                                td{
                                    height: 36px;
                                    border: 1px solid #f3afaf;
                                }
                                .odd-row{
                                    background: #f9e6e8
                                }
                            }
                        }
                    }
                }
            }
        }
        .order-dialog{
            .el-dialog{
                width: 480px;
                background: url(#{$img-url}task/inspection.png);
                background-size: 100% 100%;
                padding-left: 50px;
                ul{
                    padding-left: 20px;
                }
                li{
                    >span{
                        display: inline-block;
                        width: 130px;
                        text-align: right;
                    }
                }
                li+li{
                    margin-top: 20px;
                }
                .el-input{
                    width: 165px;
                    height: 39px;
                    line-height: 39px;
                    margin-left: 10px;
                    &__inner{
                        background:rgba(24,64,107,1);
                        border:1px solid rgba(5,103,158,1);
                    }
                }
            }
        }
    }
</style>
