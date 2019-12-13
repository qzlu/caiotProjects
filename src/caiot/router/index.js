import Vue from 'vue'
import Router from 'vue-router'
/*----------*/
import agreement from '@/caiot/views/agreement' //安卓页面
let router = [
	{
		path: '/login',
		name: 'login',
		component: () => import("@/caiot/views/login/login"),
		meta: {
			title: '千仞云平台'
		}
	},
	{
		path:'/',
		component: () =>import("@/caiot/views/home")
	},
	{
		path: '/agreement', //给安卓用的页面，不是pc项目
		name: 'agreement',
		component: agreement,
		meta: {
			title: '千仞云平台'
		}
	},
/* 	{
		path: '*',
		meta: { requiresAuth: false },
		component: () => import('../views/404.vue')
	}, */

]
Vue.use(Router)

export default new Router({
	// mode: 'history',
	routes: router
})