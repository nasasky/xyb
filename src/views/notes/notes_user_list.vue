<!-- 我的笔记页面 -->
<template>
    <div class=''>
		<div class="x-t-no x-dwf-lt x-type x-b-b x-gd-x">
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
		<div class="x-ptb-50">
            <mu-load-more @refresh="init_data" :refreshing="is_refresh" :loading="is_load" :loaded-all="is_load_all" @load="ajax_gengduo">
                <x-list :data="notes_data" @change="add_change"></x-list>
            </mu-load-more>
		</div>
		<mu-button class="x-dwf-rb add-btn" color="info" fab @click="open_add_layer = true">
			<mu-icon value=":fa fa-pencil" size="22"></mu-icon>
		</mu-button>
        <x-add :show="open_add_layer" @change="add_change"></x-add>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import xAdd from './add.vue'
import xList from '@/components/x-list.vue'

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xAdd,xList},
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
            open_add_layer: false,  // 打开添加层

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.account_type_2 = this.xzyn.edit_data('account_type_2');
        this.init_data();
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
            _this.xzyn.ajax(_this.request_url.notes_index,'get',_this.add_data,{},function(data,res){
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
        // 添加页面触发
        add_change: function(val){
            this.open_add_layer = false;
            if(val == 'load'){
                this.init_data();
            }
        },

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {}
}
</script>
<style>
    /*@import url(); 引入公共css类*/
	.x-type{
        width:100%;
		top:56px;
		padding:5px 8px;
		background-color: #fff;
	}
	.x-type-btn{
        display: initial;
	}
	.x-type-btn+.x-type-btn{
		margin-left:8px;
	}

</style>