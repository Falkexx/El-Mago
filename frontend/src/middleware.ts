import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function middleware(req: NextRequest) {
  // Obter o token de autenticação do usuário
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Verificar se o usuário está autenticado e tentando acessar a página de login
  const pathname = req.nextUrl.pathname;
  const isLoginPage = pathname === '/login' || pathname.match(/^\/(pt|en)\/login$/);

  if (token && isLoginPage) {
    // Obter a localidade atual (ex.: 'pt' ou 'en')
    const locale = pathname.split('/')[1] || 'en'; // Default para 'en' se não houver localidade
    // Redirecionar para a página inicial com a localidade correta
    const redirectUrl = new URL(`/${locale}`, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Executar o middleware do next-intl para rotas internacionalizadas
  const intlMiddleware = createMiddleware(routing);
  return intlMiddleware(req);
}

export const config = {
  // Match apenas caminhos internacionalizados e a raiz
  matcher: ['/', '/(pt|en)/:path*'],
};