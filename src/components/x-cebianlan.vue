<!-- 侧边栏组件 -->
<template>
    <div class=''>
        <mu-drawer :open.sync="cbl_layer" left :docked="docked" :style="{paddingTop:paddingTop}">
            <div class="x-dwr">
                <mu-button icon color="#ffffff" class="x-dwa-lt" @click="open_bg_list">
                    <mu-icon value=":fa fa-life-saver fa-pulse"></mu-icon>
                </mu-button>
                <x-view bg-img>
                    <div class="x-tc x-pt-30">
                        <mu-avatar class="x-yy-4" :size="80" @click="open_view({url:'/user/index',layer_num:0})">
                            <img v-if="xzyn.is_login()" :src="$root.user_data.avatar">
                            <img v-else src="@/assets/img/logo.jpg">
                        </mu-avatar>
                    </div>
                    <div class="x-tc x-ptb-10">
                        <div class="x-tw" v-if="xzyn.is_login()">{{$root.user_data.name||$root.user_data.username}}</div>
                        <div v-else class="x-plr-15 x-ptb-10">
                            <mu-button color="primary" @click="open_view({url:'/login/index',layer_num:0})">登陆</mu-button>
                            <mu-button class="x-ml-10" @click="open_view({url:'/login/reg',layer_num:0})">注册</mu-button>
                        </div>
                    </div>
                    <mu-row v-if="xzyn.is_login()" class="x-ptb-20 x-tc">
                        <mu-col span="6">
                            <mu-button color="secondary" small @click="ajax_loginout">退出登陆</mu-button>
                        </mu-col>
                        <mu-col span="6" v-if="$root.user_data.userGroup.length > 0">
                            <mu-button small @click="xzyn.go('/admin/index/index')">管理后台</mu-button>
                        </mu-col>
                    </mu-row>
                </x-view>
                <mu-list toggle-nested>
                    <mu-list-item button nested :open="false" v-for="(item,index) in type_data" :key="index" v-if="item.pid == 0" @click="open_view(item)">
                        <mu-list-item-title>{{item.name}}</mu-list-item-title>
                        <mu-list-item-action v-if="item.news != 0">
                            <mu-badge :content="item.news" :color="item.iconcolor?item.iconcolor:'secondary'"></mu-badge>
                        </mu-list-item-action>
                        <mu-list-item button slot="nested" v-for="(vo,vi) in type_data" :key="vi" v-if="vo.pid == item.id" @click="open_view(vo)">
                            <mu-list-item-title>{{vo.name}}</mu-list-item-title>
                            <mu-list-item-action v-if="vo.news != 0">
                                <mu-badge :content="vo.news" :color="vo.iconcolor?vo.iconcolor:'secondary'"></mu-badge>
                            </mu-list-item-action>
                        </mu-list-item>
                    </mu-list-item>
                    <!-- <mu-divider></mu-divider> -->
                </mu-list>
            </div>
            <mu-slide-left-transition>
                <div class="x-dwa-lt x-plr-5 x-bgc-qhui x-pt-5" style="top:110px;" v-if="is_show_bg_list">
                    <mu-row gutter>
                        <mu-col span="2" v-for="(item,index) in img_arr" :key="index">
                            <img class="x-w-1" :src="item" @click="set_bg_img(item)">
                        </mu-col>
                    </mu-row>
                </div>
            </mu-slide-left-transition>
        </mu-drawer>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import bg_img_a from '@/assets/img/bg/a.jpg'
import bg_img_b from '@/assets/img/bg/b.jpg'
import bg_img_c from '@/assets/img/bg/c.jpg'
import bg_img_d from '@/assets/img/bg/d.jpg'
import bg_img_e from '@/assets/img/bg/e.jpg'
import bg_img_f from '@/assets/img/bg/f.jpg'
import bg_img_g from '@/assets/img/bg/g.jpg'
import bg_img_h from '@/assets/img/bg/h.jpg'
import bg_img_i from '@/assets/img/bg/i.jpg'
import bg_img_j from '@/assets/img/bg/j.jpg'
import bg_img_k from '@/assets/img/bg/k.jpg'

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    name: '',
    props: {
        show: {
            type: [Boolean],
            default: false
        }
    },
    data() {
        //这里存放数据
        return {
            docked: false,
            img_arr:[
                bg_img_a,bg_img_b,bg_img_c,bg_img_d,bg_img_e,bg_img_f,bg_img_g,bg_img_h,bg_img_i,bg_img_j,bg_img_k
            ],
            cbl_layer: false,
            is_show_bg_list: false,
            paddingTop: '64px',
        };
    },
    //监听属性 类似于data概念
    computed: {
        type_data: function(){      // 侧边栏导航数据
            return this.$root.public_data.m_type_7;
        }
    },
    //监控data中的数据变化
    watch: {
        show: function(val){
            this.cbl_layer = val;
        },
        cbl_layer: function(val){
            this.$emit('change',val)
        },
        '$root.viewWidth': {
            handler: function (val, oldVal) {
                this.cbl_layer = val >= 600 ? true : false;
                this.docked = val >= 600 ? true : false;
                this.paddingTop = val >= 600 ? '64px' : '0px';
            },
            immediate: true
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //方法集合
    methods: {
		// 退出登陆
		ajax_loginout: function(){
			var _this = this;
			this.$confirm('确定要退出登陆吗？', '提示').then((res)=>{
				if( res.result ){
					_this.xzyn.ajax(_this.request_url.usertoken_loginout,'get',{id:this.$root.user_data.id},{},(data,res)=>{
						_this.xzyn.del_cache();	// 删除缓存
                        _this.xzyn.go('/');
                        _this.open_layer = false;
					})
				}
			});
        },
        // 打开方法
        open_view: function(item){
            if(item.layer_num == 0 ){
                this.xzyn.go(item.url);
                if(!this.docked){
                    this.cbl_layer = false;
                }
                this.is_show_bg_list = false;
            }
        },
        // 设置背景
        set_bg_img: function(name){
            this.$root.bg_img = "url('"+name+"')";
            this.xzyn.edit_data('bg_img',"url('"+name+"')")
        },
        open_bg_list: function(){
            if(this.is_show_bg_list){
                this.is_show_bg_list = false;
            }else{
                this.is_show_bg_list = true;
            }
        }

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {}
}
</script>
<style>
    /*@import url(); 引入公共css类*//*背景模糊*/

</style>