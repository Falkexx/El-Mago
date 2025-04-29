import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function middleware(req: NextRequest) {
  // Obter o token de autenticação
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Extrair pathname e localidade
  const pathname = req.nextUrl.pathname;
  const locale = pathname.split('/')[1] || 'en'; // Default para 'en' se não houver localidade

  // Proteger rotas privadas (qualquer rota sob /[locale]/(private))
  const isPrivateRoute = pathname.match(/^\/(pt|en)\/(profile|dashboard|settings)(\/.*)?$/);
  if (isPrivateRoute && !token) {
    const loginUrl = new URL(`/${locale}/login`, req.url);
    // Opcional: armazenar a URL original para redirecionar após login
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirecionar usuários autenticados que tentam acessar /login
  const isLoginPage = pathname === '/login' || pathname.match(/^\/(pt|en)\/login$/);
  if (token && isLoginPage) {
    const redirectUrl = new URL(`/${locale}`, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Executar o middleware do next-intl
  const intlMiddleware = createMiddleware(routing);
  return intlMiddleware(req);
}

export const config = {
  // Matcher para cobrir todas as rotas, incluindo as privadas
  matcher: ['/', '/(pt|en)/:path*'],
};