# The Urlist - Quick Start Guide

## ⚡ Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Initialize database schema
psql -U root -d postdata -f src/db/init.sql

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

## 📝 How to Use

1. **Create a List** - Click "Create a List" button on home page
2. **Add URLs** - Enter URLs with optional titles
3. **Manage** - Edit or delete URLs as needed
4. **Publish** - Make your list publicly accessible
5. **Share** - Copy and share the link with others

## 🗄️ Database Quick Reference

**Tables:**
- `url_lists` - Stores list metadata (title, description, custom URL, published status)
- `list_items` - Stores URLs within each list

**Initialize Schema:**
```bash
psql -U root -d postdata -f src/db/init.sql
```

## 🔧 Development Commands

```bash
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Build for production
npm run preview    # Preview production build
```

## 📖 API Endpoints Quick Reference

```
POST   /api/lists                    # Create list
GET    /api/lists/:id                # Get list with items
PUT    /api/lists/:id                # Update/publish list
DELETE /api/lists/:id                # Delete list

POST   /api/lists/:id/items          # Add URL to list
PUT    /api/lists/:id/items/:itemId  # Edit URL
DELETE /api/lists/:id/items/:itemId  # Delete URL

GET    /api/share/:customUrl         # View published list
```

## 🌐 Example Usage Flow

```
1. Create List
   POST /api/lists
   {"title": "My Resources", "customUrl": "my-resources"}
   → Returns: {success: true, list: {id: 1, ...}}

2. Add URLs
   POST /api/lists/1/items
   {"url": "https://example.com", "title": "Example"}
   → Returns: {success: true, item: {...}}

3. Publish List
   PUT /api/lists/1
   {"action": "publish"}
   → Makes list publicly accessible

4. Share URL
   Available at: https://yoursite.com/my-resources
```

## 🔌 Environment Setup

`.env` file (already configured):
```
DATABASE_URL=postgresql://root:password@localhost:5432/postdata
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postdata
DB_USER=root
DB_PASSWORD=password
```

## ⚠️ Troubleshooting

**Database connection error?**
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify database exists: `psql -l | grep postdata`
- Run init script: `psql -U root -d postdata -f src/db/init.sql`

**Build error?**
```bash
rm -rf node_modules .astro dist
npm install
npm run build
```

**Port 3000 already in use?**
```bash
npm run dev -- --port 3001
```

## 📚 Additional Resources

- [Astro Docs](https://docs.astro.build)
- [React Docs](https://react.dev)  
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [pg (Node.js PostgreSQL client)](https://node-postgres.com)

---

**Ready to go!** Run `npm run dev` and start creating lists! 🚀
