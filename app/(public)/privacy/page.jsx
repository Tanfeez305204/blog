import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { listCategories } from "@/lib/blog-data";

export const metadata = {
  title: "Privacy Policy | Qalam Blog",
  description: "Our privacy policy explains how we collect, use, and protect your data.",
};

export default async function PrivacyPolicy() {
  const categories = await listCategories().catch(() => []);

  return (
    <>
      <Navbar categories={categories} />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-heading text-5xl md:text-6xl font-bold leading-tight mb-4">Privacy Policy</h1>
          <p className="text-stone-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="prose prose-stone max-w-none space-y-8 text-stone-700">
          <section>
            <h2 className="font-heading text-2xl font-bold text-stone-900 mb-4">1. Introduction</h2>
            <p>
              Welcome to Qalam Blog Studio ("we," "us," "our," or "Company"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-stone-900 mb-4">2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Information You Provide:</strong> Name, email address, and other details when you subscribe or comment</li>
              <li><strong>Automatic Information:</strong> Browser type, IP address, pages visited, and time spent on pages</li>
              <li><strong>Cookies:</strong> We use cookies to enhance your browsing experience</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-stone-900 mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Provide, operate, and maintain our website</li>
              <li>Send newsletters and updates to subscribers</li>
              <li>Respond to your comments and inquiries</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Improve our content and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-stone-900 mb-4">4. Sharing Your Information</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist in our operations, under strict confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-stone-900 mb-4">5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-stone-900 mb-4">6. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. To do so, please contact us using the information provided below.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-stone-900 mb-4">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be effective when posted to the website.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-stone-900 mb-4">8. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-3">
              Email: ahmadtanfeez786@gmail.com<br />
              Blog: Qalam Blog Studio
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
