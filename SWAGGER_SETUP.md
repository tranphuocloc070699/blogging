# Swagger UI Setup

Swagger UI has been successfully implemented in your Next.js Blog CMS project!

## Accessing Swagger UI

Once your development server is running, you can access the Swagger UI documentation at:

**http://localhost:3000/api-docs**

## API Documentation Endpoint

The OpenAPI specification is available as JSON at:

**http://localhost:3000/api/docs**

## Features

### Implemented Documentation

The following API endpoints have been documented:

1. **Authentication**
   - `POST /api/users/login` - User login with email/username and password

2. **Posts**
   - `GET /api/posts` - Get all posts with filtering, pagination, and sorting
   - `POST /api/posts` - Create a new blog post (Admin only)

3. **Taxonomies**
   - `GET /api/taxonomies` - Get all taxonomies with pagination and search
   - `POST /api/taxonomies` - Create a new taxonomy (Admin only)

### Authentication

For protected endpoints (marked with a lock icon in Swagger UI), you'll need to:

1. First login via `POST /api/users/login`
2. Copy the `accessToken` from the response
3. Click the "Authorize" button at the top of Swagger UI
4. Enter: `Bearer <your-access-token>`
5. Click "Authorize" and "Close"

Now you can test protected endpoints!

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── docs/
│   │   │   └── route.ts         # OpenAPI JSON endpoint
│   │   ├── posts/
│   │   │   └── route.ts         # Posts API (documented)
│   │   ├── taxonomies/
│   │   │   └── route.ts         # Taxonomies API (documented)
│   │   └── users/
│   │       └── login/
│   │           └── route.ts     # Login API (documented)
│   └── api-docs/
│       └── page.tsx              # Swagger UI page
└── lib/
    └── swagger.ts                # Swagger configuration
```

## Adding Documentation to New Endpoints

To document additional API endpoints, add JSDoc comments with Swagger annotations above your route handlers:

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     tags:
 *       - YourTag
 *     summary: Brief description
 *     description: Detailed description
 *     parameters:
 *       - in: query
 *         name: paramName
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourSchema'
 */
export async function GET(request: NextRequest) {
  // Your handler code
}
```

## Schemas

Common schemas are defined in `src/lib/swagger.ts` under `components.schemas`. Current schemas include:

- User
- LoginRequest
- LoginResponse
- Post
- CreatePostRequest
- Taxonomy
- Term
- PaginatedResponse
- ErrorResponse

You can add more schemas in the swagger configuration as needed.

## Dependencies

The following packages were installed:

- `swagger-ui-react` - React component for Swagger UI
- `swagger-jsdoc` - Generates OpenAPI spec from JSDoc comments

## Next Steps

To document more endpoints:

1. Add JSDoc comments with `@swagger` tags to your route handlers
2. Define any new schemas needed in `src/lib/swagger.ts`
3. The documentation will automatically appear in Swagger UI

## Troubleshooting

If Swagger UI doesn't load:

1. Ensure the dev server is running: `npm run dev`
2. Check browser console for errors
3. Verify the API docs endpoint works: `curl http://localhost:3000/api/docs`
4. Clear browser cache and reload

## Production Considerations

For production deployment:

1. Update the server URL in `src/lib/swagger.ts` to your production domain
2. Consider adding authentication to the `/api-docs` route if needed
3. You may want to disable Swagger UI in production by checking `process.env.NODE_ENV`
