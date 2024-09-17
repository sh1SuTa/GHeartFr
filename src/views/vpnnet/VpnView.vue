<template>  
    <div class="download-page">  
      <h1>下载梯子</h1>  
      <div class="download-options">  
        <a :href="androidLink" class="download-button" download>下载安卓版</a>  
        <a :href="iosLink" class="download-button" download>下载苹果版</a>  
        <a :href="pcLink" class="download-button" download>下载电脑版</a>  
      </div>  
    </div>  

    
    <div class="centered-text">  
      <h2>请不要泄漏密钥，否则将禁用您的账户</h2>  
      <p>密钥泄漏会使网速变慢</p>  
      
    </div>  

    <el-table :data="vpnData" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="节点秘钥" prop="node"></el-table-column>
            <el-table-column label="节点信息" prop="nodeDescribe"></el-table-column>

            <el-table-column label="操作" width="100">
                
                <template #default="{ row }">
                    <!-- 编辑按钮 -->
                    
                    <el-button :icon="CopyDocument" circle plain type="primary" @click="copyNodeKeyAndCloseDialog(row.node)"></el-button>
                    <!-- 删除按钮 -->
                    <!-- <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button> -->
                </template>
                
            </el-table-column>

            <template #empty>
                <el-empty description="你不是会员" />
            </template>
    </el-table>

</template>  
    
<script setup>  

import {
  CopyDocument
} from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue';
import { userInfoService } from '@/api/user.js'
import { vpnDataListService } from '@/api/vpn.js'
import { ElMessage } from 'element-plus';
    
const androidLink = ref('https://adapk.wwwjspay.com/res/wwwjs-s.apk'); // 替换为实际的安卓下载链接  
const iosLink = ref('https://apps.apple.com/us/app/outline-app/id1356177741');
const pcLink = ref('https://adapk.wwwjspay.com/res/tools.zip'); 
const isMember = ref(false);
  
const vpnData = ref([ ])



//声明异步函数
const vpnDataList = async () => {
    let result = await vpnDataListService();
    vpnData.value = result.data;
}
vpnDataList();

async function copyNodeKeyAndCloseDialog(nodeKey) {
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    ElMessage({
      message: '浏览器不支持复制功能',
      type: 'error',
    });
    return;
  }

  try {
    // 检查权限
    if (!(await navigator.permissions.query({ name: 'clipboard-write' })).state === 'granted') {
      throw new Error('缺少复制权限');
    }

    await navigator.clipboard.writeText(nodeKey);
    
    ElMessage({
      message: '节点秘钥已复制',
      type: 'success',
    });
  } catch (error) {
    ElMessage({
      message: `复制节点秘钥失败: ${error.message}`,
      type: 'error',
    });
  }
}

</script>  
    
<style scoped>  
.centered-text {  
  text-align: center;  
}  
.centered-text p {  
  margin: 0;  
  padding: 0;  
} 
  .download-page {  
    text-align: center;  
    padding: 20px;  
  }  
    
  .download-options {  
    margin-top: 20px;  
  }  
    
  .download-button {  
    display: inline-block;  
    margin: 0 10px;  
    padding: 10px 20px;  
    background-color: #4CAF50; /* 绿色 */  
    border: none;  
    color: white;  
    text-align: center;  
    text-decoration: none;  
    font-size: 16px;  
    cursor: pointer;  
  }  
    
  .download-button:hover {  
    background-color: #45a049; /* 深绿色 */  
  }  
</style>