// src/app/api/_app.ts
//MediumTODO: Add Sentry here?
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
// import { sentry } from '@hono/sentry'

type Variables = { // Example
  user: any 
}

const app = new Hono<{ Variables: Variables }>()


// app.use('*', sentry({
//   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
// }))

export { app, handle }