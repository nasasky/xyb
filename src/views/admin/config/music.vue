<!-- 音乐播放器页面 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="false" to="/admin/config/index">系统配置字段列表</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">音乐播放器配置</mu-breadcrumbs-item>
            </mu-breadcrumbs>
            <div>
                <mu-tabs v-model="show_view"  inverse indicator-color="info" full-width @change="on_tab_change">
                    <mu-tab value="music_config">播放器设置</mu-tab>
                    <mu-tab value="music_index">本地音乐列表</mu-tab>
                    <mu-tab value="music_create">添加音乐</mu-tab>
                </mu-tabs>
            </div>
        </div>
        <div class="x-plr-10 x-pb-10 music-tab">
            <mu-paper class="x-p-10" :z-depth="4">
                <keep-alive>
                    <component :is="show_view"></component>
                </keep-alive>
            </mu-paper>
        </div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import music_config from '@/views/admin/config/music-config.vue'
import music_index from '@/views/admin/music/index.vue'
import music_create from '@/views/admin/music/create.vue'

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {music_config,music_index,music_create},
    props: {},
    data() {
        //这里存放数据
        return {
            show_view: 'music_config',
            id: ''
        };
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //方法集合
    methods: {
        // 顶部选项卡触发
        on_tab_change: function(val,id=''){
            this.show_view = val;
            this.id = id;
        }

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {}
}
</script>
<style>
    /*@import url(); 引入公共css类*/
    .x-breadcrumbs{
        position: fixed;
        z-index: 9;
        width:100%;
        top: 64px;
        left: 0px;
        padding-left: 256px;
        background-color:#fafafa;
    }
    .music-tab{
        padding-top: 103px;
    }
    /*兼容手机端样式*/
    @media (max-width: 600px) {
        .x-breadcrumbs{
            top: 56px;
            padding-left: 0px;
        }
    }

</style>