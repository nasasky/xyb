<!-- 记账首页 -->
<template>
    <div class=''>
        <mu-load-more @refresh="ajax_init" :refreshing="is_refresh">
            <div class="x-plr-10 x-pt-10">
                <mu-paper :z-depth="3">
                    <x-view bg-img yj>
                        <mu-sub-header class="x-tc-bai">本月支出（元）</mu-sub-header>
                        <div class="x-plr-10 x-lh-30">
                            <span style="font-size:30px;">￥{{money_num_0}}</span>
                        </div>
                        <mu-row class="x-plr-10 x-pb-10">
                            <mu-col span="6" class="x-lh-40">
                                <span class="x-mr-5">本月收入</span><span>￥{{money_num_1}}</span>
                            </mu-col>
                            <mu-col span="6" class="x-tr x-lh-40">
                                <mu-button class="x-tc-bai" small flat @click="show_layer('budget_index','支出预算')">{{budget_money_num}}</mu-button>
                            </mu-col>
                        </mu-row>
                    </x-view>
                </mu-paper>
            </div>
            <x-data-null v-if="account_length == 0" text="最近你没有记账哦"></x-data-null>
            <div v-else>
            <mu-sub-header>近三日新增的账单 {{account_length}}笔</mu-sub-header>
                <mu-paper :z-depth="2">
                    <mu-list textline="two-line" v-for="(item,index) in accountData" :key="index" v-if="item.create_time != (index != (account_length-1)? accountData[index+1].create_time:'') ">
                        <mu-sub-header>{{item.create_time}}</mu-sub-header>
                        <mu-list-item button v-for="(vo,ii) in accountData" :key="ii" v-if="item.create_time == vo.create_time">
                            <mu-list-item-action>
                                <mu-avatar :color="vo.type == 0 ? 'secondary' : 'success'">
                                    <mu-icon :value="':fa '+ (vo.icon ? vo.icon:'fa-cny')" size="20"></mu-icon>
                                </mu-avatar>
                            </mu-list-item-action>
                            <mu-list-item-content>
                                <mu-list-item-title>{{vo.type_name}}
                                    <mu-badge class="x-fr" :content="'￥'+vo.money" :color="vo.type == 0 ? 'secondary' : 'success'"></mu-badge>
                                </mu-list-item-title>
                                <mu-list-item-sub-title>{{vo.describe}}</mu-list-item-sub-title>
                            </mu-list-item-content>
                            <mu-list-item-action>
                                <mu-menu cover placement="bottom-end">
                                    <mu-button icon>
                                        <mu-icon value=":fa fa-ellipsis-v"></mu-icon>
                                    </mu-button>
                                    <mu-list slot="content">
                                        <mu-list-item button @click="go_edit('edit',vo)">
                                            <mu-list-item-title>编辑</mu-list-item-title>
                                        </mu-list-item>
                                        <mu-list-item button @click="go_edit('del',vo)">
                                            <mu-list-item-title>删除</mu-list-item-title>
                                        </mu-list-item>
                                    </mu-list>
                                </mu-menu>
                            </mu-list-item-action>
                        </mu-list-item>
                        <mu-divider></mu-divider>
                    </mu-list>
                </mu-paper>
            </div>
        </mu-load-more>
		<mu-button class="x-fd-b x-add-btn" color="info" fab @click="go_edit('add')">
			<mu-icon value=":fa fa-pencil" size="22"></mu-icon>
		</mu-button>
        <x-add :show="open_add_layer" @change="add_change" :type_0="account_type_0" :type_1="account_type_1"></x-add>
		<x-layer-view :show="open_layer" :title="title" @change="show_change">
			<keep-alive>
				<component :is="show_view"></component>
			</keep-alive>
		</x-layer-view>

    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import xAdd from './add.vue'
import xLayerView from '@/components/x-layer-view'
import budget_index from '@/views/account/index/budget_index'
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xAdd,xLayerView,budget_index},
    name: '',
    props: {},
    data() {
        //这里存放数据
        return {
            accountData:[],	// 近三周账单数据
            money_num_0: 0.00,	// 本月支出金额
            money_num_1: 0.00,	// 本月收入金额
            account_type_0: [],	// 支出分类数据
            account_type_1: [],	// 收入分类数据
            account_type_2: [],	// 笔记分类数据
            account_config: {},	// 预算金额
            del_id: '',	// 删除ID
            open_add_layer: false,  // 打开添加账单层
            is_refresh: false,    // 是否刷新
			show_view: '',
			open_layer: false,
            title: ''
        };
    },
    //监听属性 类似于data概念
    computed: {
        budget_money_num: function(){
            if(this.account_config){
                var mb = this.xzyn.filter_money(this.account_config.money) * 100;
                var mn_0 = this.xzyn.filter_money(this.money_num_0) * 100;
                if( mb == 0 ){
                    return '请设置预算金额';
                }else{
                    if( mb > mn_0 ){	// 没有超出预算
                        var moneys = (mb - mn_0)/100;
                        return '预算剩余：￥' + this.xzyn.filter_money(moneys);
                    }else{	// 超出预算
                        var moneys = (mn_0 - mb)/100;
                        return '预算超支：￥' + this.xzyn.filter_money(moneys);
                    }
                }
            }else{
                return '请设置预算金额';
            }
        },
        account_length: function(){
            return this.accountData?this.accountData.length:0;
        }
    },
    //监控data中的数据变化
    watch: {
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.ajax_init()
    },
    //方法集合
    methods: {
        // 加载首页数据
        ajax_init: function(){
            var _this = this;
            _this.is_refresh = true;
            this.xzyn.ajax(_this.request_url.account_index,'get',{},{},function(data,res){
                _this.is_refresh = false;
                _this.accountData = data.accountData;
                _this.account_type_0 = data.account_type_0;
                _this.account_type_1 = data.account_type_1;
                _this.account_type_2 = data.account_type_2;
                _this.account_config = data.account_config;
                var money_0 = _this.xzyn.filter_money(data.money_num_0),	// 本月支出金额
                    money_1 = _this.xzyn.filter_money(data.money_num_1);	// 本月收入金额
                _this.money_num_0 = money_0;
                _this.money_num_1 = money_1;
                _this.xzyn.edit_data('account_type_0',data.account_type_0);
                _this.xzyn.edit_data('account_type_1',data.account_type_1);
                _this.xzyn.edit_data('account_type_2',data.account_type_2);
                _this.xzyn.edit_data('account_config',data.account_config);
                _this.xzyn.edit_data('money_y_0',money_0);
                _this.xzyn.edit_data('money_y_1',money_1);
            },false)
        },
        // 打开编辑页面
        go_edit: function(type='',data=''){
            if(type == 'add'){
                this.open_add_layer = true;
            }else if(type == 'edit'){
                this.xzyn.edit_datas('edit_data',data);
                this.open_add_layer = true;
            }else if( type === 'del' ){
                this.del_id = data.id;
                this.ajax_del();
            }
        },
        // 提交删除
        ajax_del: function(){
            this.$confirm('删除后不可恢复，确定要删除吗？', '提示').then((res)=>{
                var _this = this;
                if( res.result ){
                    this.xzyn.ajax(_this.request_url.account_delete,'get',{id:this.del_id},{},function(data,res){
                        _this.ajax_init();
                    },false)
                }
            });
        },
        // 添加页面触发
        add_change: function(val){
            this.open_add_layer = false;
            if(val == 'load'){
                this.ajax_init()
            }
        },
		// 打开弹层
		show_layer: function(name,title){
			this.title = title;
			this.open_layer = true;
			this.show_view = name;
		},
		// 弹层触发
		show_change: function(val){
			this.open_layer = val;
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
	.x-add-btn{
		bottom:70px;
		right:10px;
	}

</style>