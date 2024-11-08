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

import { ref,h,render } from 'vue';





const tokenStore = useTokenStore();
const router = useRouter();
const userInfoStore = useUserInfoStore();
const userInfo = ref(null);
const zhanzhang = ref("鲸鱼娘西丝特official");
import TransgenderFlag from '@/components/TransgenderFlag.vue';

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
<el-container class="mainStyle">
      <!-- 固钉 -->
      <el-affix >
      <el-header>
        <div class="member-label"><strong class="nickname" v-html="userInfoStore.info.nickname"></strong></div>
        
        <el-menu :default-active="activeIndex"  mode="horizontal"  :ellipsis="false" @select="handleSelect" router class="custom-menu">
          <el-menu-item @click="scrollToBottom" class="custom-menu">
            <img src="@/assets/image/green.png" height="50px"  width="50px" alt="Element logo"  class="custom-menu"/>  
        </el-menu-item>
          <el-menu-item index="/article/category" class="custom-menu">文章分类</el-menu-item>
          <el-menu-item index="/article/manage" class="custom-menu">文章管理</el-menu-item>
          <el-menu-item index="/userVPN" class="custom-menu">梯子工具</el-menu-item>
          <el-menu-item index="/article/read" class="custom-menu">阅读文章</el-menu-item>
          <el-menu-item index="/user/info" class="custom-menu">个人中心</el-menu-item>
        </el-menu>
  
            <!-- 下拉菜单 command被点击后触发，可以在事件函数上可以声明一个参数接收条目对应的指令-->
        <el-dropdown placement="bottom-end" @command="handleCommand">
            <span class="el-dropdown__box">
                <el-avatar :src="userInfoStore.info.userPic ? userInfoStore.info.userPic : avatar" shape='square'/>
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
    </el-affix>
      <el-main >
        <router-view ></router-view>
      </el-main>
      <el-footer>
        <div>
            站长：<a href="https://tenapi.cn/v2/qqcard?qq=2903039102" class="zhanz" >{{zhanzhang}}</a>
        </div>
        <div>
            &nbsp;域名捐赠者：<a href="https://tenapi.cn/v2/qqcard?qq=2964141308" class="juanz" >xxxia</a>
        </div>
        <div style="display: block;">
            &nbsp;<a href="https://mtf.wiki/zh-cn/docs/" class="mtfUrl" > 友🍥情链接</a>
        </div>
      </el-footer>
    </el-container>
    <el-backtop :right="10" :bottom="100" />
</template>

<style lang="scss" scoped>
.mainStyle {
  margin-bottom: 20px;
  background: linear-gradient(90deg, #f8f8f8,#f1f5d4,  #dff7b9,#fad0c4,#f8f8f8); /* 定义渐变填充 */
  border-radius: 8px; /* 可选：让边角圆润 */
  
}


.el-header {
  
  
  background-color: rgba(255, 255, 255, 0.5);

  display: flex;
  align-items: center;
  justify-content: space-between;

    .el-dropdown__box {
        display: flex;
        align-items: center;
        .el-icon {
            color: #999;
            
        }
        &:active,
        &:focus {
            outline: none;
        }
    }
}
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
.custom-menu{
  
  background-color: rgba(255, 255, 255, 0);
}
</style>