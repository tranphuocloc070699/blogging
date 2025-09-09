import {JSX} from "react";
import {Book, Newspaper} from "lucide-react";

type MenuItem = {
  name: string;
  href?: string;
  icon?: JSX.Element;
  badge?: string;
  dropdownItems?: { name: string; href: string; }[];
};


export const menuItems: MenuItem[] = [
  // label start
  {
    name: 'Overview',
  },
  // label end
  {
    name: 'Posts',
    href: '/posts',
    icon: <Newspaper/>,
    dropdownItems: [{
      name: "Create Post",
      href: "/posts/create-post",
    }]
  },
  {
    name: 'Books',
    href: '/books',
    icon: <Book/>
  },
]