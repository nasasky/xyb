<!-- 新增/编辑页面 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="false" to="/admin/apilist/index">API列表</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="false" :to="url_list_btn">请求参数列表</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">{{title}}</mu-breadcrumbs-item>
            </mu-breadcrumbs>
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-paper :z-depth="4">
                <mu-row>
                    <mu-form ref="form" :model="add_data" label-position="top">
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item label="选择数据表">
                                    <mu-select v-model="sjb.biao" placeholder="请选择" @change="on_biao_change">
                                        <mu-option v-for="(item,index) in sj_biao" :key="index" :label="item.name+' ('+item.info+')'" :value="item.name"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item label="选择字段">
                                    <mu-select v-model="sjb.ziduan"  placeholder="请选择" @change="on_field_change">
                                        <mu-option v-for="(item,index) in field_data" :key="index" :label="item.name+' ('+item.info+')'" :value="item"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="name" label="参数名称" :rules="rules.name" help-text="可以自定义，也可以从数据表选择字段">
                                    <mu-text-field v-model="add_data.name"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="default" label="默认值">
                                    <mu-text-field v-model="add_data.default"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="type_id" label="参数类型" :rules="rules.type_id">
                                    <mu-select v-model="add_data.type_id" placeholder="请选择">
                                        <mu-option v-for="(item,index) in type_data" :key="index" :label="item" :value="index"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="is_must" label="是否必传">
                                    <mu-select v-model="add_data.is_must">
                                        <mu-option label="必传" :value="1"></mu-option>
                                        <mu-option label="可不传" :value="0"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0 x-pb-0">
                            <mu-col span="12" md="6">
                                <mu-form-item prop="info" label="参数说明" :rules="rules.info">
                                    <mu-text-field multi-line :rows="2" v-model="add_data.info"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
                            <mu-col span="12" md="6">
                                <mu-form-item prop="range" label="规则细节">
                                    <mu-text-field multi-line :rows="2" v-model="add_data.range"></mu-text-field>
                                </mu-form-item>
                            </mu-col>
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
            sjb: {
                biao: '',
                ziduan: ''
            },
            add_data: {
                is_must: 1,
                name: '',
                info: ''
            },
            type_data: {},  // 参数类型数据
            sj_biao: [],    // 数据表数据
            field_data: [], // 数据表字段
            rules: {
                name: [
                    { validate: (val) => !!val, message: '必须填写参数名称'}
                ],
                type_id: [
                    { validate: (val) => !!val, message: '请选择参数类型'},
                ],
                info: [
                    { validate: (val) => !!val, message: '必须填写参数说明'},
                ]
            }

        };
    },
    //计算属性 类似于data概念
    computed: {
        title: function(){
            if( this.$route.query.id ){
                return '编辑请求参数';
            }else{
                return '新增请求参数';
            }
        },
        url_list_btn: function(){
            return '/admin/apilist/qingqiu_index?type='+this.$route.query.type+'&hash='+this.$route.query.hash;
        }
    },
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
                    _this.add_data.type = _this.$route.query.type;
                    _this.add_data.hash = _this.$route.query.hash;
                    _this.xzyn.ajax('/admin/apilist/editrs','post',_this.add_data,{},function(data,res){
                        _this.xzyn.go();
                    })
                }
            });
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            var add_data = {
                type: _this.$route.query.type,
                hash: _this.$route.query.hash
            }
            if( _this.$route.query.id ){
                add_data.id = _this.$route.query.id
            }
            _this.xzyn.ajax('/admin/apilist/editrs','get',add_data,{},function(data,res){
                if( _this.$route.query.id ){
                    _this.add_data = data.data;
                }
                _this.type_data = data.data_type;
                _this.sj_biao = data.sj_biao;
            },false)
        },
        // 选择数据表触发
        on_biao_change: function(val){
            var _this = this;
            _this.sjb.ziduan = '';
            _this.xzyn.ajax('/admin/apilist/getInfo','post',{name:val},{},function(data,res){
                _this.field_data = data;
            },false)
        },
        // 选择字段触发
        on_field_change: function(item){
            this.add_data.name = item.name;
            this.add_data.info = item.info+'，类型：'+item.type;
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