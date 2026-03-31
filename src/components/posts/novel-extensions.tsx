import {
  CodeBlockLowlight,
  Command,
  createSuggestionItems,
  GlobalDragHandle,
  HorizontalRule,
  Placeholder,
  renderItems,
  StarterKit,
  TaskItem,
  TaskList,
  TiptapImage,
  TiptapLink,
} from "novel";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import NextImage from "next/image";
import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useUserStore } from "@/store/user.store";
import { Extension, Mark, mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection } from "@tiptap/pm/state";
import { cx } from "class-variance-authority";
import { common, createLowlight } from "lowlight";
import {
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Link,
  List,
  ListOrdered,
  MessageSquarePlus,
  Quote,
  Youtube,
} from "lucide-react";
import resourceService from "@/services/modules/resource-service";
import { NOVEL_HIGHLIGHT_COLOR } from "@/config/enums";
import CodeBlockView from "../block-code-view";

// Create lowlight instance with common languages
const lowlight = createLowlight(common);

// Placeholder extension configuration
const placeholder = Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === "heading") {
      return `Heading ${node.attrs["level"]}`;
    }
    return "Press '/' for commands, or start typing...";
  },
  includeChildren: false,
});

// Upload image to MinIO
async function uploadImage(file: File): Promise<string> {
  try {
    const token = useUserStore.getState().accessToken;
    if (!token) {
      throw new Error("Please login to upload images");
    }
    const response = await resourceService.uploadFile(file, token);
    if (!response.success) {
      throw new Error("Upload failed");
    }
    return response.url;
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
}

// Custom plugin for drag-and-drop and paste image upload
const uploadImagePluginKey = new PluginKey("uploadImage");

const createUploadImagePlugin = () => {
  return new Plugin({
    key: uploadImagePluginKey,
    props: {
      handlePaste(view, event) {
        const items = Array.from(event.clipboardData?.items || []);
        const types = Array.from(event.clipboardData?.types || []);

        // If clipboard has both text/html and Files, it's likely a drag-reposition
        // of an existing node, not a real paste. Check if html contains an existing image.
        if (types.includes("text/html") && types.includes("Files")) {
          const htmlData = event.clipboardData?.getData("text/html") || "";
          console.log("[paste] html content:", htmlData);

          // If the HTML contains an image with a real URL (not uploading),
          // it's a drag of existing image — let ProseMirror handle it natively
          if (
            htmlData.includes("<img") &&
            !htmlData.includes("__uploading__")
          ) {
            console.log(
              "[paste] detected drag of existing image, skipping upload",
            );
            return false;
          }
        }

        const imageItem = items.find((item) => item.type.startsWith("image/"));
        console.log("[paste] imageItem found:", !!imageItem);

        if (imageItem) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          console.log(
            "[paste] file from imageItem:",
            file?.name,
            file?.size,
            file?.type,
          );

          if (file) {
            const { schema } = view.state;
            const uploadId = `__uploading__${Date.now()}_${Math.random()}`;
            console.log(
              "[paste] creating placeholder with uploadId:",
              uploadId,
            );

            const placeholderNode = schema?.nodes["image"]?.create({
              src: uploadId,
              uploading: true,
              width: "full",
              height: "auto",
              align: "full",
              alt: "",
              caption: "",
            });

            const insertTr = view.state.tr.replaceSelectionWith(
              placeholderNode as any,
            );
            view.dispatch(insertTr);

            const findPlaceholder = () => {
              let pos = -1;
              view.state.doc.descendants((node, nodePos) => {
                if (node.type.name === "image" && node.attrs.src === uploadId) {
                  pos = nodePos;
                }
              });
              return pos;
            };

            console.log(
              "[paste] placeholder pos immediately after insert:",
              findPlaceholder(),
            );

            uploadImage(file)
              .then((url) => {
                const currentPos = findPlaceholder();
                console.log(`[paste:then] placeholder pos: ${currentPos}`);
                if (currentPos < 0) {
                  console.warn("[paste:then] placeholder not found, skipping");
                  return;
                }
                const node = view.state.schema?.nodes["image"]?.create({
                  src: url,
                  uploading: false,
                  width: "full",
                  height: "auto",
                  align: "full",
                  alt: "",
                  caption: "",
                });
                const tr = view.state.tr.replaceWith(
                  currentPos,
                  currentPos + 1,
                  node as any,
                );
                view.dispatch(tr);
                console.log(
                  "[paste:then] doc after replace:",
                  view.state.doc.toString(),
                );
              })
              .catch((error) => {
                console.error("Paste image upload error:", error);
                const currentPos = findPlaceholder();
                console.log(`[paste:catch] placeholder pos: ${currentPos}`);
                if (currentPos >= 0) {
                  const tr = view.state.tr.delete(currentPos, currentPos + 1);
                  view.dispatch(tr);
                } else {
                  console.warn(
                    "[paste:catch] placeholder not found, nothing to delete",
                  );
                }
                alert(
                  error instanceof Error
                    ? error.message
                    : "Failed to upload image",
                );
              });
          }
          return true;
        }
        return false;
      },

      handleDrop(view, event) {
        const hasFiles = event.dataTransfer?.files?.length;
        console.log("[drop] hasFiles:", hasFiles);
        console.log(
          "[drop] dataTransfer files:",
          Array.from(event.dataTransfer?.files || []).map((f) => f.name),
        );
        console.log(
          "[drop] dataTransfer types:",
          Array.from(event.dataTransfer?.types || []),
        );
        if (!hasFiles) return false;
        const images = Array.from(event.dataTransfer.files).filter((file) =>
          file.type.startsWith("image/"),
        );
        console.log("[drop] image files found:", images.length);

        if (images.length === 0) return false;

        event.preventDefault();

        const { schema } = view.state;
        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });

        images.forEach((image) => {
          // Unique ID per dropped image
          const uploadId = `__uploading__${Date.now()}_${Math.random()}`;
          const insertPos = coordinates?.pos ?? 0;

          const placeholderNode = schema.nodes["image"]?.create({
            src: uploadId,
            uploading: true,
            width: "full",
            height: "auto",
            align: "full",
            alt: "",
            caption: "",
          });

          const insertTr = view.state.tr.insert(
            insertPos,
            placeholderNode as any,
          );
          view.dispatch(insertTr);

          const findPlaceholder = () => {
            let pos = -1;
            view.state.doc.descendants((node, nodePos) => {
              if (node.type.name === "image" && node.attrs.src === uploadId) {
                pos = nodePos;
              }
            });
            return pos;
          };

          uploadImage(image)
            .then((url) => {
              const currentPos = findPlaceholder();
              console.log(`[drop:then] placeholder pos: ${currentPos}`);
              if (currentPos < 0) {
                console.warn("[drop:then] placeholder not found, skipping");
                return;
              }
              const node = view.state.schema.nodes["image"]?.create({
                src: url,
                uploading: false,
                width: "full",
                height: "auto",
                align: "full",
                alt: "",
                caption: "",
              });
              const tr = view.state.tr.replaceWith(
                currentPos,
                currentPos + 1,
                node as any,
              );
              view.dispatch(tr);
            })
            .catch((error) => {
              console.error("Drop image upload error:", error);
              const currentPos = findPlaceholder();
              console.log(`[drop:catch] placeholder pos: ${currentPos}`);
              if (currentPos >= 0) {
                const tr = view.state.tr.delete(currentPos, currentPos + 1);
                view.dispatch(tr);
              } else {
                console.warn(
                  "[drop:catch] placeholder not found, nothing to delete",
                );
              }
              alert(
                error instanceof Error
                  ? error.message
                  : "Failed to upload image",
              );
            });
        });

        return true;
      },
    },
  });
};

// React component for the image node view
function ImageNodeView({
  node,
  editor,
  getPos,
}: {
  node: any;
  editor: any;
  getPos: any;
}) {
  const [loaded, setLoaded] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { src, alt, caption, align, width, height, uploading } = node.attrs;

  const imgWidth = width && width !== "full" ? Number(width) : 200;
  const imgHeight = height && height !== "auto" ? Number(height) : 140;
  // Treat any __uploading__ src as uploading state
  const isUploading = !!uploading || src?.startsWith("__uploading__");
  const isReadOnly = !editor.isEditable;

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isReadOnly) {
      setLightboxOpen(true);
    } else {
      setToolbarVisible((v) => !v);
    }
  };

  const changeAlignment = (e: React.MouseEvent, newAlign: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof getPos === "function") {
      editor.commands.updateAttributes("image", { align: newAlign });
    }
  };

  const handleCaption = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newCaption = prompt("Enter image caption / alt text:", caption || "");
    if (newCaption !== null && typeof getPos === "function") {
      editor.commands.updateAttributes("image", {
        caption: newCaption,
        alt: newCaption,
      });
    }
  };

  const alignClass =
    align === "left"
      ? "mr-auto"
      : align === "right"
        ? "ml-auto"
        : align === "full"
          ? "w-full"
          : "mx-auto";

  const captionAlignClass =
    align === "left"
      ? "text-left"
      : align === "right"
        ? "text-right"
        : "text-center";

  const btnBase = "rounded p-2 transition-colors hover:bg-gray-100";
  const btnActive = " bg-blue-100 text-blue-600";

  const isFull = align === "full";
  const containerStyle = isFull
    ? { width: "100%" }
    : { width: imgWidth, height: imgHeight };

  return (
    <NodeViewWrapper
      className="image-wrapper-container relative block w-full"
      data-align={align}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      {/* Alignment toolbar — edit mode only */}
      {toolbarVisible && !isReadOnly && (
        <div
          className="absolute -top-12 left-0 flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1.5 shadow-xl z-50"
          contentEditable={false}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <button
            type="button"
            title="Align left"
            className={btnBase + (align === "left" ? btnActive : "")}
            onClick={(e) => changeAlignment(e, "left")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="21" x2="3" y1="6" y2="6" />
              <line x1="15" x2="3" y1="12" y2="12" />
              <line x1="17" x2="3" y1="18" y2="18" />
            </svg>
          </button>
          <button
            type="button"
            title="Align center"
            className={btnBase + (align === "center" ? btnActive : "")}
            onClick={(e) => changeAlignment(e, "center")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="21" x2="3" y1="6" y2="6" />
              <line x1="17" x2="7" y1="12" y2="12" />
              <line x1="19" x2="5" y1="18" y2="18" />
            </svg>
          </button>
          <button
            type="button"
            title="Align right"
            className={btnBase + (align === "right" ? btnActive : "")}
            onClick={(e) => changeAlignment(e, "right")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="21" x2="3" y1="6" y2="6" />
              <line x1="21" x2="9" y1="12" y2="12" />
              <line x1="21" x2="7" y1="18" y2="18" />
            </svg>
          </button>
          <button
            type="button"
            title="Full width"
            className={btnBase + (align === "full" ? btnActive : "")}
            onClick={(e) => changeAlignment(e, "full")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            title="Add caption"
            className={btnBase + (caption ? btnActive : "")}
            onClick={(e) => handleCaption(e)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
              <line x1="10" x2="8" y1="9" y2="9" />
            </svg>
          </button>
        </div>
      )}

      <div
        className={`rounded-lg overflow-hidden ${isFull ? "w-full" : "relative"} ${alignClass} ${isReadOnly ? "cursor-zoom-in" : "cursor-pointer"}`}
        style={containerStyle}
        onClick={handleImageClick}
      >
        {isUploading ? (
          <div
            className="flex items-center justify-center bg-gray-100 rounded-lg animate-pulse"
            style={
              isFull
                ? { width: "100%", height: 200 }
                : { width: imgWidth, height: imgHeight }
            }
          >
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <svg
                className="animate-spin w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              <span className="text-xs">Uploading...</span>
            </div>
          </div>
        ) : (
          <>
            {!loaded && (
              <div
                className="bg-gray-200 animate-pulse rounded-lg"
                style={
                  isFull
                    ? { width: "100%", height: imgHeight }
                    : { position: "absolute", inset: 0 }
                }
              />
            )}
            {src && isFull ? (
              <NextImage
                src={src}
                alt={alt || ""}
                width={0}
                height={0}
                sizes="100vw"
                className={`w-full h-auto rounded-lg transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setLoaded(true)}
                data-align={align}
                data-caption={caption}
              />
            ) : src ? (
              <NextImage
                src={src}
                alt={alt || ""}
                fill
                sizes={`${imgWidth}px`}
                className={`object-cover rounded-lg transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setLoaded(true)}
                data-align={align}
                data-caption={caption}
              />
            ) : null}
          </>
        )}
      </div>

      {caption && (
        <p
          className={`text-sm text-gray-500 italic mt-2 clear-both ${captionAlignClass}`}
        >
          {caption}
        </p>
      )}

      {/* Lightbox — read-only mode only */}
      {lightboxOpen && src && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: "black" }}
          onClick={() => setLightboxOpen(false)}
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLightboxOpen(false);
            }}
            className="absolute top-5 right-5 border-gray-500 bg-gray-700 hover:bg-gray-600 text-white hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Button>

          <div
            className="flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt || ""}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-sm"
            />
            {caption && (
              <p className="text-center text-white/60 text-sm mt-3">
                {caption}
              </p>
            )}
          </div>
        </div>
      )}
    </NodeViewWrapper>
  );
}

// Tiptap Image extension with MinIO upload and alignment
const tiptapImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align") || "center",
        renderHTML: (attributes) => ({
          "data-align": attributes["align"],
        }),
      },
      width: {
        default: "200",
        parseHTML: (element) => element.getAttribute("width") || "200",
        renderHTML: (attributes) => ({
          width: attributes["width"],
        }),
      },
      height: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("height") || "auto",
        renderHTML: (attributes) => ({
          height: attributes["height"],
        }),
      },
      alt: {
        default: "",
        parseHTML: (element) => element.getAttribute("alt") || "",
        renderHTML: (attributes) => ({
          alt: attributes["alt"],
        }),
      },
      caption: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-caption") || "",
        renderHTML: (attributes) => ({
          "data-caption": attributes["caption"],
        }),
      },
      uploading: {
        default: false,
        parseHTML: () => false,
        renderHTML: () => ({}),
      },
    };
  },
  addProseMirrorPlugins() {
    return [createUploadImagePlugin()];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
}).configure({
  allowBase64: false,
  HTMLAttributes: {
    class: cx("rounded-lg"),
  },
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx("not-prose pl-2"),
  },
});

const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx("flex gap-2 items-start my-4"),
  },
  nested: true,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx("mt-4 mb-6 border-t border-gray-300"),
  },
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx("list-disc list-outside leading-7 space-y-2"),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx("list-decimal list-outside leading-7 space-y-2"),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx("leading-7"),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx(
        "border-l-4 border-amber-700 bg-gradient-to-r from-amber-50 to-transparent pl-6 pr-4 py-3 italic my-4 text-amber-900 rounded-r-lg",
      ),
    },
  },
  codeBlock: false,
  code: {
    HTMLAttributes: {
      class: cx(
        "rounded-md bg-gray-100 px-1.5 py-0.5 text-sm font-medium font-mono",
      ),
      spellcheck: "false",
    },
  },
  paragraph: {
    HTMLAttributes: {
      class: cx("leading-7 my-4 first:mt-0"),
    },
  },
  heading: {
    HTMLAttributes: {
      class: cx("leading-tight font-bold my-4"),
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    width: 4,
  },
  gapcursor: false,
});

// Code block with syntax highlighting
const codeBlockLowlight = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView);
  },
}).configure({
  lowlight,
  HTMLAttributes: {
    class: cx("text-[#abb2bf]"),
  },
  defaultLanguage: "javascript",
});

const tiptapLink = TiptapLink.extend({
  inclusive: false,
}).configure({
  openOnClick: false,
  autolink: true,
  HTMLAttributes: {
    class: cx(
      "text-blue-600 underline-offset-[3px] hover:text-blue-700 transition-colors cursor-pointer font-medium",
    ),
  },
});

const YouTubeExtension = Node.create({
  name: "youtube",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-youtube-video]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes["src"];
    return [
      "div",
      { "data-youtube-video": "" },
      [
        "iframe",
        {
          src,
          width: 640,
          height: 360,
          frameborder: 0,
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: "true",
        },
      ],
    ];
  },

  addCommands() {
    return {
      setYouTubeVideo:
        (options: { src: string }) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});

export default YouTubeExtension;

// Highlight Mark
const HighlightMark = Mark.create({
  name: "highlight",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      color: {
        default: "grey",
        parseHTML: (element) => element.getAttribute("data-color") || "grey",
        renderHTML: (attributes) => ({
          "data-color": attributes["color"],
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "mark[data-highlight]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const color = HTMLAttributes["data-color"] || "grey";
    const colorClass =
      NOVEL_HIGHLIGHT_COLOR[color]?.class || NOVEL_HIGHLIGHT_COLOR.grey.class;

    return [
      "mark",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-highlight": "",
        class: `${colorClass} font-semibold rounded`,
        style: "padding: 0.125rem 0.125rem;",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      toggleHighlight:
        (attributes) =>
        ({ commands, state }) => {
          const isActive = state.schema.marks["highlight"]?.isInSet(
            state.selection.$from.marks(),
          );
          if (isActive) {
            return (
              commands.unsetMark(this.name) &&
              commands.setMark(this.name, attributes)
            );
          } else {
            return commands.setMark(this.name, attributes);
          }
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-e": () => {
        if (this.editor.isActive("highlight")) {
          return this.editor.commands.unsetMark("highlight");
        }
        return this.editor.commands.setMark("highlight", { color: "grey" });
      },
      Space: () => {
        const { state, view } = this.editor;
        const { selection, schema } = state;
        const { $from } = selection;
        const highlightMark = schema.marks["highlight"];
        if (!highlightMark || !selection.empty) return false;

        const highlight = highlightMark.isInSet($from.marks());
        if (!highlight) return false;

        // Only intercept at the end of a highlight span
        const nodeAfter = $from.nodeAfter;
        const isAtEnd = !nodeAfter || !highlightMark.isInSet(nodeAfter.marks);
        if (!isAtEnd) return false;

        // Insert a space without the highlight mark, then place cursor after it
        const pos = $from.pos;
        const tr = state.tr;
        // Insert space as plain text (no stored marks)
        tr.insertText(" ", pos, pos);
        // Remove highlight from just that inserted character
        tr.removeMark(pos, pos + 1, highlightMark);
        // Place cursor after the space
        tr.setSelection(TextSelection.create(tr.doc, pos + 1));
        // Clear stored marks so next typed char won't be highlighted
        tr.setStoredMarks([]);
        view.dispatch(tr);
        return true;
      },
    };
  },
});

// Custom keyboard shortcuts for lists
const ListKeymap = Extension.create({
  name: "listKeymap",
  priority: 1000,

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        const result = this.editor
          .chain()
          .focus()
          .sinkListItem("listItem")
          .run();
        if (result) return true;
        return this.editor.isActive("listItem");
      },
      "Shift-Tab": () => {
        const result = this.editor
          .chain()
          .focus()
          .liftListItem("listItem")
          .run();
        if (result) return true;
        return this.editor.isActive("listItem");
      },
    };
  },
});

export const defaultExtensions = [
  starterKit,
  codeBlockLowlight,
  placeholder,
  tiptapLink,
  tiptapImage,
  taskList,
  taskItem,
  horizontalRule,
  YouTubeExtension,
  HighlightMark,
  ListKeymap,
  GlobalDragHandle.configure({
    dragHandleWidth: 20,
  }),
];

// Slash command suggestions
export const suggestionItems = createSuggestionItems([
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: <MessageSquarePlus size={16} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .run();
    },
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "h1"],
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium", "h2"],
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small", "h3"],
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point", "ul"],
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered", "ol"],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Code Block",
    description: "Capture a code snippet.",
    searchTerms: ["codeblock"],
    icon: <Code size={18} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Highlight Grey",
    description: "Highlight text with grey background.",
    searchTerms: ["highlight", "mark", "background", "grey", "gray"],
    icon: <Highlighter size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHighlight({ color: "grey" })
        .run();
    },
  },
  {
    title: "Highlight Green",
    description: "Highlight text with green background.",
    searchTerms: ["highlight", "mark", "background", "green"],
    icon: <Highlighter size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHighlight({ color: "green" })
        .run();
    },
  },
  {
    title: "Highlight Blue",
    description: "Highlight text with blue background.",
    searchTerms: ["highlight", "mark", "background", "blue"],
    icon: <Highlighter size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHighlight({ color: "blue" })
        .run();
    },
  },
  {
    title: "Highlight Orange",
    description: "Highlight text with orange background.",
    searchTerms: ["highlight", "mark", "background", "orange"],
    icon: <Highlighter size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHighlight({ color: "orange" })
        .run();
    },
  },
  {
    title: "Highlight Red",
    description: "Highlight text with red background.",
    searchTerms: ["highlight", "mark", "background", "red"],
    icon: <Highlighter size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHighlight({ color: "red" })
        .run();
    },
  },
  {
    title: "Quote",
    description: "Add a blockquote for citations.",
    searchTerms: ["blockquote", "quote", "citation"],
    icon: <Quote size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: "Link",
    description: "Add a hyperlink with custom text and URL.",
    searchTerms: ["link", "hyperlink", "url", "href", "anchor"],
    icon: <Link size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();

      const overlay = document.createElement("div");
      overlay.style.cssText =
        "position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;";

      const dialog = document.createElement("div");
      dialog.style.cssText =
        "background: white; border-radius: 8px; padding: 24px; width: 400px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);";

      const title = document.createElement("h3");
      title.textContent = "Add Link";
      title.style.cssText =
        "font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111827;";

      const textLabel = document.createElement("label");
      textLabel.textContent = "Link Text";
      textLabel.style.cssText =
        "display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; color: #374151;";

      const textInput = document.createElement("input");
      textInput.type = "text";
      textInput.placeholder = "Enter link text";
      textInput.style.cssText =
        "width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; margin-bottom: 16px; outline: none;";
      textInput.addEventListener("focus", () => {
        textInput.style.borderColor = "#3b82f6";
        textInput.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
      });
      textInput.addEventListener("blur", () => {
        textInput.style.borderColor = "#d1d5db";
        textInput.style.boxShadow = "none";
      });

      const urlLabel = document.createElement("label");
      urlLabel.textContent = "URL";
      urlLabel.style.cssText =
        "display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; color: #374151;";

      const urlInput = document.createElement("input");
      urlInput.type = "url";
      urlInput.placeholder = "https://example.com";
      urlInput.style.cssText =
        "width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; margin-bottom: 20px; outline: none;";
      urlInput.addEventListener("focus", () => {
        urlInput.style.borderColor = "#3b82f6";
        urlInput.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
      });
      urlInput.addEventListener("blur", () => {
        urlInput.style.borderColor = "#d1d5db";
        urlInput.style.boxShadow = "none";
      });

      const buttonContainer = document.createElement("div");
      buttonContainer.style.cssText =
        "display: flex; gap: 8px; justify-content: flex-end;";

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.style.cssText =
        "padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 500; background: #f3f4f6; color: #374151; border: none; cursor: pointer;";
      cancelButton.addEventListener(
        "mouseenter",
        () => (cancelButton.style.background = "#e5e7eb"),
      );
      cancelButton.addEventListener(
        "mouseleave",
        () => (cancelButton.style.background = "#f3f4f6"),
      );
      cancelButton.onclick = () => document.body.removeChild(overlay);

      const addButton = document.createElement("button");
      addButton.textContent = "Add Link";
      addButton.style.cssText =
        "padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 500; background: #3b82f6; color: white; border: none; cursor: pointer;";
      addButton.addEventListener(
        "mouseenter",
        () => (addButton.style.background = "#2563eb"),
      );
      addButton.addEventListener(
        "mouseleave",
        () => (addButton.style.background = "#3b82f6"),
      );
      addButton.onclick = () => {
        const text = textInput.value.trim();
        const href = urlInput.value.trim();
        if (text && href) {
          editor
            .chain()
            .focus()
            .insertContent({
              type: "text",
              text: text,
              marks: [
                {
                  type: "link",
                  attrs: { href: href, target: "_blank" },
                },
              ],
            })
            .run();
          document.body.removeChild(overlay);
        } else {
          if (!text) {
            textInput.style.borderColor = "#ef4444";
            textInput.focus();
          } else if (!href) {
            urlInput.style.borderColor = "#ef4444";
            urlInput.focus();
          }
        }
      };

      buttonContainer.appendChild(cancelButton);
      buttonContainer.appendChild(addButton);
      dialog.appendChild(title);
      dialog.appendChild(textLabel);
      dialog.appendChild(textInput);
      dialog.appendChild(urlLabel);
      dialog.appendChild(urlInput);
      dialog.appendChild(buttonContainer);
      overlay.appendChild(dialog);
      overlay.onclick = (e) => {
        if (e.target === overlay) document.body.removeChild(overlay);
      };
      document.body.appendChild(overlay);
      textInput.focus();

      const handleEnter = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addButton.click();
        } else if (e.key === "Escape") {
          document.body.removeChild(overlay);
        }
      };
      textInput.addEventListener("keydown", handleEnter);
      urlInput.addEventListener("keydown", handleEnter);
    },
  },
  {
    title: "Image",
    description: "Upload an image from your computer.",
    searchTerms: ["photo", "picture", "media"],
    icon: <ImageIcon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          // Unique ID for this upload
          const uploadId = `__uploading__${Date.now()}_${Math.random()}`;

          (editor.chain().focus() as any)
            .setImage({
              src: uploadId,
              uploading: true,
              width: "full",
              height: "auto",
              align: "full",
              alt: "",
              caption: "",
            })
            .run();

          const findPlaceholder = () => {
            let placeholderPos = -1;
            editor.state.doc.descendants((node: any, pos: number) => {
              if (node.type.name === "image" && node.attrs.src === uploadId) {
                placeholderPos = pos;
              }
            });
            return placeholderPos;
          };

          try {
            const url = await uploadImage(file);
            const currentPos = findPlaceholder();
            if (currentPos >= 0) {
              editor
                .chain()
                .focus()
                .command(({ tr }: any) => {
                  const node = editor.state.schema.nodes["image"]?.create({
                    src: url,
                    uploading: false,
                    width: "full",
                    height: "auto",
                    align: "full",
                    alt: "",
                    caption: "",
                  });
                  tr.replaceWith(currentPos, currentPos + 1, node);
                  return true;
                })
                .run();
            }
          } catch (error) {
            const currentPos = findPlaceholder();
            if (currentPos >= 0) {
              editor
                .chain()
                .focus()
                .command(({ tr }: any) => {
                  tr.delete(currentPos, currentPos + 1);
                  return true;
                })
                .run();
            }
            console.error("Image upload error:", error);
            alert(
              error instanceof Error ? error.message : "Failed to upload image",
            );
          }
        }
      };
      input.click();
    },
  },
  {
    title: "YouTube",
    description: "Embed a YouTube video.",
    searchTerms: ["youtube", "video", "embed"],
    icon: <Youtube size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      const url = prompt("Enter YouTube URL:");
      if (url) {
        const match = url.match(
          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
        );
        if (match && match[1]) {
          const videoId = match[1];
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          editor
            .chain()
            .focus()
            .insertContent({
              type: "youtube",
              attrs: { src: embedUrl },
            })
            .run();
        } else {
          alert("Invalid YouTube URL");
        }
      }
    },
  },
]);

export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});
