import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

function AdminLayout({
  children
}) {
  return (
    <div className="d-flex">

      <AdminSidebar />

      <div
        className="flex-grow-1 bg-light"
        
      >
        <AdminHeader />

        <div className="p-4">
          {children}
        </div>

      </div>

    </div>
  );
}

export default AdminLayout;