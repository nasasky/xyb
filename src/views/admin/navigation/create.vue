<!-- 添加页面 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="false" to="/admin/navigation/index">网站导航列表</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">新增导航</mu-breadcrumbs-item>
            </mu-breadcrumbs>
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-paper class="x-p-10" :z-depth="4">
                <mu-row>
                    <mu-form ref="form" :model="add_data" label-position="top">
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="type_id" label="导航分类" :rules="rules.type_id">
                                    <mu-select v-model="add_data.type_id" full-width @change="on_type_change" placeholder="请选择">
                                        <mu-option v-for="(item,index) in type_list" :key="index" :label="item" :value="index"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="pid" label="父级">
                                    <mu-select v-model="add_data.pid" full-width placeholder="请选择">
                                        <mu-option label="顶级" :value="0"></mu-option>
                                        <mu-option v-for="(item,index) in data_list" :key="index" :value="item.id"
                                        :label="(item.h_layer==2?'┗━━━':'')+item.name" :disabled="item.h_layer >= 2 || item.id == add_data.id">
                                        </mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="name" label="导航名称" :rules="rules.name">
                                    <mu-text-field v-model="add_data.name" :max-length="20"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="title" label="导航别名" help-text="请填写英文" :rules="rules.title">
                                    <mu-text-field v-model="add_data.title"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item prop="url" label="导航URL" :rules="rules.url">
                            <mu-text-field v-model="add_data.url"></mu-text-field>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="6">
                                <mu-form-item prop="is_show" label="是否显示">
                                    <mu-select v-model="add_data.is_show" placeholder="请选择">
                                        <mu-option label="否" :value="0"></mu-option>
                                        <mu-option label="是" :value="1"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="6">
                                <mu-form-item prop="target" label="打开窗口">
                                    <mu-select v-model="add_data.target" placeholder="请选择">
                                        <mu-option label="新窗口" :value="1"></mu-option>
                                        <mu-option label="当前窗口" :value="0"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="icon" label="icon图标" help-text="请填写icon css类名">
                                    <mu-text-field v-model="add_data.icon"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="iconcolor" label="图标颜色">
                                    <mu-text-field v-model="add_data.iconcolor"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="news" label="角标信息">
                                    <mu-text-field v-model="add_data.news"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="bgcolor" label="角标背景颜色">
                                    <mu-text-field v-model="add_data.bgcolor"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="orderby" label="排序">
                                    <mu-text-field type="number" v-model="add_data.orderby"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item class="x-mb-0">
                                    <div class="x-w-1 x-tc">
                                        <mu-button color="primary" @click="add_ajax">提交</mu-button>
                                    </div>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                    </mu-form>
                </mu-row>
            </mu-paper>
        </div>
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
            data_list: [],    // 列表数据
            type_list: {},   // 分类数据
            type_id: '',  // 分类ID
            add_data: {
                pid: 0,
                is_show: 1,
                orderby: 50,
            },
            rules: {
                title: [
                    { validate: (val) => !!val, message: '必须填写导航英文别名，'}
                ],
                name: [
                    { validate: (val) => !!val, message: '必须填写导航名称'}
                ],
                url: [
                    { validate: (val) => !!val, message: '必须填写URL'}
                ],
                type_id: [
                    { validate: (val) => !!val, message: '请选择分类'}
                ]
            }

        };
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.ajax_data();
    },
    //方法集合
    methods: {
        // 提交
        add_ajax: function() {
            var _this = this;
            this.$refs.form.validate().then((result) => {
                if( result ){
                    _this.add_data.rules = _this.rules_id_arr;
                    _this.xzyn.ajax('/admin/navigation/create','post',_this.add_data,{},function(data,res){
                        _this.xzyn.go();
                    })
                }
            });
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            var add_data = {     //发送到服务器的数据
                type_id: _this.type_id
            }
            _this.xzyn.ajax('/admin/navigation/index','get',add_data,{},function(data,res){
                _this.is_refreshing = false;
                _this.type_list = data.typeList;
                _this.data_list = data.dataList;
            },false)
        },
        // 选择导航分组触发
        on_type_change: function(id){
            this.type_id = id;
            this.ajax_data();
        }

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {}
}
</script>
<style>
    /*@import url(); 引入公共css类*/
    .x-breadcrumbs{
        position: fixed;
        z-index: 9;
        width:100%;
        top: 64px;
        left: 0px;
        padding-left: 256px;
        background-color:#fafafa;
    }
    /*兼容手机端样式*/
    @media (max-width: 600px) {
        .x-breadcrumbs{
            top: 56px;
            padding-left: 0px;
        }
    }

</style>