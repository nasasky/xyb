<!-- 网站导航列表 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">网站导航列表</mu-breadcrumbs-item>
            </mu-breadcrumbs>
            <mu-button class="x-dwa-rt x-mt-10 x-mr-10" color="primary" small @click="xzyn.go('/admin/navigation/create')">新增</mu-button>
            <div class="x-gd-x x-t-no x-plr-10 x-pb-5">
                <mu-button class="x-mr-5" color="primary" small @click="init_data">全部</mu-button>
                <mu-button class="type-list-btn" small v-for="(item,index) in type_list" :key="index" :color="type_id == index?'info':''" @click="type_id_list(index)">{{item}}</mu-button>
            </div>
        </div>
        <div class="x-plr-10 x-pb-10 x-data-table">
            <mu-load-more @refresh="init_data" :refreshing="is_refreshing">
                <mu-paper :z-depth="4">
                    <mu-data-table stripe :columns="columns" :data="data_list" @row-click="row_click" :min-col-width="80">
                        <template slot-scope="scope">
                            <td class="is-center">{{scope.row.id}}</td>
                            <td>
                                <span v-if="scope.row.h_layer == 2">┗━━━ {{scope.row.name}}</span>
                                <span v-else>{{scope.row.name}}</span>

                            </td>
                            <td>{{scope.row.title}}</td>
                            <td>{{scope.row.url}}</td>
                            <td class="is-center">
                                <mu-badge :content="type_list[scope.row.type_id]" color="success"></mu-badge>
                            </td>
                            <td class="is-center">
                                <mu-badge :content="scope.row.news" circle :color="scope.row.news.bgcolor"  class="x-p-5">
                                    <mu-icon size="24" :value="':fa '+scope.row.icon" :color="scope.row.iconcolor"></mu-icon>
                                </mu-badge>
                            </td>
                            <td class="is-center">
                                <mu-badge v-if="scope.row.is_show == 1" content="显示" color="success"></mu-badge>
                                <mu-badge v-else content="隐藏" color="secondary"></mu-badge>
                            </td>
                            <td class="is-center">
                                <mu-badge v-if="scope.row.target == 1" content="新窗口" color="secondary"></mu-badge>
                                <mu-badge v-else content="当前窗口" color="success"></mu-badge>
                            </td>
                            <td class="is-center">{{scope.row.orderby}}</td>
                        </template>
                    </mu-data-table>
                </mu-paper>
            </mu-load-more>
        </div>
        <mu-popover cover :open.sync="open" :trigger="trigger" class="x-p-15 x-yy-0" style="background: rgba(0,0,0,0);">
            <mu-button fab color="primary" small @click="xzyn.go('/admin/navigation/edit?id='+this_data.id)">
                <mu-icon value=":fa fa-pencil-square-o" ></mu-icon>
            </mu-button>
            <mu-button fab color="secondary" small @click="del_ajax" class="x-ml-5">
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
            type_list: {},   // 分类数据
            this_data: {},       // 选择的数据
            type_id: '',  // 分类ID
            columns: [
                { title: 'ID', name: 'id', align: 'center', width: 60 },
                { title: '名称', name: 'name', width: 150},
                { title: '别名', name: 'title', align: 'center', width: 80},
                { title: 'URL', name: 'url', width: 300 },
                { title: '分类', name: 'type_id', align: 'center',width: 120},
                { title: '图标', name: 'icon', align: 'center', width: 100},
                { title: '显示', name: 'is_show', align: 'center'},
                { title: '打开方式', name: 'target', align: 'center', width: 100},
                { title: '排序', name: 'orderby', align: 'center'},
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
        '$route': {  // 监听路由
            handler(val){
                //console.log(val)
            },
            immediate: true,
            deep: true
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
            this.type_id = '';
            this.data_list = [];
            this.ajax_data();
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            var add_data = {     //发送到服务器的数据
                type_id: _this.type_id
            }
            _this.xzyn.ajax('/admin/navigation/index','get',add_data,{},function(data,res){
                _this.is_refreshing = false;
                _this.type_list = data.typeList;
                _this.data_list = data.dataList;
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
                    this.xzyn.ajax('/admin/navigation/delete','post',{id:this.this_data.id},{},function(data,res){
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
        // 分类按钮触发
        type_id_list: function(id){
            this.type_id = id;
            this.is_refreshing = true;
            this.data_list = [];
            this.ajax_data();
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
    .type-list-btn + .type-list-btn{
        margin-left: 5px;
    }
    .x-data-table{
        padding-top: 95px;
    }
    /*兼容手机端样式*/
    @media (max-width: 600px) {
        .x-breadcrumbs{
            top: 56px;
            padding-left: 0px;
        }
    }
</style>