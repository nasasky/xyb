<!-- 添加笔记回复组件 -->
<template>
    <div>
        <mu-dialog width="100%" transition="slide-bottom" :open.sync="is_show_layer">
            <div class="">
                <mu-form ref="form" :model="add_reply_data">
                    <mu-form-item label="回复内容" label-float help-text="内容在4~200个字符之间" prop="content" :rules="contentRules">
                        <mu-text-field v-model="add_reply_data.content" full-width multi-line
                            :rows="3" :rows-max="8" :max-length="200"></mu-text-field>
                    </mu-form-item>
                    <mu-form-item class="x-pb-0 x-mb-0">
                        <div class="x-w-1 x-tc">
                            <mu-button color="primary" @click="reply_ajax" >提交</mu-button>
                        </div>
                    </mu-form-item>
                </mu-form>
            </div>
        </mu-dialog>
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
        show: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object,
            default: {}
        }
    },
    data() {
        //这里存放数据
        return {
            add_reply_data:{	// 回复提交的数据
                content: '',
                notes_id: '',
                pid: 0
            },
            is_show_layer: false,
            contentRules: [
                { validate: (val) => !!val, message: '必须填写内容'},
                { validate: (val) => val.length >= 4 && val.length <= 200, message: '内容长度大于4小于200'}
            ],

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        show: function(val){
            val?this.add_reply_data.content = '':'';
            this.is_show_layer = val;
        },
        is_show_layer: function(val){
            if(val == false){
                this.$emit('change');
            }
        },
        data:{
            handler(val,oldval){
                this.add_reply_data.pid = val.pid;
                this.add_reply_data.notes_id = val.notes_id;
            },
            immediate: true,
            deep: true
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //方法集合
    methods: {
        // 回复提交
        reply_ajax: function(){
            var _this = this;
            this.$refs.form.validate().then((result) => {
                if( result ){
                    _this.xzyn.ajax(_this.request_url.notes_reply_add,'post',_this.add_reply_data,{},function(data,res){
                        _this.is_show_layer = false;
                        _this.$emit('change','load');
                    },false)
                }
            });
        },

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

</style>