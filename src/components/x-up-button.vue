<!-- 上传按钮组件 -->
<template>
    <span class='upload-btn'>
        <mu-button :color="color" :flat="flat" :full-width="fullWidth" :round="round">
            <slot></slot>
        </mu-button>
        <input type="file" ref="file" accept="image/*" @change="on_change">
    </span>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    name: 'upButton',
    props: {
        color: {
            type: String,
            default: ''
        },
        flat: {
            type: Boolean,
            default: false
        },
        fullWidth: {
            type: Boolean,
            default: false
        },
        round: {
            type: Boolean,
            default: false
        },
    },
    data() {
    //这里存放数据
        return {

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
        on_change: function(e){
            var file = this.$refs.file.files[0];
            var URL = window.URL || window.webkitURL;
            var src;
            if (/^image\/png$|jpeg$/.test(file.type)) {
	  	        src = URL.createObjectURL(file);
            } else {
                this.xzyn.msg("请选择一个正确的'jpg jpeg png'图片");
            }
            var r_obj ={
                url: src,
                file: file
            }
            this.$emit('change',r_obj);
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
    /*@import url(); 引入公共css类*//* 上传按钮 */
    .upload-btn {
        position: relative;
        border-radius: 4px;
        display: inline-block;
        line-height: 1;
        margin: 0;
        padding: 0;
    }
    .upload-btn input {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        filter: alpha(opacity=0);
        cursor: pointer;
        width:100%;
        height:100%;
    }

</style>