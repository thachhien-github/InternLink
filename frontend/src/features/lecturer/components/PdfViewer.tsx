import { Document, Page, pdfjs } from "react-pdf";

// PDF.js worker must be configured in the same module where <Document>/<Page> render.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PdfViewerProps {
  file: { url: string; httpHeaders?: Record<string, string> };
  pageNumber: number;
  scale: number;
  onLoadStart?: () => void;
  onLoadSuccess: (numPages: number) => void;
  onLoadError: (message: string) => void;
}

export const PdfViewer = ({
  file,
  pageNumber,
  scale,
  onLoadStart,
  onLoadSuccess,
  onLoadError,
}: PdfViewerProps) => (
  <Document
    file={file}
    onLoadStart={onLoadStart}
    onLoadSuccess={({ numPages }) => onLoadSuccess(numPages)}
    onLoadError={(err) =>
      onLoadError(
        err instanceof Error ? err.message : "Không thể tải tài liệu PDF.",
      )
    }
    loading={
      <div className="text-center py-20 text-slate-400 text-xs font-medium">
        Đang tải tài liệu PDF…
      </div>
    }
    error={
      <div className="text-center py-20 text-rose-300 text-xs font-medium">
        Không thể hiển thị tài liệu PDF.
      </div>
    }
    noData={
      <div className="text-center py-20 text-slate-400 text-xs font-medium">
        Tài liệu PDF không có dữ liệu.
      </div>
    }
  >
    <div className="w-fit mx-auto bg-white rounded-md shadow-md border border-slate-200 overflow-hidden">
      <Page
        pageNumber={pageNumber}
        scale={scale}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        canvasBackground="#ffffff"
      />
    </div>
  </Document>
);

export default PdfViewer;