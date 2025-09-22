# Search Setup with Meilisearch

This project now includes fast, typo-tolerant search powered by Meilisearch. Here's how to set it up and use it.

## Prerequisites

1. **Install Meilisearch** (choose one method):

### Option A: Using Docker (Recommended)
```bash
docker run -it --rm -p 7700:7700 -v $(pwd)/meili_data:/meili_data getmeili/meilisearch:latest meilisearch --master-key="masterKey" --env="development"
```

### Option B: Using Homebrew (macOS)
```bash
brew install meilisearch
meilisearch --master-key="masterKey" --env="development"
```

### Option C: Download Binary
1. Go to [Meilisearch releases](https://github.com/meilisearch/meilisearch/releases)
2. Download the appropriate binary for your OS
3. Run: `./meilisearch --master-key="masterKey" --env="development"`

## Setup Steps

1. **Start Meilisearch** (using one of the methods above)

2. **Sync your existing listings to the search index**:
   ```bash
   npm run search:sync
   ```

3. **Start your Next.js development server**:
   ```bash
   npm run dev
   ```

## Features

### 🔍 **Enhanced Search Bar**
- **Real-time autocomplete** as you type
- **Keyboard navigation** (arrow keys, enter, escape)
- **Highlighted search results** with company logos
- **Smart suggestions** showing company name, description, location, and tags
- **Fallback to database search** if Meilisearch is unavailable

### ⚡ **Fast Search Performance**
- **Typo tolerance** - finds results even with spelling mistakes
- **Fuzzy matching** - understands partial matches
- **Instant results** - typically under 50ms response time
- **Scalable** - handles thousands of listings efficiently

### 🎯 **Search Capabilities**
- **Text search** across company names, descriptions, sectors, industries, locations
- **Filtering** by sector, state, tags, amount seeking
- **Sorting** by relevance, views, creation date, name
- **Faceted search** for advanced filtering

## API Endpoints

### Search API
```
GET /api/search?q=query&limit=20&offset=0&filters=sector="Technology"&sort=views:desc
```

### Companies API (Enhanced)
The existing `/api/companies` endpoint now uses Meilisearch when available, with automatic fallback to database search.

## Configuration

Environment variables in `.env.local`:
```env
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_API_KEY=masterKey
```

## Search Index Structure

The search index includes these fields:
- `id` - Company ID
- `name` - Company name (searchable)
- `description` - Company description (searchable)
- `sector` - Business sector (searchable, filterable)
- `industry` - Industry (searchable, filterable)
- `subIndustry` - Sub-industry (searchable)
- `suburb` - Location suburb (searchable, filterable)
- `state` - Location state (searchable, filterable)
- `tags` - Company tags (searchable, filterable)
- `status` - Listing status (filterable)
- `amountSeeking` - Funding amount (filterable)
- `views` - View count (sortable)
- `createdAt` - Creation date (sortable)
- `slug` - URL slug
- `logoUrl` - Company logo
- `photos` - Company photos

## Automatic Sync

The search index automatically syncs when:
- New listings are created (if status is 'published')
- Listings are updated via the edit form
- You run the manual sync command

## Manual Operations

### Sync all listings to search index:
```bash
npm run search:sync
```

### Check Meilisearch status:
```bash
curl http://127.0.0.1:7700/health
```

### View search index stats:
```bash
curl http://127.0.0.1:7700/indexes/listings/stats
```

## Troubleshooting

### Search not working?
1. Check if Meilisearch is running: `curl http://127.0.0.1:7700/health`
2. Verify environment variables in `.env.local`
3. Run the sync command: `npm run search:sync`
4. Check browser console for errors

### Slow search results?
- Meilisearch should be very fast (< 50ms)
- If using database fallback, check database performance
- Ensure Meilisearch has enough memory allocated

### Missing search results?
- Run `npm run search:sync` to sync latest data
- Check if listings have `status: 'published'`
- Verify the search index has data: `curl http://127.0.0.1:7700/indexes/listings/stats`

## Production Considerations

For production deployment:

1. **Change the master key** to a secure random string
2. **Use environment variables** for configuration
3. **Set up proper backup** for the Meilisearch data directory
4. **Monitor performance** and adjust resources as needed
5. **Consider using Meilisearch Cloud** for managed hosting

## Development vs Production

- **Development**: Uses local Meilisearch instance with `masterKey`
- **Production**: Should use secure API keys and proper hosting
- **Fallback**: Always falls back to database search if Meilisearch is unavailable

This ensures your search functionality is robust and always available, even if the search service is temporarily down.
