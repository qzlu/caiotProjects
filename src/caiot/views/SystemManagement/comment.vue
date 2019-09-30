
<template>
  <div class="config_info_ghbr">
  	<section class="con_box">
  		

  		 <div class="item_b">
  		 	<div class="a_btn">
  		 	 	<p class="btns" :class="{currnt:active==0}" @click="change(0)">字段配置</p>
  		 	 	<p class=" btns" :class="{currnt:active==1}" @click="change(1)">查询配置</p>
  		 	 </div>
  		 	 <!--1-->
        <div class="contexts ccontr" :class="{ishow:active==0}">
        	<div class="btn_l">
        	   <p class="hgn p1 l" @click="dialogVisible02 = true">新增</p>
        		 <!-- <p class="hgn p2 l">导入</p>-->
        	</div>
        	
        	<div class="ulitem">
        		<ul class="titles">
        			<li>配置名称</li><li>字段名</li><li>字段显示名称</li><li>显示长度</li><li>是否主键</li><li>主键方式</li><li>是否必填</li><li>是否编辑</li><li>是否显示</li><li>存储字段</li><li>编辑类型</li><li>数据源</li><li>操作</li>
        		</ul>
        		<div class="pj_ul">
        			<ul v-for="(item,key) in data01">
        				<li :title="item.FConfigName">{{item.FConfigName}}</li>
        				<li :title="item.FFieldName">{{item.FFieldName}}</li>
        				<li :title="item.FShowFieldName">{{item.FShowFieldName}}</li>
        				<li :title="item.FShowLen">{{item.FShowLen}}</li>
        				<li :title="item.FIsPrimaryKey">{{item.FIsPrimaryKey}}</li>
        				<li :title="item.FPrimaryKeyWay">{{item.FPrimaryKeyWay}}</li>
        				<li :title="item.FIsRequiredFill">{{item.FIsRequiredFill}}</li>
        				<li :title="item.FIsEdit">{{item.FIsEdit}}</li>
        				<li :title="item.FIsShow">{{item.FIsShow}}</li>
        				<li :title="item.FSaveField">{{item.FSaveField}}</li>
        				<li :title="item.FEditType">{{item.FEditType}}</li>
        				<li :title="item.FDropdownDataSource">{{item.FDropdownDataSource}}</li><!--增加数据源-->
        				<li class="edit">
        					<span  @click="edit_data01(item.FGUID,item.FConfigName,item.FFieldName,item.FShowFieldName,item.FShowLen,item.FIsPrimaryKey,item.FPrimaryKeyWay,item.FIsRequiredFill,item.FIsEdit,item.FIsShow,item.FSaveField,item.FEditType,item.FSortID,item.FDropdownDataSource)">修改</span>
        					<span @click="dele_items(item.FGUID)">删除</span>
        				</li>
        			</ul>
        			
        			
        		</div>	
        	</div>
        	
        </div>
        <!--1-->
        <!--2-->
        
        <div class="contexts ccontr" :class="{ishow:active==1}">
        	<div class="btn_l">
        		 <p class="hgn p1 l"  @click="dialogVisible03 = true">新增</p>
        		 <!--<p class="hgn p2 l">导入</p>-->
        	</div>
        	<div class="ulitem">
        		<ul class="titles titles02">
        			<li>配置名称</li><li>查询名称</li><li>查询类型</li><li>查询关联字段</li><li>下拉数据源</li><li>下拉显示内容</li><li>下拉绑定字段</li><li>操作</li>
        		</ul>
        		<div class="pj_ul pj_ul02">
        			<ul v-for="(item,key) in data02">
        				<li><!--22设备信息-->{{item.FConfigName}}</li>
        				<li><!--DeviceName-->{{item.FQueryName}}</li>
        				<li><!--设备名称-->{{item.FQueryType}}</li>
        				<li><!--20-->{{item.FQueryField}}</li>
        				<li><!--OeviceName-->{{item.FDropdownDataSource}}</li>
        				<li>  <!--NULL-->{{item.FDropdownShowValue}}</li>
        				<li><!--DeviceTypeName-->{{item.FDropdownField}}</li>
        				<li class="edit">
        					<span  @click="edit_data02(item.FGUID,item.FConfigName,item.FQueryName,item.FQueryType,item.FQueryField,item.FDropdownDataSource,item.FDropdownShowValue,item.FDropdownField)">修改</span>
        					<span @click="dele_items02(item.FGUID)">删除</span>
        				</li>
        			</ul>
        		</div>	
        	</div>
        	
        </div>
        
        <!--2-->
       
       
  		 </div>
  		
  	</section>

  
   <!--弹出框2-->	
  	 	<el-dialog
  title="字段配置"
   :visible.sync="dialogVisible02"
	 width="677px"
 custom-class="config_layer02"
  :before-close="handleClose02">
   
   <section class="xi_context xi_context02">
   	 <ul>
   	 	<li><p class="l name">配置名称: <p class="l in"> <input v-model="a1"></p></p></li>
   	 	<li><p class="l name">字段名: <p class="l in">   <input v-model="a2"></p></p></li>
   	 	<li><p class="l name">字段显示名称: <p class="l in"> <input v-model="a3"></p></p></li>
   	 	<li><p class="l name">显示长度: <p class="l in">  <input v-model="a4"></p></p></li>
   	 	<li><p class="l name">是否主键: <p class="l in"> <select class="config_ubselect" v-model="a5"><option disabled value="">请选择</option><option value="1">是</option><option value="0">否</option></select></p></p></li>
   	 	<li><p class="l name">主键方式: <p class="l in"> <input v-model="a6"></p></p></li>
   	 	<li><p class="l name">是否必填: <p class="l in"> <select class="config_ubselect" v-model="a7"><option disabled value="">请选择</option><option value="1">是</option><option value="0">否</option></select></p></p></li>
   	 	<li><p class="l name">是否编辑: <p class="l in"> <select class="config_ubselect" v-model="a8"><option disabled value="">请选择</option><option value="1">是</option><option value="0">否</option></select></p></p></li>
   	 	<li><p class="l name">是否显示: <p class="l in"> <select class="config_ubselect" v-model="a9"><option disabled value="">请选择</option><option value="1">是</option><option value="0">否</option></select></p></p></li>
   	 	<li><p class="l name">存储字段: <p class="l in"> <input v-model="a10"></p></p></li>
   	 	<li><p class="l name">编辑类型: <p class="l in"><select class="config_ubselect" v-model="a11"><option disabled value="">请选择</option><option value="1">模糊查询</option><option value="2">树形下拉菜单</option><option value="3">键值下拉菜单</option><option value="4">时间选择下拉框 </option><option value="6">是、否下拉选择 </option><option value="7">数字型输入框 </option></select></p></p></li>
      <li><p class="l name">字段排序: <p class="l in"> <input v-model="a12"></p></p></li>
      <li><p class="l name">数据源: <p class="l in"> <input v-model="a13"></p></p></li>
   	 </ul> 	
   </section> 
  <span slot="footer" class="dialog-footer">
    <el-button @click="btn_Close02 ">取 消</el-button>
    <el-button type="primary" @click="add_jd_id()">确 定</el-button>
  </span>
</el-dialog>
<!--弹出框2-->	
		
<!--弹出框3-->	

 	<el-dialog
  title="编辑信息"
   :visible.sync="dialogVisible03"
	 width="677px"
 custom-class="config_layer02"
  :before-close="handleClose03">
   
   <section class="xi_context xi_context02">
   	 <ul>
   	 	<li><p class="l name">配置名称: <p class="l in"> <input v-model="v1"></p></p></li>
   	 	<li><p class="l name">查询名称: <p class="l in"> <input v-model="v2"></p></p></li>
   	 	<li><p class="l name">查询类型: <p class="l in"> <select class="config_ubselect" v-model="v3"><option disabled value="">请选择</option><option value="1">模糊查询</option><option value="2">树形下拉菜单</option><option value="3">键值下拉菜单</option><option value="4">时间选择下拉框 </option><option value="6">是、否下拉选择 </option><option value="7">数字型输入框 </option></select></p></p></li>
   	 	<li><p class="l name">查询关联字段: <p class="l in"> <input v-model="v4"></p></p></li>
   	 	<li><p class="l name">下拉数据源: <p class="l in"> <input v-model="v5"></p></p></li>
   	 	<li><p class="l name">下拉显示内容: <p class="l in"> <input v-model="v6"></p></p></li>
   	 	<li><p class="l name">下拉绑定字段: <p class="l in"> <input v-model="v7"></p></p></li>
   	 
   	 </ul>  	
   </section> 
  <span slot="footer" class="dialog-footer">
    <el-button @click="btn_Close03">取 消</el-button>
    <el-button type="primary" @click="add_jd_id02">确 定</el-button>
  </span>
</el-dialog>

<!--弹出框3-->		
		
  </div>
</template>



<style>
.config_info_ghbr .config_layer{ background: url(../../static/image/admin/pop_bg_1.png) no-repeat; }
.config_info_ghbr .config_layer02{ background: url(../../static/image/admin/btn3.png) no-repeat; }


.config_info_ghbr .xi_context{ height: 168px;}
.config_info_ghbr .xi_context02{ height: 320px;}
.config_info_ghbr .xi_context ul li{ width: 50%; float: left; height: 50px;}
.config_info_ghbr .xi_context ul li p{ height: 39px; line-height: 39px;}
.config_info_ghbr .xi_context ul li p.name{ width: 105px; color:#F1F1F2; text-align: right; margin-right: 5px;}
.config_info_ghbr .xi_context ul li p.in input{ width: 160px; border: solid 1px #05679E;height: 37px; background: #18406B; color: #fff; text-indent: 5px; }
.config_info_ghbr .config_ubselect{ width: 160px; height: 37px; border: solid 1px #05679E; background:  #18406B; color: #fff; }


</style>


<script>

import * as comm from '../../assets/js/pro_common';	
 export default {
      data() {
        return {
          active:0,////用于显示隐藏及当前高亮
          dialogVisible02: false,//弹出框2
          dialogVisible03: false,//弹出框3
          paregetID:'',//父组件点击传过来的id,通用配置表GUID
          id01:"",//用于修改字段配置当前保存的id
          data01:[],//字段配置数据
          add_edit_type:"",//字段配置--点击增加或修改按钮
          
          a1:"",//配置名称
          a2:"",//字段名
          a3:"",//字段显示名称
          a4:"",//显示长度
          a5:"",//是否主键
          a6:"", //主键方式:
          a7:"",//是否必填
          a8:"",//是否编辑
          a9:"",//是否显示
          a10:"",//存储字段
          a11:"",//编辑类型
          a12:"",//字段排序
          a13:"",//数据源
          
          
          /*查询配置  -table2*/
          id02:"",//用于修改查询配置当前保存的id
          data02:[],//查询配置-数据,
          Newadd_edit_type:"",//用于控制点击是新增还是修改
          v1:"", //查询配置 -配置名称
          v2:"", //查询配置 -查询名称
          v3:"", //查询配置 -查询类型(1 模糊查询 2直接查询)
          v4:"", //查询配置 -查询关联字段
          v5:"", //查询配置 -下拉数据源
          v6:"", //查询配置 -下拉显示内容
          v7:"", //查询配置 -下拉绑定字段
        }
      },
      methods: {
      	change(x){ //用于显示隐藏及当前高亮
      		this.active=x
      	},     	
      	handleClose02(done) { 
      	 this.a1="";this.a2="";this.a3="";this.a4="";this.a5="";this.a6="";this.a7="";this.a8="";this.a9="";this.a10="";this.a11="";this.a12="";this.a13="";this.id01="";
      	 this.add_edit_type="";//字段配置--点击增加或修改按钮
      	 this.dialogVisible02 = false
        done();
        },
        btn_Close02(){ //点击弹出框取消按钮
        	this.a1="";this.a2="";this.a3="";this.a4="";this.a5="";this.a6="";this.a7="";this.a8="";this.a9="";this.a10="";this.a11="";this.a12="";this.a13="";this.id01="";
        	this.add_edit_type="";//字段配置--点击增加或修改按钮
        	this.dialogVisible02 = false
        },

        handleClose03(done) { 
         this.v1="";this.v2="";this.v3="";this.v4="";this.v5="";this.v6="";this.v7="";
         this.Newadd_edit_type="",//查询配置--点击增加或修改按钮
      	 this.dialogVisible03 = false
        done();
        },
      
       btn_Close03(){ 
       	 this.v1="";this.v2="";this.v3="";this.v4="";this.v5="";this.v6="";this.v7="";
       	 this.Newadd_edit_type="",//查询配置--点击增加或修改按钮
      	 this.dialogVisible03 = false
       },
      
      
      add_jd_id(){ //增加和修改字段配置-点击按钮

      	let FAction_url="AddFieldConfig"
      	if(this.add_edit_type=="修改"){
      		FAction_url="UpdateFieldConfig"
      	}
      	
       	  let _this=this;
  		    _this.$axios.post(_this.mypro+'Caiot/System',{
					 "FTokenID":localStorage.getItem("Token"),
					 "FAction":FAction_url,
					 "FVersion":"1.0.0",
					 "mTFieldConfig":{
					 	"FUniversalConfigGUID":_this.paregetID,
					 	"FConfigName":_this.a1,
					 	"FFieldName":_this.a2,
					 	"FShowFieldName":_this.a3,
					 	"FShowLen":_this.a4,
					 	"FIsPrimaryKey":_this.a5,
					 	"FPrimaryKeyWay":_this.a6,
					 	"FIsRequiredFill":_this.a7,
					 	"FIsEdit":_this.a8,
					 	"FIsShow":_this.a9,
					 	"FSaveField":_this.a10,
					 	"FEditType":_this.a11,
					 	"FSortID":_this.a12,
					 	"FDropdownDataSource":_this.a13?_this.a13:"",
					 	"FGUID":_this.id01, //用于字段配置修改按钮
					 },
                    
				    }).then(function(jsons){
						 console.log(jsons.data)   
            if(jsons.data.Result=="200"){
            	_this.getData01() //重新回调取数据
            	_this.btn_Close02() //清空数据，避免增加时保留数据
							  _this.$message({
			             type: 'success',
			             message: '成功!'
			           });
						}else{
						  _this.$message.error('失败！');
						}
						
							_this.dialogVisible02 = false
					 //   _this.getData01(_this.paregetID)//回调数据
					 
					}).catch(function(err){
							
				});
      	
      },
      dele_items(id){ //字段配置-点击删除 按钮
      	let _this=this;
       	this.$confirm('删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
          _this.$axios.post(_this.mypro+'Caiot/System',{
						        "FTokenID":localStorage.getItem("Token"),
						        "FAction":"DeleteFieldConfig",
						        "FVersion":"1.0.0",
						        "FGUID":id ,
							}).then(function(jsons){
								console.log(jsons.data)
							   if(jsons.data.Result=="200"){
							   	 _this.$message({
			               type: 'success',
			               message: '删除成功!'
			             });
							   }else{
							   	  _this.$message.error('删除失败！');
							   }
							
							 _this.getData01(_this.paregetID)	
							}).catch(function(err){
							    
							});
         
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
       	
       	
      },
      edit_data01(...item){ //修改配置字段
      	this.dialogVisible02 = true
      	this.id01=item[0];  //修改点击-当前的id
      	this.a1=item[1];    //配置名称
      	this.a2=item[2];    //字段名称
      	this.a3=item[3];    //字段显示名称
      	this.a4=item[4];    //显示长度
      	this.a5=item[5];    //是否主键
      	this.a6=item[6];    //主键方式
      	this.a7=item[7];    //是否必填
      	this.a8=item[8];    //是否编辑
      	this.a9=item[9];    //是否显示
      	this.a10=item[10];  //存储字段
      	this.a11=item[11];  //编辑类型
      	this.a12=item[12];  //排序ID
      	this.a13=item[13];  //数据源
      	this.add_edit_type="修改";
      },
      
       getData01(x){ //字段配置
       	//this.paregetID=x; //传过来的通用配置id
       	let _this=this;
  		  _this.$axios.post(_this.mypro+'Caiot/System',{
					 "FTokenID":localStorage.getItem("Token"),
					 "FAction":"QueryFieldConfig",
					 "FVersion":"1.0.0",
					 "FUniversalConfigGUID":this.paregetID,
                    
				    }).then(function(jsons){
					       console.log(jsons.data.FObject)   
                 _this.data01=jsons.data.FObject
								
					}).catch(function(err){
							
				});
       },
  /*-----------------------end of table1----------*/  
  
      start_gdata(x){     //父组件传过来的通用配置表id
      	this.paregetID=x;//先把通用配置表id付给变量，以后取都不用传参
      	this.getData01()//取 字段配置
      	this.getData02()//取 查询配置
      },
       
       
       
       
  /*-----------------------table2----------*/     
       
      getData02(){ //查询配置-点击切换按钮
      	let _this=this;
      //	console.log(_this.paregetID)
  		  _this.$axios.post(_this.mypro+'Caiot/System',{
					 "FTokenID":localStorage.getItem("Token"),
					 "FAction":"QueryTQueryConfig",
					 "FVersion":"1.0.0",
					 "FGUID":_this.paregetID, //取通用配置表的id
                    
				    }).then(function(jsons){
						   //console.log(jsons.data.FObject)   
                _this.data02=jsons.data.FObject
								
					}).catch(function(err){
							
				});
      	
      	
      },
      edit_data02(...item){ //修改 -查询配置
      	this.dialogVisible03 = true
      	this.id02=item[0]; //修改点击-当前的id
      	this.v1=item[1];    //配置名称
      	this.v2=item[2];    //查询名称
      	this.v3=item[3];    //查询类型(1 模糊查询 2直接查询)
      	this.v4=item[4];    //查询关联字段
      	this.v5=item[5];    //下拉数据源
        this.v6=item[6];    //下拉显示内容
        this.v7=item[7];    //下拉绑定字段
      	this.Newadd_edit_type="修改";
      },
       
       dele_items02(id){
       		let _this=this;
       	this.$confirm('删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
          _this.$axios.post(_this.mypro+'Caiot/System',{
						        "FTokenID":localStorage.getItem("Token"),
						        "FAction":"DeleteTQueryConfig",
						        "FVersion":"1.0.0",
						        "FGUID":id ,
							}).then(function(jsons){
								console.log(jsons.data)
							   if(jsons.data.Result=="200"){
							   	 _this.$message({
			               type: 'success',
			               message: '删除成功!'
			             });
							   }else{
							   	  _this.$message.error('删除失败！');
							   }
							
							 _this.getData02()	
							}).catch(function(err){
							    
							});
         
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
       	
       	
       	
       	
       },
       
       
       
      add_jd_id02(){//查询配置--增加或编辑按钮
      	/*if(this.v1==""||this.v2==""||this.v3==""||this.v4==""||this.v5==""||this.v6==""||this.v7==""){
      		this.$message({
		          message: '请填写完整信息',
		          type: 'warning'
		        });
		        return false
         }*/
      	
      	
        let _this=this;
      	let EDFAction_url="AddTQueryConfig"
      	if(this.Newadd_edit_type=="修改"){
      		EDFAction_url="UpdateTQueryConfig"
      	}
      	
      	  _this.$axios.post(_this.mypro+'Caiot/System',{
					 "FTokenID":localStorage.getItem("Token"),
					 "FAction":EDFAction_url,
					 "FVersion":"1.0.0",
					 "mTQueryConfig":{
					 	 "FUniversalConfigGUID":_this.paregetID, //取通用配置表的id
					 	 "FConfigName":_this.v1,
					 	 "FQueryName":_this.v2,
					 	 "FQueryType":_this.v3,
					 	 "FQueryField":_this.v4,
					 	 "FDropdownDataSource":_this.v5,
					 	 "FDropdownShowValue":_this.v6,
					 	 "FDropdownField":_this.v7,
					 	 "FGUID":_this.id02,
			 	 
					 },
                    
				    }).then(function(jsons){
						//   console.log(jsons.data.FObject)                 
		            if(jsons.data.Result=="200"){
		            	  _this.getData02() //重新回调取数据
		            	  _this.btn_Close03() //清空数据，避免增加时保留数据
									  _this.$message({
					             type: 'success',
					             message: '成功!'
					           });
								}else{
								  _this.$message.error('失败！');
								}
								
									_this.dialogVisible03 = false
							 
							 
              
              
								
					}).catch(function(err){
							
				});
       	 
      	
      	
      },
       
        	
  },
	created(){
		    
	},
	mounted:function(){
		    let _this=this;
			  setTimeout(function(){_this.getData02() }, 500)
				
	},
    }

</script>
<style>
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


.config_info_ghbr .item_b { height: 377px; padding: 45px 0 0 0;  }
.config_info_ghbr .item_b .a_btn{ height: 46px;}
.config_info_ghbr .item_b .a_btn  .btns{ width: 137px; height: 46px; line-height: 46px; float: left;  text-align: center;  background: url(/static/image/task/t2.png)  no-repeat 0px 0px; margin-right: 5px;   cursor: pointer;}
.config_info_ghbr .item_b .a_btn  .currnt{background: url(/static/image/task/t1.png)  no-repeat 0px 0px;}

.config_info_ghbr .item_b .contexts{ height: 330px; border: solid 2px #0E3270;}
.config_info_ghbr .item_b .contexts .btn_l{ height: 46px; padding: 15px 15px;}
.config_info_ghbr .item_b .contexts .btn_l .hgn{width: 88px; height: 46px; line-height: 46px; float: left;  text-align: center; opacity: 0.9; margin-right: 10px; text-indent: 10px; cursor: pointer;}
.config_info_ghbr .item_b .contexts .btn_l .p1{ background: url(/static/image/admin/added.png) #042E74 no-repeat 10px 13px;}
.config_info_ghbr .item_b .contexts .btn_l .p1:hover{ background: url(/static/image/admin/added.png) #0a3c7b no-repeat 10px 13px;}

.config_info_ghbr .item_b .contexts .btn_l .p2{ background: url(/static/image/admin/lead-in.png) #042E74 no-repeat 10px 13px;}
.config_info_ghbr .item_b .contexts .btn_l .p2:hover{ background: url(/static/image/admin/lead-in.png) #0a3c7b no-repeat 10px 13px;}

.config_info_ghbr .item_b .contexts .ulitem{ height: 250px;border-top: solid 2px #0E3270;}
.config_info_ghbr .item_b .contexts .ulitem ul.titles{ height: 46px; padding: 10px 0; font-size: 17px;}
.config_info_ghbr .item_b .contexts .ulitem ul.titles li{ float: left; line-height: 46px; width:7.4%; text-align: center;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
.config_info_ghbr .item_b .contexts .ulitem ul.titles02 li{ float: left; line-height: 46px; width: 12.5%; text-align: center;}
.config_info_ghbr .item_b .contexts .ulitem .pj_ul{ height: 180px; overflow: auto;}
.config_info_ghbr .item_b .contexts .ulitem .pj_ul ul{ height: 45px;;}
.config_info_ghbr .item_b .contexts .ulitem .pj_ul ul li{ line-height: 45px; float: left;width: 7.5%; overflow: hidden; height: 45px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
.config_info_ghbr .item_b .contexts .ulitem .pj_ul02 ul li{ line-height: 45px; float: left;width: 12.5%;}


.config_info_ghbr .item_b .contexts .pj_ul  ul:nth-child(odd){background-color: #0a3c7b;}
.config_info_ghbr .item_b .contexts .pj_ul  ul:nth-child(even){background-color: #062b62;}
.config_info_ghbr .item_b .contexts .pj_ul  ul:hover{ background: #134FA4;}

.config_info_ghbr .ccontr{ display: none;}
.config_info_ghbr .ishow{ display: block;}
.config_info_ghbr ul li.edit span{ padding: 0 8px;}

</style>
