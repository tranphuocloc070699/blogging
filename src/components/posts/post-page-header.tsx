import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";
import { Plus, ArrowLeft } from "lucide-react";

interface PostPageHeaderProps {
  title: string;
  breadcrumb?: Array<{
    href?: string;
    name: string;
  }>;
  showCreateButton?: boolean;
  showBackButton?: boolean;
  backHref?: string;
  createHref?: string;
}

export default function PostPageHeader({
  title,
  breadcrumb = [],
  showCreateButton = false,
  showBackButton = false,
  backHref = "/posts",
  createHref = "/posts/create",
}: PostPageHeaderProps) {
  return (
    <PageHeader title={title} breadcrumb={breadcrumb}>
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Link href={backHref}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
        )}

        {showCreateButton && (
          <Link href={createHref}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </Link>
        )}
      </div>
    </PageHeader>
  );
}
