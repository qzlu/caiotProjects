/**
 * @param {Array} tableData 表格数据
 * @param {Number} total 表格数据总条数
 * @param {Number} pageIndex 页码
 */
import {zwPagination} from '@/caiot/zw-components/index'
import '@/caiot/views/TaskManagement/InspectionItem.scss';
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
            FUserType:localStorage.getItem('FUserType')
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
         * 删除计划（多选）
         */
        deletePlans(){
            let arr = this.selectArr.map(item => item.ID)
            this.deletePlan(arr.join(','))
        },
        handleSelectionChange(rows){
            this.selectArr = rows
        }   
    },
}