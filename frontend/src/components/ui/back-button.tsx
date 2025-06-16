'use client'

import type React from 'react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

type BackButtonProps = {
  /**
   * ボタンの動作バリアント
   * - 'back': 一つ前の画面に戻る
   * - 'smart': 履歴があれば戻る、なければトップへ
   * - 'custom': 任意のパスへ遷移
   */
  variant?: 'back' | 'smart' | 'custom'

  /** ボタンの表示テキスト */
  children?: React.ReactNode

  /** smartのときのホームパス（履歴がないときに使う） */
  homePath?: string

  /** customのときの遷移先パス */
  customPath?: string

  /** 追加のCSSクラス */
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function BackButton({
  variant = 'back',
  children,
  homePath = '/admin',
  customPath = '/',
  className,
  ...props
}: BackButtonProps) {
  const router = useRouter()
  const [hasHistory, setHasHistory] = useState(false)

  useEffect(() => {
    setHasHistory(window.history.length > 1 || !!document.referrer)
  }, [])

  const handleClick = () => {
    switch (variant) {
      case 'back':
        router.back()
        break
      case 'smart':
        if (hasHistory) {
          router.back()
        } else {
          router.push(homePath)
        }
        break
      case 'custom':
        router.push(customPath)
        break
    }
  }

  const getButtonContent = () => {
    switch (variant) {
      case 'back':
        return (
          <>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {children || '戻る'}
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
      case 'custom':
        return (
          <>
            <Home className="mr-2 h-4 w-4" />
            {children || 'ページへ'}
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
