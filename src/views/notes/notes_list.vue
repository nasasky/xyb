<!-- 笔记圈页面 -->
<template>
<div>
    <div class="x-plr-10">
        <div class="x-dwf-lt x-notes-type">
            <div class="x-bgc-bai x-b-b x-gd-x x-t-no x-p-5">
                <div class="x-type-btn">
                    <mu-button :flat="add_data.type_id != ''" color="primary" @click="init_data">
                        <mu-icon left value=":fa fa-refresh" size="18" class="x-mr-5"></mu-icon>全部
                    </mu-button>
                </div>
                <div class="x-type-btn" v-for="(item,index) in account_type_2" :key="index">
                    <mu-button :flat="add_data.type_id != item.id" color="primary" @click="type_ajax(item)">
                        <mu-icon left :value="item.icon?':fa '+item.icon:':fa fa-cny'" size="18" class="x-mr-5"></mu-icon>{{item.name}}
                    </mu-button>
                </div>
            </div>
        </div>
        <div class="x-ptb-50">
            <mu-load-more @refresh="init_data" :refreshing="is_refresh" :loading="is_load" :loaded-all="is_load_all" @load="ajax_gengduo">
                <x-list :data="notes_data" @change="on_list_change" current></x-list>
            </mu-load-more>
        </div>
    </div>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import xList from '@/components/x-list.vue'

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xList},
    name: '',
    props: {},
    data() {
        //这里存放数据
        return {
            add_data: {
                // number: 10,	// 一页多少条数据
                search: '',		// 搜索内容
                page: 1,	// 页码
                type_id: '',	// 分类id
                uid: ''
            },
            notes_data:[],	// 笔记数据
            account_type_2: [],	// 笔记分类
            is_refresh: false,    // 是否刷新
            is_load: false,	// 加载中，
            is_load_all: false, // 没有数据啦

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.account_type_2 = this.xzyn.edit_data('account_type_2')||this.$root.public_data.account_type_2;
        if( this.$route.query.uid ){
            this.on_list_change('user',this.$route.query.uid);
        }else{
            this.init_data();
        }
    },
    //方法集合
    methods: {
        // 初始化数据
        init_data: function(){
            this.is_refresh = true,	// 加载中，
            this.is_load_all = false, // 没有数据啦
            this.add_data.page = 1;
            this.add_data.search = '';
            this.add_data.type_id = '';
            this.add_data.uid = '';
            this.notes_data = [];	// 笔记数据
            this.ajax_data();
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            _this.xzyn.ajax(_this.request_url.notes_list,'get',_this.add_data,{},function(data,res){
                _this.is_refresh = false;	// 加载中，
                _this.is_load = false;	// 加载中，
                if( data.length > 0 ){
                    _this.is_load_all = false;
                    if( _this.notes_data.length > 0 ){
                        _this.notes_data = _this.notes_data.concat(data);
                    }else{
                        _this.notes_data = data;
                    }
                }else{
                    _this.is_load_all = true;
                }
            },false)
        },
        // 加载更多数据
        ajax_gengduo: function(){
            if( !this.is_load_all ){
                this.is_load = true;	// 加载中，
                this.add_data.page += 1;
                this.ajax_data();
            }
        },
        // 分类按钮
        type_ajax: function(item){
            this.is_refresh = true,	// 加载中，
            this.is_load_all = false, // 没有数据啦
            this.add_data.page = 1;
            this.add_data.search = '';
            this.add_data.type_id = item.id;
            this.add_data.uid = '';
            this.notes_data = [];	// 笔记数据
            this.ajax_data();
        },
        // 带有uid获取数据
        on_list_change: function(type,uid){
            if( type == 'load'){
                this.init_data();
            }else if( type == 'user'){
                this.add_data.uid = uid;
                this.is_refresh = true,	// 加载中，
                this.is_load_all = false, // 没有数据啦
                this.add_data.page = 1;
                this.add_data.search = '';
                this.add_data.type_id = '';
                this.notes_data = [];	// 笔记数据
                this.ajax_data();
            }
        },
        // 关注用户
        focus_ajax: function(uid){
            var _this = this;
            var add_data = {
                type: 1,
                uid: uid
            }
            this.xzyn.ajax(_this.request_url.focus_add,'get',add_data,{},function(data,res){
            })
        },

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {}
}
</script>
<style>
    /*@import url(); 引入公共css类*/
	.x-notes-type{
        width:100%;
		top:64px;
        padding-left: 256px;
		/* padding:5px 8px; */
		/* background-color: #fff; */
	}
	.x-type-btn{
        display: initial;
	}
	.x-type-btn+.x-type-btn{
		margin-left:8px;
	}
    /*兼容手机端样式*/
    @media (max-width: 600px) {
        .x-notes-type{
            top: 56px;
            padding-left: 0px;
        }
    }
</style>