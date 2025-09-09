import {routes} from "@/config/routes";
import {Book, Heart, Mail, Newspaper} from "lucide-react";
import {JSX} from "react";


export const pageLinks = [
  {
    name: 'Home',
  },
  // label end
  {
    name: 'Posts',
    href: routes.posts.dashboard
  },
  {
    name: 'Books',
    href: routes.books.dashboard
  },
]


export const notificationsData = [
  {
    id: 1,
    name: 'Someone message you',
    icon: Mail,
    unRead: true,
    sendTime: '2023-06-01T09:35:31.820Z',
  },
  {
    id: 2,
    name: 'The post ABC was liked',
    icon: Heart,
    unRead: false,
    sendTime: '2023-05-30T09:35:31.820Z',
  },
  {
    id: 1,
    name: 'Someone message you',
    icon: Mail,
    unRead: true,
    sendTime: '2023-06-01T09:35:31.820Z',
  },
  {
    id: 2,
    name: 'The post ABC was liked',
    icon: Heart,
    unRead: false,
    sendTime: '2023-05-30T09:35:31.820Z',
  },
  {
    id: 1,
    name: 'Someone message you',
    icon: Mail,
    unRead: true,
    sendTime: '2023-06-01T09:35:31.820Z',
  },
  {
    id: 2,
    name: 'The post ABC was liked',
    icon: Heart,
    unRead: false,
    sendTime: '2023-05-30T09:35:31.820Z',
  },

];

export const messagesData = [
  {
    id: 1,
    message: `It is nice to be chatting with you. Omnis,
        quidem non. Sint inventore quasi temporibus architecto eaque,
        natus aspernatur minus?`,
    avatar: ['https://randomuser.me/api/portraits/men/51.jpg'],
    name: 'Wade Warren',
    unRead: true,
    sendTime: '2023-06-01T09:35:31.820Z',
  },
  {
    id: 2,
    message: ` Oh... Let's move on to something else for a bit. Sint inventore quasi temporibus architecto eaque,
        natus aspernatur minus?`,
    avatar: ['https://randomuser.me/api/portraits/men/40.jpg'],
    name: 'Jane Cooper',
    unRead: true,
    sendTime: '2023-05-30T09:35:31.820Z',
  },
  {
    id: 3,
    message: `You: I never received any phone calls about it. Omnis,
        quidem non. Sint inventore quasi temporibus architecto eaque,
        natus aspernatur minus?`,
    avatar: ['https://randomuser.me/api/portraits/women/11.jpg'],
    name: 'Leslie Alexander',
    unRead: false,
    sendTime: '2023-06-01T09:35:31.820Z',
  },
  {
    id: 4,
    message: `You: But you'll need to type in every possible word. Omnis,
        quidem non. Sint inventore quasi temporibus architecto eaque,
        natus aspernatur minus?`,
    avatar: ['https://randomuser.me/api/portraits/men/36.jpg'],
    name: 'John Doe',
    unRead: false,
    sendTime: '2023-05-21T09:35:31.820Z',
  },
  {
    id: 5,
    message: `They were delighted and set to work immediately. Sint inventore quasi temporibus architecto eaque,
        natus aspernatur minus?`,
    avatar: [
      'https://randomuser.me/api/portraits/men/50.jpg',
      'https://randomuser.me/api/portraits/women/57.jpg',
    ],
    name: 'Design & Frontend',
    unRead: true,
    sendTime: '2023-06-01T09:35:31.820Z',
  },
  {
    id: 6,
    message: `Hows going everything in our laravel project. Omnis,
        quidem non. Sint inventore quasi temporibus architecto eaque,
        natus aspernatur minus?`,
    avatar: [
      'https://randomuser.me/api/portraits/women/0.jpg',
      'https://randomuser.me/api/portraits/men/22.jpg',
    ],
    name: 'Laravel',
    unRead: true,
    sendTime: '2023-05-15T09:35:31.820Z',
  },
  {
    id: 7,

    name: 'WordPress',
    avatar: [
      'https://randomuser.me/api/portraits/men/94.jpg',
      'https://randomuser.me/api/portraits/women/11.jpg',
    ],
    unRead: false,
    sendTime: '2023-05-16T09:35:31.820Z',
  },
  {
    id: 8,
    message: `You: which is actually pretty clever and funny, inventore quasi temporibus architecto eaque,
        natus aspernatur minus?`,
    avatar: ['https://randomuser.me/api/portraits/men/43.jpg'],
    name: 'Jenny Doe',
    unRead: false,
    sendTime: '2023-05-01T09:35:31.820Z',
  },
  {
    id: 9,
    message: `You could try ELIZA bot, it was a software tween herself. Omnis,
        quidem non. Sint inventore quasi temporibus architecto eaque,
        natus aspernatur minus?`,
    avatar: ['https://randomuser.me/api/portraits/men/75.jpg'],
    name: 'Bruce Warren',
    unRead: true,
    sendTime: '2023-04-01T09:35:31.820Z',
  },
];



