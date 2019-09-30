

<template>
  <div class="report">
         <ul class="report-header clearfix">
					  <li class="l" style="margin-right:286px;"><button class="zw-btn zw-btn-export" @click="exportFile">导出</button></li>
            <li class="l"><span class="label">设备名称　</span><el-input class="search-input" v-model="filterText"></el-input></li>
						<li class="l">
							<span class="label">告警级别　</span>　
							<el-select v-model="Alarm_levid">
								<el-option v-for="(item,index) in Alarm_lev" :key="index" :value="index" :label="item"></el-option>
							</el-select>
						</li>
						<li class="l">
							<span class="label">告警类型　</span>　
							<el-select v-model="Alarm_Typeid">
								<el-option :value="0" label="全部"></el-option>
								<el-option v-for="item in AlarmType" :key="item.AlarmTypeID" :value="item.AlarmTypeID" :label="item.AlarmTypeName"></el-option>
							</el-select>
						</li>
						<li class="l">
							<span>时间段　</span>　
				    	<el-date-picker
				    	  v-model="value6"
				    	  type="daterange"
				    	  range-separator="至"
				    	  start-placeholder="开始日期"
				    	  end-placeholder="结束日期">
				    	</el-date-picker>
						</li>
						<li class="l" @click="queryData()"><button class="zw-btn zw-btn-primay">查询</button></li>
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
            </el-table>
    		 	</div>
		<zw-pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></zw-pagination>
  </div>
</template>
<script>
import * as comm from '../../assets/js/pro_common';
import table from '@/caiot/mixins/table' //表格混入数据
import {Alarm,system} from '@/caiot/request/api.js';
 export default {
	 mixins:[table],
    data() {
      return {
            tableLabel:[
                {
                    prop: 'RowNum',
                    label: '序号',
                    width:80
								},
                {
                    prop: 'AlarmTime',
										label: '告警时间',
										width:160
								},
                {
                    prop: 'AreaName',
                    label: '区域名称',
                },
                {
                    prop:'DeviceName',
                    label:'设备名称'
                },
                {
                    prop: 'AlarmLevel',
                    label: '告警级别',
                },
                {
                    prop: 'AlarmTypeName',
										label: '告警类型',
										width:160
                },
                {
                    prop: 'AlarmText',
										label: '告警内容',
										width:300
                },
                {
                    prop: 'AlarmData',
                    label: '告警值',
                },
                {
                    prop: 'LimitValue',
                    label: '告警条件',
								},
                {
                    prop: 'RecoveryTime',
										label: '恢复时间',
										width:160
                },
            ],
      	value6:[new Date(),new Date()],//时间选择参数
        AlarmType:{},//告警类型
        Alarm_Typeid:0,//告警类型id,默认为0，
        Alarm_lev:["全部","提示","一般","严重"], //告警级别
        Alarm_levid:0,//告警级别 对应id,默认为0
        xls_adress:"", //导出exl文件的url
        get_currStart_time:comm.CurentTime().clock.split(" ")[0]+" 00:00:00",//当天时间，时分秒为00：00：00,如果用户没有选择时间，就取当天时间
        get_currEnd_time:comm.CurentTime().clock.split(" ")[0]+" 23:59:59",//当天时间，时分秒为00：00：00,如果用户没有选择时间，就取当天时间
        abc_currt:1,
      };
		},
		created(){
			this.queryData()
			this.querySystemAlarmType()
		},
    methods: {
		 /*查询数据按钮*/
		 queryData(){
			 Alarm({
					FAction:"QueryCaiotHistoryAlarmByProject",
					SearchKey:this.filterText,
					DeviceTypeID:'',
					AlarmLevel:this.Alarm_levid,//告警级别 (1~N的数字)
					AlarmTypeID:this.Alarm_Typeid,//告警类型ID
					StartDateTime:this.value6[0].toLocaleDateString()+' 00:00',
					EndDateTime:this.value6[1].toLocaleDateString()+' 23:59',
					PageIndex:this.pageIndex,  
					PageSize:10, 
			 })
			 .then(data => {
          this.total = data.FObject.Table ? data.FObject.Table[0].FTotalCount : 0
          this.tableData = data.FObject.Table1 ? data.FObject.Table1 : []
			 })
			 .catch(err => {})
		 },
		 handleCurrentChange(val){
			 this.pageIndex = val
			 this.queryData()
		 },
		 /**
			* 查询告警类型
		  */
		 querySystemAlarmType(){
			 system({
				 FAction:"QuerySystemAlarmType"
			 })
			 .then(data => {
				 this.AlarmType=data.FObject
			 })
			 .catch(err => {})
		 },
		 /**
			* 导出
		  */
		 exportFile(){
		    if(Date.parse(this.value6[1])-Date.parse(this.value6[0])>6*24*60*60*1000){
		    	this.$alert('    最多导出七天的数据！', '提示', {
		    	customClass:"alert_notice",
		      dangerouslyUseHTMLString: true
					});
					return
				 }
				 Alarm({
					FAction:"CreateCaiotHistoryAlarmByProject",
					SearchKey:this.filterText,
					DeviceTypeID:'',
					AlarmLevel:this.Alarm_levid,//告警级别 (1~N的数字)
					AlarmTypeID:this.Alarm_Typeid,//告警类型ID
					StartDateTime:this.value6[0].toLocaleDateString()+' 00:00',
					EndDateTime:this.value6[1].toLocaleDateString()+' 23:59',
				 })
				 .then(data => {
					 window.location = "http://www.szqianren.com/" + data.FObject;
				 })
				 .catch(err => {
            this.$message({
              type: 'error',
              message: '导出失败!请重试'
            });
				 })
		 } 
    },
   mounted:function(){

  },
  };
	

</script>
