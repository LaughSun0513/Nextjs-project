const Koa  = require('koa');
const next = require('next');
const Router = require('koa-router');

const dev = process.env.NODE_ENV !== "prodution";
const app = next({dev});
const handle = app.getRequestHandler(); //处理http响应

//页面编译完成后才响应请求
app.prepare().then(()=>{
    const server = new Koa();
    const router = new Router();
    // server.use(async (ctx,next)=>{
    //     await handle(ctx.req,ctx.res);//处理请求
    //     ctx.respond = false ; //不使用Koa的respond来处理，使用原始的res
    //     await next();
    // })
    router.get('/a/:id', async (ctx)=>{
        const id = ctx.params.id;
        console.log("id====>",id);
        await handle(ctx.req,ctx.res,{
            pathname:'/a',
            query:{
                id
            }
        });
        ctx.respond = false ;
    })
    server.use(router.routes());
    server.listen(3001,()=>{
        console.log("koa server listening on 3001");
    })
})

