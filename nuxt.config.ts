import { defineNuxtConfig } from 'nuxt'

// Refer to: https://github.com/nuxt/content/issues/106#issuecomment-1002820342
// copy all other type of files except .md from content folder to public folder
// so all the assets can link to inside the markdown file by relative path
const fs = require('fs')
const path = require('path')
const copyContentImages = (src, dest, ignore = []) => {
  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = exists && stats.isDirectory()
  if (isDirectory) {
    if (!fs.existsSync(dest) || !fs.statSync(src).isDirectory()) {
      fs.mkdirSync(dest)
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyContentImages(
        path.join(src, childItemName),
        path.join(dest, childItemName),
        ignore
      )
    })
  } else {
    const ext = path.extname(src)
    if (!ignore.includes(ext)) {
      fs.copyFileSync(src, dest)
    }
  }
}
copyContentImages('content', 'public', ['.md'])

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css'
        }
      ],
      style: [
        {
          type: 'text/css',
          children: 'html, body { scroll-behavior: smooth }'
        },
        {
          type: 'text/css',
          children: 'body { overflow: overlay }'
        }
      ]
    }
  },
  typescript: {
    shim: false
  },
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],
  // https://color-mode.nuxtjs.org
  colorMode: {
    classSuffix: ''
  },
  // https://content.nuxtjs.org
  content: {
    // navigation: {
    // fields: ['navTitle', 'description', 'cover', 'series', 'seriesOrder']
    // },
    highlight: {
      // See the available themes on https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-theme
      theme: 'one-dark-pro',
      preload: ['diff', 'html', 'css', 'ts', 'js', 'vue', 'python']
    },
    markdown: {
      toc: {
        depth: 5,
        searchDepth: 5
      },
      remarkPlugins: ['remark-math'],
      rehypePlugins: {
        'rehype-katex': {
          output: 'htmlAndMathml'
        }
      }
    }
  }
})
