import Contact from "@/components/sections/Contact";

export default function ContactPage() {
  return (
    <div className="pt-20">
      <div className="bg-gradient-to-b from-primary-50/50 to-background py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">Contactez-moi</h1>
          <p className="text-secondary-500 mt-4 max-w-2xl mx-auto text-lg">
            Discutons de votre projet et de la façon dont je peux vous aider
          </p>
        </div>
      </div>
      <Contact />
    </div>
  );
}
