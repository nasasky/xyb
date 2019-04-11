<template>
<div>
    <div class="x-pt-10">
        <mu-paper class="x-mlr-10" :z-depth="4">
            <x-list :data="notes_data" @change="on_list_change"></x-list>
        </mu-paper>
    </div>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import xList from '@/components/x-list.vue'
import logo_img from '@/assets/img/logo.jpg'

import xViewItem from '@/components/x-view-item.vue'
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xList,xViewItem},
    data() {
    //这里存放数据
        return {
            logo_img: logo_img,
            notes_data: []
        };
    },
    //监听属性 类似于data概念
    computed: {
    },
    //监控data中的数据变化
    watch: {
        '$root.public_data.notes_data': function(val){
            this.notes_data = val||[];
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.notes_data = this.$root.public_data.notes_data||[];
    },
    //方法集合
    methods: {
        // 列表触发方法
        on_list_change: function(type,val){
            var _this = this;
            if(type == 'load'){
                var type_arr_2 = _this.xzyn.edit_data('account_type_2'); // 笔记分类
                _this.xzyn.ajax(_this.request_url.index_index,'get',{},{},function(data){
                    let time = new Date().getTime();
                    var public_data = {
                        time: time+7200000,		// 有效时间 2小时
                        account_type_2: data.account_type_2,	// 笔记分类
                        m_type_7: data.m_type_7,		// 侧边栏导航数据
                        notes_data: data.notes_data		// 公开/首页的笔记数据
                    }
                    if( !type_arr_2 ){
                        _this.xzyn.edit_data('account_type_2',public_data.account_type_2); // 笔记分类
                    }
                    _this.notes_data = public_data.notes_data;
                    _this.$root.public_data = public_data;
                    _this.xzyn.edit_data('public_data',public_data); // 公共数据
                },false)
            }
        },

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    }
}
</script>
