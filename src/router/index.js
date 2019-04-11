
import xBase from '@/views/base.vue';
import home from '@/views/Home.vue'
import loginIndex from '@/views/login/index'
import loginReg from '@/views/login/reg'
// 记账页面

// 用户页面
import userIndex from '@/views/user/index'
// 笔记页面
import notesList from '@/views/notes/notes_list.vue'
import notesInfo from '@/views/notes/notes_info.vue'
// 后台管理页面
import admin_login from '@/views/admin/login.vue'
import admin_base from '@/views/admin/base.vue'

import index_index from '@/views/admin/index/index.vue'
import index_cleancache from '@/views/admin/index/cleancache.vue'

import user_index from '@/views/admin/user/index.vue'
import user_create from '@/views/admin/user/create.vue'
import user_edit from '@/views/admin/user/edit.vue'

import authgroup_index from '@/views/admin/authgroup/index.vue'
import authgroup_create from '@/views/admin/authgroup/create.vue'
import authgroup_edit from '@/views/admin/authgroup/edit.vue'
import authgroup_authuser from '@/views/admin/authgroup/authuser.vue'

import authrule_index from '@/views/admin/authrule/index.vue'
import authrule_create from '@/views/admin/authrule/create.vue'
import authrule_edit from '@/views/admin/authrule/edit.vue'

import authrulem_index from '@/views/admin/authrulem/index.vue'
import authrulem_create from '@/views/admin/authrulem/create.vue'
import authrulem_edit from '@/views/admin/authrulem/edit.vue'

import config_index from '@/views/admin/config/index.vue'
import config_create from '@/views/admin/config/create.vue'
import config_edit from '@/views/admin/config/edit.vue'
import config_web from '@/views/admin/config/web.vue'
import config_system from '@/views/admin/config/system.vue'
import config_up from '@/views/admin/config/up.vue'
import config_sms from '@/views/admin/config/sms.vue'
import config_music from '@/views/admin/config/music.vue'

import navigation_index from '@/views/admin/navigation/index.vue'
import navigation_create from '@/views/admin/navigation/create.vue'
import navigation_edit from '@/views/admin/navigation/edit.vue'

import flink_index from '@/views/admin/flink/index.vue'
import flink_create from '@/views/admin/flink/create.vue'
import flink_edit from '@/views/admin/flink/edit.vue'

import loginlog_index from '@/views/admin/loginlog/index.vue'

import apiapp_index from '@/views/admin/apiapp/index.vue'
import apiapp_create from '@/views/admin/apiapp/create.vue'
import apiapp_edit from '@/views/admin/apiapp/edit.vue'

import apitype_index from '@/views/admin/apitype/index.vue'
import apitype_create from '@/views/admin/apitype/create.vue'
import apitype_edit from '@/views/admin/apitype/edit.vue'

import apilist_index from '@/views/admin/apilist/index.vue'
import apilist_create from '@/views/admin/apilist/create.vue'
import apilist_edit from '@/views/admin/apilist/edit.vue'

import apilist_qingqiu_index from '@/views/admin/apilist/qingqiu_index.vue'
import apilist_qingqiu_create from '@/views/admin/apilist/qingqiu_create.vue'
import apilist_fanhui_index from '@/views/admin/apilist/fanhui_index.vue'
import apilist_fanhui_create from '@/views/admin/apilist/fanhui_create.vue'

import database_index from '@/views/admin/database/index.vue'
import database_reduction from '@/views/admin/database/reduction.vue'

import guestbook_index from '@/views/admin/guestbook/index.vue'


// 错误页面
import error_404 from '@/views/error_404'

var router_obj = {
    mode: 'history',
    routes: [
    { path: '/', component: xBase, meta: {name: '戏中有你'},
        children: [
            { path: '', component: home, meta: {name: '戏中有你'} },
            { path: '/login/index',  component: loginIndex, meta: {name: '用户登陆'} },
            { path: '/login/reg', component: loginReg, meta: {name: '用户注册'} },
            { path: '/notes/notes_list', component: notesList, meta: {name: '笔记圈'} },
            { path: '/notes/notes_info', component: notesInfo, meta: {name: '笔记详情'} },
            { path: '/user/index', component: userIndex, meta: {name: '随手记', is_login: true } }
        ]
    },
    { path: '/admin/login', component: admin_login, meta: {name: '管理登陆', is_login: false } },
    { path: '/admin/index/index', component: admin_base, meta: {name: '戏中有你', is_login: true },
        children: [
            { path: '', component: index_index, meta: {name: '戏中有你', is_login: true } },

            { path: '/admin/index/cleancache', component: index_cleancache, meta: {name: '戏中有你', is_login: true } },

            { path: '/admin/user/index', component: user_index, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/user/create', component: user_create, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/user/edit', component: user_edit, meta: {name: '戏中有你', is_login: true } },

            { path: '/admin/authgroup/index', component: authgroup_index, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/authgroup/create', component: authgroup_create, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/authgroup/edit', component: authgroup_edit, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/authgroup/authuser', component: authgroup_authuser, meta: {name: '戏中有你', is_login: true } },

            { path: '/admin/authrule/index', component: authrule_index, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/authrule/create', component: authrule_create, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/authrule/edit', component: authrule_edit, meta: {name: '戏中有你', is_login: true } },

            { path: '/admin/authrulem/index', component: authrulem_index, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/authrulem/create', component: authrulem_create, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/authrulem/edit', component: authrulem_edit, meta: {name: '戏中有你', is_login: true } },

            { path: '/admin/config/index', component: config_index, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/config/create', component: config_create, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/config/edit', component: config_edit, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/config/web', component: config_web, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/config/system', component: config_system, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/config/up', component: config_up, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/config/sms', component: config_sms, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/config/music', component: config_music, meta: {name: '戏中有你', is_login: true } },

            { path: '/admin/navigation/index', component: navigation_index, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/navigation/create', component: navigation_create, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/navigation/edit', component: navigation_edit, meta: {name: '戏中有你', is_login: true } },

            { path: '/admin/flink/index', component: flink_index, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/flink/create', component: flink_create, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/flink/edit', component: flink_edit, meta: {name: '戏中有你', is_login: true } },

            { path: '/admin/loginlog/index', component: loginlog_index, meta: {name: '戏中有你', is_login: true } },

            { path: '/admin/apiapp/index', component: apiapp_index, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/apiapp/create', component: apiapp_create, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/apiapp/edit', component: apiapp_edit, meta: {name: '戏中有你', is_login: true } },

            { path: '/admin/apitype/index', component: apitype_index, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/apitype/create', component: apitype_create, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/apitype/edit', component: apitype_edit, meta: {name: '戏中有你', is_login: true } },

            { path: '/admin/apilist/index', component: apilist_index, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/apilist/create', component: apilist_create, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/apilist/edit', component: apilist_edit, meta: {name: '戏中有你', is_login: true } },

            { path: '/admin/apilist/qingqiu_index', component: apilist_qingqiu_index, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/apilist/qingqiu_create', component: apilist_qingqiu_create, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/apilist/fanhui_index', component: apilist_fanhui_index, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/apilist/fanhui_create', component: apilist_fanhui_create, meta: {name: '戏中有你', is_login: true } },

            { path: '/admin/database/index', component: database_index, meta: {name: '戏中有你', is_login: true } },
            { path: '/admin/database/reduction', component: database_reduction, meta: {name: '戏中有你', is_login: true } },

            { path: '/admin/guestbook/index', component: guestbook_index, meta: {name: '戏中有你', is_login: true } },


        ]
    },



    { path: '*', name:'404', component: error_404 }

    
]}


export default router_obj