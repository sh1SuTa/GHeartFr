<script setup>
import {Management,Promotion,UserFilled,User,Crop,EditPen,SwitchButton,CaretBottom,Sort,Reading,
    Message,Menu
} from '@element-plus/icons-vue'

import avatar from '@/assets/default.png'
import { userInfoService } from '@/api/user.js'
import useUserInfoStore from '@/stores/userInfo.js'

import { useRouter } from 'vue-router'
import {ElMessage,ElMessageBox} from 'element-plus'
import { useTokenStore } from '@/stores/token.js'

import { ref,h,render } from 'vue';
import TransgenderFlag from '@/components/TransgenderFlag.vue';


const isDrawerVisible = ref(false);



const tokenStore = useTokenStore();
const router = useRouter();
const userInfoStore = useUserInfoStore();
const userInfo = ref(null);
const zhanzhang = ref("RemXi");
const replaceFlag = (text) => {
  // 创建一个临时容器来渲染组件
  const container = document.createElement('div');
  render(h(TransgenderFlag), container);
  const flagHtml = container.innerHTML;
  // 替换文本中的🏳️‍⚧️字符
  return text.replace(/🏳️‍⚧️/g, flagHtml);
};


const getUserInfo = async () => {
  try {
    // 调用用户信息接口
    let result = await userInfoService();
    userInfo.value = result.data;

    // 替换 nickname 中的🏳️‍⚧️字符
    const formattedNickname = replaceFlag(result.data.nickname);

    // 更新数据存储
    userInfoStore.setInfo({ ...result.data, nickname: formattedNickname });
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
};
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

        <!-- 左侧菜单，使用 el-drawer 来替代 -->
        <el-drawer v-model="isDrawerVisible" direction="tbr" :with-header="false">
            
            <el-menu class="semi-transparent-menu" active-text-color="#ffd04b"  router>
                <el-menu-item index="/article/category1">
                    <el-icon>
                        <Management class="pink"/>
                    </el-icon>
                    <span class="pink">文章分类</span>
                </el-menu-item>
                <el-menu-item index="/article/manage1">
                    <el-icon>
                        <Promotion class="pink"/>
                    </el-icon>
                    <span class="pink">文章管理</span>
                </el-menu-item>

                <el-sub-menu>
                    <template #title>
                        <el-icon>
                            <UserFilled class="pink"/>
                        </el-icon>
                        <span class="pink">个人中心</span>
                    </template>
                    
                    <el-menu-item index="/user/info1">
                        <el-icon>
                            <User class="pink"/>
                        </el-icon>
                        <span class="pink">基本资料</span>
                    </el-menu-item>
                    
                    <el-menu-item index="/user/avatar1">
                        <el-icon>
                            <Crop class="pink"/>
                        </el-icon>
                        <span class="pink">更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/user/resetPassword1">
                        <el-icon>
                            <EditPen class="pink"/>
                        </el-icon>
                        <span class="pink">重置密码</span>
                    </el-menu-item>
                    <el-menu-item v-if="userInfo && userInfo.vip === 1" index="/userVPN1">
                        <el-icon>
                            <Sort class="pink"/>
                        </el-icon>
                        <span class="pink">梯子应用</span>
                    </el-menu-item>
                </el-sub-menu>

                <el-menu-item index="/article/read1">
                    <el-icon>
                        <Reading class="pink"/>
                    </el-icon>
                    <span class="pink">阅读文章</span>
                </el-menu-item>
            </el-menu>
            
        </el-drawer>


        <el-container>
            <!-- 头部区域，增加打开侧边栏的按钮 -->
            <el-header>
                <el-button @click="isDrawerVisible = true" icon="Menu" class="menu-button" type="text">
                    <el-icon>
                        <Menu />
                    </el-icon>
                </el-button>
                <!-- <div class="member-label">用户：<strong class="nickname">{{userInfoStore.info.nickname}}</strong></div> -->
                <div class="member-label"><strong class="nickname" v-html="userInfoStore.info.nickname"></strong></div>



                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.info.userPic ? userInfoStore.info.userPic : avatar" />
                        <el-icon>
                            <CaretBottom class="pink"/>
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
                <router-view></router-view>
            </el-main>

            <!-- 底部区域 -->
            <el-footer>
                <div>
                    站长：<a href="https://tenapi.cn/v2/qqcard?qq=2903039102" class="zhanz">{{zhanzhang}}🍥</a>
                </div>
                <div>
                    域名捐赠者：
                    <a href="https://tenapi.cn/v2/qqcard?qq=2964141308" class="juanz">xxxia</a>
                </div>

            </el-footer>
        </el-container>
    </el-container>
</template>


<style lang="scss" scoped>

.pink {  
    color: rgba(230, 99, 201, 0.87); /* 将文本颜色改为蓝色 */  
    
}

.semi-transparent-menu {  
  background-color: rgba(251, 177, 162, 0.5) !important; /* 使用 rgba 设置半透明背景色 */  
  /* 其他样式，如边框、阴影等 */  
}

.member-label {  
    color: rgb(241, 104, 104);
}




.layout-container {
    height: 100vh;


   

   

    .el-aside {
        background-color: #232323;
    }

    .el-header {
        background-color: #fbb1a2;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .menu-button {
            display: none;
        }

        @media (max-width: 768px) {
            .menu-button {
                display: inline-block;
                margin-right: 10px;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #666;
    }

    @media (max-width: 768px) {
        .nickname {
            font-size: 12px;
        }
    }
}

.zhanz {
    color: red;
    text-decoration: none;
}
.juanz {
    color: green;
    text-decoration: none;
}
.mtfUrl {
    color: pink;
    text-decoration: none;
}
</style>
