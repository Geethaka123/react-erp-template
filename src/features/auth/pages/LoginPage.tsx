import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { ThemeToggle } from "@/components/ui/ThemeToggle"

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginCredentials = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
      // Use toast later
    } catch (error) {
      // Use toast later
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Theme Toggle in top right */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Professional Background elements */}
      <div className="absolute inset-0 z-0 text-primary/5">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-background" />
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/20 to-transparent" />
        {/* Subtle decorative grid/lines */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(var(--primary) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="w-full max-w-md p-4 relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-black tracking-tighter uppercase text-primary mb-2 drop-shadow-sm">Enterprise ERP</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-bold">Secure Access Terminal</p>
        </div>

        <Card className="glass border-t-4 border-t-primary bg-card/40 backdrop-blur-xl shadow-2xl relative overflow-hidden group/card">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-primary/50 to-transparent" />
          <CardHeader className="border-b border-border/40 bg-muted/30">
            <CardTitle className="text-lg font-black tracking-widest uppercase text-foreground/80">Identity verification</CardTitle>
            <CardDescription className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Authorization required for mainframe sync</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-focus-within:text-primary transition-colors">Credential Identifier</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@enterprise.io"
                  className="bg-background/80 border-border focus-visible:ring-primary/40 focus-visible:border-primary/50 text-foreground"
                  {...register('email')}
                />
                {errors.email && <p className="text-xs text-destructive font-bold uppercase tracking-tight">{errors.email.message}</p>}
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-focus-within:text-primary transition-colors">Authorization Vector</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="bg-background/80 border-border focus-visible:ring-primary/40 focus-visible:border-primary/50 text-foreground"
                  {...register('password')}
                />
                {errors.password && <p className="text-xs text-destructive font-bold uppercase tracking-tight">{errors.password.message}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full font-black uppercase tracking-[0.2em] py-6 shadow-md hover:shadow-lg transition-all" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Synchronizing...</span>
                  </div>
                ) : 'Execute Login'}
              </Button>
            </form>
          </CardContent>
          <div className="px-6 py-4 bg-muted/20 border-t border-border/40 flex justify-center">
             <p className="text-[9px] text-muted-foreground font-bold tracking-[0.3em] uppercase opacity-70">Industrial Grade Security 010.4.18</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
