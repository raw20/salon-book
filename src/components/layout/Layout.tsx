import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function Layout() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="mt-8">
        {/* Outlet for nested routes will be rendered here */}
      </div>
      <Footer />
    </div>
  );
}
