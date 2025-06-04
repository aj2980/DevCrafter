import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, ArrowRight } from 'lucide-react';
import axios from "axios";
import { BACKEND_URL } from '../../Config';

const backgroundImages = [
  'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2969&q=80',
  'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2970&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2970&q=80',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3072&q=80',
  'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/4974916/pexels-photo-4974916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',

];

export function Home() {
  const [prompt, setPrompt] = useState('');
  const [currentBg, setCurrentBg] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt } });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((img, index) => (
          <div 
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBg ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black bg-opacity-70" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full backdrop-blur-sm bg-white/5 rounded-xl shadow-2xl overflow-hidden border border-white/10">
          <div className="text-center p-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-600/20 rounded-full">
                <Wand2 className="w-10 h-10 text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              DevCrafter
              Website Builder AI
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Describe your dream website, and we'll help you build it step by step
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8">
            <div className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: I need a modern e-commerce site for handmade jewelry with a dark theme, product gallery, and contact form..."
                className="w-full h-40 p-4 bg-gray-900/80 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400 transition-all"
              />
              <button
                type="submit"
                disabled={!prompt.trim()}
                className={`w-full flex items-center justify-center gap-2 mt-4 py-3 px-6 rounded-lg font-medium transition-all ${prompt.trim() ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              >
                Generate Website Plan
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="px-8 pb-6">
            <div className="text-sm text-gray-400 text-center">
              Try: "Portfolio site for a photographer with gallery, about section, and booking system"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}