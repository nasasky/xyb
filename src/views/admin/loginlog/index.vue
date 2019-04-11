<!-- 登陆日志页 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">登陆日志列表</mu-breadcrumbs-item>
            </mu-breadcrumbs>
            <!-- <mu-button class="x-dwa-rt x-mt-10 x-mr-10" color="primary" small @click="xzyn.go('/admin/user/create')">新增</mu-button> -->
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-load-more @refresh="init_data" :refreshing="is_refreshing" :loading="is_load" @load="ajax_gengduo" :loaded-all="is_load_all">
                <mu-paper :z-depth="4">
                    <mu-data-table stripe :columns="columns" :data="data_list" @row-click="row_click" :min-col-width="80">
                        <template slot-scope="scope">
                            <td class="is-center">{{scope.row.id}}</td>
                            <td class="is-center">{{scope.row.ip}}</td>
                            <td class="is-center">{{scope.row.user.username}}/{{scope.row.user.name}}</td>
                            <td class="is-center">{{scope.row.country}}</td>
                            <td class="is-center">{{scope.row.province}}</td>
                            <td class="is-center">{{scope.row.city}}</td>
                            <td class="is-center">{{scope.row.district}}</td>
                            <td>{{scope.row.create_time}}</td>
                        </template>
                    </mu-data-table>
                </mu-paper>
            </mu-load-more>
        </div>
        <mu-popover cover :open.sync="open" :trigger="trigger" class="x-p-15 x-yy-0" style="background: rgba(0,0,0,0);">
            <mu-button fab color="secondary" small @click="del_ajax">
                <mu-icon value=":fa fa-trash"></mu-icon>
            </mu-button>
        </mu-popover>
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
                { title: 'ID', name: 'id', align: 'center',width: 70},
                { title: 'IP地址', name: 'ip'},
                { title: '登陆用户', name: 'pid'},
                { title: '国家', name: 'country', align: 'center'},
                { title: '省', name: 'province', align: 'center',width: 150 },
                { title: '市', name: 'city', align: 'center',width: 120},
                { title: '区', name: 'district', align: 'center'},
                { title: '登陆时间', name: 'create_time',width: 150},

            ],
            open: false,
            trigger: '',
            is_refreshing: false,   // 正在刷新
            is_load: false,     // 正在加载
            is_load_all: false  // 没有数据
        };
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
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
            _this.xzyn.ajax('/admin/loginlog/index','get',add_data,{},function(data,res){
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
        // 删除
        del_ajax: function(){
            var _this = this;
            this.$confirm('你确定要删除吗？', '提示').then((res)=>{
                if( res.result ){
                    this.xzyn.ajax('/admin/loginlog/delete','post',{id:this.this_data.id},{},function(data,res){
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