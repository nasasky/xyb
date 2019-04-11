<!-- 还原数据库列 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">还原数据库</mu-breadcrumbs-item>
            </mu-breadcrumbs>
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-load-more @refresh="init_data" :refreshing="is_refreshing">
                <mu-paper :z-depth="4">
                    <mu-data-table stripe :columns="columns" :data="data_list" @row-click="row_click" :min-col-width="128">
                        <template slot-scope="scope">
                            <td class="is-center">{{scope.$index+1}}</td>
                            <td>{{scope.row.name}}</td>
                            <td class="is-center">{{scope.row.time}}</td>
                            <td class="is-center">{{scope.row.size}}</td>
                        </template>
                    </mu-data-table>
                </mu-paper>
            </mu-load-more>
        </div>
        <mu-popover cover :open.sync="open" :trigger="trigger" class="x-p-15 x-yy-0" style="background: rgba(0,0,0,0);">
            <mu-button fab color="primary" small @click="download">
                <mu-icon value=":fa fa-download" ></mu-icon>
            </mu-button>
            <mu-button class="x-mlr-5" fab color="success" small @click="restore">
                <mu-icon value=":fa fa-recycle"></mu-icon>
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
            columns: [
                { title: '序号', name: 'index', align: 'center', width: 60},
                { title: '备份名称', name: 'name'},
                { title: '备份时间', name: 'time', align: 'center'},
                { title: '备份大小', name: 'size', align: 'center',width:100 }
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
            this.data_list = [];
            this.ajax_data();
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            _this.xzyn.ajax('/admin/database/reduction','get',{},{},function(data,res){
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
        // 还原
        restore: function(){
            var _this = this;
            this.$confirm('你确定要还原吗？', '提示').then((res)=>{
                if( res.result ){
                    _this.xzyn.ajax('/admin/database/restore','post',{name:_this.this_data.name},{},function(data,res){
                    })
                }
            });
        },
        // 删除
        del_ajax: function(){
            var _this = this;
            this.$confirm('你确定要删除吗？', '提示').then((res)=>{
                if( res.result ){
                    this.xzyn.ajax('/admin/database/delete','post',{name:this.this_data.name},{},function(data,res){
                        var new_data = [];
                        for (let i = 0; i < _this.data_list.length; i++) {
                            const item = _this.data_list[i];
                            if( item.name !== _this.this_data.name ){
                                new_data.push(item);
                            }
                        }
                        _this.data_list = new_data;
                    })
                }
            });
        },
        // 下载
        download: function(){
            var _this = this;
            this.$confirm('你确定要下载备份吗？', '提示').then((res)=>{
                if( res.result ){
                    _this.xzyn.ajax('/admin/database/dowonload','post',{name:_this.this_data.name},{},function(data,res){
                        console.log(data)
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