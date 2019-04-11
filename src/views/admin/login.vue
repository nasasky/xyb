<!-- 后台登陆页面 -->
<template>
    <div>
        <x-view bg-img style="height:100%;">
            <mu-row>
                <mu-col span="0" sm="3" lg="4"></mu-col>
                <mu-col span="12" sm="6" lg="4">
                    <div class="x-tc x-mt-40">
                        <mu-avatar :size="80">
                            <img :src="logo_img">
                        </mu-avatar>
                        <div class="x-f30">戏中有你</div>
                    </div>
                    <mu-paper class="x-mlr-10 x-mt-10 logo-bg" :z-depth="4">
                        <mu-container>
                            <mu-form ref="form" :model="add_data" >
                                <mu-form-item label="用户名" prop="username" :rules="usernameRules" label-float>
                                    <mu-text-field v-model="add_data.username" full-width></mu-text-field>
                                </mu-form-item>
                                <mu-form-item label="密码" prop="password" :rules="passwordRules" label-float>
                                    <mu-text-field type="password" v-model="add_data.password" ></mu-text-field>
                                </mu-form-item>
                                <mu-form-item>
                                    <div class="x-tc x-w-1">
                                        <mu-button @click="clear">重置</mu-button>
                                        <mu-button color="primary" @click="ajax_add">确认登陆</mu-button>
                                    </div>
                                </mu-form-item>
                            </mu-form>
                        </mu-container>
                    </mu-paper>
                </mu-col>
                <mu-col span="0" sm="3" lg="4"></mu-col>
            </mu-row>
        </x-view>
    </div>
</template>

<script>
//例如：import 《组件名称》 from '《组件路径》';
import logo from '@/assets/img/logo.jpg'
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    name: '',
    props: {},
    data() {
        //这里存放数据
        return {
            logo_img: logo,
            add_data:{},
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
    watch: {
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //方法集合
    methods: {
        // 登陆
        ajax_add: function (){
            var _this = this;
            this.$refs.form.validate().then((result) => {
                if(result){
                    _this.xzyn.ajax('/admin/login','post',_this.add_data,{},function(data,res){
                        for (let i = 0; i < data.urlList.length; i++) {
                            const url_item = data.urlList[i];
                            data.urlList[i].name = '/admin/'+url_item.name;
                        }
                        _this.xzyn.edit_data('user_token',data.userData.userToken);
                        _this.xzyn.edit_data('user_data',data.userData);
                        _this.xzyn.edit_data('url_list',data.urlList);
                        _this.$root.user_data = data.userData;
                        _this.$root.url_list = data.urlList;
                        _this.xzyn.go('/admin/index/index');
                    })
                }
            });
        },
        // 重置
        clear: function (){
            this.$refs.form.clear();
            this.add_data = {};
        }

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
    }
}
</script>
<style>
    /*@import url(); 引入公共css类*/
    .logo-bg{
        background-color: rgba(255, 255, 255, 0.3)
    }
</style>