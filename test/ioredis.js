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