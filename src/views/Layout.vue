<script setup>
import {Management,Promotion,UserFilled,User,Crop,EditPen,SwitchButton,CaretBottom,Sort,Reading,
    Message
} from '@element-plus/icons-vue'

import avatar from '@/assets/default.png'
import { userInfoService } from '@/api/user.js'
import useUserInfoStore from '@/stores/userInfo.js'

import { useRouter } from 'vue-router'
import {ElMessage,ElMessageBox} from 'element-plus'
import { useTokenStore } from '@/stores/token.js'

import { ref } from 'vue';





const tokenStore = useTokenStore();
const router = useRouter();
const userInfoStore = useUserInfoStore();
const userInfo = ref(null);
const zhanzhang = ref("鲸鱼娘西丝特official");



//调用函数获取用户信息
const getUserInfo = async ()=>{
    //调用接口
    let result = await userInfoService();
    userInfo.value = result.data;
    //数据存储在pinia中
    userInfoStore.setInfo(result.data);
}
getUserInfo();

//条目被点击后的函数
const handleCommand = async (command)=>{
    //判断指令
    if(command === 'logout'){
        ElMessageBox.confirm(
           '您确认要退出吗?',
           '温馨提示',
           {
             confirmButtonText: '确认',
             cancelButtonText: '取消',
             type: 'warning',
           }
        )
        .then(async () => {
               //退出登录，清除pinia中存储的token和个人信息
                tokenStore.removeToken()
                userInfoStore.removeInfo()
                //跳转登录页面
                router.push('/login')
             ElMessage({
               type: 'success',
               message: '已退出登录',
             })
        })
        .catch(() => {
             ElMessage({
               type: 'info',
               message: '不退出登录',
             })
        })
    }else{
        //路由
        router.push('/user/'+command)

    }
}





</script>

<template>

    
    
    <!-- element-plus中的容器 -->
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            
            <!-- element-plus的菜单标签 -->
            <el-menu active-text-color="#ffd04b" background-color="#404040"  text-color="#fff"
                router>

                <el-menu-item index="/article/category">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>文章分类</span>
                </el-menu-item>

                <el-menu-item index="/article/manage">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>文章管理</span>
                </el-menu-item>

                <el-sub-menu >
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/user/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/user/resetPassword">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                    <el-menu-item v-if="userInfo && userInfo.vip === 1" index="/userVPN">
                        <el-icon>
                            <Sort />
                        </el-icon>
                        <span>梯子应用</span>
                    </el-menu-item>
                    <!-- 
                    <el-menu-item index="/user/message">
                        <el-icon><Message /></el-icon>
                        <span>消息列表</span>
                    </el-menu-item>
                    -->
                </el-sub-menu>

                

                

                <!-- 阅读文章 -->
                <el-menu-item index="/article/read">
                    <el-icon><Reading /></el-icon>
                    <span>阅读文章</span>
                </el-menu-item>
                

            </el-menu>

        </el-aside>

        <!-- 右侧主区域 -->
        <el-container>
            
            <!-- 头部区域 -->
            <el-header>
                <div class="member-label">puti叶子成员：<strong class="nickname">{{userInfoStore.info.nickname}}</strong></div>

                <!-- 下拉菜单 command被点击后触发，可以在事件函数上可以声明一个参数接收条目对应的指令-->
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.info.userPic ? userInfoStore.info.userPic : avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                            <el-dropdown-item command="resetPassword" :icon="EditPen">重置密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>

            </el-header>

            <!-- 中间区域 -->
            <el-main>
                <!-- <div style="width: 1290px; height: 570px;border: 1px solid red;">
                    内容展示区
                </div> -->
                <router-view ></router-view>

            </el-main>
            
            <!-- 底部区域 -->
            <el-footer>
                <div>
                    站长：<a href="https://tenapi.cn/v2/qqcard?qq=2903039102" class="zhanz" >{{zhanzhang}}</a>
                </div>
                 <div>
                    &nbsp;域名捐赠者：
                    <a href="https://tenapi.cn/v2/qqcard?qq=2964141308" class="juanz" >xxxia</a>
                </div>
                <div style="display: block;">
                    &nbsp;
                    <a href="https://mtf.wiki/zh-cn/docs/" class="mtfUrl" > 友🍥情链接</a>

                </div>
            </el-footer>

        </el-container>

    </el-container>
    
</template>

<style lang="scss" scoped>
.member-label {  
    color: white; /* 设置文本颜色为白色 */  
}
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            background: url('@/assets/logo.png') no-repeat center / 200px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #404040;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
.nickname {  
  color: rgba(255, 251, 0, 0.993); /* 设置文字颜色为粉色 */  
} 
.zhanz {
    color: red;
    text-decoration: none;
}
.juanz{
    color: green;
    text-decoration: none;
}

.mtfUrl{
    color: pink;
    text-decoration: none;
}

</style>