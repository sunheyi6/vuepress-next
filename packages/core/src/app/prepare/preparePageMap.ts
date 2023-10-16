import type { App } from '../../types/index.js'

const enum PageInfoKey {
  component = 'c',
  data = 'd',
  meta = 'm',
}

/**
 * Generate page map temp file
 */
export const preparePagesMap = async (app: App): Promise<void> => {
  // generate page component map file
  const content = `\
import { defineAsyncComponent } from 'vue'

export const pagesMap = new Map([
  ${app.pages
    .map(
      ({
        meta,
        path,
        dataFilePath,
        dataFileChunkName,
        componentFilePath,
        componentFileChunkName,
      }) => `
  [${JSON.stringify(path)}, {\
 ${PageInfoKey.component}: defineAsyncComponent(() => import(${
   componentFileChunkName
     ? `/* webpackChunkName: "${componentFileChunkName}" */`
     : ''
 }${JSON.stringify(componentFilePath)})),\
 ${PageInfoKey.data}: () => import(${
   dataFileChunkName ? `/* webpackChunkName: "${dataFileChunkName}" */` : ''
 }${JSON.stringify(dataFilePath)}).then(({ data }) => data),\
${PageInfoKey.meta}: ${JSON.stringify(meta)}
    }],`,
    )
    .join('\n  ')}
])
`

  await app.writeTemp('internal/pagesMap.js', content)
}
