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