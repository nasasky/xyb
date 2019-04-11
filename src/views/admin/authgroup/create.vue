<!-- 添加页面 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="false" to="/admin/authgroup/index">角色管理</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">添加角色</mu-breadcrumbs-item>
            </mu-breadcrumbs>
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-paper class="x-p-10" :z-depth="4">
                <mu-row>
                    <mu-form ref="form" :model="add_data" label-position="right">
                        <mu-form-item label-position="top" class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="title" label="角色名称" :rules="rules.title">
                                    <mu-text-field v-model="add_data.title" :max-length="8"></mu-text-field>
                                </mu-form-item>
                                <mu-form-item prop="notation" label="角色描述" :rules="rules.notation">
                                    <mu-text-field v-model="add_data.notation" :max-length="20"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="pic" label="角色图标">
                                    <mu-text-field v-model="add_data.pic"></mu-text-field>
                                </mu-form-item>
                                <mu-form-item prop="level" label="角色等级" >
                                    <mu-text-field type="number" v-model="add_data.level" :max-length="4"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item label-position="top" class="x-mb-0 x-pb-0">
                            <mu-col span="4">
                                <mu-form-item prop="recom" label="推荐显示" label-position="top">
                                    <mu-select v-model="add_data.recom">
                                        <mu-option label="否" :value="0"></mu-option>
                                        <mu-option label="是" :value="1"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="4">
                                <mu-form-item prop="module" label="所属模块" label-position="top">
                                    <mu-select v-model="add_data.module">
                                        <mu-option label="后台管理员" value="admin"></mu-option>
                                        <mu-option label="前台会员" value="member"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="4">
                                <mu-form-item prop="status" label="状态" label-position="top">
                                    <mu-select v-model="add_data.status">
                                        <mu-option label="启用" :value="1"></mu-option>
                                        <mu-option label="停用" :value="0"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item label-position="top" class="x-mb-0">
                            <div class="x-w-1 x-tc">
                                <mu-button color="primary" @click="add_ajax">提交</mu-button>
                                <mu-button color="secondary" @click="show_auth_list = true">选择权限</mu-button>
                            </div>
                        </mu-form-item>
                    </mu-form>
                </mu-row>
            </mu-paper>
        </div>
        <mu-dialog scrollable :open.sync="show_auth_list">
            <div v-for="(item,index) in rules_list" :key="index" v-if="item.pid == 0 && item.h_layer == 1" class="x-w-1">
                <mu-checkbox :value="item.id"  v-model="rules_id_arr" :label="item.title"></mu-checkbox>

                <div v-for="(vo,vi) in rules_list" :key="vi" v-if="item.id == vo.pid && vo.h_layer == 2" class="x-w-1 x-pl-5">
                    ┗━━━<mu-checkbox :value="vo.id"  v-model="rules_id_arr" :label="vo.title"></mu-checkbox>

                    <div v-for="(vv,vvi) in rules_list" :key="vvi" v-if="vo.id == vv.pid && vv.h_layer == 3" class="x-w-1 x-pl-40">
                        ┗━━━<mu-checkbox :value="vv.id"  v-model="rules_id_arr" :label="vv.title" ></mu-checkbox>
                    </div>
                </div>
            </div>
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
    props: {},
    data() {
        //这里存放数据
        return {
            add_data: {
                status: 1,
                module: 'admin',
                recom: 0,
                level: 2
            },
            rules_list: [],  // 权限列表数据
            rules_id_arr: [],
            show_auth_list: false,
            rules: {
                title: [
                    { validate: (val) => !!val, message: '必须填写名称'},
                    { validate: (val) => val.length >= 2 && val.length <= 8, message: '名称长度大于2小于8'}
                ],
                notation: [
                    { validate: (val) => !!val, message: '必须填写描述'},
                    { validate: (val) => val.length >= 2 && val.length <= 20, message: '描述长度大于6小于18'}
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
                    _this.xzyn.ajax('/admin/authgroup/create','post',_this.add_data,{},function(data,res){
                        _this.xzyn.go();
                    })
                }
            });
        },
        // 获取数据
        ajax_data: function() {
            var _this = this;
            _this.xzyn.ajax('/admin/authgroup/create','get',{},{},function(data,res){
                _this.rules_list = data;
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