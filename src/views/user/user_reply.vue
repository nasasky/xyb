<!-- 我的回复页面 -->
<template>
    <div class='x-pt-10'>
        <mu-load-more @refresh="init_data" :refreshing="is_refresh" :loading="is_load" :loaded-all="is_load_all" @load="ajax_gengduo">
            <div v-if="reply_data.length == 0" class="x-bgc-bai">
                <x-data-null text="没有任何数据"></x-data-null>
            </div>
            <div v-else class="x-f14">
                <mu-paper class="x-mb-10" :z-depth="3" v-for="(item,index) in reply_data" :key="index">
                    <div class="x-fl x-pt-10 x-pl-10">
                        <mu-avatar>
                            <img :src="item.user_avatar">
                        </mu-avatar>
                    </div>
                    <div class="x-ml-50 x-p-10">
                        <div class="x-lh-28">
                            <span class="x-tw">{{item.user_name}}</span>
                            <mu-button class="x-fr" style="min-width:60px;" flat small color="secondary" @click="del_ajax(item)">
                                <mu-icon left size="14" value=":fa fa-trash-o"></mu-icon>删除
                            </mu-button>
                        </div>
                        <div class="x-dwr x-w-1" @click="xzyn.go('/notes/notes_info?id='+item.notes_id)">
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
            reply_data: [],	// 回复数据
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
            this.reply_data = [];
            this.ajax_data();
        },
        // 获取回复数据
        ajax_data: function(){
            var _this = this;
            _this.xzyn.ajax(_this.request_url.notes_reply_index,'get',_this.add_data,{},function(data,res){
                _this.is_load = false;  // 加载中
                _this.is_refresh = false;	// 刷新中，
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
        ajax_gengduo: function(){
            if( !this.is_load_all ){
                this.is_load = true;	// 加载中，
                this.add_data.page += 1;
                this.ajax_data();
            }
        },
        // 删除回复
        del_ajax: function(item){
            this.$confirm('删除后不可恢复，确定要删除吗？', '提示').then((res)=>{
                var _this = this;
                if( res.result ){
                    _this.xzyn.ajax(_this.request_url.notes_reply_delete,'get',{id:item.id},{},function(data,res){
                        _this.init_data();
                    },false)
                }
            });
        }


    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {}
}
</script>
<style>
    /*@import url(); 引入公共css类*/

</style>