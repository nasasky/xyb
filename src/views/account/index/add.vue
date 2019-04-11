<!-- 添加账单页面 -->
<template>
    <div>
		<x-layer-view :show="open_layer" title="记一笔" @change="show_change">
            <div class="x-f14">
                <mu-tabs :value.sync="current" :indicator-color="current == 0?'secondary':'success'" @change="onClickItem" inverse full-width>
                    <mu-tab>支出</mu-tab>
                    <mu-tab>收入</mu-tab>
                </mu-tabs>
                <mu-paper :z-depth="2">
                    <div class="x-tc x-pt-10">
                        <mu-button class="x-mr-20" color="success" @click="ajax_add(1)">在记一笔</mu-button>
                        <mu-button color="primary" @click="ajax_add(0)">保存</mu-button>
                    </div>
                    <mu-form ref="form" :model="add_data" class="x-plr-10">
                        <mu-form-item prop="money" :label="current == 0?'支出金额':'收入金额'" help-text="最多支持两位小数,不超过10位数" label-float :rules="rules.moneyRules">
                            <mu-text-field type="number" v-model="add_data.money" @change="money_iput" :max-length="10"></mu-text-field>
                        </mu-form-item>
                    </mu-form>
                    <div class="x-plr-10">
                        <mu-text-field v-model="add_data.describe" :max-length="20" full-width label="备注信息" help-text="一些简要信息,不允许超过20个字符" label-float></mu-text-field>
                    </div>
                    <div class="x-pl-10 x-tc-shui">当前选择的分类：
                        <mu-badge :content="xuan_type.name" :color="current == 0?'secondary':'success'"></mu-badge>
                    </div>
                    <div v-show="current == 0">
                        <mu-carousel :cycle="false" hide-controls style="height:275px;">
                            <mu-carousel-item v-for="(item,index) in account_type_arr_0" :key="index">
                                <x-jiugongge :data="item" num="5" :choose="xuan_type.id" choose-color="success" @click="type_click"></x-jiugongge>
                            </mu-carousel-item>
                        </mu-carousel>
                    </div>
                    <div v-show="current == 1">
                        <mu-carousel :cycle="false" hide-controls style="height:275px;">
                            <mu-carousel-item v-for="(item,index) in account_type_arr_1" :key="index">
                                <x-jiugongge :data="item" num="5" :choose="xuan_type.id" choose-color="success" @click="type_click"></x-jiugongge>
                            </mu-carousel-item>
                        </mu-carousel>
                    </div>
                </mu-paper>
            </div>
		</x-layer-view>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import xJiugongge from '@/components/x-jgg-icon.vue';
import xLayerView from '@/components/x-layer-view'

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xJiugongge,xLayerView},
    name: '',
    props: {
        show:{
            type:[Boolean],
            default: false
        },
        type_0: {
            type: Array,
            default: []
        },
        type_1: {
            type: Array,
            default: []
        }
    },
    data() {
        //这里存放数据
        return {
            open_layer: false,
            account_type_0: [],
            account_type_1: [],
            account_type_arr_0: [],
            account_type_arr_1: [],
            current: 0,
            add_data:{},	// 提交的数据,
            xuan_type: {},	// 当前选择的分类
            rules: {	// 验证规则
                moneyRules: [
                    { validate: (val) => !!val, message: '必须填写金额'},
                    { validate: (val) => !isNaN(val), message: '请输入数字'},
                    { validate: (val) => val.length >= 1 && val.length <= 10, message: '密码长度大于1小于10'},
                    { validate: (val) => val?!!this.xzyn.is_double_number(val):true, message: '请正确填写金额'}
                ],
            }

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        show: function(val){
            this.open_layer = val;
            this.init_add_data();
        },
        open_layer: function(val){
            if(val == false){
                this.$emit('change')
            }
        },
        type_0: {
            handler(val,oldval){
                this.account_type_0 = val;
                this.init_type();
            },
            immediate: true,
            deep: true
        },
        type_1: {
            handler(val,oldval){
                this.account_type_1 = val;
                this.init_type();
            },
            immediate: true,
            deep: true
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //方法集合
    methods: {
        // 初始化提交数据
        init_add_data: function(){
            var add_datas = {	// 初始化数据
                uid: this.$root.user_data.id,
                money: '',
                type: 0,
                type_id: 0,
                describe: ''
            }
            this.xuan_type = {};
            var add_data = this.xzyn.edit_datas('edit_data');	// 编辑的数据
            if( add_data ){
                this.current = add_data.type;
                this.add_data = add_data;
                this.xuan_type = {
                    id: add_data.type_id,
                    name: add_data.type_name
                };
                this.xzyn.edit_datas('edit_data',true);	// 删除数据
            }else{
                this.current = 0;
                this.add_data = add_datas;
            }
        },
        // 顶部选项卡
        onClickItem: function(index) {
            this.current = index;
            this.add_data.type = index;
            this.add_data.type_id = 0;
            this.xuan_type = {};
        },
        // 分类按钮
        type_click: function(item) {
            this.xuan_type = item;
            this.add_data.type_id = item.id;
        },
        // 提交数据
        ajax_add: function(s){
            var _this = this;
            if( this.add_data.type_id == 0 ){
                this.xzyn.msg('请选择分类');
            }else{
                this.$refs.form.validate().then((result) => {
                    if( result ){
                        this.xzyn.ajax(_this.request_url.account_add,'post',this.add_data,{},function(data,res){
                            _this.init_add_data();
                            if( s == 0 ){
                                _this.$emit('change','load')
                            }
                        })
                    }
                })
            }
        },
        // 初始化分类
        init_type: function(){
            this.account_type_arr_0 = this.xzyn.turn_arr(this.account_type_0,20);
            this.account_type_arr_1 = this.xzyn.turn_arr(this.account_type_1,20);
        },
        // 输入金额触发
        money_iput: function(val){
            this.add_data.money = this.xzyn.filter_money(val);
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

</style>