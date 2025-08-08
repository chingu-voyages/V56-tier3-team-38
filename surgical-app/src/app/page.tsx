'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main>
      <div className="container mx-auto p-4 text-center min-h-[70vh] flex flex-col justify-center lg:text-left">
        <div className="flex items-center gap-x-4">
          <div className="space-y-6">
            <h1 className="font-bold text-5xl">Track Surgery Progress in Real Time</h1>
            <p>
              Stay informed and reduce stress during surgical procedures. Our real-time status board
              keeps family and staff updated every step of the way.
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
              <Button onClick={() => router.push('/patient')}>View Status as Guest</Button>
              <Button onClick={() => router.push('/login')} variant="secondary">
                Login as Staff
              </Button>
            </div>
          </div>
          <Image
            src="/images/hospital-waiting-room.webp"
            alt="Hospital Waiting Room"
            priority
            width={1200}
            height={768}
            className="rounded hidden lg:block max-w-2xl"
          />
        </div>
      </div>
    </main>
  );
}
