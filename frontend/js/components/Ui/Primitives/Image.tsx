import * as React from 'react'
import { Box, BoxProps } from '@cap-collectif/ui'
import config, { baseUrl } from '~/config'
import AppBox from './AppBox'

export type ImageProps = BoxProps & {
  readonly src?: string
  readonly useDs?: boolean
  readonly alt?: string
  readonly sizes?: string
}

const Image = ({ src, alt, useDs = false, ...props }: ImageProps) => {
  if (!src) {
    return null
  }

  if (useDs) {
    return !config.isDevOrTest ? (
      <Box
        as="img"
        loading="lazy"
        srcSet={`
        ${baseUrl}/cdn-cgi/image/width=320,format=auto/${src}   320w,
         ${baseUrl}/cdn-cgi/image/width=640,format=auto/${src}   640w,
         ${baseUrl}/cdn-cgi/image/width=960,format=auto/${src}   960w,
         ${baseUrl}/cdn-cgi/image/width=1280,format=auto/${src} 1280w,
         ${baseUrl}/cdn-cgi/image/width=2560,format=auto/${src} 2560w,
         ${baseUrl}/cdn-cgi/image/dpr=2,format=auto/${src} 2x,
         ${baseUrl}/cdn-cgi/image/dpr=3,format=auto/${src} 3x,
         `}
        sizes="(max-width: 320px) 320px,
        (max-width: 640px) 640px,
        (max-width: 960px) 960px,
        (max-width: 1280px) 1280px,
        (max-width: 2560px) 2560px,"
        alt={alt}
        {...props}
      />
    ) : (
      <Box as="img" loading="lazy" src={src} alt={alt} {...props} />
    )
  }

  return !config.isDevOrTest ? (
    // @ts-ignore let's progressively remove old appbox for image
    <AppBox
      as="img"
      loading="lazy"
      srcSet={`
        ${baseUrl}/cdn-cgi/image/width=320,format=auto/${src}   320w,
         ${baseUrl}/cdn-cgi/image/width=640,format=auto/${src}   640w,
         ${baseUrl}/cdn-cgi/image/width=960,format=auto/${src}   960w,
         ${baseUrl}/cdn-cgi/image/width=1280,format=auto/${src} 1280w,
         ${baseUrl}/cdn-cgi/image/width=2560,format=auto/${src} 2560w,
         ${baseUrl}/cdn-cgi/image/dpr=2,format=auto/${src} 2x,
         ${baseUrl}/cdn-cgi/image/dpr=3,format=auto/${src} 3x,
         `}
      sizes="(max-width: 320px) 320px,
        (max-width: 640px) 640px,
        (max-width: 960px) 960px,
        (max-width: 1280px) 1280px,
        (max-width: 2560px) 2560px,"
      alt={alt}
      {...props}
    />
  ) : (
    // @ts-ignore let's progressively remove old appbox for image
    <AppBox as="img" loading="lazy" src={src} alt={alt} {...props} />
  )
}

export default Image
