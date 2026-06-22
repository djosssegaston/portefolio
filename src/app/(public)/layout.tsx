import { Header, Footer } from "@/components/layout";
import ChatbotModal from "@/components/chatbot/ChatbotModal";
import AnimatedBackground from "@/components/shared/AnimatedBackground";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <AnimatedBackground />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <ChatbotModal />
    </>
  );
}
