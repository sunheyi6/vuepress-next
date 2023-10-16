import { pagesMap } from '@internal/pagesMap'
import { removeEndingSlash } from '@vuepress/shared'
import type { Router } from 'vue-router'
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  START_LOCATION,
} from 'vue-router'
import { Vuepress } from './components/Vuepress.js'
import type { PageData } from './composables/index.js'
import { resolvers } from './resolvers.js'
import { PageInfoKey } from './types/index.js'

/**
 * - use `createWebHistory` in dev mode and build mode client bundle
 * - use `createMemoryHistory` in build mode server bundle
 */
const historyCreator = __VUEPRESS_SSR__ ? createMemoryHistory : createWebHistory

/**
 * Create vue-router instance
 */
export const createVueRouter = (): Router => {
  const router = createRouter({
    // it might be an issue of vue-router that have to remove the ending slash
    history: historyCreator(removeEndingSlash(__VUEPRESS_BASE__)),
    routes: [
      {
        name: 'vuepress-route',
        path: '/:catchAll(.*)',
        component: Vuepress,
      },
    ],
    scrollBehavior: (to, _from, savedPosition) => {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash }
      return { top: 0 }
    },
  })

  // ensure page data and page component have been loaded before resolving the route,
  // and save page data to route meta
  router.beforeResolve(async (to, from) => {
    if (to.path !== from.path || from === START_LOCATION) {
      const pageInfo = resolvers.resolvePageInfo(pagesMap, to.path)

      // TODO: Remove in stable version
      // write to meta into the record
      to.meta = pageInfo[PageInfoKey.meta]
      ;[to.meta._data] = await Promise.all([
        resolvers.resolvePageData(pageInfo, to.path),
        pageInfo[PageInfoKey.component]?.__asyncLoader(),
      ])
    }
  })

  return router
}

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Store page data to route meta
     *
     * @internal only for internal use
     */
    _data?: PageData
  }
}
