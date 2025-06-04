import React from "react";
import { BookOpen, Code, Rocket } from "lucide-react";

export function Tutorial() {
  return (
    <div className="min-h-screen bg-gradient-to-br black from-blue-400 to-gray-800 text-white p-6 flex flex-col items-center">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-bold text-yellow-300">How to Use AI Website Builder</h1>
        <p className="text-lg text-gray-400 mt-3">
          Follow these simple steps to create your website effortlessly.
        </p>
      </div>

      {/* Steps Section */}
      <div className="grid md:grid-cols-3 gap-8 mt-10 max-w-5xl mx-auto">
        
        {/* Step 1 */}
        <div className="text-center p-6 bg-gray-800 rounded-lg shadow-xl hover:scale-105 transition">
          <img
            src="https://cdn.pixabay.com/photo/2016/11/21/12/42/brainstorming-1840296_960_720.jpg"
            alt="Enter Your Idea"
            className="w-full h-48 object-cover rounded-md"
          />
          <BookOpen className="w-12 h-12 mx-auto text-yellow-300 mt-4" />
          <h3 className="text-xl font-semibold mt-4">1. Enter Your Idea</h3>
          <p className="text-gray-300 mt-2">
            Describe the type of website you want, and AI will generate a custom structure.
          </p>
        </div>

        {/* Step 2 */}
        <div className="text-center p-6 bg-gray-800 rounded-lg shadow-xl hover:scale-105 transition">
          <img
            src="https://cdn.pixabay.com/photo/2019/06/17/19/48/artificial-intelligence-4288629_960_720.jpg"
            alt="AI Generates Structure"
            className="w-full h-48 object-cover rounded-md"
          />
          <Code className="w-12 h-12 mx-auto text-yellow-300 mt-4" />
          <h3 className="text-xl font-semibold mt-4">2. AI Generates Structure</h3>
          <p className="text-gray-300 mt-2">
            AI analyzes your input and creates a website layout suited to your needs.
          </p>
        </div>

        {/* Step 3 */}
        <div className="text-center p-6 bg-gray-800 rounded-lg shadow-xl hover:scale-105 transition">
          <img
            src="https://cdn.pixabay.com/photo/2017/02/01/22/02/startup-2033681_960_720.jpg"
            alt="Launch Instantly"
            className="w-full h-48 object-cover rounded-md"
          />
          <Rocket className="w-12 h-12 mx-auto text-yellow-300 mt-4" />
          <h3 className="text-xl font-semibold mt-4">3. Customize & Launch</h3>
          <p className="text-gray-300 mt-2">
            Edit content, styles, and click ‘Publish’ to go live instantly.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <a
          href="/"
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 px-6 rounded-lg text-lg shadow-lg transition-all"
        >
          Start Building Now 🚀
        </a>
      </div>
    </div>
  );
}
