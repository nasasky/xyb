<!-- 用户列表页 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">用户列表</mu-breadcrumbs-item>
            </mu-breadcrumbs>
            <mu-button class="x-dwa-rt x-mt-10 x-mr-10" color="primary" small @click="xzyn.go('/admin/user/create')">新增</mu-button>
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-load-more @refresh="init_data" :refreshing="is_refreshing" :loading="is_load" @load="ajax_gengduo" :loaded-all="is_load_all">
                <mu-paper :z-depth="4">
                    <mu-data-table stripe :columns="columns" :data="data_list" @row-click="row_click" :min-col-width="128">
                        <template slot-scope="scope">
                            <td class="is-center">{{scope.row.id}}</td>
                            <td class="is-center">
                                <mu-avatar :size="38" class="x-mt-5">
                                    <img :src="scope.row.avatar">
                                </mu-avatar>
                            </td>
                            <td class="is-center">{{scope.row.username}}
                                <span v-for="(item,index) in scope.row.userGroup" :key="index">
                                    <br/><mu-badge :content="item.title" color="info"></mu-badge>
                                </span>
                            </td>
                            <td class="is-center">{{scope.row.name}}</td>
                            <td>{{scope.row.email}}</td>
                            <td>{{scope.row.moblie}}</td>
                            <td class="is-center">{{scope.row.logins}} 次</td>
                            <td class="is-center">
                                <mu-badge v-if="scope.row.status == 1" content="正常" color="success"></mu-badge>
                                <mu-badge v-else content="禁用" color="secondary"></mu-badge>
                            </td>
                        </template>
                    </mu-data-table>
                </mu-paper>
            </mu-load-more>
        </div>
        <mu-popover cover :open.sync="open" :trigger="trigger" class="x-p-15 x-yy-0" style="background: rgba(0,0,0,0);">
            <mu-button fab color="primary" small @click="xzyn.go('/admin/user/edit?id='+this_data.id)">
                <mu-icon value=":fa fa-pencil-square-o" ></mu-icon>
            </mu-button>
            <mu-button fab color="success" class="x-mlr-5" small @click="show_auth_layer = true">
                <mu-icon value=":fa fa-user-plus"></mu-icon>
            </mu-button>
            <mu-button fab color="secondary" small @click="del_ajax">
                <mu-icon value=":fa fa-trash"></mu-icon>
            </mu-button>
        </mu-popover>
        <mu-dialog title="授权角色" width="360" scrollable :open.sync="show_auth_layer">
            <div class="x-mb-20">
                用户名：<span class="x-tw">{{this_data.name||this_data.username}}</span>
            </div>
            <div v-for="(item,index) in auth_group_data" :key="index">
                <mu-checkbox v-model="val_arr" :value="item.id" :label="item.title"></mu-checkbox>
            </div>
            <mu-button slot="actions" flat color="primary" @click="add_auth_group">保存</mu-button>
        </mu-dialog>
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
            data_list: [],    // 列表数据
            this_data: {},       // 选择的数据
            search: '',  // 搜索内容
            page: 1,     //页码
            columns: [
                { title: 'ID', name: 'id', align: 'center',width:60},
                { title: '头像', name: 'avatar', align: 'center',width:60},
                { title: '账号', name: 'username', align: 'center',width: 120 },
                { title: '昵称', name: 'name', align: 'center',width: 120 },
                { title: '邮箱', name: 'email', align: 'center'},
                { title: '手机', name: 'moblie', align: 'center'},
                { title: '登录次数', name: 'logins', align: 'center',width:80},
                { title: '状态', name: 'status', align: 'center',width:80},

            ],
            open: false,
            trigger: '',
            is_refreshing: false,   // 正在刷新
            is_load: false,     // 正在加载
            is_load_all: false,  // 没有数据
            show_auth_layer: false,
            auth_group_data: [],
            val_arr: []
        };
    },
    //计算属性 类似于data概念
    computed: {
    },
    //监控data中的数据变化
    watch: {
        show_auth_layer: function(val){
            if(val){
                this.ajax_auth_group();
            }
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.init_data();
    },
    //方法集合
    methods: {
        // 初始化数据
        init_data: function(){
            this.is_refreshing = true;
            this.ia_load = false;
            this.is_load_all = false;
            this.page = 1;
            this.search = '';
            this.data_list = [];
            this.ajax_data();
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            var add_data = {     //发送到服务器的数据
                search: _this.search,
                page: _this.page
            }
            _this.xzyn.ajax('/admin/user/index','get',add_data,{},function(data,res){
                _this.is_refreshing = false;
                _this.ia_load = false;
                if( data.length > 0 ){
                    _this.is_load_all = false;
                    if( _this.data_list.length > 0 ){
                        _this.data_list = _this.data_list.concat(data);
                    }else{
                        _this.data_list = data;
                    }
                }else{
                    _this.is_load_all = true;
                    _this.xzyn.msg('没有数据了');
                }
            },false)

        },
        // 点击某一行时触发
        row_click: function(index, row, event){
            this.open = this.open?false:true;
            this.trigger = event.srcElement;
            this.this_data = row;
        },
        // 加载更多
        ajax_gengduo: function(){
            if( !this.is_load_all ){
                this.ia_load = true;
                this.page += 1;
                this.ajax_data();
            }
        },
        // 删除用户
        del_ajax: function(){
            var _this = this;
            this.$confirm('你确定要删除吗？', '提示').then((res)=>{
                if( res.result ){
                    this.xzyn.ajax('/admin/user/delete','post',{id:this.this_data.id},{},function(data,res){
                        var new_data = [];
                        for (let i = 0; i < _this.data_list.length; i++) {
                            const item = _this.data_list[i];
                            if( item.id !== _this.this_data.id ){
                                new_data.push(item);
                            }
                        }
                        _this.data_list = new_data;
                    })
                }
            });
        },
        // 获取授权角色
        ajax_auth_group: function(){
            var _this = this;
            this.xzyn.ajax('/admin/user/authgroup','get',{id:this.this_data.id},{},function(data,res){
                _this.auth_group_data = data;
                var arr = [];
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    if(item.ischeck){
                        arr.push(item.id);
                    }
                }
                _this.val_arr = arr;
            },false)

        },
        // 授权角色提交保存
        add_auth_group: function(){
            var _this = this;
            var add_data = {
                id:this.this_data.id,
                group_id: _this.val_arr.toString()
            }
            this.xzyn.ajax('/admin/user/authgroup','post',add_data,{},function(data,res){
                _this.show_auth_layer = false;
                _this.init_data();
            })
        }
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {}
}
</script>
<style>
    /*@import url(); 引入公共css类*/
    .mu-table td{
        padding-left: 10px;
        padding-right: 10px;
    }
    .mu-table th{
        padding-left: 10px;
        padding-right: 10px;
    }
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