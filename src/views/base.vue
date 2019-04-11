<!-- 手机端前台基础页面 -->
<template>
    <div>
        <mu-appbar class="x-dwf-lt x-w-1" color="primary">
            <mu-button v-if="back_btn" icon slot="left" @click="xzyn.go()">
                <mu-icon size="20" value=":fa fa-chevron-left"></mu-icon>
            </mu-button>
            <div class="">{{$root.title}}</div>
            <mu-button flat slot="right" @click="show_cbl = true" v-show="show_cbl_btn">
                <mu-icon size="24" value=":fa fa-sliders"></mu-icon>
            </mu-button>
        </mu-appbar>
        <mu-fade-transition>
            <router-view class="x-base-view" :style="{paddingLeft:paddingLeft}"></router-view>
        </mu-fade-transition>
        <ce-bian-lan :show="show_cbl" @change="on_cbl_change"></ce-bian-lan>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import ceBianLan from '@/components/x-cebianlan.vue'

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {ceBianLan},
    name: '',
    props: {},
    data() {
        //这里存放数据
        return {
            show_cbl: false,
            back_btn: true,  // 后退按钮
            show_cbl_btn: false,
            paddingLeft: '0px',

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        $route:{
            handler(val,oldval){
                if( val.path == '/' ){
                    this.back_btn = false;
                }else{
                    this.back_btn = true;
                }
            },
            immediate: true,
            // 深度观察监听
            deep: true
        },
        '$root.viewWidth': {
            handler: function (val) {
                if(val >= 600){
                    this.paddingLeft = '256px';
                    this.show_cbl_btn = false;
                }else{
                    this.paddingLeft = '0px';
                    this.show_cbl_btn = true;
                }
            },
            immediate: true
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //方法集合
    methods: {
        // 侧边栏触发
        on_cbl_change: function(val){
            this.show_cbl = val
        }

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {},
}
</script>
<style>
    /*@import url(); 引入公共css类*/
    .x-base-view {
        position: absolute;
        top: 0;
        left: 0;
        z-index: auto;
        width: 100%;
        height: 100%;
        padding-top: 64px;
    }
    /*兼容手机端样式*/
    @media (max-width: 600px) {
        .x-base-view{
            padding-top: 56px;
        }
    }

</style>