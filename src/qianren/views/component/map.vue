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
import echarts from 'echarts'
import axios from 'axios'
const myMap = {
}
const url = 'http://47.107.224.8/mapJson/'
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
        }
    },
    props:{
        block:{
            type:Object
        }
    },
    async created(){
        this.id = uuidv1()
        await this.queryMainDBTORGLevel()
        this.queryProvinceData()
        this.queryAllProvince()
        this.queryMapData()
    },
    methods:{
        /**
         * 229.行政架构等级--查询行政架构等级
         */
        queryMainDBTORGLevel(){
            return new Promise((resolve,reject) => {
                this.$post('/QueryMainDBTORGLevel',{
                    FORGGroupGUID: '',
                })
                .then((result) => {
                    this.levelArr = result.FObject || []
                    this.levelArr.sort((a,b) => a.FLevel - b.FLevel)
                    this.activeLevel = this.levelArr[0]||{}
                    this.$emit('ready1',this.activeLevel)
                    resolve()
                }).catch((err) => {
                    console.log(err);
                    reject()
                });
            })
        },
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
            axios.get(url+'province.json')
            .then((result) => {
                let province = result.data
                province.forEach(item => {
                    myMap[item.id] = item.jsonName
                })

            }).catch((err) => {
                console.log(err)
            });
        },
        /**
         * 获取所有省份的边界经纬度
         */
        queryAllProvince(){
            axios.get(url+'allCity.json')
            .then((result) => {
                this.provinceData = result.data

            }).catch((err) => {
                console.log(err)
            });
        },
        /**
         * 获取已配置地图数据
         */
        queryMapData(id = ''){
            this.$post('/QueryMainTORGNodeArea',{
                IDStr: '',
                FORGGroupGUID:id
            })
            .then((result) => {
                let response = result.FObject
                this.projectList = response.ProjectData
                console.log(result.FObject.ListData);
                this.$nextTick(() => {
                    if(!this.myChart){
                      var dom = document.getElementById(this.id);
                      console.log(this.id);
                      this.myChart = echarts.init(dom);
                    }
                    this.myChart.showLoading({
                        text: '数据正在努力加载...',
                        textStyle: { fontSize : 30 , color: '#444' },
                        effectOption: {backgroundColor: 'rgba(0, 0, 0, 0)'}
                    }); 
                    if(response.ListData.length>0){
                        let data = response.ListData
                        if(data[0].FParentCode == 0){
                            let mapData = this.handleAreaData(data)
                            this.showMapByArea(mapData)
                        }else if(myMap[data[0].FParentCode]&&data.length == 1){
                            this.handleAreaData1(data[0])
                            .then((mapArr) => {
                                this.showMap(mapArr,this.projectList)
                            }).catch((err) => {
                                
                            });
                        }else if(myMap[data[0].FParentCode]&&data.length > 1){
                            this.handleAreaData1(data)
                            .then((mapData) => {
                                this.showMapByArea(mapData)
                            }).catch((err) => {
                                
                            });
                        }
                    }else{
                        this.showMap([],this.projectList)
                    }
                })
            }).catch((err) => {
                console.log(err,'33')
            });
        },
        /**
         * 处理分区数据
         */
        handleAreaData(areaArr){
            let mapArr = areaArr.map(item => {
                let arr = []
                if(item.ListData.length){
                    item.ListData.forEach(async (json) => {
                      if(json.FAreaLevel == 2){
                            this.provinceData.features.forEach(obj => {
                                if(obj.properties.id == json.FAreaCode){
                                    if(obj.geometry.type === 'MultiPolygon'){ //如果是四维数组
                                        arr.push(...obj.geometry.coordinates)
                                    }else{                                  //三维数组
                                        arr.push(obj.geometry.coordinates)
                                    }
                                }
                            })
                      }else{
                          await axios.get(url+`${myMap[json.FParentCode]}.json`)
                          .then((result) => {
                                let data = result.data
                                data.features.forEach(obj => {
                                    if(obj.properties.adcode == json.FAreaCode){
                                        arr.push(...obj.geometry.coordinates)
                                    }
                                })
                          }).catch((err) => {

                          });
                      }
                    })
                }else if(myMap[item.FAreaCode]){
                    this.provinceData.features.forEach(obj => {
                        if(obj.properties.id == item.FAreaCode){
                            if(obj.geometry.type === 'MultiPolygon'){ //如果是四维数组
                                arr.push(...obj.geometry.coordinates)
                            }else{                                  //三维数组
                                arr.push(obj.geometry.coordinates)
                            }
                        }
                    })
                }
                return {
                    "type": "Feature",
                    "properties": {
                      "name": item.FAreaName,
                      "childNum":2 /* item.ListData.length */
                    },
                    "geometry": {
                      "type": "MultiPolygon",
                      "coordinates":arr,
                    },
                    self:item
                }
            })
            return mapArr
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
                        data:mapArr.map(item => {return {name:item.self.FAreaName,value:item.self.ProjectCount,id:item.self.FGUID,self:item.self}}).concat({ name:"南海诸岛",value:0, itemStyle:{ normal:{opacity:0,label:{show:false}}},label:{show:false},showLegendSymbol:false }),
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
                      let FAreaCode
                     /*  this.queryMapData(params.data.self.FAreaCode) */
                      /* this.$emit('change',) */
                      if(params.data.self.cityData){
                          let projects = this.projectList.filter(item => params.data.self.cityData.properties.adcode == item.FAreaCode)
                          this.showMap([params.data.self.cityData],projects)
                          FAreaCode = params.data.self.cityData.properties.adcode
                      }else if(params.data.self){
                          this.activeArea = params.data.self
                          FAreaCode = params.data.self.FAreaCode
                          let data = this.activeArea.ListData&&this.activeArea.ListData.length?this.activeArea.ListData:this.activeArea
                          this.handleAreaData1(data)
                          .then((mapArr1) => {
                              this.showMapByArea(mapArr1)
                          }).catch((err) => {
                              console.log(err,'err');
                          });
                      }else{
                          await axios.get(url+`${myMap[params.data.self.FAreaCode]}.json`)
                          .then((result) => {
                              let data = result.data
                              this.showMap(data)
                          }).catch((err) => {

                          });
                      }
                      this.mapDataStack.push(mapArr)
                      this.$emit('click-area',FAreaCode)
            });
        },
        async handleAreaData1(data){
            let mapArr = []
            if(Array.isArray(data)){
                for(let i= 0;i<data.length;i++){
                    let json = data[i]
                    json.ProjectCount = this.projectList.filter(item => item.FAreaCode.slice(0,2) ==json.FAreaCode.slice(0,2)).length
                    if(myMap[json.FAreaCode]){
                        this.provinceData.features.forEach(obj => {
                            if(obj.properties.id == json.FAreaCode){
                                obj.self = json
                                mapArr.push(obj)
                            }
                        })
                    }else if(myMap[json.FParentCode]){
                        await axios.get(url+`${myMap[json.FParentCode]}.json`)
                        .then((result) => {
                              let citys = result.data.features
                              citys.forEach(city => {
                                  for(let j=0;j<data.length;j++){
                                      let item = data[j]
                                      if(city.properties.adcode == item.FAreaCode){
                                          let cityData = JSON.parse(JSON.stringify(city))
                                          city.self = {
                                            FAreaName:city.properties.name,
                                            ProjectCount:this.projectList.filter(obj => obj.FAreaCode == city.properties.adcode).length,
                                            FGUID:'00000',
                                            FParentCode:json.FParentCode,
                                            cityData,
                                          }
                                          mapArr.push(city)
                                          data.splice(j,1)
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
            }else{
                if(myMap[data.FAreaCode]){
                    await axios.get(url+`${myMap[data.FAreaCode]}.json`)
                    .then((result) => {
                          mapArr.push(...result.data.features)
                          mapArr.forEach(item => {
                              let cityData = JSON.parse(JSON.stringify(item))
                              item.self = {
                                FAreaName:item.properties.name,
                                ProjectCount:this.projectList.filter(obj => obj.FAreaCode == item.properties.adcode).length,
                                FGUID:'00000',
                                FParentCode:data.FAreaCode,
                                cityData,
                              }
                          })
                    }).catch((err) => {
                        console.log(err);
                    });
                }else if(myMap[data.FParentCode]){
                    await axios.get(url+`${myMap[data.FParentCode]}.json`)
                    .then((result) => {
                         result.data.features.forEach(item => {
                            if(item.properties.adcode == data.FAreaCode){
                                mapArr.push(item)
                            }
                         })
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            }
            return Promise.resolve(mapArr)
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
        showMap(data,projects){
            /* console.log(projects.map(item => { return {name:item.FProjectName, value:[obj.FProjectlng,obj.FProjectlat]} })) */
          this.myChart.hideLoading();
          if(data.length>0){
            let obj = {
              "type": "FeatureCollection",
              "features":data
            }
            echarts.registerMap('china2',obj)
          }else{
              echarts.registerMap('china2',this.provinceData)
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