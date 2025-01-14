import UserPanel from '@/app/[locale]/components/UserProfile/UserPanel/index'
import UserCredentials from '../components/UserProfile/UserCredentials';

import AffiliatePanel from "@/app/[locale]/components/AffiliateProfile/AffiliatePanel"
import AffiliateCredentials from "@/app/[locale]/components/AffiliateProfile/AffiliateCredentials/index"

function page() {
  return ( 
    <section className='px-32 w-full'>
      <main className='flex flex-row gap-6'>

        {/*
        
        <UserPanel/>

        <UserCredentials/>
        */}

        <AffiliatePanel/>
        <AffiliateCredentials/>

      </main>
    </section>
   );
}

export default page;