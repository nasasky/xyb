<!-- 记账分类/笔记分类首页 -->
<template>
    <div class=''>
        <mu-tabs :value.sync="type" @change="tabs_change" inverse color="info" indicator-color="info" full-width>
            <mu-tab>支出分类</mu-tab>
            <mu-tab>收入分类</mu-tab>
            <mu-tab>笔记分类</mu-tab>
        </mu-tabs>
        <mu-load-more @refresh="ajax_data" :refreshing="is_refresh">
            <x-account-type-list :data="data" :color="color" :type="type" @change="on_change"></x-account-type-list>
        </mu-load-more>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import xAccountTypeList from '@/components/x-account-type-list'
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xAccountTypeList},
    name: '',
    props: {},
    data() {
        //这里存放数据
        return {
            account_type_0: [],	// 支出分类数据
            account_type_1: [],	// 收入分类数据
            account_type_2: [],	// 笔记分类数据
            is_refresh: false,    // 是否刷新
            data: [],
            color: 'secondary',
            type: 0     // 0 支出 1收入 2 笔记

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.account_type_0 = this.xzyn.edit_data('account_type_0');
        this.account_type_1 = this.xzyn.edit_data('account_type_1');
        this.account_type_2 = this.xzyn.edit_data('account_type_2');
        this.data = this.xzyn.edit_data('account_type_0');
    },
    //方法集合
    methods: {
        // 顶部支出/收入选项卡
        tabs_change: function(index){
            if(index == 2){
                this.type = index;
                this.data = this.account_type_2;
                this.color = 'info';
            }else if(index == 1){
                this.type = index;
                this.data = this.account_type_1;
                this.color = 'success';
            }else if(index == 0){
                this.type = index;
                this.data = this.account_type_0;
                this.color = 'secondary';
            }
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            _this.is_refresh = true;
            this.xzyn.ajax(_this.request_url.account_type_index,'get',{},{},function(data,res){
                _this.is_refresh = false;
                _this.type == 0 ? _this.data = data.account_type_0 : '';
                _this.type == 1 ? _this.data = data.account_type_1 : '';
                _this.type == 2 ? _this.data = data.account_type_2 : '';
                _this.account_type_0 = data.account_type_0;
                _this.account_type_1 = data.account_type_1;
                _this.account_type_2 = data.account_type_2;
                _this.xzyn.edit_data('account_type_0',data.account_type_0);
                _this.xzyn.edit_data('account_type_1',data.account_type_1);
                _this.xzyn.edit_data('account_type_2',data.account_type_2);
            },false)
        },
        // 列表组件回调触发
        on_change: function(data){
            this.type == 0 ? this.data = data.account_type_0 : '';
            this.type == 1 ? this.data = data.account_type_1 : '';
            this.type == 2 ? this.data = data.account_type_2 : '';
            this.account_type_0 = data.account_type_0;
            this.account_type_1 = data.account_type_1;
            this.account_type_2 = data.account_type_2;
            this.xzyn.edit_data('account_type_0',data.account_type_0);
            this.xzyn.edit_data('account_type_1',data.account_type_1);
            this.xzyn.edit_data('account_type_2',data.account_type_2);
        }

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {}
}
</script>
<style>
    /*@import url(); 引入公共css类*/
	/* .x-icon-list{
		display:inline-block;
		width:20%;
	} */

</style>