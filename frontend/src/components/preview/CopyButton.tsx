'use client';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';
import { Button } from '../ui/Button';

interface Props {
  content: string;
}

export function CopyButton({ content }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button size="small" startIcon={<ContentCopyIcon />} onClick={handleCopy} disabled={!content} type="button">
      {copied ? 'Copied' : 'Copy config'}
    </Button>
  );
}
