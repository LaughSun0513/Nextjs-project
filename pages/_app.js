import App,{ Container }from 'next/app';
import 'antd/dist/antd.css';
import Layout from '../components/Layout';

class MyApp extends App {
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
                 <Layout>
                    <Component {...pageProps}/>
                 </Layout>
             </Container>
        )
    }
}

export default MyApp;