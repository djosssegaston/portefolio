import { Header, Footer } from "@/components/layout";
import FloatingChart from "@/components/shared/FloatingChart";
import AnimatedBackground from "@/components/shared/AnimatedBackground";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <AnimatedBackground />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingChart />
    </>
  );
}
