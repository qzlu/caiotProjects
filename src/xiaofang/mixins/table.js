/**
 * @param {Array} tableData 表格数据
 * @param {Number} total 表格数据总条数
 * @param {Number} pageIndex 页码
 */
import {zwPagination} from '@/components/index'
import { resolve } from 'url';
export default{
    data() {
        return{
            tableData:[],
            total:0,
            pageIndex:1,
            orderProp:'',//排序字段
            order:'', //升序还是降序
            selectArr:[], //表格多选
            filterText:'',
            FUserType:localStorage.getItem('FUserType'),
            show:false,//弹窗
            type:0 //0新增 1编辑 （弹框）
        }
    },
    components:{
        zwPagination
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 === 1) {
              return 'odd-row';
            } else if (rowIndex%2 === 0) {
              return 'even-row';
            }
        },
        /**
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val){
            this.pageIndex = val
            this.queryData()
        },
        beforeDelete(text = ''){
            return new Promise((resolve,reject) => {
                this.$confirm(`此操作将删除${text}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                      resolve()
                  }).catch(() => {
                      reject()
                  });
            })
        },
        /**
         * 导出功能 下载文件
         * @param {*} data 
         */
        downloadFile(data){
            if(data.Result == 200&&data.FObject){
                window.location = "http://47.106.64.130:56091/" + data.FObject;
            }else{
                console.log(data);
                this.$message({
                    type:'error',
                    message:'导出失败'
                })
            }
        }
    },
}