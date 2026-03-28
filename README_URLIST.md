# The Urlist - URL Sharing Application

A modern web application for creating, organizing, and sharing collections of URLs. Built with Astro, React, PostgreSQL, and Tailwind CSS.

## Features

- ✅ Create and manage URL lists
- ✅ Add, edit, and delete URLs from lists
- ✅ Custom shareable URLs for your lists
- ✅ Publish lists to make them publicly accessible
- ✅ Copy share links easily
- ✅ Responsive design with Tailwind CSS
- ✅ Full-stack application with API endpoints
- ✅ PostgreSQL database for persistent storage

## Project Structure

```
src/
├── components/        # React components
│   ├── AddItemForm.tsx
│   ├── ListForm.tsx
│   ├── ListHeader.tsx
│   ├── ListItemCard.tsx
│   └── Welcome.astro
├── db/               # Database utilities
│   ├── db.ts         # Database connection and queries
│   └── init.sql      # Database schema initialization
├── layouts/
│   └── Layout.astro  # Main layout component
├── pages/
│   ├── index.astro   # Home page
│   ├── create.astro  # Create list page
│   ├── [customUrl].astro  # Public list view
│   ├── list/
│   │   └── [id].astro      # Edit list page
│   └── api/          # API endpoints
│       ├── lists.ts
│       ├── lists/[id].ts
│       ├── lists/[id]/items.ts
│       ├── lists/[id]/items/[itemId].ts
│       └── share/[customUrl].ts
├── styles/
│   └── global.css
assets/
package.json
astro.config.mjs
```

## Prerequisites

- Node.js >= 22.12.0
- PostgreSQL database
- npm

## Installation

1. **Clone or navigate to the project:**
   ```bash
   cd /home/sina/Workspace/jswork/density-dwarf
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Database Setup:**

   The database credentials are configured in `.env`:
   ```
   DATABASE_URL=postgresql://root:password@localhost:5432/postdata
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=postdata
   DB_USER=root
   DB_PASSWORD=password
   ```

   Initialize the database schema by running:
   ```bash
   psql -U root -d postdata -f src/db/init.sql
   ```

   Or copy and execute the contents of `src/db/init.sql` in your PostgreSQL client.

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## API Endpoints

### Lists

- **POST** `/api/lists` - Create a new list
  ```json
  {
    "title": "My List",
    "description": "Optional description",
    "customUrl": "my-list"  // Optional, auto-generated if not provided
  }
  ```

- **GET** `/api/lists/:id` - Get a specific list with its items
- **PUT** `/api/lists/:id` - Update a list or publish it
  ```json
  {
    "title": "Updated Title",
    "description": "Updated description",
    "action": "publish"  // Optional, to publish the list
  }
  ```
- **DELETE** `/api/lists/:id` - Delete a list

### List Items

- **GET** `/api/lists/:id/items` - Get all items in a list
- **POST** `/api/lists/:id/items` - Add a URL to a list
  ```json
  {
    "url": "https://example.com",
    "title": "Optional title"
  }
  ```
- **PUT** `/api/lists/:id/items/:itemId` - Update an item
  ```json
  {
    "url": "https://example.com",
    "title": "Updated title"
  }
  ```
- **DELETE** `/api/lists/:id/items/:itemId` - Delete an item

### Shared Lists

- **GET** `/api/share/:customUrl` - Get a published list by its custom URL

## Database Schema

### url_lists
```sql
CREATE TABLE url_lists (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  custom_url VARCHAR(100) UNIQUE NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### list_items
```sql
CREATE TABLE list_items (
  id SERIAL PRIMARY KEY,
  list_id INTEGER NOT NULL REFERENCES url_lists(id) ON DELETE CASCADE,
  url VARCHAR(2048) NOT NULL,
  title VARCHAR(255),
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Usage

### Creating a List

1. Go to the home page
2. Click "Create a List"
3. Fill in the list title and optional description
4. Optionally specify a custom URL (e.g., "my-awesome-sites")
5. Click "Create List"

### Managing URLs

1. Once a list is created, you can add URLs to it
2. Enter a URL and optional title
3. Edit or delete items as needed
4. Arrange items in your preferred order

### Sharing Your List

1. Click "Publish" to make your list publicly accessible
2. Copy the share link provided
3. Share it with others via email, social media, or chat

### Viewing a Public List

Anyone with your share link can view your list at:
`https://yoursite.com/your-custom-url`

## Environment Variables

The application uses the following environment variables (configured in `.env`):

```
DATABASE_URL=postgresql://user:password@localhost:5432/database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postdata
DB_USER=root
DB_PASSWORD=password
```

## Technology Stack

- **Frontend:** Astro, React, Tailwind CSS
- **Backend:** Node.js with Astro Server-Side Rendering
- **Database:** PostgreSQL
- **Package Manager:** npm

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check the credentials in `.env` match your PostgreSQL setup
- Verify the database and tables exist by running the init script

### Build Errors
- Delete `node_modules` and `.astro` directories
- Run `npm install` again
- Run `npm run build`

### Port Already in Use
- Change the port in development: `npm run dev -- --port 3001`
- Or kill the process using port 3000

## Development Tips

- Use TypeScript for type safety in components and utilities
- Follow the Astro best practices guide
- Use React components for interactive features
- Keep API endpoints in the `src/pages/api` directory
- Use Tailwind CSS for styling

## Future Enhancements

- User authentication and accounts
- Collaborative lists with sharing permissions
- URL metadata fetching (titles, descriptions from Open Graph)
-  List categories and tags
- Search and filtering
- Analytics on shared lists
- Export lists to JSON, CSV, or HTML

## License

This project is part of the Density Dwarf workspace.

## Notes

- The application uses server-side rendering for dynamic routes
- All data is stored in PostgreSQL
- The frontend is built with Astro for optimal performance
- React is used selectively for interactive components

---

For more information, check out:
- [Astro Documentation](https://docs.astro.build)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
