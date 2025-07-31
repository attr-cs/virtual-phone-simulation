import Phone from '@/components/phone';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-zinc-900 p-4">
      <h1 className="text-4xl font-headline font-bold text-primary mb-2">Pocketverse</h1>
      <p className="text-muted-foreground mb-8">Your world in your pocket.</p>
      <Phone />
    </main>
  );
}
