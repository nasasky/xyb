<!-- API应用列表页 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">API应用列表</mu-breadcrumbs-item>
            </mu-breadcrumbs>
            <mu-button class="x-dwa-rt x-mt-10 x-mr-10" color="primary" small @click="xzyn.go('/admin/apiapp/create')">新增</mu-button>
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-load-more @refresh="init_data" :refreshing="is_refreshing">
                <mu-paper :z-depth="4">
                    <mu-data-table stripe :columns="columns" :data="data_list" @row-click="row_click" :min-col-width="128">
                        <template slot-scope="scope">
                            <td class="is-center">{{scope.row.id}}</td>
                            <td>{{scope.row.app_name}}</td>
                            <td>{{scope.row.app_id}}</td>
                            <td>{{scope.row.app_secret}}</td>
                            <td>{{scope.row.domain}}</td>
                            <td class="is-center">
                                <mu-badge v-if="scope.row.is_auth == 1" content="验证" color="success"></mu-badge>
                                <mu-badge v-else content="不验证" color="secondary"></mu-badge>
                            </td>
                            <td class="is-center">
                                {{scope.row.app_limitTime}}
                            </td>
                            <td>{{scope.row.apptoken}}</td>
                            <td class="is-center">
                                <mu-badge v-if="scope.row.app_status == 1" content="正常" color="success"></mu-badge>
                                <mu-badge v-else content="禁用" color="secondary"></mu-badge>
                            </td>
                            <td>{{scope.row.app_info}}</td>
                        </template>
                    </mu-data-table>
                </mu-paper>
            </mu-load-more>
        </div>
        <mu-popover cover :open.sync="open" :trigger="trigger" class="x-p-15 x-yy-0" style="background: rgba(0,0,0,0);">
            <mu-button fab color="primary" class="x-mr-5" small @click="xzyn.go('/admin/apiapp/edit?id='+this_data.id)">
                <mu-icon value=":fa fa-pencil-square-o" ></mu-icon>
            </mu-button>
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
            columns: [
                { title: 'ID', name: 'id', align: 'center', width: 70},
                { title: '应用名称', name: 'app_name',width:130},
                { title: 'AppId', name: 'app_id',width:100},
                { title: 'AppSecret', name: 'app_secret',width: 180 },
                { title: '请求域名', name: 'domain',width: 180},
                { title: '验证域名', name: 'is_auth', align: 'center',width:80},
                { title: 'Token有效期', name: 'app_limitTime', align: 'center',width:100},
                { title: 'AppToken', name: 'apptoken',width:200},
                { title: '状态', name: 'app_status', align: 'center',width:80},
                { title: '应用描述', name: 'app_info'}
            ],
            open: false,
            trigger: '',
            is_refreshing: false,   // 正在刷新
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
            this.search = '';
            this.data_list = [];
            this.ajax_data();
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            var add_data = {     //发送到服务器的数据
                search: _this.search
            }
            _this.xzyn.ajax('/admin/apiapp/index','get',add_data,{},function(data,res){
                _this.is_refreshing = false;
                _this.data_list = data;
            },false)

        },
        // 点击某一行时触发
        row_click: function(index, row, event){
            this.open = this.open?false:true;
            this.trigger = event.srcElement;
            this.this_data = row;
        },
        // 删除
        del_ajax: function(){
            var _this = this;
            this.$confirm('你确定要删除吗？', '提示').then((res)=>{
                if( res.result ){
                    this.xzyn.ajax('/admin/apiapp/delete','post',{id:this.this_data.id},{},function(data,res){
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