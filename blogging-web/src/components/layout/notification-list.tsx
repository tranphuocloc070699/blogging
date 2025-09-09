import React from 'react';
import NotificationItem from "@/components/layout/notification-item";
import {ScrollArea} from "@/components/ui/scroll-area";

const NotificationList = () => {
  const notifications = [
    {
      id: 1,
      icon: "UserRoundCheck",
      title: "Account Verified",
      message: "Your identity has been successfully verified.",
      time: "2h ago",
      status: "unread",
    },
    {
      id: 2,
      icon: "Bell",
      title: "New Course Released",
      message: "A new course on React & TypeScript is now available.",
      time: "4h ago",
      status: "unread",
    },
    {
      id: 3,
      icon: "CalendarCheck",
      title: "Event Reminder",
      message: "Don't forget the webinar tomorrow at 10:00 AM.",
      time: "1d ago",
      status: "read",
    },
    {
      id: 4,
      icon: "Gift",
      title: "Special Offer",
      message: "Get 30% off your next purchase – valid for 48h!",
      time: "2d ago",
      status: "unread",
    },
    {
      id: 5,
      icon: "Mail",
      title: "New Message",
      message: "You have received a message from the admin.",
      time: "3d ago",
      status: "read",
    },
    {
      id: 6,
      icon: "AlertCircle",
      title: "System Maintenance",
      message: "The system will be down for maintenance this weekend.",
      time: "5d ago",
      status: "unread",
    },
    {
      id: 7,
      icon: "UploadCloud",
      title: "Backup Completed",
      message: "Your project backup has been successfully completed.",
      time: "6d ago",
      status: "read",
    },
    {
      id: 8,
      icon: "CheckCircle",
      title: "Subscription Active",
      message: "Your premium subscription is now active.",
      time: "1w ago",
      status: "unread",
    },
    {
      id: 9,
      icon: "MessageCircle",
      title: "Comment Reply",
      message: "Someone replied to your comment on the blog post.",
      time: "1w ago",
      status: "read",
    },
    {
      id: 10,
      icon: "FileText",
      title: "Weekly Report Ready",
      message: "Your weekly report is now available for download.",
      time: "1w ago",
      status: "unread",
    },
  ];


  return (
      <ScrollArea component-name="NotificationList" className={"h-[500px] pr-4"}>
        {notifications.map((item) => (
            <NotificationItem key={item.id} {...item} />
        ))}
      </ScrollArea>
  );
};

export default NotificationList;