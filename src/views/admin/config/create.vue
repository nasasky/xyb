<!-- 添加页面 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="false" to="/admin/config/index">系统配置字段列表</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">新增配置字段</mu-breadcrumbs-item>
            </mu-breadcrumbs>
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-paper class="x-p-10" :z-depth="4">
                <mu-row>
                    <mu-form ref="form" :model="add_data" label-position="top">
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="k" label="键" :rules="rules.k">
                                    <mu-text-field v-model="add_data.k" :max-length="20"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="v" label="值" :rules="rules.v">
                                    <mu-text-field v-model="add_data.v"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="type" label="分组(英文)" :rules="rules.type">
                                    <mu-select v-model="add_data.type" full-width>
                                        <mu-option v-for="(item,index) in group_list" :key="index" :value="item" :label="item"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="desc" label="描述">
                                    <mu-text-field v-model="add_data.desc" :max-length="20"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="prompt" label="文本框提示">
                                    <mu-text-field v-model="add_data.prompt" :max-length="20"></mu-text-field>
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
                                <mu-form-item prop="texttype" label="表单类型" :rules="rules.texttype">
                                    <mu-select v-model="add_data.texttype">
                                        <mu-option v-for="(item,index) in type_list" :key="index" :label="item" :value="index"></mu-option>
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
                        <mu-form-item v-if="add_data.texttype == 'select'" prop="textvalue" label="列表数据" help-text="请按此格式填写：key1|value1,key2|value2" :error-text="error_text">
                            <mu-text-field v-model="add_data.textvalue" multi-line :rows="4"></mu-text-field>
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
                sorts: 50,
                status: 1,
            },
            group_list: {},  // 分组列表数据
            type_list: {},  // 表单类型
            rules: {
                k: [
                    { validate: (val) => !!val, message: '必须填写键'}
                ],
                v: [
                    { validate: (val) => !!val, message: '必须填写值'}
                ],
                type: [
                    { validate: (val) => !!val, message: '请选择分组'}
                ],
                texttype: [
                    { validate: (val) => !!val, message: '请选择表单类型'}
                ]
            },
            error_text: ''  // 列表数据错误提示信息

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
                    if( _this.add_data.texttype == 'select' && !_this.add_data.textvalue ){
                        _this.error_text = '请填写列表数据';
                    }else{
                        if( _this.add_data.texttype !== 'select' ){
                            _this.add_data.textvalue = '';
                        }
                        _this.xzyn.ajax('/admin/config/create','post',_this.add_data,{},function(data,res){
                            _this.xzyn.go();
                        })
                    }
                }
            });
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            _this.xzyn.ajax('/admin/config/create','get',{},{},function(data,res){
                _this.group_list = data.groupList;
                _this.type_list = data.typeList;
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