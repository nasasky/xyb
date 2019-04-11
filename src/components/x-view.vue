<!-- 通用框 -->
<template>
    <div class="x-view" :class="bgimg_class+is_yj+is_yy " :style="style_obj">
        <slot></slot>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    name: '',
    props: {
        bgImg: {
            type: Boolean,
            default: false
        },
        bgColor: {
            type: String,
            default: '#FFFFFF'
        },
        yj: {
            type: Boolean,
            default: false
        },
        yy: {
            type: Number,
            default: 0
        }

    },
    data() {
        //这里存放数据
        return {
            bg_img: '',
            bgimg_class: '',
            style_obj: {
                backgroundImage: '',
                backgroundColor: this.bgColor
            }
        };
    },
    //监听属性 类似于data概念
    computed: {
        is_yj: function(){
            return this.yj?'x-yj-3 ':'x-yj-0 ';
        },
        is_yy: function(){
            return 'x-yy-'+this.yy+' ';
        }
    },
    //监控data中的数据变化
    watch: {
        '$root.bg_img': {
            handler(val,oldval){
                if(this.bgImg){
                    this.style_obj.backgroundImage = val;
                }
            },
            immediate: true,
            deep: true

        },
        bgImg: function(val){
            if(val){
                this.bgimg_class = 'view-bg-img';
                this.style_obj.backgroundImage = this.$root.bg_img;
            }else{
                this.bgimg_class = '';
                this.style_obj.backgroundImage = '';
                this.style_obj.backgroundColor = this.bgColor;
            }
        },
        bgColor: function(val){
            if(!this.bgImg){
                this.style_obj.backgroundColor = val;
            }
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        if(this.bgImg){
            this.bgimg_class = 'view-bg-img ';
            this.style_obj.backgroundImage = this.$root.bg_img;
        }else{
            this.bgimg_class = '';
            this.style_obj.backgroundImage = '';
            this.style_obj.backgroundColor = this.bgColor;
        }

    },
    //方法集合
    methods: {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {}
}
</script>
<style>
    /*@import url(); 引入公共css类*/
    .x-view{
        font-size: 14px;
    }
	.view-bg-img{
		background-color: transparent;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		color:#FFFFFF;
	}

</style>