<!-- 后台侧边栏组件 -->
<template>
<div>
    <mu-drawer :open.sync="show_left" :docked="docked" :style="{paddingTop:paddingTop}">
        <x-view bg-img>
            <div class="x-tc x-pt-20">
                <mu-avatar class="x-yy-4" :size="80" @click="xzyn.go('/admin/user/edit?id='+$root.user_data.id)">
                    <img v-if="xzyn.is_login()" :src="$root.user_data.avatar">
                    <img v-else src="@/assets/img/logo.jpg">
                </mu-avatar>
            </div>
            <div class="x-tc x-ptb-10">
                <div class="x-tw" v-if="xzyn.is_login()">{{$root.user_data.name||$root.user_data.username}}</div>
            </div>
            <mu-row class="x-ptb-20">
                <mu-col span="6" class="x-tc">
                    <mu-button small color="primary" @click="ajax_loginout" >退出登陆</mu-button>
                </mu-col>
                <mu-col span="6" class="x-tc">
                    <mu-button small class="x-ml-10" @click="cleancache" >清除缓存</mu-button>
                </mu-col>
            </mu-row>
        </x-view>
        <mu-list toggle-nested>
            <mu-list-item button v-for="(item,index) in $root.url_list" :key="index" v-if="(item.name == '/admin/index/index')" @click="open_view(item)">
                 <mu-list-item-action>
                    <mu-icon class="toggle-icon" size="24" :value="':'+item.icon"></mu-icon>
                </mu-list-item-action>
                <mu-list-item-title>{{item.title}}</mu-list-item-title>
            </mu-list-item>
            <mu-list-item button v-for="(item,index) in $root.url_list" :key="index" v-if="(item.level == 1 && item.module == 'admin' && item.ismenu == 1 && item.name != '/admin/index/index')" nested :open="false" >
                <mu-list-item-action>
                    <mu-icon class="toggle-icon" size="24" :value="':'+item.icon"></mu-icon>
                </mu-list-item-action>
                <mu-list-item-title>{{item.title}}</mu-list-item-title>
                <mu-list-item-action>
                    <mu-icon class="toggle-icon" size="24" value=":fa fa-angle-right"></mu-icon>
                </mu-list-item-action>
                <mu-list-item button  slot="nested" v-for="(vo,vi) in $root.url_list" :key="vi" v-if="item.id == vo.pid" @click="open_view(vo)">
                    <mu-list-item-title>{{vo.title}}</mu-list-item-title>
                </mu-list-item>
            </mu-list-item>
            <!-- <mu-list-item button @click="xzyn.go('/admin/login')">
                <mu-list-item-title>登陆</mu-list-item-title>
            </mu-list-item> -->
        </mu-list>
    </mu-drawer>
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
            docked: false,
            show_left: false,    // 显示侧边栏
            paddingTop: '64px',
        };
    },
    //监听属性 类似于data概念
    computed: {

    },
    //监控data中的数据变化
    watch: {
        '$root.viewWidth': {
            handler: function (val, oldVal) {
                this.show_left = val >= 600 ? true : false;
                this.docked = val >= 600 ? true : false;
                this.paddingTop = val >= 600 ? '64px' : '0px';
            },
            immediate: true
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //方法集合
    methods: {
        open_view(item){
            this.xzyn.go(item.name);
            if(!this.docked){
                this.show_left = false;
            }
        },
		// 退出登陆
		ajax_loginout: function(){
			var _this = this;
			this.$confirm('确定要退出登陆吗？', '提示').then((res)=>{
				if( res.result ){
					_this.xzyn.ajax('/admin/login/loginout','get',{},{},(data,res)=>{
                        _this.xzyn.edit_data('url_list',true);
						_this.xzyn.del_cache();	// 删除缓存
                        _this.xzyn.go('/');
					})
				}
			});
        },
		// 清除缓存
		cleancache: function(){
			var _this = this;
            _this.xzyn.ajax('/admin/index/cleancache','get',{},{},(data,res)=>{
                for (let i = 0; i < data.length; i++) {
                    const url_item = data[i];
                    data[i].name = '/admin/'+url_item.name;
                }
                _this.xzyn.edit_data('url_list',data);
                _this.$root.url_list = data;
            })
        },
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {},
}

</script>
<style>
    /*@import url(); 引入公共css类*/

    /*兼容手机端样式*/
    @media (max-width: 600px) {

    }
</style>