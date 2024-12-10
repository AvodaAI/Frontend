// src/app/api/_app.ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

type Variables = { // Example
  user: any 
}

const app = new Hono<{ Variables: Variables }>()


export { app, handle }