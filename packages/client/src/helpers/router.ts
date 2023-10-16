import type { PageInfo } from '@internal/pagesMap'
import { pagesMap } from '@internal/pagesMap'

export const covertMdPathToHtml = (path: string): string =>
  path.endsWith('README.md')
    ? path.substring(0, path.length - 9) + 'index.html'
    : path.endsWith('.md')
    ? path.substring(0, path.length - 3) + '.html'
    : path

export const getPageInfo = (path: string): PageInfo | null =>
  // try original path
  pagesMap.get(path) ??
  // try encoded path
  pagesMap.get(encodeURI(path)) ??
  null

export const hasPage = (path: string) => {
  path = covertMdPathToHtml(path)
}
