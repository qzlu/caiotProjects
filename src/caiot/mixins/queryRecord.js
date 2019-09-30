import {Device} from '@/caiot/request/api.js';
export default {
    data() {
        return {
            projectName: localStorage.getItem('projectname'),
            time: [new Date(), new Date()],
            level: 0,
            OrderState:['','待完成','已完成','待接单','待派单','已逾期'],
        }
    },
    props:{
        deviceID:{
            type:String
        }
    },
    watch: {
        filterText(val) {
            this.queryData()
        }
    },
    created() {
        this.queryData()
    },
    methods: {
        /**
         * 232.查询分页台账记录(告警 保养 维修)
         */
        queryData() {
            Device({
                FAction: 'QueryPageDeviceRecord',
                SearchKey: this.filterText,
                StartDateTime: this.time[0].toLocaleDateString() + ' 00:00',
                EndDateTime: this.time[1].toLocaleDateString() + ' 23:59',
                PageIndex: this.pageIndex,
                PageSize: 10,
                TypeID: this.type,
                AlarmLevel: this.level,
                ID:this.$props.deviceID
            })
            .then(data => {
                console.log(data);
                this.total = data.FObject.Table ? data.FObject.Table[0].Count : 0
                this.tableData = data.FObject.Table1 ? data.FObject.Table1 : []
            })
            .catch(err => { })
        },
        /**
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val) {
            this.pageIndex = val
            this.queryData()
        },
    },
}