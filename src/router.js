import Vue from 'vue'
import Router from 'vue-router'
import router_obj from './router/index'
import xzyn from './common/common'
import request_url from './common/request_url'
Vue.prototype.xzyn = xzyn;
Vue.prototype.request_url = request_url;

Vue.use(Router)

const router = new Router(router_obj)
//  判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
	router.app.title = to.meta.name;	// 设置标题
	if (to.matched.some(res => res.meta.is_login)) {// 判断是否需要登录权限
		if (xzyn.is_login()) {	// 判断是否登录
			router.app.user_data = xzyn.edit_data('user_data')||{};
			next()
		} else {	// 没登录则跳转到登录界面
			router.app.user_data = {};
			xzyn.msg('请登陆',0);
			next({
				path: '/login/index'
			})
		}
	} else {
		next()
	}
})
export default router