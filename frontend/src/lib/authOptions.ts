import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const user = await res.json();


        if (!res.ok || !user?.access_token) {
          throw new Error(user?.message || 'Email ou senha inválidos');
        }

        const result = {
          id: user.id,
          name: user.name,
          email: user.email,
          token: user.access_token,

        }

        console.log(result)

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          token: user.access_token,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Apenas se o usuário logou agora (first login), adiciona os dados
      if (user) {
        console.log(user)
        token.accessToken = user.token;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;

        console.log(token.name)
      }
      return token;
    },
    async session({ session, token }) {
      // Aqui você propaga os dados para a session
      session.accessToken = token.accessToken;

      // Você precisa garantir que session.user contenha os dados
      session.user = {
        id: token.id as string,         // <- asserção para garantir tipo
        name: token.name as string,
        email: token.email as string,
      };
  
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
