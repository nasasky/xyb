<template>
	<div class="x-jiugongge">
		<div class="x-button-list" :class="'x-button-width-'+num" v-for="(item,index) in data" :key="index">
			<mu-ripple class="x-button" :class="item.id == choose?'x-button-'+chooseColor:''" @click="onClick(item)">
				<div class="x-button-icon">
					<mu-icon :value="':fa '+(item.icon||'fa-cny')" size="26"></mu-icon>
				</div>
				<span class="x-button-text">{{item.name}}</span>
			</mu-ripple>
		</div>
	</div>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
			};
		},
		props: {
			data: Array, //数据
			num:{	// 按钮一行几个
				type: [String,Number],
				default: 5
			},
			icon: {	// icon图标
				type: [String],
				default: 'xzyn-gonggeshitu'
			},
			choose: {	// 当前选择的
				type: [Number,String],
				default: 0
			},
			chooseColor: {	// 当前选择的颜色
				type: [String],
				default: 'default'		// 可选值：default/success/secondary/info
			}
		},
		methods: {
			onClick(item) {
				this.$emit('click',item)
			}

		}

	}
</script>

<style>
	.x-jiugongge{
		position: relative;
		background-color: #ffffff;
		padding: 7px 7px 0 0;
	}
	.x-button-list{
		position: relative;
		display: inline-block;
		padding: 0 0 7px 7px;
		text-align: center;
	}
	.x-button{
		position: relative;
		border: 1px solid #757575;
		color: #757575;
		border-radius:4px;
		display: block;
		min-width: auto;
	}
	.x-button-icon{
		margin-top: 5px;
	}
	.x-button-text{
		line-height:20px;
		padding: 0 1px 0 1px;
		margin-bottom: 3px;
		overflow: hidden;
		-o-text-overflow: ellipsis;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}
	.x-button-default{
		background-color:#bdbdbd;
		color:#ffffff;
		border: 1px solid #bdbdbd;
	}
	.x-button-success{
		background-color:#4caf50;
		color:#ffffff;
		border: 1px solid #4caf50;
	}
	.x-button-secondary{
		background-color:#ff4081;
		color:#ffffff;
		border: 1px solid #ff4081;
	}
	.x-button-info{
		background-color:#2196F3;
		color:#ffffff;
		border: 1px solid #2196F3;
	}
	.x-button-width-1{
		width: 100%;
	}
	.x-button-width-2{
		width: 50%;
	}
	.x-button-width-3{
		width: 33.333333333333336%;
	}
	.x-button-width-4{
		width: 25%;
	}
	.x-button-width-5{
		width: 20%;
	}
	.x-button-width-6{
		width: 16.666666666666668%;
	}
	.x-button-width-7{
		width: 14.285714285714286%;
	}
	.x-button-width-8{
		width: 12.5%;
	}
	.x-button-width-9{
		width: 11.11111111111111%;
	}
	.x-button-width-10{
		width: 10%;
	}
</style>
