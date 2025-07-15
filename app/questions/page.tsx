// app/questions/page.tsx
'use client';

import Navigation from '@/components/sections/Navigation';
import Questions from '@/components/sections/Questions';

export default function QuestionsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-black pt-20 pb-12">
        <Questions />
      </main>
    </>
  );
}
