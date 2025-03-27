
import { Vote, Shield, Users, FileText, ChevronRight, Github, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import {useState,useEffect} from "react"
import '../styles/Home.css';
function Home() {
  const navigate = useNavigate()
  const [role, setRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const userToken = localStorage.getItem("Authorization"); // Assuming JWT is stored
    // const token = localStorage.getItem('token'); // Assuming token is stored upon login
    if (userToken) {
      const storedRole = localStorage.getItem("Role");
      setIsLoggedIn(true);
      setRole(storedRole);
    }// Convert to boolean
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("Authorization"); // Clear authentication
    localStorage.removeItem("Role");
    localStorage.removeItem("selectedCandidate")
    localStorage.removeItem("hasVoted");
    localStorage.removeItem("VoterId");
    // localStorage.removeItem("electionProgress");
    setIsLoggedIn(false);
    setRole("");
    navigate('/login'); // Redirect to login
  };
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <Vote className="logo" />
          <span>DecentralVote</span>
        </div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#instructions">Instructions</a>
          <a href="#team">Team</a>

          {isLoggedIn && role === 'admin' && (
            <>
              <button className="btn-primary" onClick={() => navigate('/voter')}>
                Voter Dashboard
              </button>
              <button className="btn-primary" onClick={() => navigate('/admin')}>
                Admin Dashboard
              </button>
            </>
          )}
           {isLoggedIn && role === 'voter' && (
            <button className="btn-primary" onClick={() => navigate('/voter')}>
              Voter Dashboard
            </button>
          )}
           {isLoggedIn ? (
            <button className="btn-primary" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
              <button className="btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
            </>
          )}
        </div>
      </nav>
      

      <header className="hero">
        <div className="hero-content">
          <h1>Secure and Transparent Voting System</h1>
          <p>Experience the future of democracy with our blockchain-based decentralized voting platform</p>
          <button className="btn-primary"
            onClick={() => {
              if (!isLoggedIn) {
                navigate('/login');
              } else if (role === 'voter') {
                navigate('/voter');
              } else if (role === 'admin') {
                navigate('/admin');
              }
            }} >Get Started <ChevronRight size={20} /></button>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80" alt="Voting Illustration" />
        </div>
      </header>

      <section id="about" className="section">
        <h2 style={{color:"white"}}>About DecentralVote</h2>
        <div className="features-grid">
          <div className="feature-card">
            <Shield className="feature-icon" />
            <h3>Secure</h3>
            <p>Blockchain technology ensures tamper-proof and encrypted voting records</p>
          </div>
          <div className="feature-card">
            <Users className="feature-icon" />
            <h3>Transparent</h3>
            <p>Public ledger maintains complete transparency while protecting voter privacy</p>
          </div>
          <div className="feature-card">
            <FileText className="feature-icon" />
            <h3>Verifiable</h3>
            <p>Every vote can be verified without compromising anonymity</p>
          </div>
        </div>
      </section>

      <section id="features" className="section bg-alt">
        <h2>Key Features</h2>
        <div className="features-list">
          <div className="feature-item">
            <h3>Blockchain Security</h3>
            <p>Immutable records ensure vote integrity</p>
          </div>
          <div className="feature-item">
            <h3>Real-time Results</h3>
            <p>Watch election progress as it happens</p>
          </div>
          <div className="feature-item">
            <h3>Easy Authentication</h3>
            <p>Secure login with JWT authentication</p>
          </div>
          <div className="feature-item">
            <h3>Voter Privacy</h3>
            <p>Anonymous voting with cryptographic protection</p>
          </div>
        </div>
      </section>

      <section id="instructions" className="section">
        <h2 style={{color:"white"}}>How to Vote</h2>
        <div className="instructions-grid">
          <div className="instruction-step">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up with your verified credentials</p>
          </div>
          <div className="instruction-step">
            <div className="step-number">2</div>
            <h3>Verify Identity</h3>
            <p>Complete the verification process</p>
          </div>
          <div className="instruction-step">
            <div className="step-number">3</div>
            <h3>Cast Vote</h3>
            <p>Vote securely in your eligible elections</p>
          </div>
          <div className="instruction-step">
            <div className="step-number">4</div>
            <h3>Track Results</h3>
            <p>Monitor election results in real-time</p>
          </div>
        </div>
      </section>

      <section id="team" className="section bg-alt">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src="passport size photo2.jpg?auto=format&fit=crop&q=80" alt="Team Member" />
            <h3>Juvvagani Hari Tej</h3>
            <p>Lead MERN Developer</p>
            <div className="social-links">
              <a href="https://github.com/Haritej2003" target="_blank"><Github size={20} /></a>
              <a href="https://www.linkedin.com/in/juvvagani-haritej/" target="_blank"><Linkedin size={20} /></a>
            </div>
          </div>
          
         
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>DecentralVote</h3>
            <p>Revolutionizing democratic processes through blockchain technology</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#instructions">Instructions</a>
            <a href="#team">Team</a>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: 21r11a66b5@gcet.edu.in</p>
            {/* <p>Phone:</p> */}
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 DecentralVote. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}


export default Home;