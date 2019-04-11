<!-- 首页 -->
<template>
	<div>
		<x-comtent :value="val" @change="on_comtent_change" :init-img="img_arr" is-up-img></x-comtent>

	</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import xComtent from '@/components/x-comtent.vue'
export default {
	//import引入的组件需要注入到对象中才能使用
	components: {xComtent},
	name: '',
	props: {},
	data() {
		//这里存放数据
		return {
			img_arr: [],
			val: ''
		}
	},
	//监听属性 类似于data概念
	computed: {},
	//监控data中的数据变化
	watch: {},
	//生命周期 - 创建完成（可以访问当前this实例）
	created() {},
	//方法集合
	methods: {
		// 内容触发
		on_comtent_change: function(val,img){
			this.val = val;
			this.img_arr = img;
		}

	},
	//生命周期 - 挂载完成（可以访问DOM元素）
	mounted() {}
}
</script>
<style>
	/*@import url(); 引入公共css类*/
    .v-note-wrapper .v-note-panel .v-note-show .v-show-content{
        padding:10px;
    }

</style>