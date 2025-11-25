import { Calendar } from 'lucide-react';

// interface PostMetaProps {
//   date: string | Date;
// }

export default function PostMeta() {
  // const formattedDate = formatDistanceToNow(new Date(date), {
  //   addSuffix: true,
  // });

  return (
    <div className="flex items-center text-sm text-gray-500">
      <Calendar className="w-4 h-4 mr-1" />
      {/* <time dateTime={new Date(date).toISOString()}>{formattedDate}</time> */}
    </div>
  );
}
