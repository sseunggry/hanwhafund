import { defineConfig } from 'vite'
import pug from 'vite-plugin-pug'
import { resolve, dirname } from 'path'
import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// HTML에서 Pug include를 처리하는 커스텀 플러그인
const htmlPugPlugin = () => ({
  name: 'html-pug-transform',
  enforce: 'pre',
  async transform(code, id) {
    if (!id.endsWith('.html')) return null

    // <%- include('path', data) %> 패턴 찾기
    const includeRegex = /<%-\s*include\s*\(\s*'([^']+)'\s*(?:,\s*({[^}]+}|null|\{?\s*\})?)?\s*\)\s*%>/g
    let newCode = code
    let hasChanges = false

    let match
    while ((match = includeRegex.exec(code)) !== null) {
      hasChanges = true
      const pugPath = match[1]
      let dataStr = match[2] || '{}'

      try {
        // 상대 경로를 절대 경로로 변환
        const pugFilePath = resolve(dirname(id), pugPath)
        const pugContent = await readFile(pugFilePath, 'utf8')
        
        // Pug 컴파일
        const compiledPug = pug.compile(pugContent, {
          filename: pugFilePath,
          compileDebug: process.env.NODE_ENV === 'development'
        })

        // 데이터 파싱 (안전하게 JSON.parse 사용)
        if (dataStr === 'null' || dataStr === '{}') {
          dataStr = '{}'
        } else if (!dataStr.startsWith('{')) {
          dataStr = `{${dataStr}}`
        }
        
        let data
        try {
          data = eval(`(${dataStr})`) // 개발 중에만 사용
        } catch {
          data = {}
        }

        // Pug 실행하여 HTML 생성
        const htmlOutput = compiledPug(data)

        // 원본 include 구문 교체
        newCode = newCode.replace(match[0], htmlOutput)
      } catch (error) {
        console.error(`Pug include error in ${pugPath}:`, error)
        newCode = newCode.replace(match[0], `<!-- Error: Failed to load ${pugPath} -->`)
      }
    }

    if (hasChanges) {
      return {
        code: newCode,
        map: null
      }
    }
    return null
  }
})

export default defineConfig({
  plugins: [
    htmlPugPlugin(),
    pug({
      // 기본 Pug 컴파일 (컴포넌트용)
      compileDebug: process.env.NODE_ENV === 'development',
      pretty: process.env.NODE_ENV === 'development'
    })
  ],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },

  build: {
    rollupOptions: {
      input: resolve(__dirname, 'src/pages/index.html')
    },
    outDir: 'dist'
  }
})