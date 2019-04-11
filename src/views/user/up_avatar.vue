<!-- 头像上传页面 -->
<template>
    <div class=''>
		<div class="x-ptb-10 x-tc">
            <npButton @change="img_change">选择图片</npButton>
			<mu-button @click="upload" class="x-ml-30">开始上传</mu-button>
		</div>
		<div v-show="obj.img" class="x-plr-10" style="height:500px;">
			<vue-cropper ref="cropper" :img="obj.img" :autoCrop="obj.autoCrop" :fixedNumber="obj.fixedNumber"
			 :autoCropWidth="obj.autoCropWidth" :autoCropHeight="obj.autoCropHeight" :fixed="obj.fixed" :info="obj.info"
			 :centerBox="obj.centerBox"
			 ></vue-cropper>
		</div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
	import { VueCropper }  from 'vue-cropper'
	import npButton  from '../../components/x-up-button'

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {VueCropper,npButton},
    name: '',
    props: {},
    data() {
    //这里存放数据
        return {
            obj: {	// 图片裁剪配置
                img: '',	// 裁剪图片的地址
                fixedNumber: [1,1],		// 截图框的宽高比例
                autoCropWidth: 200, 	// 默认生成截图框宽度
                autoCropHeight: 200, 	// 默认生成截图框高度
                centerBox: true,	// 截图框是否被限制在图片里面
                fixed: true,	// 是否开启截图框宽高固定比例
                info: false,	// 裁剪框的大小信息
                autoCrop: true,	// 是否默认生成截图框
            },
            file: ''

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //方法集合
    methods: {
        // 开始上传
        upload: function(){
            var _this = this;
            this.$refs.cropper.getCropBlob((data) => {
                var formData = new FormData();
                formData.append('file',data,_this.file.name);
                formData.append('dir','avatar');
                formData.append('uid',_this.$root.user_data.id);
                _this.xzyn.ajax(_this.request_url.uploads_avatar,'post',formData,{},(data,res)=>{
                    _this.$root.user_data.avatar = data;
                    _this.xzyn.edit_data('user_data',_this.$root.user_data);	// 缓存数据
                })
            })
        },
        // 选择图片
        img_change: function(obj){
            this.obj.img = obj.url;
            this.file = obj.file;
        },

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    }
}
</script>
<style>
    /*@import url(); 引入公共css类*/

</style>