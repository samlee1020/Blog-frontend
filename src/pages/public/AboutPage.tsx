import { Mail, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { siteApi } from '../../api/site'
import { PageState } from '../../components/common/PageState'
import { MarkdownWithOutline } from '../../components/markdown/MarkdownWithOutline'
import type { ProfileView } from '../../types/domain'
import { toAssetUrl } from '../../utils/asset'

export function AboutPage() {
  const [profile, setProfile] = useState<ProfileView | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      setProfile(await siteApi.profile())
    } catch (err) {
      setError(err instanceof Error ? err.message : '信息页加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <PageState loading={loading} error={error} onRetry={load}>
        {profile ? (
          <section className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {profile.avatarImageUrl ? <img src={toAssetUrl(profile.avatarImageUrl)} alt={profile.displayName} className="h-full w-full object-cover" /> : null}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-950">{profile.displayName}</h1>
                {profile.bio ? <p className="mt-2 leading-7 text-slate-600">{profile.bio}</p> : null}
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                  {profile.email ? <span className="inline-flex items-center gap-1"><Mail size={15} /> {profile.email}</span> : null}
                  {profile.location ? <span className="inline-flex items-center gap-1"><MapPin size={15} /> {profile.location}</span> : null}
                </div>
              </div>
            </div>
            {profile.socialLinks?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {profile.socialLinks.map((link) => (
                  <a key={`${link.label}-${link.url}`} href={link.url} target={link.url.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="rounded bg-blue-50 px-3 py-1 text-sm text-blue-700">
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
            <div className="mt-8 border-t border-slate-100 pt-8">
              <MarkdownWithOutline content={profile.contentMarkdown} />
            </div>
          </section>
        ) : null}
      </PageState>
    </main>
  )
}
