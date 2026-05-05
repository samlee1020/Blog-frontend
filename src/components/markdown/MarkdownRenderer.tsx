import ReactMarkdown from 'react-markdown'
import { toAssetUrl } from '../../utils/asset'
import { markdownRehypePlugins, markdownRemarkPlugins } from './options'

export function MarkdownRenderer({ content }: { content?: string | null }) {
  if (!content) return null

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={markdownRemarkPlugins}
        rehypePlugins={markdownRehypePlugins}
        components={{
          img: ({ src = '', alt = '' }) => (
            <img src={toAssetUrl(src)} alt={alt} className="rounded-lg border border-slate-200" />
          ),
          a: ({ href = '', children }) => (
            <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
