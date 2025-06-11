import '@/app/globals.css'
import AdminHeader from '@/components/admin/layout/header'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-slate-950 text-white">
        <AdminHeader />
        {children}
      </body>
    </html>
  )
}
