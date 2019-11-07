<template>
    <div class="report inspection-item ">
        <el-dialog :title="type?'编辑':'新增'" :visible.sync="show" width="750px"  class="zw-dialog">
            <el-form :model="addInfo" inline ref="form" label-width="140px">
                <el-form-item label="指令全称" prop="CMDName"  :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.CMDName">
                    </el-input>
                </el-form-item>
                <el-form-item label="指令简称" prop="CMDShortName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.CMDShortName">
                    </el-input>
                </el-form-item>
                <el-form-item label="指令模式" prop="CMDMode" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.CMDMode"  placeholder="请选择" >
                    <el-option  label="开关" :value="1"></el-option>
                    <el-option  label="遥控" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备名称" prop="DeviceID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.DeviceID"  value-key="DeviceID" filterable  placeholder="请选择" >
                    <el-option v-for="list in deviceList" :key="list.DeviceID" :label="list.DeviceName" :value="list.DeviceID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="网关名称" prop="LDasID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="addInfo.LDasID" filterable placeholder="请选择" @change="selectLdas">
                    <el-option v-for="item in LDasList" :key="item.LDasID" :label="item.LDasName"  :value="item.LDasID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="写入仪表关系名称" prop="WriteMapTabID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="WriteMapTab" value-key="MapTabID" filterable placeholder="请选择" @change="selectWriteMap">
                    <el-option v-for="item in meterMapList" :key="item.MapTabID" :label="item.VarName"  :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="读取仪表关系名称" prop="ReadMapTabID" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="ReadMapTab"  value-key="MapTabID" filterable  placeholder="请选择" @change="selectReadMap">
                    <el-option v-for="list in meterMapList" :key="list.MapTabID" :label="list.VarName" :value="list"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设置值" prop="Value">
                    <el-input type="number" v-model="addInfo.Value">
                    </el-input>
                </el-form-item>
                <el-form-item label="延迟时间" prop="Delay">
                    <el-input type="number" v-model="addInfo.Delay">
                        <i slot="suffix" class="unit">s</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="创建时间" prop="BuiltTime">
                    <el-input type="number" v-model="addInfo.BuiltTime">
                        <i slot="suffix" class="unit">ms</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="检查时间" prop="CheckTime">
                    <el-input type="number" v-model="addInfo.CheckTime">
                        <i slot="suffix" class="unit">ms</i>
                    </el-input>
                </el-form-item>
            </el-form>
            <div class="submit">
                <button class="zw-btn zw-btn-primary" @click="addOrUpdate()">确定</button>
            </div>
        </el-dialog>    
        <ul class="report-header clearfix">
            <li class="l"><button class="zw-btn zw-btn-add" @click="beforeAdd">新增</button></li>
            <li class="r">
                <el-input class="search-input" placeholder="搜索关键字" v-model="filterText">
                    <i class="el-icon-search" slot="suffix"></i>
                </el-input>
            </li>
        </ul>
        <div class="zw-table">
            <el-table
               :data="tableData"
               style="width: 100%"
               header-row-class-name="el-table-header"
               :row-class-name="tableRowClassName"
               >
               <el-table-column
                 v-for="item in tableLabel"
                 :key="item.prop"
                 :prop="item.prop"
                 :width="item.width"
                 :label="item.label"
                 :sortable="item.sortble"
                 :formatter="item.formatter"
                 show-overflow-tooltip
                >
               </el-table-column>
               <el-table-column
                 prop=""
                 label="操作">
                 <template slot-scope="scoped">
                     <div class="role-operation">
                        <span class="pointer" @click="updatedRow(scoped.row)">编辑</span>
                        <span class="pointer" @click="deleteItem(scoped.row)">删除</span>
                     </div>
                 </template>
               </el-table-column>
            </el-table>
        </div>
        <zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
    </div>
</template>
<script>
import table from '@/caiot/mixins/table' //表格混入数据
import {Control,system,Device} from '@/caiot/request/api.js';
export default {
    mixins:[table],
    data(){
        return{
            tableLabel:[
                {
                    prop: 'RowNum',
                    label: '序号',
                    width:80
                },
                {
                    prop:'CMDName',
                    label:'指令全称'
                },
                {
                    prop: 'CMDShortName',
                    label: '指令简称',
                },
                {
                    prop: 'DeviceName',
                    label: '设备名称',
                },
                {
                    prop: 'LDasName',
                    label: '网关名称',
                },
                {
                    prop: 'WriteReg',
                    label: '写入仪表关系名称',
                    width:160
                },
                {
                    prop: 'ReadReg',
                    label: '读取仪表关系名称',
                    width:160
                },
                {
                    prop: 'Delay',
                    label: '延时(s)',
                },
                {
                    prop: 'BuiltTime',
                    label: '创建时间（ms）',
                },
/*                 {
                    prop:'CheckTime',
                    label: '检查时间(ms)'
                } */
            ],
            type:0,
            defaultAddInfo:{//新增参数默认数据
            },
            addInfo:{ //新增或修改
                CmdID:0,
                LDasID:null,
                DeviceID:null,
                Delay:0,
                WriteMapTabID:'',
                WriteReg:'',
                CheckTime:0,
                ReadMapTabID:'',
                Detail:'',
                BuiltTime:0,
                ReadReg:'',
                Value:0,
                CMDName:'',
                CMDShortName:'',
                Detail:'',
                CMDMode:''
            },
            title:'新增',
            show:false,
            LDasList:[], //网关列表
            meterMapList:[], //所有仪表关系
            deviceList:[], //设备列表
            WriteMapTab:null,
            ReadMapTab:null

        }
    },
    computed:{
    },
    watch:{
        filterText(val){
            this.queryData()
        }
    },
    created(){
        this.defaultAddInfo = JSON.parse(JSON.stringify(this.addInfo))
        this.queryData()
        this.queryUDevice()
        this.queryLDasByProjectID()
    },
    methods:{
        /**
         * 18.管理后台—分页查询寄存器仪表关系映射
         */
        queryData(){
            Control({
                FAction:'QueryPageUBaseCmd',
                SearchKey:this.filterText,
                PageIndex:this.pageIndex,
                PageSize:10
            })
            .then((data) => {
                this.total = data.FObject.Table ? data.FObject.Table[0].FTotalCount : 0
                this.tableData = data.FObject.Table1 || []
                /**
                 * 删除操作时，当前页面无数据时跳到上一页
                 */
                if(this.tableData.length === 0&&this.pageIndex > 1){
                    --this.pageIndex
                    this.queryData()
                }
            })
            .catch((err) => {
                
            });
        },
        /**
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryData()
        },
        /**
         * 291.查询所有物联设备列表
         */
        queryUDevice(){
            Device({
                FAction:'QueryUDeviceList',
                SearchKey:''
            })
            .then(data => {
                this.deviceList = data.FObject
            })
            .catch(err => {})
        },
        /**
         * 13.管理后台--根据项目ID查询网关
         */
        queryLDasByProjectID(){
            Control({
                FAction:'QueryLDasByProjectID'
            })
            .then((result) => {
                this.LDasList = result.FObject||[]
            }).catch((err) => {
                
            });
        },
        /**
         * 33.管理后台—根据网关查询所有寄存器仪表关系映射数据
         */
        queryUMapTabByLDasID(id){
            Control({
                FAction:'QueryUMapTabByLDasID',
                LDasID:id
            })
            .then((result) => {
                this.meterMapList = result.FObject||[]
            }).catch((err) => {
                
            });
        },
        /**
         * 网关选择发生改变
         */
        selectLdas(id){
            this.addInfo.WriteMapTabID = ''
            this.addInfo.ReadMapTabID = ''
            this.WriteMapTab = null
            this.ReadMapTab = null
            this.meterMapList = []
            this.queryUMapTabByLDasID(id)
        },
        selectWriteMap(item){
            this.addInfo.WriteMapTabID = item.MapTabID
            this.addInfo.WriteReg = item.VarName
        },
        selectReadMap(item){
            this.addInfo.ReadMapTabID = item.MapTabID
            this.addInfo.ReadReg = item.VarName
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.show =true
            this.type = 0
            this.WriteMapTab = null
            this.ReadMapTab = null
            this.addInfo = Object.assign({},this.defaultAddInfo)
        },
        /**
         * 修改
         */
        updatedRow(row) {
            this.show = true
            this.type = 1
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
            this.WriteMapTab = {
                MapTabID:row.WriteMapTabID,
                VarName:row.WriteReg
            }
            this.ReadMapTab = {
                MapTabID:row.ReadMapTabID,
                VarName: row.ReadReg
            }
            this.queryUMapTabByLDasID(row.LDasID)
        },
        /**
         * 新增/修改
         */
        async addOrUpdate(){
            await new Promise(resolve => {
                this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            this.show = false
            Control({
                FAction:'AddUpdateUBaseCmd',
                mUBaseCmd:this.addInfo
            })
            .then(data => {
                this.$message({
                  type: 'success',
                  message: '配置成功！'
                });
                this.queryData()
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 268.删除
         */
        async deleteItem(row){
            await new Promise(resove => {
                this.$DeleteMessage([`确认删除?`])
                .then(() => {
                    resove()
                })
                .catch(error => {
                })
            })
            Control({
                FAction:'DeleteUBaseCmd',
                ID:row.CmdID
            })
            .then(data => {
                this.queryData()
            })
            .catch(err => {})
        }
    }
}
</script>
<style lang="scss">
</style>
