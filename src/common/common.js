
import axios from 'axios';
import router from '../router'
import Toast from 'muse-ui-toast';
import request_url from '@/common/request_url';

import 'muse-ui-progress/dist/muse-ui-progress.css';
import NProgress from 'muse-ui-progress';
NProgress.config({
	zIndex: 9999,          // progress z-index
	top: 0,                // position fixed top
	speed: 300,            // progress speed
	color: 'secondary',      // color
	size: 4,               // progress size
	className: ''          // progress custom class
})

// 设置 post、put 默认 Content-Type
axios.defaults.baseURL = request_url.request_url;
// axios.defaults.headers.post['Content-Type'] = 'application/json'
// axios.defaults.headers.put['Content-Type'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// 超时时间
axios.defaults.timeout = 10000
axios.interceptors.request.use(config => {
    NProgress.start();	// 打开加载器
    return config
}, error => {
	NProgress.done();	// 关闭加载器
	xzyn.msg('加载超时');
    return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(data => {// 响应成功关闭loading
	NProgress.done();	// 关闭加载器
	// console.log(data)
    return data
}, error => {
	NProgress.done();	// 关闭加载器
	xzyn.msg('加载失败:'+error);
    return Promise.reject(error)
})
Toast.config({
	position: 'top',		// 弹出的位置
	time: 2000,		// 显示的时长
	closeIcon: ':fa fa-close',		// 关闭的图标
	close: false,		// 是否显示关闭按钮
	successIcon: ':fa fa-check',		// 成功信息图标
	infoIcon: ':fa fa-info',		// 信息信息图标
	warningIcon: ':fa fa-exclamation',		// 提醒信息图标
	errorIcon: ':fa fa-exclamation-triangle'		// 错误信息图标
})

var xzyn = {
    // appId: '28063779',	// APP应用
    // appSecret: 'EiFCZJwhAPLYMyExZbkYBiKHcFehnTqF',		// APP应用
    appId: '07561753',	// web端应用
    appSecret: 'BxmsrMNddLTXjiuicZeyImQacpsjOZWh',		// web端应用
	// 缓存数据操作，val传true等于删除
	edit_data: function(key,val=''){	// 本地存储
		if(val === true ){
			window.localStorage.removeItem(key);	// 删除
		}else if( val !== true && val != '' ){
			window.localStorage.setItem(key,JSON.stringify(val));	 // 存储
		}else{
			var info_obj = JSON.parse( window.localStorage.getItem(key) );
			return info_obj;	// 获取
		}
	},
	// 临时存储
	edit_datas: function(key,val=''){
		if(val === true ){
			window.sessionStorage.removeItem(key);	// 删除
		}else if( val !== true && val != '' ){
			window.sessionStorage.setItem(key,JSON.stringify(val));	 // 存储
		}else{
			var info_obj = JSON.parse( window.sessionStorage.getItem(key) );
			return info_obj;	// 获取
		}
	},
	// 消息提示
	msg: function (info='操作成功',icons,fun='') {
		if( icons === 1 ){
			Toast.success(info);
		}else if( icons === 0 ){
			Toast.error(info);
		}else{
			Toast.message(info);
		}
		if (typeof fun == 'function') {
			setTimeout(function(){
				fun();
			},2000)
		}
	},
	// 路由跳转
	go:function(url=''){
		if(url == ''){
			router.go(-1);
		}else{
			router.push(url);
		}
	},
	// 检查是否登陆
	is_login: function(){
		var userToken = this.edit_data('user_token');	// 获取
		if (userToken) {	// 有数据
			var time = new Date().getTime();    // 当前的时间
			if(userToken.time < time){	// 登陆超时
				this.edit_data('user_token',true);
				this.edit_data('user_data',true);
				return false;
			}else{
				return true;	// 已经登陆
			}
		} else {	// 没有登陆
			this.edit_data('user_token',true);	// 删除
			this.edit_data('user_data',true);
			return false;
		}
	},
	// 删除缓存数据
	del_cache: function(){
		this.edit_data('user_data',true);
		this.edit_data('user_token',true);
		this.edit_data('account_type',true);
		this.edit_data('account_type_0',true);
		this.edit_data('account_type_1',true);
		this.edit_data('account_type_2',true);
		this.edit_data('account_config',true);
		this.edit_data('money_y_0',true);
		this.edit_data('money_y_1',true);
	},
	// 请求状态操作
    code_state: function (code, info) {
        switch (code) {
            case '0':   // 操作失败
                this.msg(info,0);
                break;
            case '-1':  // hash参数无效
                this.msg(info,0);
                break;
            case '-2':  // 应用AppID非法
                this.msg(info,0);
                break;
			case '-3':  // 缺少AppToken令牌
				this.edit_data(this.appId, true);    // 删除本地存储 apptoken
				this.ajaxToken()
                this.msg(info,0);
                break;
            case '-4':  // AppToken令牌无效
				this.edit_data(this.appId, true);    // 删除本地存储 apptoken
				this.ajaxToken()
                this.msg(info,0);
                break;
            case '-5':  // AppToken令牌过期
				this.edit_data(this.appId, true);    // 删除本地存储 apptoken
				this.ajaxToken()
                this.msg(info,0);
                break;
            case '-6':  // 缺少UserToken令牌
				this.del_cache();
				this.go('/login/index');
                break;
            case '-7':  // UserToken令牌无效
				this.del_cache();
				this.go('/login/index');
                break;
            case '-8':  //UserToken令牌过期，请重新登录。
				this.del_cache();
				this.go('/login/index');
                break;
            case '-200':    // 对不起，你没有权限。
                this.msg(info,0);
                break;
            case '-230':    // 应用已禁用
                this.msg(info,0);
                break;
            case '-340':    // 请求AppToken令牌次数超额
                this.msg(info,0);
                break;
            case '-400':    // 当前请求域名未授权
                this.msg(info,0);
                break;
            case '-800':    // 没有数据
                this.msg(info,0);
                break;
            case '-900':    // 参数错误
                this.msg(info,0);
                break;
            case '-999':    // 系统错误
                this.msg(info,0);
                break;
        }
	},
	// axios - ajax封装
	axios_ajax: function(url="",type="get",add_data={},headers={},fun=''){
		var get_data={},post_data={};
		get_data = type === 'get'?add_data:{};
		post_data = type === 'post'?add_data:{};
		axios({
			method: type,
			url: url,
			data: post_data,
			params: get_data,
			headers: headers,
		}).then(function (res) {
			if( res.status == 200 ){
				if( fun != '' && typeof fun == 'function'){
					fun(res.data);
				}
			}
		}).catch(function (error) {
			console.log(error);
		})
	},
	// 获取 appToken
	ajaxToken: function(at_fun = '') {
		var _this = this;
        var time = new Date().getTime();    // 当前的时间
		// var at_url = request_url.request_url+request_url.apptoken_index,
		var at_url = request_url.apptoken_index,
			at_headers = {},
			at_app_data = {
				app_id: _this.appId,
				app_secret: _this.appSecret
			};
		_this.axios_ajax(at_url, 'post', at_app_data,at_headers,function (at_res) {
			switch (at_res.code) {
				case '-3':
					_this.edit_data(_this.app_id,true);
					_this.ajaxToken(at_fun);
					break;
				case '-4':
					_this.edit_data(_this.app_id,true);
					_this.ajaxToken(at_fun);
					break;
				case '-5':
					_this.edit_data(_this.app_id,true);
					_this.ajaxToken(at_fun);
					break;
				default:
					if( at_res.code == 1 ){
						var tokenobj = {
							apptoken: at_res.data.appToken,
							time: time + at_res.data.expire*1000 - 300000  // 提前5分钟
						}
						_this.edit_data(_this.appId, tokenobj);    // 本地存储 apptoken
						if( at_fun != '' && typeof at_fun == 'function' ){
							at_fun(at_res);
						}
					}else{
						_this.code_state(at_res.code,at_res.info);
					}
					break;
			}
		});
	},
	// 通用ajax封装
	ajax: function(url,type,data={},headers={},fun='',msg=true){
		var _this = this;
		// url = url;
		// url = request_url.request_url + url;
        var time = new Date().getTime();    // 当前的时间
        var tokenData = _this.edit_data(_this.appId);     // 获取存储的 apptoken
		var userData = _this.edit_data('user_data')||{userToken:''};
        if ( !tokenData ) {
            _this.ajaxToken(function (res) {
                headers.appToken = res.data.appToken;
				headers.usertoken = userData.userToken;
                _this.axios_ajax(url, type, data, headers, function(ress){
					if( ress.code == 1 ){
						if(msg){
							_this.msg(ress.info,1,()=>{
								fun(ress.data,ress);
							});
						}else{
							fun(ress.data,ress);
						}
					}else{
						_this.code_state(ress.code,ress.info);
					}
				});
            })
        } else {
            if (tokenData.time > time) {
                headers.appToken = tokenData.apptoken;
				headers.usertoken = userData.userToken;
                _this.axios_ajax(url, type, data, headers, function(res){
					if( res.code == 1 ){
						if(msg){
							_this.msg(res.info,1,()=>{
								fun(res.data,res);
							});
						}else{
							fun(res.data,res);
						}
						// console.log(res);
					}else{
						_this.code_state(res.code,res.info);
					}
				});
            } else {
                _this.ajaxToken(function (res) {
                    headers.appToken = res.data.appToken;
					headers.usertoken = userData.userToken;
                    _this.axios_ajax(url, type, data, headers, function(ress){
						if( ress.code == 1 ){
							if(msg){
								_this.msg(ress.data.info,1,()=>{
									fun(ress.data,ress);
								});
							}else{
								fun(ress.data,ress);
							}
						}else{
							_this.code_state(ress.code,ress.info);
						}
					});
                })
            }
		}
	},
	// 金额保留两位小数
	filter_money: function(x) {
		var b = parseFloat(x);
		if (isNaN(b)) {
			return '';
		}else{
			b = b.toFixed(3);
			var s = b.substring(0,b.toString().length - 1);  //这里先将a转换为float类型再保留三位小数，最后截取字符串前b.length - 1位
			var rs = s.indexOf('.');
			if (rs < 0) {
				rs = s.length;
				s += '.';
			}
			while (s.length <= rs + 2) {
				s += '0';
			}
			return s;
		}
	},
	// 获取这个月的天数
	get_date_d_num: function( y=0,m=0){
		var yy = new Date().getFullYear();	// 年
		var mm = new Date().getMonth()+1;	// 月
		y = y || yy;
		m = m || mm;
		return new Date(y,m,0).getDate();
	},
	// 获取年份数组
	get_date_y_arr: function (num=10) {
		var yy = new Date().getFullYear();	// 年
		var yy_arr = [];
		var ys = yy - num;
		for (var i = 0; i < num+1; i++) {
			yy_arr.unshift(ys+i);
		}
		return yy_arr;
	},
	// 获取月份数组
	get_date_m_arr: function () {
		var m_arr = [];
		for (var i = 0; i < 12; i++) {
			m_arr.push(i+1);
		}
		return m_arr;
	},
	// 获取日数组
	get_date_d_arr: function(sy=0,sm=0) {
		var _this = this;
		var yy = new Date().getFullYear();	// 年
		var mm = new Date().getMonth()+1;	// 月
		sy = sy || yy;
		sm = sm || mm;
		var d_arr = [];
		for (var i = 0; i < _this.get_date_d_num(sy,sm); i++) {
			d_arr.push(i+1);
		}
		return d_arr;
	},
	// 获取年、月、日完整数组,传入年份，如： 2017，返回2017至当前的年月日数组
	get_date_ymd_arr: function(sy){
		var _this = this;
		var yy = new Date().getFullYear();	// 年
		var ymd_arr = [];
		if( sy <= yy ){
			var y_num = yy - sy;	// 相差年数
			var yy_n = yy - y_num;	// 开始的年份
			for (var i = 0; i < (y_num+1); i++) {
				var s1 = {};
				s1.y_name = yy_n+i+'年';
				s1.y_val = yy_n+i;
				s1.m_arr = [];
				for (var ii = 0; ii < 12; ii++) {
					var s2 = {};
					s2.m_name = ii+1+'月';
					s2.m_val = ii+1;
					s2.d_arr = [];
					var d_num = _this.get_date_d_num(yy_n+i,ii+1);	// 这个月的天数
					for (var x = 0; x < d_num; x++) {
						var s3 = {};
						s3.d_name = x+1+'日';
						s3.d_val = x+1;
						s2.d_arr.push(s3);
					}
					s1.m_arr.push(s2);
				}
				ymd_arr.unshift(s1);
			}
		}
		return ymd_arr;
	},
	// 验证是否是合法的邮箱
	is_email: function(email=0){
		var reg_exp = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if (email.length == 0) {
            return false;
        }
        return reg_exp.test(email);
	},
    //验证是否为合法的手机号
    is_mobile: function(mobile=0) {
        var reg_exp = /^(((1[34578]{1}))+\d{9})$/;
        if (mobile.length == 0) {
            return false;
        }
        if (mobile.length != 11) {
            return false;
        }
        return reg_exp.test(mobile);
    },
	// 验证是否是合法的固定电话
    is_phone: function(phone='') {
        var reg_exp = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
        if (phone == "") {
            return false;
        }
        return reg_exp.test(phone);
    },
	// 验证是由0-9组成的数字不能有小数点
    is_number: function(number='') {
        var reg_exp = /^[0-9]+$/;
        if (number == "") {
            return false;
        }
        return reg_exp.test(number);
    },
	// 验证是由0-9组成的数字可以能有小数点并且保留2位
	is_double_number: function(double_number='') {
        var reg_exp = /^[0-9]+(\.\d{2})?$/;
        if (double_number == "") {
            return false;
        }
        return reg_exp.test(double_number);
    },
	// 一级数组转换二级数组 num 一组要多少个，add_obj 额外添加的数据
	turn_arr: function(data=[],num,add_obj=''){
		var new_arr = [],
			arr = [];
		for (var i = 0; i < data.length; i++) {
			if( arr.length < (num+1) ){
				arr.push(data[i]);
			}
			if( i == (data.length-1) ){
				if( add_obj !== '' ){
					if(arr.length == num){
						new_arr.push(arr);
						arr = [];
						arr.push(add_obj);
						new_arr.push(arr);
						arr = [];
					}else{
						arr.push(add_obj);
						new_arr.push(arr);
						arr = [];
					}
				}else{
					new_arr.push(arr);
					arr = [];
				}
			}
			if( arr.length == num ){
				new_arr.push(arr);
				arr = [];
			}
		}
		return new_arr;
	},

}
// xzyn.request_url = request_url;

export default xzyn