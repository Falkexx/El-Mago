import nookies from "nookies";
import { useRouter } from "next/navigation";
import { redirect } from '@/i18n/routing';

export default function ChangeLocale(newLocale: string, actualLocale: string, pathName: string) {
  const router = useRouter();

  console.log('chegou aqui', newLocale, actualLocale, pathName)
  // Set cookie

  const allcookies = document.cookie
  console.log(allcookies)

  // Build new path
  const newPath = pathName.replace(`/${actualLocale}`, `/${newLocale}`);
  console.log("Redirecting to:", newPath);

  // Redirect
}
