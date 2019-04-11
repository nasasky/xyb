<!-- 图片上传组件 -->
<template>
    <div>
        <x-up-btn :color="color" :flat="flat" :full-width="fullWidth" :round="round" @change="on_up_img">
            <slot></slot>
        </x-up-btn>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import xUpBtn from '@/components/x-up-button.vue'

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xUpBtn},
    name: '',
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
        inputKey: {     // 表单key
            type: String,
            default: ''
        },
        delImg: String  // 删除的图片
    },
    data() {
        //这里存放数据
        return {

        };
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        delImg: {  // 监听删除的图片
            handler(val){
                if(val){
                    this.del_img(val);  // 删除图片
                }
            },
            immediate: true,
            deep: true
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //方法集合
    methods: {
        // 上传图片按钮触发
        on_up_img: function(obj){
            var _this = this;
            // 上传图片
            var formData = new FormData();
            formData.append('file',obj.file);
            formData.append('dir','image');
            _this.xzyn.ajax('/admin/uploads/index','post',formData,{},(data,res)=>{
                _this.$emit('change',data,_this.inputKey);
            },false)
        },
        // 删除图片
        del_img: function(url){
            var _this = this;
            _this.xzyn.ajax('/admin/uploads/delimg','post',{imgurl:url},{},(data,res)=>{
            },false)
        }

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {}
}
</script>
<style>
    /*@import url(); 引入公共css类*/

</style>