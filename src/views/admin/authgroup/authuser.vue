<!-- 授权用户页 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="false" to="/admin/authgroup/index">角色管理</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">授权用户</mu-breadcrumbs-item>
            </mu-breadcrumbs>
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-paper :z-depth="4">
                <mu-row>
                    <mu-col span="6" class="x-b-r">
                        <mu-sub-header>未授权用户</mu-sub-header>
                        <mu-divider></mu-divider>
                        <div class="x-plr-10 x-pb-5 x-pt-10">
                            <mu-flex class="x-pb-5" v-for="(item,index) in user_list" :key="index">
                                <mu-checkbox :value="item.id" v-model="val_arr_l" :label="item.name||item.username" @click="add_id('right')"></mu-checkbox>
                            </mu-flex>
                        </div>
                    </mu-col>
                    <mu-col span="6" class="x-b-l">
                        <mu-sub-header>已授权用户</mu-sub-header>
                        <mu-divider></mu-divider>
                        <div class="x-plr-10 x-pb-5 x-pt-10">
                            <mu-flex class="x-pb-5" v-for="(item,index) in auth_list" :key="index">
                                <mu-checkbox :value="item.id" v-model="val_arr_r" :label="item.name||item.username" @click="add_id('left')"></mu-checkbox>
                            </mu-flex>
                        </div>

                    </mu-col>
                </mu-row>
            </mu-paper>
            <div class="x-tc x-pt-15">
                <mu-button color="primary" @click="add_ajax">保存</mu-button>
            </div>
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
            auth_id_arr: [],   // 已授权用户ID
            auth_list: [],   // 已授权用户
            user_list: [],  // 全部用户数据
            val_arr_l: [],    // 选择的ID
            val_arr_r: [],    // 选择的ID

        };
    },
    //计算属性 类似于data概念
    computed: {
    },
    //监控data中的数据变化
    watch: {
        auth_list: {
            handler(val){
                var new_arr = [];
                for (const k in val) {
                    if (val.hasOwnProperty(k)) {
                        const item = val[k];
                        new_arr.push(item.id);
                    }
                }
                this.auth_id_arr = new_arr;
            },
            immediate: true,
            deep: true
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.ajax_data();
    },
    //方法集合
    methods: {
        // 获取数据
        ajax_data: function(){
            var _this = this;
            _this.xzyn.ajax('/admin/authgroup/authuser','get',{id: _this.$route.query.id},{},function(data,res){
                _this.auth_list = data.authList;
                var user = data.userList;
                var auth = data.authList;
                for (var i = 0; i < user.length; i++) {
                    var u = user[i];
                    for (var k = 0; k < auth.length; k++) {
                        var a = auth[k];
                        if( u.id == a.id ){
                            user.splice(i, auth.length);
                        }
                    }
                }
                _this.user_list = user;
                console.log(data)
            },false)
        },
        // 操作按钮
        add_id: function(val){
            if( val == 'left' ){
                for (let i = 0; i < this.val_arr_r.length; i++) {
                    const t = this.val_arr_r[i];
                    for (let ii = 0; ii < this.auth_list.length; ii++) {
                        const tt = this.auth_list[ii];
                        if( t == tt.id ){
                            this.user_list.push(tt);
                            this.auth_list.splice(ii,1);
                            this.val_arr_r.splice(i,1);
                        }
                    }
                }
            }else if( val == 'right' ){
                for (let i = 0; i < this.val_arr_l.length; i++) {
                    const t = this.val_arr_l[i];
                    for (let ii = 0; ii < this.user_list.length; ii++) {
                        const tt = this.user_list[ii];
                        if( t == tt.id ){
                            this.auth_list.push(tt);
                            this.user_list.splice(ii,1);
                            this.val_arr_l.splice(i,1);
                        }
                    }
                }

            }
        },
        // 提交保存
        add_ajax: function(){
            var _this = this;
            var uid = _this.auth_id_arr.join();
            _this.xzyn.ajax('/admin/authgroup/authuser','post',{id: _this.$route.query.id,uid: uid},{},function(data,res){
                _this.xzyn.go();
            })
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