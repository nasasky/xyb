<!-- 全屏弹层组件 -->
<template>
    <div class=''>
        <mu-dialog class="x-gd-y layer-view" width="100%" transition="slide-bottom" fullscreen :open.sync="open_layer">
            <mu-appbar color="primary" :title="title" class="x-dwf-lt x-w-1">
                <mu-button slot="left" icon @click="open_layer = false">
                    <mu-icon size="20" value=":fa fa-close"></mu-icon>
                </mu-button>
            </mu-appbar>
			<div class="layer-content">
				<slot></slot>
			</div>
        </mu-dialog>
    </div>
</template>

<script>
//例如：import 《组件名称》 from '《组件路径》';

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    name: '',
    props: {
        show: {
            type: [Boolean],
            default: false
        },
        title: String
    },
    data() {
        //这里存放数据
        return {
            open_layer: false
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        show: function(val){
            this.open_layer = val;
        },
        open_layer: function(val){
            this.$emit('change',val)
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //方法集合
    methods: {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {}
}
</script>
<style>
    /*@import url(); 引入公共css类*/
    .mu-dialog{
        background-color: #f5f5f5;
    }
    .layer-view{
        height:100%;
        background-color: #f5f5f5;
    }
	.layer-content{
        padding-top:56px;
        size: 14px;
	}

</style>