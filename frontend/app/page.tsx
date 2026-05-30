"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { LandingPage } from './landing/page';
import { LoginPage } from './login/page';
import { SignUpPage } from './sign-up/page';

export default function Home() {
  const [view, setView] = useState<'landing' | 'login' | 'signup'>('landing');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // เช็คสถานะการ Login อัตโนมัติเมื่อเปิดหน้าเว็บ
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && loading) {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
        if (!token) {
          await auth.signOut();
        } else {
          // แยกหน้าตาม Role
          if (role === 'verifier') {
            router.push('/professor/request');
          } else {
            router.push('/user/overview');
          }
        }
      } else if (!user) {
        localStorage.removeItem("token");
        setView((prev) => (prev === 'login' || prev === 'signup' ? prev : 'landing'));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loading, router]);

  const goToLogin = () => setView('login');
  const goToSignUp = () => setView('signup');
  const goToLanding = () => setView('landing');
  const goToOverview = () => {
    router.push('/user/overview');
  };

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <main className="min-h-screen">
      {view === 'landing' && (
        <LandingPage
          onLoginClick={goToLogin}
          onSignUpClick={goToSignUp}
          onBackToLanding={goToLanding}
        />
      )}
      {view === 'login' && (
        <LoginPage
          onBackToLanding={goToLanding}
          onLoginSuccess={goToOverview}
        />
      )}
      {view === 'signup' && (
        <SignUpPage
          onBackToLanding={goToLanding}
        />
      )}
    </main>
  );
}
// "use client";

// import { useState } from 'react';
// import LandingPage from './landing/page';
// import { LoginPage } from './login/page';
// import { SignUpPage } from './sign-up/page';
// import {OverviewPage} from './user/overview/dash';
// import MyBadgesPage from './user/badges/mybadge';
// import Request_Professor from './professor/request/page';

// export default function Home() {



//   return (
    
    
//     // <LandingPage />
//      <OverviewPage/>
//      //<MyBadgesPage/>
//      //<Request_Professor />
//   );
// }
