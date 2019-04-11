<template>
    <div id="app">
        <mu-fade-transition>
            <router-view class="app-view"></router-view>
        </mu-fade-transition>
    </div>
</template>
<script>
//例如：import 《组件名称》 from '《组件路径》';
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {
    },
    data() {
    //这里存放数据
        return {
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
    },
    //方法集合
    methods: {
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
    }
}
</script>
<style >
    .app-view {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #f5f5f5;
    }
</style>
