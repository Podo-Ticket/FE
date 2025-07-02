import {Outlet} from 'react-router-dom';
import TabBar from '@/components/layout/footers/FooterNav';

const AdminLayout = () => {
  return (
    <>
      <Outlet />
      <TabBar />
    </>
  );
};

export default AdminLayout;
