import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 絶対URLを生成する
 * @param path - 必須。相対パス (例: /images/sample.jpg)
 * @returns 絶対URL (例: https://example.com/images/sample.jpg)
 */
export const buildImageUrl = (path: string | undefined) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL is not defined')
  }

  if (!path) {
    return '/placeholder.svg'
  }

  return new URL(path, baseUrl).toString()
}
