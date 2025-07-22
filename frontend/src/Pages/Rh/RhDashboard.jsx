
import TopBanner from '../../components/TopBar';
import WelcomeMessage from '../../components/WelcomeMessage';
import EquipmentStatus from '../../components/equipementStatus';
import LinksWidget from '../../components/LinkWidget';
import CommunitiesBanner from '../../components/ComunitiesBanner';
import UserCardCarousel from '../../components/UserCardCarrousel';

const RhDashboard = () => {
  const usersToday = [
    {
    name: 'Alejandro Noriega',
    note: 'First day',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: 'JUL 15',
    },
    {
    name: 'Amalia Alcalá',
    note: 'First day',
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
    date: 'JUL 15',
    },
  ];

     return (
    <div className="bg-transparent min-h-screen pt-8">
      <TopBanner />

      <div className="max-w-7xl mx-auto  px-6 py-6 relative bg-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-gradient-to-bl from-[#5596F6] from-20% via-[#10B881] via-40% to-transparent to-50%" />
        
        <WelcomeMessage name={usersToday[0]?.name} />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Today in CRM</h2>
            {usersToday && usersToday.length > 0 && (
              <UserCardCarousel users={usersToday} />
            )}
          </section>

          <aside className="flex flex-col gap-6">
            <EquipmentStatus />
            <LinksWidget />
          </aside>
        </div>

        <div className="mt-8 px-6">
          <CommunitiesBanner />
        </div>
      </div>
    </div>
  );

};

export default RhDashboard;
