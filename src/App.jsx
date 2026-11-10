import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Home from '@/pages/Home';
import Landing from '@/pages/Landing';
import AppLoader from '@/components/AppLoader';
import PageLoadingProvider from '@/components/loading/PageLoadingProvider';
import HelpReporter from '@/components/HelpReporter';
import ActivityTracker from '@/components/ActivityTracker';
import LaunchExperience from '@/components/LaunchExperience';
import AnimationSettingsProvider from '@/components/animation/AnimationSettingsProvider';
import { Suspense } from 'react';
import { MotionConfig } from 'framer-motion';
import { PERF_LITE } from '@/lib/perfMode';
import { lazyPage } from '@/lib/lazyPage';
// VT-39 (Claude, 2026-11-03): every page used to ship in ONE 3.1 MB bundle
// that phones had to download and parse before anything showed. Pages now
// load on demand; the four first-visit pages stay in the main bundle.
const ForgotPassword = lazyPage(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazyPage(() => import('@/pages/ResetPassword'));
const Terms = lazyPage(() => import('@/pages/Terms'));
const Privacy = lazyPage(() => import('@/pages/Privacy'));
const TeacherPayouts = lazyPage(() => import('@/pages/TeacherPayouts'));
const Quiz = lazyPage(() => import('@/pages/Quiz'));
const TeacherDashboard = lazyPage(() => import('@/pages/TeacherDashboard'));
const TeacherMaterials = lazyPage(() => import('@/pages/TeacherMaterials'));
const TeacherSkillHub = lazyPage(() => import('@/pages/TeacherSkillHub'));
const Pricing = lazyPage(() => import('@/pages/Pricing'));
const About = lazyPage(() => import('@/pages/About'));
const Contact = lazyPage(() => import('@/pages/Contact'));
const Leaderboard = lazyPage(() => import('@/pages/Leaderboard'));
const MyProgress = lazyPage(() => import('@/pages/MyProgress'));
const Settings = lazyPage(() => import('@/pages/Settings'));
const StudyTips = lazyPage(() => import('@/pages/StudyTips'));
const AdminDashboard = lazyPage(() => import('@/pages/AdminDashboard'));
const Analytics = lazyPage(() => import('@/pages/Analytics'));
const Roadmap = lazyPage(() => import('@/pages/Roadmap'));
const AssessorLab = lazyPage(() => import('@/pages/AssessorLab'));
const PlacementTest = lazyPage(() => import('@/pages/PlacementTest'));
const Grammar = lazyPage(() => import('@/pages/Grammar'));
const GrammarAssessment = lazyPage(() => import('@/pages/GrammarAssessment'));
const AdminWipeUsers = lazyPage(() => import('@/pages/AdminWipeUsers'));
const AdminPayments = lazyPage(() => import('@/pages/AdminPayments'));
const QrPayment = lazyPage(() => import('@/pages/QrPayment'));
const AdminQrPayments = lazyPage(() => import('@/pages/AdminQrPayments'));
const Console = lazyPage(() => import('@/pages/Console'));
const PaymentComplete = lazyPage(() => import('@/pages/PaymentComplete'));
const Onboarding = lazyPage(() => import('@/pages/Onboarding'));
const LessonRunner = lazyPage(() => import('@/pages/LessonRunner'));
const MyWords = lazyPage(() => import('@/pages/MyWords'));
const VocabReview = lazyPage(() => import('@/pages/VocabReview'));
const TeachStressTest = lazyPage(() => import('@/pages/TeachStressTest'));
const OAuthConsent = lazyPage(() => import('@/pages/OAuthConsent'));
const Achievements = lazyPage(() => import('@/pages/Achievements'));
const Developer = lazyPage(() => import('@/pages/Developer'));
const Taskboard = lazyPage(() => import('@/pages/Taskboard'));
const Coach = lazyPage(() => import('@/pages/Coach'));
const AnimationStudio = lazyPage(() => import('@/pages/AnimationStudio'));


const AuthenticatedApp = () => {
  const { user, isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return <AppLoader />;
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <>
      <LaunchExperience user={user} />
      <Suspense fallback={<AppLoader />}>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/oauth/consent" element={<OAuthConsent />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/landing" replace />} />}>
        <Route path="/" element={<Home />} />
        <Route path="/quiz/:unitKey" element={<Quiz />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/materials" element={<TeacherMaterials />} />
        <Route path="/teacher/skill-hub" element={<TeacherSkillHub />} />
        <Route path="/teacher/payouts" element={<TeacherPayouts />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/my-progress" element={<MyProgress />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/animation-studio" element={<AnimationStudio />} />
        <Route path="/study-tips" element={<StudyTips />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/assessor-lab" element={<AssessorLab />} />
        <Route path="/placement-test" element={<PlacementTest />} />
        <Route path="/grammar" element={<Grammar />} />
        {/* Practice now lives inside the /grammar node map (topic + stage layers). */}
        <Route path="/grammar/practice" element={<Navigate to="/grammar" replace />} />
        <Route path="/grammar/assessment" element={<GrammarAssessment />} />
        <Route path="/admin-wipe-users" element={<AdminWipeUsers />} />
        <Route path="/admin-payments" element={<AdminPayments />} />
        <Route path="/pay/qr" element={<QrPayment />} />
        <Route path="/admin-qr-payments" element={<AdminQrPayments />} />
        <Route path="/console" element={<Console />} />
        <Route path="/developer" element={<Developer />} />
        <Route path="/taskboard" element={<Taskboard />} />
        <Route path="/taskboard/:taskCode" element={<Taskboard />} />
        <Route path="/taskbar" element={<Taskboard />} />
        <Route path="/taskbar/:taskCode" element={<Taskboard />} />
        <Route path="/payment-complete" element={<PaymentComplete />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/lesson/:lessonId" element={<LessonRunner />} />
        <Route path="/coach" element={<Coach />} />
        <Route path="/my-words" element={<MyWords />} />
        <Route path="/vocab-review" element={<VocabReview />} />
        <Route path="/teach-stress-test" element={<TeachStressTest />} />
        <Route path="/quiz" element={<Navigate to="/" replace />} />
      </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      </Suspense>
      <ActivityTracker user={user} />
      <HelpReporter user={user} />
    </>
  );
};


function App() {

  return (
    // Lite mode (weak devices): framer-motion skips transform animations.
    <MotionConfig reducedMotion={PERF_LITE ? "always" : "user"}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AnimationSettingsProvider>
              <PageLoadingProvider>
                <AuthenticatedApp />
              </PageLoadingProvider>
            </AnimationSettingsProvider>
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App