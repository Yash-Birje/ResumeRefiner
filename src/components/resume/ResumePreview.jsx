import { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import ModernTemplate from '../templates/ModernTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import MinimalistTemplate from '../templates/MinimalistTemplate';

const ResumePreview = ({ resume }) => {
  const [zoom, setZoom] = useState(100);

  const getTemplateComponent = () => {
    switch (resume?.template) {
      case 'classic':
        return <ClassicTemplate resume={resume} />;
      case 'minimalist':
        return <MinimalistTemplate resume={resume} />;
      case 'modern':
      default:
        return <ModernTemplate resume={resume} />;
    }
  };

  const handleZoomIn = () => {
    if (zoom < 150) setZoom(zoom + 10);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 10);
  };

  const handleFitWidth = () => {
    setZoom(100);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Zoom Controls */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-center space-x-4">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 50}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>

        <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
          {zoom}%
        </span>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= 150}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-gray-300" />

        <button
          onClick={handleFitWidth}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          title="Fit to width"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div
          id="resume-preview-content"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s'
          }}
        >
          {/* A4 sized container */}
          <div className="bg-white shadow-lg" style={{ width: '210mm', minHeight: '297mm' }}>
            {getTemplateComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
