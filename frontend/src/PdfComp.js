import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // Add CSS for annotations if needed

function PdfComp({ pdfFile }) {
  const [numPages, setNumPages] = useState(0);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-div">
      <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={index} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  );
}

export default PdfComp;
