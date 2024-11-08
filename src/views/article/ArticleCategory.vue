<script setup>
import {Edit,Delete} from '@element-plus/icons-vue'
import { ref,onMounted,nextTick } from 'vue'
import {ElMessageBox} from 'element-plus'
//导入article.js
import {articleCategoryListService,articleCategoryAddService,articleCategoryUpdateService,
    articleCategoryDeleteService} from '@/api/article.js'
import { ElMessage } from 'element-plus'

const categorys = ref([
    // {"id": 3,"categoryName": "你没有登录",   "categoryAlias": "请重新登录","createTime": "2023-09-02 12:06:59", "updateTime": "2023-09-02 12:06:59"}
])



//声明异步函数
const articleCategoryList = async ()=>{
    let result = await articleCategoryListService();
    categorys.value = result.data;
}
articleCategoryList();

//控制添加分类弹窗
const dialogVisible = ref(false)

//添加分类数据模型
const categoryModel = ref({
    categoryName: '',
    categoryAlias: ''
})
//添加分类表单校验
const rules = {
    categoryName: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
    ],
    categoryAlias: [
        { required: true, message: '请输入分类别名', trigger: 'blur' },
    ]
}




//调用接口，添加表单
const addCategory = async ()=>{
    let result = await articleCategoryAddService(categoryModel.value);
    ElMessage.success(result.message ? result.message : '前端：添加成功')
    //调用获取所有文章的函数来刷新页面
    articleCategoryList();
    dialogVisible.value = false;
}

//定义变量控制标题的展示
const title = ref('')

//展示编辑弹窗
const showDialog = (row)=>{
    dialogVisible.value=true;title.value='编辑分类'
    //数据拷贝
    categoryModel.value.categoryName = row.categoryName;
    categoryModel.value.categoryAlias = row.categoryAlias;
    //扩展id属性，将来要传递给后台，完成分类的修改
    categoryModel.value.id = row.id;
}

//编辑文章分类
const updateCategory = async ()=>{
    //调用接口
    let result = await articleCategoryUpdateService(categoryModel.value)
    ElMessage.success(result.message ? result.message : '前端：修改成功')
    
    //调用获取所有分类的函数用以界面刷新
    articleCategoryList();

    //关闭弹窗
    dialogVisible.value = false;
}

//清空模型的数据
const clearData = ()=>{
    categoryModel.value.categoryName = '';
    categoryModel.value.categoryAlias = '';
}

//删除分类
const deleteCategory = (row)=>{
    //提示用户是否确认删除
    ElMessageBox.confirm(
    '你确认要删除该分类信息吗?',
    '温馨提示',
    {
      confirmButtonText: '删除',
      cancelButtonText: '返回',
      type: 'warning',
    }
  )
    .then(async () => {
        //调用接口删除
        alert('删除功能尚未开发');
        let result = await articleCategoryDeleteService(row.id);
      ElMessage({
        type: 'success',
        message: '删除成功',
      })

      //刷新列表
      articleCategoryList();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '不进行删除',
      })
    })
}

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
    <el-card class="page-container touming" >

        <template #header >
            <div class="header ">
                <span>文章分类</span>

                <div class="extra">
                    <!-- 添加分类按钮 -->
                    <el-button type="primary" @click="dialogVisible=true;title='添加分类';clearData()" >添加分类</el-button>
                </div>

            </div>
        </template>

        <el-table :data="categorys" style="width: 100%" class="qtouming">
            <el-table-column class="qtouming" label="序号" width="100" type="index"> </el-table-column>
            <el-table-column class="qtouming" label="文章分类" prop="categoryName"></el-table-column>
            <el-table-column class="qtouming" label="分类别名" prop="categoryAlias"></el-table-column>

            <el-table-column class="qtouming" label="操作" width="100">
                
                <template #default="{ row }">
                    <!-- 编辑按钮 -->
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <!-- 删除按钮 -->
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
                </template>
                
            </el-table-column>

            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- 添加分类弹窗 -->
        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="分类名称" prop="categoryName">
                    <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="分类别名" prop="categoryAlias">
                    <!-- minlength，maxlength最大最小输入限制 -->
                    <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="128"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="title == '添加分类' ? addCategory() : updateCategory()"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>

    </el-card>
</template>

<style lang="scss" scoped>
.touming{
background-color: rgba(255, 255, 255, 0.5);
}
.qtouming{
background-color: rgba(255, 255, 255, 0);
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
</style>