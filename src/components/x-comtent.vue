<!-- 内容组件 -->
<template>
    <div>
        <div v-if="up_img.length > 0 && show == false" class="x-plr-10 x-pt-10">
            <div class="x-tc-hui x-ptb-5">只能允许上传{{up_img_num}}/{{upImgNum}}张图片，剩余{{img_nums}}张，点击图片删除</div>
            <div class="img-list" v-for="(item,index) in up_img" :key="index" @click="del_img(item)">
                <img :src="item">
            </div>
        </div>
        <div class="editor" :style="{height:height}">
            <mavon-editor style="height: 100%; z-index:300;" ref="editor" v-model="val" :subfield="subfield" :toolbars="toolbars" :editable="editable"
                :defaultOpen="defaultOpen" :toolbarsFlag="toolbarsFlag" :boxShadow="boxShadow" codeStyle="monokai-sublime"
                @imgAdd="$imgAdd">
            </mavon-editor>
        </div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {mavonEditor},
    name: '',
    props: {
        value: String,  // 初始值
        show: {     // true 展示，false 编辑器
            type: Boolean,
            default: false
        },
        upImgNum: { // 允许上传的图片数量
            type: [Number],
            default: 9
        },
		initImg: {  // 初始化已上传图片数据
            type: Array,
            default: function(){
                return []
            }
        },
        isUpImg: {     // 是否允许上传图片
            type: Boolean,
            default: false
        }
    },
    data() {
        //这里存放数据
        return {
            up_img: [],	// 上传的图片，返回给父组件
            up_img_num: 0,	// 已上传图片的数量
            height: '580px',
            val: '',    // 编辑的内容
            editable: true,     // 是否允许编辑
            defaultOpen: 'edit',    // edit： 默认展示编辑区域 ， preview： 默认展示预览区域 , 其他 = edit
            toolbarsFlag: true,    // 工具栏是否显示
            boxShadow: true,       // 开启边框阴影
            subfield: false, // true： 双栏(编辑预览同屏)， false： 单栏(编辑预览分屏
            toolbars: {     // 工具栏
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
                underline: true, // 下划线
                strikethrough: true, // 中划线
                mark: true, // 标记
                superscript: true, // 上角标
                subscript: true, // 下角标
                quote: true, // 引用
                ol: true, // 有序列表
                ul: true, // 无序列表
                link: true, // 链接
                imagelink: true, // 图片链接
                code: true, // code
                table: true, // 表格
                fullscreen: true, // 全屏编辑
                // readmodel: true, // 沉浸式阅读
                htmlcode: true, // 展示html源码
                help: true, // 帮助
                undo: true, // 上一步
                redo: true, // 下一步
                // trash: true, // 清空
                // save: true, // 保存（触发events中的save事件）
                navigation: true, // 导航目录
                alignleft: true, // 左对齐
                aligncenter: true, // 居中
                alignright: true, // 右对齐
                subfield: true, // 单双栏模式
                preview: true, // 预览

            }
        };
    },
    //计算属性 类似于data概念
    computed: {
        img_nums: function(){
            return this.upImgNum - this.up_img_num;
        }
    },
    //监控data中的数据变化
    watch: {
        value: {
            handler(val){
                this.val = val;
            },
            immediate: true
        },
        val: {
            handler(val){
                this.$emit('change',val,this.up_img);
            },
            immediate: true,
            deep: true
        },
        up_img: {
            handler(val){
                this.up_img_num = val.length;
                this.$emit('change',this.val,val);
            },
            immediate: true,
            deep: true
        },
        initImg: {
            handler(val){
                this.up_img = val;
                this.up_img_num = val.length;
            },
            immediate: true
        },
        "$root.viewWidth": {
            handler(val){
                if(!this.show){
                    val >= 900 ? this.subfield = true : this.subfield = false;
                    val >= 900 ? this.defaultOpen = 'preview' : this.defaultOpen = 'edit';
                }
            },
            immediate: true,
            deep: true
        },
        show: {
            handler(val){
                if(val){    // 内容展示
                    this.height = '100%';
                    this.editable = false;  // 是否允许编辑
                    this.defaultOpen = 'preview';
                    this.toolbarsFlag = false;      // 工具栏是否显示
                    this.subfield = false;  // true： 双栏(编辑预览同屏)， false： 单栏(编辑预览分屏
                }else{      // 内容编辑
                    this.height = '580px';
                    this.editable = true;  // 是否允许编辑
                    this.toolbarsFlag = true;      // 工具栏是否显示
                }
            },
            immediate: true
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //方法集合
    methods: {
        // 上传图片
        $imgAdd(pos, $file){
            var _this = this;
            if(this.isUpImg){
                if( this.up_img_num == this.upImgNum){
                    var img_name = $file.name;
                    var str = _this.value;
                    var re = /!\[+[0-9|a-z|A-Z|/|.|:]+\]\(+([0-9|a-z|A-Z|/|.|:])+\)+/gi;
                    var url_arr = str.match(re);
                    for (let i = 0; i < url_arr.length; i++) {
                        const img_url = url_arr[i];
                        if( img_url.includes(img_name) ){
                            _this.val = str.replace(img_url,"");
                        }
                    }
                    this.xzyn.msg('只允许上传图片 '+this.upImgNum+' 张')
                }else{
                    var formData = new FormData();
                    formData.append('file',$file);
                    formData.append('dir','image');
                    _this.xzyn.ajax(_this.request_url.uploads_index,'post',formData,{},(data,res)=>{
                        _this.up_img.push(data);
                        _this.$refs.editor.$img2Url(pos, data);
                    },false)
                }
            }else{
                var img_name = $file.name;
                var str = _this.value;
                var re = /!\[+[0-9|a-z|A-Z|/|.|:]+\]\(+([0-9|a-z|A-Z|/|.|:])+\)+/gi;
                var url_arr = str.match(re);
                for (let i = 0; i < url_arr.length; i++) {
                    const img_url = url_arr[i];
                    if( img_url.includes(img_name) ){
                        _this.val = str.replace(img_url,"");
                    }
                }
                this.xzyn.msg('不允许上传图片');
            }
        },
        // 删除图片
        del_img: function(url){
            var _this = this;
            this.$confirm('确定要删除？', '提示').then(({ result }) => {
                if (result) {
                    this.xzyn.ajax(_this.request_url.uploads_delimg,'post',{imgurl:url},{},function(data,res){
                        var str = _this.value;
                        var re = /!\[+[0-9|a-z|A-Z|/|.|:]+\]\(+([0-9|a-z|A-Z|/|.|:])+\)+/gi;
                        var url_arr = str.match(re);
                        for (let i = 0; i < url_arr.length; i++) {
                            const img_url = url_arr[i];
                            if( img_url.includes(url) ){
                                _this.val = str.replace(img_url,"");
                            }
                        }
                        var new_imgarr = [];
                        for (let i = 0; i < _this.up_img.length; i++) {
                            const imgurl = _this.up_img[i];
                            if( imgurl !== url ){
                                new_imgarr.push(imgurl);
                            }
                        }
                        _this.up_img = new_imgarr;
                    },false)
                }
            });
        }

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
    }
}
</script>
<style>
    /*@import url(); 引入公共css类*/
    .editor {
        margin: auto;
        padding: 10px;
        width: 100%;
    }
</style>