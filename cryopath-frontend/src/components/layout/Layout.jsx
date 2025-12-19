import Header from "./header/Header"
import Footer from "./footer/Footer"

import "./Layout.css"

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <main className="layout__content">{children}</main>
            <Footer />
        </div>
    )
}

export default Layout