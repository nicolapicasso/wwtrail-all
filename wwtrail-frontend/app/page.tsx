import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Mountain, Calendar, Users, Award, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Mountain className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Bienvenido a <span className="text-primary">WWTRAIL</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            La plataforma definitiva para descubrir, participar y organizar competiciones de trail running alrededor del mundo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/competitions">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Explorar Competiciones
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          ¿Por qué elegir WWTRAIL?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Calendar className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Encuentra Carreras</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Descubre competiciones de trail running cerca de ti o alrededor del mundo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Comunidad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Conéctate con otros apasionados del trail running y comparte experiencias
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Seguimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Registra tus logros y mantén un historial de todas tus carreras
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Mountain className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Organiza</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Herramientas completas para organizadores de eventos trail
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">✅ Estado del Proyecto - FASE 3</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <span><strong>FASE 1:</strong> Setup inicial (Next.js 14 + TypeScript + TailwindCSS)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <span><strong>FASE 2:</strong> API Client y Tipos (Axios + servicios + hooks)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <span><strong>FASE 3:</strong> Sistema de autenticación UI completado:</span>
              </div>
              <ul className="ml-8 space-y-1 text-sm text-muted-foreground">
                <li>✅ Shadcn/ui componentes instalados</li>
                <li>✅ Login page con validación</li>
                <li>✅ Register page con React Hook Form + Zod</li>
                <li>✅ Auth Context Provider</li>
                <li>✅ Protected routes (middleware)</li>
                <li>✅ Navbar con estado de usuario</li>
                <li>✅ Dashboard page</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
