<template>
  <div class="dv-border-box-10" :style="`box-shadow: inset 0 0 25px 3px ${mergedColor[0]}`">
    <svg
      width="150px"
      height="150px"
      :key="item"
      v-for="item in border"
      :class="`${item} border`"
    >
      <polygon
        :fill="mergedColor[1]"
        points="40, 0 5, 0 0, 5 0, 16 3, 19 3, 7 7, 3 35, 3"
      />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: 'DvBorderBox10',
  props: {
    color: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      border: ['left-top', 'right-top', 'left-bottom', 'right-bottom'],

      defaultColor: ['#1d48c4', '#d3e1f8'],

      mergedColor: ['#1d48c4', '#d3e1f8']
    }
  },
  watch: {
  },
  methods: {
  },
  mounted () {

  }
}
</script>

<style lang="scss">
.dv-border-box-10 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 6px;

  .border {
    position: absolute;
    display: block;
  }

  .right-top {
    right: 0px;
    transform: rotateY(180deg);
  }

  .left-bottom {
    bottom: 0px;
    transform: rotateX(180deg);
  }

  .right-bottom {
    right: 0px;
    bottom: 0px;
    transform: rotateX(180deg) rotateY(180deg);
  }

  .border-box-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
