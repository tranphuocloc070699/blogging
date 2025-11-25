import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const samplePosts = [
  {
    title: 'Getting Started with React: A Comprehensive Guide',
    slug: 'getting-started-with-react',
    excerpt: 'Learn the fundamentals of React, including components, state management, and hooks. This comprehensive guide will take you from beginner to confident React developer.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Introduction to React' }]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'React is a powerful JavaScript library for building user interfaces. Created by Facebook, it has become one of the most popular choices for modern web development. In this guide, we\'ll explore the core concepts that make React so effective.'
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'What is React?' }]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components". React\'s component-based architecture makes it easy to build and maintain large applications.'
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Key Features of React' }]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'Component-Based: '
                    },
                    {
                      type: 'text',
                      text: 'Build encapsulated components that manage their own state'
                    }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'Virtual DOM: '
                    },
                    {
                      type: 'text',
                      text: 'Efficient rendering with React\'s virtual DOM implementation'
                    }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'JSX Syntax: '
                    },
                    {
                      type: 'text',
                      text: 'Write HTML-like syntax directly in JavaScript'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Creating Your First Component' }]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Let\'s create a simple React component. Here\'s a basic example:'
            }
          ]
        },
        {
          type: 'codeBlock',
          attrs: { language: 'javascript' },
          content: [
            {
              type: 'text',
              text: 'function Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n\nfunction App() {\n  return (\n    <div>\n      <Welcome name="React" />\n      <Welcome name="Developer" />\n    </div>\n  );\n}'
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Understanding State and Props' }]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'State and props are fundamental concepts in React. Props allow you to pass data from parent to child components, while state allows components to manage their own data that can change over time.'
            }
          ]
        },
        {
          type: 'image',
          attrs: {
            src: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
            alt: 'React component diagram'
          }
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Conclusion' }]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'React provides a solid foundation for building modern web applications. By understanding components, state, and props, you\'re well on your way to becoming a proficient React developer. Keep practicing and exploring the React ecosystem!'
            }
          ]
        }
      ]
    }),
    tableOfContents: JSON.stringify({
      enabled: true,
      items: [
        { title: 'Introduction to React', anchor: 'introduction-to-react', level: 2 },
        { title: 'What is React?', anchor: 'what-is-react', level: 2 },
        { title: 'Key Features of React', anchor: 'key-features-of-react', level: 3 },
        { title: 'Creating Your First Component', anchor: 'creating-your-first-component', level: 2 },
        { title: 'Understanding State and Props', anchor: 'understanding-state-and-props', level: 2 },
        { title: 'Conclusion', anchor: 'conclusion', level: 2 }
      ]
    }),
    terms: ['React', 'JavaScript', 'Frontend']
  },
  {
    title: 'Database Design Best Practices: A Complete Guide',
    slug: 'database-design-best-practices',
    excerpt: 'Master the art of database design with these proven best practices. Learn about normalization, indexing, and how to create efficient database schemas.',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&h=600&fit=crop',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Why Database Design Matters' }]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'A well-designed database is the foundation of any successful application. Good database design ensures data integrity, improves query performance, and makes your application scalable and maintainable.'
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Normalization' }]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Database normalization is the process of organizing data to reduce redundancy and improve data integrity. The most common normal forms are:'
            }
          ]
        },
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'First Normal Form (1NF): '
                    },
                    {
                      type: 'text',
                      text: 'Eliminate repeating groups and ensure atomic values'
                    }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'Second Normal Form (2NF): '
                    },
                    {
                      type: 'text',
                      text: 'Remove partial dependencies'
                    }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'Third Normal Form (3NF): '
                    },
                    {
                      type: 'text',
                      text: 'Remove transitive dependencies'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Indexing Strategies' }]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Indexes are crucial for query performance. However, they come with trade-offs. Here are some guidelines:'
            }
          ]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Create indexes on columns used in WHERE clauses' }]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Consider composite indexes for queries with multiple conditions' }]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Don\'t over-index - each index has a cost for write operations' }]
                }
              ]
            }
          ]
        },
        {
          type: 'image',
          attrs: {
            src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
            alt: 'Database schema diagram'
          }
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Relationships and Foreign Keys' }]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Properly defining relationships between tables is essential. Use foreign keys to maintain referential integrity and ensure data consistency across related tables.'
            }
          ]
        },
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'A good database design is like a good foundation for a house - you don\'t see it, but everything depends on it.'
                }
              ]
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Conclusion' }]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Following these database design best practices will help you create efficient, scalable, and maintainable databases. Remember that good design is an iterative process - don\'t be afraid to refactor as your application evolves.'
            }
          ]
        }
      ]
    }),
    tableOfContents: JSON.stringify({
      enabled: true,
      items: [
        { title: 'Why Database Design Matters', anchor: 'why-database-design-matters', level: 2 },
        { title: 'Normalization', anchor: 'normalization', level: 2 },
        { title: 'Indexing Strategies', anchor: 'indexing-strategies', level: 2 },
        { title: 'Relationships and Foreign Keys', anchor: 'relationships-and-foreign-keys', level: 2 },
        { title: 'Conclusion', anchor: 'conclusion', level: 2 }
      ]
    }),
    terms: ['Database', 'PostgreSQL', 'Backend']
  },
  {
    title: 'Building RESTful APIs with Node.js and Express',
    slug: 'building-restful-apis-nodejs-express',
    excerpt: 'Learn how to build robust and scalable RESTful APIs using Node.js and Express. This tutorial covers routing, middleware, error handling, and best practices.',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=600&fit=crop',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Introduction to REST APIs' }]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use HTTP methods to perform CRUD operations and are the backbone of modern web services.'
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Setting Up Express' }]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'First, let\'s set up a basic Express application:'
            }
          ]
        },
        {
          type: 'codeBlock',
          attrs: { language: 'javascript' },
          content: [
            {
              type: 'text',
              text: 'const express = require(\'express\');\nconst app = express();\nconst port = 3000;\n\napp.use(express.json());\n\napp.get(\'/api/users\', (req, res) => {\n  res.json({ users: [] });\n});\n\napp.listen(port, () => {\n  console.log(`Server running on port ${port}`);\n});'
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'RESTful Routes' }]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'A RESTful API typically implements these HTTP methods:'
            }
          ]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'code' }],
                      text: 'GET'
                    },
                    {
                      type: 'text',
                      text: ' - Retrieve resources'
                    }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'code' }],
                      text: 'POST'
                    },
                    {
                      type: 'text',
                      text: ' - Create new resources'
                    }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'code' }],
                      text: 'PUT/PATCH'
                    },
                    {
                      type: 'text',
                      text: ' - Update existing resources'
                    }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'code' }],
                      text: 'DELETE'
                    },
                    {
                      type: 'text',
                      text: ' - Remove resources'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'image',
          attrs: {
            src: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&h=400&fit=crop',
            alt: 'API development'
          }
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Middleware and Error Handling' }]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Middleware functions are essential in Express. They can modify request and response objects, end the request-response cycle, and call the next middleware in the stack.'
            }
          ]
        },
        {
          type: 'codeBlock',
          attrs: { language: 'javascript' },
          content: [
            {
              type: 'text',
              text: '// Logging middleware\napp.use((req, res, next) => {\n  console.log(`${req.method} ${req.url}`);\n  next();\n});\n\n// Error handling middleware\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ error: \'Something went wrong!\' });\n});'
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Best Practices' }]
        },
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Use proper HTTP status codes' }]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Version your API (e.g., /api/v1/users)' }]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Implement proper error handling' }]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Use environment variables for configuration' }]
                }
              ]
            }
          ]
        }
      ]
    }),
    tableOfContents: JSON.stringify({
      enabled: true,
      items: [
        { title: 'Introduction to REST APIs', anchor: 'introduction-to-rest-apis', level: 2 },
        { title: 'Setting Up Express', anchor: 'setting-up-express', level: 2 },
        { title: 'RESTful Routes', anchor: 'restful-routes', level: 2 },
        { title: 'Middleware and Error Handling', anchor: 'middleware-and-error-handling', level: 2 },
        { title: 'Best Practices', anchor: 'best-practices', level: 2 }
      ]
    }),
    terms: ['Node.js', 'Backend', 'API']
  }
];

async function main() {
  console.log('Starting seed...');

  // Create or get admin user
  let adminUser = await prisma.user.findUnique({
    where: { username: 'admin' }
  });

  if (!adminUser) {
    console.log('admin not found');
    return;
  }

  // Create taxonomies
  const categoryTaxonomy = await prisma.taxonomy.upsert({
    where: { slug: 'category' },
    update: {},
    create: {
      name: 'Category',
      slug: 'category',
      description: 'Post categories'
    }
  });

  const tagTaxonomy = await prisma.taxonomy.upsert({
    where: { slug: 'tag' },
    update: {},
    create: {
      name: 'Tag',
      slug: 'tag',
      description: 'Post tags'
    }
  });

  console.log('Created taxonomies');

  // Create terms
  const terms = [
    { name: 'React', slug: 'react', taxonomyId: tagTaxonomy.id },
    { name: 'JavaScript', slug: 'javascript', taxonomyId: tagTaxonomy.id },
    { name: 'Frontend', slug: 'frontend', taxonomyId: categoryTaxonomy.id },
    { name: 'Database', slug: 'database', taxonomyId: tagTaxonomy.id },
    { name: 'PostgreSQL', slug: 'postgresql', taxonomyId: tagTaxonomy.id },
    { name: 'Backend', slug: 'backend', taxonomyId: categoryTaxonomy.id },
    { name: 'Node.js', slug: 'nodejs', taxonomyId: tagTaxonomy.id },
    { name: 'API', slug: 'api', taxonomyId: tagTaxonomy.id }
  ];

  const createdTerms: any = {};
  for (const term of terms) {
    const created = await prisma.term.upsert({
      where: {
        slug_taxonomyId: {
          slug: term.slug,
          taxonomyId: term.taxonomyId
        }
      },
      update: {},
      create: term
    });
    createdTerms[term.name] = created;
    console.log(`Created term: ${term.name}`);
  }

  // Create posts
  for (const postData of samplePosts) {
    const termIds = postData.terms.map(termName => createdTerms[termName].id);

    await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: {
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        thumbnail: postData.thumbnail,
        tableOfContents: postData.tableOfContents,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: adminUser.id,
        postTerms: {
          create: termIds.map(termId => ({ termId }))
        }
      }
    });

    console.log(`Created post: ${postData.title}`);
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
