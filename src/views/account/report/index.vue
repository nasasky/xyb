<!-- 分类图表页 -->
<template>
    <div class='x-pt-5'>
        <mu-load-more @refresh="init_data" :refreshing="is_refresh" >
            <div class="x-pb-10">
                <mu-paper :z-depth="4" :style="{position: 'relative'}">
                    <div class="x-fl x-pt-5 x-dwr x-ml-5">
                        <mu-button color="primary" small @click="show_date_list(date_y)">{{date_y}}年</mu-button>
                    </div>
                    <div style="margin-left:95px;" class="x-pr-10">
                        <div class="x-ptb-5 x-gd-x x-t-no x-w-1">
                            <div>
                                <mu-button small color="primary" v-for="(item,index) in 12" :key="index" :flat="date_m != item" @click="date_btn(item)">{{item}}月</mu-button>
                            </div>
                        </div>
                    </div>
                    <mu-scale-transition>
                        <div class="x-pt-5 x-dwa-lt x-date-list" v-show="is_show_list">
                            <mu-paper :z-depth="4" class="x-pb-10">
                                <div class="x-date-y-list x-tc" v-for="(item,index) in date_y_arr" :key="index">
                                    <mu-button small class="x-mtb-5" :color="item == date_y?'primary':''" @click="show_date_list(item)">{{item}}年</mu-button>
                                </div>
                            </mu-paper>
                        </div>
                    </mu-scale-transition>
                    <div class="x-dwa-rt x-control-t" >
                        <mu-tabs :value.sync="current" @change="onClickItem" :color="current==0?'secondary':'success' " inverse :indicator-color="current==0?'secondary':'success'" full-width>
                            <mu-tab>月支出</mu-tab>
                            <mu-tab>月收入</mu-tab>
                        </mu-tabs>
                    </div>
                    <div style="padding-top:65px;" >
                        <div class="x-plr-5 x-w-1" style="width:100vw; height:300px" ref="pieChart"></div>
                    </div>
                </mu-paper>
            </div>
            <mu-paper :z-depth="2">
                <x-data-null v-if="account_type_money_0.length == 0" text="你还没有添加账单"></x-data-null>
                <div v-else>
                    <div v-show="current == 0">
                        <mu-sub-header>月支出 ￥ {{money_num_0}} 元 </mu-sub-header>
                        <mu-divider></mu-divider>
                        <mu-list textline="two-line">
                            <mu-list-item button v-for="(item,index) in account_type_money_0" :key="index" @click="go_list(item)">
                                <mu-list-item-action>
                                    <mu-avatar color="secondary">
                                        <mu-icon :value="':fa '+(item.icon?item.icon:'fa-cny')"></mu-icon>
                                    </mu-avatar>
                                </mu-list-item-action>
                                <mu-list-item-content>
                                    <mu-list-item-title>{{item.name}}
                                    </mu-list-item-title>
                                    <mu-list-item-sub-title>￥{{xzyn.filter_money(item.money_all)}}元</mu-list-item-sub-title>
                                </mu-list-item-content>
                                <mu-list-item-action>
                                    <mu-badge class="x-fr" :content=" '共 ' + item.money_num + ' 笔' " color="secondary"></mu-badge>
                                </mu-list-item-action>
                            </mu-list-item>
                        </mu-list>
                    </div>
                    <div v-show="current == 1">
                        <mu-sub-header>月收入 ￥ {{money_num_1}} 元 </mu-sub-header>
                        <mu-divider></mu-divider>
                        <mu-list textline="two-line">
                            <mu-list-item button v-for="(item,index) in account_type_money_1" :key="index" @click="go_list(item)" >
                                <mu-list-item-action>
                                    <mu-avatar color="success">
                                        <mu-icon :value="':fa '+(item.icon?item.icon:'fa-cny')"></mu-icon>
                                    </mu-avatar>
                                </mu-list-item-action>
                                <mu-list-item-content>
                                    <mu-list-item-title>{{item.name}}
                                    </mu-list-item-title>
                                    <mu-list-item-sub-title>￥{{xzyn.filter_money(item.money_all)}}元</mu-list-item-sub-title>
                                </mu-list-item-content>
                                <mu-list-item-action>
                                    <mu-badge class="x-fr" :content=" '共 ' + item.money_num + ' 笔' " color="success"></mu-badge>
                                </mu-list-item-action>
                            </mu-list-item>
                        </mu-list>
                    </div>
                </div>

            </mu-paper>
        </mu-load-more>
        <type-info :show="open_type_layer" :input-data="input_data" @change="is_load"></type-info>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import * as echarts from 'echarts';
import typeInfo from './type_info.vue'
import xAdd from '../index/add.vue'
var option = {
    title: {
        // text: '月支出/收入'
    },
    tooltip: { show: true },
    toolbox: { show: true },
    legend: {
        show: true,
        type: 'scroll',// plain / scroll
        bottom: 3,
    },
    xAxis: { show: false },
    yAxis: { show: false },
    series: [
        {
            name: '支出',
            type: 'pie',
            radius:['20%', '60%'],
            data: [],
            tooltip: {
                formatter: '{b}: {c}元'
            },
        }
    ]
};
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {typeInfo,xAdd},
    name: '',
    props: {},
    data() {
        //这里存放数据
        return {
            name: 'report',
            echarts: echarts,
            accountData: [],
            money_num_0: '',	// 月支出金额
            money_num_1: '',	// 月收入金额
            account_type_money_0: [],	// 支出分类月总金额
            account_type_money_1: [],	// 收入分类月总金额
            pie_type_money_0: [],	// 支出分类月总金额(图数据)
            pie_type_money_1: [],	// 收入分类月总金额(图数据)
            is_show_list: false,
            current: 0,
            date_y: '',
            date_m: '',
            date_y_arr: [],
            is_refresh: false,    // 是否刷新
            open_type_layer: false,  // 打开弹层
            input_data: {}  // 传递到子组件

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.date_y = new Date().getFullYear();	// 年
        this.date_m = new Date().getMonth()+1;	// 月
        this.date_y_arr = this.xzyn.get_date_y_arr(10);
    },
    //方法集合
    methods: {
        // 图表初始化
        pie_init: function(){
            var myChart = echarts.init(this.$refs.pieChart);
            myChart.setOption(option)
        },
        // 显示年份弹层
        show_date_list: function(date_y){
            this.date_y = date_y;
            if( this.is_show_list ){
                this.is_show_list = false;
                this.ajax_data();
            }else{
                this.is_show_list = true;
            }
        },
        // 初始化加载数据
        init_data: function(){
            this.is_refresh = true;
            this.date_y = new Date().getFullYear();	// 年
            this.date_m = new Date().getMonth()+1;	// 月
            this.ajax_data();
        },
        // 月份按钮
        date_btn: function(date_m){
            this.date_m = date_m;
            this.ajax_data();
        },
        // 获取数据
        ajax_data: function(){
            var add_date_ym = this.date_y + '-' + this.date_m;
            this.current = 0;
            var _this = this;
            var add_data = {
                ymd: add_date_ym
            }
            this.xzyn.ajax(_this.request_url.account_report,'get',add_data,{},function(data,res){
                _this.is_refresh = false;
                _this.money_num_0 = _this.xzyn.filter_money(data.money_num_0);
                _this.money_num_1 = _this.xzyn.filter_money(data.money_num_1);
                _this.account_type_money_0 = data.account_type_money_0;
                _this.account_type_money_1 = data.account_type_money_1;
                _this.accountData = data.accountData;
                var m_0 = data.account_type_money_0;
                var arr_0 = [];
                for (var i = 0; i < m_0.length; i++) {
                    var obj_0 = {};
                    obj_0.name = m_0[i].name;
                    obj_0.value = m_0[i].money_all;
                    arr_0.push(obj_0);
                }
                _this.pie_type_money_0 = arr_0;
                var m_1 = data.account_type_money_1;
                var arr_1 = [];
                for (var i = 0; i < m_1.length; i++) {
                    var obj_1 = {};
                    obj_1.name = m_1[i].name;
                    obj_1.value = m_1[i].money_all;
                    arr_1.push(obj_1);
                }
                _this.pie_type_money_1 = arr_1;
                option.series[0].data = _this.pie_type_money_0;
                _this.pie_init();
            },false)
        },
        // 支出/收入选项卡
        onClickItem:function(e){
            this.current = e;
            if( e == 0 ){
                option.series[0].data = this.pie_type_money_0;
                this.pie_init();
            }else{
                option.series[0].data = this.pie_type_money_1;
                this.pie_init();
            }
        },
        // 打开弹层
        go_list: function(item){
            this.input_data = {
                id: item.id,
                date: this.date_y+'-'+this.date_m
            }
            this.open_type_layer = true;
        },
        is_load: function(val){
            this.open_type_layer = false;
            if(val == 'load'){
                this.init_data()
            }
        }

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.init_data()
    },
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
	.x-date-list{
		z-index:10;
		top:42px;
	}
	.x-control-t{
		width:100%;
		top:45px;
		z-index: 2;
	}
	.x-date-y-list{
		width:33.333333333333336%;
		display:inline-block;
	}

</style>