<!-- 登陆页面 -->
<template>
<div>
    <mu-paper class="x-mlr-10 x-mt-10" :z-depth="2">
        <mu-container>
            <mu-form ref="form" :model="add_data" >
                <mu-form-item label="用户名" prop="username" :rules="usernameRules" label-float>
                    <mu-text-field v-model="add_data.username" full-width></mu-text-field>
                </mu-form-item>
                <mu-form-item label="密码" prop="password" :rules="passwordRules" label-float>
                    <mu-text-field type="password" v-model="add_data.password" ></mu-text-field>
                </mu-form-item>
                <mu-form-item>
                    <mu-switch v-model="is_save" label="记住登陆" @change="checkboxChange"></mu-switch>
                </mu-form-item>
                <mu-form-item>
                    <div class="x-tc x-w-1">
                        <mu-button @click="clear">重置</mu-button>
                        <mu-button color="primary" @click="submit">确认登陆</mu-button>
                    </div>
                </mu-form-item>
            </mu-form>
        </mu-container>
    </mu-paper>
    <div class="x-tr">
        <mu-button flat color="primary" small @click="xzyn.go('/login/reg')">注册账号</mu-button>
        <mu-button flat color="primary" small @click="xzyn.go('pwd')">忘记密码</mu-button>
    </div>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        return {
            add_data:{},
            is_save: true,	// 记住账号
            usernameRules: [
                { validate: (val) => !!val, message: '必须填写用户名'},
                { validate: (val) => val.length >= 3, message: '用户名长度大于3'}
            ],
            passwordRules: [
                { validate: (val) => !!val, message: '必须填写密码'},
                { validate: (val) => val.length >= 6, message: '密码长度大于6位'}
            ],
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        checkboxChange(val){
            this.is_save = val;
        },
        ajax_add: function (){
            var _this = this;
            this.xzyn.ajax(_this.request_url.usertoken_index,'post',_this.add_data,{},function(data,res){
                if( _this.is_save ){
                    _this.xzyn.edit_data('login_data',_this.add_data);
                }else{
                    _this.add_data = {};
                    _this.xzyn.edit_data('login_data',true);
                }
                var time = new Date().getTime();    // 当前的时间
                var tokenobj = {
                    usertoken: data.userToken,
                    time: time + data.expire*1000 - 300000  // 提前5分钟
                }
                _this.xzyn.edit_data('user_token',tokenobj);
                _this.xzyn.edit_data('user_data',data.userData);
                _this.xzyn.go('/user/index');
            })
        },
        submit: function (e) {
            this.$refs.form.validate().then((result) => {
                if(result){
                    this.ajax_add();
                }
            });
        },
        clear: function (){
            this.$refs.form.clear();
            this.add_data = {};
        }

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        var login_data = this.xzyn.edit_data('login_data');
        if( login_data ){
            this.add_data = login_data;
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
    activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style>
/*@import url(); 引入公共css类*/
</style>