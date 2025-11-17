# Post Create/Edit CRUD UI Components

This directory contains a comprehensive blog post creation and editing interface built following the isomorphic design pattern.

## Features

### ✅ **Tabbed Navigation with Smooth Scrolling**
- **React Scroll Integration**: Uses `react-scroll` library for smooth scrolling between sections
- **Sticky Navigation**: Navigation bar stays at the top when scrolling
- **Active Section Highlighting**: Shows which section is currently active
- **Mobile Responsive**: Horizontal scroll on smaller screens

### ✅ **Comprehensive Form Sections**

1. **Summary** - Basic post information
   - Title, Slug, Status, Excerpt
   - Form validation with Zod schema

2. **Content** - Main post content
   - Large textarea for Markdown content
   - Helpful tips and examples
   - Syntax highlighting support ready

3. **Media** - Featured image handling
   - Drag & drop image upload
   - Image preview and removal
   - Alt text and caption fields

4. **Categories & Tags** - Taxonomy management
   - Multi-select categories
   - Tag creation and selection
   - Visual badges for selected items

5. **Settings** - Publication settings
   - Publication date/time
   - Visibility options (public/private/password)
   - Comment settings and post features
   - Custom fields support

6. **SEO** - Search engine optimization
   - Meta title/description with character counters
   - Open Graph settings
   - Twitter Card configuration
   - Search result preview

### ✅ **Modern UX Patterns**
- **Form Validation**: Comprehensive validation with error messages
- **Loading States**: Loading indicators for save operations
- **Toast Notifications**: Success/error feedback
- **Responsive Layout**: Works on all screen sizes
- **Accessible**: Proper labels and keyboard navigation

### ✅ **Developer Experience**
- **TypeScript**: Full type safety
- **Modular Components**: Each section is a separate component
- **Reusable**: Easy to extend and customize
- **Well Documented**: Clear code structure and comments

## Usage

### Basic Implementation

```tsx
import CreateEditPost from '@/components/posts/create-edit';

export default function CreatePostPage() {
  return (
    <div>
      <CreateEditPost />
    </div>
  );
}
```

### Edit Existing Post

```tsx
import CreateEditPost from '@/components/posts/create-edit';

export default function EditPostPage({ params }: { params: { slug: string } }) {
  const existingPost = {
    title: 'Existing Post Title',
    content: 'Existing content...',
    status: 'PUBLISHED',
    // ... other fields
  };

  return (
    <CreateEditPost slug={params.slug} post={existingPost} />
  );
}
```

## Component Structure

```
create-edit/
├── index.tsx              # Main container component
├── post-summary.tsx       # Basic post info section
├── post-content.tsx       # Content editing section
├── post-media.tsx         # Media upload section
├── post-taxonomies.tsx    # Categories and tags section
├── post-settings.tsx      # Publication settings section
├── post-seo.tsx          # SEO configuration section
├── form-utils.ts          # Utility functions
└── README.md             # This file
```

## Form Schema

The component uses Zod for validation with this schema structure:

```typescript
{
  title: string (1-200 chars)
  slug: string (1-100 chars)
  excerpt: string (1-500 chars)
  content: string (required)
  status: 'DRAFT' | 'PUBLISHED'
  featuredImage?: string
  categories?: Array<Category>
  tags?: Array<Tag>
  // ... SEO and settings fields
}
```

## Styling

The components use:
- **Tailwind CSS** for styling
- **Shadcn/UI** components
- **Container Queries** (@container) for responsive design
- **CSS Grid** for layout structure

## Navigation Behavior

The navigation uses these scroll offsets:
- **First section**: -250px offset
- **Other sections**: -150px offset
- **Smooth scroll**: 500ms duration
- **Spy mode**: Automatically updates active state

## API Integration Ready

The component is ready for API integration:
- Form submission handler prepared
- Loading states implemented
- Error handling included
- Success notifications ready

To integrate with your API:

```tsx
const onSubmit = async (data) => {
  try {
    if (slug) {
      await postService.updatePost(postId, data);
    } else {
      await postService.createPost(data);
    }
    toast.success('Post saved successfully!');
  } catch (error) {
    toast.error('Failed to save post');
  }
};
```

## Customization

### Adding New Sections

1. Create new section component in `create-edit/` directory
2. Add to `formParts` in `form-nav.tsx`
3. Add to `MAP_STEP_TO_COMPONENT` in `index.tsx`
4. Update form schema if needed

### Modifying Existing Sections

Each section component accepts:
- `className?: string` for custom styling
- Access to form context via `useFormContext()`
- Standard FormGroup wrapper with title/description

### Custom Validation

Extend the Zod schema in `index.tsx`:

```typescript
const postFormSchema = z.object({
  // existing fields...
  customField: z.string().optional(),
});
```

## Dependencies

Required packages:
- `react-scroll` - Smooth scrolling navigation
- `react-hook-form` - Form state management
- `zod` - Form validation
- `@hookform/resolvers` - Zod integration
- `sonner` - Toast notifications
- `lucide-react` - Icons

## Browser Support

- Modern browsers with CSS Grid support
- Mobile responsive design
- Touch-friendly interfaces
- Keyboard navigation support