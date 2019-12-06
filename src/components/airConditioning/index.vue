<template>
  <div style="height:100%;position:relative">
    <el-dialog class="scarda-system-dialog" append-to-body width="500px" :visible.sync="show" @close='onClose' :title="title">
      <ul>
        <li v-for="(item,i) in dataItems" :key="i">
          <span class='label'>{{item.DataItemName}}:</span>
          <span class='value'>{{item.CollectData}}</span>
          <span class="unit">{{item.Unit}}</span>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>
<script>
import {sendSock,closeSocket,initWebSocket,websock} from './socket.js'
export default {
  data(){
    return{
      dataItems:[],
      show:false,
      title:'',
      dataModel:null,
      deviceList:[]
      
    }
  },
  created(){
    this.$nextTick(() => {
      this.addGraphView()
    })
  },
  beforeDestroy(){
    closeSocket()
    websock.onclose = () => {
     console.log('连接断开');
    }
  },
  methods:{
    updatedData(deviceData) {
      this.dataModel.each(data => {
        let DeviceID = data.a('DeviceID')
        if(DeviceID){
          let dataItems = deviceData[DeviceID]
          if(dataItems){
            let state = dataItems.find(item => item.DataItemID == 2)
            state&&data.a('DeviceState',state.CollectData)
            let DataItemID = data.a('DataItemID')
            if(DataItemID){
              let dataItem = dataItems.find(item => item.DataItemID == DataItemID)
              dataItem&&data.a('DataItemValue',dataItem.CollectData+dataItem.Unit)
            }
          }
        }
      })
    },
    setDevice(){
      if(this.deviceList.length == 0) return
      sendSock({
        FAction:'SetDeviceID',
        IDStr:this.deviceList.join(',')
      },this.updatedData)
    },
    onClose(){
      this.setDevice()
    },
    addGraphView(){
      var dataModel = new ht.DataModel();  // 数据容器
      var graphView = new ht.graph.GraphView(dataModel); // 2d 绑定数据模型
      this.dataModel = dataModel
      graphView.addToDOM(this.$el);  //将元素加入到指定的dom 元素下，不指定加入到document.body 下
      dataModel.enableAnimation();
      let view = graphView.getView();
      let _this = this
      ht.Default.xhrLoad(`displays/caiot/ktiao-${localStorage.getItem('projectid')}.json`,function(json){
        dataModel.deserialize(json);
        let deviceList = []
        var currentRotation = 0;
        var lastTime = new Date().getTime();
        dataModel.each(data => {
            let DeviceID = data.a('DeviceID')
            if(DeviceID){
              deviceList.push(DeviceID.toString())
            }
        })
        _this.deviceList = [...new Set(deviceList)]
        _this.setDevice()
        websock.onclose = () => {
         _this.setDevice()
        }
        graphView.onDataClicked =  (data, e) => {
          let deviceID = data.a('DeviceID')
          if(deviceID){
            sendSock({
              FAction:'QueryDeviceRealData',
              DeviceID:deviceID
            },(res) => {
              let dataItems = res[deviceID]
              if(Array.isArray(dataItems)&&!_this.show){
                _this.title = dataItems[0]&&dataItems[0].DeviceName
                _this.dataItems = dataItems.map(item => {
                  if(item.DataItemID == 2){
                    item.CollectData = item.CollectData?data.a('runningText'):data.a('stopText')
                  }
                  return item
                })
                _this.show = true
              }
            })
          }
        }
        graphView.fitContent(true);
        setInterval(() => {
          var time = new Date().getTime();
          var deltaTime = time - lastTime;
          currentRotation += deltaTime * Math.PI / 180 * 0.3;
          lastTime = time;
          dataModel.each(data => {
            if((data.getDisplayName() == '抽水泵'||data.getDisplayName() == '冷冻泵')&&data.a('DeviceState') == 1){
              data.a('fan.rotation',currentRotation)
            }
          })
        },10)
        var dlt = 5, max = 100000000;
/*         dataModel.addScheduleTask({
          interval: 50,
          action: function(data){

            if (data instanceof ht.Shape) {
              if (!data.s('shape.dash')) return;
              var k = data.s('2d.movable') ? -1 : 1;
              var offset = data.s('shape.dash.offset') || 0;
              data.s('shape.dash.offset', (offset + k * dlt) % max);
              return;
            }
          }
        }); */
      },{cache:false})
    }
  }
}
</script>
<style lang="css">

canvas{
    left: 0;
}
</style>