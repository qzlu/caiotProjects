<style>
 .ghb_select{height: 33px; width: 100%;  background: none;border: none;color: #fff;appearance:none;-moz-appearance:none;-webkit-appearance:none;outline: none; text-indent: 5px;} 
 .ghb_select option{color: #000; height: 35px; line-height: 35px;} 
 .iput01_div{ width: 116px; height: 46px; background: url(/static/image/count/button_bg_1.png);}
.iput01_aa{ height: 33px; width: 100%; background:none; border: none; color: #fff;}
.put03_div{ width: 116px; height: 46px; background: url(/static/image/count/button_nor_down.png); margin: 0 8px;}
input::-webkit-input-placeholder {color: #fff;}	

.tpvbtn_0{ width: 88px; height: 46px; text-indent:25px;background: url(/static/image/count/add_un1.png); margin: 0 10px 0 0; cursor: pointer;}
.tpvbtn_0:hover{background: url(/static/image/count/add_un2.png);}
.tpvbtn_01{ width: 88px; height: 46px; text-indent:25px;background: url(/static/image/count/btn1.png); margin: 0 10px 0 0; cursor: pointer;}
.tpvbtn_01:hover{background: url(/static/image/count/btn2.png);}
.tpvbtn_02{ width: 88px; height: 46px;text-indent:25px;background: url(/static/image/count/btn3.png);cursor: pointer;}
.tpvbtn_02:hover{background: url(/static/image/count/btn4.png);}

.newabc_html ul li{ width: 50%; height: 35px; float: left; padding-bottom: 10px;}
.newabc_html ul li p.title_le{ width: 95px; line-height: 37px; text-align: right; padding-right: 5px;}
.newabc_html ul li p input{ width: 185px; height: 35px;border: solid 1px #05679E;background: #18406B; color: #fff;text-indent: 5px;}
.newabc_html ul li p select{ width: 105px; height: 32px;border: 1px solid rgb(5, 103, 158);background: rgb(24, 64, 107);color: rgb(255, 255, 255);}

#input_Listitem{ padding: 0 8px;}

/*点击增加按钮弹出框样式*/
.text_ttpnt{ line-height: 35px; width: 95px; text-align: right; margin-right: 8px;}
.text_tsdfb{ line-height: 35px; width: 95px; text-align: right; margin-right: 8px;}
.tttppp{ line-height: 35px; width: 95px;margin-right: 8px; text-align: right;}
.tnd_select{ height: 35px;}
.ppot option{ color: #fff;}
.pri_none{ display: none;}
.add_boxs .pri_none{ display: block;}

.div_hide{ display: none;}

</style>
<template>
  <div class="container ele_outbox" id="ttyypp_test" style="background: none; text-align: center; ">
  	
  	<!--{{$route.params.guid}}-->
  	
  	<section class="cout_allitem_cc">
    <section class="ab_container_cc" >
    	 <div class="cout_title">
    	 	<!--输入框-->
    	    <div id="input_Listitem" class="l"></div>
    	    <!--下拉菜单-->
    	    <div id="select_Listitem" class="l"></div>
    	    <!--树形菜单1-->
    	    <div class="l" v-if="Gtree_data2[0]">
    	      <p class="l text">设备类型</p><p class="ipt l put01">
    	      	<!--用于控制查询按钮提交数据-->
    	      	<input type="hidden" :id="tree_id02[0]" :value="tree_check.DeviceTypeID"/>
    	      	<input placeholder=" 请选择"  @click="dialogVisible = true" v-model="value_tree"   >
    	      </p>
    	      <div id="date_Listitem" class="l" style="padding: 0 8px;"></div>
    	    </div>
    	    <!--树形菜单2-->
    	    <div class="l" v-if="Gtree_data2[1]">
    	      <p class="l text">设备类型</p><p class="ipt l put01">
    	      	<!--用于控制查询按钮提交数据-->
    	      	<input type="hidden" :id="tree_id02[1]" :value="tree_check02.DeviceTypeID"/>
    	      	<input placeholder=" 请选择"  @click="dialogVisible_tree = true" v-model="value_tree02"   >
    	      </p>
    	      <div id="date_Listitem" class="l"></div>
    	    </div>
    	    
    	    <!--时间选择-->
    	    <div id="timebox"></div> <!--用于控制查询时，时间值-->
    	    <div class="l" v-if="is_time==1">
		    	   <p class="l text">时间段</p>
		    	 	<div class="block time_inputs_cc">
						    <el-date-picker
						      v-model="value6"
						      type="daterange"
						       @change="input_gettime()"
						        value-format="yyyy-MM-dd"
						      range-separator="至"
						      start-placeholder="开始日期"
						      end-placeholder="结束日期">
						    </el-date-picker>
				   </div>
    	    </div>
    	    <div class="l" id="listBtn">
    	    	<p class='l tpvbtn_0'  v-if="is_add==1" @click="add_btn_click_item()">增加</p>
    	    	<p class='l tpvbtn_01' v-if="is_search==1" @click="seartch_data_info">查询</p>
    	    	<!--<p class='l tpvbtn_02' v-if="is_export==1" @click="export_data_info">导出</p>-->
    	    	<a :href="xls_adress" style="color: #fff;"><p class='l tpvbtn_02' v-if="is_export==1" @click="export_data_info">导出</p></a>
    	    </div>
    <!--	
    	  <p class="l text">输入框</p><p class="ipt l put01"><input placeholder=" 请输入内容"  @click="dialogVisible = true" v-model="value1"></p>
    	 	<p class="l text">设备类型</p><p class="ipt l put02"><input placeholder=" 请输入内容"></p>
    	 	<p class="l text">告警级别</p>
    	 	<p class="ipt l put03">
    	 		<select v-model="selected01" class="ghb_select">
			    <option disabled value="">请选择</option>
			    <option>A</option>
			    <option>B</option>
			    <option>C</option>
			  </select>
    	 	 </p>
    	
    	 	<p class="l text">时间段</p>
    	 	<div class="block time_inputs_cc">
				    <el-date-picker
				      v-model="value6"
				      type="daterange"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker>
		   </div>
    	 	
    	 	
    	 	<p class="r btn_02">刷新</p>
    	 	<p class="r btn_01">导出</p> -->
    	 
    	 	
    	 </div>

    	<div class="table_info_cc" >
    		 <div class="table_ltop">
    		 	<div id="itest">
    		 		<ul>
    		 			<li v-for="(avitem,key) in table3" :style="{width:avitem.FShowLen+'px'}"  class="l" :class="{'div_hide':avitem.FIsShow==0}">
    		 				{{avitem.FShowFieldName}}
    		 			</li>
    		 			<li>操作</li>
    		 		</ul>
    		 		
    		 	</div>
    		 	
    		 <!--<ul><li>设备名称</li><li>区域名称</li><li>告警级别</li><li>告警类型</li><li>告警内容</li><li>告警值</li><li>告警条件</li><li>告警时间</li><li>恢复时间</li></ul>-->
    		 <!--<li v-for="(avitem,key) in table3" v-if="avitem.FIsShow==1" :class="{showdiv:avitem.FIsShow==1,showdiv:avitem.FIsShow==0}">-->
    		 <div class="table_ltop data_item_gh_cc">
    		 		<ul v-for="(item,key) in table1" :id="'abcd_'+key+'-ul'">
    		 			<li v-for="(avitem,key2) in table3" :style="{width:avitem.FShowLen+'px'}"  :class="{'div_hide':avitem.FIsShow==0}" :id="avitem.FSaveField+'_00#1'"  :gid="item[avitem.FSaveField]" :edi_type="avitem.FEditType">
    		 				<p>{{item[avitem.FFieldName]}}</p>
    		 				<span v-if="avitem.FIsPrimaryKey==1" class="priKey_index" style="display: none;">{{avitem.FSaveField+'='+item[avitem.FSaveField]}}</span>
    		 			</li>
    		 			<li><span v-if="is_edit==1" @click="add_btn_click_item('abcd_'+key)">修改 </span> <span v-if=" is_del==1" @click="dele_ul_btn('abcd_'+key+'-ul')"> 删除</span></li>
    		 		</ul>
    		 		
    		 	</div>
    		 	<div class="table_ltop data_item_gh_cc" id="is_table_items">
    		 		
    		 	<!--<div id="is_table_items"></div>	-->
   <!--	<ul><li>1#变压器</li><li>商业配电房</li><li>3</li><li>超温告警</li><li>超温告警</li><li>85</li><li>>80</li><li>2018.10.12  9:15:20</li><li>2018.10.12  9:15:20</li></ul>-->

    		   	
    		   </div>
    		 	</div>
		 
    	</div>
    	
	   <el-pagination
	  :page-size="PageSize"
	  @current-change="getData"
	  :pager-count="11"
	  layout="prev, pager, next"
	  :total="table_total">
	</el-pagination>
    	
    </section>
   </section> 
  <!--弹出框树形-头部-->
		  <el-dialog
		  custom-class="aabbbccc"
		  title="选择设备类型"
		  :visible.sync="dialogVisible"
		  width="677px"
		  :before-close="handleClose">
		  <div  class="myHtml">
		  <!--这是一段信息-->
		  <!--<div class="tree_search">
		  	<input  placeholder="请输入关键字"/>
		  </div>-->
		  <!--		   <el-tree :data="Gtree_data1" :props="defaultProps" node-key="pppp" @node-click="handleNodeClick"></el-tree>-->
		   <el-tree :data="Gtree_data2[0]" :props="defaultProps" node-key="pppp" @node-click="handleNodeClick"></el-tree>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="btn_click">确 定</el-button>
		  </span>
		</el-dialog>
   <!--弹出框树形-->
   
     <!--弹出框树形2-头部-->
		  <el-dialog
		  custom-class="aabbbccc"
		  title="选择设备类型"
		  :visible.sync="dialogVisible_tree"
		  width="677px"
		  :before-close="handleClose">
		  <div  class="myHtml">
		  <!--这是一段信息-->
		  <!--<div class="tree_search">
		  	<input  placeholder="请输入关键字"/>
		  </div>-->
		  <!--		   <el-tree :data="Gtree_data1" :props="defaultProps" node-key="pppp" @node-click="handleNodeClick"></el-tree>-->
		   <el-tree :data="Gtree_data2[1]" :props="defaultProps" node-key="pppp" @node-click="handleNodeClick02"></el-tree>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible_tree = false">取 消</el-button>
		    <el-button type="primary" @click="btn_click02">确 定</el-button>
		  </span>
		</el-dialog>
   <!--弹出框树形-->
   
 <!---------------------增加按钮------------------------------->  
    <!--增加按钮树形 -->
		  <el-dialog
		  custom-class="aabbbccc"
		  title="选择设备类型"
		  :visible.sync="dialogVisible03"
		  width="677px"
		  :before-close="handleClose">
		  <div  class="myHtml">
		   <el-tree :data="Gtree_data3" :props="defaultProps" node-key="pppp" @node-click="handleNodeClick03"></el-tree>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible03 = false">取 消</el-button>
		    <el-button type="primary" @click="btn_click03">确 定</el-button>
		  </span>
		</el-dialog>
   <!--增加按钮树形-->
   
     <!--增加按钮树形 2-->
		  <el-dialog
		  custom-class="aabbbccc"
		  title="选择设备类型"
		  :visible.sync="dialogVisible04"
		  width="677px"
		  :before-close="handleClose">
		  <div  class="myHtml">
		   <el-tree :data="Gtree_data3" :props="defaultProps" node-key="pppp" @node-click="handleNodeClick04"></el-tree>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible04 = false">取 消</el-button>
		    <el-button type="primary" @click="btn_click04">确 定</el-button>
		  </span>
		</el-dialog>
   <!--增加按钮树形2-->
   
    <!--增加按钮-弹出框-->
		  <el-dialog
		  custom-class="aabbbccc"
		  :title="ttitle"
		  :visible.sync="dialogVisible_add"
		  width="677px"
		  :before-close="handleClose">
		  <div  class="myHtml newabc_html" id="add_html_box" style="height: 350px;" :class="{add_boxs:ttitle=='新增'}">
		  	<ul id="add_divShow">
		  		<!--1-->
		    <li class="l" v-if="Gtree_data3[0]">
    	      <p class="l text text_tsdfb" ><!--设备类型: -->{{tree_name[0]}}:</p><p class="ipt l put01">
    	      	<!--用于控制查询按钮提交数据-->
    	      	<input type="hidden" :id="tree_id03[0]" :value="tree_check03.DeviceTypeID"/>
    	      	<input placeholder=" 请选择"  @click="dialogVisible03 = true" v-model="value_tree03"   >
    	      </p>
    	      <div id="bbttt" class=""></div>
    	    </li>
    	    <!--1-->
    	    <!--2-->
    	    <!--如果有没有树形2，可以改为 Gtree_data3[0]，tree_id03[0] 测试-->
    	    <li class="l" v-if="Gtree_data3[1]">
    	      <p class="l text text_tsdfb" ><!--设备类型:-->{{tree_name[1]}}:</p><p class="ipt l put01">
    	      	<!--用于控制查询按钮提交数据-->
    	      	<input type="hidden" :id="tree_id03[1]" :value="tree_check04.DeviceTypeID"/>
    	      	<input placeholder=" 请选择"  @click="dialogVisible04 = true" v-model="value_tree04"   >
    	      </p>
    	      <div id="bbttt" class=""></div>
    	    </li>
    	    <!--2-->
             <div id="pppp"></div>
		  	</ul>
		  <!--这是一段信息-->
		  <!--<div class="tree_search">
		  	<input  placeholder="请输入关键字"/>
		  </div>-->
		   
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible_add = false">取 消</el-button>
		    <el-button type="primary" @click="add_ul">确 定</el-button>
		  </span>
		</el-dialog>
   <!--增加按钮-弹出框-->
  
  </div>
</template>
 <style>
.time_inputs_cc{ width: 300px ; height: 46px; float: left;}
 .aabbbccc{background: url(/static/image/count/out/pop_bg_1.png)!important;}	
 .aabbbccc	.el-dialog__headerbtn{top: 31px;right: 35px;  font-size: 20px; }
 .aabbbccc .el-dialog__headerbtn .el-dialog__close{color: #fff;}
 .aabbbccc .el-dialog__body{ padding-bottom: 5px;}
 .aabbbccc .el-dialog__header{padding: 35px 0 0 45px;}
.aabbbccc .el-dialog__title{ text-align:left; color: #fff; float: left; }	
.aabbbccc  .myHtml{height:330px; text-align: left; padding: 0 25px; color: #fff;} 	
 .aabbbccc	.el-dialog__footer{ padding: 0px 55px  30px 0;}
 .aabbbccc .el-tree{ background: none; color: #fff;height: 287px; padding-top: 25px;
    overflow: auto;}
  .aabbbccc .el-tree .el-tree-node__content:hover{color: #30a6ec;background:none }
   .aabbbccc .el-tree-node:focus>.el-tree-node__content{ background:none;color: #30a6ec;}
   .aabbbccc .el-icon-caret-right:before {
     color: #31a1ff;
    font-size: 16px;
}
 
.aabbbccc .tree_search{ height: 48px; border: solid 1px #36AAEC; width: 545px; margin: 15px auto; background: url(/static/image/count/out/search.png) no-repeat 9px 10px;}
 .aabbbccc .tree_search input{ height: 30px; width: 485px; padding:8px 0 0 50px; background:none; border: none; color: #fff; font-size: 14px;}
 .ab_container_cc .el-input__inner{ height: 46px!important; background: #042E74!important;}
  .ab_container_cc .el-range-input{ background: #042E74!important;color: #fff;}
  .ab_container_cc  .el-date-editor .el-range-separator{ color: #eaf5f5;}
  
   .ab_container_cc .cout_title p{ height: 46px; line-height: 46px; padding: 0; text-align: center;}
  .ab_container_cc .cout_title p.text{ font-size: 17px; padding: 0 15px;}

  .data_item_gh_cc ul{ width: 100%; height: 65px;}
 .data_item_gh_cc ul li{ width:120px;height: 65px;line-height: 65px; float: left;overflow: hidden;text-overflow:ellipsis;white-space: nowrap; } 
  #itest ul{ height: 65px;}
 #itest ul li{ width:110px;height: 65px;line-height: 65px; float: left;overflow: hidden;text-overflow:ellipsis;white-space: nowrap; } 
 </style>
<script>

import * as comm from '../../assets/js/pro_common';
export default {
    data() {
      return {
      	value1:'', //树形菜单值
      	value6: '',//时间选择参数
        dialogVisible: false,//弹出框参数   
        dialogVisible_tree:false,//弹出树形框参数 
        dialogVisible02:false,//增加按钮-弹出02框参数 
        selected01:"", 
        defaultProps: { //树形菜单参数
          //children: 'children',
          //label: 'label',
          children: 'DeviceTypes',
          label: 'DataItemName',
         
        },
         tree_data: [{    //树形菜单数据
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        },],
        
        
      PageIndex:1,//当前页
      PageSize:9,//一页显示的数量
      table_total:0,//总数
      WhereStr:"", //查询条件(DeviceName like \'%7AA4%\' )
      FMenuGUID:this.$route.params.guid,//菜单id，点击哪个菜单，传过来它的id
     
      table:[],
      table1:[],
      table2:[],
      table3:[],
      
      /*表头树形下拉框*/
      Gtree_data1:[], //得到树形数据
      Gtree_data2:[],
      tree_check:{},//点击树形菜单得到id及name
      value_tree:'',//点击树形菜单值显示在输入框内
      tree_check02:{},//多个树形菜单，点击树形菜单得到id及name
      value_tree02:'',//多个树形菜单，点击树形菜单值显示在输入框内
      
      tree_id:"", //用于提交取值id
      tree_id02:[], //用于取第二个树形提交取值id
     /*表头树形下拉框*/
    /*控制时间显示是否*/
     is_time:0,
     is_time_id:'',
    /*控制时间显示是否*/
    /*控制增加、查询、导出铵钮*/
     is_add:0, //显示增加按钮   
     is_del:0,  //显示删除按钮   
     is_edit:0,  //显示编辑按钮  
     is_search:0, //显示查询按钮  
     is_export:0, //显示导出按钮  
     is_arrs:[],  //点击查询按钮，要提交字段对应数据
      /*控制增加、查询、导出铵钮*/
   
   
     /*增加按钮事件*/
     all_Saveid:[], //保存所有table3 要提交字段
     dialogVisible_add:false,//增加按钮-弹出02框参数 
     dialogVisible03:false,//增加按钮-弹出02框参数 
     dialogVisible04:false,//增加按钮-弹出02框参数 
     Gtree_data3:[], //存放多个树形数据
     tree_check03:{},//多个树形菜单，点击树形菜单得到id及name
     value_tree03:'',
     tree_id03:[], //保存多个树形id
     tree_name:[], //增加树形菜单标题
     
     tree_check04:{},//多个树形菜单，点击树形菜单得到id及name
     value_tree04:'',
     getOne:0,
     ttitle:"新增",
    
     /*enf of 增加按钮事件*/
     xls_adress:"",
   
      };
    },
    methods: {
    	
    input_gettime(){ //用原生把时间给id为timebox的input 付给时间值。
    		document.getElementById("timebox").children[0].value=this.value6;
    		//console.log(document.getElementById("FCreateTime").value)
    		//console.log(this.value6)
    	},
     handleClose(done) {  /*弹出框事件*/
    	
     	done();
     },
     handleNodeClick(data) {/*树形菜单事件*/
       // console.log(data);
        this.tree_check.DeviceTypeID=data.DeviceTypeID; //点击树形菜单得到id
    	this.tree_check.DeviceTypeName=data.DeviceTypeName;//点击树形菜单得到name
     },
     btn_click(){  //弹出框确定铵钮
     //	console.log(this.tree_check)
       
     	this.value_tree=this.tree_check.DeviceTypeName //把树形值显示在输入框
     	this.dialogVisible=false;
     },
    
    handleNodeClick02(data) {/*树形菜单事件*/
       // console.log(data);
        this.tree_check02.DeviceTypeID=data.DeviceTypeID; //点击树形菜单得到id
    	this.tree_check02.DeviceTypeName=data.DeviceTypeName;//点击树形菜单得到name
     },
     
     btn_click02(){  //弹出框确定铵钮
     	this.value_tree02=this.tree_check02.DeviceTypeName //把树形值显示在输入框
     	this.dialogVisible_tree=false;
     
     },
      
      
      
      
      getData(x){//第一次取得数据, 点击查询按钮，也是调这个数据
      	      /*无论是查询数据，还是第一次取数据，都得带WhereStr条件。*/
     	     	let _this=this;
     	     	let set_WhereStr=""
     	     	/*如果点击查询按钮*/
     	     	//if(x=="search_click"){ 
     	     		//let reg="$DeviceName like '% &value %' and DeviceTypeID=1 and ProjectID=3 and FCreateTime>='2018-12-14 00:00:00' and FCreateTime<='2018-12-14 23:59:59'"
     	     		let reg1="$DeviceName like '%&value%' and ";
     	     		let reg2="$name>='$start' and $name<='$end' and ";
     	     		
     	     		let ground="";
     	     		let tpl="";
     	     		//console.log( _this.is_arrs)
     	     		if(_this.is_arrs.length>0){
     	     		for(let i of _this.is_arrs){ //如果有数据在里面，证明就有点击事件了
			      		//console.log(i)
			      		let islike=document.getElementById(i).getAttribute("data")=="like" //如果是输入框
			      		let istttime=document.getElementById(i).getAttribute("data")=="tttime" //如果是输时间
			      		if(islike){
			      			ground+=reg1.replace(/\$DeviceName/,i).replace(/\&value/,document.getElementById(i).value)
			      			//ground+=reg1
			      		}else if(istttime){
			      			let vv=document.getElementById(i).value
			      			if(!vv){ //如果不选时间，默认为当天时间
			      			 let S_time=comm.CurentTime().clock.split(" ")[0]+" 00:00:00";//当天时间，时分秒为00：00：00,如果用户没有选择时间，就取当天时间
                             let E_time=comm.CurentTime().clock.split(" ")[0]+" 23:59:59";//当天时间，时分秒为00：00：00,如果用户没有选择时间，就取当天时间
                             reg2=reg2.replace(/\$name/ig,i).replace(/\$start/,S_time).replace(/\$end/,E_time)
			      			}else{
			      			 let s=document.getElementById(i).value.split(",")[0]+" "+"00:00:00",e=document.getElementById(i).value.split(",")[1]+" "+"23:59:59"
			      			 reg2=reg2.replace(/\$name/ig,i).replace(/\$start/,s).replace(/\$end/,e)	
			      			}
			      			
			      			ground+=reg2
			      		}else{
			      			let str="$names=$val and "
			      			if(document.getElementById(i).value&&document.getElementById(i).value!=50000){ //如果为空，就不传参数,50000为全部。
			      		      ground+=str.replace(/\$names/,i).replace(/\$val/,document.getElementById(i).value)
			      		     }
			      		  
			      		}

			      	}
     	     	}
     	     		/*截取字符串，去掉最后的 and*/
     	     		let len=ground.length;
     	     		ground=ground.slice(0,len-5)
     	     		
     	     		set_WhereStr=ground
     	     		//console.log(_this.is_arrs)
     	     		// console.log(ground) 
     	     		
     	     		/*end of 如果点击查询按钮,*/
     	     //	}else{
     	     		_this.PageIndex=x //如果不是点击查询按钮，就是点击分页页码
     	     //	}
     	     	 //console.log(set_WhereStr)  	
     	     	/*如果是点击导出按钮*/	
     	     		 _this.$axios.post('System',{
						        "FTokenID":localStorage.getItem("Token"),
						        "FAction":"ExportDataByUniversalConfig",
						        "FVersion":"1.0.0",
						        "ProjectID":localStorage.getItem("projectid"), 
						        "WhereStr":set_WhereStr,
						        "FMenuGUID":_this.FMenuGUID, //菜单id
							}).then(function(jsons){
								_this.xls_adress=jsons.data.FObject
							  //console.log(jsons)
                               
							}).catch(function(err){   });	
     	     	//	return false;

     	     	/*end of 如果是点击导出按钮*/

	  	      _this.$axios.post('System',{
						        "FTokenID":localStorage.getItem("Token"),
						        "FAction":"QueryPageDataByUniversalConfig",
						        "FVersion":"1.0.0",
						        "ProjectID":localStorage.getItem("projectid"), 
						       /* "ProjectID":3,*/
						        "PageIndex":_this.PageIndex,
						        "PageSize":_this.PageSize,
						        "WhereStr":set_WhereStr,
						        "FMenuGUID":_this.FMenuGUID, //菜单id
							}).then(function(jsons){
							    // console.log(jsons.data.FObject)
							   	 _this.table=jsons.data.FObject.Table     
							     _this.table_total=jsons.data.FObject.Table[0].FTotalCount    //分页总数 
							   //	 console.log(jsons.data.FObject.Table[0].FTotalCount)
							   	 _this.table1=jsons.data.FObject.Table1  
							   	 _this.table3=jsons.data.FObject.Table3
							   	 _this.creat_btn(jsons.data.FObject.Table[0].FConfigFeatures)//生成增加/删除/修改/查询/导出按钮
							   
							   	 
							   	 if(x) return false //如果是点击，就不用生成按钮及下拉框、时间、等组件数据
							   	
							    _this.table2=jsons.data.FObject.Table2   ////生成按钮及下拉框、时间、等组件数据
							  	_this.creat_div() //生成按钮及下拉框、时间、等组件
								 
                               
							}).catch(function(err){
							
							});
  	
  	       
     },
     
 
     add_data_info(){ //点击增加按钮提交数据
     	console.log("2add_data_info22")
     },
      seartch_data_info(){ //点击查询按钮提交数据
      	this.getData("search_click")	
     },
      export_data_info(){ //点击导出按钮提交数据
     	this.getData("export")	
                  
     },
     
    creat_btn(n){ //控制增加、删除、修改、查询、导出
    	
    	let num=n.split(",");
    	
    	for(let i of num){
    		if(i=="1"){this.is_add=1;}//增加
    		if(i=="2"){this.is_del=1;}//删除
    		if(i=="3"){this.is_edit=1;}//修改
    		if(i=="4"){ this.is_search=1;}//查询
    		if(i=="5"){ this.is_export=1;}//导出
    	}
    	
    	 // document.getElementById("listBtn").innerHTML=btn_html
    	
    },
     creat_div(){// 根据后台数据，生成有多少个组件，不用取数据的，放在这里
     	/*初始化清空*/
     	 document.getElementById("input_Listitem").innerHTML="" 
     	 document.getElementById("select_Listitem").innerHTML="" 
     	 this.tree_id02=[]
         this.Gtree_data2=[]
     	/*初始化清空*/
     	
     	  let _this=this;
     	  let d=this.table2;
     	  let html="";
     	  let html_aa="";
     	  let html_input01="<p class='l text'>$name</p><p class='ipt l iput01_div'><input placeholder=' 请输入内容' class='iput01_aa' id='$id' data='like'></p>";
     	  let inputime="<input type='hidden' id='$iidd' data='tttime'>"
     	   for(let i of d){
     	   	   if(i.FQueryType!=5){ //4、5都为时间，5不用管。
     	   	   	_this.is_arrs.push(i.FQueryField)//把相对应的字段写入数据，用于点查询按钮。
     	   	   }
     	    	/*因为动态查询数据，根据i.FQueryField所有都动态付值给id*/
    	 	 	 if(i.FQueryType==1){
    	 	 	 	
    	 	 	 	  html_aa=html_input01.replace(/\$name/,i.FQueryName).replace(/\$id/,i.FQueryField)   
    	 	 	 	  html+=html_aa;
    	 	 	   }else if(i.FQueryType==2){//2树形下拉菜单 
    	 	 	  	_this.html_tree_data(i.FDropdownDataSource,i.FQueryName,i.FQueryField) //传递ajax url请求地址及名称,i.FQueryField为每个设定其的id,方便查询取值。
    	 	 	  }else if(i.FQueryType==3){ //3键值下拉菜单
    	 	 	  	_this.html_select_data(i.FDropdownDataSource,i.FQueryName,i.FQueryField) //传递ajax url请求地址及名称
    	 	 	  }else if(i.FQueryType==4){ //时间组件
    	 	 	  	_this.is_time=1;
    	 	 	  	inputime=inputime.replace(/\$iidd/,i.FQueryField)  
    	 	 	  
    	 	 	  }
     	    }
     	   
     	   
     	   document.getElementById("input_Listitem").innerHTML=html //输入框
     	   document.getElementById("timebox").innerHTML=inputime //控制时间值
     	   
      /*设置默认时间*/
  	    let arrs=[];
  	    let tt=comm.CurentTime().clock.split(" ")[0]//设置时间插件显示时间
  	    arrs.push(tt)
  	    arrs.push(tt)
	   _this.value6=arrs
  	 /*设置默认时间*/
     	   
    	   //console.log(_this.is_arrs+"---") 	
     },
     
    html_tree_data(urls,Name,id){//2树形下拉菜单 
    	 console.log('123',urls)
    	 let _this=this;
    	// _this.tree_id=id;
    	 _this.tree_id02.push(id) //多个树形
    	 //_this.tree_index++;
    	 let arrs=urls.split("/"); 
    	 _this.$axios.post(arrs[0],{
						        "FTokenID":localStorage.getItem("Token"),
						        "FAction":arrs[1],
						        "FVersion":"1.0.0",
						       // "ProjectID":3,
						         "ProjectID":localStorage.getItem("projectid"), 
						       
							}).then(function(jsons){
							 // _this.Gtree_data1=jsons.data.FObject
							 /*增加（全部）选择项*/
							 let o={
									"DeviceTypeID":50000,
									"DataItemName":"全部",
									"DeviceTypes":[],
									"$treeNodeId":"0"
								}
							 var a = jsons.data.FObject.slice(0);    
																// a.unshift(o);
							  _this.Gtree_data2.push(a)
							 // console.log(_this.tree_id02)
							 // console.log(_this.Gtree_data2)
					      	  
							}).catch(function(err){
							
							});
    	
    },
     
    html_select_data(urls,Name,id){ //键值下拉菜单
    	let _this=this;
     	let d=this.table2;
     	let html="";
     	let html_input02=`<p class="l text">$name</p><p class="ipt l put03_div">
    	 		<select  class="ghb_select" id="$id_"> $opt_select</select>
    	 	 </p>`;
  
    	      let arrs=urls.split("/");  	    	
	  	      _this.$axios.post(arrs[0],{
						        "FTokenID":localStorage.getItem("Token"),
						        "FAction":arrs[1],
						        "FVersion":"1.0.0",
						        "ProjectID":3,
						       
							}).then(function(jsons){
							  let tarr=jsons.data.FObject
					      	  let opt="<option  value=''>请选择</option>";  /*<option disabled value=''>请选择</option>*/
			    	 	 	  let opthtml="<option value='$v'>$n</option>";
			    	 	 	  if(tarr.length>0){   	 	 	  	
			    	 	 	  	for( let t of tarr){
			    	 	 	  		  opt+= opthtml.replace("$v",t.ProjectID).replace("$n",t.ShortName)
			    	 	 	  	}
			    	 	 	  }
			    	 	 	  html_input02=html_input02.replace(/\$opt_select/,opt).replace(/\$name/,Name).replace(/\$id_/,id)
			    	 	 	// document.getElementById("select_Listitem").append(html_input02)
			    	 	 	
			    	 	 	 var newLi=document.createElement("div");
			    	 	 	     newLi.className="l abc"
                                 newLi.innerHTML=html_input02;
			    	 	 	 document.getElementById("select_Listitem").appendChild(newLi);
                              //document.getElementById("select_Listitem").innerHTML=html_input02
							}).catch(function(err){
							
							});
													
    },
    

    
/*-----------------------点击头部新增按钮---------------------------------------*/
   handleNodeClick03(data) {/*树形菜单事件*/
       // console.log(data);
        this.tree_check03.DeviceTypeID=data.DeviceTypeID; //点击树形菜单得到id
    	this.tree_check03.DeviceTypeName=data.DeviceTypeName;//点击树形菜单得到name
     },
     
     btn_click03(){  //弹出框确定铵钮
     //	console.log(this.tree_check)
     	this.value_tree03=this.tree_check03.DeviceTypeName //把树形值显示在输入框
     	this.dialogVisible03=false;
     
     },
     
     handleNodeClick04(data) {/*树形菜单事件*/
       // console.log(data);
        this.tree_check04.DeviceTypeID=data.DeviceTypeID; //点击树形菜单得到id
    	this.tree_check04.DeviceTypeName=data.DeviceTypeName;//点击树形菜单得到name
     },
     
     btn_click04(){  //弹出框确定铵钮
     //	console.log(this.tree_check)
     	this.value_tree04=this.tree_check04.DeviceTypeName //把树形值显示在输入框
     	this.dialogVisible04=false;
     
     },
     
	
     
     
     
   add_btn_click_item(x){ //增加按钮事件或 修改按钮事件
   	 this.dialogVisible_add=true
   	 let _this=this;
   //	 if(this.getOne==0){
   	 setTimeout(function(){
   	 	 _this.addbtn_datas(x) //因为弹出框，采用异步
   	 })
	//}
   },
   
   addbtn_datas(x){ //点击增加或修改按钮，弹出框所要的下拉框及输入框等。。。
     this.ttitle="新增" //设置弹出框标题
      document.getElementById("pppp").innerHTML="" //多次点击增加按钮，把document.getElementById("pppp")内的li清空，否则会叠加
     	this.Gtree_data3=[] //避免点击增加和修改时，弹出框生成多个树形菜单
    // this.getOne=1;//只执行一次，生成页面组件，避免重复生成。
   	 let _this=this;
     let t_3=this.table3
   	 let temp="<p class='l text_ttpnt'>$name : </p><p class='ipt l' ><input placeholder='$ttt' class='iput01_aa' id='$id' $types></p>";
   	 let types="" //控制只输入数字
   	 let txts="请输入内容"
   	 let html="";
   	 let ppo="<p class='l text_ttpnt'>$name : </p><p class=''><select style='height:35px' id='$id'><option value='1'>是</option><option value='0'>否</option></select></p>"
   	 for(let i of t_3){
   	 	 
   	 	if(i.FEditType==1||i.FEditType==7){ //输入框,1为文本框，7为数值文本框
		   	 		if(i.FEditType==7){
		   	 			 types="type='number'";
		   	 			 txts="只能输入数字"
		   	 		}else{
		   	 			txts="请输入内容"
		   	 			types='';
		   	 		}
		   	 		html=temp.replace(/\$name/,i.FShowFieldName).replace(/\$id/,i.FSaveField+"_00").replace(/\$types/,types).replace(/\$ttt/,txts);
		   	 		
		   	 		var newLi=document.createElement("li");
		   	 		 
					    if(i.FIsEdit==0){ //如果不显示，隐藏
		   	 			 newLi.className="l gdf pri_none"
		   	 		   }else{ newLi.className="l gdf" }
    
		                newLi.innerHTML=html;
		   	 		  //  document.getElementById("add_divShow").appendChild(newLi);
		   	 		      document.getElementById("pppp").appendChild(newLi);
		   	 	}
		   	 	else if(i.FEditType==2){  //树菜单
		   	 		  _this.addbtn_tree(i.FDropdownDataSource,i.FShowFieldName,i.FSaveField)
		   	 	}else if(i.FEditType==3){ //下拉菜单
		   	 			_this.addbtn_select(i.FDropdownDataSource,i.FShowFieldName,i.FSaveField,i.FIsEdit) //传递ajax url请求地址及名称
		   	 	}else if(i.FEditType==6){ //下拉，只有0和1选择
		   	 		let onse=ppo.replace(/\$name/,i.FShowFieldName).replace(/\$id/,i.FSaveField+"_00");
		   	 		var newLi=document.createElement("li");
		   	 		    if(i.FIsEdit==0){ //如果不显示，隐藏
		   	 			 newLi.className="l gdf pri_none"
		   	 		   }else{ newLi.className="l gdf" }
		                newLi.innerHTML=onse;
		   	 		   // document.getElementById("add_divShow").appendChild(newLi);
		   	 		   document.getElementById("pppp").appendChild(newLi);
		   	 	}	

   	
   
   	} 	
	 
	  if(x){ //x为点击修改后要处理。。。。
	  //	console.log(x)
	  
	  
	  this.ttitle="修改"  //设置弹出框标题
	  let st=0;
	    setTimeout(function(){
	    	let chi=document.getElementById(x+"-ul").children; //取得父级UL的id
          
		  for(let i of chi){  //付值给弹出框相对应的输入框等。。。
		    	//console.log(i.id)
		    	let ids=i.id;
		    	if(ids){
		    	  let t=i.children[0].innerText;
		    	  let oo=ids.split("#")[0]
	
		      if(i.getAttribute("edi_type")==1){ //输入框
		    	  	document.getElementById(oo).value=t;
		    	  	
		    	  }else if(i.getAttribute("edi_type")==2){ //如果是树形
		    	  	let v=i.getAttribute("gid")
		    	  	
		    	   if(st==0){
		    	  		 _this.value_tree03=t //如果是树形1
		    	  		_this.tree_check03.DeviceTypeID=v //树形只能这样付值
		    	  		// console.log(v+"---"+oo)
		    	  		 st+=1;
		    	    }else{
		    	    	 _this.value_tree04=t //如果是树形2
		    	    	 _this.tree_check04.DeviceTypeID=v
		    	    	
		    	    }
		    	  	
		    	  }else if(i.getAttribute("edi_type")==3){ //键值下拉菜单
		    	  	let vh=i.getAttribute("gid")
									//console.log(oo+"---->>")
		    	  	    if(vh){
		    	  	    	document.getElementById(oo+'#1').value=vh;
		    	  	    }
		    	  		
		    	  	
		    	  }else if(i.getAttribute("edi_type")==6){ //如果是下拉“是”--“否”
		    	  	if(t=="false"){
		    	  		document.getElementById(oo).value=0
		    	  	}else{
		    	  		document.getElementById(oo).value=1
		    	  	}
		    	  
		    	  }else if(i.getAttribute("edi_type")==7){ //输入框为数字
		    	  	
		    	  	let o=document.getElementById(oo)
		    	  	if(o){
		    	  		//console.log(t)
		    	  		//o.value=12;
		    	  		o.value=t;
		    	  	}
		    	  	
		    	  	//document.getElementById(oo).value=t;
		    	  }
 	 
		    	}
 	
		    }
	    	
	    	
	    	
	    },500)
	      	    
    }
	 
	 
	 
   },
   
   addbtn_select(urls,Name,id,ishow){//键值下拉菜单
   	 
    	let _this=this;
     	let d=this.table2;
     	let html="";
     	let html_input02=`<p class="l text tttppp" >$name :</p><p class="ipt l">
    	 		<select  class="ghb_select ppot" id="$sid_00" style='height:35px'> $opt_select</select>
    	 	 </p>`;
  
    	      let arrs=urls.split("/");  	    	
	  	      _this.$axios.post(arrs[0],{
						        "FTokenID":localStorage.getItem("Token"),
						        "FAction":arrs[1],
						        "FVersion":"1.0.0",
						        //"ProjectID":3,
						         "ProjectID":localStorage.getItem("projectid"), 
						       
							}).then(function(jsons){
								
							  let tarr=jsons.data.FObject
							 // console.log(tarr)
					      	  let opt="<option   value=''>请选择</option>";  /*<option disabled value=''>请选择</option>*/
			    	 	 	  let opthtml="<option value='$v'>$n</option>";
			    	 	 	  if(tarr.length>0){   	 	 	  	
			    	 	 	  	for( let t of tarr){
			    	 	 	  		  opt+= opthtml.replace("$v",t.Key).replace("$n",t.Value)  //以后所有下拉框有取数据的，Key,Value
			    	 	 	  	}
			    	 	 	  }
			    	 	 	  html_input02=html_input02.replace(/\$opt_select/,opt).replace(/\$name/,Name).replace(/\$sid/,id)
			    	 	 	// document.getElementById("select_Listitem").append(html_input02)
			    	 	 	 var newLi=document.createElement("li");
			    	 	 	    if(ishow==0){ //如果为主健，不可以编辑，就隐藏
			    	 	 	     newLi.className="l gdf selectss pri_none"	
			    	 	 	    }else{
			    	 	 	      newLi.className="l gdf selectss"	
			    	 	 	    }
			    	 	 	    
                                 newLi.innerHTML=html_input02;
			    	 	 	    // document.getElementById("add_divShow").appendChild(newLi);
                                 document.getElementById("pppp").appendChild(newLi);
							}).catch(function(err){
							
							});

   },
   
   addbtn_tree(urls,name,id){//点击增加按钮，生成树形数据
   	
   	 let _this=this;
    	// _this.tree_id=id;
    	 _this.value_tree03=""
    	 _this.value_tree04=""
    	 _this.tree_name.push(name)//给树形菜单标题
    	 _this.tree_id03.push(id+"_00") //多个树形
    	 //_this.tree_index++;
			 let arrs=urls.split("/"); 
			 console.log(arrs);
    	 _this.$axios.post(arrs[0],{
						        "FTokenID":localStorage.getItem("Token"),
						        "FAction":arrs[1],
						        "FVersion":"1.0.0",
						        //"ProjectID":3,
						         "ProjectID":localStorage.getItem("projectid"), 
						       
							}).then(function(jsons){
							
								 /*增加（全部）选择项*/
							 let o={
									"DeviceTypeID":0,
									"DataItemName":"全部",
									"DeviceTypes":[],
									"$treeNodeId":"0"
								}
							 var a = jsons.data.FObject.slice(0);    
                o.DeviceTypes.push(...a)
							  _this.Gtree_data3.push(o)
					      console.log(_this.Gtree_data3)	  
							}).catch(function(err){
							
							});
   },
   
   add_ul(){  //点击增加弹出框，确定按钮。
   //	console.log(this.ttitle)
   	/*all_Saveid*/
   	let _this=this;
   	let t3=_this.table3;
    let ftype=""; //控制是新增还是删除
   	let Where_Str="";
    let vv="";
   	let aaa=t3.filter(item => item.FSaveField!="" )  //item.FSaveField不能为空
    let aaa1=aaa.filter(item => item.FIsPrimaryKey==0 ) //item.FIsEdit==1 为1时，才可以编辑
    let aaa2=aaa1.filter(item => item.FIsEdit==1 )  //只有可以编辑的才显示出来
    if(this.ttitle=="新增"){  //新增
    	ftype=1 //1为新增
    	_this.all_Saveid=aaa.map(x=>x.FSaveField)

	   for(let i of _this.all_Saveid){
	   	let o=document.getElementById(i+"_00")
	   	//console.log(o.value)
	   	vv+="\'"+o.value+"\'"+"," //按后端要求的格式
	   }
	   let lens=vv.length;
	   vv=vv.substr(0,lens-1) //去除最后一个，（逗号）
    	
    	
    }else{ //修改
    	ftype=3 //3为修改
    	_this.all_Saveid=aaa2.map(x=>x.FSaveField);
    	let ispriKey=t3.filter(item => item.FIsPrimaryKey==1 )//把是否为主健的抽出来。
    	console.log(ispriKey)
    	for(let tt of ispriKey){  //应该后台要求，是主健的放进Where_Str里
			let ts=tt.FSaveField
			let va=document.getElementById(ts+"_00").value;
    		Where_Str+=ts+"="+"'"+va+"'"+" AND "  //应该后端要求，组装成这样"DeviceID='1' AND ProjectID='1'"
    		//console.log(ts+":"+va);
    	}
    	//console.log(Where_Str)
		//return false
    	let len_b=Where_Str.length
    	 Where_Str=Where_Str.substr(0,len_b-5) //去除最后一个，（逗号）
    	
		//console.log(Where_Str)
    	for(let uu of _this.all_Saveid){
			let el = document.getElementById(uu+"_00"),aaa
			if(!el){
				aaa = ''
			}else{
				aaa = el.value
			}
    		vv+=uu+"="+"'"+aaa+"'"+","  //应该后端要求，组装成这样""DeviceName='7AA4变压器iiiiii',DeviceShortName='1#变压器'"
    		//console.log(uu+":"+aaa)
    	}
    	let len_c=vv.length
    	 vv=vv.substr(0,len_c-1) //去除最后一个，（逗号）
    	//console.log(vv)

    }
   		

 _this.$axios.post("System",{
						        "FTokenID":localStorage.getItem("Token"),
						        "FAction":"AddDeleteUpdatePageDataByUniversalConfig",
						        "FVersion":"1.0.0",
						        "FMenuGUID":_this.FMenuGUID,
						        "FType":ftype,
						        "FData":vv,
						        "WhereStr":Where_Str,
    
							}).then(function(jsons){
								if(jsons.data.Result==200){
									_this.getData(_this.PageIndex)//回调数据
									_this.$message({
							          message: _this.ttitle+'成功！',
							          type: 'success'
							        });
								}else{
									_this.$message.error(_this.ttitle+'失败');
								}
								
								  _this.dialogVisible_add = false
							 
					      	  
							}).catch(function(err){
							
							});
    
    
   //	this.dialogVisible02 = false
   },
     
   dele_ul_btn(ul_id){
   	console.log(ul_id+"...dele......")  
   	let _this=this;
   	let ftypess=2
   	let cc=document.getElementById(ul_id).children;
   	let arrs00=[]
   	for(let pp of cc){
   		if(pp.children.length){
   			arrs00.push(pp.children[0].innerHTML)
   			//console.log(pp.children[0].innerHTML)
   		}
   	}
   	
   	let len_f=arrs00.length;
     let Where_Str_0=""
   	 for(let b=0;b<len_f-1;b++){  //去除最后一个“修改""
   	      Where_Str_0+=arrs00[b].split("=")[0]+"="+"'"+arrs00[b].split("=")[1]+"'"+" AND " //组装"DeviceID='1' AND ProjectID='1'"
   	 	
   	 }
   	 
   	 let len_y=Where_Str_0.length
    	 Where_Str_0=Where_Str_0.substr(0,len_y-5) //去除最后一个，（逗号）
   	 
     
   	this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	//console.log("successsuccesssuccesssuccess")
           	 _this.$axios.post("System",{
						        "FTokenID":localStorage.getItem("Token"),
						        "FAction":"AddDeleteUpdatePageDataByUniversalConfig",
						        "FVersion":"1.0.0",
						        "FMenuGUID":_this.FMenuGUID,
						        "FType":ftypess,
						        "FData":"",
						        "WhereStr":Where_Str_0,
    
							}).then(function(jsons){
								if(jsons.data.Result==200){
									 let ul_ids=document.getElementById(ul_id); //删除直接删除dom,不回调数据
									  ul_ids.remove()
									//_this.getData()//回调数据
									_this.$message({
							          message: '删除成功！',
							          type: 'success'
							        });
								}else{
									 _this.$message.error('删除失败');
								}
								_this.dialogVisible_add = false

							}).catch(function(err){
							
							});
        	

        }).catch(() => {
        	//console.log("no-succ")
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
   	


   	
   	
   	
   },
     
    },
   
    
   mounted:function(){

  	this.getData()
  	
  
  },
  watch: { //解决通用配置，跳转到同一个路由时，数据不更新
  '$route' (to, from) {
    this.$router.go(0);
  }
},
  };


</script>
 
<style type="text/css" scoped>
  .container {
    background-color: #efefef;
    min-height: 100%;
  }
  
  
 :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #fff;  
}
 
::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #fff;
}
 
input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
    color: #fff;
}
 
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
    color: #fff;
}
  
 .cout_allitem_cc{ height: 920px; width: 1563px; background: url(/static/image/index/count_back.png);}
 .ab_container_cc{ padding: 5px 20px;}	
 .ab_container_cc .cout_title{ min-height: 50px; padding: 55px 15px 0 25px ; overflow: hidden;}
  .ab_container_cc .cout_title p{ height: 46px; line-height: 46px; padding: 0; text-align: center;}
  .ab_container_cc .cout_title p.text{ font-size: 17px; padding: 0 15px;}
  .ab_container_cc .cout_title input{ height: 33px; width: 100%; background:none; border: none; color: #fff;}	
  .ab_container_cc .cout_title .put01{ width: 116px; height: 46px; background: url(/static/image/count/button_bg_1.png);}
  .ab_container_cc .cout_title .put02{ width: 116px; height: 46px; background: url(/static/image/count/button_nor_Equipment.png);}
  .ab_container_cc .cout_title .put03{ width: 116px; height: 46px; background: url(/static/image/count/button_nor_down.png);}
 .ab_container_cc .cout_title .put04{ width: 116px; height: 46px; background: url(/static/image/count/button_nor_down.png);}
 .ab_container_cc .cout_title .put05{ width: 174px; height: 46px; background: url(/static/image/count/button_nor_time.png);}
 	
 	
 	
 	.ab_container_cc .cout_title p.btn_01{ width: 88px; height: 46px; text-indent:25px;background: url(/static/image/count/btn1.png); margin: 0 10px; cursor: pointer;}
 		.ab_container_cc .cout_title p.btn_01:hover{background: url(/static/image/count/btn2.png);}
  .ab_container_cc .cout_title p.btn_02{ width: 88px; height: 46px;text-indent:25px;background: url(/static/image/count/btn3.png);cursor: pointer;}
 	.ab_container_cc .cout_title p.btn_02:hover{background: url(/static/image/count/btn4.png);}
 .ab_container_cc .el-input__inner {
    background: none;
    border: none;
    font-size: 14px;
    color: #6A7DB1;
}
 .ab_container_cc	.el-input__inner {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
   /* border: 1px solid #dcdfe6;*/
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 30px;
    line-height: 30px;
    outline: none;
    padding: 0 32px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 95%; 
}
 .ab_container_cc .el-input__icon{ line-height: 30px;}

.table_info_cc{width: 99%; margin: 0 auto; height: 700px;  margin-top: 25px; border: solid 1px #112e6a;  background: #03234c;}
.table_info_cc .table_ltop{ height: 65px; font-size: 14px; }
.table_info_cc .table_ltop ul{padding: 0 ; overflow: hidden; cursor: pointer;}
.table_info_cc .table_ltop ul li{ width:110px;height: 65px;line-height: 65px; float: left;overflow: hidden;text-overflow:ellipsis;white-space: nowrap; }


/*.table_info_cc .table_ltop ul li:nth-child(1){ width: 150px;}
.table_info_cc .table_ltop ul li:nth-child(2){ width: 150px;}
.table_info_cc .table_ltop ul li:nth-child(3){ width: 150px;}
.table_info_cc .table_ltop ul li:nth-child(4){ width: 150px;}
.table_info_cc .table_ltop ul li:nth-child(5){ width: 150px;}
.table_info_cc .table_ltop ul li:nth-child(6){ width: 150px;}
.table_info_cc .table_ltop ul li:nth-child(7){ width: 150px;}
.table_info_cc .table_ltop ul li:nth-child(8){ width: 180px;}
.table_info_cc .table_ltop ul li:nth-child(9){ width: 180px;}*/
 
 .data_item_gh_cc ul:hover{ background: #1e4483!important;}
 
 .data_item_gh_cc ul:nth-child(even){
        background-color:#052d68;
    }
    /*偶数*/
 .data_item_gh_cc ul:nth-child(odd){
     background-color: #0b3975;
 }
  
</style>
