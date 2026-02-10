const express = require("express")
const mongoose = require("mongoose")
const { nanoid } = require("nanoid")
require("dotenv").config()

const app = express()
app.use(express.json())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err))

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortId: { type: String, unique: true },
  clicks: { type: Number, default: 0 }
})

const Url = mongoose.model("Url", urlSchema)

app.get("/", (req, res) => {
  res.send("URL Shortener API is running")
})

app.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body
    if (!originalUrl) {
      return res.status(400).json({ error: "URL required" })
    }

    const shortId = nanoid(7)
    await Url.create({ originalUrl, shortId })

    res.json({
      shortUrl: `${process.env.BASE_URL}/${shortId}`
    })
  } catch {
    res.status(500).json({ error: "Server error" })
  }
})

app.get("/stats/:shortId", async (req, res) => {
  const url = await Url.findOne({ shortId: req.params.shortId })
  if (!url) return res.status(404).json({ error: "Not found" })

  res.json({
    originalUrl: url.originalUrl,
    clicks: url.clicks
  })
})

app.get("/:shortId", async (req, res) => {
  const url = await Url.findOne({ shortId: req.params.shortId })
  if (!url) return res.status(404).json({ error: "Not found" })

  url.clicks++
  await url.save()

  res.redirect(url.originalUrl)
})

app.listen(process.env.PORT || 5002, () =>
  console.log(`Server running on port ${process.env.PORT || 5002}`)
)
