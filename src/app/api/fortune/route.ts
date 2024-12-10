//src/app/api/fortune/route.ts
import {app, handle} from '../_app'

const fortunes = [
  "A beautiful, smart, and loving person will be coming into your life.",
  "A dubious friend may be an enemy in camouflage.",
  "A faithful friend is a strong defense.",
  "A fresh start will put you on your way.",
  "A golden egg of opportunity falls into your lap this month.",
]

app.get('/api/fortune', (c) => {
  const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)]
  return c.json({
    fortune: randomFortune,
    timestamp: new Date().toISOString()
  })
})


export const GET = handle(app)