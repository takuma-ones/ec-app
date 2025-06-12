import UserHeader from '@/components/user/layout/header'

export default function Userlayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <UserHeader />
      {children}
    </div>
  )
}
