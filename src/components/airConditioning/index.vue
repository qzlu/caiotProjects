<template>
  <div>
  </div>
</template>
<script>
import {sendSock,closeSocket,initWebSocket,websock} from './socket.js'
export default {
  data(){
    return{

    }
  },
  created(){
      setTimeout(() => {
          this.addGraphView()
      },1000)
  },
  methods:{
    addGraphView(){
      var dataModel = new ht.DataModel();  // 数据容器
      var graphView = new ht.graph.GraphView(dataModel); // 2d 绑定数据模型
      /* graphView.deserialize('displays/test.json'); */
      graphView.addToDOM(this.$el);  //将元素加入到指定的dom 元素下，不指定加入到document.body 下
      dataModel.enableAnimation();
      let view = graphView.getView();
      let _this = this
      ht.Default.xhrLoad('displays/caiot/ktiao.json',function(json){
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
        function test(deviceData){
          dataModel.each(data => {
            let DeviceID = data.a('DeviceID')
            if(DeviceID){
              let dataItems = deviceData[DeviceID]
              if(dataItems){
                let state = dataItems.find(item => item.DataItemID == 2)
                state&&data.a('DeviceState',state.CollectData)
                let DataItemID = data.a('DataItemID')
                if(DataItemID){
                  let dataItem = dataItems.find(item => item.DataItemID == DataItemID)
                  dataItem&&data.a('DataItemValue',dataItem.DataItemName+':'+dataItem.CollectData+dataItem.Unit)
                }
              }
            }
          })
        }
        deviceList = [...new Set(deviceList)]
        sendSock({
          FAction:'SetDeviceID',
          IDStr:deviceList.join(',')
        },test)
        websock.onclose = () => {
          sendSock({
            FAction:'SetDeviceID',
            IDStr:deviceList.join(',')
          },test)
        }
        setInterval(() => {
          var time = new Date().getTime();
          var deltaTime = time - lastTime;
          currentRotation += deltaTime * Math.PI / 180 * 0.3;
          lastTime = time;
          dataModel.each(data => {
            if((data.getDisplayName() == '抽水泵'||data.getDisplayName() == '冷却泵')&&data.a('DeviceState') == 1){
              data.a('fan.rotation',currentRotation)
            }
          })
        },10)
        var dlt = 5, max = 100000000;
        dataModel.addScheduleTask({
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
        });
      })
      view.addEventListener('click', e => {
        console.log(e);
      })
      graphView.fitContent(true);
    }
  }
}
</script>
<style lang="css">

canvas{
    left: 0;
}
</style>