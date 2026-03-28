---
name: astro-best-practices
description: "Use when: working with Astro projects to follow component structure, performance optimization, type safety, styling conventions, routing, and React integration patterns"
applyTo: "**/*.astro,**/*.astro.ts,**/*.astro.js"
---

# Astro Best Practices

## Component Structure & Organization

### File Layout
- Place reusable components in `src/components/` with PascalCase names (e.g., `Welcome.astro`, `NavBar.astro`)
- Keep layout wrappers in `src/layouts/` (e.g., `Layout.astro`, `BlogLayout.astro`)
- Use `src/pages/` for file-based routing only — don't put all content there
- Group related components in subdirectories: `src/components/forms/`, `src/components/header/`

### Component Imports
```astro
---
// ✅ Good: Use relative imports from components
import Card from '../components/Card.astro';
import { getPost } from '../lib/posts';

// ❌ Avoid: Bare imports without clear origin
import Something from 'something'
---
```

### Props and Destructuring
```astro
---
// ✅ Good: Interface for props
interface Props {
  title: string;
  description?: string;
  count: number;
}
const { title, description, count } = Astro.props;

// ✅ Good: Use async props for data fetching
export interface Props {
  postId: string;
}
const { postId } = Astro.props;
const post = await getPost(postId);
---
```

## Performance Patterns

### Image Optimization
- Always use Astro's `<Image />` component, never raw `<img>` tags
```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.png';
---
<Image src={heroImage} alt="description" width={800} height={600} />
```

### Lazy Loading
- Use `loading="lazy"` for images below the fold
- Leverage Astro's built-in Islands to hydrate components only when needed
```astro
<VideoPlayer client:visible /> <!-- Only hydrates when visible -->
<Counter client:load /> <!-- Hydrate immediately -->
```

### Script Optimization
- Prefer `type="module"` for ES modules
- Keep scripts small and defer non-critical execution:
```astro
<script is:inline define:vars={{ count }}>
  // Critical inline scripts only
</script>
```

## Styling Conventions

### Tailwind CSS (Primary)
- Use Tailwind utility classes for all component styling
- Keep custom CSS in `<style>` blocks only for complex gradients or animations
```astro
<div class="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg">
  <h1 class="text-2xl font-bold text-gray-900">Title</h1>
</div>

<style>
  /* Only for complex gradients, animations, or vendor prefixes */
  h1 {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
```

### Scoped Styles
- Always use `<style>` blocks (scoped by default in Astro)
- Avoid global styles in components unless intentional
```astro
---
// ✅ Good: Import global stylesheet only in Layout
import '../styles/global.css';
---
```

### CSS Classes
- Use kebab-case for CSS class names
- Prefix complex selector groups to avoid collisions:
```astro
<style>
  .button-primary { /* clear intent */ }
  .button-primary:hover { /* scoped */ }
</style>
```

## Type Safety

### Enable TypeScript Everywhere
```astro
---
// Always enable TypeScript for better DX
import type { MarkdownInstance } from 'astro';

interface BlogPost {
  title: string;
  date: Date;
  tags: string[];
}

const posts: BlogPost[] = await Astro.glob('./posts/*.md');
---
```

### Props Validation
```astro
---
interface Props {
  href: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}
// Astro validates these automatically when you export
const { href, size = 'md', disabled = false }: Props = Astro.props;
---
```

## Layout & Routing

### Nested Layouts
```astro
<!-- src/layouts/Layout.astro (main wrapper) -->
---
---
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>My Site</title>
  </head>
  <body>
    <slot />
  </body>
</html>

<!-- src/layouts/BlogLayout.astro (nested for blog posts) -->
---
import Layout from './Layout.astro';
import type { MarkdownFrontmatter } from '../lib/types';

interface Props {
  frontmatter: MarkdownFrontmatter;
}
const { frontmatter } = Astro.props;
---
<Layout>
  <article class="prose prose-lg">
    <h1>{frontmatter.title}</h1>
    <time>{frontmatter.date}</time>
    <slot />
  </article>
</Layout>
```

### Dynamic Routes
```astro
---
// src/pages/blog/[slug].astro
export async function getStaticPaths() {
  const posts = await Astro.glob('../posts/*.md');
  return posts.map((post) => ({
    params: { slug: post.frontmatter.slug },
    props: { post },
  }));
}

interface Props {
  post: any; // Should be typed properly
}
const { post } = Astro.props;
---
<Layout title={post.frontmatter.title}>
  <article set:html={post.compiledContent()} />
</Layout>
```

## Integration Patterns

### React Islands with Proper Hydration
```astro
---
import Counter from '../components/Counter.jsx';
---

<!-- Hydrate only when visible -->
<Counter client:visible initialValue={0} />

<!-- Or when interacted with -->
<InteractiveForm client:idle />
```

### Env Variables
```astro
---
// ✅ Good: Public env vars
const apiUrl = import.meta.env.PUBLIC_API_URL;

// ✅ Good: Secret env vars (server-side only)
const apiKey = import.meta.env.API_SECRET;

// Import helpers for env management
import { getSecret } from '../lib/env';
---
```

### Fetch and Error Handling
```astro
---
try {
  const response = await fetch(import.meta.env.PUBLIC_API_URL);
  const data = await response.json();
} catch (error) {
  console.error('Fetch failed:', error);
  // Don't expose error details to clients
}
---
```

## Code Organization

### Import Order
1. Astro imports
2. Type imports
3. Component imports
4. Utility/helper imports
5. Asset imports

```astro
---
import { Image } from 'astro:assets';
import type { Props } from '../lib/types';
import Card from '../components/Card.astro';
import { formatDate } from '../lib/utils';
import logo from '../assets/logo.png';
---
```

### Consistent Formatting
- Use 2-space indentation
- Separate concerns with blank lines
- Group related imports together
