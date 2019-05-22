
const zwCard = () => import('./card/index.vue')
const zwPagination = () => import('./pagination/index.vue')  //分页
const zwTable = () => import('./table/index.vue')
const number = () => import('./number/index.vue')
const setPassword = () => import('./setPassword/index.vue')
const bMap = () => import('./baiduMap/index.vue')
const lineChart = () => import('./lineChart//index.vue')
export{
    zwCard,
    zwPagination,
    setPassword,
    number,
    zwTable,
    bMap,
    lineChart
}