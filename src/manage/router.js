import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes:[
        {
            path: '/login',
            name: 'login',
            component: () => import('./views/login/login.vue') //数字消防云平台
        },
        {
            path:'',
            component: () => import('./views/layout/index.vue'), 
            children:[
/*                  {
                    path:'',
                    component:() => import('./views/index.vue')//
                }, */
/*                {
                    path:'indexItem',
                    name:'indexItem',
                    component: () => import('./views/home/indexItem.vue') //项目页面
                },
                {
                    path:'deviceDetaile/:id',
                    name:'deviceDetaile',
                    component: () => import('./views/home/deviceDetaile.vue') //设备详情
                } */
            ]
        },
    ]
})