'use client';

import { useEffect, useState, useRef } from 'react';
import {
  EditorRoot,
  EditorContent,
  type JSONContent,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorCommandList,
  handleCommandNavigation
} from 'novel';
import { defaultExtensions, slashCommand, suggestionItems } from './novel-extensions';
import { cn } from '@/lib/utils';
import { useClientSession } from '@/hooks/use-client-session';
import { useUserStore } from '@/store/user.store';

interface NovelEditorWrapperProps {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  readOnly?: boolean;
}

export default function NovelEditorWrapper({
  value,
  onChange,
  className,
  readOnly = false
}: NovelEditorWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const [initialContent, setInitialContent] = useState<JSONContent | undefined>(undefined);
  const [editorKey, setEditorKey] = useState(0);
  const isInternalChange = useRef(false);
  const lastExternalValue = useRef('');
  const userStore = useUserStore();

  const session = useClientSession();

  useEffect(() => {
    if (session?.accessToken) {
      userStore.setAccessToken(session.accessToken);
    }
  }, [session])

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Skip if this is an internal change (user typing)
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    // Only update if the value has actually changed from external source
    if (value === lastExternalValue.current) {
      return;
    }

    lastExternalValue.current = value;

    // Try to parse the value as JSON, if it fails, create a basic document
    try {
      if (value) {
        const parsed = JSON.parse(value);
        setInitialContent(parsed);
        setEditorKey(prev => prev + 1); // Force re-mount only on external changes
      } else {
        setInitialContent(undefined);
        setEditorKey(prev => prev + 1);
      }
    } catch {
      // If value is markdown or plain text, create a basic document structure
      setInitialContent({
        type: 'doc',
        content: value ? [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: value }]
          }
        ] : []
      });
      setEditorKey(prev => prev + 1);
    }
  }, [value]);

  if (!mounted) {
    return (
      <div className={cn("min-h-[500px] w-full rounded-lg border border-gray-200 bg-white p-4", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded bg-gray-200"></div>
          <div className="h-4 w-full rounded bg-gray-200"></div>
          <div className="h-4 w-5/6 rounded bg-gray-200"></div>
          <div className="h-4 w-4/6 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", readOnly && "select-text", className)}>
      <EditorRoot key={editorKey}>
        <EditorContent
          initialContent={initialContent}
          extensions={readOnly ? defaultExtensions as any : [...defaultExtensions, slashCommand] as any}
          className={cn(
            "min-h-full w-full editor-wrapper",
            readOnly && "[&_.ProseMirror]:pointer-events-auto [&_a]:pointer-events-auto [&_a]:cursor-pointer",
            className
          )}
          editorProps={{
            editable: () => !readOnly,
            attributes: {
              class: cn(
                'prose prose-lg dark:prose-invert focus:outline-none max-w-full min-h-full px-0 py-4',
                readOnly ? 'cursor-text select-text' : ''
              )
            },
            handleDOMEvents: {
              keydown: (_view, event) => {
                if (readOnly) return false;
                return handleCommandNavigation(event);
              },
            }
          }}
          onUpdate={({ editor }) => {
            if (readOnly) return;
            const json = editor.getJSON();
            const jsonString = JSON.stringify(json);
            isInternalChange.current = true;
            lastExternalValue.current = jsonString;
            onChange && onChange(jsonString);
          }}
        >
          {!readOnly && (
            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-lg border border-gray-200 bg-white px-1 py-2 shadow-lg transition-all editor-command-list-scrollbar">
              <EditorCommandEmpty className="px-2 py-2 text-sm text-gray-500">No results</EditorCommandEmpty>
              <EditorCommandList className="editor-command-list-scrollbar">
                {suggestionItems.map((item) => (
                  <EditorCommandItem
                    value={item.title}
                    onCommand={(val) => {
                      if (item.command) {
                        item.command(val);
                      }
                    }}
                    className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 aria-[selected=true]:bg-blue-100 cursor-pointer transition-colors"
                    key={item.title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-0">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0 leading-relaxed">{item.description}</p>
                    </div>
                  </EditorCommandItem>
                ))}
              </EditorCommandList>
            </EditorCommand>
          )}
        </EditorContent>
      </EditorRoot>
    </div>
  );
}