<!-- 用户资料编辑页面 -->
<template>
    <div class='x-pt-10'>
		<mu-paper :z-depth="2" class="x-plr-10">
			<mu-form ref="form" :model="user_data" label-position="right" label-width="60">
				<mu-form-item label="昵称" prop="name">
					<mu-text-field v-model="user_data.name" max-length="10"></mu-text-field>
				</mu-form-item>
				<mu-form-item label="密码" prop="password" help-text="不修改请留空">
					<mu-text-field type="password" v-model="user_data.password" max-length="20"></mu-text-field>
				</mu-form-item>
				<mu-form-item label="邮箱" prop="email">
					<mu-text-field v-model="user_data.email"></mu-text-field>
				</mu-form-item>
				<mu-form-item label="手机" prop="moblie">
					<mu-text-field v-model="user_data.moblie" max-length="11"></mu-text-field>
				</mu-form-item>
				<mu-form-item label="QQ号" prop="qq">
					<mu-text-field v-model="user_data.qq"></mu-text-field>
				</mu-form-item>
				<mu-form-item label="微信" prop="weixin">
					<mu-text-field v-model="user_data.weixin"></mu-text-field>
				</mu-form-item>
				<mu-form-item label-position="top">
					<mu-row>
						<mu-col span="6">
							<mu-form-item label="生日" prop="birthday">
								<mu-date-input v-model="user_data.birthday" type="date" @change="date_change" full-width></mu-date-input>
							</mu-form-item>
						</mu-col>
						<mu-col span="6">
							<mu-form-item label="性别" prop="sex">
								<mu-select v-model="user_data.sex" full-width>
									<mu-option label="女" :value="0"></mu-option>
									<mu-option label="男" :value="1"></mu-option>
								</mu-select>
							</mu-form-item>
						</mu-col>
					</mu-row>
				</mu-form-item>
				<mu-form-item label="简介" prop="info">
					<mu-text-field v-model="user_data.info" :rows="2" multi-line placeholder="不允许超过100个字符" :max-length="100"></mu-text-field>
				</mu-form-item>
				<mu-form-item label-position="top">
					<div class="x-pr-15 x-w-1">
						<mu-button full-width color="primary" @click="add_ajax">提交</mu-button>
					</div>
				</mu-form-item>
			</mu-form>
		</mu-paper>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    name: '',
    props: {

    },
    data() {
    //这里存放数据
        return {
            user_data: {},

        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
			// 保存提交
			add_ajax: function(){
				var _this = this;
				_this.xzyn.ajax(_this.request_url.userinfo_edit,'post',_this.user_data,{},(data,res)=>{
					_this.user_data = data;
					_this.xzyn.edit_data('user_data',data);
				})

			},
			// 选择日期触发
			date_change: function(date){
				var date_ymd = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
				this.user_data.birthday = date_ymd;
			}

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.user_data = this.$root.user_data;

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    }
}
</script>
<style>
    /*@import url(); 引入公共css类*/

</style>