// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 - ページが見つかりません</h1>
      <p className="mt-4 text-lg">お探しのページは存在しないか、移動された可能性があります。</p>
    </div>
  );
}
