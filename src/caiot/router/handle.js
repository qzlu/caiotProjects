
import router from './index'

router.beforeEach((to, from, next) => {
	let re = /\/home/
	/* 路由发生变化修改页面title */
	if (to.meta.title) {
		document.title = to.meta.title;
	}
	let { token, projectID, showMenu } = to.query
	if (token) {
		localStorage.setItem('Token', token)
		localStorage.setItem('inIframe', showMenu || 1)
	}
	if (projectID) {
		localStorage.setItem('projectid', projectID)
	}
	token = token || localStorage.getItem("Token");
	if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限, 定义用户中心需要登录权限
		/* 	var user=localStorage.getItem("iuserName"); */
		if (!token) {
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
	} else {
		if (to.path.match(re)) {
			next({ path: to.path.replace(re, '') })
		} else {
			next()
		}
	}
})