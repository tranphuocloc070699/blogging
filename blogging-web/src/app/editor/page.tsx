"use client"

import React, {useState, useRef, useEffect} from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette
} from 'lucide-react';

const RichTextSliderEditor = () => {
  const [pages, setPages] = useState([
    {
      id: 1,
      content: '<h2>Trang đầu tiên</h2><p>Đây là nội dung của trang đầu tiên. Bạn có thể chỉnh sửa văn bản này bằng các công cụ formatting phía trên.</p><p>Hãy thử các tính năng như <strong>in đậm</strong>, <em>in nghiêng</em>, hoặc <u>gạch chân</u>.</p>'
    },
    {
      id: 2,
      content: '<h2>Trang thứ hai</h2><p>Chào mừng đến với trang thứ hai! Đây là một rich text editor với khả năng điều hướng bằng slider.</p><ul><li>Tính năng 1: Format văn bản</li><li>Tính năng 2: Điều hướng slider</li><li>Tính năng 3: Thêm/xóa trang</li></ul>'
    },
    {
      id: 3,
      content: '<h2>Trang cuối</h2><p style="text-align: center;">Nội dung này được căn giữa</p><p style="text-align: right;">Và đoạn này được căn phải</p><p>Bạn có thể thêm nhiều trang hơn bằng cách nhấn nút "Thêm trang".</p>'
    }
  ]);

  const [currentPage, setCurrentPage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef(null);

  const totalPages = pages.length;

  // Các lệnh format văn bản
  const formatText = (command: any, value: any = null) => {
    document.execCommand(command, false, value);
    updatePageContent();
  };

  // Cập nhật nội dung trang hiện tại
  const updatePageContent = () => {
    if (editorRef.current) {
      const newPages = [...pages];
      newPages[currentPage].content = (editorRef.current as any).innerHTML;
      setPages(newPages);
    }
  };

  // Điều hướng trang
  const goToPage = (pageIndex: any) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      updatePageContent();
      setCurrentPage(pageIndex);
    }
  };

  // Thêm trang mới
  const addPage = () => {
    const newPage = {
      id: Date.now(),
      content: '<h2>Trang mới</h2><p>Nội dung trang mới...</p>'
    };
    setPages([...pages, newPage]);
  };

  // Xóa trang hiện tại
  const deletePage = () => {
    if (totalPages > 1) {
      const newPages = pages.filter((_, index) => index !== currentPage);
      setPages(newPages);
      if (currentPage >= newPages.length) {
        setCurrentPage(newPages.length - 1);
      }
    }
  };

  // Xử lý phím tắt
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            formatText('bold');
            break;
          case 'i':
            e.preventDefault();
            formatText('italic');
            break;
          case 'u':
            e.preventDefault();
            formatText('underline');
            break;
          case 'ArrowLeft':
            e.preventDefault();
            goToPage(currentPage - 1);
            break;
          case 'ArrowRight':
            e.preventDefault();
            goToPage(currentPage + 1);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  return (
      <div
          className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold text-center">Rich Text Editor - Slider Mode</h1>
            <p className="text-center mt-2 opacity-90">Trang {currentPage + 1} / {totalPages}</p>
          </div>

          {/* Toolbar */}
          <div
              className="bg-gray-50 border-b border-gray-200 p-4 flex flex-wrap gap-2 justify-center">
            {/* Text Formatting */}
            <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
              <button
                  onClick={() => formatText('bold')}
                  className="p-2 hover:bg-blue-100 rounded transition-colors"
                  title="In đậm (Ctrl+B)"
              >
                <Bold size={18}/>
              </button>
              <button
                  onClick={() => formatText('italic')}
                  className="p-2 hover:bg-blue-100 rounded transition-colors"
                  title="In nghiêng (Ctrl+I)"
              >
                <Italic size={18}/>
              </button>
              <button
                  onClick={() => formatText('underline')}
                  className="p-2 hover:bg-blue-100 rounded transition-colors"
                  title="Gạch chân (Ctrl+U)"
              >
                <Underline size={18}/>
              </button>
            </div>

            {/* Alignment */}
            <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
              <button
                  onClick={() => formatText('justifyLeft')}
                  className="p-2 hover:bg-blue-100 rounded transition-colors"
                  title="Căn trái"
              >
                <AlignLeft size={18}/>
              </button>
              <button
                  onClick={() => formatText('justifyCenter')}
                  className="p-2 hover:bg-blue-100 rounded transition-colors"
                  title="Căn giữa"
              >
                <AlignCenter size={18}/>
              </button>
              <button
                  onClick={() => formatText('justifyRight')}
                  className="p-2 hover:bg-blue-100 rounded transition-colors"
                  title="Căn phải"
              >
                <AlignRight size={18}/>
              </button>
            </div>

            {/* Lists */}
            <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
              <button
                  onClick={() => formatText('insertUnorderedList')}
                  className="p-2 hover:bg-blue-100 rounded transition-colors"
                  title="Danh sách"
              >
                <List size={18}/>
              </button>
            </div>

            {/* Font Size */}
            <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
              <select
                  onChange={(e) => formatText('fontSize', e.target.value)}
                  className="p-2 border-none bg-transparent outline-none cursor-pointer"
                  title="Cỡ chữ"
              >
                <option value="1">Nhỏ</option>
                <option value="3" selected>Bình thường</option>
                <option value="5">Lớn</option>
                <option value="7">Rất lớn</option>
              </select>
            </div>

            {/* Text Color */}
            <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
              <input
                  type="color"
                  onChange={(e) => formatText('foreColor', e.target.value)}
                  className="w-8 h-8 border-none rounded cursor-pointer"
                  title="Màu chữ"
              />
            </div>

            {/* Page Actions */}
            <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
              <button
                  onClick={addPage}
                  className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
              >
                Thêm trang
              </button>
              {totalPages > 1 && (
                  <button
                      onClick={deletePage}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    Xóa trang
                  </button>
              )}
            </div>
          </div>

          {/* Editor Container */}
          <div className="relative bg-white">
            {/* Navigation Arrows */}
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all ${
                    currentPage === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-110'
                }`}
                title="Trang trước (Ctrl+←)"
            >
              <ChevronLeft size={24}/>
            </button>

            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all ${
                    currentPage === totalPages - 1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-110'
                }`}
                title="Trang sau (Ctrl+→)"
            >
              <ChevronRight size={24}/>
            </button>

            {/* Editor */}
            <div className="px-20 py-8">
              <div
                  ref={editorRef}
                  contentEditable={true}
                  className="min-h-96 p-8 border-2 border-dashed border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white shadow-inner"
                  dangerouslySetInnerHTML={{__html: pages[currentPage]?.content}}
                  onInput={updatePageContent}
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => setIsEditing(false)}
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '16px',
                    lineHeight: '1.6'
                  }}
              />
            </div>
          </div>

          {/* Page Indicators */}
          <div className="bg-gray-50 border-t border-gray-200 p-4">
            <div className="flex justify-center gap-2">
              {pages.map((_, index) => (
                  <button
                      key={index}
                      onClick={() => goToPage(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                          index === currentPage
                              ? 'bg-blue-500 scale-125'
                              : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      title={`Đến trang ${index + 1}`}
                  />
              ))}
            </div>
            <div className="text-center mt-3 text-sm text-gray-600">
              <p>💡 <strong>Phím tắt:</strong> Ctrl+B (đậm), Ctrl+I (nghiêng), Ctrl+U (gạch chân)</p>
              <p>Ctrl+← / Ctrl+→ để chuyển trang</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default RichTextSliderEditor;