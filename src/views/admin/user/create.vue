<!-- 添加页面 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="false" to="/admin/user/index">用户列表</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">添加用户</mu-breadcrumbs-item>
            </mu-breadcrumbs>
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-paper class="x-p-10" :z-depth="4">
                <mu-row>
                    <mu-form ref="form" :model="add_data" label-position="top">
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="username" label="账号" :rules="rules.username">
                                    <mu-text-field v-model="add_data.username" :max-length="18"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="password" label="密码" help-text="不修改请留空" :rules="rules.password">
                                    <mu-text-field type="password" v-model="add_data.password" :max-length="18"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="name" label="昵称" :rules="rules.name">
                                    <mu-text-field v-model="add_data.name" :max-length="18"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="email" label="邮箱" :rules="rules.email">
                                    <mu-text-field v-model="add_data.email" type="email"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="moblie" label="手机" :rules="rules.moblie">
                                    <mu-text-field v-model="add_data.moblie" type="number"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="qq" label="QQ">
                                    <mu-text-field v-model="add_data.qq" type="number"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="weixin" label="微信" >
                                    <mu-text-field v-model="add_data.weixin"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="birthday" label="生日" >
                                    <mu-date-input v-model="add_data.birthday" label-float full-width @change="on_birthday"></mu-date-input>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="sex" label="性别">
                                    <mu-select v-model="add_data.sex">
                                        <mu-option label="男" :value="1"></mu-option>
                                        <mu-option label="女" :value="0"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item label-position="top" prop="info" label="个人简介" >
                                    <mu-text-field v-model="add_data.info" :rows="1" :max-length="100" multi-line></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item>
                            <div class="x-w-1 x-tc">
                                <mu-button color="primary" @click="add_ajax">提交</mu-button>
                                <mu-button @click="clear">重置</mu-button>
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
            add_data: {},
            rules: {
                username: [
                    { validate: (val) => !!val, message: '必须填写用户名'},
                    { validate: (val) => val.length >= 3 && val.length <= 18, message: '用户名长度大于3小于18'}
                ],
                password: [
                    { validate: (val) => !!val, message: '必须填写密码'},
                    { validate: (val) => val.length >= 6 && val.length <= 18, message: '密码长度大于6小于18'}
                ],
                name: [
                    { validate: (val) => !!val, message: '必须填写昵称'},
                    { validate: (val) => val.length >= 2 && val.length <= 18, message: '昵称长度大于2小于18'}
                ]
            }

        };
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        '$route': {  // 监听路由
            handler(val){
                //console.log(val)
            },
            immediate: true,
            deep: true
        }
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
                    _this.xzyn.ajax('/admin/user/create','post',_this.add_data,{},function(data,res){
                        _this.xzyn.go();
                    })
                }
            });
        },
        // 重置
        clear: function() {
            this.$refs.form.clear();
            this.add_data = {};
        },
        // 选择生日触发
        on_birthday: function(date){
            var date_ymd = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            this.add_data.birthday = date_ymd;
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