export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString(undefined, { 
    hour: 'numeric', 
    minute: '2-digit'
  });
}

export function formatMessageDate(timestamp: string): string {
  const date = new Date(timestamp);
  const today = new Date();
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  
  return date.toLocaleDateString();
}