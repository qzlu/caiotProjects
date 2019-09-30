<style>
	#pb_posion{ display:none ; position: absolute;top: 40px;left: 0px; height: 200px; width: 160px; overflow: auto; background: #fff;}
	#pb_posion .bgnav_j{ text-align: left; padding: 5px 0 0 20px; cursor: pointer;color: red; font-weight: bold;}
	#pb_posion .two{ display: ;color: gray; font-weight:normal;}
	.selectDIVPl:hover #pb_posion{ display: block;}
	.set_no_click{pointer-events: none}
</style>
<template>
  <div class="config_info">
  	<section class="con_box">
  		
  		
  		 <div class="item_a">
  		 	 <div class="a_btn">
  		 	 	<p class="p0 btns" style="width: 300px; text-align: left; position: relative;">
  		 	 		配置名称：<input style="width: 150px; height: 28px; border:none;" v-model="search_input"/>
  		 	 		<img src="../../static/image/admin/search.png" @click="get_GeneralConfig('click')" style="position: absolute;top: 10px; right: 70px;"/>
  		 	 	</p>
  		 	 	<p class="p1 btns" @click="dialogVisible = true">新增</p>
  		 	 	<!--<p class="p2 btns">导出</p>
  		 	 	<p class="p3 btns">刷新</p>-->
  		 	 </div>
  		 	 
  		 	 <section class="context">
  		 	 	 <ul class="title"><li class="fir"></li><li>配置名称</li><li>配置URL</li><li>数据源类型</li><li>数据源名称</li><li>配置功能</li><li>是否分页</li><li>操作</li></ul>
  		 	 	 <div class="pf_cc">
  		 	 	   <ul class="tt" v-for="(item,key) in config_data" @click="ULclick(item.FGUID)">
  		 	 	   	<li class="fir">{{key+1}}</li>
  		 	 	   	<li><!--设备信息-->{{item.FConfigName}}</li>
  		 	 	   	<li><!--DeviceInfo-->{{item.FConfigURL}}</li>
  		 	 	   	<li><!--表-->{{item.FDataSourceType==1?"表":"视图"}}</li>
  		 	 	   	<li class="iu_lens">{{item.FDataSourceName}}<!--数据源名称--></li>
  		 	 	   	<li>{{item.FConfigFeatures}}<!--配置功能--></li>
  		 	 	   	<li><!--是-->{{item.FIsPaging==0?"否":"是"}} </li>
  		 	 	   	<li class="edit">
  		 	 	   		<span @click.stop="edit_GeneralConfig(item.FGUID,item.FConfigName,item.FDataSourceType,item.FDataSourceName,item.FConfigFeatures,item.FIsPaging,item.FMenuName,item.FParentGUID)">修改</span>
  		 	 	   		<span @click.stop="dele_GeneralConfig(item.FGUID)">删除</span> 
  		 	 	   	</li>
  		 	 	   </ul>
  		 	 	  
  		 	 	 </div>
  		 	 </section>
  		 	 
  		 	
  		 </div>
  		 <!--字组件-->
  		 <section class="compoment_show"  :class="{set_no_click:not_click==0}">
  		   <item_b  ref="mychild"></item_b>
  		 </section>  
  		 <!--字组件-->
  		
  	</section>
  <!--新增通用配置-弹出框1-->	
  	<el-dialog
   title="新增或修改信息"
   :visible.sync="dialogVisible"
	 width="677px"
 custom-class="config_layer"
  :before-close="handleClose">
   
   <section class="xi_context">
   	 <ul>
   	 	<li><p class="l name"><font color="red">*</font> 配置名称:</p> <p class="l in"> <input v-model="uNames"></p></li>
   	 	<li>
   	 		<p class="l name" ><font color="red">*</font> 所属父级模块: </p>
   	 		 <div class="l selectDIVPl" style="position: relative;">
   	 		 	<p class="l in"> <input v-model="ccnav_name"></p>
   	 		 	<section id="pb_posion">
			  		<div v-for="(item,key) in chnage_nav_data" class="bgnav_j" :data:="item.FGUID">
			  			<p v-if="item.FFunctionURLAddress!='UniversalConfigPage'" @click="change_navA(item.FGUID,item.FMenuName)">{{item.FMenuName}}</p>
			  			<div class="two">
			  			 <div v-if="item.FChildMenu.length" v-for="(Bitem,key) in item.FChildMenu" >
			  			 	   <!--v-if="Bitem.FFunctionURLAddress!='UniversalConfigPage'" 不能选择通用配置作为所属模块-->
			  				  <div v-if="Bitem.FFunctionURLAddress!='UniversalConfigPage'" @click="change_navA(Bitem.FGUID,Bitem.FMenuName)"> &nbsp;&nbsp;{{Bitem.FMenuName}}</div>
			  				 <!-- <div v-if="Bitem.FChildMenu.length" v-for="(Citem,key) in Bitem.FChildMenu" :data:="Citem.FGUID" style="color: green; font-weight:normal;">
			  				   	&nbsp;&nbsp;***--{{Citem.FMenuName}}
			  				  </div>-->
			  				</div> 
			  			</div>
			  		</div>
			  		</section>
   	 		 	
   	 		 </div>  	 		
   	 	</li>
   	 	<li><p class="l name"><font color="red">*</font> 数据源类型: </p>
   	 		<p class="l in"><!-- <input>-->
   	 			
					  <select v-model="data_type" style="width: 160px; height: 37px; border: solid 1px #05679E; background: #18406B; color: #fff;">
					  	<option  value="">请选择</option>
					  	<option value="1">表</option>
					  	<option value="2">视图</option>
					  </select>
   	 		</p>
   	 	</li>
   	 	<li><p class="l name"><font color="red">*</font> 数据源名称: </p><p class="l in">
   	 		<input v-model="d_name">
   	 		
   	 	</p></li>
   	 	<li style="position: relative;"><p class="l name"><font color="red">*</font> 配置功能: </p>
   	 		<p class="l in ytin_input" style="position: absolute;top: 1px; left: 109px; width: 265px; background: #18406B; border: solid 1px #05679E;"> 
   	 		<input type="checkbox" id="jack" value="1" v-model="checkedNames">
			  <label for="jack">增加</label>
			  <input type="checkbox" id="john" value="2" v-model="checkedNames">
			  <label for="john">删除</label>
			  <input type="checkbox" id="mike" value="3" v-model="checkedNames">
			  <label for="mike">修改</label>
			  <input type="checkbox" id="mike02" value="4" v-model="checkedNames">
			  <label for="mike02">查询</label>
			  <input type="checkbox" id="mike03" value="5" v-model="checkedNames">
			  <label for="mike03">导出</label>

   	 	<!--<input>--></p></li>
   	 	<li><p class="l name" style="margin-left: 70px;"><font color="red">*</font> 是否分页: </p><p class="l in" style="color: #fff;"> 
   	 		&nbsp;&nbsp;<input type="radio" id="one" value="1" v-model="picked" style="width:12px; height: 12px;">
        <label for="one">是</label>
        &nbsp;&nbsp;<input type="radio" id="two" value="0" v-model="picked" style="width:12px; height: 12px;">
        <label for="two">否</label>
       </p>
   	 	</li>
   	 </ul>
   </section>
  <span slot="footer" class="dialog-footer">
    <el-button @click="Colse_btn ">取 消</el-button>
    <el-button type="primary" @click="add_GeneralConfig()">确 定</el-button>
  </span>
</el-dialog>
  <!--新增通用配置-弹出框1-->	
  
  
  	 		
	
		
  </div>
</template>



<style>
.config_info .config_layer{ background: url(../../static/image/admin/pop_bg_1.png) no-repeat; }
.config_info .config_layer02{ background: url(../../static/image/admin/btn3.png) no-repeat; }
.config_info .el-dialog__title{color: #fff;}
.config_info .el-dialog__header {  padding: 30px 20px 10px 60px; text-align: left;}
.config_info .el-dialog__headerbtn{top: 27px;right: 32px;}
.config_info  .el-dialog__headerbtn .el-dialog__close{ color: #fff;}
.config_info .el-dialog__body{padding: 30px 50px 0 30px;}
.config_info .el-dialog__footer{padding: 10px 60px 60px;}

.config_info .xi_context{ height: 168px;}
.config_info .xi_context02{ height: 320px;}
.config_info .xi_context ul li{ width: 50%; float: left; height: 50px;}
.config_info .xi_context ul li p{ height: 39px; line-height: 39px;}
.config_info .xi_context ul li p.name{ width: 105px; color:#F1F1F2; text-align: right; margin-right: 5px;}
.config_info .xi_context ul li p.in input{ width: 160px; border: solid 1px #05679E;height: 37px; background: #18406B; color: #fff; text-indent: 5px; }
.config_info .config_ubselect{ width: 160px; height: 37px; border: solid 1px #05679E; background:  #18406B; color: #fff; }

.config_info .xi_context ul li p.ytin_input{ color: #fff;}
.config_info .xi_context ul li p.ytin_input input{ width: 12px; height: 12px;;}

</style>


<script>
import item_b from './comment' ;
import * as comm from '../../assets/js/pro_common';	
 export default {
      data() {
        return {
          not_click:0, //下面大div-字段配置不可以点击	
        	//active:0,////用于显示隐藏及当前高亮
          dialogVisible:false,//通用配置-增加或修改-弹出框1
          dialogVisible02: false,//弹出框2
          dialogVisible03: false,//弹出框3
          add_edit_type:"",//通用配置--点击增加或修改按钮
          
          
          config_data:[],//通用配置查询数据
          search_input:"",//通用配置输入框;
          Ititle:"增加通用配置", //弹出框title            弹出框--1
          chnage_nav_data:"",//通用配置-所属模块下拉菜单       弹出框--1
          
          uNames:'',//通用配置-配置名称                                                     弹出框--1 要带参数
          ccnav_cc:"",//点击所属模块下拉菜单的id          弹出框--1 要带参数
          ccnav_name:"请选择",//点击所属模块下拉菜单显示名     弹出框--1 要带参数
          data_type:"",    // 数据源类型 -表还是视图                   弹出框--1 要带参数
          d_name:"",//数据源名称                                                                       弹出框--1 要带参数
          checkedNames:[],// 配置功能                                                       弹出框--1 要带参数
          picked: '',//选择是否分页                                                               弹出框--1 要带参数
          edit_id:"",    //用于修改，带当前选择的id
        }
      },
      methods: {
        ULclick(gid){ //点击通用配置列表的ul，查询字段配置，把当前行的id传过给字组件
        	//console.log(gid)
      	   let _this=this;
      	   this.not_click=1; //控制字段配置大div点击
      	   this.$refs.mychild.start_gdata(gid);
      	   
      },
      	handleClose(done) {//修改、增加弹出框的关闭按钮--弹出框1
      	  // console.log(done)
      	 this.dialogVisible= false
      	 /*增加和修改弹出框1参数*/
      	    this.uNames=""
      		this.ccnav_cc=""
      		this.ccnav_name="请选择";
      		this.picked='';
      		this.checkedNames=[];
      		this.data_type='';
      		this.d_name="";
      		this.add_edit_type="";//通用配置--点击增加或修改按钮
      	 /*增加和修改弹出框1参数*/
        done();
        },
        
        Colse_btn(){  //通用配置,增加或修改取消铵钮
        	this.dialogVisible = false
        	this.uNames=""
      		this.ccnav_cc=""
      		this.ccnav_name="请选择";
      		this.picked='';
      		this.checkedNames=[];
      		this.data_type='';
      		this.d_name="";
      		this.add_edit_type="";//通用配置--点击增加或修改按钮
        },
        
       
      
      change_navA(urls,name){ //通用配置-选择所属模块
         //	console.log(urls)
      	//console.log(name)
      
      	this.ccnav_cc=urls
      	this.ccnav_name=name
      },
      
     
      get_GeneralConfig(x){  //查询通用配置
      	if(x=="click"){
      		if(this.search_input==""){
      			 this.$message({ message: '请输入要搜索的内容！',type: 'warning'});
      			 return false;
      		}
      	}
      	
      	                  let _this=this;
  		                  _this.$axios.post(_this.mypro+'Caiot/System',{
						        "FTokenID":localStorage.getItem("Token"),
						        "FAction":"QueryUniversalConfig",
						        "FVersion":"1.0.0",
						        "FConfigName":_this.search_input,
                    
							}).then(function(jsons){
								 console.log(jsons.data.FObject)   
                                _this.config_data=jsons.data.FObject
								
							}).catch(function(err){
							
							});
      },
      
      edit_GeneralConfig(...items){  //新增通用配置--修改按钮   
      
      	  this.dialogVisible = true
      	  this.edit_id= items[0];
      	  this.uNames=items[1];//通用配置-配置名称                                                     弹出框--1 要带参数
          this.data_type=items[2];    // 数据源类型 -表还是视图                  弹出框--1 要带参数
          this.d_name=items[3];//数据源名称                                                                       弹出框--1 要带参数
          this.checkedNames=items[4].split(",");// 配置功能                      弹出框--1 要带参数
          this.picked= items[5];//选择是否分页                                                               弹出框--1 要带参数
      	  this.ccnav_name=items[6]; //所属模块的名称
      	  this.ccnav_cc=items[7];  //所属模块的名称id  
      	  this.add_edit_type="修改";
      	
      },
      
       dele_GeneralConfig(id) { //新增通用配置--修改按钮
       	let _this=this;
    	
       	this.$confirm('删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
          _this.$axios.post(_this.mypro+'Caiot/System',{
						        "FTokenID":localStorage.getItem("Token"),
						        "FAction":"DeleteUniversalConfig",
						        "FVersion":"1.0.0",
						        "FGUID":id ,
							}).then(function(jsons){
								console.log(jsons.data)
							   if(jsons.data.Result=="200"){
							   	  _this.$message({
			                        type: 'success',
			                         message: '删除成功!'
			                        });
			                    _this.get_GeneralConfig()    
							   }else{
							   	  _this.$message.error('删除失败！');
							   }
							
								
							}).catch(function(err){
							    
							});
          
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
       	
       	
      
      },
      
      add_GeneralConfig(type){  //新增通用配置按钮   
      	 let _this=this;
      	//this.dialogVisible = false  
      	//console.log(this.uNames+"<-->"+this.ccnav_cc+"<-->"+this.data_type+"<-->")
       // console.log(this.d_name+"<-->"+this.checkedNames+"<-->"+this.picked+"<-->")
      	if(this.uNames==""||this.ccnav_cc==""||this.data_type==""||this.d_name==""||this.checkedNames.length==""||this.picked==""){
      		//this.$message.error('请填完整信息');
      		//return false
      	} 	
      	let setFAction="AddUniversalConfig";
      	if(this.add_edit_type=="修改"){
      		setFAction="UpdateUniversalConfig"
      	}
 	         console.log(setFAction)
 	        
  		           _this.$axios.post(_this.mypro+'Caiot/System',{
						        "FTokenID":localStorage.getItem("Token"),
						        "FAction":setFAction,
						        "FVersion":"1.0.0",
						        "mTUniversalConfig":{
						        	"FConfigName":_this.uNames,     //名称
						        	"FParentGUID":_this.ccnav_cc,   //所属模块id
						        	"FDataSourceType":_this.data_type, //数据类型
						        	"FDataSourceName":_this.d_name,
						        	"FConfigFeatures":_this.checkedNames.join(","),
						        	"FIsPaging":_this.picked,
						        	"FGUID":this.edit_id  //用于修改，带当前选择的id
						        },
                    
							}).then(function(jsons){
								 console.log(jsons.data.FObject)  
								 if(jsons.data.Result=="200"){
									 _this.$message({
							            message: "成功",
							            type: 'success'
							          });
							       _this.get_GeneralConfig() 
							       _this.Colse_btn()
								 }else{
								 	 _this.$message.error("失败");
								 }
                                //  _this.dialogVisible = false //如果成功，
                                 
                
								
							}).catch(function(err){
							
							});
      },
      
      	
      	
        	
      },
      components: {item_b,},
			created(){
		    
			},
			mounted:function(){
				this.get_GeneralConfig() //查询通用配置
				this.chnage_nav_data=JSON.parse(localStorage.getItem('config_nav_data'))
				console.log(this.chnage_nav_data)
				//this.itest=comm.config_change_MoKuai(localStorage.getItem('config_nav_data'))
				
			},
    }

</script>
<style>
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.config_info{ height: 920px; width: 1563px;background: url(../../static/image/admin/bg_1.png);}
.config_info .con_box{ padding:50px 45px 0 45px; height: 428px; font-size: 14px; color: #F1F1F2;}
.config_info .item_a{ height: 408px;}
.config_info .item_a .a_btn{ height: 46px;}
.config_info .item_a .a_btn  .btns{ width: 88px; height: 46px; line-height: 46px; float: left;  text-align: center; opacity: 0.9; margin-right: 10px; text-indent: 10px; cursor: pointer;}

.config_info .item_a .a_btn .p1{ background: url(../../static/image/admin/added.png) #042E74 no-repeat 10px 13px;}
.config_info .item_a .a_btn .p1:hover{ background: url(/static/image/admin/added.png) #0a3c7b no-repeat 10px 13px;}

.config_info .item_a .a_btn .p2{ background: url(/static/image/admin/export.png) #042E74 no-repeat 10px 13px;}
.config_info .item_a .a_btn .p2:hover{ background: url(/static/image/admin/export.png) #0a3c7b no-repeat 10px 13px;}

.config_info .item_a .a_btn .p3{ background: url(/static/image/admin/Refresh.png) #042E74 no-repeat 10px 13px;}
.config_info .item_a .a_btn .p3:hover{ background: url(/static/image/admin/Refresh.png) #0a3c7b no-repeat 10px 13px;}

.config_info .item_a .context{ height: 310px; border: solid 2px #0E3270; margin-top: 15px;}
.config_info .item_a .context .pf_cc{ height: 265px; overflow: auto;}
.config_info .item_a .context .pf_cc  ul:nth-child(odd){background-color: #0a3c7b;}
.config_info .item_a .context .pf_cc  ul:nth-child(even){background-color: #062b62;}
.config_info .item_a .context .pf_cc  ul:hover{ background: #134FA4;}

.config_info .item_a .context ul{ height: 45px; ;}

.config_info .item_a .context ul.title{ font-size: 17px;}
.config_info .item_a .context ul li{ line-height: 45px; float: left; width: 13.5%;}
.config_info .item_a .context ul li.fir{ width: 3%; height: 45px;}
.config_info .item_a .context ul li.edit span{ cursor: pointer;}

.config_info .item_a .context ul li.iu_lens{overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}




/*.config_info .ccontr{ display: none;}
.config_info .ishow{ display: block;}
.config_info ul li.edit span{ padding: 0 8px;}*/

</style>
