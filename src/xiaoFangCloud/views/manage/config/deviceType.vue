<template>
    <div class="report">
        <Table
          ref="table"
          :tableLabel="tableLabel"
          dialogWidth="740px"
          :getData="queryData"
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow = 'deleteItem' 
          :exportData="exportFile"
          :submitFun="addOrUpdate"
        >
            <el-form slot="dialog" :model="addInfo" label-width="120px" inline ref="form">
                <el-form-item label="设备类型名称" prop="DeviceTypeName" :rules="[{ required: true, message: '请输入'}]">
                    <el-input v-model="addInfo.DeviceTypeName">
                    </el-input>
                </el-form-item>
                <el-form-item label="系统类型" prop="FormID" :rules="[{ required: true, message: '请输入'}]">
                    <el-select v-model="addInfo.FormID" filterable  placeholder="请选择">
                      <el-option v-for="item in systemList" :key="item.ID" :label="item.FormName" :value="item.ID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图标" prop="IconName">
                  <el-select v-model="addInfo.IconName" filterable placeholder="请选择">
                    <el-option v-for="(item,i) in iconList"  :key="i" :value="`icon-${item.font_class}`">
                        <i :class="['iconfont',`icon-${item.font_class}`]" style="font-size:24px;"></i>
                        <span>{{`icon-${item.font_class}`}}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <el-table-column
              prop=""
              label="图标">
              <template slot-scope="scoped">
                  <div>
                      <i :class="['iconfont',scoped.row.IconName]"></i>
                  </div>
              </template>
            </el-table-column>
        </Table> 
    </div>
</template>
<script>
import {System,Project} from '@/xiaoFangCloud/request/api.js';
import iconJson from '@/assets/css-font/iconfont.json'
import Table from '../layout/table.vue'
export default {
    components:{
        Table
    },
    data(){
        return{
            tableLabel:[
                {
                    prop:'DeviceTypeID',
                    label:'设备类型ID'
                },
                {
                    prop: 'DeviceTypeName',
                    label: '设备类型名称',
                },
                {
                    prop: 'FormName',
                    label: '所属系统类型',
                }
            ],
            defaultAddInfo:{//新增项目参数默认数据
                DeviceTypeID:0,
                ParentID:0,
                DeviceTypeName:'',
                DeviceItemID:'',
                IconName:'',
                EnergyTypeID:'',
                IsIOTDeviceType:1,
                FormID:''
            },
            addInfo:{ //新增或修改项目参数
            },
            systemList:[],
            energyTypeList:[],
            iconList:[]
        }
    },
    computed:{
    },
    created(){
        this.queryFormList()
        this.iconList = iconJson.glyphs
    },
    methods:{
        /**
         * 269.分页查询系统分类
         */
        queryData(data){
            return System({
                FAction:'QueryPageSDeviceType',
                ...data
            })
        },
        /**
         * 查询系统类型
         */
        queryFormList(){
            Project({
                FAction:'QuerySForm',
            })
            .then((data) => {
                this.systemList = data.FObject || []
            }).catch((err) => {
                
            });
        },
        /**
         * 点击新增
         */
        beforeAdd(){
            this.addInfo = {...this.defaultAddInfo}
        },
        /**
         * 修改系统分类
         */
        editItem(row) {
            this.beforeAdd()
            Object.keys(this.addInfo).forEach(key => {
                this.addInfo[key] = row[key]
            })
        },
        /**
         * 265.新增/修改系统分类
         */
        async addOrUpdate(){
            return System({
                FAction:'AddOrUpdateSDeviceType',
                sDeviceType:this.addInfo
            },true)
        },
        /**
         * 268.删除设备类型
         */
        async deleteItem(row){
            return System({
                FAction:'DeleteSDeviceType',
                ID:row.DeviceTypeID
            })
        },
        /**
         * exportFile 导出
         */
        exportFile(){
            return System({
                FAction:'ExportSDeviceType',
                SearchKey:this.filterText,
            })
        },
    }
}
</script>
<style lang="scss">
</style>
