import UserPanel from '@/app/[locale]/components/UserProfile/UserPanel/index'
import UserCredentials from '../components/UserProfile/UserCredentials';
function page() {
  return ( 
    <section className='px-32 w-full'>
      <main className='flex flex-row gap-6'>

        <UserPanel/>

        <UserCredentials/>

      </main>
    </section>
   );
}

export default page;