<!-- 用户信息页面 -->
<template>
    <div class=''>
		<mu-paper :z-depth="2">
            <x-view bg-img class="x-ptb-20">
				<div class="x-tc">
					<mu-avatar color="indigo" class="x-yy-6" size="80" @click="show_layer('up_avatar','上传头像')">
						<img :src="$root.user_data.avatar">
					</mu-avatar>
				</div>
				<div class="x-tc x-f20 x-lh-30 x-ptb-10">
					<span @click="show_layer('user_edit','编辑资料')">{{$root.user_data.name||'请设置昵称'}}</span>
				</div>
				<div class="x-tc x-lh-24">
					<span>{{$root.user_data.username}}</span>
					<span class="x-f10 x-pl-5">(ID:{{$root.user_data.id}})</span>
				</div>
            </x-view>
			<!-- <mu-divider></mu-divider> -->
			<mu-list>
				<mu-list-item button @click="open_edit_layer">
					<!-- <mu-list-item-action>
						<mu-icon value=":icon xzyn-shezhi"></mu-icon>
					</mu-list-item-action> -->
					<mu-list-item-title>设置公开的资料</mu-list-item-title>
					<mu-list-item-action>
						<mu-icon size="16" value=":fa fa-angle-right"></mu-icon>
					</mu-list-item-action>
				</mu-list-item>
				<mu-list-item button @click="show_layer('user_edit','编辑资料')">
					<!-- <mu-list-item-action>
						<mu-icon value=":icon xzyn-shezhi"></mu-icon>
					</mu-list-item-action> -->
					<mu-list-item-title>编辑资料</mu-list-item-title>
					<mu-list-item-action>
						<mu-icon size="16" value=":fa fa-angle-right"></mu-icon>
					</mu-list-item-action>
				</mu-list-item>
				<mu-list-item button>
				<!-- 	<mu-list-item-action>
						<mu-icon value=":icon xzyn-Entry"></mu-icon>
					</mu-list-item-action> -->
					<mu-list-item-title>登陆次数</mu-list-item-title>
					<mu-list-item-action>
						<span>{{$root.user_data.logins}}次</span>
					</mu-list-item-action>
				</mu-list-item>
				<mu-list-item button>
				<!-- 	<mu-list-item-action>
						<mu-icon value=":icon xzyn-Watch1"></mu-icon>
					</mu-list-item-action> -->
					<mu-list-item-title>最近登陆时间</mu-list-item-title>
					<mu-list-item-action>
						<span>{{$root.user_data.last_time}}</span>
					</mu-list-item-action>
				</mu-list-item>
				<mu-list-item button>
					<!-- <mu-list-item-action>
						<mu-icon value=":icon xzyn-Map_"></mu-icon>
					</mu-list-item-action> -->
					<mu-list-item-title>最近登陆IP</mu-list-item-title>
					<mu-list-item-action>
						<span>{{$root.user_data.last_ip}}</span>
					</mu-list-item-action>
				</mu-list-item>
				<mu-list-item button>
					<mu-button full-width color="red" @click="ajax_loginout">退出登陆</mu-button>
				</mu-list-item>
			</mu-list>
		</mu-paper>
		<mu-dialog title="" :open.sync="show_edit_layer" @close="close_layer">
			<mu-list>
				<mu-list-item button >
                    <mu-switch :input-value="add_data.sex == 1" label="性别是否公开" @change="sex_change"></mu-switch>
				</mu-list-item>
				<mu-list-item button >
                    <mu-switch :input-value="add_data.birthday == 1" label="生日是否公开" @change="birthday_change"></mu-switch>
				</mu-list-item>
				<mu-list-item button >
                    <mu-switch :input-value="add_data.email == 1" label="邮箱是否公开" @change="email_change"></mu-switch>
				</mu-list-item>
				<mu-list-item button >
                    <mu-switch :input-value="add_data.moblie == 1" label="手机是否公开" @change="moblie_change"></mu-switch>
				</mu-list-item>
				<mu-list-item button >
                    <mu-switch :input-value="add_data.qq == 1" label="QQ是否公开" @change="qq_change"></mu-switch>
				</mu-list-item>
				<mu-list-item button >
                    <mu-switch :input-value="add_data.weixin == 1" label="微信是否公开" @change="weixin_change"></mu-switch>
				</mu-list-item>
			</mu-list>
			<mu-button slot="actions" flat color="primary" @click="add_ajax">保存</mu-button>
		</mu-dialog>
		<x-layer-view :show="open_layer" :title="title" @change="show_change">
			<keep-alive>
				<component :is="show_view"></component>
			</keep-alive>
		</x-layer-view>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import xLayerView from '@/components/x-layer-view'
import user_edit from '@/views/user/user_edit'
import up_avatar from '@/views/user/up_avatar'


export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xLayerView,user_edit,up_avatar},
    name: '',
    props: {},
    data() {
    //这里存放数据
        return {
            show_edit_layer: false,	// 编辑层
			add_data: {},
			show_view: '',	// 弹层的组件
			open_layer: false,
			title: ''

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
	},
    //方法集合
    methods: {
		// 打开编辑层
		open_edit_layer: function(name){
			var _this = this;
			_this.show_edit_layer = true;
			_this.add_data = _this.$root.user_data.is_share;
		},
		// 保存提交
		add_ajax: function(){
			var _this = this;
			_this.show_edit_layer = false;
			var add_data = {
				id: _this.$root.user_data.id,
				is_share: _this.add_data
			};
			_this.xzyn.ajax(_this.request_url.userinfo_edit,'post',add_data,{},(data,res)=>{
				_this.$root.user_data = data;
				_this.xzyn.edit_data('user_data',data);
			},false)

		},
		// 关闭层触发
		close_layer: function(){
			this.add_data = this.$root.user_data.is_share;
		},
		// 退出登陆
		ajax_loginout: function(){
			var _this = this;
			this.$confirm('确定要退出登陆吗？', '提示').then((res)=>{
				if( res.result ){
					_this.xzyn.ajax(_this.request_url.usertoken_loginout,'get',{id:this.$root.user_data.id},{},(data,res)=>{
						_this.xzyn.del_cache();	// 删除缓存
						_this.xzyn.go('/login/index');
					})
				}
			});
		},
		// 获取用户详细信息
		ajax_data: function(){
			var _this = this;
			_this.xzyn.ajax(_this.request_url.userinfo_index,'get',{},{},(data,res)=>{
				_this.$root.user_data = data;
				_this.xzyn.edit_data('user_data',data);
			},false)
		},
		sex_change: function(val){
			if( val ){
				this.add_data.sex = 1;
			}else{
				this.add_data.sex = 0;
			}
				console.log(this.add_data)
		},
		birthday_change: function(val){
			if( val ){
				this.add_data.birthday = 1;
			}else{
				this.add_data.birthday = 0;
			}
		},
		email_change: function(val){
			if( val ){
				this.add_data.email = 1;
			}else{
				this.add_data.email = 0;
			}
		},
		moblie_change: function(val){
			if( val ){
				this.add_data.moblie = 1;
			}else{
				this.add_data.moblie = 0;
			}
		},
		qq_change: function(val){
			if( val ){
				this.add_data.qq = 1;
			}else{
				this.add_data.qq = 0;
			}
		},
		weixin_change: function(val){
			if( val ){
				this.add_data.weixin = 1;
			}else{
				this.add_data.weixin = 0;
			}
		},
		// 弹层触发
		show_change: function(val){
			this.open_layer = val;
			this.$root.user_data = this.xzyn.edit_data('user_data');
		},
		// 打开弹层
		show_layer: function(name,title){
			this.title = title;
			this.open_layer = true;
			this.show_view = name;
		}

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    }
}
</script>
<style>
    /*@import url(); 引入公共css类*/

</style>