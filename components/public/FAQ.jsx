import React from "react";

const faqs = [
  {
    question: "How can I submit a guest post or article?",
    answer: "You can submit your article ideas via our contact form or email us at hello@qalamstudio.in. Our editorial team will review and get back to you if it fits our content guidelines."
  },
  {
    question: "How do I subscribe to the newsletter?",
    answer: "Simply enter your email in the newsletter signup box on our homepage or blog pages. You’ll receive regular updates on trending topics."
  },
  {
    question: "Can I advertise on Qalam Studio?",
    answer: "Yes! For advertising and partnership inquiries, please contact us at hello@qalamstudio.in."
  },
  {
    question: "How do I report an error or request a correction?",
    answer: "If you spot an error or need a correction, use our contact form or email us. We value accuracy and transparency."
  },
  {
    question: "Is my personal information safe?",
    answer: "Absolutely. We take privacy seriously. Please read our Privacy Policy for details on how your data is handled."
  }
];

export default function FAQ() {
  return (
    <div className="divide-y divide-stone-200 dark:divide-stone-700">
      {faqs.map((faq, idx) => (
        <details key={idx} className="py-4 group">
          <summary className="cursor-pointer font-semibold text-stone-800 dark:text-stone-100 flex items-center justify-between">
            {faq.question}
            <span className="ml-2 text-accent group-open:rotate-90 transition-transform">▶</span>
          </summary>
          <p className="mt-2 text-stone-600 dark:text-stone-300 text-base leading-7">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
