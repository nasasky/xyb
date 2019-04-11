<!-- 用户中心页面 -->
<template>
    <div class='x-pt-15'>
		<mu-paper class="" :z-depth="2">
			<div class="x-dwr x-ptb-10" @click="show_layer('user_info','我的资料')">
				<mu-ripple>
					<mu-row>
						<mu-col span="3" class="x-tc x-pt-5">
							<mu-avatar color="indigo" size="50">
								<img :src="$root.user_data.avatar">
							</mu-avatar>
						</mu-col>
						<mu-col span="9">
							<div class="x-tw x-t-no1 x-lh-28">{{$root.user_data.name||$root.user_data.username}}</div>
							<div class="x-tc-hui x-lh-28">查看并编辑个人资料</div>
						</mu-col>
					</mu-row>
				</mu-ripple>
			</div>
			<div class=""></div>
		</mu-paper>
		<mu-paper class="x-mt-15" :z-depth="2">
			<mu-list>
				<mu-list-item button @click="show_layer('type_index','管理分类')">
					<mu-list-item-action>
						<mu-icon size="28" value=":fa fa-sliders"></mu-icon>
					</mu-list-item-action>
					<mu-list-item-content>
						<mu-list-item-title>管理分类</mu-list-item-title>
						<mu-list-item-sub-title>支出/收入/笔记分类都在这里管理</mu-list-item-sub-title>
					</mu-list-item-content>
					<mu-list-item-action>
						<mu-icon size="16" value=":fa fa-angle-right"></mu-icon>
					</mu-list-item-action>
				</mu-list-item>
				<mu-list-item button @click="show_layer('user_focus','我的关注')">
					<mu-list-item-action>
						<mu-icon size="28" value=":fa fa-heart"></mu-icon>
					</mu-list-item-action>
					<mu-list-item-content>
						<mu-list-item-title>我的关注</mu-list-item-title>
						<!-- <mu-list-item-sub-title>关注列表</mu-list-item-sub-title> -->
					</mu-list-item-content>
					<mu-list-item-action>
						<mu-icon size="16" value=":fa fa-angle-right"></mu-icon>
					</mu-list-item-action>
				</mu-list-item>
				<mu-list-item button @click="show_layer('user_collect','我的收藏')">
					<mu-list-item-action>
						<mu-icon size="28" value=":fa fa-star-o"></mu-icon>
					</mu-list-item-action>
					<mu-list-item-title>我的收藏</mu-list-item-title>
					<mu-list-item-action>
						<mu-icon size="16" value=":fa fa-angle-right"></mu-icon>
					</mu-list-item-action>
				</mu-list-item>
				<mu-list-item button @click="show_layer('user_reply','我的回复')">
					<mu-list-item-action>
						<mu-icon size="28" value=":fa fa-commenting-o"></mu-icon>
					</mu-list-item-action>
					<mu-list-item-title>我的回复</mu-list-item-title>
					<mu-list-item-action>
						<mu-icon size="16" value=":fa fa-angle-right"></mu-icon>
					</mu-list-item-action>
				</mu-list-item>
			</mu-list>
		</mu-paper>
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
import type_index from '@/views/account/index/type_index'
import user_focus from '@/views/user/user_focus'
import user_collect from '@/views/user/user_collect'
import user_reply from '@/views/user/user_reply'
import user_info from '@/views/user/user_info'

import xLayerView from '@/components/x-layer-view'
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {type_index,user_focus,user_collect,user_reply,user_info,xLayerView},
    name: '',
    props: {},
    data() {
    //这里存放数据
        return {
			show_view: '',
			open_layer: false,
			title: ''
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
		$refs:function(val){
			console.log(val)
		}
	},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //方法集合
    methods: {
		// 打开弹层
		show_layer: function(name,title){
			this.title = title;
			this.open_layer = true;
			this.show_view = name;
		},
		// 弹层触发
		show_change: function(val){
			this.open_layer = val;
		}
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    }
}
</script>
<style>
    /*@import url(); 引入公共css类*/
	.layer-content{
		padding-top:56px;
	}

</style>