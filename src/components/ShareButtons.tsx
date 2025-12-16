import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, EmailShareButton } from 'react-share';
import { Facebook, Twitter, Linkedin, Mail, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  summary: string;
}

export function ShareButtons({ url, title, summary }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== 'undefined' ? window.location.origin + url : url;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently ignore clipboard errors (e.g. unsupported browser)
    }
  };

  return (
    <div className="share-buttons">
      <span className="share-label">Share:</span>
      <FacebookShareButton url={fullUrl} hashtag="#AI">
        <Facebook size={18} aria-hidden="true" />
      </FacebookShareButton>
      <TwitterShareButton url={fullUrl} title={title}>
        <Twitter size={18} aria-hidden="true" />
      </TwitterShareButton>
      <LinkedinShareButton url={fullUrl} title={title} summary={summary}>
        <Linkedin size={18} aria-hidden="true" />
      </LinkedinShareButton>
      <EmailShareButton url={fullUrl} subject={title} body={summary}>
        <Mail size={18} aria-hidden="true" />
      </EmailShareButton>
      <button
        onClick={handleCopyLink}
        className="share-copy-button"
        aria-label="Copy link"
        title="Copy link"
      >
        {copied ? '✓' : <LinkIcon size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}
