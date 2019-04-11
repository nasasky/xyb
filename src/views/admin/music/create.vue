<!-- 添加页面 -->
<template>
    <div>
        <mu-row>
            <mu-form ref="form" :model="add_data" label-position="top">
                <mu-form-item class="x-mb-0 x-pb-0">
                    <mu-col span="12" md="6">
                        <mu-form-item prop="name" label="音乐歌名" :rules="rules.name">
                            <mu-text-field v-model="add_data.name"></mu-text-field>
                        </mu-form-item>
                    </mu-col>
                    <mu-col span="12" md="6">
                        <mu-form-item prop="author" label="歌手名称" :rules="rules.author">
                            <mu-text-field v-model="add_data.author"></mu-text-field>
                        </mu-form-item>
                    </mu-col>
                </mu-form-item>
                <mu-form-item class="x-mb-0 x-pb-0">
                    <mu-col span="12" md="6">
                        <mu-form-item prop="src" label="音乐地址" :rules="rules.src">
                            <mu-text-field v-model="add_data.src" ></mu-text-field>
                        </mu-form-item>
                    </mu-col>
                    <mu-col span="12" md="6">
                        <mu-form-item prop="cover" label="封面地址" :rules="rules.cover">
                            <mu-text-field v-model="add_data.cover"></mu-text-field>
                        </mu-form-item>
                    </mu-col>
                </mu-form-item>
                <mu-form-item class="x-mb-0 x-pb-0">
                    <mu-col span="12" md="6">
                        <mu-form-item prop="orderby" label="排序">
                            <mu-text-field type="number" v-model="add_data.orderby"></mu-text-field>
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
                orderby: 50,
                status: 1
            },
            rules: {
                name: [
                    { validate: (val) => !!val, message: '必须填写音乐名称'}
                ],
                author: [
                    { validate: (val) => !!val, message: '必须填写歌手名称'}
                ],
                src: [
                    { validate: (val) => !!val, message: '必须填写音乐地址'}
                ],
                cover: [
                    { validate: (val) => !!val, message: '必须填写封面地址'}
                ]
            },
            type: 'create'  // 新增/编辑

        };
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        '$parent.id': {
            handler(val){
                if(val){
                    this.type = 'edit';
                    this.ajax_data(val);
                }else{
                    this.type = 'create';
                }
            },
            immediate: true,
            deep: true
        },
        '$parent.show_view': {
            handler(val){
                if(val == 'music_create'){
                    this.add_data = {
                        orderby: 50,
                        status: 1
                    }
                }
            },
            immediate: true,
            deep: true
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //方法集合
    methods: {
        // 提交
        add_ajax: function() {
            var _this = this;
            this.$refs.form.validate().then((result) => {
                if( result ){
                    _this.xzyn.ajax('/admin/music/'+_this.type,'post',_this.add_data,{},function(data,res){
                        _this.add_data = {orderby: 50, status: 1};
                        var vu_arr = _this.$parent.$children;
                        for (let i = 0; i < vu_arr.length; i++) {
                            if( vu_arr[i].name == 'music_index' ){
                                vu_arr[i].init_data();
                            }
                        }
                        _this.$parent.on_tab_change('music_index')
                    })
                }
            });
        },
        // 获取数据
        ajax_data: function(id){
            var _this = this;
            _this.xzyn.ajax('/admin/music/edit','get',{id:id},{},function(data,res){
                _this.add_data = data;
            },false)
        },

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {}
}
</script>
<style>
    /*@import url(); 引入公共css类*/

</style>