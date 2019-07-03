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
# npm版本包版本号

ˉ^aa.bb.cc 
^ 代表自动安装当前大版本号下最新的
aa 大版本号，一般只有breaking changes的时候才更新
bb 一般是修复较大的bug，
cc 细微的修改
----------------------------
# 初始化项目
- 手动
- create-next-app
`npm i -g create-next-app`
`npx create-next-app [project-name]` | `yarn create next-app [project-name]`

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
# Next作为Koa中间件使用
## 服务器
- Nextjs自身带有服务器，只处理SSR渲染(内部启动的Node服务，并通过服务返回页面html字符串)
- 处理HTTP请求，并根据请求数据返回相应的内容（Next做不到）
- 根据域名之类的HOST来定位服务器

## Next无法处理服务端
- 数据接口
- 数据库连接
- session状态

## 为什么使用Koa
- 轻量级Nodejs服务端框架
- 项目相对轻量，不需要很多集成功能（重量级可使用Eggjs）
- 易扩展，编程模式符合JS特性

## 集成Next到Koa中
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
# Koa使用
## 中间件机制 app.use

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

## ctx对象
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
## koa-router
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
## ctx.request、ctx.response、ctx.req、ctx.res的关系

- ctx.request - Koa request Object
- ctx.response -  Koa response Object
- ctx.req  -  Node request Object
- ctx.res - Node response Object

