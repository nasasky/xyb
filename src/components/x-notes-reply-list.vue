<!-- 笔记回复列表组件 -->
<template>
    <div>
        <mu-load-more :loading="is_load" :loaded-all="is_load_all" @load="ajax_reply_gengduo">
            <x-data-null v-if="reply_data.length == 0" text="没有回复数据"></x-data-null>
            <div v-else>
                <mu-sub-header>全部评论</mu-sub-header>
                <mu-paper class="x-mb-10" :z-depth="3" v-for="(item,index) in reply_data" :key="index">
                    <div class="x-fl x-pt-10 x-pl-10">
                        <mu-avatar>
                            <img :src="item.user_avatar">
                        </mu-avatar>
                    </div>
                    <div class="x-ml-50 x-p-10">
                        <div class="x-lh-28">
                            <span class="x-tw">{{item.user_name}}</span>
                            <mu-button class="x-fr" style="min-width:60px;" flat small @click="zan_ajax(item)">
                                <mu-icon left size="14" value=":fa fa-thumbs-o-up"></mu-icon>{{item.zan_num}}
                            </mu-button>
                        </div>
                        <div class="x-dwr x-w-1" @click="open_reply_list_layer(item)">
                            <mu-ripple>
                                <div class="x-lh-20">{{item.content}}</div>
                                <div class="x-tc-hui">
                                    <span class="x-mr-10"><mu-icon size="14" value=":fa fa-clock-o"></mu-icon>{{item.create_time}}</span>
                                    <span><mu-icon class="x-mr-5" size="14" value=":fa fa-commenting-o"></mu-icon>{{item.reply_num}}</span>
                                </div>
                            </mu-ripple>
                        </div>
                    </div>
                </mu-paper>
            </div>
        </mu-load-more>
        <!-- 回复列表二层 -->
        <x-notes-reply-lists :show="is_show_reply_layer" :data="add_obj" @change="on_reply_change"></x-notes-reply-lists>

    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import xNotesReplyLists from '@/components/x-notes-reply-list-s'

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xNotesReplyLists},
    name: '',
    props: {
        id: Number
    },
    data() {
        //这里存放数据
        return {
            add_data: {
                id: '',
                page: 1
            },
            reply_data: [],	// 回复数据
            reply_data_2: [],	// 二级回复数据
            xuan_reply_obj: {},
            is_load: false,	// 加载中，
            is_load_all: false, // 没有数据啦
            is_show_reply_layer: false,     // 二层回复页面层
            add_obj: {}

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        id:{
            handler(val,oldval){
                this.add_data.id = val;
                // this.init_reply_data();
            },
            // immediate: true,
            deep: true
        }

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //方法集合
    methods: {
        // 初始化回复数据
        init_reply_data: function(){
            this.is_load = false;
            this.is_load_all = false;
            this.add_data.page = 1;
            this.reply_data = [];
            this.ajax_reply_data();
        },
        // 获取回复数据
        ajax_reply_data: function(){
            var _this = this;
            _this.xzyn.ajax(_this.request_url.notes_reply_index,'get',_this.add_data,{},function(data,res){
                _this.is_load = false;
                if( data.length > 0 ){
                    _this.is_load_all = false;
                    if( _this.reply_data.length > 0 ){
                        _this.reply_data = _this.reply_data.concat(data);
                    }else{
                        _this.reply_data = data;
                    }
                }else{
                    _this.is_load_all = true;
                }
            },false)
        },
        // 回复加载更多
        ajax_reply_gengduo: function(){
            if( !this.is_load_all ){
                this.is_load = true;
                this.add_data.page += 1;
                this.ajax_reply_data();
            }
        },
        // 打开二级回复列表
        open_reply_list_layer: function(item){
            this.is_show_reply_layer = true;
            this.add_obj = item;
        },
        // 二级回复列表回调
        on_reply_change:function(val){
            this.is_show_reply_layer = false;
            val == 'load'?this.init_reply_data():'';
        },
        // 赞提交
        zan_ajax: function(item=''){
            var _this = this;
            var add_data= {
                notes_id: '',
                reply_id: item.id
            }
            this.xzyn.ajax(_this.request_url.notes_zan_add,'get',add_data,{},function(data,res){
                for (var i = 0; i < _this.reply_data.length; i++) {
                    if( _this.reply_data[i].id == item.id ){
                        _this.reply_data[i].zan_num += 1;
                    }
                }
            })
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