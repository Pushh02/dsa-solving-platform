"use client"

import { RecoilRoot } from "recoil";

const Layout = ({children}: {children: React.ReactNode}) => {
    return ( 
        <RecoilRoot>
            {children}
        </RecoilRoot>
     );
}
 
export default Layout;