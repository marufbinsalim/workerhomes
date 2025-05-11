import Footer from "@/components/common-v2/footer";
import Navbar from "@/components/common-v2/nav";
import Dashboard from "@/components/dashboard-v2/dashboard";

export default function Test() {
  return (
    <div className="tw:flex tw:flex-col tw:min-h-screen">
      <Navbar />
      <main className="tw:flex-grow tw:pt-16">
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
}
