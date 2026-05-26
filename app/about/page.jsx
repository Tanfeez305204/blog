import Image from "next/image";

export const metadata = {
  title: "About Us | Qalam Studio",
  description: "Learn about Qalam Studio, our mission, vision, team, and why you can trust us for trending news and insights.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-heading text-4xl font-bold mb-6 text-accent">About Qalam Studio</h1>
      <section className="mb-8">
        <p className="text-lg leading-8 mb-4">
          Qalam Studio is India’s go-to destination for trending news, insightful articles, and in-depth analysis on the topics that matter most. Founded by passionate writers and digital creators, our mission is to empower readers with accurate, timely, and engaging content. We believe in the power of information to inspire, educate, and connect people across the country and beyond.
        </p>
        <p className="text-lg leading-8 mb-4">
          Our vision is to become the most trusted source for trending topics, from technology and business to culture, sports, and social change. We are committed to journalistic integrity, transparency, and a reader-first approach in everything we do.
        </p>
        <p className="text-lg leading-8 mb-4">
          At Qalam Studio, we combine cutting-edge digital tools with a human touch. Our editorial team curates and creates content that is not only informative but also actionable and relevant to your daily life. Whether you’re a student, professional, or lifelong learner, you’ll find something valuable here every day.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="font-heading text-2xl font-bold mb-4">Meet the Team</h2>
        <div className="flex items-center gap-6 bg-white dark:bg-gray-900 rounded-xl p-6 shadow">
          <Image src="/public/team/author1.jpg" alt="Priya Sharma" width={80} height={80} className="rounded-full object-cover" />
          <div>
            <h3 className="font-bold text-lg">Priya Sharma</h3>
            <p className="text-stone-600 dark:text-stone-300">Founder & Chief Editor</p>
            <p className="text-sm mt-2">Priya is a seasoned journalist with a decade of experience in digital media, passionate about making complex topics accessible to everyone.</p>
          </div>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="font-heading text-2xl font-bold mb-4">Why Trust Us?</h2>
        <ul className="list-disc pl-6 text-lg leading-8">
          <li>All articles are thoroughly researched and fact-checked.</li>
          <li>We cite credible sources and provide references where needed.</li>
          <li>Our team includes subject-matter experts and experienced writers.</li>
          <li>We are transparent about our editorial process and corrections.</li>
          <li>Your privacy and trust are our top priorities.</li>
        </ul>
      </section>
      <section>
        <h2 className="font-heading text-2xl font-bold mb-4">Our Mission & Vision</h2>
        <p className="text-lg leading-8">
          Our mission is to inform, inspire, and empower our readers with the latest trends and stories that shape our world. We envision a community where knowledge is shared freely, and every voice is heard. Thank you for being part of the Qalam Studio family!
        </p>
      </section>
    </main>
  );
}
