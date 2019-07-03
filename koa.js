const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

router.get('/test',(ctx)=>{
    ctx.body = "Hello koa router!!!"
})
router.get('/test/:id',(ctx)=>{
    ctx.body = { success:true };
    ctx.set('Content-Type','application/json');
})
app.use(async (ctx,next)=>{
    await next(); 
});
app.use(router.routes());

app.listen(3001,()=>{
    console.log('server is running on 3001')
})