import { FolderTree, House, Newspaper, Tags, Users } from "lucide-react";
import { JSX } from "react";

type MenuItem = {
  name: string;
  href?: string;
  icon?: JSX.Element;
  badge?: string;
  dropdownItems?: { name: string; href: string; }[];
};



export const menuItems: MenuItem[] = [
  {
    name: 'Overview',
  },
  {
    name: "Dashboard",
    href: "/auth",
    icon: <House />
  },
  // label end
  {
    name: 'Posts',
    href: '/auth/posts',
    icon: <Newspaper />,
    dropdownItems: [
      {
        name: "Dashboard",
        href: "/auth/posts",
      }
      ,
      // {
      //   name: "Create Post Old (Not used anymore)",
      //   href: "/auth/posts/upsave-old",
      // },
      {
        name: "Create Post",
        href: "/auth/posts/upsave",
      }]
  },
  {
    name: 'Taxonomies',
    href: '/auth/taxonomies',
    icon: <FolderTree />,
    dropdownItems: [
      {
        name: "Dashboard",
        href: "/auth/taxonomies",
      }
      , {
        name: "Create Taxonomy",
        href: "/auth/taxonomies/create",
      }]
  },
  {
    name: 'Terms',
    href: '/auth/terms',
    icon: <Tags />,
    dropdownItems: [
      {
        name: "Dashboard",
        href: "/auth/terms",
      },
      {
        name: "Create Term",
        href: "/auth/terms/create",
      }]
  },
  // {
  //   name: 'Books',
  //   href: '/auth/books',
  //   icon: <Book/>,
  //   dropdownItems: [
  //     {
  //       name: "Dashboard",
  //       href: "/auth/books",
  //     },
  //     {
  //       name: "Create Book",
  //       href: "/auth/books/create",
  //     }
  //   ]
  // },
]

export const menuAdminItems : MenuItem[] = [
  {
    name: 'Users',
    href: '/auth/users',
    icon: <Users />,
    dropdownItems: [
      {
        name: "Dashboard",
        href: "/auth/users",
      },
      {
        name: "Create User",
        href: "/auth/users/create",
      }
    ]
  }
]