<!-- 编辑页面 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="false" to="/admin/authrule/index">管理员权限列表</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">编辑权限地址</mu-breadcrumbs-item>
            </mu-breadcrumbs>
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-paper class="x-p-10" :z-depth="4">
                <mu-row>
                    <mu-form ref="form" :model="add_data" label-position="top">
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="pid" label="父级">
                                    <mu-select filterable v-model="add_data.pid" full-width>
                                        <mu-option label="顶级" :value="0"></mu-option>
                                        <mu-option v-for="(item,index) in rules_list" :key="index" :value="item.id" :search-text="item.name"
                                        :label="(item.level==2?'┗━':item.level == 3?'┗━━━':'')+item.title" :disabled="item.level == 3 || item.id == add_data.id">
                                        </mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="level" label="类型">
                                    <mu-select v-model="add_data.level" full-width>
                                        <mu-option label="项目" :value="1"></mu-option>
                                        <mu-option label="模块" :value="2"></mu-option>
                                        <mu-option label="操作" :value="3"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="title" label="权限名称" :rules="rules.title">
                                    <mu-text-field v-model="add_data.title" :max-length="20"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="name" label="权限地址" :rules="rules.name">
                                    <mu-text-field v-model="add_data.name"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="icon" label="图标">
                                    <mu-text-field v-model="add_data.icon" :max-length="20"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="sorts" label="排序">
                                    <mu-text-field type="number" v-model="add_data.sorts"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="6">
                                <mu-form-item prop="ismenu" label="菜单显示">
                                    <mu-select v-model="add_data.ismenu">
                                        <mu-option label="否" :value="0"></mu-option>
                                        <mu-option label="是" :value="1"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="6">
                                <mu-form-item prop="status" label="状态">
                                    <mu-select v-model="add_data.status">
                                        <mu-option label="启用" :value="1"></mu-option>
                                        <mu-option label="停用" :value="0"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0">
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
                pid: 0,
                ismenu: 1,
                sorts: 50,
                status: 1,
                level: 1
            },
            rules_list: [],  // 权限列表数据
            rules: {
                title: [
                    { validate: (val) => !!val, message: '必须填写权限名称'}
                ],
                name: [
                    { validate: (val) => !!val, message: '必须填写权限地址'}
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
                    _this.xzyn.ajax('/admin/authrule/edit','post',_this.add_data,{},function(data,res){
                        _this.xzyn.go();
                    })
                }
            });
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            _this.xzyn.ajax('/admin/authrule/edit','get',{id: _this.$route.query.id},{},function(data,res){
                _this.rules_list = data.rule_list;
                _this.add_data = data.rule_data;
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