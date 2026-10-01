import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";

/**
 * Storefront layout — wraps all public-facing routes.
 * The root layout (app/layout.tsx) only renders <html>/<body>/fonts/global CSS.
 * This layout adds the storefront chrome: floating Navbar and CartDrawer.
 */
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      {children}
    </>
  );
}
