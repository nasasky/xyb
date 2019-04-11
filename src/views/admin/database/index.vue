<!-- 数据库列表页 -->
<template>
    <div>
        <div class="x-breadcrumbs">
            <mu-breadcrumbs>
                <mu-breadcrumbs-item :disabled="false" to="/admin/index/index">首页</mu-breadcrumbs-item>
                <mu-breadcrumbs-item :disabled="true">数据库列表</mu-breadcrumbs-item>
            </mu-breadcrumbs>
            <mu-button class="x-dwa-rt x-mt-10 x-mr-10" color="primary" small @click="ajax_backup">备份所选</mu-button>
        </div>
        <div class="x-plr-10 x-pb-10 x-pt-50">
            <mu-load-more @refresh="init_data" :refreshing="is_refreshing">
                <mu-paper :z-depth="4">
                    <mu-data-table stripe :columns="columns" :data="data_list" :min-col-width="128" select-all selectable
                        :selects.sync="selects" checkbox :checkbox-col-width="50">
                        <template slot-scope="scope">
                            <td class="is-center">{{scope.$index+1}}</td>
                            <td>{{scope.row.Name}}</td>
                            <td class="is-center">{{scope.row.Rows}} 条记录</td>
                            <td>{{scope.row.Comment}}</td>
                            <td class="is-center">{{scope.row.Engine}}</td>
                            <td class="is-center">
                                <mu-badge :content="scope.row.Create_time" color="success"></mu-badge>
                            </td>
                        </template>
                    </mu-data-table>
                </mu-paper>
            </mu-load-more>
        </div>
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
            selects: [],    // 选择的数据
            add_data: [],
            columns: [
                { title: '序号', name: 'index', align: 'center', width: 60},
                { title: '表名', name: 'Name'},
                { title: '数据条数', name: 'Rows', align: 'center',width:100},
                { title: '描述', name: 'Comment' },
                { title: '类型', name: 'Engine', align: 'center',width: 100},
                { title: '创建时间', name: 'Create_time', align: 'center',width:160}
            ],
            is_refreshing: false,   // 正在刷新
        };
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        selects: function(val){
            var add_arr = [];
            for (let i = 0; i < val.length; i++) {
                const index = val[i];
                add_arr.push(this.data_list[index].Name)
            }
            this.add_data = add_arr;
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
            this.data_list = [];
            this.ajax_data();
        },
        // 获取数据
        ajax_data: function(){
            var _this = this;
            _this.xzyn.ajax('/admin/database/index','get',{},{},function(data,res){
                _this.is_refreshing = false;
                _this.data_list = data;
            },false)
        },
        // 备份
        ajax_backup: function(){
            var _this = this;
            this.$confirm('你确定要备份吗？', '提示').then((res)=>{
                if( res.result ){
                    if( _this.add_data.length == 0 ){
                        _this.xzyn.msg('请选择表');
                    }else{
                        var add_str = _this.add_data.toString();
                        _this.xzyn.ajax('/admin/database/backup','post',{name:add_str},{},function(data,res){
                            console.log(data)
                        })
                    }
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