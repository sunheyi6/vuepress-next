import type { PageData } from '@vuepress/shared'
import type { ComponentOptions } from 'vue'
import type { PageInfoKey } from '../pagesMapKey.js'

declare module '@internal/pagesMap' {
  export interface PageInfo<PageMeta = Record<string, unknown>> {
    [PageInfoKey.component]: ComponentOptions
    [PageInfoKey.data]: () => Promise<PageData>
    [PageInfoKey.meta]: PageMeta
  }

  export type PagesMap<PageMeta = Record<string, unknown>> = Map<
    string,
    PageInfo<PageMeta>
  >

  export const pagesMap: PagesMap
}
