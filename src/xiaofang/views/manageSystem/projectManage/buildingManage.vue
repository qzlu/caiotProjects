<template>
    <div class="report">
        <!-- 新增弹框 -->
        <el-dialog class="zw-dialog" :title="type?'编辑':'新增'" append-to-body :visible.sync="show" width="695px">
            <el-form inline ref="form" v-if="selectData">
                <el-form-item :label="selectData.NodeType == 2?'楼层名称':'节点编码'">
                    <el-input v-model="addData.code"></el-input>
                </el-form-item>
                <el-form-item label="楼层号" v-if="selectData.NodeType == 2">
                    <el-input type="number" v-model="addData.name"></el-input>
                </el-form-item>
                <el-form-item label="结点名称" v-else>
                    <el-input v-model="addData.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addNode">确 认</el-button>
                <el-button @click="show = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 批量生成楼层 -->
        <el-dialog class="zw-dialog creat-building" append-to-body title="批量生成楼层" :visible.sync="show1" width="695px">
            <div class="clearfix item">
                <p class="l"><span class="label">楼栋</span><el-input v-model="buildingName"></el-input></p>
                <p class="l"><span class="label">楼栋编号</span><el-input v-model="buildingCode"></el-input></p>
            </div>
            <div class="clearfix item">
                <span class="label l" style="line-height: 42px;">单元</span>
                <ul class="flats clearfix">
                    <li v-for="(item,index) in flats" class="l">
                        <div>{{`${item.name}(${item.code})`}}</div>
                    </li>
                    <li class="l"><span role="button" @click="deleteFlat()"><i class="el-icon-minus"></i></span><span role="button" @click="beforeAddFlat"><i class="el-icon-plus"></i></span></li>
                </ul>
            </div>
            <div class="clearfix item">
                <p class="l"><span class="label">总共</span><el-input class="unit" type="number" min="1" max="200"  v-model="floors"><span slot="suffix">层</span></el-input></p>
                <p class="l"><span class="label">开始编号</span><el-input type="number"  v-model="startFloor"></el-input></p>
            </div>
            <div class="item">
                <span class="label l">层号</span>
                <ul v-if="floors !== null&&!isNaN(parseInt(startFloor))" class="floors">
                    <li v-for="item in floorList">
                        <el-input v-model="item.name"></el-input>
                    </li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createNewFloor()">确 认</el-button>
                <el-button @click="show1 = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 新增单元 -->
        <el-dialog title="新增" class="zw-dialog" append-to-body :visible.sync="show2" width="346px">
            <el-form :model="flat" ref="addFlat">
                <el-form-item label="单元名称" prop="name" :rules="[{required:true, message: '请输入'}]">
                    <el-input v-model="flat.name"></el-input>
                </el-form-item>
                <el-form-item label="单元编号" prop="code" :rules="[{required:true, message: '请输入'}]">
                    <el-input v-model="flat.code"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addFlat">确 认</el-button>
                <el-button @click="show2 = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 批量生成房间 -->
        <el-dialog class="zw-dialog creat-room" :title="type?'编辑':'新增'" append-to-body :visible.sync="show3" width="812px">
            <div class="room-code" v-if="selectData&&selectData.FlatsCode">
                <span class="label">房间编号</span>
                <el-input v-model="selectNode.parent.data.BuildingCode" readonly=""></el-input><i class="el-icon-plus"></i>
                <el-input v-model="selectData.FlatsCode" readonly=""></el-input><i class="el-icon-plus"></i>
                <el-select v-model="formatterFloorNumber">
                    <el-option label="楼层号（补0）" :value="1"></el-option>
                    <el-option label="楼层号（不补0）" :value="0"></el-option>
                </el-select><i class="el-icon-plus"></i>
                <el-select v-model="formatterRoomNumber">
                    <el-option label="房间号（补0）" :value="1"></el-option>
                    <el-option label="房间号（不补0）" :value="0"></el-option>
                </el-select><i class="el-icon-plus"></i>
                <el-input v-model="unit">
                </el-input>
            </div>
            <ul class="room-code clearfix">
                <li class="l" v-for="(item, index) in roomList" :key="index">
                    <span class="label">楼层</span>
                    <el-input type="number" v-model="item.startFloor"></el-input><i class="el-icon-minus"></i>
                    <el-input type="number" :min="parseInt(item.startFloor)+1" v-model="item.endFloor"></el-input>
                    <span class="label">每层</span>
                    <el-input class="unit" type="number" v-model="item.roomNumber">
                        <span slot="suffix">间</span>
                    </el-input>
                </li>
                <li class="l operate" v-if="selectData&&selectData.FlatsCode"><span v-if="roomList.length>1" role="button" @click="roomList.pop()"><i class="el-icon-minus" ></i></span><span v-if="roomList[roomList.length-1].endFloor<selectData.NodeList.length" role="button" @click="addRoomListItem"><i class="el-icon-plus"></i></span></li>
            </ul>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createNewDoorplate">确 认</el-button>
                <el-button @click="show3 = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 新增家庭成员 -->
        <el-dialog class="zw-dialog" :title="type?'编辑':'新增'" append-to-body :visible.sync="show4" width="695px">
            <el-form inline ref="family" :model="familyMembers">
                <p>
                    <el-form-item label="房间编号" v-if="selectData">
                        <el-input v-model="selectData.DoorplateCode" readonly></el-input>
                    </el-form-item>
                </p>
                <el-form-item label="姓名" prop="FContacts" :rules="[{required:true,message: '请输入'}]">
                    <el-input v-model="familyMembers.FContacts"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="FGender">
                    <el-select v-model="familyMembers.FGender">
                        <el-option label="女" :value="0"></el-option>
                        <el-option label="男" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="身份证号" prop="FIdentityID" :rules="FIdentityIDRule">
                    <el-input v-model="familyMembers.FIdentityID"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="FTelephone" :rules="FTelephoneRule">
                    <el-input v-model="familyMembers.FTelephone"></el-input>
                </el-form-item>
                <el-form-item label="是否为业主" prop="FIsOwners">
                    <el-select v-model="familyMembers.FIsOwners">
                        <el-option label="否" :value="0"></el-option>
                        <el-option label="是" :value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrUpdateUFamilyMembers">确 认</el-button>
                <el-button @click="show4 = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog  class="zw-dialog" title="关联设备" append-to-body :visible.sync="show5" width="695px">
            <el-form inline ref="addDevice" :model="deviceData">
                <p>
                    <el-form-item label="房间编码" v-if="selectData">
                        <el-input v-model="selectData.DoorplateCode" readonly></el-input>
                    </el-form-item>
                </p>
                <el-form-item label="设备类型">
                    <el-select v-model="deviceData.DeviceTypeID" @change="QueryDeviceByTypeID">
                        <el-option v-for="item in deviceTypes" :key="item.ID" :value="item.ID" :label="item.DeviceTypeName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备" prop="DeviceID">
                     <el-select v-model="deviceData.DeviceID">
                        <el-option v-for="item in deviceList" :key="item.ID" :value="item.ID" :label="item.DeviceName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="安装日期" prop="InstallationDate">
                        <el-date-picker
                          v-model="deviceData.InstallationDate"
                          type="date"
                          placeholder="选择日期">
                        </el-date-picker>
                </el-form-item>
                <el-form-item label="安装位置" prop="InstallationLocation">
                    <el-input v-model="deviceData.InstallationLocation"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addUDevicePosition">确 认</el-button>
                <el-button @click="show5 = false">取 消</el-button>
            </span>
        </el-dialog>
        <ul class="operation clearfix">
            <li class="l" @click="beforeAddNode"><el-button type='primary'><i class="el-icon-plus"></i></el-button></li>
            <li class="l" @click="show1 = true"><el-button type='primary'><i class="iconfont icon-ZS-Generatefloor"></i>批量生成楼层</el-button></li>
            <li class="l" @click="createRoom"><el-button type='primary'><i class="iconfont icon-ZS-Generatehouse"></i>批量生成房间</el-button></li>
        </ul>
        <div class="clearfix" style="height:785px">
            <div class="buildings l">
                <h3>天安数码城</h3>
                <div class="border"></div>
                <div class="tree">
                    <el-scrollbar>
                        <el-tree
                            :data="data"
                            node-key="ID"
                            :props="treeProp"
                            default-expand-all
                            @node-click='nodeClick'
                            highlight-current
                            :expand-on-click-node="false">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                             <span v-if="data.NodeType == 1">{{data.NodeName}}</span>
                              <el-input v-model="data.NodeName" v-if="data.NodeType == 2" @change="addOrUpdateUFlatsInfo(data.ID,data.NodeName,data.FlatsCode)"></el-input>
                              <el-input v-model="data.NodeName" v-if="data.NodeType == 3" @change="addOrUpdateUFloorInfo(data.ID,data.FloorNumber,data.NodeName)"></el-input>
                              <el-input v-model="data.NodeName" v-if="data.NodeType == 4" @change="addOrUpdateUDoorplateInfo(data.ID,data.NodeName,data.DoorplateCode)"></el-input>
                              <span style="position:absolute;right:45px;width:100px;text-align:left">
                                  <i class="iconfont icon-Edit" v-if="data.NodeType != 1"></i>
                                  <i class="el-icon-delete" v-if="!data.NodeList||data.NodeList.length ==0" style="margin-left:20px;" @click="deleteNode(data)"></i>
                              </span>
                            </span>
                        </el-tree>
                    </el-scrollbar>
                </div>
            </div>
            <zw-card class="floor-info" :width='1225' :height='785'>
                <div class="floor-info-detail" v-if="selectData&&selectData.NodeType == 3">
                    <div class="title">楼层信息</div>
                    <ul class="operation">
                        <li class="l"><el-button type='primary'>逃生疏散图</el-button></li>
                        <li class="l">
                            <el-upload
                              action="http://47.106.64.130:56091/CaiotZSYJ/FileUploadContext"
                              :on-success="handleSuccess"
                              :show-file-list='false'
                              :data="{FAction:'UpLoadFile',FVersion:'1.0.0',FTokenID:$store.state.token,ProjectID:$store.state.projectId,FName:''}"
                             >
                                <el-button type='primary'><i class="el-icon-plus"></i></el-button>
                            </el-upload>                
                        </li>
                    </ul>
                </div>
                <div class="room-info" v-if="selectData&&selectData.NodeType == 4">
                    <ul class="tab-header">
                        <li :class="{l:true,active:roomActive == 1}" @click="roomActive  = 1">房间设备</li>
                        <li :class="{l:true,active:roomActive == 2}" @click="roomActive  = 2">家庭成员</li>
                    </ul>
                    <div class="tab-content">
                        <div class="tab-item" v-if="roomActive == 1">
                            <ul class="operation">
                                <li class="l" @click="show5 = true"><el-button type='primary'><i class="el-icon-plus"></i></el-button></li>
                            </ul>
                            <div class="table-header"></div>
                            <el-table
                             :data='tableData'
                             :row-class-name="tableRowClassName"
                            >
                                <el-table-column
                                  v-for="item in tableLabel"
                                  show-overflow-tooltip
                                  :key="item.prop"
                                  :prop="item.prop"
                                  :label="item.label"
                                  :width="item.width"
                                  :formatter="item.formatter"
                                 >
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                >
                                    <template slot-scope="scoped">
                                        <div>
                                            <span @click="deleteDevice(scoped.row)" title="删除"><i class="el-icon-delete"></i></span>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="tab-item" v-if="roomActive == 2">
                            <ul class="operation">
                                <li class="l" @click="beforeAddMember"><el-button type='primary'><i class="el-icon-plus"></i></el-button></li>
                            </ul>
                            <div class="table-header"></div>
                            <el-table
                             :data='tableData1'
                             :row-class-name="tableRowClassName"
                            >
                                <el-table-column
                                  v-for="item in tableLabel1"
                                  show-overflow-tooltip
                                  :key="item.prop"
                                  :prop="item.prop"
                                  :label="item.label"
                                  :width="item.width"
                                  :formatter="item.formatter"
                                 >
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                >
                                    <template slot-scope="scoped">
                                        <div>
                                            <span @click="updateMember(scoped.row)" title="编辑"><i class="iconfont icon-Edit"></i></span>
                                            <span @click="deleteMember(scoped.row)" title="删除"><i class="el-icon-delete"></i></span>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </zw-card>
        </div>
    </div>
</template>
<script>
import table from '@/xiaofang/mixins/table.js'
import {zwCard} from '@/components/index.js';
import {Building,Device} from '@/xiaofang/request/api.js';
import { close } from 'fs';
export default {
    mixins:[table],
    data(){
        const phoneNumbre = (rule, value, callback) => {
            var isPhone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;//手机号码
            var isMob= /^([0-9]{3,4}-)?[0-9]{7,8}$/;// 座机格式
            if(isMob.test(value)||isPhone.test(value)){
                callback();
            }
            else{
               callback(new Error('请输入正确的电话号码'));
            }
        }
        const isCardNo = (rule, value, callback) => {
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if(reg.test(value)){
                callback();
            }else{
                callback(new Error('请输入正确的身份证号码'));
            }
        }
        return{
            tableLabel:[
                {
                    prop: 'RowNum',
                    label: '序号'
                },
                {
                    prop: 'DeviceTypeName',
                    label: '设备类型'
                },
                {
                    prop: 'DeviceCode',
                    label: '设备编码',
                    width:260
                },
                {
                    prop: 'InstallationLocation',
                    label: '安装位置'
                },
                {
                    prop: 'InstallationDate',
                    label: '安装日期',
                    width:160,
                    formatter:(row) => row.InstallationDate.split('T')[0]
                },
                {
                    prop: 'DeviceParam',
                    label: '设备参数'
                },
                {
                    prop: 'IsOnline',
                    label: '设备状态'
                },
            ],
            tableLabel1:[
                {
                    prop: 'RowNum',
                    label: '序号'
                },
                {
                    prop: 'FContacts',
                    label: '姓名'
                },
                {
                    prop: 'FGender',
                    label: '性别',
                    formatter:(row) => row.FGender ==0?'女':'男'
                },
                {
                    prop: 'FIdentityID',
                    label: '身份证号码',
                    width:200
                },
                {
                    prop: 'FBirthday',
                    label: '出生年月',
                    width:160,
                    formatter:(row) =>  `${new Date(row.FBirthday).getFullYear()}-${new Date(row.FBirthday).getMonth()+1}`
                },
                {
                    prop: 'FAge',
                    label: '年龄'
                },
                {
                    prop: 'FTelephone',
                    label: '联系电话'
                },
                {
                    prop:'FIsOwners',
                    label:'是否为业主',
                    formatter:(row) => row.FIsOwners ==0?'否':'是'
                }
            ],
            data:[],
            tableData1:[],
            treeProp:{
                children:'NodeList'
            },
            show:false, //新增弹框
            show1:false,//批量生成楼层弹框
            show2:false,//新增单元
            show3:false,//批量生成房间
            show4:false,//新增家庭成员
            show5:false,//关联设备
            type:0,
            building:{
                BuildingName:'',
            },
            buildingName:'',
            buildingCode:'',
            flats:[],//单元数组
            flat:{ //单元对象
                name:'',
                code:''
            },
            addRoomData:{
                BuildingID:'',
                FloorID:'',
                FlatsID:'',
                DoorplateCode:''
            },
            floors:null,
            startFloor:1,
            floorList:[],
            selectData:null,//选中节点数据
            selectNode:null,//选中的节点
            roomActive:1,
            roomList:[{startFloor:0,endFloor:10,roomNumber:null}],
            formatterFloorNumber:1,
            formatterRoomNumber:1,
            unit:"",
            defaultFamilyMembers:{
                ID:0,
                FContacts:'',
                FGender:1,
                FIdentityID:'',
                FTelephone:'',
                FIsOwners:0,
                DoorplateID:''
            },
            familyMembers:{
                ID:0,
                FContacts:'',
                FGender:1,
                FIdentityID:'',
                FTelephone:'',
                FIsOwners:0,
                DoorplateID:''
            },
            FTelephoneRule:[{required: true, validator: phoneNumbre}], //联系方式规则
            FIdentityIDRule:[{required:true,validator:isCardNo}],
            deviceData:{
                DeviceTypeID:'',
                DeviceID:'',
                PositionID:'',
                InstallationLocation:'',
                InstallationDate:''
            },
            deviceTypes:[],//所有设备类型
            deviceList:[],
            addData:{
                code:'',
                name:''
            }


        }
    },
    components: {
      zwCard
    },
    watch:{
        floors(val){
            if(parseInt(val) > 200){
                this.floors = 200
            }
            if(parseInt(val) < 1){
                this.floors = 1
            }
            this.creatFloor()
        },
        startFloor(val){
            if(!isNaN(val)){
                this.creatFloor()
            }
        }
    },
    created(){
        this.queryData()
        this.queryDeviceType()
    },
    methods:{
        /**
         * 生成楼层
         */
        creatFloor(){
            if(this.startFloor>0){
                this.floorList =  Array.from({length:this.floors}).map((item,index) => {return {i:index+1,name:index+1}})
            }else{
                this.floorList =  Array.from({length:this.floors}).map((item,index) => {
                    let i = index + (parseInt(this.startFloor))
                    if(i<0){
                        return {'i':i,'name':i}
                    }else{
                        return {'i':i+1,'name':i+1}
                    }
                    
                })
            }   
        },
        handleData(data){
            console.log(data);

        },
        /**
         * .楼宇管理-查询楼宇树形结构数据
         */
        queryData(){
            Building({
                FRouteName:'Building',
                FAction:'QueryUBuildingTreeData'
            })
            .then((data) => {
                console.log(data);
                this.data = data.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 查询设备类型
         */
        queryDeviceType(){
            Device({
                FRouteName:'Device',
                FAction:'QueryDeviceType'
            })
            .then((data) => {
                this.deviceTypes = data.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 根据设备类型查设备
         */
        QueryDeviceByTypeID(id){
            Device({
                FRouteName:'Device',
                FAction:'QueryDeviceByTypeID',
                TypeId:id
            })
            .then((data) => {
                this.deviceList = data.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 增删改查
         */
        handleCreate(data){
            console.log(data);
            this.queryData()
        },
        /**
         * 删除单元
         */
        deleteFlat(){
            this.flats.pop()
        },
        beforeAddFlat(){
            this.flat.name = null
            this.flat.code = null
            this.show2 = true
        },
        /**
         * 添加单元
         */
        async addFlat(){
            await new Promise(resolve => {
                this.$refs.addFlat.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.show2 = false
            let obj = Object.assign({},this.flat)
            this.flats.push(obj)
        },
        /**
         * .楼宇管理-批量生成楼层
         */
        createNewFloor(){
            let flatsName = this.flats.map(item => `${item.name}|${item.code}`).join(',')
            let floorName = this.floorList.map(item => `${item.i}|${item.name}`).join(',')
            this.show1 = false
            Building({
                FRouteName:'Building',
                FAction:'CreateNewFloor',
                mFlatsFloor:{
                    BuildingName:`${this.buildingName}|${this.buildingCode}`,
                    FlatsName:flatsName,
                    FloorName:floorName
                },
                
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
                
            });
        },
        nodeClick(data,node){
            this.selectData = data
            this.selectNode = node
            console.log(data,node)
            if(data.NodeType ==4){
                this.queryUDeviceByDoorplateID(data.ID)
                this.queryUFamilyMembersByDoorplateID(data.ID)
            }
        },
        /**
         * 点击批量生成房间按钮
         */
        createRoom(){
            if(this.selectData&&this.selectData.NodeType ==2){
                this.show3 = true
            }else{
                this.$message({
                    type:'warning',
                    message:'请选择单元'
                })
            }
            // if()
        },
        /**
         * 批量生成房间-添加楼层范围
         */
        addRoomListItem(){
            if(this.roomList[this.roomList.length-1].endFloor>=this.selectData.NodeList.length){
                this.$message({
                    type:'warning',
                    message:''
                })
            }
            this.roomList.push({startFloor:"",endFloor:'',roomNumber:''})
        },
        /**
         * .楼宇管理-批量生成房间
         */
        createNewDoorplate(){
            let buildingID = this.selectData.BuildingID
            let flatsID = this.selectData.ID
            let floorIDArr = [] , rooms = []
            let buildingCode = this.selectNode.parent.data.BuildingCode
            let flatCode = this.selectData.FlatsCode
            for(let n = 0;n<this.roomList.length;n++){
                let item = this.roomList[n]
                item.startFloor = Number(item.startFloor)
                item.endFloor = Number(item.endFloor)
                //楼层范围大于楼层数时
                if(item.endFloor>Number(this.selectData.NodeList[this.selectData.NodeList.length-1].FloorNumber)){
                    item.endFloor = Number(this.selectData.NodeList[this.selectData.NodeList.length-1].FloorNumber)
                }
                if(item.roomNumber == null||item.roomNumber == ''){
                    this.$message({
                        type:'warning',
                        message:'请输入每层房间数'
                    })
                    return
                }
                if(Number(item.startFloor)>Number(item.endFloor)){
                    this.$message({
                        type:'warning',
                        message:'开始楼层需小于结束楼层'
                    })
                    return
                }
                if(n>=1){
                    if(Number(item.startFloor)<Number(this.roomList[n-1].endFloor)){
                        this.$message({
                            type:'warning',
                            message:'请正确输入'
                        })
                        return
                    }
                }
                if(item.startFloor > 0){
                    for(let i = item.startFloor;i<=item.endFloor;i++){
                        let floor = this.selectData.NodeList.find(item => item.FloorNumber == i)
                        let floor_rooms = []
                        for(let j =0 ;j<item.roomNumber;j++){
                            if(this.formatterFloorNumber&&this.formatterRoomNumber){
                                floor_rooms.push(`${buildingCode}${flatCode}${floor.NodeName}0${j+1}${this.unit}`)
                            }else if(this.formatterFloorNumber&&!this.formatterRoomNumber){
                                floor_rooms.push(`${buildingCode}${flatCode}${floor.NodeName}${j+1}${this.unit}`)
                            }else if(!this.formatterFloorNumber&&this.formatterRoomNumber){
                                floor_rooms.push(`${buildingCode}${flatCode}0${j+1}${this.unit}`)
                            }else{
                                floor_rooms.push(`${buildingCode}${flatCode}${j+1}${this.unit}`)
                            }
                        }
                        floorIDArr.push(floor.ID)
                        rooms.push(floor_rooms.join(','))
                    }
                }else{
                    for(let i = item.startFloor;i<item.endFloor;i++){
                        let index = i>=0?i+1:i
                        let floor = this.selectData.NodeList.find(item => item.FloorNumber == index)
                        let floor_rooms = []
                        for(let j =0 ;j<item.roomNumber;j++){
                            if(this.formatterFloorNumber&&this.formatterRoomNumber){
                                floor_rooms.push(`${buildingCode}${flatCode}${floor.NodeName}0${j+1}${this.unit}`)
                            }else if(this.formatterFloorNumber&&!this.formatterRoomNumber){
                                floor_rooms.push(`${buildingCode}${flatCode}${floor.NodeName}${j+1}${this.unit}`)
                            }else if(!this.formatterFloorNumber&&this.formatterRoomNumber){
                                floor_rooms.push(`${buildingCode}${flatCode}0${j+1}${this.unit}`)
                            }else{
                                floor_rooms.push(`${buildingCode}${flatCode}${j+1}${this.unit}`)
                            }
                        }
                        floorIDArr.push(floor.ID)
                        rooms.push(floor_rooms.join(','))
                    }
                }
            }
            this.show3 = false
            Building({
                FRouteName:'Building',
                FAction:'CreateNewDoorplate',
                mUDoorplate:{
                    BuildingID:buildingID,
                    FloorID:floorIDArr.join(','),
                    FlatsID:flatsID,
                    DoorplateCode:rooms.join('|'),
                    DoorplateName:rooms.join('|').replace(eval(`/${buildingCode}${flatCode}/ig`),'')
                },
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 新增/修改单元
         */
        addOrUpdateUFlatsInfo(id = 0,name = this.addData.name,code = this.addData.code){
            this.show = false
            Building({
                FRouteName:'Building',
                FAction:'AddOrUpdateUFlatsInfo',
                FType:id == 0?0:1,
                mUFlats:{
                    ID:id,
                    BuildingID:this.selectData.ID,
                    FlatsName:name,
                    FlatsCode:code
                }
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 新增/修改楼层
         */
        addOrUpdateUFloorInfo(id = 0,name = this.addData.name,code = this.addData.code){
            this.show = false
            Building({
                FRouteName:'Building',
                FAction:'AddOrUpdateUFloorInfo',
                FType:id == 0?0:1,
                mUFloor:{
                    ID:id,
                    BuildingID:this.selectData.BuildingID,
                    FlatsID:this.selectData.ID,
                    FloorNumber:name,
                    FloorCode:code
                }
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 新增/修改门牌信息
         */
        addOrUpdateUDoorplateInfo(id = 0,name = this.addData.name,code = this.addData.code){
            this.show = false
            Building({
                FRouteName:'Building',
                FAction:'AddOrUpdateUDoorplateInfo',
                FType:id == 0?0:1,
                mUDoorplate:{
                    ID:id,
                    BuildingID:this.selectData.BuildingID,
                    FlatsID:this.selectData.FlatsID,
                    FloorID:this.selectData.ID,
                    DoorplateName:name,
                    DoorplateCode:code
                }
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 点击头部新增按钮
         */
        beforeAddNode(){
            this.addData.code  = ''
            this.addData.name = ''
            if(this.selectData == null||this.selectData == ''){
                this.$message({
                    type:'warning',
                    message:'请选择节点'
                })
                return
            }
            if(this.selectData.NodeType == 4) return
            this.show = true
        },
        addNode(){
            if(this.selectData.NodeType == 1){
                this.addOrUpdateUFlatsInfo()
            }else if(this.selectData.NodeType == 2){
                this.addOrUpdateUFloorInfo()
            }else if(this.selectData.NodeType == 3){
                this.addOrUpdateUDoorplateInfo()
            }
        },
        /**
         * 楼宇管理-根据门牌号(房间)查询设备列表
         */
        queryUDeviceByDoorplateID(id){
            Building({
                FRouteName:'Building',
                FAction:'QueryUDeviceByDoorplateID',
                ID:id
            })
            .then((data) => {
                this.tableData = data.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 楼宇管理-根据门牌号(房间)查询家庭成员列表
         */
        queryUFamilyMembersByDoorplateID(id){
            Building({
                FRouteName:'Building',
                FAction:'QueryUFamilyMembersByDoorplateID',
                ID:id
            })
            .then((data) => {
                console.log(data);
                this.tableData1 = data.FObject
            }).catch((err) => {
                console.log(err);
            });
        },
        /**
         * 点击新增家庭成员
         */
        beforeAddMember(){
            this.type = 0
            this.familyMembers = Object.assign({},this.defaultFamilyMembers)
            this.show4 = true
        },
        /**
         * 编辑家庭成员
         */
        updateMember(row){
            this.type = 1
            Object.keys(this.familyMembers).forEach(key => {
                this.familyMembers[key] = row[key]
            })
            this.show4 = true
        },
        /**
         * .楼宇管理-新增/修改家庭成员及门牌号(房间)关联信息
         */
        async addOrUpdateUFamilyMembers(){
            await new Promise(resolve => {
                this.$refs.family.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.familyMembers.DoorplateID = this.selectData.ID
            this.show4 = false
            Building({
                FRouteName:'Building',
                FAction:'AddOrUpdateUFamilyMembers',
                mUFamilyMembers:this.familyMembers
            })
            .then((data) => {
                this.queryUFamilyMembersByDoorplateID(this.selectData.ID)
            }).catch((err) => {
                
            });
        },
        /**
         * 删除家庭成员
         */
        async deleteMember(row){
            await this.beforeDelete()
            Building({
                FRouteName:'Building',
                FAction:'DeleteUFamilyMembers',
                ID:this.selectData.ID,
                FGuid:row.FUserGUID
            })
            .then((data) => {
                this.queryUFamilyMembersByDoorplateID(this.selectData.ID)
            }).catch((err) => {
                
            });
        },
        /**
         * 新增设备门牌号(房间)关联信息
         */
        async addUDevicePosition(){
            await new Promise(resolve => {
                this.$refs.addDevice.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.deviceData.PositionID = this.selectData.ID
            this.deviceData.InstallationDate = this.deviceData.InstallationDate.toLocaleDateString()
            this.show5 = false
            Building({
                FRouteName:'Building',
                FAction:'AddUDevicePosition',
                mUDevicePosition:this.deviceData
            })
            .then((data) => {
                this.queryUDeviceByDoorplateID(this.selectData.ID)
            }).catch((err) => {
                
            });
        },
        /**
         * 删除设备
         */
        async deleteDevice(row){
            await this.beforeDelete()
            Building({
                FRouteName:'Building',
                FAction:'DeleteUDevicePosition',
                ID:row.ID
            })
            .then((data) => {
                this.queryUDeviceByDoorplateID(this.selectData.ID)
            }).catch((err) => {
                
            });
        },
        /**
         * 楼宇管理-删除楼宇
         */
        async deleteUBuilding(row){
            await this.beforeDelete()
            Building({
                FRouteName:'Building',
                FAction:'DeleteUBuilding',
                ID:row.ID
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * .楼宇管理-删除单元
         */
        async deleteUFlats(row){
            await this.beforeDelete()
            Building({
                FRouteName:'Building',
                FAction:'DeleteUFlats',
                ID:row.ID
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
            });
        },
        /**
         * 楼宇管理-删除楼层
         */
        async deleteUFloor(row){
            await this.beforeDelete()
            Building({
                FRouteName:'Building',
                FAction:'DeleteUFloor',
                ID:row.ID
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 删除房间
         */
        async deleteUDoorplate(row){
            await this.beforeDelete()
            Building({
                FRouteName:'Building',
                FAction:'DeleteUDoorplate',
                ID:row.ID
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
                
            });
        },
        async deleteNode(data){
            if(data.NodeType == 1){
                this.deleteUBuilding(data)
            }else if(data.NodeType == 2){
                this.deleteUFlats(data)
            }else if(data.NodeType == 3){
                this.deleteUFloor(data)
            }else{
                this.deleteUDoorplate(data)
            }
        },
        handleSuccess(res,file){
            if(res.Result == 200){
               Building({
                   FAction:'UpdateUFloorEvacuationMap',
                   ID:this.selectData.ID,
                   FilePath:res.FObject.FilePath
               })
               .then((data) => {
                    this.$message({
                        type:'success',
                        message:'上传成功'
                    })
               }).catch((err) => {
                   
               });
            }else{
                this.$message({
                    type:'error',
                    message:'上传失败'
                })
            }
        }
    }
}
</script>
<style lang="scss">
$img-url:'../../../../assets/image/';
.report{
    .buildings{
        width: 397px;
        height: 100%;
        box-sizing: border-box;
        padding-left: 6px;
        padding-right: 4px;
        background: url(#{$img-url}tree-bg.png) left;
        h3{
            margin-top: 32px;
            text-align: center;
        }
        .border{
            width:389px;
            height:2px;
            margin:29px 5px; 
            background:rgba(45,160,203,1);
            opacity:0.62;
        }
        .tree{
            height: 650px;
            .el-tree{
                background: none;
                padding-left: 20px;
                .el-input__inner{
                    background: none;
                    border: none;
                    font-size: 16px;
                    color: #9EE5F3
                }
                .el-tree-node:focus {
                    >.el-tree-node__content {
                        background:#818643
                    }
                }
                &-node__content{
                    height: 40px;
                    line-height: 40px;
                    span{
                        font-size: 16px;
                        color: #9EE5F3
                    }
                    .el-tree-node__expand-icon.is-leaf{
                        color: transparent
                    }
                }
                &-node__content:hover {
                    background:#818643;
                }
            }
            .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
                background:#818643;
            }
        }

    }
    .floor-info{
        margin-left: 408px;
        &-detail{
            .title{
                width:145px;
                height:61px;
                line-height: 61px;
                margin: 16px auto;
                background:linear-gradient(94deg,rgba(26,85,149,1),rgba(17,136,175,1),rgba(26,85,149,1));
                border-radius:29px 27px 27px 29px;
                font-size:22px;
                color: #9EE5F3;
            }
        }
        .room-info{
            width: 100%;
            height: 100%;
            ul.tab-header{
                width: 290px;
                height: 62px;
                box-sizing: border-box;
                line-height: 62px;
                margin: 20px auto;
                font-size:22px;
                li{
                    width: 50%;
                    height: 100%;
                    box-sizing: border-box;
                    cursor: pointer;
                    border:1px solid rgba(95, 205, 242, 1);
                }
                li:first-of-type{
                    border-right: none;
                    border-radius: 29px 0 0 29px;
                }
                li:last-of-type{
                    border-left: none;
                    border-radius: 0 29px 29px 0;
                }
                li.active{
                    background:linear-gradient(94deg,rgba(26,85,149,1),rgba(17,136,175,1),rgba(26,85,149,1));
                }
            }
        }
    }
}
.zw-dialog.creat-building{
    .el-dialog{
        .item{
            margin: 20px 0;
            ul{
                margin-left: 112px;
            }
            ul.flats{
                li{
                    line-height: 42px;
                    margin-right: 16px;
                    margin-bottom: 10px;
                    >div{
                        width:94px;
                        height:42px;
                        border:1px solid rgba(158, 229, 243, 0.27);
                        border-radius:2px;
                        text-align: center;
                        color: #9EE5F3;
                    }
                    .el-input{
                        width: 94px;
                    }
                    span{
                        display: inline-block;
                        width: 24px;
                        height: 24px;
                        line-height: 24px;
                        text-align: center;
                        border-radius: 50%;
                        border: 1px solid #9EE5F3;
                        cursor: pointer;
                        i{
                            font-size: 14px;
                            color: #9EE5F3;
                        }
                    }
                    span+span{
                        margin-left: 10px;
                    }
                }
            }
            ul.floors{
                li{
                    display: inline-block;
                    width:65px;
                    height:42px;
                    line-height: 42px;
                    margin-right: 10px;
                    margin-bottom: 16px;
                    border-radius:2px;
                    text-align: center;
                    color: #9EE5F3;
                    .el-input{
                        width: 100%
                    }
                }
            }
            .el-form-item__error{
                left: 50%
            }
        }
    }
}
.zw-dialog.creat-room{
    .el-dialog{
        .room-code{
            margin: 30px 0 ;
            li{
                margin-bottom: 10px;
            }
            .el-input{
                width: 80px;
            }
            .el-select{
                .el-input{
                    width:144px;
                }
            }
            .unit.el-input{
                width: 166px;
            }
            i{
                margin: 0 10px;
                font-size: 12px;
                color:#9EE5F3;
            }
            .operate{
                line-height: 42px;
                span{
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                    line-height: 24px;
                    margin-left: 10px;
                    text-align: center;
                    border-radius: 50%;
                    border: 1px solid #9EE5F3;
                    cursor: pointer;
                    i{
                        font-size: 14px;
                        color: #9EE5F3;
                        margin: 0;
                    }
                }
            }
        }
    }
}
</style>
