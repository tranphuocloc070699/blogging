import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog CMS API',
      version: '1.0.0',
      description: 'API documentation for Blog CMS application',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://your-production-url.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            username: {
              type: 'string',
              description: 'Username',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'USER'],
              description: 'User role',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email (either email or username is required)',
            },
            username: {
              type: 'string',
              description: 'Username (either email or username is required)',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            message: {
              type: 'string',
            },
            data: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  description: 'JWT access token',
                },
                data: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Post ID',
            },
            title: {
              type: 'string',
              description: 'Post title',
            },
            excerpt: {
              type: 'string',
              description: 'Post excerpt',
            },
            content: {
              type: 'string',
              description: 'Post content',
            },
            slug: {
              type: 'string',
              description: 'Post slug',
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PUBLISHED'],
              description: 'Post status',
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Publication date',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date',
            },
            thumbnail: {
              type: 'string',
              nullable: true,
              description: 'Thumbnail URL',
            },
            authorId: {
              type: 'string',
              description: 'Author ID',
            },
          },
        },
        CreatePostRequest: {
          type: 'object',
          required: ['title', 'excerpt', 'content', 'slug', 'status'],
          properties: {
            title: {
              type: 'string',
              description: 'Post title',
            },
            excerpt: {
              type: 'string',
              description: 'Post excerpt',
            },
            content: {
              type: 'string',
              description: 'Post content',
            },
            slug: {
              type: 'string',
              description: 'Post slug',
            },
            tableOfContents: {
              type: 'string',
              nullable: true,
              description: 'Table of contents',
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PUBLISHED'],
              description: 'Post status',
            },
            termIds: {
              type: 'array',
              items: {
                type: 'number',
              },
              description: 'Array of term IDs to associate with the post',
            },
            thumbnail: {
              type: 'string',
              nullable: true,
              description: 'Thumbnail URL',
            },
            metaTitle: {
              type: 'string',
              nullable: true,
              description: 'SEO meta title',
            },
            metaDescription: {
              type: 'string',
              nullable: true,
              description: 'SEO meta description',
            },
            metaKeywords: {
              type: 'string',
              nullable: true,
              description: 'SEO meta keywords',
            },
          },
        },
        Taxonomy: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Taxonomy ID',
            },
            name: {
              type: 'string',
              description: 'Taxonomy name',
            },
            slug: {
              type: 'string',
              description: 'Taxonomy slug',
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Taxonomy description',
            },
            termCount: {
              type: 'number',
              description: 'Number of terms in this taxonomy',
            },
          },
        },
        Term: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Term ID',
            },
            name: {
              type: 'string',
              description: 'Term name',
            },
            slug: {
              type: 'string',
              description: 'Term slug',
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Term description',
            },
            taxonomyId: {
              type: 'string',
              description: 'Associated taxonomy ID',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            message: {
              type: 'string',
            },
            data: {
              type: 'object',
              properties: {
                content: {
                  type: 'array',
                  items: {},
                },
                page: {
                  type: 'number',
                },
                size: {
                  type: 'number',
                },
                totalElements: {
                  type: 'number',
                },
                totalPages: {
                  type: 'number',
                },
                first: {
                  type: 'boolean',
                },
                last: {
                  type: 'boolean',
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication endpoints',
      },
      {
        name: 'Posts',
        description: 'Blog post management',
      },
      {
        name: 'Taxonomies',
        description: 'Taxonomy management',
      },
      {
        name: 'Terms',
        description: 'Term management',
      },
      {
        name: 'Upload',
        description: 'File upload endpoints',
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;