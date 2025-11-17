# API Service Architecture

This directory contains the API service layer for the blogging CMS, following the pattern from `perfume-client` project.

## Architecture Overview

### 1. **HttpFactory** (`factory.ts`)
- Base HTTP client class that handles all API requests
- Supports authentication via Bearer tokens
- Handles request/response formatting
- Built on top of native `fetch` API

### 2. **Service Modules** (`modules/`)
Each service extends `HttpFactory` and provides methods for a specific domain:

- **`user-service.ts`** - Authentication and user management
- **`post-service.ts`** - Blog post CRUD operations
- **`taxonomy-service.ts`** - Category/taxonomy management
- **`term-service.ts`** - Tag/term management

### 3. **Types** (`../types/`)
- **`common.ts`** - Shared types and utilities
- **`posts.ts`** - All post, taxonomy, and term related interfaces
- **`users.ts`** - User and authentication related interfaces

### 4. **Configuration**
- **`next.config.ts`** - API proxy configuration (rewrites `/api/*` to backend)
- **`.env`** - Environment variables for backend URL

## Usage Patterns

### Basic Usage (Public Endpoints)
```typescript
import { postService } from '@/services';

// Get published posts
const posts = await postService.getPublishedPosts({
  page: 0,
  size: 10
});
```

### Authenticated Requests
```typescript
import { createPostService } from '@/services';

// Create service with access token
const authenticatedPostService = createPostService(accessToken);

// Create a new post
const newPost = await authenticatedPostService.createPost({
  title: 'My Post',
  content: 'Post content...',
  status: 'DRAFT'
});
```

### Error Handling
```typescript
try {
  const response = await postService.getPostById(123);
  const post = response.body.data;
} catch (error) {
  console.error('API request failed:', error.message);
}
```

## Service Methods

### UserService
- `signup(userData)` - Register new user
- `login(credentials)` - User authentication
- `authenticate(cookie?)` - Validate session
- `logout(cookie?)` - End session

### PostService
- `getAllPosts(params?)` - Get all posts with pagination
- `getPublishedPosts(params?)` - Get published posts only
- `getPostById(id)` - Get single post
- `getPostBySlug(slug)` - Get post by slug
- `createPost(data)` - Create new post *(auth required)*
- `updatePost(id, data)` - Update existing post *(auth required)*
- `deletePost(id)` - Delete post *(auth required)*
- `publishPost(id)` - Publish draft post *(auth required)*
- `unpublishPost(id)` - Unpublish post *(auth required)*
- `searchPosts(query, params?)` - Search posts
- `getPostsByAuthor(authorId, params?)` - Get posts by author

### TaxonomyService
- `getAllTaxonomies(params?)` - Get all taxonomies
- `getTaxonomyById(id)` - Get single taxonomy
- `getTaxonomyBySlug(slug)` - Get taxonomy by slug
- `getTaxonomyWithTerms(slug)` - Get taxonomy with all terms
- `createTaxonomy(data)` - Create taxonomy *(admin required)*
- `updateTaxonomy(id, data)` - Update taxonomy *(admin required)*
- `deleteTaxonomy(id)` - Delete taxonomy *(admin required)*
- `searchTaxonomies(query, params?)` - Search taxonomies

### TermService
- `getAllTerms(params?)` - Get all terms
- `getTermsByTaxonomy(taxonomySlug, params?)` - Get terms by taxonomy
- `getPopularTerms(taxonomySlug, limit)` - Get popular terms
- `getTermById(id)` - Get single term
- `getTermBySlug(slug)` - Get term by slug
- `getTermBySlugAndTaxonomy(taxonomySlug, slug)` - Get term by slug within taxonomy
- `createTerm(data)` - Create term *(admin required)*
- `updateTerm(id, data)` - Update term *(admin required)*
- `deleteTerm(id)` - Delete term *(admin required)*
- `searchTerms(query, params?)` - Search terms

## Response Format

All API responses follow the `ResponseDto<T>` format:

```typescript
{
  status: number;      // HTTP status code
  data: T;            // Response data
  message: string;    // Success/error message
  errors?: string;    // Error details (optional)
}
```

Paginated responses use `PageableResponse<T>`:

```typescript
{
  content: T[];           // Array of items
  size: number;          // Page size
  number: number;        // Current page number
  totalElements: number; // Total items count
  totalPages: number;    // Total pages count
  first: boolean;        // Is first page
  last: boolean;         // Is last page
  numberOfElements: number;
  empty: boolean;
}
```

## Examples

See `../examples/api-usage-examples.ts` for comprehensive usage examples including:
- Authentication workflow
- CRUD operations
- Error handling
- React hooks integration
- Complete workflows

## Environment Setup

1. Set backend URL in `.env`:
   ```
   BACKEND_DOMAIN=http://localhost:8080
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

2. The Next.js proxy configuration automatically forwards `/api/*` requests to the backend.

3. Services can be used both client-side and server-side (SSR/SSG).

## Best Practices

1. **Use default instances for public endpoints:**
   ```typescript
   import { postService } from '@/services';
   ```

2. **Create authenticated instances for protected endpoints:**
   ```typescript
   import { createPostService } from '@/services';
   const service = createPostService(accessToken);
   ```

3. **Always handle errors:**
   ```typescript
   try {
     const response = await service.method();
   } catch (error) {
     // Handle error appropriately
   }
   ```

4. **Use proper TypeScript types:**
   ```typescript
   import type { PostDto, CreatePostDto } from '@/types/posts';
   ```

5. **Implement loading states in React components:**
   ```typescript
   const [loading, setLoading] = useState(false);
   ```