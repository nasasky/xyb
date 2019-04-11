<!-- 留言列表页 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">留言列表</mu-breadcrumbs-item>
            </mu-breadcrumbs>
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-load-more @refresh="init_data" :refreshing="is_refreshing" :loading="is_load" @load="ajax_gengduo" :loaded-all="is_load_all">
                <mu-paper :z-depth="4">
                    <mu-data-table stripe :columns="columns" :data="data_list" @row-click="row_click" :min-col-width="128">
                        <template slot-scope="scope">
                            <td class="is-center">{{scope.row.id}}</td>
                            <td>{{scope.row.username}}<br/>
                                <mu-badge v-if="scope.row.status == 1" content="已回复" color="success"></mu-badge>
                                <mu-badge v-else content="未回复" color="secondary"></mu-badge>
                            </td>
                            <td>{{scope.row.title}}</td>
                            <td>{{scope.row.email}}</td>
                            <td>{{scope.row.content}}</td>
                            <td>{{scope.row.recontent}}</td>
                            <td class="is-center">
                                <mu-badge :content="scope.row.create_time" color="info"></mu-badge>
                            </td>
                        </template>
                    </mu-data-table>
                </mu-paper>
            </mu-load-more>
        </div>
        <mu-popover cover :open.sync="open" :trigger="trigger" class="x-p-15 x-yy-0" style="background: rgba(0,0,0,0);">
            <mu-button fab color="primary" class="x-mr-5" small @click="add_layer = true">
                <mu-icon value=":fa fa-pencil-square-o" ></mu-icon>
            </mu-button>
            <mu-button fab color="secondary" small @click="del_ajax">
                <mu-icon value=":fa fa-trash"></mu-icon>
            </mu-button>
        </mu-popover>
        <mu-dialog width="360" :open.sync="add_layer">
            <mu-text-field v-model="this_data.recontent" placeholder="回复内容" multi-line :rows="3" :rows-max="6" full-width></mu-text-field>
            <mu-button slot="actions" flat color="primary" @click="edit_ajax">保存</mu-button>
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
                { title: 'ID', name: 'id', align: 'center', width: 70},
                { title: '留言人', name: 'username'},
                { title: '标题', name: 'title'},
                { title: '邮箱', name: 'email',width: 160 },
                { title: '留言内容', name: 'content'},
                { title: '回复内容', name: 'recontent'},
                { title: '留言时间', name: 'create_time', align: 'center',width:160}
            ],
            open: false,
            trigger: '',
            is_refreshing: false,   // 正在刷新
            is_load: false,     // 正在加载
            is_load_all: false,  // 没有数据
            add_layer: false
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
                page: _this.page,
                search: _this.search
            }
            _this.xzyn.ajax('/admin/guestbook/index','get',add_data,{},function(data,res){
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
                    this.xzyn.ajax('/admin/guestbook/delete','post',{id:this.this_data.id},{},function(data,res){
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
        // 编辑提交
        edit_ajax: function(){
            var _this = this;
            if( _this.this_data.recontent ){
                _this.this_data.status = 1;
                this.xzyn.ajax('/admin/guestbook/edit','post',this.this_data,{},function(data,res){
                    _this.add_layer = false;
                })
            }else{
                this.xzyn.msg('请填写回复内容');
            }
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