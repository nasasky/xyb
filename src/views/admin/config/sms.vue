<!-- 短信配置页面 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="false" to="/admin/config/index">系统配置字段列表</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">短信配置</mu-breadcrumbs-item>
            </mu-breadcrumbs>
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-paper class="x-p-10" :z-depth="4">
                <mu-row>
                    <mu-form ref="form" :model="add_data" label-position="right">
                        <mu-form-item class="x-mb-0 x-pb-0" label-position="top">
                            <mu-col span="12" v-for="(item,index) in data_list" :key="index" class="x-plr-0">
                                <!-- 单行 -->
                                <mu-row v-if="item.texttype == 'text'">
                                    <mu-col span="12" class="x-plr-0">
                                        <mu-form-item :label="item.desc" :label-position="label_position" :help-text="'变量名：'+item.k">
                                            <mu-text-field v-model="item.v"></mu-text-field>
                                        </mu-form-item>
                                    </mu-col>
                                </mu-row>
                                <!-- 多行 -->
                                <mu-row v-if="item.texttype == 'textarea'">
                                    <mu-col span="12" class="x-plr-0">
                                        <mu-form-item :label="item.desc" :label-position="label_position" :help-text="'变量名：'+item.k">
                                            <mu-text-field v-model="item.v" multi-line :rows="4"></mu-text-field>
                                        </mu-form-item>
                                    </mu-col>
                                </mu-row>
                                <!-- 下拉 -->
                                <mu-row v-if="item.texttype == 'select'">
                                    <mu-col span="12" class="x-plr-0">
                                        <mu-form-item :label="item.desc" :label-position="label_position" :help-text="'变量名：'+item.k">
                                            <mu-select v-model="item.v">
                                                <mu-option v-for="(vo,vi) in item.textvalue" :key="vo" :label="vi" :value="vo"></mu-option>
                                            </mu-select>
                                        </mu-form-item>
                                    </mu-col>
                                </mu-row>
                                <!-- 图片上传 -->
                                <mu-row v-if="item.texttype == 'image'">
                                    <mu-col span="8">
                                        <mu-form-item :label="item.desc" :label-position="label_position" :help-text="'变量名：'+item.k">
                                            <mu-text-field v-model="item.v"></mu-text-field>
                                        </mu-form-item>
                                    </mu-col>
                                    <mu-col span="4">
                                        <div class="x-pt-5 x-tc">
                                            <x-up-img color="info" :del-img="del_img" :input-key="item.k" @change="on_up_img">选择图片</x-up-img>
                                        </div>
                                    </mu-col>
                                </mu-row>

                            </mu-col>
                        </mu-form-item>
                        <mu-form-item class="x-mb-0">
                            <div class="x-w-1 x-tc">
                                <mu-button color="primary" @click="add_ajax">提交保存</mu-button>
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
import xUpImg from '@/components/admin/x-up-img.vue'
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xUpImg},
    name: '',
    props: {},
    data() {
        //这里存放数据
        return {
            label_position: 'right',     // 标题位置
            data_list: [],
            add_data: {},
            group_list: {},  // 分组列表数据
            type_list: {},  // 表单类型
            error_text: '',  // 列表数据错误提示信息
            del_img: '',    // 删除的图片

        };
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        '$root.viewWidth': {
            handler(val){
                if( val <= 600 ){
                    this.label_position = 'top';
                }else{
                    this.label_position = 'right';
                }
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
        // 提交
        add_ajax: function() {
            var _this = this;
            var add_data = _this.data_list;
            var data_arr = [];
            var formData = new FormData();
            for (var i = 0; i < add_data.length; i++) {
                formData.append(add_data[i].k,add_data[i].v);
            }
            formData.append('type','sms');
            _this.xzyn.ajax('/admin/config/save','post',formData,{},function(data,res){
                _this.ajax_data();
            })
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            _this.xzyn.ajax('/admin/config/sms','get',{},{},function(data,res){
                _this.data_list = data;
            },false)
        },
        // 上传图片按钮触发
        on_up_img: function(val,key){
            for (let i = 0; i < this.data_list.length; i++) {
                const item = this.data_list[i];
                if( item.k === key ){
                    this.del_img = item.v;
                    item.v = val;
                }
            }
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