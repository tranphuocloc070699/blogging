export const routes = {
  home: "/",
  // Admin/CMS routes under /auth
  auth: {
    dashboard: "/auth",
    posts: {
      dashboard: "/auth/posts",
      upsave: "/auth/posts/upsave",
      edit: (id: string | number) => `/auth/posts/${id}/edit`,
    },
    taxonomies: {
      dashboard: "/auth/taxonomies",
      create: "/auth/taxonomies/create",
      edit: (id: string | number) => `/auth/taxonomies/${id}/edit`,
    },
    terms: {
      dashboard: "/auth/terms",
      create: "/auth/terms/create",
      edit: (id: string | number) => `/auth/terms/${id}/edit`,
    },
    users: {
      dashboard: "/auth/users",
      create: "/auth/users/create",
      edit: (id: string | number) => `/auth/users/${id}/edit`,
    },
  },
  // Legacy routes (deprecated - use auth.* instead)
  posts: {
    dashboard: "/auth/posts",
    upsave: "/auth/posts/upsave-old",
  },
  books: {
    dashboard: "/books",
    upsave: "/books/upsave-old",
  },
  profiles: {
    dashboard: "/profiles",
    settings: "/profiles/settings"
  }

}