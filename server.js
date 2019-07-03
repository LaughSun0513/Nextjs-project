const Koa  = require('koa');
const next = require('next');

const dev = process.env.NODE_ENV !== "prodution";
const app = next({dev});
const handle = app.getRequestHandler(); //处理http响应

//页面编译完成后才响应请求
app.prepare().then(()=>{
    const server = new Koa();
    server.use(async (ctx,next)=>{
        await handle(ctx.req,ctx.res);//处理请求
        ctx.respond = false ;
    })

    server.listen(3000,()=>{
        console.log("koa server listening on 3000");
    })
})