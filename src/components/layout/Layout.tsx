import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function Layout() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Header />
      <div className="mt-8">
        {/* Outlet for nested routes will be rendered here */}
      </div>
      <Footer />
    </div>
  );
}
