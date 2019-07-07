import Router from 'next/router';


export default () => <span>Index</span>

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
        console.log(type,...args);
    }
}
events.forEach(event=>{
    Router.events.on(event,makeEvent(event));
})
