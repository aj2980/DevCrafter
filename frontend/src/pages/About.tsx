import React, { useEffect, useState } from "react";
import { Mail, MapPin, Linkedin, Github } from "lucide-react";

interface GitHubProject {
  id: number;
  name: string;
  html_url: string;
}

export function About() {
    const [projects, setProjects] = useState<GitHubProject[]>([]);

    // Fetch other projects dynamically from GitHub
    useEffect(() => {
        fetch("https://api.github.com/users/aj2980/repos")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch projects");
                }
                return response.json();
            })
            .then((data: GitHubProject[]) => setProjects(data.slice(0, 5))) // Show only the latest 5 projects
            .catch((error) => console.error("Error fetching projects:", error));
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-900">
            <div className="max-w-4xl w-full bg-white/20 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white/30">

                {/* Header */}
                <h1 className="text-5xl font-extrabold text-white text-center">About Me</h1>
                <p className="text-lg text-gray-300 text-center mt-2">
                    Passionate Developer | AI Enthusiast | Problem Solver
                </p>

                {/* Contact Info */}
                <div className="mt-6 flex flex-col items-center space-y-3">
                    <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-yellow-300" />
                        <a href="mailto:jainabhishek624@gmail.com" className="text-white hover:text-yellow-300 transition">
                            jainabhishek624@gmail.com
                        </a>
                    </div>
                    <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-yellow-300" />
                        <span className="text-white">Gwalior, M.P.</span>
                    </div>
                    <div className="flex items-center space-x-6 mt-4">
                        <a href="https://linkedin.com/in/abhishek-jain-53b506258" target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-8 h-8 text-yellow-300 hover:text-white transition" />
                        </a>
                        <a href="https://github.com/aj2980" target="_blank" rel="noopener noreferrer">
                            <Github className="w-8 h-8 text-yellow-300 hover:text-white transition" />
                        </a>
                    </div>
                </div>

                {/* Profile */}
                <div className="mt-10">
                    <h2 className="text-3xl font-bold text-yellow-300">Who Am I?</h2>
                    <p className="text-lg text-white mt-3">
                        I am a third-year Information Technology student at MITS Gwalior, deeply passionate about software
                        development, machine learning, and full-stack engineering. I enjoy building scalable AI-powered solutions
                        and tackling complex programming challenges.
                    </p>
                </div>

                {/* Skills */}
                <div className="mt-8">
                    <h2 className="text-3xl font-bold text-yellow-300">Skills & Technologies</h2>
                    <div className="text-lg text-white mt-3 leading-relaxed">
                        <p><strong className="text-yellow-300">Programming:</strong> Python, C++, JavaScript, SQL</p>
                        <p><strong className="text-yellow-300">Data Analysis:</strong> Pandas, NumPy, Matplotlib, Seaborn</p>
                        <p><strong className="text-yellow-300">Frameworks:</strong> Node.js, TensorFlow, MERN Stack</p>
                        <p><strong className="text-yellow-300">Tools:</strong> Git, MySQL, PostgreSQL</p>
                    </div>
                </div>

                {/* Projects */}
                <div className="mt-8">
                    <h2 className="text-3xl font-bold text-yellow-300">Projects</h2>
                    <ul className="text-lg text-white mt-3 list-disc pl-5 space-y-3">
                        <li>
                            <strong className="text-yellow-300">Voice-Enabled Ticket Booking System:</strong>
                            AI-powered web app improving accessibility.{" "}
                            <a href="https://github.com/aj2980/Voice-Operated-application.git"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline">
                                GitHub Link
                            </a>
                        </li>
                        <li>
                            <strong className="text-yellow-300">Code-Sphere:</strong>
                            Multi-code IDE with AI-assisted autocompletion.{" "}
                            <a href="https://github.com/aj2980/CodeSphere.git"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline">
                                GitHub Link
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Other GitHub Projects */}
                {projects.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-3xl font-bold text-yellow-300">Other Projects</h2>
                        <ul className="text-lg text-white mt-3 list-disc pl-5 space-y-2">
                            {projects.map((project) => (
                                <li key={project.id}>
                                    <a href={project.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:underline">
                                        {project.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Video Tutorial */}
                <div className="mt-8">
                    <h2 className="text-3xl font-bold text-yellow-300">Project Demonstration</h2>
                    <div className="mt-4 flex justify-center">
                        <div className="aspect-w-16 aspect-h-9 w-full max-w-2xl">
                            <iframe
                                src="https://drive.google.com/file/d/1SxLQIzIFiYD_5Qgx3NzDq0WU3caGKP4j/view?usp=sharing"
                                width="100%"
                                height="400"
                                allow="autoplay"
                                className="rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                <div className="mt-8">
                    <h2 className="text-3xl font-bold text-yellow-300">Achievements</h2>
                    <ul className="text-lg text-white mt-3 list-disc pl-5 space-y-2">
                        <li>First prize in a college coding competition.</li>
                        <li>Internship in Cyber Security and Ethical Hacking at IIT Bombay.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}