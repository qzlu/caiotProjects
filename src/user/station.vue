<template>
    <div class="height-100">
        <Table ref="station" 
          :tableLabel = 'tableLabel' 
          :getData='queryData' 
          @beforeAdd = 'beforeAdd'
          @editItem = 'editItem'
          :deleteRow = 'deleteItem' 
          :exportData="exportFile" 
          @submit="addOrUpdate">
            <el-form slot="dialog" :model="addData" inline ref="form">
               <el-form-item label="上级岗位" prop="FParentGUID" >
                   <el-select v-model="addData.FParentGUID">
                       <el-option v-for="item in jobList" :key="item.FGUID" :value="item.FGUID" :label="item.FJobName"></el-option>
                   </el-select>
               </el-form-item>
               <el-form-item label="岗位名称" prop="FJobName" :rules="[{ required: true, message: '请输入'}]">
                   <el-input v-model="addData.FJobName"></el-input>
               </el-form-item>
               <el-form-item label="范围">
                    <el-checkbox-group v-model="LevelArr">
                        <el-checkbox v-for="item in mainDBTORGLevel" :key="item.FGUID" :label="item.FGUID">{{item.FLevelName}}</el-checkbox>
                    </el-checkbox-group>
               </el-form-item>
           </el-form>
        </Table>
    </div>
</template>
<script>
import Table from '../component/table.vue'
import { mapState} from 'vuex'
export default {
    data(){
        return{
            tableLabel:[
                {
                    prop: 'FParentName',
                    label: '上级岗位',
                },
                {
                    prop: 'FJobName',
                    label: '岗位名称',
                },
                {
                    prop: 'FLevelName',
                    label: '行政架构范围',
                    formatter:row => {
                        let checkedLevelName = []
                        let levelArr = row.FORGLevelGUID? row.FORGLevelGUID.split(','):[]
                        this.mainDBTORGLevel.forEach(item => {
                            if(levelArr.find((obj) => obj == item.FGUID)){
                                checkedLevelName.push(item.FLevelName)
                            }
                        })
                        return checkedLevelName.join(',')
                    }
                },
            ],
            defaultAddData:{//新增岗位信息默认参数
                FGUID:'',
                FJobCode:'',
                FJobName:'',
                FDescription:'',
                LevelStr:'',
                FParentGUID:''
            },
            addData:{ //新增岗位信息参数
                FGUID:'',
                FJobCode:'',
                FJobName:'',
                FDescription:'',
                LevelStr:'',
                FParentGUID:''
            },
            LevelArr:[],
            jobList:[],
            mainDBTORGLevel:[
                {   
                    FGUID:0,
                    FLevelName:'集团'
                },                
                {   
                    FGUID:1,
                    FLevelName:'区域'
                },
                {
                    FGUID:2,
                    FLevelName:'省份'
                },
                {   
                    FGUID:3,
                    FLevelName:'城市'
                },
                {   
                    FGUID:4,
                    FLevelName:'项目'
                },
            ],
        }
    },
    components:{
        Table
    },
    computed:{
/*         ...mapState([
            'mainDBTORGLevel'
        ]) */
    },
    created(){
        this.$emit('loadJob')
        this.queryJobList()
    },
    methods:{
        /**
         * 查询数据
         * @param {Vue Component} that 传入子组件
         */
        queryData(that){
            let param = {
                PageIndex:that.pageIndex,
                PageSize:10,
                SearchKey:that.filterText
            }
            return this.$post('QueryPageTORGJob',param,true)
        },
        queryJobList(){
            let param = {
                PageIndex:1,
                PageSize:1000,
                SearchKey:''
            }
            this.$post('QueryPageTORGJob',param)
            .then((result) => {
                this.jobList = result.FObject.Data || []
            }).catch((err) => {
                this.jobList = []
            });
        },
        /**
         * 点击新增
         */
        beforeAdd(){
           this.addData = Object.assign({},this.defaultAddData)
           this.LevelArr = []
        },
        /**
         * 编辑
         */
        editItem(row){
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = row[key]
            })
            if(row.FORGLevelGUID){
                this.LevelArr = row.FORGLevelGUID.split(',').map(item => Number(item))
            }else{
                this.LevelArr = []
            }
        },
        /**
         * 新增或编辑
         */
        addOrUpdate(){
            this.addData.LevelStr = this.LevelArr.join(',')
            this.$post('AddOrUpdateTORGJob',{
                MTORGJob:this.addData
            })
            .then((result) => {
                this.$refs.station.show = false
                this.$refs.station.queryData()
            }).catch((err) => {
                
            });
        },
        /**
         * 删除
         * @param {Object} item 删除的对象
         *          
         */
        deleteItem(item){
            return this.$post('DeleteTORGJob',{FGUID:item.FGUID})
        },
        /**
         * 导出岗位信息
         */
        exportFile(that){
            return this.$post('ExportTORGJob',{SearchKey:that.filterText})
        }
    }
}
</script>