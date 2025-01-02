import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AsyncBoundary } from '../components/common/AsyncBoundary';

// Import MainLayout directly since it's a core layout component
import MainLayout from '../components/layout/MainLayout';

// Lazy load pages with descriptive chunk names
const ForYou = lazy(() => import(/* webpackChunkName: "for-you" */ '../pages/ForYou'));
const Live = lazy(() => import(/* webpackChunkName: "live" */ '../pages/Live')); 
const Upload = lazy(() => import(/* webpackChunkName: "upload" */ '../pages/Upload'));
const Profile = lazy(() => import(/* webpackChunkName: "profile" */ '../pages/Profile'));
const Messages = lazy(() => import(/* webpackChunkName: "messages" */ '../pages/Messages'));

export default function AppRoutes() {
  return (
    <AsyncBoundary>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ForYou />} />
          <Route path="live" element={<Live />} />
          <Route path="upload" element={<Upload />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </AsyncBoundary>
  );
}