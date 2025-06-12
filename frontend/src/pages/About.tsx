import React, { useEffect, useState } from "react";
import { Mail, MapPin } from "lucide-react";
import LinkedInIcon from '../images/linkedin.png';
import GitHubIcon from '../images/github2.png';
import styled from 'styled-components';

interface GitHubProject {
  id: number;
  name: string;
  html_url: string;
}

const StyledWrapper = styled.div`
  .about-container {
    max-width: 1200px; /* Further increased max-width for broader layout */
    background: linear-gradient(#212121, #212121) padding-box,
                linear-gradient(145deg, transparent 35%, #e81cff, #40c9ff) border-box;
    border: 2px solid transparent;
    padding: 32px 24px;
    font-size: 14px;
    font-family: inherit;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    width: 100%; /* Ensure it takes full width of the container */
  }

  .header, .section-title {
    text-align: center;
    color: #e81cff;
  }

  .contact-info, .skills, .projects, .achievements {
    margin-top: 20px;
  }

  .contact-info a, .projects a {
    color: #40c9ff;
    text-decoration: none;
    transition: color 0.3s;
  }

  .contact-info a:hover, .projects a:hover {
    color: #e81cff;
  }

  .icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  .project-list, .achievement-list {
    list-style-type: disc;
    padding-left: 20px;
  }

  .project-list li, .achievement-list li {
    margin-bottom: 10px;
  }
`;

export function About() {
  const [projects, setProjects] = useState<GitHubProject[]>([]);

  useEffect(() => {
    fetch("https://api.github.com/users/aj2980/repos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        return response.json();
      })
      .then((data: GitHubProject[]) => setProjects(data.slice(0, 5)))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <StyledWrapper>
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-900">
        <div className="about-container">
          <h1 className="text-5xl font-extrabold header">About Me</h1>
          <p className="text-lg text-gray-300 text-center mt-2">
            Passionate Developer | AI Enthusiast | Problem Solver
          </p>

          <div className="contact-info">
            <div className="flex items-center space-x-3">
              <Mail className="icon" />
              <a href="mailto:jainabhishek624@gmail.com">jainabhishek624@gmail.com</a>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="icon" />
              <span>Gwalior, M.P.</span>
            </div>
            <div className="flex items-center space-x-6 mt-4">
              <a href="https://linkedin.com/in/abhishek-jain-53b506258" target="_blank" rel="noopener noreferrer">
                <img src={LinkedInIcon} alt="LinkedIn" className="icon" />
              </a>
              <a href="https://github.com/aj2980" target="_blank" rel="noopener noreferrer">
                <img src={GitHubIcon} alt="GitHub" className="icon" />
              </a>
            </div>
          </div>

          <div className="profile">
            <h2 className="text-3xl font-bold section-title">Who Am I?</h2>
            <p className="text-lg text-white mt-3">
              I am a third-year Information Technology student at MITS Gwalior, deeply passionate about software
              development, machine learning, and full-stack engineering. I enjoy building scalable AI-powered solutions
              and tackling complex programming challenges.
            </p>
          </div>

          <div className="skills">
            <h2 className="text-3xl font-bold section-title">Skills & Technologies</h2>
            <div className="text-lg text-white mt-3 leading-relaxed">
              <p><strong>Programming:</strong> Python, C++, JavaScript, SQL</p>
              <p><strong>Data Analysis:</strong> Pandas, NumPy, Matplotlib, Seaborn</p>
              <p><strong>Frameworks:</strong> Node.js, TensorFlow, MERN Stack</p>
              <p><strong>Tools:</strong> Git, MySQL, PostgreSQL</p>
            </div>
          </div>

          <div className="projects">
            <h2 className="text-3xl font-bold section-title">Projects</h2>
            <ul className="project-list">
              <li>
                <strong>Voice-Enabled Ticket Booking System:</strong>
                AI-powered web app improving accessibility.{" "}
                <a href="https://github.com/aj2980/Voice-Operated-application.git" target="_blank" rel="noopener noreferrer">
                  GitHub Link
                </a>
              </li>
              <li>
                <strong>Code-Sphere:</strong>
                Multi-code IDE with AI-assisted autocompletion.{" "}
                <a href="https://github.com/aj2980/CodeSphere.git" target="_blank" rel="noopener noreferrer">
                  GitHub Link
                </a>
              </li>
            </ul>
          </div>

          {projects.length > 0 && (
            <div className="other-projects">
              <h2 className="text-3xl font-bold section-title">Other Projects</h2>
              <ul className="project-list">
                {projects.map((project) => (
                  <li key={project.id}>
                    <a href={project.html_url} target="_blank" rel="noopener noreferrer">
                      {project.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="video-tutorial">
            <h2 className="text-3xl font-bold section-title">Project Demonstration</h2>
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

          <div className="achievements">
            <h2 className="text-3xl font-bold section-title">Achievements</h2>
            <ul className="achievement-list">
              <li>First prize in a college coding competition.</li>
              <li>Internship in Cyber Security and Ethical Hacking at IIT Bombay.</li>
            </ul>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}