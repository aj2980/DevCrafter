import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How does the AI Website Generator work?",
    answer:
      "Our AI-powered system uses WebContainers, TypeScript, and React to generate fully functional websites instantly. Just enter your website idea, and AI will generate the structure and code automatically.",
  },
  {
    question: "What technologies are used in this website generator?",
    answer:
      "This platform is built using WebContainers for live coding, TypeScript for scalable development, React for UI, Express.js for the backend, MongoDB for database management, and GitHub Open APIs for repository integration.",
  },
  {
    question: "Can I edit the generated website before publishing?",
    answer:
      "Yes! After the website is generated, you can customize the layout, content, and styles before publishing it live.",
  },
  {
    question: "Does it support GitHub integration?",
    answer:
      "Absolutely! You can save your generated projects directly to GitHub using the GitHub Open API integration.",
  },
  {
    question: "Do I need coding knowledge to use this?",
    answer:
      "Not at all! Our AI simplifies the process, making it accessible for both beginners and advanced developers.",
  },
  {
    question: "Can I export the generated website?",
    answer:
      "Yes, you can export the full website code, download it as a zip, or push it directly to GitHub for future modifications.",
  },
  {
    question: "Is the hosting provided?",
    answer:
      "We provide instant preview hosting, but you can deploy it permanently using your preferred hosting service.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br black from-blue-400 to-gray-800 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white/20 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white/30">
        
        <h1 className="text-5xl font-extrabold text-white text-center">FAQs</h1>
        <p className="text-lg text-gray-200 text-center mt-2">
          Find answers to common questions about our AI Website Generator.
        </p>

        {/* FAQ List */}
        <div className="mt-8 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/10 p-4 rounded-xl shadow-md cursor-pointer transition transform hover:scale-[1.02]"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg text-white font-semibold">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-yellow-300" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-yellow-300" />
                )}
              </div>
              {openIndex === index && <p className="text-gray-300 mt-2">{faq.answer}</p>}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
