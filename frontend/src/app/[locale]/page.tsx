import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
 
export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div>
      <h1 className='text-primary-800'>{t('title')} vamooos deu tudo certop</h1>
      <Link href="/about">{t('about')}</Link>
    </div>
  );
}