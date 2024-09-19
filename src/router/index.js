import { createRouter,createWebHistory } from "vue-router";


//导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'
import LayoutMVue from '@/views/LayoutM.vue'

import ArticleCategoryVue from '@/views/article/ArticleCategory.vue'
import ArticleCategoryMVue from '@/views/article/m/ArticleCategoryM.vue'

import ArticleManageVue from '@/views/article/ArticleManage.vue'
import ArticleManageMVue from '@/views/article/m/ArticleManageM.vue'

import UserAvatarVue from '@/views/user/UserAvatar.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'
import VpnViewVue from "@/views/vpnnet/VpnView.vue";
import LoginVueM from '@/views/LoginM.vue'

import ArticleDetail from '@/components/ArticleDetail.vue'
import pMail from '@/views/vpnnet/pMail.vue'


//定义路由关系
const routes = [
    { path: '/login',component: LoginVue },
    {path:'/loginM',component: LoginVueM},
    // redirect: '/article/manage'默认显示
    { path: '/',component: LayoutVue,redirect: '/article/manage' ,children:[
        {path: '/article/category',component: ArticleCategoryVue},
        {path: '/article/manage',component: ArticleManageVue},
        {path: '/user/info',component: UserInfoVue},
        {path: '/user/avatar',component: UserAvatarVue},
        {path: '/user/resetPassword',component: UserResetPasswordVue},
        {path: '/userVPN',component: VpnViewVue},
        {path: '/article/read',component: ArticleDetail},
        {path: '/vip/pMail',component: pMail},
        // {path: '/user/message',component: UserMessage}
    ] },
    //移动端路由
    {
        path: '/m',component: LayoutMVue,redirect: '/article/manage1' ,children:[
            {path: '/article/category1',component: ArticleCategoryMVue},
            {path: '/article/manage1',component: ArticleManageMVue},
            {path: '/user/info',component: UserInfoVue},
            {path: '/user/avatar',component: UserAvatarVue},
            {path: '/user/resetPassword',component: UserResetPasswordVue},
            {path: '/userVPN',component: VpnViewVue},
            {path: '/article/read',component: ArticleDetail},
            {path: '/vip/pMail',component: pMail},
            
        ]
    }
    
    
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