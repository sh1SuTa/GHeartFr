<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref,nextTick,onMounted } from 'vue'
//导入article.js
import {articleCategoryListService,articleListService,articleAddService,articleUpdateService} from '@/api/article.js'
//导入token
import {useTokenStore} from '@/stores/token.js'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {ElMessage} from 'element-plus'
import { useRouter } from 'vue-router';  // 使用 Vue Router 的 useRouter 钩子


const router = useRouter();
const tokenStore = useTokenStore();

//上传成功的回调函数
const uploadSuccess = (result)=>{
    articleModel.value.coverImg = result.data;
    console.log(result.data);
}

//回显文章分类
const articleCategoryList = async ()=>{
    let result = await articleCategoryListService();
    categorys.value = result.data;
}

//文章分类数据模型
const categorys = ref([
    {
        "id": 3,
        "categoryName": "美食",
        "categoryAlias": "my",
        "createTime": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    }
])

//用户搜索时选中的分类id
const categoryId=ref('')

//用户搜索时选中的发布状态
const state=ref('')

//文章列表数据模型
const articles = ref([
    {
        "id": 5,
        "title": "正在加载",
        "content": "",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    },
    
])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(10)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    articleList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    articleList()
}



//获取文章列表数据
const articleList = async ()=>{
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    }
    let result = await articleListService(params);
    //重新加载数据
    total.value = result.data.total;
    articles.value = result.data.items;
    // 处理数据
    for(let i=0;i<articles.value.length;i++){
        let article = articles.value[i];
        for(let j=0;j<categorys.value.length;j++){
            if(article.categoryId == categorys.value[j].id){
                article.categoryName = categorys.value[j].categoryName;
            }
        }
    }
}
articleCategoryList()
articleList();

import {Plus} from '@element-plus/icons-vue'
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content:'',
    state:''
})

//添加文章
const addArticle = async (clickState)=>{
    //把发布状态赋值给数据模型
    articleModel.value.state = clickState;
    //调用接口
    let result = await articleAddService(articleModel.value);
    ElMessage.success(result.message ? result.message : '前端：添加成功')
    //让抽屉消失
    visibleDrawer.value = false;
    //刷新当前列表
    articleList()

}

const editArticle = async (clickState)=>{
    articleModel.value.state = clickState;
    let result = await articleUpdateService(articleModel.value);
    ElMessage.success(result.message ? result.message : '前端：修改成功')
    visibleEdit.value = false;
    articleList()
}

//控制添加分类弹窗
const visibleEdit = ref(false)

//显示编辑弹窗
const showFileList = (row)=>{
  visibleEdit.value = true;
  //数据拷贝
  articleModel.value = {...row};
}

//清空数据模型
const clearArticleModel = ()=>{
  articleModel.value = {
    title: '',
    categoryId: '',
    coverImg: '',
    content:'',
    state:''
  }
}

// 定义重置方法
const resetForm = async () => {
  categoryId.value = ''; // 使用.value来修改ref的值
  state.value = '';
  await nextTick(); // 等待DOM更新
  articleList(); // 调用搜索逻辑
};


//默认不是移动设备
const isMobile = ref(false);
const checkIfMobile = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /android|iPad|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
};
const redirectIfMobile = () => {
  isMobile.value = checkIfMobile();
  if (isMobile.value) {
    router.push('/article/manage1');
  }
};
onMounted(() => {
  redirectIfMobile();
});

</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章管理</span>
        <div class="extra">
          <el-button type="primary" @click="visibleDrawer=true">添加文章</el-button>
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <el-select
          placeholder="请选择"
          v-model="categoryId"
          style="width: 200px"
        >
          <el-option
            v-for="c in categorys"
            :key="c.id"
            :label="c.categoryName"
            :value="c.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发布状态：">
        <el-select placeholder="请选择" v-model="state" style="width: 200px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="articleList">搜索</el-button>
        <!-- <el-button @click="categoryId='';state=''">重置</el-button> -->
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 文章列表 -->
    <el-table :data="articles" style="width: 100%" >
    
      
      <el-table-column label="文章标题" width="400" prop="title" ></el-table-column>
      <el-table-column label="分类" prop="categoryName"></el-table-column>
      <el-table-column label="发表时间" prop="createTime"> </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <!-- 编辑按钮 -->
          <el-button :icon="Edit" circle plain type="primary" @click="showFileList(row)"></el-button>
          <!-- 删除按钮 -->
          <el-button :icon="Delete" circle plain type="danger"></el-button>
          
          
          
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    
    
    
    
    <!-- 分页条 -->
    <div class="pagination-container">  
      <el-pagination  v-model:current-page="pageNum"  v-model:page-size="pageSize"  :page-sizes="[3, 5, 10, 15]"  layout="prev, pager, next, jumper, sizes, total"  
      :total="total"  @size-change="onSizeChange"   @current-change="onCurrentChange"   style="margin-top: 20px;"   /> 
    </div>
    <!-- <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]" layout="jumper, total, sizes, prev, pager, next"
    background:total="total" @size-change="onSizeChange"  @current-change="onCurrentChange"  style="margin-top: 20px; justify-content: flex-end"/> -->
    

    
    <!--添加文章抽屉 -->
        <el-drawer v-model="visibleDrawer" title="添加文章" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form :model="articleModel" label-width="100px" >
                <el-form-item label="文章标题" >
                    <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="文章分类">
                    <el-select placeholder="请选择" v-model="articleModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章封面">
                     <!-- auto-upload是否自动上传图片 action设置服务器接口路径 name上传名字 headers上传请求头 onsuccess成功的回调函数-->
                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                    action="/api/upload" name="file" :headers="{'Authorization':tokenStore.token}"
                    :on-success="uploadSuccess">
                        <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="文章内容">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html"></quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addArticle('已发布')">发布</el-button>
                    <el-button type="info" @click="addArticle('草稿')">草稿</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <!-- 修改文章抽屉 -->
        <el-drawer v-model="visibleEdit" title="修改文章" direction="rtl" size="50%">
          <!-- 修改文章菜单 -->
          <el-form :model="articleModel" label-width="100px" >
              <el-form-item label="文章标题" >
                  <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
              </el-form-item>
              <el-form-item label="文章分类">
                  <el-select placeholder="请选择" v-model="articleModel.categoryId">
                      <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="文章封面">
                <!-- 自动上传图片 -->
                <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                action="/api/upload" name="file" :headers="{'Authorization':tokenStore.token}"
                :on-success="uploadSuccess">
                  <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon">
                      <Plus />
                  </el-icon>
                </el-upload>
              </el-form-item>

              <el-form-item label="文章内容">
                <div class="editor">
                  <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html"></quill-editor>
                </div>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="editArticle('已发布')">发布</el-button>
                <el-button type="info" @click="editArticle('草稿')">草稿</el-button>
              </el-form-item>

          </el-form>
        </el-drawer>


    </el-card>
</template>

<style lang="scss" scoped>
.pagination-container {  
  display: flex;  
  justify-content: flex-end;  
  align-items: center; /* 如果需要垂直居中 */  
  margin-top: 20px; /* 保持之前的上边距 */  
}  
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>