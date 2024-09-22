<script setup>
import {
    Edit,
    Delete,View
} from '@element-plus/icons-vue'

import { ref  } from 'vue'
//导入article.js
import {articleCategoryListService,articleReadService,articleAddService,articleUpdateService} from '@/api/article.js'
//导入token
import {useTokenStore} from '@/stores/token.js'


import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {ElMessage} from 'element-plus'

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

const searchKeyword=ref('')

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

//控制MTF抽屉是否显示
const mtfVisibleDrawer = ref(false)

const killMeVisibleDrawer = ref(false)

function closeDrawer() {
  mtfVisibleDrawer.value = false;
}

const closeKillMeDrawer = () => {
  killMeVisibleDrawer.value = false;
  ElMessage.success('我们终将抵达所有人都期待的美好未来');
}



//获取文章列表数据
const articleList = async ()=>{
  const keywordLower = searchKeyword.value.toLowerCase();
  if (keywordLower.includes('mtf')) {
    mtfVisibleDrawer.value = true;
    return; // 阻止进一步的搜索操作
  }
  else if(keywordLower.includes('自杀')){
    
    killMeVisibleDrawer.value = true;
    return; 
  }
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        // state: state.value ? state.value : null
        searchKeyword: searchKeyword.value ? searchKeyword.value : null
    }
    
    let result = await articleReadService(params);
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
// import { zhCN } from 'element-plus/dist/locale/zh-cn'
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




//控制阅读弹窗
const visibleList = ref(false)




//显示阅读弹窗
const showArticleList = (row)=>{
  visibleList.value = true;
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
    searchKeyword:'',
    createUser:''
  }
}

// 定义重置方法
const resetForm = async () => {
  categoryId.value = ''; // 使用.value来修改ref的值
  searchKeyword.value = '';
  await nextTick(); // 等待DOM更新
  articleList(); // 调用搜索逻辑
};

import TransgenderFlag from '@/components/TransgenderFlag.vue';



</script>

<template>
  <el-card class="page-container">

    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <el-select placeholder="请选择" v-model="categoryId" style="width: 200px">
          <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="搜索标题：">
        <el-input v-model="searchKeyword" placeholder="请输入关键字" style="width: 200px"></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="articleList">搜索</el-button>
        <!-- <el-button @click="categoryId='';searchKeyword=''">重置</el-button> -->
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 文章列表 -->
    <el-table :data="articles" style="width: 100%">

      <el-table-column label="文章标题" width="170" prop="title"></el-table-column>
      <!-- <el-table-column label="分类" prop="categoryName"></el-table-column> -->
      <!-- <el-table-column label="发表时间" prop="createTime"> </el-table-column> -->
      <!-- <el-table-column label="状态" prop="state"> </el-table-column> -->
      <el-table-column label="封面" prop="coverImg">
        <template #default="{ row }">
          <el-image :src="row.coverImg" style="width: 30px; height: 30px" />
        </template>
      </el-table-column>
      
      <el-table-column label="查看" width="100">
        <template #default="{ row }">
          <!-- 查看按钮 -->
          <el-button :icon="View" circle plain type="success" @click="showArticleList(row)"></el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>





    <!-- 分页条 -->
    <div class="pagination-container">
      <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
        layout="prev, pager, next, jumper, sizes, total" :total="total" @size-change="onSizeChange"
        @current-change="onCurrentChange" style="margin-top: 20px;" />
    </div>
    <!-- <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]" layout="jumper, total, sizes, prev, pager, next"
    background:total="total" @size-change="onSizeChange"  @current-change="onCurrentChange"  style="margin-top: 20px; justify-content: flex-end"/> -->



    <!-- 阅读文章抽屉 -->
    <el-dialog v-model="visibleList" width="80%" :title="articleModel.title">
      <!-- 文章封面 -->
      <div v-if="articleModel.coverImg" class="article-cover">
        <img :src="articleModel.coverImg" alt="文章封面" />
      </div>
      <!-- 作者显示 -->
      <div class="article-author">作者ID：{{ articleModel.createUser }}</div>
      <!-- 文章内容展示 -->
      <div class="article-content">
        <div v-html="articleModel.content"></div>
      </div>



      <!-- 分类信息 -->
      <p v-if="articleModel.categoryName" class="category-name">分类：{{ articleModel.categoryName }}</p>

      <!-- 关闭按钮 -->
      <!-- <el-button slot="footer" @click="visibleList = false">关闭</el-button> -->
      <template v-slot:footer>
        <el-button @click="visibleList = false">关闭</el-button>
      </template>

    </el-dialog>

   

  <el-dialog v-model="mtfVisibleDrawer"  width="500" :before-close="handleClose">
    <!-- 使用具名插槽自定义标题 -->  
    <template #title>  
      <div class="custom-dialog-title">  
        <!-- 显示TransgenderFlag组件 -->  
        <TransgenderFlag class="flag-icon" />  
        <!-- 接着是标题文本 -->  
        <span class="title-text">愿每一个人都能自由的生活在阳光下</span>  
      </div>  
    </template>  
    <span class="pink-bg">不向焦虑与抑郁投降，这个世界终会有我们存在的地方,
      如果你能记住我的名字，如果你们都能记住我的名字，也许我或者“我们”，终有一天能自由地生存着。</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="mtfVisibleDrawer = false">
          加油
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="killMeVisibleDrawer" title="你不必独自面对一切" width="500" :before-close="handleClose">
    <span class="pink-bg">如果累了，就放慢脚步看看路边的风景吧，没有人会一直用追逐的脚步。
      这个世界无比残酷，但我依然还爱着你。
      我们想给处于疲惫、失意、难过中的你，提供一个让精神得以休憩的场所。
      在这一方天地里,我们希望倾听你的心事烦恼，为你提供安抚和鼓励;
      在这个世界里罗你并不孤单。
      我们愿意，也期待着，给你—个温暖的怀抱，希望我们能同你继续前行。

    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="closeKillMeDrawer()">
          都说了要前进啦♪~
        </el-button>
      </div>
    </template>
  </el-dialog>


  </el-card>
</template>

<style lang="scss" scoped>
.custom-dialog-title {  
  display: flex; /* 使用 Flexbox 布局 */  
  align-items: center; /* 垂直居中 */  
  /* 如果需要，可以添加一些额外的间距 */  
  gap: 8px; /* 在 Flex 容器中，gap 属性可以添加元素之间的间距 */  
}  
  
/* 根据需要调整 TransgenderFlag 组件的大小和位置 */  
.flag-icon {  
  /* 假设 TransgenderFlag 是一个图标或小型图片，你可能需要设置其宽度和高度 */  
  width: 32px; /* 示例宽度 */  
  height: 32px; /* 示例高度 */  
  /* 其他样式，如 margin、padding 等 */  
}  


.pink-bg {
  background-color: white;
  color: pink;
  
  
}
.drawer-footer {
  text-align: right;
}

.article-author {
  font-weight: bold;
  color: green;
}
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