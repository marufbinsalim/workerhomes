import Footer3 from "@/components/footer/footer-3";
import Header3 from "@/components/header/header-3";
import DefaultFooter from "@/components/footer/default";
import { getCurrentUser } from "@/lib/session";

const Wrapper = async ({
  children,
  defaultFooter = false,
  disableFooter = false,
}) => {
  const session = await getCurrentUser();

  return (
    <div>
      <Header3 user={session} />
      {children}
      {disableFooter ? null : <Footer3 />}
    </div>
  );
};

export default Wrapper;
