# putileaf.com

#### 介绍
**dish文件夹下是打包好的前端代码，可以自己放在nginx下html运行**
其他文件夹都是源码可以自行修改
记得修改nginx.conf配置文件。

#### Nginx配置文件，可自行根据实际情况修改
在service{}中

        
        root /usr/local/nginx/html/dist;  
        index index.html;  
 
        location / {
		try_files $uri $uri/ /index.html;
	}
	


	
	location /api/ {  
	    proxy_pass http://localhost:8080/;  
	    proxy_set_header Host $host;  
	    proxy_set_header X-Real-IP $remote_addr;  
   	    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  
       	    proxy_set_header X-Forwarded-Proto $scheme;  
	}

 
    	location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {  
        	expires max;  
	        log_not_found off;  
	 }  


#### 使用说明

1.  将dish放在nginx下html即可
2.  直接用vscode打开即可
3.  node_modules中的依赖管理可自行npm install
4.  编译  _npm run build_ ，运行  _npm run dev_ 

#### 注意

1.  vite.config.js 中的 server 配置仅适用于开发环境，不适用于生产环境。如果您需要在生产环境中设置代理，请在服务器上配置反向代理。上面提供了nginx的配置，你只需将 http://localhost:8080/ 替换为自己的后端服务器即可
2.  xxxx
3.  xxxx

#### 技术栈

1.  vue
3.  npm
4.  el-plus


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)

