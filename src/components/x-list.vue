<!-- 列表组件 -->
<template>
    <div>
        <x-data-null v-if="notes_data.length == 0" text="没有公开的笔记"></x-data-null>
        <mu-card class="x-mb-10" v-else v-for="(item,index) in notes_data" :key="index">
            <mu-card-header class="x-dwr x-plr-10 x-pt-10 x-pb-0" :title="item.title" :sub-title="item.create_time">
                <mu-avatar slot="avatar" @click="ajax_user_notes_data(item.uid)">
                    <img :src="item.user_avatar">
                </mu-avatar>
            </mu-card-header>
            <mu-card-text class="x-p-10 x-dwr" @click="xzyn.go('/notes/notes_info?id='+item.id)">
                <mu-ripple>
                    <div class="x-tc-shui">{{item.describe}}</div>
                </mu-ripple>
            </mu-card-text>
            <mu-card-actions class="x-pt-0 x-pb-10">
                <mu-badge class="x-mr-5" color="info">
                    <span slot="content"><mu-icon class="x-mr-5" size="12" :value="':fa '+(item.type_icon?item.type_icon:'fa-sliders')"></mu-icon>{{item.type_name}}</span>
                </mu-badge>
                <mu-badge v-if="item.is_show == 1" content="已公开" color="secondary"></mu-badge>
                <mu-menu class="x-fr" cover placement="bottom-end" v-if="$root.user_data? item.uid == $root.user_data.id:false">
                    <mu-button icon small>
                        <mu-icon size="16" value=":fa fa-ellipsis-v"></mu-icon>
                    </mu-button>
                    <mu-list slot="content">
                        <mu-list-item button @click="open_edit(item.id)">
                            <mu-list-item-title>编辑</mu-list-item-title>
                        </mu-list-item>
                        <mu-divider></mu-divider>
                        <mu-list-item button @click="del_ajax(item)">
                            <mu-list-item-title>删除</mu-list-item-title>
                        </mu-list-item>
                    </mu-list>
                </mu-menu>
            </mu-card-actions>
            <mu-divider></mu-divider>
            <mu-card-actions>
                <mu-row>
                    <mu-col span="3" class="x-tc">
                        <mu-button flat small @click="xzyn.go('/notes/notes_info?id='+item.id)">
                            <mu-icon class="x-mr-5" size="14" value=":fa fa-commenting-o"></mu-icon>{{item.reply_num}}
                        </mu-button>
                    </mu-col>
                    <mu-col span="3" class="x-tc">
                        <mu-button flat small @click="collect_ajax(item)">
                            <mu-icon class="x-mr-5" size="14" value=":fa fa-star-o"></mu-icon>{{item.collect_num}}
                        </mu-button>
                    </mu-col>
                    <mu-col span="3" class="x-tc">
                        <mu-button flat small @click="zan_ajax(item)">
                            <mu-icon class="x-mr-5" size="14" value=":fa fa-thumbs-o-up"></mu-icon>{{item.zan_num}}
                        </mu-button>
                    </mu-col>
                    <mu-col span="3" class="x-tc">
                        <span class="x-ml-10"><mu-icon class="x-mr-5" value=":fa fa-eye"></mu-icon>{{item.click}}</span>
                    </mu-col>
                </mu-row>
            </mu-card-actions>
        </mu-card>
        <x-add :show="open_add_layer" @change="add_change"></x-add>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import xAdd from '@/views/notes/add.vue'

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xAdd},
    name: '',
    props: {
        data: {
            type: Array,
            default: []
        },
        current: {  // false 点击头像进入笔记圈列表
            type: Boolean,
            default: false
        }
    },
    data() {
        //这里存放数据
        return {
            notes_data: [],
            open_add_layer: false,  // 打开添加层
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        data:{
            handler(val){
                this.notes_data = val||[];
            },
            immediate: true,
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //方法集合
    methods: {
        // 点击头像触发
        ajax_user_notes_data: function(uid){
            if(this.current){
                this.$emit('change','user',uid);
            }else{
                this.xzyn.go('/notes/notes_list?uid='+uid)
            }
        },
        // 删除笔记
        del_ajax: function(item){
            this.$confirm('删除后不可恢复，确定要删除吗？', '提示').then((res)=>{
                var _this = this;
                if( res.result ){
                    this.xzyn.ajax(_this.request_url.notes_delete,'get',{id:item.id},{},function(data,res){
                        var new_data = [];
                        for (let i = 0; i < _this.notes_data.length; i++) {
                            const vo = _this.notes_data[i];
                            if(vo.id != item.id){
                                new_data.push(vo);
                            }
                        }
                        _this.notes_data = new_data;
                    })
                }
            });
        },
        // 赞提交
        zan_ajax: function(item){
            var _this = this;
            var add_data= {
                notes_id: '',
                reply_id: ''
            }
            add_data.notes_id = item.id;
            this.xzyn.ajax(_this.request_url.notes_zan_add,'get',add_data,{},function(data,res){
                for (var i = 0; i < _this.notes_data.length; i++) {
                    if( _this.notes_data[i].id === item.id ){
                        _this.notes_data[i].zan_num += 1;
                    }
                }
            })
        },
        // 收藏提交
        collect_ajax: function(item){
            var _this = this;
            var add_data = {
                type: 1,
                notes_id: item.id
            }
            this.xzyn.ajax(_this.request_url.collect_add,'get',add_data,{},function(data,res){
                for (var i = 0; i < _this.notes_data.length; i++) {
                    if( _this.notes_data[i].id === item.id ){
                        _this.notes_data[i].collect_num += 1;
                    }
                }
            })
        },
        // 添加页面触发
        add_change: function(val){
            this.open_add_layer = false;
            if(val == 'load'){
                this.$emit('change','load')
            }
        },
        // 打开编辑页
        open_edit: function(id){
            this.open_add_layer = true;
            this.xzyn.edit_datas('edit_data',id)
        }

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {}
}
</script>
<style>
    /*@import url(); 引入公共css类*/

</style>