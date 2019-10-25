<template>
    <div id="test" class="height-100" style="background:#ccc">
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    created (){
    	this.$nextTick(() => {
            this.addGraphView()
        })
    },
    methods:{
        	addGraphView() {
                var dataModel = new ht.DataModel();  // 数据容器
                var graphView = new ht.graph.GraphView(dataModel); // 2d 绑定数据模型
                graphView.deserialize('/displays/中央空调.json');
                graphView.addToDOM(this.$el);  //将元素加入到指定的dom 元素下，不指定加入到document.body 下
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
            },
    }
}
</script>
<style lang="scss">
#test{
    canvas{
        left: 0;
    }
}
</style>