import '@/app/globals.css'
import AdminHeader from '@/components/admin/layout/header'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AdminHeader />
      {children}
    </div>
  )
}
