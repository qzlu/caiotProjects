<template>
    <div class="report">
        <!-- <h3 style="margin-bottom:20px">基本信息</h3> -->
        <ul class="operation clearfix">
            <li class="l"><h3 style="line-height:45px;">基本信息</h3></li>
            <li class="l" style="margin-left:20px;" @click="updated(tableData)"><el-button type='primary'><i class="iconfont icon-Edit" style="position: relative;top:-4px;font-size:24px;"></i></el-button></li>
        </ul>
        <div class="project-info">
            <div class="l">
                <img  src="@/assets/image/shuziYy/info.png" alt="" width="310" height="383">
                <br><span style="margin-top:20px;font-size:20px;">宣传图</span> 
            </div>
            <ul>
                <li v-for="(item,i) in tableLabel" :key="i">
                    <span class="label">{{item.label}}:</span>
                    <span class="project-item" v-if="item.formatter">{{item.formatter(tableData)}}</span>
                    <span class="project-item" v-else>{{tableData[item.prop]}}</span>
                </li>
            </ul>
        </div>
        <el-dialog :visible.sync="show" class="zw-dialog" width="695px" append-to-body title="编辑">
            <el-form :model="addData"  inline ref="form">
                <el-form-item label="项目全称" prop='ProjectName'>
                  <el-input v-model="addData.ProjectName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目简称" prop='ShortName'>
                    <el-input v-model="addData.ShortName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="物业名称" prop='PropertyName'>
                    <el-input v-model="addData.PropertyName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="负责人" prop='PropertyLeader'>
                    <el-input v-model="addData.PropertyLeader" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop='PropertyPhone'>
                    <el-input v-model="addData.PropertyPhone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="建筑面积" prop='BuildArea'>
                  <el-input class="unit" type="number" v-model="addData.BuildArea" autocomplete="off">
                     <span slot="suffix">m²</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="建筑类型">
                    <el-select v-model="addData.BuildTypeName">
                        <el-option value="综合" label="综合"></el-option>
                        <el-option value="物业" label="物业"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属平台">
                    <el-select v-model="selectFrom" multiple collapse-tags>
                        <el-option value="1" label="数字消防"></el-option>
                        <el-option value="2" label="数字电梯"></el-option>
                        <el-option value="3" label="数字充电桩"></el-option>
                        <el-option value="4" label="数字有限空间"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="第三方ID" prop='OtherSourceID'>
                    <el-input v-model="addData.OtherSourceID" type="number" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地区" prop='County'>
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="click"
                      popper-class="city-list"
                      @hide='hide'
                      v-model="show1"
                      >
                      <div class="city">
                          <ul>
                              <li :class="{active:province.p == provin.p}" v-for="(provin,i) in provins" :key="i" @click="selectProvince(provin)">{{provin.p}}</li>
                          </ul>
                          <ul v-if="province.c">
                              <li :class="{active:city.n == item.n}" v-for="(item,i) in province.c" :key="i" @click="selectCity(item)">{{item.n}}</li>
                          </ul>
                          <ul v-if="city.a">
                              <li :class="{active:area.s == obj.s}" v-for="(obj,i) in city.a" :key="i" @click="selectArea(obj)">{{obj.s}}</li>
                          </ul>
                          <div class="footer">
                              <el-button class="zw-btn" @click='comfir'>确定</el-button>
                              <el-button class="zw-btn" @click="show1 = false">取消</el-button>
                          </div>
                      </div>
                      <div slot="reference" autocomplete="off" style="width:502px;height:40px;padding-left:10px;border: 1px solid rgba(158, 229, 243, 0.27); background: #092D53;cursor: pointer;color:#9EE5F3">{{this.addData.Province}}　{{this.addData.City}}　{{this.addData.County}}</div>
                    </el-popover>
                </el-form-item>
                <el-form-item label="地址" prop='Address'>
                    <el-input v-model="addData.Address" class="block"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrUpdate()">确 定</el-button>
                <el-button @click="show = false">取 消</el-button>
            </span>
        </el-dialog>                               
    </div>
</template>
<script>
import table from '@/xiaoFangCloud/mixins/table'
import {Project} from '@/xiaoFangCloud/request/api.js';
import citys from './city.json'
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'BlocName',
                    label: '所属集团'
                },
                {
                    prop: 'ProjectName',
                    label: '项目名称'
                },
                {
                    prop: 'ShortName',
                    label: '项目简称'
                },
                {
                    prop:'PropertyName',
                    label:'物业名称'
                },
                {
                    prop: 'PropertyLeader',
                    label: '负责人'
                },
                {
                    prop: 'PropertyPhone',
                    label: '联系电话'
                },
                {
                    prop: 'BuildArea',
                    label: '建筑面积（m²）'
                },
                {
                    prop: 'BuildTypeName',
                    label: '建筑类型'
                },
                {
                    prop: 'City',
                    label: '城市'
                },
                {
                    prop: 'Address',
                    label: '地址',
                    width:'350'
                },
                {
                    prop: '',
                    label: '经纬度',
                    formatter:(val) =>  `${val['Flng']}　${val['Flat']}`
                },
                {
                    prop: 'FormName',
                    label: '所属平台类型'
                },
                {
                    prop:"OtherSourceID",
                    label:'第三方ID'
                },
            ],
            selectFrom:[],
            defaultAddData:{
                ProjectID:'',
                ProjectName:'',
                ShortName:'',
                BlocID:null,
                Address:'',
                BuildArea:'',
                BuildTypeName:null,
                OtherSourceID:0,
                SystemType:null,
                OnlineDateTime:null,
                Province:'',
                City:'',
                County:'',
                Flng:'',
                Flat:'',
                FState:1,
                FDescribe:'',
                PropertyName:'',
                PropertyLeader:'',
                PropertyPhone:'',
                FDescribe:''
            },
            addData:{ //添加设备对象参数
                ProjectID:'',
                ProjectName:'',
                ShortName:'',
                BlocID:null,
                Address:'',
                BuildArea:'',
                BuildTypeName:null,
                OtherSourceID:0,
                SystemType:null,
                OnlineDateTime:null,
                Province:'',
                City:'',
                County:'',
                Flng:'',
                Flat:'',
                FState:1,
                FDescribe:'',
                PropertyName:'',
                PropertyLeader:'',
                PropertyPhone:'',
                FDescribe:''
            },
            typeList:[{name:'烟感',addDataTypeID:1}],
            provins:[],
            province:{},
            city:{},
            area:{},
            active1:'',
            active2:'',
            active3:'',
            show1:false

        }
    },
    created(){
        this.provins = citys
    },
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    mounted(){
        this.queryData()
    },
    methods:{
        /**
         * 分页查询设备
         */
        queryData(){
            Project({
                FAction:'QueryUProject',
            })
            .then((data) => {
                this.tableData = (data.FObject&&data.FObject[0])||{}
            }).catch((err) => {
                
            });
        },
        /**
         * 点击编辑
         */
        updated(row) {
            Object.keys(this.addData).forEach(key  => {
                this.addData[key] = row[key]
            })
            this.selectFrom = row.FormID?row.FormID.split(','):[]
            console.log(this.selectFrom,row.FormID)
            this.show = true
        },
        /**
         * 编辑项目
         */
        async addOrUpdate(){
            this.show = false
            //地址编译成经纬度
            let myGeo = new BMap.Geocoder()
            let address = this.addData.Province + this.addData.City + this.addData.County + this.addData.Address
            await new Promise((resolve) => {
                myGeo.getPoint(address,point => {
                    this.addData.Flng = point.lng||this.addData.Flng
                    this.addData.Flat = point.lat||this.addData.Flng
                    resolve()
                })
            })
            Project({
                FRouteName:'Project',
                FAction:'AddOrUpdateUProject',
                IDStr:this.selectFrom.join(','),
                uProject:this.addData
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 选择省
         */
        selectProvince(item){
            this.province = item
            this.city = {}
        },
        /**
         * 选择市
         */
        selectCity(item){
            this.city = item
            console.log(this.city)
        },
        /**
         * 选择区
         */
        selectArea(item){
            this.area = item
        },
        comfir(){
            this.addData.Province = this.province.p
            if(!this.city.a){
                this.addData.City = this.province.p
                this.addData.County = this.city.n
            }else{
                this.addData.City = this.city.n
                this.addData.County =this.area.s
            }
            this.show1 = false
        },
        hide(){
            this.province = {}
            this.city = {}
            this.area = {}
        }
    }
}
</script>
<style lang="scss">
.project-info{
    margin-top: 80px;
    img{
        margin: 20px 0;
    }
    ul{
        width: 1200px;
        /* height: 455px; */
        margin-left: 415px;
        background:rgba(14,49,83,1);
        border:1px solid rgba(101,168,224,1);
        border-radius:6px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        li{
            width: 50%;
            height: 60px;
            line-height: 60px;
            box-sizing: border-box;
            border-bottom: 2px solid #65A8E0;
            display: flex;
            overflow: hidden;
            span{
                display: inline-block;
                box-sizing: border-box;
                height: 100%;
            }
            .label{
                width: 172px;
                padding-right: 10px;
                text-align: right;
                background: #0D3F72;
            }
            .project-item{
                width: 426px;
                padding-left: 10px;
                text-align: left;
            }
        }
        li:last-of-type/* ,li:nth-last-of-type(2) */{
            border-bottom: none;
        }
    }
}
.city-list{
    width: 512px!important;
    background: #05203C;
    border-color: #05203C;
    .city{
        ul{
            border-bottom: 1px dotted rgba(158, 229, 243, 0.27);
            li{
                display: inline-block;
                padding: 10px;
                margin-left: 10px;
                margin-bottom: 10px;
                cursor: pointer;
                color: #9EE5F3;
                border-radius: 4px;
            }
            li.active{
                background: #1E4F8F;
            }
        }
        ul+ul{
            margin-top: 6px;
        }
        .footer{
            margin-top: 10px;
            text-align: right;
            .el-button{
                height: 38px;
                line-height: 38px;
                padding: 0 25px;
                color: #9EE5F3;
                border: 1px solid rgba(81, 128, 205, 0.82);
                background: radial-gradient(#133E6B, #1E4F8F);
            }
        }
    }
}

</style>