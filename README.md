# 技术栈
Nextjs+OAuth授权体系+React Hooks+Koa+Redis

- Nextjs提供同构渲染
- Koa提供数据接口和服务器路由
- Redis提供session存储

## Nextjs

- 完善的React项目架构，搭建轻松
- 自带数据同步策略，解决同构项目最大难点
- 丰富的插件帮助我们增加各种功能
- 灵活的配置根据你的需求来自定义

## OAuth 
- 实现流程
- 安全性如何保证？
- 结合Github API 进行实战演练

常见OAuth提供商：QQ，微信，微博

## React Hooks
- 什么是Hooks，以及如何使用
- 各种Hooks的使用方法以及注意事项
- Hooks存在的问题以及如何解决

## 技术
- Nextjs项目搭建
- Nextjs技术点剖析
- React Hooks深度解析
- Nextjs 集成redux
- OAuth原理深度解析
- 集成Github oAuth
- Node 服务开发
- 搜索Github仓库
- 展示创建和关注的仓库
- 查看仓库详情和Issues
----------------------------
# 第一章
## npm版本包版本号

- ^aa.bb.cc 
>^ 代表自动安装当前大版本号下最新的<br>
aa 大版本号，一般只有breaking changes的时候才更新<br>
bb 一般是修复较大的bug <br>
cc 细微的修改
----------------------------
## 初始化项目
- 手动
- create-next-app <br>
`npm i -g create-next-app` <br>
`npx create-next-app [project-name]` <br>
`yarn create next-app [project-name]`<br>

```js
    "scripts": {
        "dev": "next",
        "build": "next build",
        "start": "next start"
    },
```

```js
# 创建 `ages/index.js`
export default () => <span>Hello Next!</span>
yarn dev  
```
-------------------------------
## Next作为Koa中间件使用
### 服务器
- Nextjs自身带有服务器，只处理SSR渲染(内部启动的Node服务，并通过服务返回页面html字符串)
- 处理HTTP请求，并根据请求数据返回相应的内容（Next做不到）
- 根据域名之类的HOST来定位服务器

### Next无法处理服务端
- 数据接口
- 数据库连接
- session状态

### 为什么使用Koa
- 轻量级Nodejs服务端框架
- 项目相对轻量，不需要很多集成功能（重量级可使用Eggjs）
- 易扩展，编程模式符合JS特性

### 集成Next到Koa中
```js
# 创建server.js
const Koa  = require('koa');
const next = require('next');

const dev = process.env.NODE_ENV !== "prodution";
const app = next({dev});
const handle = app.getRequestHandler(); //处理http响应

//页面编译完成后才响应请求
app.prepare().then(()=>{
    const server = new Koa();
    server.use(async (ctx,next)=>{
        await handle(ctx.req,ctx.res); //处理请求
        ctx.respond = false ;
    })

    server.listen(3000,()=>{
        console.log("koa server listening on 3000");
    })
})

```
------------------------------
## Koa使用
### 中间件机制 app.use

创建koa.js 执行`node ./koa.js`
```
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx,next)=>{
    ctx.body = '<span>Hello Koa</span>';
    await next(); //如果不执行next，就无法运行下一个中间件
});

app.use(async (ctx,next)=>{
    ctx.body = '<span>Hello Koa222</span>';
});

app.listen(3001,()=>{
    console.log('server is running on 3001')
})
```

### ctx对象
- ctx.path
- ctx.method
- ctx.response
- ctx.request
- ctx.res -- Node原生的res
- ctx.req -- Node原生的req

```js
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx,next)=>{
    const path = ctx.path; //访问URL的路径
    const method = ctx.method; //请求方式
    ctx.body = `Hello Koa ${path}${method}`;
    await next(); //如果不执行next，就无法运行下一个中间件
});

app.listen(3001,()=>{
    console.log('server is running on 3001')
})
```
### koa-router
```
const Koa = require('koa');
const Router = require('koa-router'); //1
const app = new Koa();
const router = new Router(); //2

router.get('/test',(ctx)=>{ //5 接受get请求
    ctx.body = "Hello koa router!!!"
})
router.get('/test/:id',(ctx)=>{ //路由传参
    ctx.body = { success:true };
    ctx.set('Content-Type','application/json');
})
app.use(async (ctx,next)=>{ //3
    await next(); 
});
app.use(router.routes()); //4

app.listen(3001,()=>{
    console.log('server is running on 3001')
})
```
### ctx.request、ctx.response、ctx.req、ctx.res的关系

- ctx.request - Koa request Object
- ctx.response -  Koa response Object
- ctx.req  -  Node request Object
- ctx.res - Node response Object

----------------
## Redis
### windows 安装
[windows 安装](https://github.com/MicrosoftArchive/redis/releases)
- 安装完成之后,系统会自动启动服务
- 手动启动
   找到安装目录，在终端执行`. \redis-server.exe .\redis.windows.conf`
- 默认也已经安装到环境变量
  ```
   redis-cli
   set a 123 # 存储 a:123
   get a  # 获取到a
  ```

### Mac 安装
#### 手动安装,源码编译
[Mac安装](https://redis.io/download)
```
wget http://download.redis.io/releases/redis-5.0.5.tar.gz
tar xzf redis-5.0.5.tar.gz //解压
cd redis-5.0.5
make //编译

src/redis-server //起服务
src/redis-cli //重启开终端,进行数据库操作

redis> set a 123
OK
redis> get a
"bar"
```

#### brew包安装
```
brew install redis
redis-cli
```

### redis 基础使用
- 内存数据解构存储
- 可持久存储
- 支持多种数据结构

#### 密码登录
#### 基础命令
```
set a 123
get a
setex a 10 1 //设置过期时间 10s后过期

# 设置key的规范
set session:sessionId 123
get session:sessionId

# 查看所有的key
keys *

# 删除key值
del a
```

## ioredis--连接Node+Redis
```
async function test(){
    const Redis = require('ioredis'); // 引入ioredis

    const redis = new Redis({
        port:6379
    });
    redis.set('c','5678'); // 增
    await redis.setex('c',10,'5678'); //设置10s后过期
    const keys = await redis.keys('*');
    console.log(keys);
}
test()
```

## 集成Ant Design
### Next默认不支持import导入css

```js
# 引入 @zeit/next-css
yarn add @zeit/next-css

# 配置 next.config.js
const withCSS = require('@zeit/next-css');
if(typeof require !== 'undefined'){
    require.extensions['.css'] = file => {}
}
module.exports = withCSS({})
```

### 引入Antd 

```
# 引入
yarn add antd 

# 按需引入
yarn add babel-plugin-import

# 配置`.babelrc`
{
    "presets": ["next/babel"],
    "plugins":[
        [
            "import",
            {
                "libraryName":"antd"
            }
        ]
    ]
}

# 将Antd的样式作用于组件，创建_app.js
import App from 'next/app';
import 'antd/dist/antd.css';
export default App;
```
-------------
# 第二章
## 目录结构
- pages目录下的js文件就对应来URL里的路由，比如pages/a.js--->对应http://localhost:3000/a.js
- 其他目录

>├── components 组件<br>
├── lib <br>
├── pages  页面 主要目录<br>
│   ├── _app.js<br>
│   ├── a.js<br>
│   └── index.js<br>
├── server.js<br>
├── static 静态资源<br>

## 路由基础
### Link组件--next/link
- 进行前端路由跳转
- 需要指定渲染内容
```
import Link from 'next/link';
import {Button} from "antd";

// Link标签内只能有一个节点
export default () => (
    <Link href="/a">
        <Button type="primary">to a</Button>
    </Link>
)
```

### Router模块--next/router

```
import Link from 'next/link';
import Router from 'next/router';
import {Button} from "antd";

export default () => {
    function goToA(){
        Router.push('/a'); //点击触发跳转事件
    }
    return (
        <>
            <Link href="/a">
                <Button type="primary">to a</Button>
            </Link>
            <Button type="primary" onClick={goToA}>to a</Button>
        </>
    )
    
}
```
### 动态路由-- 根据不同的路由传参，展示不同参数对应的页面（只支持query传参）

```
import Link from 'next/link';
import Router from 'next/router';
import {Button} from "antd";

export default () => {
    function goToA(){
        Router.push({ //对象传参
            pathname:'/a',
            query:{
                id:222
            }
        });
    }
    return (
        <>
            <Link href="/a?id=111"> //路径传参
                <Button type="primary">to a</Button>
            </Link>
            <Button type="primary" onClick={goToA}>to a</Button>
        </>
    )
    
}
```
```
# 获取路由参数 -- next/router
import { withRouter } from 'next/router';

const A  = ({router}) => <span>路由参数为: {router.query.id}</span>
export default withRouter(A);
```

### 路由映射
```
# Router 里传第二个参数为要替换的路径
Router.push({
            pathname:'/a',
            query:{
                id:222
            }
},'/a/222');

# 通过as来替换
<Link href="/a?id=111" as="/a/111">
    <Button type="primary">to a</Button>
</Link>
```
- 重新刷新会导致整个页面404，因为刷新意味着请求服务器，需要在服务器进行路由定向操作
```
const Koa  = require('koa');
const next = require('next');
const Router = require('koa-router'); //1

const dev = process.env.NODE_ENV !== "prodution";
const app = next({dev});
const handle = app.getRequestHandler(); //处理http响应

//页面编译完成后才响应请求
app.prepare().then(()=>{
    const server = new Koa();
    const router = new Router(); //2

    # 利用koa-router来重定向操作
    router.get('/a/:id', async (ctx)=>{ //3
        const id = ctx.params.id;
        await handle(ctx.req,ctx.res,{
            pathname:'/a',
            query:{
                id
            }
        });
        ctx.respond = false ;
    })
    server.use(router.routes()); //4
    server.listen(3000,()=>{
        console.log("koa server listening on 3000");
    })
})

# 启动服务
node ./server.js
```

### Router的钩子
#### history模式变化
```
import Link from 'next/link';
import Router from 'next/router';
import {Button} from "antd";

export default () => {
    function goToA(){
        Router.push({
            pathname:'/a',
            query:{
                id:222
            }
        },'/a/222');
    }
    return (
        <>
            <Link href="/a?id=111" as="/a/111">
                <Button type="primary">to a</Button>
            </Link>
            <Button type="primary" onClick={goToA}>to a</Button>
        </>
    )
    
}
// 所有钩子
const events = [
    'beforeHistoryChange',
    'routeChangeStart',
    'routeChangeComplete',
    'routeChangeError',
    'hashChangeStart',
    'hashChangeComplete'
];
function makeEvent(type){
    return (...args) => {
        console.log(type,...args); //打印
    }
}
//监听路由变化
events.forEach(event=>{
    Router.events.on(event,makeEvent(event));
})

```
```
# a.js
import { withRouter } from 'next/router';

const A  = ({router}) => <span>路由参数为: {router.query.id}</span>
export default withRouter(A);

```
`yarn dev` <br>
`http://localhost:3000/a/111` <br>

routeChangeStart /a/111 <br>
beforeHistoryChange /a/111<br>
routeChangeComplete /a/111

#### hash模式变化
```
import { withRouter } from 'next/router';
import Link from 'next/link';

const A  = ({router}) => <Link href="#aaa"><a>路由参数为: {router.query.id}</a></Link>
export default withRouter(A);
```
`yarn dev` <br>
`http://localhost:3000/a/111` <br>

hashChangeStart /a/111#aaa<br>
hashChangeComplete /a/111#aaa

## Nextjs获取数据--getInitialProps

- 组件静态方法
- 获取初始化数据
- 只针对pages的页面组件生效
- 解决SSR 客户端和服务端 数据同步问题
- 服务端获取数据----> getInitialProps -----> 组件的props ---> View UI
```
import { withRouter } from 'next/router';
import Link from 'next/link';

// name 就是从getInitialProps中获取的props
const A  = ({router,name}) => <Link href="#aaa"><a>路由参数为: {router.query.id} {name}</a></Link>
# 同步的值
A.getInitialProps = () =>{
    return {
        name:'Sync data'
    }
}
export default withRouter(A);
```
```
# 异步的值
A.getInitialProps = async () => {
    const promise = new Promise((resolve)=>{
        setTimeout(()=>{
            resolve({
                name:'async data'
            })
        },2000)
    })
    return await promise;
}
```

## 自定义APP
- 固定Layout
- 保持一些公用的状态
- 给页面传入一些自定义数据
- 自定义错误处理

```
# _app.js

import App,{ Container }from 'next/app';
import 'antd/dist/antd.css';
import Layout from '../components/Layout';

class MyApp extends App {
    // 初始化组件的数据 并传入props
    static async getInitialProps({Component}){
        let pageProps
        if(Component.getInitialProps){
            pageProps = await Component.getInitialProps();
        }
        return {
            pageProps 
        }
    }
    render(){
        const {Component,pageProps} = this.props;
        return (
             <Container>
                 <Layout> //Layout 可以套在最外层
                    <Component {...pageProps}/> // 下发参数pageProps
                 </Layout>
             </Container>
        )
    }
}

export default MyApp;
```
```
# Layout.jsx

import Link from 'next/link';
import {Button} from "antd";

export default ({children}) => (
   <>
     <header>
            <Link href="/a?id=111" as="/a/111">
                <Button type="primary">AAAA</Button>
            </Link>
            <Link href="/b">
                <Button type="primary">BBBB</Button>
            </Link>
    </header>
    { children }
   </>
)
```
