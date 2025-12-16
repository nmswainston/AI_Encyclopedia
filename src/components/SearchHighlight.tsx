interface SearchHighlightProps {
  text: string;
  query: string;
}

export function SearchHighlight({ text, query }: SearchHighlightProps) {
  if (!query.trim()) {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  
  return (
    <>
      {parts.map((part, index) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={`${part}-${index}`} className="search-highlight">{part}</mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      )}
    </>
  );
}
