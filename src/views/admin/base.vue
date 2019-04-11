<!-- 管理后台基础页面 -->
<template>
    <div>
        <mu-appbar class="x-dwf-lt x-w-1" style="z-index: 201;" color="primary">
            <!-- <mu-button v-if="back_btn" icon slot="left" @click="xzyn.go()">
                <mu-icon size="20" value=":fa fa-chevron-left"></mu-icon>
            </mu-button> -->
            <span class="" @click="xzyn.go('/')">{{$root.title}}</span>
            <mu-button flat slot="right" @click="open_cbl" v-show="show_cbl_btn">
                <mu-icon size="24" value=":fa fa-sliders"></mu-icon>
            </mu-button>
        </mu-appbar>
        <x-admin-cbl ref="cebianlan"></x-admin-cbl>
        <mu-fade-transition>
            <router-view class='admin-content' :style="{paddingLeft:paddingLeft}"></router-view>
        </mu-fade-transition>
    </div>
</template>

<script>
//例如：import 《组件名称》 from '《组件路径》';
import xAdminCbl from '@/components/admin/x-admin-cbl.vue'
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xAdminCbl},
    name: '',
    props: {},
    data() {
        //这里存放数据
        return {
            paddingLeft: '0px',
            show_cbl_btn: false
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        '$root.viewWidth': {
            handler: function (val, oldVal) {
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
    created() {
    },
    //方法集合
    methods: {
        // 打开侧边栏按钮
        open_cbl: function(){
            var cbl = this.$refs.cebianlan;
            if( cbl.show_left ){
                cbl.show_left = false;
            }else{
                cbl.show_left = true;
            }
        },
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {},
}
</script>
<style>
    /*@import url(); 引入公共css类*/
    .admin-content {
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
        .admin-content{
            padding-top: 56px;
        }
    }
</style>