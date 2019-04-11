<!-- 我的收藏页面 -->
<template>
    <div class=''>
        <mu-load-more @refresh="init_data" :refreshing="is_refresh" :loading="is_load" :loaded-all="is_load_all" @load="ajax_gengduo">
            <x-data-null v-if="notes_data.length == 0" text="没有任何数据"></x-data-null>
            <div v-else class="">
                <mu-card class="x-mb-10" v-for="(item,index) in notes_data" :key="index">
                    <mu-card-header class="x-dwr x-plr-10 x-pt-10 x-pb-0" :title="item.title" :sub-title="item.create_time">
                        <mu-avatar slot="avatar" @click="xzyn.go('../notes/notes_list?uid='+item.uid)">
                            <img :src="item.user_avatar">
                        </mu-avatar>
                    </mu-card-header>
                    <mu-card-text class="x-p-10 x-dwr" @click="xzyn.go('../notes/notes_info?id='+item.id)">
                        <mu-ripple>
                            <div class="x-tc-hui">{{item.describe}}</div>
                        </mu-ripple>
                    </mu-card-text>
                    <mu-card-actions class="x-pb-10 x-pt-0">
                        <mu-badge class="x-mr-5" color="info">
                            <span slot="content"><mu-icon class="x-mr-5" size="12" :value="':fa '+(item.type_icon?item.type_icon:'fa-sliders')"></mu-icon>{{item.type_name}}</span>
                        </mu-badge>
                        <mu-badge v-if="item.is_show == 1" content="已公开" color="secondary"></mu-badge>
                        <mu-menu class="x-fr" cover placement="bottom-end">
                            <mu-button icon small>
                                <mu-icon size="16" value=":fa fa-ellipsis-v"></mu-icon>
                            </mu-button>
                            <mu-list slot="content">
                                <mu-list-item button @click="collect_ajax(item)">
                                    <mu-list-item-title>取消收藏</mu-list-item-title>
                                </mu-list-item>
                            </mu-list>
                        </mu-menu>
                    </mu-card-actions>
                </mu-card>
            </div>
        </mu-load-more>


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
            is_refresh: false,    // 是否刷新
            is_load: false,	// 加载中，
            is_load_all: false, // 没有数据啦
            notes_data: [],	// 笔记数据
            add_data: {
                page: 1
            },

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.init_data();
    },
    //方法集合
    methods: {
        // 初始化回复数据
        init_data: function(){
            this.is_refresh = true,	// 刷新中，
            this.is_load_all = false, // 没有数据啦
            this.add_data.page = 1;
            this.notes_data = [];
            this.ajax_data();
        },
        // 获取回复数据
        ajax_data: function(){
            var _this = this;
            _this.is_load = false;  // 加载中
            _this.is_refresh = false;	// 刷新中，
            _this.xzyn.ajax(_this.request_url.collect_index,'get',_this.add_data,{},function(data,res){
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
        // 回复加载更多
        ajax_gengduo: function(){
            if( !this.is_load_all ){
                this.is_load = true;	// 加载中，
                this.add_data.page += 1;
                this.ajax_data();
            }
        },
        // 取消收藏
        collect_ajax: function(item){
            var _this = this;
            var add_data = {
                type: 0,
                notes_id: item.id
            }
            this.$confirm('确定要取消收藏吗？', '提示').then((res)=>{
                if( res.result ){
                    this.xzyn.ajax(_this.request_url.collect_add,'get',add_data,{},function(data,res){
                        var new_data = [];
                        for (var i = 0; i < _this.notes_data.length; i++) {
                            if( _this.notes_data[i].id !== item.id ){
                                new_data.push(_this.notes_data[i]);
                            }
                        }
                        _this.notes_data = new_data;
                    })
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