<!-- 预算支出页面 -->
<template>
    <div class=''>
		<div class="x-plr-10 x-pt-10">
			<mu-paper :z-depth="3">
				<mu-sub-header>
					<mu-icon value=":fa fa-calendar" color="info" size="14"></mu-icon>
					月预算</mu-sub-header>
				<mu-row>
					<mu-col span="3" class="x-tc x-pt-10">
						<mu-circular-progress class="demo-circular-progress" mode="determinate" :value="tubiao.val" :max="tubiao.max_val"
							:color="budget_money_obj.type == 0?'grey400':'secondary'" :stroke-width="10" :size="50">
						</mu-circular-progress>
					</mu-col>
					<mu-col span="9">
						<div class="x-f14 x-tc-hui">
							{{budget_money_obj.text}}
						</div>
						<span class="x-f30 x-tw">￥{{budget_money_obj.money}}</span>
					</mu-col>
				</mu-row>
				<mu-row class="x-b-tb x-mt-10">
					<mu-col span="4" class="x-tc">
						<mu-ripple class="x-ptb-10">
							<div class="x-tc-hui">本月支出</div>
							<div class="x-tw">￥{{money_y_0}}</div>
						</mu-ripple>
					</mu-col>
					<mu-col span="4" class="x-tc x-b-lr">
						<mu-ripple class="x-ptb-10" @click="open_budget_money = true">
							<div class="x-tc-hui">月预算
								<mu-icon class="x-ml-5" value=":fa fa-pencil-square-o" size="14"></mu-icon>
							</div>
							<div class="x-tw">￥{{account_config.money}}</div>
						</mu-ripple>
					</mu-col>
					<mu-col span="4" class="x-tc">
						<mu-ripple class="x-ptb-10">
							<div class="x-tc-hui">剩余天数</div>
							<div class="x-tw">{{date_ds}}</div>
						</mu-ripple>
					</mu-col>
				</mu-row>
				<!-- <mu-divider></mu-divider> -->
				<div class="x-p-15">
					<mu-button v-if="!account_config.money" color="red" full-width @click="open_budget_money = true">设置月预算</mu-button>
					<div v-else>
						<div>
							<span class="x-tc-hui">本月日均支出</span>
							<span class="x-fr x-tw">￥{{average_money}}</span>
						</div>
						<div>
							<div class="x-ptb-5">
								<span class="x-tc-hui">剩余每日可支出</span>
								<span class="x-fr x-tw">￥{{remaining_obj.money}}</span>
							</div>
							<div>
								<mu-linear-progress mode="determinate" :value="Number(money_y_0)" :size="10" :max="Number(account_config.money)" color="secondary"></mu-linear-progress>
							</div>
						</div>
					</div>
				</div>
			</mu-paper>
		</div>

		<mu-dialog title="月预算设置" :open.sync="open_budget_money" @close="close_dialog">
			<mu-text-field v-model="account_config.money" type="number" placeholder="预算金额" max-length="10" @change="money_iput" full-width></mu-text-field>
			<mu-button slot="actions" flat color="primary" @click="add_ajax">保存</mu-button>
		</mu-dialog>

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
            money_y_0: 0.00,	// 月支出金额总数
            money_y_1: 0.00,	// 月收入金额总数
            account_config: {},	// 预算金额
            open_budget_money: false,	// 添加预算层页面

        };
    },
    //监听属性 类似于data概念
    computed: {
        // 月预算计算方法
        budget_money_obj: function(){
            var obj = {};
            if(this.account_config){
                var mb = this.xzyn.filter_money(this.account_config.money) * 100;
                var mn_0 = this.xzyn.filter_money(this.money_y_0) * 100;
                if( mb == 0 ){
                    obj.text = '请设置预算金额';
                    obj.money = 0.00;
                    obj.type = 0;
                }else{
                    if( mb > mn_0 ){	// 没有超出预算
                        var moneys = (mb - mn_0)/100;
                        obj.text = '剩余月预算';
                        obj.money = this.xzyn.filter_money(moneys);
                        obj.type = 1;
                    }else{	// 超出预算
                        var moneys = (mn_0 - mb)/100;
                        obj.text = '月预算超支';
                        obj.money = this.xzyn.filter_money(moneys);
                        obj.type = 0;
                    }
                }
            }else{
                obj.text = '请设置预算金额';
                obj.money = 0.00;
                obj.type = 0;
            }
            return obj;
        },
        // 剩余天数计算方法
        date_ds: function(){
            var d_all = this.xzyn.get_date_d_num();
            var d = new Date().getDate();
            return d_all - d;
        },
        // 图表值计算方法
        tubiao: function(){
            var obj = {
                val:80,
                max_val:100
            }
            if( this.budget_money_obj.type == 0 ){
                obj.val = 100;
                obj.max_val = 100;
            }else{
                obj.val = Number(this.money_y_0);
                obj.max_val = Number(this.account_config.money);
            }
            return obj;
        },
        // 日平均支出金额计算方法
        average_money: function(){
            var d_all = this.xzyn.get_date_d_num();
            var m_0 = Number(this.money_y_0);
            var a_m = m_0/d_all;
            return this.xzyn.filter_money(a_m);
        },
        // 剩余每日可支出计算方法
        remaining_obj: function(){
            var d_all = this.date_ds;	// 这个月的剩余天数
            var m_0 = this.budget_money_obj.money;	// 这个月的剩余金额
            var obj = {
                money: 0.00
            };
            if( this.budget_money_obj.type == 1 ){
                obj.money = this.xzyn.filter_money(m_0/d_all);
            }
            return obj;
        }

    },
    //监控data中的数据变化
    watch: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        // this.init_data();
        this.account_config = this.xzyn.edit_data('account_config')||{money:0.00};
        this.money_y_0 = this.xzyn.edit_data('money_y_0');
        this.money_y_1 = this.xzyn.edit_data('money_y_1');

    },
    //方法集合
    methods: {
        // 初始化数据
        init_data: function(){
            this.ajax_data();
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            this.xzyn.ajax(_this.request_url.account_config_index,'get',{},{},function(data,res){
                var money_0 = _this.xzyn.filter_money(data.money_num_0),	// 本月支出金额
                    money_1 = _this.xzyn.filter_money(data.money_num_1);	// 本月收入金额
                _this.money_y_0 = money_0;
                _this.money_y_1 = money_1;
                _this.account_config = data.account_config||{money:0};
                _this.xzyn.edit_data('account_config',data.account_config||{money:0.00});
                _this.xzyn.edit_data('money_y_0',money_0);
                _this.xzyn.edit_data('money_y_1',money_1);
            },false)
        },
        // 提交保存
        add_ajax: function(){
            var _this = this;
            this.account_config.uid = this.$root.user_data.id;
            this.xzyn.ajax(_this.request_url.account_config_edit,'post',this.account_config,{},function(data,res){
                _this.open_budget_money = false;
                _this.init_data()
            },false)
        },
        // 输入金额触发
        money_iput: function(val){
            this.account_config.money = this.xzyn.filter_money(val);
        },
        // 关闭弹层触发
        close_dialog: function(e){
            this.account_config = this.xzyn.edit_data('account_config')||{money:0.00};
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