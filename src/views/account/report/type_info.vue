<!-- 分类账目列表页面 -->
<template>
    <div class=''>
        <mu-dialog width="100%" transition="slide-bottom" fullscreen :open.sync="open_layer">
            <mu-appbar color="primary" :title="title">
                <mu-button slot="left" icon @click="open_layer = false">
                    <mu-icon size="20" value=":fa fa-close"></mu-icon>
                </mu-button>
            </mu-appbar>
            <div class="x-f14">
                <mu-load-more @refresh="init_data" :refreshing="is_refresh" >
                    <x-data-null v-if="account_data.length == 0" text="没有任何数据"></x-data-null>
                    <div v-else class="">
                        <mu-sub-header>共 {{account_data.length}} 笔，￥{{money_all}}</mu-sub-header>
                        <mu-paper :z-depth="2">
                            <mu-list textline="two-line">
                                <mu-list-item button v-for="(item,index) in account_data" :key="index" >
                                    <mu-list-item-action>
                                        <mu-avatar :color="item.type == 0 ?'secondary':'success'">
                                            <mu-icon :value="':fa '+(item.icon?item.icon:'fa-cny')"></mu-icon>
                                        </mu-avatar>
                                    </mu-list-item-action>
                                    <mu-list-item-content>
                                        <mu-list-item-title>{{item.type_name}}
                                            <mu-badge class="x-fr" :content="'￥'+item.money + ' 元' " :color="item.type == 0 ?'secondary':'success'"></mu-badge>
                                        </mu-list-item-title>
                                        <mu-list-item-sub-title>{{item.describe}}</mu-list-item-sub-title>
                                    </mu-list-item-content>
                                    <mu-list-item-action>
                                        <mu-menu cover placement="bottom-end">
                                            <mu-button icon>
                                                <mu-icon value=":fa fa-ellipsis-v"></mu-icon>
                                            </mu-button>
                                            <mu-list slot="content">
                                                <mu-list-item button @click="go_edit('edit',item)">
                                                    <mu-list-item-title>编辑</mu-list-item-title>
                                                </mu-list-item>
                                                <mu-list-item button @click="go_edit('del',item)">
                                                    <mu-list-item-title>删除</mu-list-item-title>
                                                </mu-list-item>
                                            </mu-list>
                                        </mu-menu>
                                    </mu-list-item-action>
                                </mu-list-item>
                            </mu-list>
                        </mu-paper>
                    </div>
                </mu-load-more>
            </div>
        </mu-dialog>
        <x-add :show="open_add_layer" @change="add_change" :type_0="account_type_0" :type_1="account_type_1"></x-add>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import xAdd from '../index/add.vue'
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xAdd},
    name: '',
    props: {
        show:{
            type:[Boolean],
            default: false
        },
        inputData: {
            type: [Object],
            default: {}
        }
    },
    data() {
        //这里存放数据
        return {
            open_layer: false,
            title: '',
            type_id:'',	// 分类ID
            date: ''	,// 年月
            account_data: [],	// 列表数据
            del_id: '',	// 删除ID,
            is_refresh: false,    // 是否刷新
            open_add_layer: false,  // 打开添加账单层
            account_type_0: [],
            account_type_1: []

        };
    },
    //监听属性 类似于data概念
    computed: {
        money_all: function(){
            var a_data = this.account_data;
            var money = 0;
            for (var i = 0; i < a_data.length; i++) {
                money = money+Number(a_data[i].money);
            }
            return this.xzyn.filter_money(money)+'元';
        }
    },
    //监控data中的数据变化
    watch: {
        show: function(val){
            this.open_layer = val;
            this.type_id = this.inputData.id;
            this.date = this.inputData.date;
            if(val){
                this.init_data();
            }
        },
        open_layer: function(val){
            if(val == false){
                this.$emit('change')
            }
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.account_type_0 = this.xzyn.edit_data('account_type_0');
        this.account_type_1 = this.xzyn.edit_data('account_type_1');
    },
    //方法集合
    methods: {
        // 初始化数据
        init_data: function(){
            this.is_refresh = true;
            this.ajax_data();
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            var add_data = {
                id: this.type_id,
                uid: this.$root.user_data.id,
                date: this.date
            }
            this.xzyn.ajax(_this.request_url.account_type_typeinfo,'get',add_data,{},function(data,res){
                _this.is_refresh = false;
                _this.title = data[0].type_name
                _this.account_data = data;
            },false)
        },
        // 打开编辑页面
        go_edit:function(type='',data=''){
            if(type == 'edit'){
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
                        if( _this.account_data.length <= 1 ){
                            _this.$emit('change','load')
                        }else{
                            _this.init_data();
                        }
                    },false)
                }
            });
        },
        add_change: function(val){
            this.open_add_layer = false;
            if(val == 'load'){
                this.init_data()
            }
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