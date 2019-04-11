<!-- y列表 -->
<template>
    <div>
        <mu-load-more @refresh="init_data" :refreshing="is_refreshing">
                <mu-data-table stripe :columns="columns" :data="data_list" @row-click="row_click" :min-col-width="80">
                    <template slot-scope="scope">
                        <td class="is-center">{{scope.row.id}}</td>
                        <td>{{scope.row.name}}</td>
                        <td>{{scope.row.author}}</td>
                        <td class="is-center">
                            <mu-badge v-if="scope.row.status == 1" content="正常" color="success"></mu-badge>
                            <mu-badge v-else content="禁用" color="secondary"></mu-badge>
                        </td>
                        <td>{{scope.row.src}}</td>
                        <td>{{scope.row.cover}}</td>
                        <td class="is-center">{{scope.row.orderby}}</td>
                    </template>
                </mu-data-table>
        </mu-load-more>
        <mu-popover cover :open.sync="open" :trigger="trigger" class="x-p-15 x-yy-0" style="background: rgba(0,0,0,0);">
            <mu-button fab color="primary" small @click="$parent.on_tab_change('music_create',this_data.id)">
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
            name: 'music_index',
            data_list: [],    // 列表数据
            this_data: {},       // 选择的数据
            columns: [
                { title: 'ID', name: 'id', align: 'center', width: 60 },
                { title: '音乐歌名', name: 'name', width: 120},
                { title: '歌手名称', name: 'author', width: 120},
                { title: '状态', name: 'status', align: 'center'},
                { title: '音乐地址', name: 'src', width: 400 },
                { title: '封面地址', name: 'cover',width: 250},
                { title: '排序', name: 'orderby', align: 'center'}
            ],
            open: false,
            trigger: '',
            is_refreshing: false,   // 正在刷新

        };
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.init_data();
    },
    //方法集合
    methods: {
        // 初始化数据
        init_data: function(){
            this.is_refreshing = true;
            this.data_list = [];
            this.ajax_data();
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            _this.xzyn.ajax('/admin/config/music','get',{},{},function(data,res){
                _this.is_refreshing = false;
                _this.data_list = data.musicList;
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
                    this.xzyn.ajax('/admin/music/delete','post',{id:this.this_data.id},{},function(data,res){
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