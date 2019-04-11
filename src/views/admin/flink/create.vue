<!-- 添加页面 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="false" to="/admin/flink/index">友情链接列表</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">新增友情链接</mu-breadcrumbs-item>
            </mu-breadcrumbs>
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-paper :z-depth="4">
                <mu-row>
                    <mu-form ref="form" :model="add_data" label-position="top">
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="webname" label="网站名称" :rules="rules.webname">
                                    <mu-text-field v-model="add_data.webname" :max-length="18"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="url" label="网站URL" :rules="rules.url">
                                    <mu-text-field v-model="add_data.url"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="logo" label="网站LOGO" :rules="rules.logo">
                                    <mu-text-field v-model="add_data.logo"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="email" label="站长邮箱" :rules="rules.email">
                                    <mu-text-field v-model="add_data.email" type="email"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="sorts" label="排序">
                                    <mu-text-field v-model="add_data.sorts"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="status" label="状态">
                                    <mu-select v-model="add_data.status">
                                        <mu-option label="启用" :value="1"></mu-option>
                                        <mu-option label="禁用" :value="0"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="info" label="简介说明" >
                                    <mu-text-field v-model="add_data.info" :max-length="80" ></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item>
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
            add_data: {
                status: 1,
                sorts: 1
            },
            rules: {
                webname: [
                    { validate: (val) => !!val, message: '必须填写网站名称'}
                ],
                url: [
                    { validate: (val) => !!val, message: '必须填写网站URL'},
                ],
                logo: [
                    { validate: (val) => !!val, message: '必须填写LOGO地址'}
                ],
                email: [
                    { validate: (val) => !!val, message: '必须填写站长邮箱'}
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
    created() {},
    //方法集合
    methods: {
        // 提交
        add_ajax: function() {
            var _this = this;
            this.$refs.form.validate().then((result) => {
                if( result ){
                    _this.xzyn.ajax('/admin/flink/create','post',_this.add_data,{},function(data,res){
                        _this.xzyn.go();
                    })
                }
            });
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