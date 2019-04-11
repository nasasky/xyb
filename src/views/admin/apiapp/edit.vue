<!-- 编辑页面 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="false" to="/admin/apiapp/index">API应用列表</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">编辑API应用</mu-breadcrumbs-item>
            </mu-breadcrumbs>
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-paper :z-depth="4">
                <mu-row>
                    <mu-form ref="form" :model="add_data" label-position="top">
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="app_name" label="应用名称" :rules="rules.app_name">
                                    <mu-text-field v-model="add_data.app_name"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="app_limitTime" label="Token有效时间" :rules="rules.app_limitTime">
                                    <mu-text-field type="number" v-model="add_data.app_limitTime"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="domain" label="请求域名" :rules="rules.domain">
                                    <mu-text-field v-model="add_data.domain"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="is_auth" label="验证域名">
                                    <mu-select v-model="add_data.is_auth">
                                        <mu-option label="验证" :value="1"></mu-option>
                                        <mu-option label="忽略" :value="0"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="app_status" label="状态">
                                    <mu-select v-model="add_data.app_status">
                                        <mu-option label="启用" :value="1"></mu-option>
                                        <mu-option label="禁用" :value="0"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="app_info" label="应用描述" >
                                    <mu-text-field v-model="add_data.app_info" :max-length="80" ></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item>
                            <div class="x-w-1 x-tc">
                                <mu-button color="primary" @click="add_ajax">提交</mu-button>
                            </div>
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
            add_data: {
                app_status: 1,
                is_auth: 1,
                app_limitTime: 7200
            },
            rules: {
                app_name: [
                    { validate: (val) => !!val, message: '必须填写应用名称'}
                ],
                app_limitTime: [
                    { validate: (val) => !!val, message: '必须填写Token有效时间'},
                ],
                domain: [
                    { validate: (val) => !!val, message: '必须填写请求域名'}
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
                    _this.xzyn.ajax('/admin/apiapp/edit','post',_this.add_data,{},function(data,res){
                        _this.xzyn.go();
                    })
                }
            });
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            _this.xzyn.ajax('/admin/apiapp/edit','get',{id: _this.$route.query.id},{},function(data,res){
                _this.add_data = data;
            },false)
        },

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