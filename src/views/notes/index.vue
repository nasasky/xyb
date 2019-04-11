<!-- 笔记首页 -->
<template>
    <div class='x-pt-15'>
		<div class="x-bgc-bai">
			<mu-list>
				<mu-list-item button @click="xzyn.go('/notes/notes_list')">
					<mu-list-item-action>
						<mu-icon color="info" size="30" value=":fa fa-th"></mu-icon>
					</mu-list-item-action>
					<mu-list-item-content>
						<mu-list-item-title>笔记圈</mu-list-item-title>
						<mu-list-item-sub-title>其它朋友公开的笔记都在这里</mu-list-item-sub-title>
					</mu-list-item-content>
					<mu-list-item-action>
						<mu-icon value=":fa fa-angle-right"></mu-icon>
					</mu-list-item-action>
				</mu-list-item>
			</mu-list>
		</div>
		<div class="x-bgc-bai x-mt-15">
			<mu-list>
				<mu-list-item button @click="show_layer('notes_user_list','我的笔记')">
					<mu-list-item-action>
						<mu-icon color="info" size="30" value=":fa fa-pencil-square-o"></mu-icon>
					</mu-list-item-action>
					<mu-list-item-content>
						<mu-list-item-title>我的笔记</mu-list-item-title>
						<mu-list-item-sub-title>你写的笔记都在这里</mu-list-item-sub-title>
					</mu-list-item-content>
					<mu-list-item-action>
						<mu-icon value=":fa fa-angle-right"></mu-icon>
					</mu-list-item-action>
				</mu-list-item>
			</mu-list>
		</div>
		<mu-button class="x-fd-b x-add-btn" color="info" fab @click="open_add">
			<mu-icon value=":fa fa-pencil" size="22"></mu-icon>
		</mu-button>
		<x-layer-view :show="open_layer" :title="title" @change="show_change">
			<keep-alive>
				<component :is="show_view"></component>
			</keep-alive>
		</x-layer-view>
        <x-add :show="open_add_layer" @change="add_change"></x-add>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import xAdd from './add.vue'
import xLayerView from '@/components/x-layer-view'
import notes_user_list from '@/views/notes/notes_user_list'

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xAdd,xLayerView,notes_user_list},
    name: '',
    props: {},
    data() {
        //这里存放数据
        return {
            open_add_layer: false,  // 打开添加层
			show_view: '',
			open_layer: false,
			title: ''

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
	},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //方法集合
    methods: {
		// 打开添加页面
		open_add: function(){
			this.open_add_layer = true;
		},
        // 添加页面触发
        add_change: function(val){
            this.open_add_layer = false;
        },
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
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style>
    /*@import url(); 引入公共css类*/

</style>