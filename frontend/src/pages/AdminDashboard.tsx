import { useRef } from "react";
import ElectionCount from "../components/ElectionCount"
import Candidature from "../components/CandidateManagement"
import CandidateList from '../components/GetCandidate'
import { ElectionProgressProvider } from "../Atoms/contextAPI";
import { RecoilRoot } from "recoil"
import VoteGraph from '../components/Result';
import PieChart from "../components/VotingPercentage";
import {Link} from 'react-router-dom'
import '../styles/AdminDashboard.css'
export default function AdminDashboard(){
    const resultsRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
                
        <div className="AdminDashboard">
                <AdminNavbar scrollToSection={scrollToSection} resultsRef={resultsRef} statsRef={statsRef}/>
                <h1>Admin Dashboard</h1>
                <div className="container">
                <RecoilRoot>
                    <ElectionProgressProvider>
                <ElectionCount/>
                <Candidature/>
                <CandidateList/>
                <div style={{"width":"100%"}} ref={resultsRef}>
                            <VoteGraph />
                        </div>
                        <div ref={statsRef}>
                            <PieChart />
                        </div>
                </ElectionProgressProvider>
                </RecoilRoot>
                </div>
              
               {/* results */}
        </div>
                
    )
}

const AdminNavbar = ({ scrollToSection, resultsRef, statsRef }:any) => {
    return (
      <nav className="admin-navbar">
        <div className="admin-logo">Admin Dashboard</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><button onClick={() => scrollToSection(resultsRef)}>View Results</button></li>
          <li><button onClick={() => scrollToSection(statsRef)}>View Stats</button></li>
        </ul>
       
      </nav>
    );
  };
  


