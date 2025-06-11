import "@/app/globals.css";
import Header from '@/components/admin/layout/header'

export default async function RootLayout({ children }: { children: React.ReactNode }) {


  return (
    <html lang="ja">
      <body className="bg-slate-950 text-white">
        <Header />
        {children}
      </body>
    </html>
  )
}
