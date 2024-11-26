import React from 'react'
import whyDidYouRender from '@welldone-software/why-did-you-render'

// код выполняется только в режиме разработки
// и только на клиенте
if (process.env.NODE_ENV === 'development' && typeof document !== 'undefined') {
  whyDidYouRender(React, {
    trackAllPureComponents: true
  })
}

export {}