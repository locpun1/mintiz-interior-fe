// src/components/HtmlRenderer.tsx
import { FC } from 'react';
import DOMPurify from 'dompurify';

const HtmlRenderer: FC<{ htmlContent: string }> = ({ htmlContent }) => {
  const cleanHtml = DOMPurify.sanitize(htmlContent);
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};

export default HtmlRenderer;