import { PostFormData } from "@/app/auth/posts/upsave/page";
import PostMetadataForm from "@/components/posts/create-edit/post-metadata-form";
import CustomSheet from "@/components/sheet-views/container";
import { Button } from "@/components/ui";
import { Eye, FileText, Save } from "lucide-react";
import { useState } from 'react';



interface BottomActionBarProps {
  onFormDataChange: (formData: Partial<PostFormData>) => void;
  postContent: string;
  postStatus: string;
  postSlug: string;
  isEditMode: boolean;
  termIds: number[];
  postKeywords: string;
  onSave: () => void
}


const BottomActionBar = ({ postContent, postStatus, postSlug, onFormDataChange, postKeywords, termIds, isEditMode, onSave }: BottomActionBarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  function openSheet() {
    console.log({ postKeywords, postStatus, postSlug, termIds })
    setIsOpen(true);
  }


  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <CustomSheet title={"Post Metadata"} isOpen={isOpen} setIsOpen={setIsOpen}>
        <PostMetadataForm
          keywords={postKeywords}
          content={postContent}
          status={postStatus}
          slug={postSlug}
          onFormDataChange={onFormDataChange}
          termIds={termIds}
        />

      </CustomSheet>
      <div className="max-w-[768px] mx-auto px-6 py-4 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={openSheet}
        >
          <FileText className="h-4 w-4 mr-2" />
          Metadata
        </Button>

        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            onClick={onSave}
          // disabled={isSaving}
          // loading={isSaving}
          >
            {isEditMode ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Publish
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BottomActionBar;