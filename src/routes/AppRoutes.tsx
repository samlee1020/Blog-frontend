import { Route, Routes } from 'react-router-dom'
import { PublicLayout } from '../layouts/PublicLayout'
import { AdminLayout } from '../layouts/AdminLayout'
import { RequireAdmin } from './guards'
import { HomePage } from '../pages/public/HomePage'
import { ArticlesPage } from '../pages/public/ArticlesPage'
import { ArticleDetailPage } from '../pages/public/ArticleDetailPage'
import { AboutPage } from '../pages/public/AboutPage'
import { ProjectsPage } from '../pages/public/ProjectsPage'
import { ProjectDetailPage } from '../pages/public/ProjectDetailPage'
import { NotFoundPage } from '../pages/public/NotFoundPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminArticlesPage } from '../pages/admin/AdminArticlesPage'
import { AdminArticleEditorPage } from '../pages/admin/AdminArticleEditorPage'
import { AdminCategoriesTagsPage } from '../pages/admin/AdminCategoriesTagsPage'
import { AdminCommentsPage } from '../pages/admin/AdminCommentsPage'
import { AdminGuestsPage } from '../pages/admin/AdminGuestsPage'
import { AdminCoverPage } from '../pages/admin/AdminCoverPage'
import { AdminProfilePage } from '../pages/admin/AdminProfilePage'
import { AdminMediaPage } from '../pages/admin/AdminMediaPage'
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage'
import { AdminAccountPasswordPage } from '../pages/admin/AdminAccountPasswordPage'
import { AdminProjectsPage } from '../pages/admin/AdminProjectsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="articles/:slug" element={<ArticleDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:slug" element={<ProjectDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="403" element={<NotFoundPage status="403" title="没有权限访问该页面" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<RequireAdmin />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="articles" element={<AdminArticlesPage />} />
          <Route path="articles/new" element={<AdminArticleEditorPage />} />
          <Route path="articles/:id/edit" element={<AdminArticleEditorPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="categories-tags" element={<AdminCategoriesTagsPage />} />
          <Route path="comments" element={<AdminCommentsPage />} />
          <Route path="guests" element={<AdminGuestsPage />} />
          <Route path="cover" element={<AdminCoverPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="media" element={<AdminMediaPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="account/password" element={<AdminAccountPasswordPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
