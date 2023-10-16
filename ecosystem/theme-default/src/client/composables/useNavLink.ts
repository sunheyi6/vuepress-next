import { useRouter } from 'vue-router'
import type { NavLink } from '../../shared/index.js'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

/**
 * Resolve NavLink props from string
 *
 * @example
 * - Input: '/README.md'
 * - Output: { text: 'Home', link: '/' }
 */
export const useNavLink = (item: string): NavLink => {
  const router = useRouter()
  const route = router.resolve(encodeURI(item))

  // the route path of vue-router is url-encoded, and we expect users are using
  // non-url-encoded string in theme config, so we need to url-encode it first to
  // resolve the route correctly
  return {
    text: route.meta.title || item,
    // TODO: FIXME
    link: route.name === '404' ? item : route.fullPath,
  }
}
