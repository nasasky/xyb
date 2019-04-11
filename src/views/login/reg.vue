<!-- 注册页面 -->
<template>
    <div class=''>
		<mu-paper class="x-m-10" :z-depth="2">
			<mu-container>
				<mu-form ref="form" :model="addData" class="mu-demo-form">
					<mu-form-item label="用户名" prop="username" :rules="rules.usernameRules" label-float>
						<mu-text-field v-model="addData.username" :max-length="18" ></mu-text-field>
					</mu-form-item>
					<mu-form-item label="密码" prop="password" :rules="rules.passwordRules" label-float>
						<mu-text-field type="password" v-model="addData.password" :max-length="25" ></mu-text-field>
					</mu-form-item>
					<mu-form-item label="确认密码" prop="repassword" :rules="rules.repasswordRules" label-float>
						<mu-text-field type="password" v-model="addData.repassword" :max-length="25" ></mu-text-field>
					</mu-form-item>
					<mu-form-item label="邮箱" prop="email" :rules="rules.emailRules" label-float>
						<mu-text-field v-model="addData.email" ></mu-text-field>
					</mu-form-item>
					<mu-form-item label="手机号" prop="moblie" :rules="rules.moblieRules" label-float>
						<mu-text-field type="number" v-model="addData.moblie" ></mu-text-field>
					</mu-form-item>
					<mu-form-item>
						<div class="x-tc x-w-1">
							<mu-button @tap="clear">重置</mu-button>
							<mu-button color="primary" @click="submit">确认注册</mu-button>
						</div>
					</mu-form-item>
				</mu-form>
			</mu-container>
		</mu-paper>

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

    },
    data() {
    //这里存放数据
        return {
            showPassword: true,
            addData:{},
            rules:{	// 验证规则
                usernameRules: [
                    { validate: (val) => !!val, message: '必须填写用户名'},
                    { validate: (val) => val.length >= 3, message: '用户名长度大于3'}
                ],
                passwordRules: [
                    { validate: (val) => !!val, message: '必须填写密码'},
                    { validate: (val) => val.length >= 6, message: '密码长度要大于6位'}
                ],
                repasswordRules: [
                    { validate: (val) => !!val, message: '必须填写确认密码'},
                    { validate: (val) => val.length >= 6, message: '密码长度要大于6位'},
                    { validate: (val) => val === this.addData.password, message: '两个密码不一致'},
                ],
                emailRules: [
                    { validate: (val) => val?!!this.xzyn.is_email(val):true, message: '请正确填写邮箱号'}
                ],
                moblieRules: [
                    { validate: (val) => val?!!this.xzyn.is_mobile(val):true, message: '请正确填写手机号'}
                ]
            }

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        ajax_add: function (){
            var _this = this;
            this.xzyn.ajax(_this.request_url.usertoken_register,'post',_this.addData,{},function(data,res){
                console.log(data)
                _this.addData = {};
                _this.xzyn.go();
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
            this.addData = {};
        }

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
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