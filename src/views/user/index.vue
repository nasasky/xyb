<!-- 用户中心通用主页 -->
<template>
<div>
    <div class="x-bottom-nav">
        <mu-bottom-nav class=" x-b-t " :value.sync="show_view_value" @change="change_name" color="grey50" shift>
            <mu-bottom-nav-item title="记账" value="index" icon=":fa fa-pencil"></mu-bottom-nav-item>
            <mu-bottom-nav-item title="账单" value="bill" icon=":fa fa-bar-chart-o"></mu-bottom-nav-item>
            <mu-bottom-nav-item title="分类" value="report" icon=":fa fa-pie-chart"></mu-bottom-nav-item>
            <mu-bottom-nav-item title="笔记" value="notes" icon=":fa fa-file-word-o"></mu-bottom-nav-item>
            <mu-bottom-nav-item title="我的" value="user" icon=":fa fa-user-o"></mu-bottom-nav-item>
        </mu-bottom-nav>
    </div>
    <div class='content'>
        <keep-alive>
            <component :is="show_view"></component>
        </keep-alive>
    </div>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import index from '@/views/account/index/index'
import bill from '@/views/account/bill/index'
import report from '@/views/account/report/index'
import notes from '@/views/notes/index'
import user from '@/views/user/indexs'

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {index,bill,report,notes,user},
    data() {
    //这里存放数据
        return {
            show_view: 'index',
            show_view_value: 'index'
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //方法集合
    methods: {
        // 点击底部导航触发
        change_name: function(val){
            this.show_view = val;
            this.show_view_s = val;
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
    .content{
        padding-bottom:66px;
	}
    .x-bottom-nav{
        position: fixed;
        bottom:0;
        left: 0;
        width:100%;
        z-index: 100;
        padding-left: 256px;
    }
    .mu-bottom-nav-shift{
        color: hsla(0, 0%, 25%, 0.7);
    }
    .mu-bottom-item-active.is-shift{
        color: #2196f3;
    }
    /*兼容手机端样式*/
    @media (max-width: 600px) {
        .x-bottom-nav{
            padding-left: 0px;
        }
    }
</style>