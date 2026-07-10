import { onMount } from 'solid-js'
import { Outlet } from '@tanstack/solid-router'
import { loadNotifications } from '~/features/notifications/store'
import Topbar from './Topbar'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'

export default function DashboardShell() {
  onMount(() => {
    // Seed the notification bell once the app shell mounts.
    void loadNotifications()
  })

  return (
    <div class="min-h-screen">
      <Topbar />
      <div class="mx-auto flex max-w-[1600px] gap-5 px-3 py-5 sm:px-4">
        <LeftSidebar />
        <main class="min-w-0 flex-1">
          <div class="mx-auto w-full max-w-[42rem]">
            <Outlet />
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  )
}
