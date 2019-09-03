<template>
    <div class="echarts-map height-100"> 
<!--         <ul class="level">
            <li :class="{'active':activeLevel.FLevel==item.FLevel}" v-for="(item,i) in levelArr" @click="changeLevel(item)" :key="i">
                {{item.FLevelName}}
            </li>
        </ul> -->
        <div class="height-100" :id="id">

        </div>
    </div>
</template>
<script>
//引入uuid文件
import uuidv1 from 'uuid/v1'
import province from '@/mapJson/province.js'
import theme from '@/mapJson/allCity.js'
import echarts from 'echarts'
const Map = {
}
province.forEach(item => {
    Map[item.id] = item.jsonName
})
export default {
    data(){
        return{
            id:"",
            levelArr:[], //行政架构等级
            activeLevel:{}, //当前选中的架构等级
            myChart:null
        }
    },
    async created(){
        this.id = uuidv1()
        await this.queryMainDBTORGLevel()
        this.queryMapData()
    },
    methods:{
        /**
         * 229.行政架构等级--查询行政架构等级
         */
        queryMainDBTORGLevel(){
            return new Promise((resolve,reject) => {
                this.$post('/QueryMainDBTORGLevel')
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
            this.activeLevel  = level
            this.queryMapData()
            this.$emit('change',level)
        },
        /**
         * 获取已配置地图数据
         */
        queryMapData(){
            this.$post('/QueryMainTORGNodeArea',{
                FLevel:this.activeLevel.FLevel
            })
            .then((result) => {
                console.log(result)
                this.$nextTick(() => {
                    let response = result.FObject
                    if(response.ListData.length>0){
                        let data = response.ListData
                        data.push(...response.ProjectData)
                        this.showMapByArea(data)
                    }else if(response.GroupData.length>0){
                        let data = []
                        response.GroupData.forEach(item => {
                            item.ListData.forEach(obj => {
                                data.push({
                                    name:obj.FSimpleName,
                                    value:[obj.FGrouplng,obj.FGrouplat]
                                })
                            })
                        })
                        this.showMap(data)
                    }else if(response.ProjectData.length>0){
                        let data = []
                        response.ProjectData.forEach(item => {
                            item.ListData.forEach(obj => {
                                data.push({
                                    name:obj.FSimpleName,
                                    value:[obj.FProjectlng,obj.FProjectlat]
                                })
                            })
                        })
                        console.log(data)
                        this.showMap(data)
                    }
                })
            }).catch((err) => {
                console.log(err,'33')
            });
        },
        showMapByArea(areaArr){
            if(this.myChart){
                this.myChart.dispose()
            }
            let mapArr = areaArr.map(item => {
              let arr = []
              if(item.FNodeType == 1){
                item.ListData.forEach(json => {
                  if(json.FAreaLevel == 1){
                      theme.features.forEach(obj => {
                          if(obj.properties.id == json.FAreaCode){
                              if(obj.geometry.type === 'MultiPolygon'){ //如果是四维数组
                                  arr.push(...obj.geometry.coordinates)
                              }else{                                  //三维数组
                                  arr.push(obj.geometry.coordinates)
                              }
                          }
                      })
                  }else{
                      let data = require(`@/mapJson/${Map[json.FParentCode]}.json`)
                      data.features.forEach(obj => {
                          if(obj.properties.adcode == json.FAreaCode){
                              arr.push(...obj.geometry.coordinates)
                          }
                      })
                  }
                })
              }else{
                  item.ListData.forEach(obj => {
                      arr.push([[[obj.FProjectlng,obj.FProjectlat]]])
                  })
              }
              return {
                  "type": "Feature",
                  "properties": {
                    "name": item.FORGName,
                    "childNum": item.ListData.length
                  },
                  "geometry": {
                    "type": "MultiPolygon",
                    "coordinates":arr,
                  }
              }
            })
            let obj = {
              "type": "FeatureCollection",
              "features":mapArr
            }
            echarts.registerMap('china',obj)
          var dom = document.getElementById(this.id);
          this.myChart = echarts.init(dom);
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
                  data:['华南','华北']
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
              geo:{
                  map:'china',
                  roam:true,
                  label: {
                    show:false,
                    color:'white',
                    emphasis: {
                        show: true,
                        color:'white',
                    }
                  },
                  selectedMode:'single',
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
                        type: 'map',
                        /* map: 'china', */
                        geoIndex: 0,
                        roam:true,
                         symbol: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
                        data:areaArr.map(item => {return {name:item.FORGName,value:item.ProjectCount,id:item.FGUID}}),
                        /* data:[{name:'华南地区',value:100}], */
                        selectedMode:'single',
                        label: {
                            normal: {
                                color:'white',
                                formatter: '{b}\n项目:{c}个',
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
          this.myChart.on('click',(params) => {   
            console.log(params);         //逻辑控制
            this.$emit('click-area',params.data)
          });
        },
        /**
         * 显示map
         */
        showMap(data){
          if(this.myChart){
              this.myChart.dispose()
          }
          echarts.registerMap('china',theme)
          var dom = document.getElementById(this.id);
          this.myChart = echarts.init(dom);
          var app = {};
          var option = null;
          option = {
              tooltip: {
                  trigger: 'item',
              },
              legend: {
                  show:false,
                  
              },
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
                  map: 'china',
                  roam:true,
                  label: {
                    show:false,
                    color:'white',
                    emphasis: {
                        show: true,
                        color:'white',
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
              series: [
                    {
                        name: '',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data:data,
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
                   console.log(params);         //逻辑控制
          });
        },
    }
}
</script>
<style lang="scss">
.echarts-map{
    position:relative;
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