<!-- 清理缓存 -->
<template>
    <div>
        <div class="x-p-10">
            <mu-alert color="success">
                <mu-icon left value=":fa fa-check"></mu-icon> 清理成功
            </mu-alert>
        </div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    name: '',
    props: {},
    data() {
        //这里存放数据
        return {

        };
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.add_ajax();
    },
    //方法集合
    methods: {
        // 提交
        add_ajax: function() {
            var _this = this;
            _this.xzyn.ajax('/admin/index/cleancache','get',{},{},function(data,res){
                for (let i = 0; i < data.length; i++) {
                    const url_item = data[i];
                    data[i].name = '/admin/'+url_item.name;
                }
                _this.xzyn.edit_data('url_list',data);
                _this.$root.url_list = data;
                _this.xzyn.go();
            })
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

</style>