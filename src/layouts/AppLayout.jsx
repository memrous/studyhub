import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAppState } from '../context/AppStateContext'

// Desktop Components
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

// Mobile Components
import MobileHeader from '../components/MobileHeader'
import MobileBottomNav from '../components/MobileBottomNav'
import MobileSidebarDrawer from '../components/MobileSidebarDrawer'

/**
 * AppLayout
 *
 * Renders the persistent desktop sidebar + header and the mobile
 * bottom nav + drawer. Page content is injected via <Outlet />.
 *
 * Replaces the inline layout JSX that was previously in App.jsx.
 */
const AppLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-on-background font-inter">

      {/* ========================================== */}
      {/* DESKTOP LAYOUT                            */}
      {/* ========================================== */}
      <div className="hidden lg:flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <Header />

          <main className="flex-1 overflow-y-auto bg-white p-8">
            <div className="max-w-[1600px] w-full mx-auto flex flex-col gap-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* ========================================== */}
      {/* MOBILE LAYOUT                             */}
      {/* ========================================== */}
      <div className="block lg:hidden min-h-screen bg-background pb-20 relative">
        <MobileHeader onMenuClick={() => setIsDrawerOpen(true)} />

        <main className="p-4 flex flex-col gap-6">
          <Outlet />
        </main>

        {/* Mobile Sticky Tab Footer */}
        <MobileBottomNav />

        {/* Mobile Sidebar Navigation Drawer */}
        <MobileSidebarDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </div>

    </div>
  )
}

export default AppLayout
