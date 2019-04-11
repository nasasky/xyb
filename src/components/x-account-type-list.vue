<!-- 分类列表组件 -->
<template>
    <div class=''>
        <div>
            <div class="x-pr-10 x-pt-10 x-tr">
                <mu-button :color="color" @click="on_edit_fun(types,'add')">添加一级分类</mu-button>
            </div>
            <mu-paper :z-depth="2" class="x-mtb-10">
                <mu-list toggle-nested>
                    <mu-list-item button v-for="(item,index) in data_arr" :nested="item.layer_num>0" :open="false" :key="index" v-if="item.pid == 0">
                        <mu-list-item-action>
                            <mu-avatar :color="color" size="30">
                                <mu-icon :value="':fa '+(item.icon?item.icon:'fa-cny')"></mu-icon>
                            </mu-avatar>
                        </mu-list-item-action>
                        <mu-list-item-title>
                            {{item.name}}<mu-badge v-if="item.layer_num > 0" class="x-ml-10" :content="item.layer_num+' 个子类'" :color="color"></mu-badge>
                            <mu-badge v-if="item.uid == $root.user_data.id" class="x-ml-10" content="你的分类" color="success"></mu-badge>
                        </mu-list-item-title>
                        <mu-list-item-action>
                            <mu-menu cover>
                                <mu-button icon>
                                    <mu-icon value=":fa fa-ellipsis-v"></mu-icon>
                                </mu-button>
                                <div class="x-p-5" slot="content">
                                    <mu-button color="primary" class="x-mb-5" :disabled="item.is_default == 1" @click="on_edit_fun(item,'edit')">编辑分类</mu-button>
                                    <mu-divider></mu-divider>
                                    <mu-button color="success" class="x-mb-5" :disabled="item.is_default == 1 && item.pid != 0" @click="on_edit_fun(item,'adds')">添加子类</mu-button>
                                    <mu-divider></mu-divider>
                                    <mu-button color="secondary" :disabled="item.is_default == 1 || item.layer_num > 0" @click="on_edit_fun(item,'del')">删除分类</mu-button>
                                </div>
                            </mu-menu>
                        </mu-list-item-action>
                        <mu-list-item button slot="nested" v-for="(vo,vi) in data_arr" :key="vi" v-if="item.id == vo.pid" >
                            <mu-list-item-action>
                                <mu-avatar :color="color" size="30">
                                    <mu-icon :value="':fa '+(vo.icon?vo.icon:'fa-cny')"></mu-icon>
                                </mu-avatar>
                            </mu-list-item-action>
                            <mu-list-item-title>{{vo.name}}
                                <mu-badge v-if="vo.uid == $root.user_data.id" class="x-ml-10" content="你的分类" color="success"></mu-badge>
                            </mu-list-item-title>
                            <mu-list-item-action>
                                <mu-menu cover>
                                    <mu-button icon>
                                        <mu-icon value=":fa fa-ellipsis-v"></mu-icon>
                                    </mu-button>
                                    <div class="x-p-5" slot="content">
                                        <mu-button color="primary" class="x-mb-5" :disabled="vo.is_default == 1" @click="on_edit_fun(vo,'edit')">编辑分类</mu-button>
                                        <mu-divider></mu-divider>
                                        <mu-button color="success" class="x-mb-5" :disabled="vo.pid != 0" @click="on_edit_fun(vo,'adds')">添加子类</mu-button>
                                        <mu-divider></mu-divider>
                                        <mu-button color="secondary" :disabled="vo.is_default == 1" @click="on_edit_fun(vo,'del')">删除分类</mu-button>
                                    </div>
                                </mu-menu>
                            </mu-list-item-action>
                        </mu-list-item>
                    </mu-list-item>
                </mu-list>
            </mu-paper>
        </div>
        <!-- 添加/编辑分类 -->
        <mu-dialog transition="slide-bottom" fullscreen :open.sync="show_edit">
            <mu-appbar color="primary" :title="title">
                <mu-button slot="left" icon @click="on_edit_fun">
                    <mu-icon value=":fa fa-close"></mu-icon>
                </mu-button>
            </mu-appbar>
            <div class="x-pt-15">
                <mu-paper :z-depth="2">
                    <mu-form ref="form" :model="add_data" class="x-plr-10">
                        <mu-form-item label="分类名称" prop="name" label-position="right" :rules="rules.nameRules" help-text="分类名为1-8长度的字符">
                            <mu-text-field v-model="add_data.name" :max-length="8"></mu-text-field>
                        </mu-form-item>
                        <mu-form-item label="分类排序" prop="sorts" label-position="right" help-text="最长只能输入4位数字">
                            <mu-text-field type="number" v-model="add_data.sorts" :max-length="4"></mu-text-field>
                        </mu-form-item>
                        <mu-form-item>
                            <mu-list-item-action avatar>
                                <mu-avatar :size="44" :color="add_data.type == 0?'secondary':'success'">
                                    <mu-icon size="24" :value="':fa '+add_data.icon"></mu-icon>
                                </mu-avatar>
                            </mu-list-item-action>
                            <mu-list-item-content>
                                <mu-button :color="add_data.type == 0?'secondary':'success'" @click="open_icon_list = true">选择图标</mu-button>
                            </mu-list-item-content>
                        </mu-form-item>
                        <mu-form-item>
                            <div class="x-w-1 x-tc">
                                <mu-button color="primary" @click="ajax_add">提交保存</mu-button>
                            </div>
                        </mu-form-item>
                    </mu-form>
                </mu-paper>
            </div>
            <!-- 图标列表 -->
            <mu-dialog width="460" :open.sync="open_icon_list">
                <mu-carousel :cycle="false" hide-controls hide-indicators style="height:410px;">
                    <mu-carousel-item v-for="(item,index) in icon_arr" :key="index">
                        <div class="x-icon-list x-mb-10 x-tc" v-for="(vo,ii) in item" :key="ii">
                            <mu-button small icon @click="icon_click(vo)">
                                <mu-icon size="24" :value="':fa '+vo"></mu-icon>
                            </mu-button>
                        </div>
                    </mu-carousel-item>
                </mu-carousel>
            </mu-dialog>
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
    props: {
        data:{
            type: Array,
            default: []
        },
        color: {
            type: String,
            default: 'info'
        },
        type: {
            type: Number,
            default: 0
        }
    },
    data() {
        //这里存放数据
        return {
            data_arr: [],
            title: '',
            show_edit: false,
            add_data: {		// 提交的数据,
                icon:'fa-cny',
                sorts:10,
                pid: 0,
                type: 0
            },
            icon_arr: [],	// icon图标
            open_icon_list: false,
            rules: {	// 验证规则
                nameRules: [
                    { validate: (val) => !!val, message: '必须填分类名'},
                    { validate: (val) => val.length >= 2 && val.length <= 8, message: '分类名长度大于2小于8'}
                ]
            },
            types: ''   // 当前的数据类型 0 支出，1 收入，2 笔记
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        data:{
            handler(val,oldval){
                this.data_arr = val;
            },
            immediate: true
        },
        type:{
            handler(val,oldval){
                this.types = val;
            },
            immediate: true
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //方法集合
    methods: {
        // 分类操作按钮
        on_edit_fun: function(item,type){
            if(this.show_edit){
                this.add_data = {
                    icon:'fa-cny',
                    sorts:10,
                    pid: 0,
                    type: 0
                };
                this.show_edit = false;
            }else{
                if(this.icon_arr.length == 0){
		            this.get_icon();
                }
                this.add_data.uid = this.$root.user_data.id;
                if( type === 'adds' ){	// 新增子类
                    this.title = '添加子分类';
                    this.add_data.pid = item.id;
                    this.add_data.type = item.type;
                }else if( type === 'del'){	// 删除分类
                    this.add_data.id = item.id;
                    this.ajax_del();
                }else if( type === 'add'){	// 新增大类
                    this.title = '添加大分类';
                    this.add_data.type = item;
                }else{
                    this.title = '编辑分类';
                    this.add_data = item;
                    item.icon == ''?this.add_data.icon = 'fa-cny':'';
                }
                type !== 'del'?this.show_edit = true:'';
            }
        },
        // 获取icon图标数组
        get_icon: function(){
            var _this = this;
            this.xzyn.axios_ajax('https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.css','get',{},{},function(res){
                var re = /fa-[a-z|0-9|-]+(?=:)+/gi;
                var icon_arr = res.match(re);
                var new_icon_arr = _this.xzyn.turn_arr(icon_arr,50);
                _this.icon_arr = new_icon_arr;
            })
        },
        // 选择icon
        icon_click: function(icon_name){
            this.add_data.icon = icon_name;
            this.open_icon_list = false;
        },
        // 提交数据
        ajax_add: function(s){
            var _this = this;
            this.$refs.form.validate().then((result) => {
                if( result ){
                    this.xzyn.ajax(_this.request_url.account_type_edit,'post',this.add_data,{},function(data,res){
                        _this.on_edit_fun();
                        _this.ajax_data();
                    },false)
                }
            })
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            this.xzyn.ajax(_this.request_url.account_type_index,'get',{},{},function(data,res){
                _this.$emit('change',data);
            },false)
        },
        // 提交删除
        ajax_del: function(){
            this.$confirm('要删除该分类，要确保该分类下没有数据，确定要删除吗？', '提示').then((res)=>{
                var _this = this;
                if( res.result ){
                    this.xzyn.ajax(_this.request_url.account_type_delete,'get',{id:this.add_data.id},{},function(data,res){
                        _this.ajax_data();
                    })
                }
            });
        },
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {}
}
</script>
<style>
    /*@import url(); 引入公共css类*/
	.x-icon-list{
		display:inline-block;
		width:20%;
	}
    .mu-dialog-body{
        padding:10px;
    }
</style>