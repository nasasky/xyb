<!-- 笔记二级回复列表组件 -->
<template>
<div>
    <mu-dialog width="100%" transition="slide-bottom" fullscreen scrollable :padding="0" :open.sync="is_show_list">
        <mu-appbar class="x-dwf-lt x-w-1" color="primary" title="回复详情">
            <mu-button slot="left" icon @click="is_show_list = false">
                <mu-icon size="20" value=":fa fa-close"></mu-icon>
            </mu-button>
        </mu-appbar>
        <div class="reply-content">
            <div class="">
                <mu-card>
                    <mu-card-header class="x-p-10" :title="f_data.user_name" sub-title="楼主">
                        <mu-avatar slot="avatar">
                            <img :src="f_data.user_avatar">
                        </mu-avatar>
                    </mu-card-header>
                    <mu-card-text class="x-plr-10 x-ptb-0">{{f_data.content}}</mu-card-text>
                    <mu-card-actions class="x-p-10">
                        <span class="x-mr-10"><mu-icon size="14" value=":fa fa-clock-o"></mu-icon>{{f_data.create_time}}</span>
                        <mu-icon class="x-mr-5" size="14" value=":fa fa-commenting-o"></mu-icon>{{f_data.reply_num}}
                        <mu-button class="x-fr" color="info" small @click="open_add_layer(f_data)">
                            <mu-icon class="x-mr-5" size="14" value=":fa fa-commenting-o"></mu-icon>回复
                        </mu-button>
                    </mu-card-actions>
                </mu-card>
            </div>
            <x-data-null v-if="reply_data.length == 0" text="没有回复数据"></x-data-null>
            <div v-else>
                <mu-sub-header v-if="reply_data.length > 0">全部回复</mu-sub-header>
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
                        <div class="x-dwr x-w-1">
                            <div class="x-lh-20">{{item.content}}</div>
                            <div class="x-tc-hui">
                                <span class="x-mr-10"><mu-icon size="14" value=":fa fa-clock-o"></mu-icon>{{item.create_time}}</span>
                            </div>
                        </div>
                    </div>
                </mu-paper>
            </div>
            <div class="x-tc">
                <mu-button flat color="primary" :disabled="is_load_all" @click="ajax_reply_gengduo">
                    <span v-if="is_load_all">没有更多数据</span><span v-else>查看更多...</span>
                </mu-button>
            </div>
        </div>
    </mu-dialog>
    <x-add-notes-reply :show="is_show_add_layer" :data="add_reply_data" @change="on_add_change"></x-add-notes-reply>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import xAddNotesReply from '@/components/x-add-notes-reply'
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xAddNotesReply},
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
            is_show_list: false,	// 二级回复列表
            f_data: {}, // 楼主数据
            reply_data: [],	// 二级回复数据
            add_data: {
                id: '',
                reply_id: '',
                page: 1
            },
            is_load_all: false, // 没有数据啦
            is_show_add_layer: false,    // 添加回复层
            add_reply_data: {}

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        show: function(val){
            this.is_show_list = val;
            val?this.init_reply_data():'';
        },
        is_show_list: function(val){
            val == false?this.$emit('change'):'';
        },
        data:{
            handler(val,oldval){
                this.f_data = val;
                this.add_data.id = val.notes_id;
                this.add_data.reply_id = val.id;
            },
            immediate: true,
            deep: true
        }

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //方法集合
    methods: {
        // 初始化二级回复数据
        init_reply_data: function(){
            this.is_load_all = false;
            this.add_data.page = 1;
            this.reply_data = [];
            this.ajax_reply_data();
        },
        // 获取回复数据
        ajax_reply_data: function(){
            var _this = this;
            _this.xzyn.ajax(_this.request_url.notes_reply_index,'get',_this.add_data,{},function(data,res){
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
        // 二级回复加载更多
        ajax_reply_gengduo: function(){
            if( !this.is_load_all ){
                this.add_data.page += 1;
                this.ajax_reply_data();
            }
        },
        // 打开回复层
        open_add_layer: function(item){
            this.is_show_add_layer = true;
            this.add_reply_data = {
                pid: item.id,
                notes_id: item.notes_id
            }
        },
        // 添加回复回调触发
        on_add_change: function(val){
            this.is_show_add_layer = false;
            if(val == 'load'){
                this.init_reply_data();
            }
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

    }
}
</script>
<style>
    /*@import url(); 引入公共css类*/

</style>