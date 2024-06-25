import { createRouter,createWebHistory } from "vue-router";


//导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'

import ArticleCategoryVue from '@/views/article/ArticleCategory.vue'
import ArticleManageVue from '@/views/article/ArticleManage.vue'
import UserAvatarVue from '@/views/user/UserAvatar.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'
import VpnViewVue from "@/views/vpnnet/VpnView.vue";

import ArticleDetail from '@/components/ArticleDetail.vue'
import pMail from '@/views/vpnnet/pMail.vue'

//定义路由关系
const routes = [
    { path: '/login',component: LoginVue },
    // redirect: '/article/manage'默认显示文章管理
    { path: '/',component: LayoutVue,redirect: '/article/manage' ,children:[
        {path: '/article/category',component: ArticleCategoryVue},
        {path: '/article/manage',component: ArticleManageVue},
        {path: '/user/info',component: UserInfoVue},
        {path: '/user/avatar',component: UserAvatarVue},
        {path: '/user/resetPassword',component: UserResetPasswordVue},
        {path: '/userVPN',component: VpnViewVue},
        {path: '/article/read',component: ArticleDetail},
        {path: '/vip/pMail',component: pMail}
    ] }
    
    
]

//创建路由器
const router = createRouter(
    {
        history: createWebHistory(),
        routes: routes
    }
)

//导出路由
export default router