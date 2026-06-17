'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'system-ui, sans-serif',
      color: '#333',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 500 }}>Redirecting to Admin Dashboard...</p>
        <span style={{ fontSize: '0.9rem', color: '#666' }}>Please wait...</span>
      </div>
    </div>
  );
}
