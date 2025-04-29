import UserPanel from '@/app/[locale]/components/UserProfile/UserPanel/index'
import UserCredentials from '@/app/[locale]/components/UserProfile/UserCredentials/index';

import AffiliatePanel from "@/app/[locale]/components/AffiliateProfile/AffiliatePanel"
import AffiliateCredentials from "@/app/[locale]/components/AffiliateProfile/AffiliateCredentials/index"

function page() {
  return ( 
    <section className='px-32 w-full'>
      <main className='flex flex-row gap-6'>
        <UserPanel/>

      </main>
    </section>
   );
}

export default page;