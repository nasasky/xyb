<!-- 我的关注页面 -->
<template>
    <div class=''>
        <mu-load-more @refresh="init_data" :refreshing="is_refresh" :loading="is_load" :loaded-all="is_load_all" @load="ajax_gengduo">
            <mu-tabs :value.sync="active" color="info" inverse indicator-color="info" full-width @change="tab_change">
                <mu-tab>我关注的</mu-tab>
                <mu-tab>关注我的</mu-tab>
            </mu-tabs>
            <mu-paper class="x-p-5" :z-depth="3">

                <div v-if="active == 0" class="">
                    <x-data-null v-if="focus_data_0.length == 0" text="你还没有关注人"></x-data-null>
                    <mu-grid-list v-else :cols="3" :cell-height="150">
                        <mu-grid-tile v-for="(item,index) in focus_data_0" :key="index" :rows="1" :cols="1">
                            <img :src="item.avatar" @click="xzyn.go('/notes/notes_list?uid='+item.id)">
                            <span slot="title">{{item.name}}</span>
                            <mu-button slot="action" icon @click="del_ajax(item)">
                                <mu-icon size="20" value=":fa fa-close"></mu-icon>
                            </mu-button>
                        </mu-grid-tile>
                    </mu-grid-list>
                </div>
                <div v-if="active == 1" class="">
                    <x-data-null v-if="focus_data_1.length == 0" text="还没有人关注你"></x-data-null>
                    <mu-grid-list v-else :cols="3" :cell-height="150">
                        <mu-grid-tile v-for="(item,index) in focus_data_1" :key="index" :rows="1" :cols="1">
                            <img :src="item.avatar" @click="xzyn.go('/notes/notes_list?uid='+item.id)" >
                            <span slot="title">{{item.name}}</span>
                        </mu-grid-tile>
                    </mu-grid-list>
                </div>
            </mu-paper>
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
            // userData: {},
            focus_data_0: [],	// 我关注的
            focus_data_1: [],	// 关注我的
            add_data: {
                type: 0,
                page: 1
            },
            active: 0,	// 顶部选项卡当前选中的
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
		this.init_data();
    },
    //方法集合
    methods: {
        // 初始化数据
        init_data: function(){
            this.is_refresh = true,	// 刷新中，
            this.is_load_all = false, // 没有数据啦
            this.add_data.page = 1;
            if( this.add_data.type == 0 ){
                this.focus_data_0 = [];	// 数据
            }else{
                this.focus_data_1 = [];	// 数据
            }
            this.ajax_data();
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            _this.xzyn.ajax(_this.request_url.focus_index,'get',_this.add_data,{},function(data,res){
                _this.is_load = false;  // 加载中
                _this.is_refresh = false;	// 刷新中，
                if( data.length > 0 ){
                    _this.is_load_all = false;
                    if( _this.add_data.type == 0 ){
                        if( _this.focus_data_0.length == 0 ){
                            _this.focus_data_0 = data;
                        }else{
                            _this.focus_data_0 = _this.focus_data_0.concat(data);
                        }
                    }else{
                        if( _this.focus_data_1.length == 0 ){
                            _this.focus_data_1 = data;
                        }else{
                            _this.focus_data_1 = _this.focus_data_1.concat(data);
                        }
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
        // 顶部选项卡触发
        tab_change: function(val){
            this.add_data.type = val;
            if( val == 0 ){
                if( this.focus_data_0.length == 0 ){
                    this.add_data.page = 1;
                    this.ajax_data();
                }
            }else{
                if( this.focus_data_1.length == 0 ){
                    this.add_data.page = 1;
                    this.ajax_data();
                }
            }
        },
        // 取消关注
        del_ajax: function(item){
            var _this = this;
            var add_data = {
                type: 0,
                uid: item.id
            }
            this.$confirm('你真的不再关注（'+item.name+'）吗？', '提示').then((res)=>{
                if( res.result ){
                    this.xzyn.ajax(_this.request_url.focus_add,'get',add_data,{},function(data,res){
                        _this.init_data();
                    })
                }
            });
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