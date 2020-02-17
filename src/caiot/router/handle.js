
import router from './index'
import store from '../store/index.js'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
router.beforeEach(async (to, from, next) => {
	NProgress.start()
	let re = /\/home/
	/* 路由发生变化修改页面title */
	if (to.meta.title) {
		document.title = to.meta.title;
	}
	let { token, projectID, showMenu, link } = to.query
	if (token) {
		localStorage.setItem('Token', token)
		localStorage.setItem('inIframe', showMenu || 1)
		await store.dispatch('tokenLogin')
		await store.dispatch('getMenu')
		store.dispatch('addRoute')
		let menuData
		try {
			menuData = JSON.parse(localStorage.getItem('menuData')) || []
		} catch (error) {
			menuData = []
		}
		if (menuData.length == 0) {
			window.location.href = link
		} else {
			next(to.path)
		}
	}
	if (projectID) {
		localStorage.setItem('projectid', projectID)
	}
	token = token || localStorage.getItem("Token");
	let menuData
	try {
		menuData = JSON.parse(localStorage.getItem('menuData'))||[]
	} catch (error) {
		menuData = []
	}
	if ((!token||menuData.length == 0)&&to.path !== '/login') {
		next({
			name: 'login'    //强制跳转指定页面       
		})
	} else {
		if (to.path.match(re)) {
			next({ path: to.path.replace(re, '') })
		} else {
			next()
		}
	}
})
router.afterEach(()=> {
	NProgress.done()
})