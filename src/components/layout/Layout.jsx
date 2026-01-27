import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'
import Footer from './Footer'
import BackgroundOrbs from './BackgroundOrbs'

function Layout() {
  return (
    <>
      <BackgroundOrbs />
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout
