<template>
    <div class="echarts-map height-100"> 
<!--         <ul class="level">
            <li :class="{'active':activeLevel.FLevel==item.FLevel}" v-for="(item,i) in levelArr" @click="changeLevel(item)" :key="i">
                {{item.FLevelName}}
            </li>
        </ul> -->
        <el-button v-if="mapDataStack.length>0" @click="back()">返回</el-button>
        <div class="slect-block" v-if="block&&block.FSimpleName">
            <i class="iconfont icon-Positioning1"></i>
           {{block.FSimpleName}}
        </div>
        <div class="height-100" :id="id">

        </div>
    </div>
</template>
<script>
//引入uuid文件
import uuidv1 from 'uuid/v1'
import axios from 'axios'
const myMap = {
}
const url = 'http://47.107.224.8/mapJson/'
import provinceTree from '@/mapJson/provinceList.json'
export default {
    data(){
        return{
            id:"",
            levelArr:[], //行政架构等级
            activeLevel:{}, //当前选中的架构等级
            myChart:null,
            provinceData:null,
            projectList:[],
            areaArr:[],
            mapDataStack:[], //保存地图数据。用栈存储下钻数据
            userType:sessionStorage.getItem('FUserType'),
            activeArea:null,
            checkedLevel:[],
            checkedLevelList:[]
        }
    },
    props:{
        block:{
            type:Object
        }
    },
    async created(){
        this.id = uuidv1()
        await this.queryProvinceData()
        await this.queryAllProvince()
        /* this.queryMapData() */
        this.$emit('ready')
    },
    methods:{
        /**
         * 切换行政架构
         * @param {Object} level 行政架构等级
         */
        changeLevel(level){
            this.queryMapData()
            this.$emit('change',level)
        },
        /**
         * 获取所有省份数据
         */
        queryProvinceData(){
            return new Promise((resolve,reject) => {
                axios.get(url+'province.json')
                .then((result) => {
                    let province = result.data
                    province.forEach(item => {
                        myMap[item.id] = item.jsonName
                    })
                    resolve()
                }).catch((err) => {
                    reject(err)
                    console.log(err)
                });
            })
        },
        /**
         * 获取所有省份的边界经纬度
         */
        queryAllProvince(){
            return new Promise((resolve,reject) => {
                axios.get(url+'allCity.json')
                .then((result) => {
                    this.provinceData = result.data
                    resolve()
                }).catch((err) => {
                    reject(err)
                });
            })
        },
        /**
         * 229.行政架构等级--查询行政架构等级
         */
        queryMainDBTORGLevel(id){
            return this.$post('QueryMainDBTORGLevel',{FORGGroupGUID:id})
        },
        /**
         * 获取已配置地图数据
         */
        async queryMapData(id = ''){
            let result = await this.queryMainDBTORGLevel(id)
            let levelArr = result.FObject || []
            levelArr.pop()
            levelArr.shift()
            this.checkedLevel = levelArr.filter(item => item.IsExit).map(item => item.FLevel)
            this.$post('QueryMainTORGNodeArea',{
                IDStr: '',
                FORGGroupGUID:id
            })
            .then((result) => {
                let response = result.FObject
                this.projectList = response.ProjectData
                this.$nextTick(async() => {
                    if(!this.myChart){
                      var dom = document.getElementById(this.id);
                      this.myChart = echarts.init(dom);
                    }
                    this.myChart.showLoading({
                        text: '数据正在努力加载...',
                        textStyle: { fontSize : 30 , color: '#444' },
                        effectOption: {backgroundColor: 'rgba(0, 0, 0, 0)'}
                    });
                    let data = response.ListData
                    let checkedLevelObj = {
                        1:[...data],
                        2:[],
                        3:[]
                    }
                    data.forEach(area => {
                        area.ListData.forEach(item => {
                            checkedLevelObj[2].push(item)
                            let province = provinceTree.find(obj => obj.id==item.FAreaCode)
                            if(province.children){
                                let children = province.children.map(city => {
                                    return {
                                        "FAreaName": city.name,
                                        "FParentCode": item.FAreaCode,
                                        "FAreaLevel": 3,
                                        "FAreaCode": city.id,
                                        "FParentName": item.FAreaName,
                                        "GrandParentCode":area.FAreaCode
                                    }
                                })
                                checkedLevelObj[3].push(...children)
                            }else{
                                checkedLevelObj[3].push(item)
                            }
                        
                        })
                    })

                    /* this.showMapByArea(checkedLevel)  */
                    /** 只有集团跟项目（行政架构） */
                    if(!this.checkedLevel.includes(1)){
                        checkedLevelObj[1] = null
                    }
                    if(!this.checkedLevel.includes(2)){
                        checkedLevelObj[2] = null
                    }
                    if(!this.checkedLevel.includes(3)){
                        checkedLevelObj[3] = null
                    }
                    let checkedLevelList = []
                    let i = 1
                    while(i<4){
                        if(checkedLevelObj[i]){
                            checkedLevelList.push(checkedLevelObj[i])
                        }
                        i++
                    }
                    this.checkedLevelList = checkedLevelList
                    if(checkedLevelList[0]){
                        this.handleAreaData(checkedLevelList[0])
                        .then((mapData) => {
                            this.showMapByArea(mapData)
                        }).catch((err) => {
                            console.log('err',err)
                        });
                    }else{
                        this.showMap([],this.projectList)
                    }
                })
            }).catch((err) => {
                console.log(err,'33')
            });
        },
        async getAllCityData(){
            let mapArr = []
            for(let key in myMap){
                await axios.get(url+`${myMap[key]}.json`)
                .then((result) => {
                      let citys = result.data.features
                      mapArr.push(...citys)
                }).catch((err) => {
                    console.log('错误',err);
                });
            }
            return Promise.resolve(mapArr)

        },
        /**
         * 处理分区数据
         */
        async handleAreaData(areaArr){
            let mapArr = []
            for(let i =0;i<areaArr.length;i++) {
                let arr = []
                let item = areaArr[i]
                if(item.FAreaLevel==1&&item.ListData.length){ //一级是大区
                    item.ListData.forEach(async (json) => {
                        this.provinceData.features.forEach(obj => {
                            if(obj.properties.id == json.FAreaCode){
                                if(obj.geometry.type === 'MultiPolygon'){ //如果是四维数组
                                    arr.push(...obj.geometry.coordinates)
                                }else{                                  //三维数组
                                    arr.push(obj.geometry.coordinates)
                                }
                            }
                        })
                    })
                    mapArr.push({
                        "type": "Feature",
                        "properties": {
                          "name": item.FAreaName,
                          "childNum":arr.length
                        },
                        "geometry": {
                          "type": "MultiPolygon",
                          "coordinates":arr,
                        },
                        self:item
                    })
                }else if(item.FAreaLevel == 2){ //二级是省份或直辖市
                    item.ProjectCount = this.projectList.filter(obj => obj.FAreaCode.slice(0,2) ==item.FAreaCode.slice(0,2)).length
                    this.provinceData.features.forEach(obj => {
                        if(obj.properties.id == item.FAreaCode){
                            if(obj.geometry.type === 'MultiPolygon'){ //如果是四维数组
                                arr.push(...obj.geometry.coordinates)
                            }else{                                  //三维数组
                                arr.push(obj.geometry.coordinates)
                            }
                        }
                    })
                    mapArr.push({
                        "type": "Feature",
                        "properties": {
                          "name": item.FAreaName,
                          "childNum":arr.length
                        },
                        "geometry": {
                          "type": "MultiPolygon",
                          "coordinates":arr,
                        },
                        self:item
                    })
                }else{ //三级城市
                    await axios.get(url+`${myMap[item.FParentCode]}.json`)
                    .then((result) => {
                          let citys = result.data.features
                          citys.forEach(city => {
                              for(let j = i;j<areaArr.length;j++){
                                  if(city.properties.adcode == areaArr[j].FAreaCode){
                                    areaArr[j].ProjectCount = this.projectList.filter(obj => obj.FAreaCode ==areaArr[j].FAreaCode).length
                                    mapArr.push(
                                        {
                                            ...city,
                                            self:areaArr[j]
                                        }
                                    )
                                    areaArr.splice(j,1)
                                    j--
                                  }
                              }
                          })
                    }).catch((err) => {
                        console.log('错误',err);
                    });
                    i--
                }
            }
            return Promise.resolve(mapArr)
        },
        /**
         * 渲染地图
         * @param {Array} mapArr 地图数据
         */
        showMapByArea(mapArr){
          this.myChart.hideLoading();
          let obj = {
            "type": "FeatureCollection",
            "features":mapArr
          }
          console.log(mapArr)
          this.activeArea = mapArr
          echarts.registerMap('china1',obj)
          if(!this.myChart){
            var dom = document.getElementById(this.id);
            this.myChart = echarts.init(dom);
          }else{
              this.myChart.off('click')
          }
          var app = {};
          var option = null;
          option = {
              tooltip: {
                  trigger: 'item',
              },
              legend: {
                  show:true,
                  itemHeight:50,
                  icon : 'triangle',//图例的形状
              },
              visualMap: {
                  show:true,
                  min: 0,
                  max: 10,
                  left: 'left',
                  top: 'center',
                  text: ['高','低'],           // 文本，默认为数值文本
                  calculable: true,
                  symbolSize:50,
                  splitList: [   
                        {start: 0, end: 100},  
                  ],  
                  color: ['#5475f5', '#9feaa5']  
              },
          	  dataRange: {
                  show:false,
                  orient: 'horizontal',
                  min: 0,
                  max: 100,
                  text: ['高', '低'],           // 文本，默认为数值文本
                  splitList: [   
                   {start: 0, end: 50},
                   {start: 50, end: 100},    
                  ],  
                  splitNumber: 0,
                  color: ['#001869', '#001869']  
              },
              color:['red'],
              animationDuration:1000,
	          animationEasing:'cubicOut',
	          animationDurationUpdate:1000,
              series: [
                    {
                        name: '',
                        type: 'map',
                        map: 'china1',
                        roam:true,
                        symbol: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
                        data:mapArr.map(item => {return {name:item.self&&item.self.FAreaName,id:item.self&&item.self.FGUID,value:item.self&&item.self.ProjectCount||0,self:item.self}}),
                        selectedMode:'single',
                        showLegendSymbol:false,
                        label: {
                            normal: {
                                color:'white',
                                /* formatter: '{b}\n项目:{c}个', */
                                formatter:data => {
                                    if(data.value>0){
                                        console.log(data);
                                        return data.name + '\n' +`项目：${data.value}`
                                    }else{
                                        return ''
                                    }
                                },
                                position: 'right',
                                show: true,
                                lineHeight: 20,
                            },
                            emphasis: {
                                color:'white',
                                show: true,
                                fontSize:'18'
                            }
                        },
                        zoom:1.2,
                        itemStyle: {
                            normal: {
                                areaColor: '#001869',
                                borderColor: '#0E3D94'
                            },
                            emphasis: {
                                areaColor: '#174CFF'
                            }
                        }
                    },
              ]
          };;
          if (option && typeof option === "object") {
              this.myChart.setOption(option, true);
          }
            this.myChart.on('click',async (params) => {
                console.log('选择区域',params)
                let len = this.mapDataStack.length
                let data = params.data.self
                if(this.checkedLevel[len+1] == 2){
                    this.handleAreaData(data.ListData)
                    .then((mapData) => {
                        console.log('省份',mapData)
                        this.showMapByArea(mapData)
                        this.mapDataStack.push(mapArr)
                    }).catch((err) => {
                    });
                }else if(this.checkedLevel[len+1] == 3){
                    let arr = this.checkedLevelList[len+1],
                    listData = arr.filter(item => item.FParentCode == data.FAreaCode||item.GrandParentCode == data.FAreaCode)
                    this.handleAreaData(listData)
                    .then((mapData) => {
                        console.log('城市',mapData)
                        this.showMapByArea(mapData)
                        this.mapDataStack.push(mapArr)
                    }).catch((err) => {
                        console.log(err)
                    });
                }else{
                    if(data){
                        this.handleAreaData([data])
                        .then((mapData) => {
                            this.showMap(mapData,this.projectList)
                            this.mapDataStack.push(mapArr)
                        }).catch((err) => {
                            
                        });
                    }
                    console.log('最后一级')
                }
            });
        },
        back(){
            let mapData = this.mapDataStack.pop()
            if(mapData){
                this.showMapByArea(mapData)
                this.$emit('click-area',mapData[0].self.FParentCode)
            }
        },
        /**
         * 显示map
         */
        async showMap(data,projects){
            /* console.log(projects.map(item => { return {name:item.FProjectName, value:[obj.FProjectlng,obj.FProjectlat]} })) */
          this.myChart.hideLoading();
          if(data.length>0){
            let obj = {
              "type": "FeatureCollection",
              "features":data
            }
            echarts.registerMap('china2',obj)
          }else{
              let obj = this.provinceData
              echarts.registerMap('china2',obj)
          }
          if(!this.myChart){
            var dom = document.getElementById(this.id);
            this.myChart = echarts.init(dom);
          }else{
              this.myChart.off('click')
          }
          var app = {};
          var option = null;
          option = {
              tooltip: {
                  trigger: 'item',
              },
              legend: {
                  show:false,
                  
              },
              animationDuration:1000,
	          animationEasing:'cubicOut',
	          animationDurationUpdate:1000,
              visualMap: {
                  show:true,
                  min: 0,
                  max: 2500,
                  left: 'left',
                  top: 'center',
                  text: ['高','低'],           // 文本，默认为数值文本
                  calculable: true,
                  splitList: [   
                      {start: 500, end:600},{start: 400, end: 500},  
                      {start: 300, end: 400},{start: 200, end: 300},  
                      {start: 100, end: 200},{start: 0, end: 100},  
                  ],  
                  color: ['#5475f5', '#9feaa5', '#85daef','#74e2ca', '#e6ac53', '#9fb5ea']  
              },
          	dataRange: {
                  show:false,
                  orient: 'horizontal',
                  min: 0,
                  max: 55000,
                  text: ['高', '低'],           // 文本，默认为数值文本
                  splitList: [   
                    {start: 500, end:600},{start: 400, end: 500},  
                    {start: 300, end: 400},{start: 200, end: 300},  
                    {start: 100, end: 200},{start: 0, end: 100},  
                  ],  
                  splitNumber: 0,
                  color: ['#5475f5', '#9feaa5', '#85daef','#74e2ca', '#e6ac53', '#9fb5ea']  
              },
              geo: {
                  map: 'china2',
                  roam:true,
                  label: {
                    show:false,
                    color:'white',
                    emphasis: {
                        show: true,
                        color:'white',
                    }
                  },
                  regions:[{
                      name:'南海诸岛',
                      label:{
                          show:false
                      },
                      itemStyle:{
                          opacity:0
                      }
                  }],
                  zoom:1.2,
                  itemStyle: {
                      normal: {
                          areaColor: '#001869',
                          borderColor: '#0E3D94'
                      },
                      emphasis: {
                          areaColor: '#174CFF'
                      }
                  }
              },
              series: [
                    {
                        name: '',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data:projects.map(item => { return {name:item.FProjectName, value:[item.FProjectlng,item.FProjectlat],data:item} }),
                        symbol:'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAdCAYAAACqhkzFAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMzSURBVEhLzZX5U1JRFMchtVWn1QUds82QcC0XltgERlniiU9CEcSHySKglc3YWNNMm1rRoi0uOY5N/Z/fzn2Ygb6hyF/64QO8w7kf7j333IusrCoOeUUIsrMTkNVMQV6bJBI4VEufFTvUJHbjMkWc8mgMixGyvZScikDGhOcmKTmZhcTil9X0LrKTrCBEKYPijFwZo0SRgpxmJ6+O0mzoV/ewb8CfKFPOo6HNj6FAJwZGTOACA4gkPHD5B9FtH0a1WkBpHVumxGApjrUvoN3MYyrVhEisE+n7dmysG7G8bMCbjBHPFywYnbiFurZxqutfiMt73qPD6kd6pgm+oBaBCTfW14z4vt2zy8eVm4imHbjcNSYtyaVCv4I22yhSMyr0e43o5XgsvbbmCRmrX3QYi7mh1IRw4mJUWsao0C+jzRpAalqFXrcF180jePi4b5+Q8eGDAdOzfXDdHsQN6whU+iAudoapHAKOnI9lheVdGbSafSRsgslhRWN3CPEZF3582y/8xeaGFq9emzD32IbEXQfCNHNFi5AVHlM/RYvei2RaCaPThvp2AaFJT0GhFO2WAEpYN5Q2zKJZ40EypYTJZUVtqwBfeEByUCF6uSGUX6LDIa+OQ60lIc3QTEJFswA+VLyQH+NQeY1OnaxykoQcklRDo8Mm1sIvcEUvOZpy4HxHmAmjUOuyQkO/Tdy1yXThTZFi/okNKl2QhFWxXaGTN6GP55F5Z8lL3ljX4SuxvaXJi+fCWqrbPkJCVkMd1ZCEo4IG43E3llcsyLw14uWiGXOPbBiOeETYs5SMsbWpRf8QT0K6237NMBjRwu7l4Q3ycPu9MHt8UFPzHqWmPVwfo9ggFpfM+PxJj7VVHdbo9Hz5rBdZp2dfmGPCRM6SDTh5ZadBJTijnIDO4RcbOT7jEM+3kHAhMuWiBu+HhfPlC11DepxqpJ3aIyoK9vL/C6908UikVLBzRhy/QN2+N6komiMwOFyYfaDCcFiPqz0BnL5659/+TxhjsVt0/5mQedOBZy80SN7rg83r+32/FUuUjll61knb7iRZFiddoEcbCtzKhZAMHgTJ4EGQDB4EyeA/k8BPtvcXUxtnVqUAAAAASUVORK5CYII=',
                        symbolSize:20,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                color:'white',
                                fontSize:16,
                                show: true
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#ddb926',
                                shadowBlur: 0,
                                shadowColor: '#e63f3f'
                            }
                        }
                    },
              ],
              tooltip:{
                formatter: '{b}',
              }
          };;
          if (option && typeof option === "object") {
              this.myChart.setOption(option, true);
          }
          this.myChart.on('click', function (params) {   
                   console.log(params);
                   let data = params.data.data
                   if(data){
                       let token = sessionStorage.getItem('FToken')
                       window.open(`https://www.szqianren.com/#/monitoring/systemBrowse?token=${token}&projectID=${data.ProjectID}&showMenu=2`)
                   }
          });
        },
    }
}
</script>
<style lang="scss">
.echarts-map{
    position:relative;
    .el-button{
        position: absolute;
        left: 30px;
        top: 50px;
        z-index: 100;
        color: white;
        background: rgba(84,177,221,.22);
        border: none;
    }
    .slect-block{
        width: 244px;
        height: 54px;
        padding-left: 14px;
        line-height: 54px;
        background: rgba(42, 145, 252, 0.2);
        position: absolute;
        z-index: 100;
        bottom: 50px;
        left: 30px;
        border-radius: 10px;
        text-align: left;
        font-size: 18px;
    }
    ul.level{
        position:absolute;
        z-index: 100;
        top:40px;
        left: 50%;
        transform:translateX(-50%);
        li{
            width:60px;
            height:44px;
            line-height:44px;
            border:1px solid #8F9CBF;
            display: inline-block;
            box-sizing:border-box;
            cursor: pointer;
        }
        li:first-of-type{
            border-radius: 4px 0 0 4px;
        }
        li:last-of-type{
            border-radius:0 4px 4px 0;
        }
        li+li{
            border-left: none;
        }
        li.active{
            background:rgba(8,148,199,1);
            border-color:rgba(8,148,199,1);
        }
    }
}
</style>