# Design Therapist

A web app that helps you decorate a room with AI. Complete a short wizard about your space and style, then receive a custom room visualization and shopping list.

## Features

- **Room intake** — room type, size, and constraints
- **Style inspiration** — search Unsplash for room photos, pick up to 3, and set budget
- **AI-generated design** — room image (GPT Image) plus written design summary
- **Shopping list** — categorized items with optional price estimates

## Prerequisites

- Node.js 18+
- An [OpenAI API key](https://platform.openai.com/api-keys) with access to GPT-4o and GPT Image (`gpt-image-1`)
- An [Unsplash access key](https://unsplash.com/developers) for style inspiration search

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and add your API key:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set `OPENAI_API_KEY` and `UNSPLASH_ACCESS_KEY`.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## How it works

1. User describes their room (type, size, constraints)
2. User picks inspiration photos from Unsplash and sets budget
3. The app calls GPT-4o to create a design brief, GPT Image to generate a room image, and GPT-4o again to produce a shopping list
4. Results are shown in a single session — no accounts required

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — run ESLint

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key |
| `UNSPLASH_ACCESS_KEY` | Yes | Your Unsplash API access key |

## Notes

- Generation typically takes 20–45 seconds
- Shopping list items are descriptive recommendations, not live product links
- Designs are not persisted between sessions
