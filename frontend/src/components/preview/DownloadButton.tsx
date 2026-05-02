'use client';

import DownloadIcon from '@mui/icons-material/Download';
import { downloadTextFile } from '@/lib/download';
import { Button } from '../ui/Button';

interface Props {
  fileName: string;
  content: string;
}

export function DownloadButton({ fileName, content }: Props) {
  return (
    <Button
      size="small"
      startIcon={<DownloadIcon />}
      onClick={() => downloadTextFile(fileName, content)}
      disabled={!content}
      type="button"
    >
      Download file
    </Button>
  );
}
