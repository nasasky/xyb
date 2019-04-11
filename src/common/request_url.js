// 请求URL数据
var request_url = {
   request_url:            'https://nasaskyx.club', 	// 请求的域名  请求服务器域名
    //request_url:            'http://localhost', 	// 请求的域名  请求本地域名

    apptoken_index:         '/api/5a65ceac14950',	// 获取 appToken url地址
    usertoken_index:        '/api/5a6614d399fd4',    // 获取用户UserToken令牌（用户登录）
    usertoken_register:     '/api/5c3364d532ab1',    // 注册用户接口
    usertoken_loginout:     '/api/5c33a221d775f',     // 退出登陆接口

    index_index:            '/api/5c7bb17eec5ab',     // 网站通用数据接口

    uploads_delimg:         '/api/5a72e97699d55',    // 删除图片接口
    uploads_index:          '/api/5a6c5d8095a88',    // 图片上传接口
    uploads_avatar:         '/api/5c604f63a3ae2',    // 头像上传接口

    account_bill:           '/api/5c4b1f89d013c',    // 账单详情列表接口
    account_delete:         '/api/5c5b1e8289058',    // 删除账单接口
    account_add:            '/api/5c3a401cd3168',    // 添加账目接口
    account_config_index:   '/api/5c5ed9e6628ec',    // 月预算首页接口
    account_config_edit:    '/api/5c5edaab96e8d',    // 添加/编辑配置接口
    account_index:          '/api/5c3a3425db672',    // 记账首页数据接口
    account_type_edit:      '/api/5c5ae9b436224',     // 分类编辑/添加接口
    account_type_index:     '/api/5c5aed6a1b111',    // 获取分类列表接口
    account_type_delete:    '/api/5c5aebd6b606f',    // 删除分类接口
    account_report:         '/api/5c518d20a3a37',    // 报表详情列表接口
    account_type_typeinfo:  '/api/5c5eba7aed95c',    // 分类月份账单详情接口

    notes_add:              '/api/5c630ee49a7d6',    // 添加/编辑笔记接口
    notes_info:             '/api/5c65c428cc724',    // 获取笔记详细信息接口
    notes_delete:           '/api/5c66af5316f94',    // 删除笔记接口
    notes_list:             '/api/5c659b043d88f',    // 获取用户公开的笔记列表接口
    notes_index:            '/api/5c6578efcebcb',    // 获取用户笔记列表接口
    notes_reply_delete:     '/api/5c6c55a6d8dc8',    // 删除笔记回复接口
    notes_reply_add:        '/api/5c6c2ea5a1784',    // 添加笔记回复接口
    notes_reply_index:      '/api/5c6c2e5e05465',    // 获取笔记回复列表接口
    notes_zan_add:          '/api/5c6c30a0738b3',    // 赞笔记/赞笔记回复接口

    focus_add:              '/api/5a7ea76d97770',    // 关注和取消关注用户接口
    focus_index:            '/api/5a80154e1ca98',    // 获取关注用户的列表接口

    collect_add:            '/api/5a81371c9e728',    // 收藏和取消收藏文章接口
    collect_index:          '/api/5a8137f83ad68',    // 获取收藏文章列表接口

    userinfo_edit:          '/api/5a742637b79e6',    // 更新用户资料接口
    userinfo_index:         '/api/5a6a2f4c31ce0',    // 用户详细信息接口信息

}



export default request_url