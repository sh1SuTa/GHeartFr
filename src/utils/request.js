//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
//导入element-plusUi
import { ElMessage } from 'element-plus';

import { useTokenStore } from '@/stores/token.js';

//定义一个变量,记录公共的前缀  , const baseURL = 'http://localhost:8080';
const baseURL = '/api';
const instance = axios.create({baseURL})

let hasShownLoginPrompt = false; 

//添加请求拦截器
instance.interceptors.request.use(
    (config)=>{
        //请求前的回调
        //添加token
        const tokenStore = useTokenStore();
        // 判断有没有token
        if(tokenStore.token){
            config.headers.Authorization = tokenStore.token
        }
        return config
    },
    (err)=>{
        //请求错误的回调
        Promise.reject(err)
    }
)

//导入路由器
import  router  from '@/router';

//添加响应拦截器
instance.interceptors.response.use(
    result=>{

        //判断是否成功
        if(result.data.code === 0){
            return result.data;
        }else{
            //处理响应失败的提示
        ElMessage.error(result.data.message ? result.data.message : '服务异常')
        
        //异步操作的状态转换为失败
        return Promise.reject(result.data)
        }

        
    },
    err=>{
        //判断响应状态码，401未登录，跳转登录登录页面
        if(err.response.status === 401){
            if (!hasShownLoginPrompt) {  
                hasShownLoginPrompt = true;  
                ElMessage.error('请先登录');  
                router.push('/login');  
            }
        }else{
            ElMessage.error('服务异常')
        }
         // 重置登录提示标志位  
        hasShownLoginPrompt.value = false;  
        //异步的状态转化成失败的状态
        return Promise.reject(err);
    }
)

export default instance;