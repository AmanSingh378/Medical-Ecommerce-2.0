import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <SignUp />
    </div>
  );
}
