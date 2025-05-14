import Footer3 from "@/components/footer/footer-3";
import Header3 from "@/components/header/header-3";
import DefaultFooter from "@/components/footer/default";
import { getCurrentUser } from "@/lib/session";
import Navbar from "../common-v2/nav";
import Footer from "../common-v2/footer";

const Wrapper = async ({ children, disableFooter = false }) => {
  const session = await getCurrentUser();

  return (
    <div className="tw:min-h-dvh tw:flex tw:flex-col">
      <Navbar session={session} />
      {children}
      {disableFooter ? null : <Footer />}
    </div>
  );
};

export default Wrapper;
