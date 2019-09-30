<template>
  <div class="mon_product">
    <!-- 供配电   分类-->
    <keep-alive>
      <my-component02></my-component02>
    </keep-alive>

    <div class="fin_item">
      <!-- 低配电  区域 -->
      <keep-alive>
        <my-component></my-component>
      </keep-alive>
    </div>
  </div>
</template>
<style>
</style>
<script>
import cm_b from "./c_b.vue"; //低配电
import cm_a from "./c_a.vue"; //低配电
var echarts = require("echarts");
export default {
  data() {
    return {};
  },
  created() {},
  methods: {},
  components: { "my-component": cm_a, "my-component02": cm_b },
  mounted: function() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

a {
  color: #42b983;
}
</style>
