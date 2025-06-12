'use client'

import type React from 'react'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

type BackButtonProps = {
  /**
   * ボタンの動作バリアント
   * - 'back': 一つ前の画面に戻る (router.back())
   * - 'dashboard': 常にダッシュボードに戻る
   * - 'smart': 履歴がある場合は戻る、ない場合はトップページへ
   */
  variant?: 'back' | 'dashboard' | 'smart'
  /**
   * ボタンのテキスト
   */
  children?: React.ReactNode
  /**
   * ダッシュボードのパス
   */
  dashboardPath?: string
  /**
   * トップページのパス
   */
  homePath?: string
  /**
   * 追加のCSSクラス
   */
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

/**
 * 戻るボタンコンポーネント
 *
 * 使用例:
 * ```tsx
 * // 一つ前に戻る
 * <BackButton variant="back">戻る</BackButton>
 *
 * // ダッシュボードに戻る
 * <BackButton variant="dashboard">ダッシュボードへ</BackButton>
 *
 * // スマート戻る（履歴がなければトップへ）
 * <BackButton variant="smart">戻る</BackButton>
 * ```
 */
export function BackButton({
  variant = 'back',
  children,
  dashboardPath = '/admin/(private)/dashboard',
  homePath = '/admin',
  className,
  ...props
}: BackButtonProps) {
  const router = useRouter()
  const [hasHistory, setHasHistory] = useState(false)

  // マウント時に履歴があるかチェック
  useEffect(() => {
    // window.history.lengthが2以上なら履歴がある
    // または document.referrer が存在する場合も履歴あり
    setHasHistory(window.history.length > 1 || !!document.referrer)
  }, [])

  const handleClick = () => {
    switch (variant) {
      case 'back':
        router.back()
        break
      case 'dashboard':
        router.push(dashboardPath)
        break
      case 'smart':
        if (hasHistory) {
          router.back()
        } else {
          router.push(homePath)
        }
        break
    }
  }

  // バリアントに応じたアイコンとテキストを設定
  const getButtonContent = () => {
    switch (variant) {
      case 'back':
        return (
          <>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {children || '戻る'}
          </>
        )
      case 'dashboard':
        return (
          <>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            {children || 'ダッシュボードへ'}
          </>
        )
      case 'smart':
        return (
          <>
            {hasHistory ? (
              <ArrowLeft className="mr-2 h-4 w-4" />
            ) : (
              <Home className="mr-2 h-4 w-4" />
            )}
            {children || (hasHistory ? '戻る' : 'トップへ')}
          </>
        )
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      className={cn('flex items-center', className)}
      {...props}
    >
      {getButtonContent()}
    </Button>
  )
}
