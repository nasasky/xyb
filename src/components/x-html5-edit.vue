<template>
	<div class="">
		<div v-if="up_img.length > 0" class="">
			<span>点击图片删除</span>
			<div class="up-img-list">
				<mu-paper v-for="(item,index) in up_img" :key="index" class="img-list" :z-depth="2" @click="img_click(item)">
					<img :src="item" alt="">
				</mu-paper>
			</div>
		</div>
		<div class="x-html5-edit" :style="{height:height}" ref="editor" id="editorContainer"></div>
		<mu-dialog transition="slide-bottom" fullscreen :open.sync="show_up_layer">
			<mu-appbar style="width: 100%;" color="primary">
				<mu-button icon slot="left" @click="show_up_layer = false">
					<mu-icon value=":fa fa-close"></mu-icon>
				</mu-button>上传图片
			</mu-appbar>
			<div class="x-ptb-10 x-tc">
				<npButton @change="img_change">选择图片</npButton>
				<mu-button class="x-ml-30" @click="upload">开始上传</mu-button>
			</div>
			<div v-show="obj.img" class="x-plr-10" style="height:500px;">
				<vue-cropper ref="cropper" :img="obj.img" :autoCrop="obj.autoCrop" :fixedNumber="obj.fixedNumber"
				 :autoCropWidth="obj.autoCropWidth" :autoCropHeight="obj.autoCropHeight" :fixed="obj.fixed" :info="obj.info"
				 :centerBox="obj.centerBox"
				 ></vue-cropper>
			</div>
		</mu-dialog>
	</div>
</template>

<script>
	import { ZxEditor } from 'zx-editor'
	import { VueCropper }  from 'vue-cropper'
	import npButton  from './x-up-button'
	var zxEditor;
	export default {
		components: {	// 创建组件
			VueCropper,npButton
		},
		name: 'xHtml5Edit',
		data() {
			return {
				up_img: [],	// 上传的图片，返回给父组件
				up_num: 0,	// 上传图片的数量
				show_up_layer: false,	// 上传图片层
				is_imgurl: true,	// 初始化图片url
				is_content: true,	// 初始化内容
				obj: {	// 图片裁剪配置
					img: '',	// 裁剪图片的地址
					fixedNumber: [1,1],		// 截图框的宽高比例
					autoCropWidth: 200, 	// 默认生成截图框宽度
					autoCropHeight: 200, 	// 默认生成截图框高度
					centerBox: true,	// 截图框是否被限制在图片里面
					fixed: false,	// 是否开启截图框宽高固定比例
					info: false,	// 裁剪框的大小信息
					autoCrop: true,	// 是否默认生成截图框
				},
            	file: ''
			}
		},
		props: {
			height: {
				type: [String],
				default: '50%'
			},
			initContent: String,	// 初始化内容
			upImgNum: { // 允许上传的图片数量
				type: [Number],
				default: 6
			},
			initImgurl: Array	// 初始化图片数据
		},
		watch: {
			initImgurl: function(newVal,oldVal){
				if( this.is_imgurl ){
					this.is_imgurl = false;
					this.up_img = newVal;
					this.up_num = newVal.length;
				}
			},
			initContent: function(newVal,oldVal){
				if( this.is_content ){
					this.is_content = false;
					zxEditor.setContent(newVal)	// 初始化内容
				}
			}
		},
		mounted: function () {	// 并挂载到实例上去之后调用该钩子
			this.$nextTick(function () {	// 视图加载完
				var _this = this;
				zxEditor = new ZxEditor('#editorContainer', {
					// fixed: true,	// 编辑器是否绝对定位，默认为false。
					// bottom: 0,		// 底部距离。
					// top:50
					padding: 0,		// 编辑器左右内边距，默认15像素,
					showToolbar: ['pic','emoji','text','link']	// 是否显示底部工具栏 ['pic', 'emoji', 'text', 'link']
				})
				// 编辑器内容改变
				zxEditor.on('change', function (type, zxeditor) {
					_this.getContent()
				})
				// 删除附件图片/链接前通知
				zxEditor.on('remove-attach', function ($el, type) {
					console.log($el,type)
					if( type == 'img' ){
						var img_url = $el.getElementsByTagName("img")[0].src;
						_this.del_img(img_url);	//删除图片
					}
				})
				// 点击底部选择图片图标时触发。监听此通知，将阻止编辑器默认处理逻辑执行
				zxEditor.on('select-picture', function () {
					if( _this.up_num >= _this.upImgNum ){
						_this.xzyn.msg('只允许上传图片 '+_this.upImgNum+' 张')
					}else{
						_this.obj.img = '';
						_this.show_up_layer = true;
					}
				})
			})
		},
		methods:{	// 自定义方法
			// 获取编辑的内容
			getContent: function(){
				var content = zxEditor.getContent();	// 获取编辑的内容
				content = zxEditor.removeRedundantCode(content);	// 移除多余的html代码
				var r_obj = {
					content: content,
					imgurl: this.up_img
				}
				this.$emit('change',r_obj)
			},
			// 添加图片到内容
			addImgConttent: function(url){
				this.up_num += 1;
				this.up_img.push(url);
				zxEditor.addImage(url);
			},
			// 删除图片
			del_img: function(url){
				var _this = this;
				_this.up_num = _this.up_num - 1;
				var new_up_img = [];
				for (var i = 0; i < _this.up_img.length; i++) {
					if( _this.up_img[i] != url ){
						new_up_img.push(_this.up_img[i]);
					}
				}
				_this.up_img = new_up_img;
				this.xzyn.ajax(_this.request_url.uploads_delimg,'post',{imgurl:url},{},function(data,res){
					// console.log(data)
				},false)
			},
			// 开始上传
			upload: function(){
				var _this = this;
				if( _this.up_num >= _this.upImgNum ){
					_this.xzyn.msg('只允许上传图片 '+_this.upImgNum+' 张')
				}else{
					// 获取截图的blob数据
					this.$refs.cropper.getCropBlob((data) => {
						var formData = new FormData();
						formData.append('file',data,_this.file.name);
						formData.append('dir','image');
						_this.xzyn.ajax(_this.request_url.uploads_index,'post',formData,{},(data,res)=>{
							_this.addImgConttent(data);
							_this.obj.img = '';
							_this.show_up_layer = false;
						},false)
					})
				}
			},
			// 选择图片
			img_change: function(obj){
				this.obj.img = obj.url;
				this.file = obj.file;
			},
			// 图片列表删除按钮
			img_click: function(url){
				var _this = this;
				zxEditor.dialog.confirm('确认要删除吗？', (type)=>{
					if( type ){
						//匹配图片（g表示匹配所有结果i表示区分大小写）
						var imgReg = /<img.*?(?:>|\/>)/gi;
						//匹配src属性
						var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
						// 包括img完整标签的数组
						var img_arr = _this.initContent.match(imgReg);
						for (var i = 0; i < img_arr.length; i++) {
							var src_url = img_arr[i].match(srcReg)[1];
							if( src_url == url ){
								_this.del_img(url);	// 删除图片
								var new_content = _this.initContent.replace(img_arr[i],"");	// 删除img标签
								new_content = zxEditor.removeRedundantCode(new_content);	// 移除多余的html代码
								zxEditor.setContent(new_content)	// 初始化内容
							}
						}
					}
				})
			}
		}

	}
</script>

<style>
	.x-html5-edit{
		position:relative;
		width:100%;
		min-height: 200px;
		overflow: auto;
	}
	.up-img-list{
		/* background-color:#e0e0e0; */
		border:solid 1px #e0e0e0;
		border-radius:4px;
	}
	.img-list{
		display: inline-block;
		width:30px;
		height:30px;
		margin:5px 0 0 4px;
	}
	.img-list img{
		width:100%;
		height:100%;
	}
</style>
