<!-- 添加页面 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="false" to="/admin/apilist/index">API列表</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">新增API接口</mu-breadcrumbs-item>
            </mu-breadcrumbs>
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-paper :z-depth="4">
                <mu-row>
                    <mu-form ref="form" :model="add_data" label-position="top">
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="typeid" label="接口分类" :rules="rules.typeid">
                                    <mu-select v-model="add_data.typeid" placeholder="请选择">
                                        <mu-option v-for="(item,index) in type_list" :key="index" :label="item.name" :value="item.id"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="name" label="接口名称" :rules="rules.name" help-text="控制器/操作。如：User/index">
                                    <mu-text-field v-model="add_data.name"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="4">
                                <mu-form-item prop="method" label="请求方式">
                                    <mu-select v-model="add_data.method">
                                        <mu-option label="不限" :value="0"></mu-option>
                                        <mu-option label="POST" :value="1"></mu-option>
                                        <mu-option label="GET" :value="2"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="4">
                                <mu-form-item prop="is_test" label="接口模式">
                                    <mu-select v-model="add_data.is_test">
                                        <mu-option label="生产模式" :value="0"></mu-option>
                                        <mu-option label="测试模式" :value="1"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="4">
                                <mu-form-item prop="need_login" label="用户登陆">
                                    <mu-select v-model="add_data.need_login">
                                        <mu-option label="忽略" :value="0"></mu-option>
                                        <mu-option label="验证" :value="1"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="4">
                                <mu-form-item prop="access_token" label="AppToken">
                                    <mu-select v-model="add_data.access_token">
                                        <mu-option label="验证" :value="1"></mu-option>
                                        <mu-option label="忽略" :value="0"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="4">
                                <mu-form-item prop="status" label="状态">
                                    <mu-select v-model="add_data.status">
                                        <mu-option label="启用" :value="1"></mu-option>
                                        <mu-option label="禁用" :value="0"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="4">
                                <mu-form-item prop="info" label="接口说明" :rules="rules.info">
                                    <mu-text-field v-model="add_data.info"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item prop="return_str" label="返回数据示例" class="x-plr-10">
                            <mu-text-field v-model="add_data.return_str" multi-line :rows="2"></mu-text-field>
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
            type_list: [],    // 分类数据
            add_data: {
                status: 1,
                access_token: 1,
                need_login: 1,
                is_test: 0,
                method: 2,
            },
            rules: {
                name: [
                    { validate: (val) => !!val, message: '必须填写接口名称'}
                ],
                typeid: [
                    { validate: (val) => !!val, message: '请选择分类'},
                ],
                info: [
                    { validate: (val) => !!val, message: '请填写接口说明'},
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
                    _this.xzyn.ajax('/admin/apilist/create','post',_this.add_data,{},function(data,res){
                        _this.xzyn.go();
                    })
                }
            });
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            _this.xzyn.ajax('/admin/apilist/create','get',{},{},function(data,res){
                _this.type_list = data;
            },false)
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