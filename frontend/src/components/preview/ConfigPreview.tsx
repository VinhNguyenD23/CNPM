'use client';

import { GenerateDeployConfigResponse } from '@/types/deploy-config';
import { CopyButton } from './CopyButton';
import { DownloadButton } from './DownloadButton';

interface Props {
  result?: GenerateDeployConfigResponse;
}

export function ConfigPreview({ result }: Props) {
  const content = result?.config ?? '# Config preview appears here after generation.';

  return (
    <section className="flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-950 p-5 shadow-2xl shadow-slate-200">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Preview</h2>
          <p className="text-sm text-slate-400">{result?.fileName ?? 'No file generated yet'}</p>
        </div>
        <div className="flex gap-2">
          <CopyButton content={result?.config ?? ''} />
          <DownloadButton fileName={result?.fileName ?? 'deploy-config.txt'} content={result?.config ?? ''} />
        </div>
      </div>
      <pre className="min-h-[520px] flex-1 overflow-auto rounded-2xl bg-slate-900 p-4 text-sm leading-6 text-emerald-100">
        <code>{content}</code>
      </pre>
    </section>
  );
}
