<!-- 添加笔记页面 -->
<template>
    <div class=''>
		<x-layer-view :show="open_layer" title="添加笔记" @change="show_change">
            <div class="x-f14" style="padding-bottom:58px;">
                <mu-paper :z-depth="2" class="x-p-10">
                    <mu-form ref="form" :model="add_data">
                        <mu-form-item label-position="top">
                            <mu-row class="x-w-1">
                                <mu-col span="10">
                                    <mu-form-item label="标题" help-text="标题长度大于4小于30个字符" prop="title" :rules="rules.titleRules">
                                        <mu-text-field v-model="add_data.title" :max-length="30"></mu-text-field>
                                    </mu-form-item>
                                </mu-col>
                                <mu-col span="2">
                                    <mu-form-item label="是否公开" prop="is_show" :help-text="add_data.is_show==0?'不公开':'已公开'">
                                        <mu-switch v-model="is_show" @change="is_show_change"></mu-switch>
                                    </mu-form-item>
                                </mu-col>
                            </mu-row>
                        </mu-form-item>
                        <mu-form-item label="笔记分类" help-text="必须选择分类" label-position="right" prop="type_id" :rules="rules.type_idRules">
                            <mu-select v-model="add_data.type_id" full-width @change="change_type">
                                <mu-option v-for="(item,index) in notes_type" :key="index" :label="item.name" :value="item.id">
                                    <mu-list-item-action>
                                        <mu-icon :value="':fa '+(item.icon?item.icon:'fa-cny')"></mu-icon>
                                    </mu-list-item-action>
                                    <mu-list-item-content>
                                        <mu-list-item-title>{{item.name}}</mu-list-item-title>
                                    </mu-list-item-content>
                                </mu-option>
                            </mu-select>
                        </mu-form-item>
                        <mu-form-item label="笔记正文" prop="content" :rules="rules.contentRules">
                            <div class="x-w-1 x-b x-plr-10 x-yj-4">
                                <x-html5-edit :init-content="add_data.content" :init-imgurl="add_data.imgurl" :up-img-num="2" @change="change_content"></x-html5-edit>
                            </div>
                        </mu-form-item>
                    </mu-form>
                </mu-paper>
                <mu-button class="x-dwf-rb add-btn" color="primary" @click="add_ajax">提交保存</mu-button>
            </div>
		</x-layer-view>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import xHtml5Edit from '@/components/x-html5-edit.vue'
import xLayerView from '@/components/x-layer-view'

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xHtml5Edit,xLayerView},
    name: '',
    props: {
        show:{
            type:[Boolean],
            default: false
        }
    },
    data() {
        //这里存放数据
        return {
            open_layer: false,  // 打开页面层
            notes_type: [],	// 笔记分类
            add_data: {
                is_show: 0,
                imgurl: [],
                content: '',
                type_id: '',
                uid: '',
                title: ''
            },
            is_show : false,
            rules:{	// 验证规则
                titleRules: [
                    { validate: (val) => !!val, message: '必须填写标题'},
                    { validate: (val) => val.length >= 4 && val.length <= 30, message: '标题长度大于4小于30'}
                ],
                type_idRules: [
                    { validate: (val) => !!val, message: '必须选择分类'}
                ],
                contentRules: [
                    { validate: (val) => !!val, message: '必须填写正文'}
                ]
            }

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        show: function(val){
            this.open_layer = val;
            if(val){
                this.init_data();
            }
        },
        open_layer: function(val){
            if(val == false){
                this.$emit('change')
            }
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //方法集合
    methods: {
        // 初始化数据
        init_data: function(){
            this.add_data = {
                is_show: 0,
                imgurl: [],
                content: '',
                type_id: '',
                uid: this.$root.user_data.id,
                title: ''
            }
            this.is_show = false;
            this.notes_type = this.xzyn.edit_data('account_type_2');	// 分类数据
            var get_id = this.xzyn.edit_datas('edit_data');
            if( get_id ){
                this.add_data.id = get_id;
                this.xzyn.edit_datas('edit_data',true);
                this.ajax_data();
            }
        },
        // 是否公开触发
        is_show_change: function(val){
            if( val ){
                this.add_data.is_show = 1;
            }else{
                this.add_data.is_show = 0;
            }
        },
        // 编辑内容改变触发
        change_content: function(obj){
            this.add_data.content = obj.content;
            this.add_data.imgurl = obj.imgurl;
            // console.log(obj)
        },
        // 选择分类触发
        change_type: function(val){
            this.add_data.type_id = val;
        },
        // 提交保存
        add_ajax: function(){
            var _this = this;
            this.$refs.form.validate().then((result) => {
                if( result ){
                    _this.xzyn.ajax(_this.request_url.notes_add,'post',_this.add_data,{},function(data,res){
                        _this.$emit('change','load')
                    })
                }
            });
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            _this.xzyn.ajax(_this.request_url.notes_info,'get',{id:_this.add_data.id},{},function(data,res){
                _this.add_data = data.notes_data;
                if( data.notes_data.is_show == 1 ){
                    _this.is_show = true;
                }else{
                    _this.is_show = false;
                }
            },false)
        },
		// 弹层触发
		show_change: function(val){
			this.open_layer = val;
		}

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {}
}
</script>
<style>
    /*@import url(); 引入公共css类*/
	.add-btn{
		bottom: 6px;
		right: 6px;
	}

</style>