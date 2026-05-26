import FAQ from "@/components/public/FAQ";

export const metadata = {
  title: "Contact Us | Qalam Studio",
  description: "Contact Qalam Studio for inquiries, feedback, or support. Find our email, social links, and FAQ section.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-heading text-4xl font-bold mb-6 text-accent">Contact Us</h1>
      <section className="mb-8">
        <form className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow flex flex-col gap-4">
          <label className="font-semibold">Name
            <input type="text" name="name" required className="mt-1 w-full rounded border border-stone-300 p-2" />
          </label>
          <label className="font-semibold">Email
            <input type="email" name="email" required className="mt-1 w-full rounded border border-stone-300 p-2" />
          </label>
          <label className="font-semibold">Message
            <textarea name="message" rows={5} required className="mt-1 w-full rounded border border-stone-300 p-2" />
          </label>
          <button type="submit" className="mt-2 rounded bg-accent px-6 py-2 font-bold text-white hover:bg-accent/90">Send Message</button>
        </form>
      </section>
      <section className="mb-8">
        <h2 className="font-heading text-2xl font-bold mb-2">Email & Social</h2>
        <p className="mb-2">Email: <a href="mailto:hello@qalamstudio.in" className="text-accent underline">hello@qalamstudio.in</a></p>
        <div className="flex gap-4">
          <a href="https://twitter.com/qalamstudio" target="_blank" rel="noopener" className="text-accent hover:underline">Twitter</a>
          <a href="https://facebook.com/qalamstudio" target="_blank" rel="noopener" className="text-accent hover:underline">Facebook</a>
          <a href="https://instagram.com/qalamstudio" target="_blank" rel="noopener" className="text-accent hover:underline">Instagram</a>
        </div>
      </section>
      <section>
        <h2 className="font-heading text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <FAQ />
      </section>
    </main>
  );
}
