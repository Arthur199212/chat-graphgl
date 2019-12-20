import express from 'express'

const {
  HTTP_PORT = 4000,
  NODE_ENV = 'development',
  API_PORT = 3000,
  API_URI = '/graphql'
} = process.env

const IN_DEV = NODE_ENV === 'development'

;(async () => {
  try {
    const app = express()

    app.use(express.static('dist'))

    if (IN_DEV) {
      const { default: proxy } = await import('http-proxy-middleware')

      app.use(
        API_URI,
        proxy({
          target: `http://localhost:${API_PORT}`,
          changeOrigin: true
        })
      )
    }

    app.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Chat</title>
        </head>
        <body>
          <div id="app"></div>
          <script defer src="/main.js"></script>
        </body>
        </html>
      `)
    })

    app.listen(HTTP_PORT, () => console.log('\x1b[36m%s\x1b[0m', `Server is running at http://localhost:${HTTP_PORT}`))
  } catch (e) {
    console.error(e)
  }
})()
