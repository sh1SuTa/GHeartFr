<template>
  <div class="download-page">

    <div class="download-options">
      <a :href="androidLink" class="download-button" download>下载安卓版</a>
      <a :href="iosLink" class="download-button" download>下载苹果版</a>
      <a :href="pcLink" class="download-button" download>下载电脑版</a>
    </div>
  </div>
  <br />




  <el-table :data="vpnData" style="width: 100%">

    <el-table-column label="节点秘钥" prop="node"></el-table-column>
    <el-table-column label="节点信息" prop="nodeDescribe"></el-table-column>

    <el-table-column label="操作" width="100">

      <template #default="{ row }">
        <!-- 复制按钮 -->

        <el-button :icon="CopyDocument" circle plain type="primary"
          @click="copyNodeKeyAndCloseDialog(row.node)"></el-button>
        <!-- 查看按钮 -->
        <el-button :icon="View" circle plain @click="showNodeKeyDialog(row.node)"></el-button>

      </template>

    </el-table-column>

    <template #empty>
      <el-empty description="你不是会员" />
    </template>
  </el-table>
  <!-- 查看节点秘钥的 Dialog -->

  <el-drawer v-model="dialogVisible"  direction="ttb" size="100%" >
    
    <el-input v-model="nodeKeyToShow" style="width: 100%"  :autosize="{ minRows: 2, maxRows: 10 }" type="textarea"
      placeholder="Please input" />
  </el-drawer>

</template>  
    
<script setup>  

import {
  CopyDocument,
  View
} from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue';

import { vpnDataListService } from '@/api/vpn.js'
import { ElMessage } from 'element-plus';
    
const androidLink = ref('https://adapk.wwwjspay.com/res/wwwjs-s.apk'); // 替换为实际的安卓下载链接  
const iosLink = ref('https://apps.apple.com/us/app/outline-app/id1356177741');
const pcLink = ref('https://s3.amazonaws.com/outline-releases/client/windows/stable/Outline-Client.exe'); 

  
const vpnData = ref([ ])
const dialogVisible=ref(false) // 控制 Dialog 的显示 
const nodeKeyToShow= ref('');

function showNodeKeyDialog(nodeKey) { 
      nodeKeyToShow.value = nodeKey; // 设置要显示的节点秘钥  
      dialogVisible.value = true; // 显示 Dialog  
};

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

.centered-text p {  
  margin: 0;  
  padding: 0;  
} 

    
  .download-options {  
    display: flex; /* 使用Flexbox布局 */  
  justify-content: space-between; /* 按钮之间均匀分布空间 */  
  /* 或者使用 flex-start, flex-end, center 等来对齐按钮 */  
  
  padding: 0;  
  width: 100%; /* 容器宽度占满父元素 */  
    margin-top: 10px;  
  }  
    
.download-button {  
  display: inline-block; /* 在Flexbox子项中，这实际上是可选的 */  
   
  margin: 0 10px;  
  padding: 3px 6px;  
  background-color: #df7bb2;  
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