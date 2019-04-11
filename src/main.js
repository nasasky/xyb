import Vue from 'vue'
import App from './App.vue'
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import './common/xzyn.css';

import "../public/font-awesome/css/font-awesome.css";
import 'muse-ui-loading/dist/muse-ui-loading.css';
import Loading from 'muse-ui-loading';
import 'muse-ui-message/dist/muse-ui-message.css';
import Message from 'muse-ui-message';
Vue.use(Message);
import xDataNull from '@/components/x-data-null.vue';
Vue.component('x-data-null',xDataNull)	// 创建组件
import xView from '@/components/x-view.vue';
Vue.component('x-view',xView)	// 创建组件

Vue.use(MuseUI);
Vue.use(Loading);

// 调试插件
// import Vconsole from 'vconsole'
// const vConsole = new Vconsole()
// Vue.use(vConsole)

import router from './router'
Vue.config.productionTip = false

import bg_img_g from '@/assets/img/bg/g.jpg'

new Vue({
    router,
    data:{
		viewWidth: document.documentElement.clientWidth,    // 当前窗口的实时宽度
		viewHeight: document.documentElement.clientHeight,  // 当前窗口的实时高度
		title:'戏中有你',
		user_data: {},
        bg_img: "url('"+bg_img_g+"')",	// 背景图片
        public_data: {
            account_type_2: [],
            m_type_7: [],
            notes_data: []
        },     // 公共数据
        url_list: [],	// 当前管理员有权限的url数据
	},
    //监控data中的数据变化
    watch: {
        '$route': {
            handler(val){
                var path_arr = val.path.split('/');
                if(path_arr[1] == 'admin'){
                    if( !this.xzyn.edit_data('user_token') ){
                        this.xzyn.go('/user/index');
                    }
                }
                this.get_public_data();
            },
            immediate: true,
        }
	},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
		if( this.xzyn.edit_data('user_token') ){
			this.user_data = this.xzyn.edit_data('user_data')||{};
			this.url_list = this.xzyn.edit_data('url_list')||[];
		}else{
			this.xzyn.go('/admin/login');
		}
        this.get_public_data();
        this.user_data = this.xzyn.edit_data('user_data')||{};
        this.bg_img = this.xzyn.edit_data('bg_img')?this.xzyn.edit_data('bg_img'):"url('"+bg_img_g+"')";
    },
    //方法集合
    methods: {
        // 获取公共数据
        get_public_data(){
            var _this = this;
            var public_data = _this.xzyn.edit_data('public_data');
            var type_arr_2 = _this.xzyn.edit_data('account_type_2'); // 笔记分类
            if( !public_data ){
                _this.xzyn.ajax(_this.request_url.index_index,'get',{},{},function(data){
                    let time = new Date().getTime();
                    public_data = {
                        time: time+7200000,		// 有效时间 2小时
                        account_type_2: data.account_type_2,	// 笔记分类
                        m_type_7: data.m_type_7,		// 侧边栏导航数据
                        notes_data: data.notes_data		// 公开/首页的笔记数据
                    }
                    if( !type_arr_2 ){
                        _this.xzyn.edit_data('account_type_2',public_data.account_type_2); // 笔记分类
                    }
                    _this.public_data = public_data;
                    _this.xzyn.edit_data('public_data',public_data); // 公共数据
                },false)
            }else{
                let time = new Date().getTime();
                if(public_data.time <= time){
                    _this.xzyn.ajax(_this.request_url.index_index,'get',{},{},function(data){
                        public_data = {
                            time: time+7200000,		// 有效时间 2小时
                            account_type_2: data.account_type_2,	// 笔记分类
                            m_type_7: data.m_type_7,		// 侧边栏导航数据
                            notes_data: data.notes_data		// 公开/首页的笔记数据
                        }
                        if( !type_arr_2 ){
                            _this.xzyn.edit_data('account_type_2',public_data.account_type_2); // 笔记分类
                        }
                        _this.public_data = public_data;
                        _this.xzyn.edit_data('public_data',public_data); // 公共数据
                    },false)
                }else{
                    if( !type_arr_2 ){
                        _this.xzyn.edit_data('account_type_2',public_data.account_type_2); // 笔记分类
                    }
                    this.public_data = public_data;
                }
            }
        }
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        const _this = this
        window.onresize = () => {
            return (() => {
                _this.viewWidth = document.documentElement.clientWidth;
                _this.viewHeight = document.documentElement.clientHeight;
            })()
        }
    },
    render: h => h(App)
}).$mount('#app')
