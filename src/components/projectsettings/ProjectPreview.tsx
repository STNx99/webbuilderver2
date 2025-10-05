import React, { useRef, useState, useEffect } from "react";

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
}

interface ProjectPreviewProps {
  projectId: string;
  className?: string;
  colors?: ColorScheme;
}

export default function ProjectPreview({ projectId, className = "", colors }: ProjectPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const generateColorCSS = (colorScheme: ColorScheme) => {
    return `
      :root {
        --color-primary: ${colorScheme.primary};
        --color-secondary: ${colorScheme.secondary};
        --color-accent: ${colorScheme.accent};
        --primary: ${colorScheme.primary};
        --secondary: ${colorScheme.secondary};
        --accent: ${colorScheme.accent};
      }
      
      
      .text-primary, [class*="text-primary"] {
        color: ${colorScheme.primary} !important;
      }
      
      .border-primary, [class*="border-primary"] {
        border-color: ${colorScheme.primary} !important;
      }
      
    `;
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument || !colors) return;

    try {
      const doc = iframe.contentDocument;
      const existingStyle = doc.getElementById('color-override-styles');
      if (existingStyle) {
        existingStyle.remove();
      }

      const style = doc.createElement('style');
      style.id = 'color-override-styles';
      style.textContent = generateColorCSS(colors);
      doc.head.appendChild(style);
    } catch (error) {
      console.log('Could not update iframe colors:', error);
    }
  }, [colors]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    
    if (colors) {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentDocument) {
        const style = iframe.contentDocument.createElement('style');
        style.id = 'color-override-styles';
        style.textContent = generateColorCSS(colors);
        iframe.contentDocument.head.appendChild(style);
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <p className="text-sm text-gray-600">Loading preview...</p>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={`/editor/${projectId}?preview=true&hideUI=true`}
        className={`w-full border-0 bg-white rounded-b-lg ${className}`}
        style={{ minHeight: 520 }}
        title="Website Preview"
        onLoad={handleIframeLoad}
        sandbox="allow-same-origin allow-scripts allow-forms"
      />
      
      {colors && (
        <div className="absolute top-2 right-2 flex gap-1 bg-white/90 backdrop-blur-sm rounded-md p-1 shadow-sm">
          <div 
            className="w-3 h-3 rounded-full border border-white shadow-sm"
            style={{ backgroundColor: colors.primary }}
            title="Primary"
          />
          <div 
            className="w-3 h-3 rounded-full border border-white shadow-sm"
            style={{ backgroundColor: colors.secondary }}
            title="Secondary"
          />
          <div 
            className="w-3 h-3 rounded-full border border-white shadow-sm"
            style={{ backgroundColor: colors.accent }}
            title="Accent"
          />
        </div>
      )}
    </div>
  );
};
