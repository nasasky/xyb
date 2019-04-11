<!-- 笔记详情页面 -->
<template>
    <div class=''>
        <x-data-null v-if="!notes_data.title" text="没有数据"></x-data-null>
        <div v-else class="x-p-10">
            <mu-load-more @refresh="ajax_data" :refreshing="is_refresh">
                <mu-card raised>
                    <mu-card-header class="x-dwr x-p-10" :title="notes_data.user_name" :sub-title="notes_data.create_time">
                        <mu-button color="primary" small icon :disabled="$root.user_data?notes_data.uid == $root.user_data.id:true" @click="focus_ajax(notes_data.uid)">
                            <mu-icon size="18" value=":fa fa-heart-o"></mu-icon>
                        </mu-button>
                        <mu-avatar slot="avatar" @click="xzyn.go('/notes/notes_list?uid='+notes_data.uid)">
                            <img :src="notes_data.user_avatar">
                        </mu-avatar>
                    </mu-card-header>
                    <mu-card-title class="x-plr-10 x-ptb-0" :title="notes_data.title"></mu-card-title>
                    <mu-card-text class="x-p-10">
                        <div v-html="notes_data.content"></div>
                    </mu-card-text>
                    <mu-card-actions class="x-pb-10 x-pt-0">
                        <mu-badge class="x-mr-5" color="info">
                            <span slot="content"><mu-icon class="x-mr-5" size="12" :value="':fa '+(notes_data.type_icon?notes_data.type_icon:'fa-sliders')"></mu-icon>{{notes_data.type_name}}</span>
                        </mu-badge>
                        <mu-badge v-if="notes_data.is_show == 1" content="已公开" color="secondary"></mu-badge>
                        <mu-menu class="x-fr" cover placement="bottom-end" v-if="$root.user_data?notes_data.uid == $root.user_data.id:false">
                            <mu-button icon small>
                                <mu-icon size="16" value=":fa fa-ellipsis-v"></mu-icon>
                            </mu-button>
                            <mu-list slot="content">
                                <mu-list-item button @click="open_edit(notes_data.id)">
                                    <mu-list-item-title>编辑</mu-list-item-title>
                                </mu-list-item>
                                <mu-divider></mu-divider>
                                <mu-list-item button @click="del_ajax">
                                    <mu-list-item-title>删除</mu-list-item-title>
                                </mu-list-item>
                            </mu-list>
                        </mu-menu>
                    </mu-card-actions>
                    <mu-divider></mu-divider>
                    <mu-card-actions>
                        <mu-row>
                            <mu-col span="3" class="x-tc">
                                <mu-button flat small @click="open_add_reply_layer">
                                    <mu-icon class="x-mr-5" size="14" value=":fa fa-commenting-o"></mu-icon>{{notes_data.reply_num}}
                                </mu-button>
                            </mu-col>
                            <mu-col span="3" class="x-tc">
                                <mu-button flat small @click="collect_ajax(notes_data)">
                                    <mu-icon class="x-mr-5" size="14" value=":fa fa-star-o"></mu-icon>{{notes_data.collect_num}}
                                </mu-button>
                            </mu-col>
                            <mu-col span="3" class="x-tc">
                                <mu-button flat small @click="zan_ajax()">
                                    <mu-icon class="x-mr-5" size="14" value=":fa fa-thumbs-o-up"></mu-icon>{{notes_data.zan_num}}
                                </mu-button>
                            </mu-col>
                            <mu-col span="3" class="x-tc">
                                <span class="x-ml-10"><mu-icon class="x-mr-5" value=":fa fa-eye"></mu-icon>{{notes_data.click}}</span>
                            </mu-col>
                        </mu-row>
                    </mu-card-actions>
                </mu-card>
            </mu-load-more>
        </div>
        <!-- 笔记编辑页面 -->
        <x-add :show="open_add_layer" @change="add_change"></x-add>
        <!-- 回复列表 -->
        <x-notes-reply-list ref="reply" :id="notes_id"></x-notes-reply-list>
        <!-- 添加回复 -->
        <x-add-notes-reply :show="is_show_add_layer" :data="add_reply_data" @change="on_add_change"></x-add-notes-reply>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import xAdd from './add.vue'
import xNotesReplyList from '@/components/x-notes-reply-list'
import xAddNotesReply from '@/components/x-add-notes-reply'

import xViewItem from '@/components/x-view-item.vue'
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {xAdd,xNotesReplyList,xAddNotesReply,xViewItem},
    name: '',
    props: {},
    data() {
        //这里存放数据
        return {
            is_refresh: false,    // 是否刷新
            notes_data: {},	// 笔记数据
            open_add_layer: false,  // 打开添加层
            is_show_add_layer: false,    // 添加回复层
            add_reply_data: {},
            notes_id: 0

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
		this.ajax_data();
    },
    //方法集合
    methods: {
			// 获取数据
			ajax_data: function(){
                var _this = this;
                this.is_refresh = true;
				_this.xzyn.ajax(_this.request_url.notes_info,'get',{id:this.$route.query.id},{},function(data,res){
                    _this.is_refresh = false;
					_this.notes_data = data.notes_data;
                    _this.$root.title = data.notes_data.title
                    _this.notes_id = data.notes_data.id;
                    _this.$refs.reply.init_reply_data();
				},false)
			},
			// 删除笔记
			del_ajax: function(){
				this.$confirm('删除后不可恢复，确定要删除吗？', '提示').then((res)=>{
					var _this = this;
					if( res.result ){
						this.xzyn.ajax(_this.request_url.notes_delete,'get',{id:this.$route.query.id},{},function(data,res){
							_this.xzyn.go();
						})
					}
				});
			},
			// 关注用户
			focus_ajax: function(uid){
				var _this = this;
				var add_data = {
					type: 1,
					uid: uid
				}
				this.xzyn.ajax(_this.request_url.focus_add,'get',add_data,{},function(data,res){
				})
			},
			// 赞提交
			zan_ajax: function(item=''){
				var _this = this;
				var add_data= {
					notes_id: _this.notes_data.id,
					reply_id: ''
				}
				this.xzyn.ajax(_this.request_url.notes_zan_add,'get',add_data,{},function(data,res){
					_this.notes_data.zan_num += 1;
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
					_this.notes_data.collect_num += 1;
				})
			},
            // 添加页面触发
            add_change: function(val){
                this.open_add_layer = false;
                if(val == 'load'){
                    this.ajax_data();
                }
            },
            // 打开编辑页
            open_edit: function(id){
                this.open_add_layer = true;
                this.xzyn.edit_datas('edit_data',id)
            },
            // 打开回复页面层
            open_add_reply_layer: function(){
                this.is_show_add_layer = true;
                this.add_reply_data = {
                    pid: 0,
                    notes_id: this.$route.query.id
                }
            },
            // 回复页面回调
            on_add_change: function(val){
                this.is_show_add_layer = false;
                if(val=='load'){
                    this.$refs.reply.init_reply_data();
                }
            }

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {}
}
</script>
<style>
    /*@import url(); 引入公共css类*/
	.reply-content{
		background-color: #efeff4;
		height:100vh;
		overflow-y: scroll;
		padding-top:66px;
	}

</style>