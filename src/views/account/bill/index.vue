<!-- 账单首页 -->
<template>
    <div class='x-pt-10'>
        <mu-row>
            <mu-col span="12">
                <div class="x-fl x-pt-5 x-dwr x-ml-5" x-w-1>
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
                    <div class="x-plr-10 x-pt-5 x-dwa-lt x-date-list" v-show="is_show_list">
                        <mu-paper :z-depth="4" class="x-pb-10">
                            <div class="x-date-y-list x-tc" v-for="(item,index) in date_y_arr" :key="index">
                                <mu-button small class="x-mtb-5" :color="item == date_y?'primary':''" @click="show_date_list(item)">{{item}}年</mu-button>
                            </div>
                        </mu-paper>
                    </div>
                </mu-scale-transition>
            </mu-col>
        </mu-row>
        <mu-row>
            <mu-col span="12" sm="6">
                <div class="x-plr-10">
                    <mu-paper :z-depth="4" class="x-pb-25">
                        <div class="x-mt-10" >
                            <div class="x-plr-5 x-w-1" style="height:250px" ref="pieChart"></div>
                        </div>
                        <div class="x-dwa-lb x-tc x-control-b">
                            <mu-badge class="x-mr-20" :content="'月支出 ￥'+money_num_0" color="secondary"></mu-badge>
                            <mu-badge :content="'月收入 ￥'+money_num_1" color="success"></mu-badge>
                        </div>
                    </mu-paper>
                </div>
            </mu-col>
            <mu-col span="12" sm="6">
                <div class="x-plr-10 x-pt-10">
                    <mu-load-more @refresh="init_data" :refreshing="is_refresh" >
                        <mu-paper :z-depth="4">
                            <x-data-null v-if="accountData?accountData.length == 0:true" text="你还没有添加账单"></x-data-null>
                            <div v-else>
                                <mu-list textline="two-line" v-for="(item,index) in accountData" :key="index" v-if="item.create_time != (index != (accountData.length-1)? accountData[index+1].create_time:'') ">
                                    <mu-sub-header>{{item.create_time}}</mu-sub-header>
                                    <mu-list-item button v-for="(vo,ii) in accountData" :key="ii" v-if="item.create_time == vo.create_time" >
                                        <mu-list-item-action>
                                            <mu-avatar :color="vo.type == 0 ? 'secondary' : 'success'">
                                                <mu-icon :value="':fa '+(vo.icon?vo.icon:'fa-cny')"></mu-icon>
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
                                                    <mu-divider></mu-divider>
                                                    <mu-list-item button @click="go_edit('del',vo)">
                                                        <mu-list-item-title>删除</mu-list-item-title>
                                                    </mu-list-item>
                                                </mu-list>
                                            </mu-menu>
                                        </mu-list-item-action>
                                    </mu-list-item>
                                    <mu-divider></mu-divider>
                                </mu-list>
                            </div>
                        </mu-paper>
                    </mu-load-more>
                </div>
            </mu-col>
            <x-add :show="open_add_layer" @change="add_change" :type_0="account_type_0" :type_1="account_type_1"></x-add>
        </mu-row>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
// 引入基本模板
import * as echarts from 'echarts';
import xAdd from '../index/add.vue'

var option = {
    title: {
        text: '月支出/收入'
    },
    tooltip: {
        show: true
    },
    toolbox: {
        show: false
    },
    legend: {},
    xAxis: {
        data: [],
        axisLabel:{	// 坐标轴刻度标签的相关设置
            interval: 1,
            // rotate: -45,
            align: 'center',
            margin: 10
        },
        axisTick: {	// 坐标轴刻度相关设置
            interval: 0,
            alignWithLabel: true
        }
    },
    yAxis: {},
    color: ['#ff4081','#4caf50'],
    series: [
        {
            name: '支出',
            type: 'bar',
            tooltip: {
                formatter: '{b}日: {c}元'
            },
            data: []
        },
        {
            name: '收入',
            type: 'bar',
            tooltip: {
                formatter: '{b}日: {c}元'
            },
            data: []
        }
    ]
};

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xAdd},
    name: '',
    props: {},
    data() {
        //这里存放数据
        return {
            name: 'bill',
            accountData: [],
            money_num_0: '',
            money_num_1: '',
            del_id: '',	// 删除id
            y_arr_0: [],	// 每天支出总和
            y_arr_1: [],	// 每天收入总和
            is_show_list: false,
            date_y: '',
            date_m: '',
            date_y_arr: [],
            is_refresh: false,    // 是否刷新
            open_add_layer: false,  // 打开添加账单层
            account_type_0: [],
            account_type_1: []

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
        // 初始化加载数据
        init_data: function(){
            this.is_refresh = true;
            this.date_y = new Date().getFullYear();	// 年
            this.date_m = new Date().getMonth()+1;	// 月
            this.ajax_data();
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
        // 月份按钮
        date_btn: function(date_m){
            this.date_m = date_m;
            this.ajax_data();
        },
        // 获取数据
        ajax_data: function(){
            var add_date_ym = this.date_y + '-' + this.date_m;
            var _this = this;
            var add_data = {
                ymd: add_date_ym
            }
            this.xzyn.ajax(_this.request_url.account_bill,'get',add_data,{},function(data,res){
                _this.is_refresh = false;
                _this.money_num_0 = _this.xzyn.filter_money(data.money_num_0);
                _this.money_num_1 = _this.xzyn.filter_money(data.money_num_1);
                _this.y_arr_0 = data.y_arr_0;
                _this.y_arr_1 = data.y_arr_1;
                _this.accountData = data.accountData;

                var d_arr = _this.xzyn.get_date_d_arr(_this.date_y,_this.date_m);
                option.xAxis.data = d_arr;
                option.series[0].data = data.y_arr_0;
                option.series[1].data = data.y_arr_1;
                _this.pie_init();
            },false)
        },
        // 打开编辑页面
        go_edit:function(type='',data=''){
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
                        _this.init_data();
                    },false)
                }
            });
        },
        // 添加页面触发
        add_change: function(val){
            this.open_add_layer = false;
            if(val == 'load'){
                this.init_data()
            }
        }

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        // this.pie_init()
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
        width: 360px;
		z-index:10;
		top:42px;
	}
	.x-control-t{
		width:100%;
		top:45px;
		z-index: 2;
	}
	.x-control-b{
		width: 100%;
		bottom: 30px;
		z-index:2;
	}
	.x-date-y-list{
		width:33.333333333333336%;
		display:inline-block;
	}

</style>