<template>
    <div class="report">
        <h3>设备列表</h3>
        <ul class="operation clearfix">
            <li class="l" @click="beforeAdd"><el-button type='primary'><i class="el-icon-plus"></i></el-button></li>
            <li class="l" ><el-button type='primary'><i class="iconfont icon-Export"></i></el-button></li>
            <li class="r">
                <el-input class="search-input" placeholder="搜索关键字" v-model="filterText">
                    <i class="el-icon-search" slot="suffix"></i>
                </el-input>
            </li>
        </ul>
        <el-dialog :visible.sync="show" class="zw-dialog" width="695px" append-to-body :title="type?'编辑':'新增'">
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
        <div>
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
                 >
                </el-table-column>
                <el-table-column
                    label="操作"
                >
                    <template slot-scope="scoped">
                        <div>
                            <span @click="updated(scoped.row)" title="编辑"><i class="el-icon-document"></i></span>
                            <span @click="deleteProject(scoped.row)" title="删除"><i class="el-icon-delete"></i></span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination> 
    </div>
</template>
<script>
import table from '@/xiaofang/mixins/table.js'
import {Project} from '@/xiaofang/request/api.js';
import citys from './city.json'
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowNum',
                    label: '序号'
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
                    prop: 'FContacts',
                    label: '负责人'
                },
                {
                    prop: 'BuildArea',
                    label: '建筑面积（m²）'
                },
                {
                    prop: 'County',
                    label: '地区'
                },
                {
                    prop: 'Address',
                    label: '地址'
                },
            ],
            defaultAddData:{
                ID:0,
                ProjectName:'',
                ShortName:'',
                Address:'',
                BuildArea:'',
                Province:'',
                City:'',
                County:'',
                FState:1,
                FDescribe:'',
                PropertyName:'',
                PropertyLeader:'',
                PropertyPhone:''
            },
            addData:{ //添加设备对象参数
                ID:0,
                ProjectName:'',
                ShortName:'',
                Address:'',
                BuildArea:'',
                Province:'',
                City:'',
                County:'',
                FState:1,
                FDescribe:'',
                PropertyName:'',
                PropertyLeader:'',
                PropertyPhone:''
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
        console.log(citys)
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
                FRouteName:'Project',
                FAction:'QueryPageUProjectByFUserGUID',
                SearchKey:this.filterText,
                PageIndex:1,
                PageSize:10
            })
            .then((data) => {
                console.log(data)
                this.total = data.FObject.Table ? data.FObject.Table[0].FTotalCount : 0
                this.tableData = data.FObject.Table1 ? data.FObject.Table1 : []
                /**
                 * 删除操作时，当前页面无数据时跳到上一页
                 */
                if(this.tableData.length === 0&&this.pageIndex > 1){
                    --this.pageIndex
                    this.queryData()
                }
            }).catch((err) => {
                
            });
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.addData = Object.assign({},this.defaultAddData)
            this.type = 0
            this.show = true
        },
        /**
         * 点击编辑
         */
        updated(row) {
            Object.keys(this.addData).forEach(key  => {
                this.addData[key] = row[key]
            })
            this.type = 1
            this.show = true
        },
        /**
         * 新增或编辑项目
         */
        addOrUpdate(){
            this.show = false
            Project({
                FRouteName:'Project',
                FAction:'AddOrUpdateUProject',
                ID:0,
                mUProject:this.addData
            })
            .then((data) => {
                this.queryData()
            }).catch((err) => {
                
            });
        },
        async deleteProject(row){
            await this.beforeDelete()
            Project({
                FRouteName:'Project',
                FAction:'DeleteUProjectByID',
                ID:row.ID
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