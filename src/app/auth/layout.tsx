import { requireAdmin } from '@/action/auth.action';
import { LayoutProps } from "@/config/props";
import HydrogenLayout from "@/layouts/hydrogen/layout";
const Layout = async ({ children }: LayoutProps) => {
  await requireAdmin();

  // if (layout === LAYOUT_OPTIONS.HELIUM) {
  //   return <HeliumLayout>{children}</HeliumLayout>;
  // }
  // if (layout === LAYOUT_OPTIONS.LITHIUM) {
  //   return <LithiumLayout>{children}</LithiumLayout>;
  // }
  // if (layout === LAYOUT_OPTIONS.BERYLLIUM) {
  //   return <BerylLiumLayout>{children}</BerylLiumLayout>;
  // }
  // if (layout === LAYOUT_OPTIONS.BORON) {
  //   return <BoronLayout>{children}</BoronLayout>;
  // }
  // if (layout === LAYOUT_OPTIONS.CARBON) {
  //   return <CarbonLayout>{children}</CarbonLayout>;
  // }

  return (
    <HydrogenLayout>{children}</HydrogenLayout>
  );
};

export default Layout;