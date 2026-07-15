import { ReactNode } from 'react';

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">Novanox</h1>
          <p className="text-muted-foreground mt-1">
            Multi-tenant SaaS Platform
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

export { AuthLayout };
