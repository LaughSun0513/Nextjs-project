import { withRouter } from 'next/router';
import Link from 'next/link';

const A  = ({router,name}) => <Link href="#aaa"><a>路由参数为: {router.query.id} {name}</a></Link>

A.getInitialProps = async () => {
    const promise = new Promise((resolve)=>{
        setTimeout(()=>{
            resolve({
                name:'async data'
            })
        },1000)
    })
    return await promise;
}
// A.getInitialProps = () =>{
//     return {
//         name:'Sync data'
//     }
// }
export default withRouter(A);