
import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

const TextFormatter: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Parse and render formatted text
  const parseFormatting = (text: string) => {
    // Replace **bold** with bold text
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace *italic* with italic text
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Replace [link text](url) with hyperlink
    formattedText = formattedText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-gray-600 underline">$1</a>');
    
    // Replace newlines with <br/>
    formattedText = formattedText.replace(/\n/g, '<br/>');
    
    return formattedText;
  };

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: parseFormatting(text) }}
    />
  );
};

export default TextFormatter;
