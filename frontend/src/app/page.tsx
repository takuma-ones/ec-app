import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">ようこそ ファッションECサイト へ</h1>

      <Link href="/user/products">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          商品一覧を見る
        </button>
      </Link>

      <Link href="/user/login">
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          ユーザーログイン
        </button>
      </Link>

      <Link href="/admin/login">
        <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800">
          管理者ログイン
        </button>
      </Link>
    </div>
  )
}
