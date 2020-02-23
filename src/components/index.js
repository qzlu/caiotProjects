
const zwCard = () => import('./card/index.vue')
const zwPagination = () => import('./pagination/index.vue')  //分页
const zwTable = () => import('./table/index.vue')
const number = () => import('./number/index.vue')
const setPassword = () => import('./setPassword/index.vue')
const bMap = () => import('./baiduMap/index.vue')
const lineChart = () => import('./lineChart//index.vue')
const treeTransfer = () => import('./tree-Transfer/index')  //树形穿梭框
const pieChart = () => import('./pieChart')
const barChart = () => import('./barChart')
const AirConditioning = () => import('./airConditioning')
const Power = () =>  import('./power')
const Water = () =>  import('./water')
const zwBorder = () => import('./box-border')
const zwCard1 = () => import('./card1')
const radarChart = () => import('./radarChart')
const statuBox = () => import('./statuBox')
const deviceParams = () => import('./deviceParams')
export{
    zwCard,
    zwPagination,
    setPassword,
    number,
    zwTable,
    bMap,
    lineChart,
    treeTransfer,
    pieChart,
    barChart,
    AirConditioning,
    Power,
    Water,
    zwBorder,
    zwCard1,
    radarChart,
    statuBox,
    deviceParams
}