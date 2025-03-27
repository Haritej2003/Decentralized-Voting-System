import { useRef, useCallback, useEffect, useState } from "react";
// import CandidatesList from "../components/ViewCandidates";
import CandidatesList from "../components/Sample";
import { RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { showCandidatesAtom, showVoteButtonsAtom } from '../Atoms/CandidatesAtom';
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import VoteGraph from '../components/Result';
import { ElectionProgressProvider, useElectionProgress,useHasVoted,HasVotedProvider } from '../Atoms/contextAPI'
import "../styles/VoterDashboard.css";
export default function VoterDashBoard() {
  const { electionProgress } = useElectionProgress();
  const [loading, setLoading] = useState(false);
  const [voterData, setVoterData] = useState({
    "name": "Voter",
    "email": "not found",
  });
  const {updateHasVoted } = useHasVoted();
  // const candidatesRef = useRef<HTMLDivElement | null>(null); (null)
  // const showCandidates = useRecoilValue<boolean>(showCandidatesAtom); // State to toggle visibility
  // const showVoteButtons = useRecoilValue<boolean>(showVoteButtonsAtom); // State to toggle visibility
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/voter/getDetails", {
        id: localStorage.getItem("VoterId"),
      });
      const hasVotedRes=await axios.post("http://localhost:5000/blockchain/hasVoted",{
        id:localStorage.getItem("VoterId")
      })
      const hasVotedStatus = hasVotedRes.data.HasVoted;
      localStorage.setItem("hasVoted",hasVotedRes.data.HasVoted);
      updateHasVoted(hasVotedStatus); 
      setVoterData(res.data.voter);
    } catch (error: any) {
      console.log("Error occurred", error.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchUser();
  }, [fetchUser])
  const candidatesRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  return (
    <RecoilRoot>
      <div className="VoterDashboard">
  <HasVotedProvider>
        <NavBar candidatesRef={candidatesRef} resultRef={resultRef} electionProgress={electionProgress}/>
        </HasVotedProvider>
        <div className="content">
          <h2>Welcome, {voterData == null ? "Voter" : voterData.name}! {electionProgress ? <span className="election-progress">Election in Progress</span> : ""}</h2>
          <p style={{ color: '#909090' }}>Your voice matters. Stay informed and cast your vote wisely.</p>

          {/* Dashboard Cards */}
          <div className="grid-container">
            {loading ? <div></div> : <Profile voter={voterData} />}
            <HasVotedProvider>
            <CandidateServices candidatesRef={candidatesRef} electionProgress={electionProgress} />
            </HasVotedProvider>
            <VotingStatistics electionProgress={electionProgress} />

            <ElectionInfo electionProgress={electionProgress} />

          </div>

          {/* Conditionally Render CandidatesList */}
        <HasVotedProvider>
          <CandidatesListWrapper candidatesRef={candidatesRef} />
          </HasVotedProvider>
          <ElectionProgressProvider>
            <div className="result-container" ref={resultRef}>
          <VoteGraph/>

            </div>
          </ElectionProgressProvider>
        </div>
      </div>
    </RecoilRoot>
  );
}
function CandidatesListWrapper({ candidatesRef }: any) {
  const showCandidates = useRecoilValue(showCandidatesAtom);
  const showVoteButtons = useRecoilValue(showVoteButtonsAtom);


  return showCandidates ? (
    <CandidatesList showVoteButtons={showVoteButtons} candidatesRef={candidatesRef} />
  ) : null;
}

const NavBar = ({ candidatesRef,electionProgress,resultRef }: any) => {
  const [showCandidates, setShowCandidates] = useRecoilState<boolean>(showCandidatesAtom); // State to toggle visibility
  const setShowVoteButtons = useSetRecoilState<boolean>(showVoteButtonsAtom);
  const {hasVoted}=useHasVoted();
  const navigate = useNavigate()
  const handleViewCandidates = () => {
    if (showCandidates) {
      setTimeout(() => {
        if (candidatesRef.current) {
          candidatesRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
    else {

      setShowVoteButtons(false) // Toggle state

      setShowCandidates((prev) => !prev);
      setTimeout(() => {
        if (candidatesRef.current) {
          candidatesRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }


  }
  const handleVote = () => {
    if (showCandidates) {
      setShowVoteButtons(true)
      setTimeout(() => {
        if (candidatesRef.current) {
          candidatesRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      setShowVoteButtons(true) // Toggle state
      setShowCandidates(true);
      setTimeout(() => {
        if (candidatesRef.current) {
          candidatesRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }

  }
  const handleViewResults = () => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return <nav>
    <div className="ImageContainer">
      <img src="Flag.png" alt="Indian Flag" />
      <h1>VOTER</h1>
    </div>
    <div className="NavContainer">
      <button onClick={() => navigate('/')} >HOME</button>
      <button onClick={handleViewCandidates}>VIEW CANDIDATES</button>
      <button onClick={handleViewResults} >VIEW RESULTS</button>
    </div>
    <div className="buttonContainer">
    {(!hasVoted && electionProgress) ? <button onClick={() => handleVote()}>VOTE</button> : ""}
    </div>
  </nav>


}
const Profile = ({ voter }: any) => {
  return <div className="card">
    <h3>Your Profile</h3>
    <p><strong>Name: </strong>{voter.name}</p>
    <p><strong>Email: </strong>{voter.email}</p>
    <p><strong>Registered Constituency:</strong> XYZ District</p>
  </div>
}
const CandidateServices = ({ candidatesRef,electionProgress }: any) => {
  const [showCandidates, setShowCandidates] = useRecoilState<boolean>(showCandidatesAtom); // State to toggle visibility
  const setShowVoteButtons = useSetRecoilState<boolean>(showVoteButtonsAtom);
  const {hasVoted}=useHasVoted();
  const handleViewCandidates = () => {



    setShowVoteButtons(false) // Toggle state

    setShowCandidates((prev) => !prev);
    setTimeout(() => {
      if (candidatesRef.current) {
        candidatesRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  }
  const handleVote = () => {
    setShowVoteButtons(true) // Toggle state
    setShowCandidates(true);
    setTimeout(() => {
      if (candidatesRef.current) {
        candidatesRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);

  }
  return <div className="card">
    <h3>View & Elect Candidates</h3>
    <p>Explore the candidates and make your choice.</p>
    <div className="buttons">
      <button className="view-btn" onClick={handleViewCandidates}>
        {showCandidates ? "Hide Candidates" : "View Candidates"}
      </button>
      {(!hasVoted && electionProgress)?<button className="vote-now-btn" onClick={() => handleVote()} >Vote Now</button>:""}
    </div>
  </div>
}
const VotingStatistics = ({ electionProgress }: any) => {
  // return <div className="card">
  //   <h3>Voting Progress</h3>
  //   <p>
  //     Current voter turnout: <span className="highlight">65%</span>
  //   </p>
  // </div>
  const [totalVoters, setTotalVoters] = useState(50000); // Default or fetched from backend
  const [votesCasted, setVotesCasted] = useState(32500);
  const [loading, setLoading] = useState(false);
  const [turnoutPercentage, setTurnout] = useState(0)
  const targetPercentage = 80
  const [remainingVotes, setRemaining] = useState(15000)
  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/blockchain/getStats");
      console.log("response received", res.data);
      setTotalVoters(res.data.totalRegisteredVoters);
      setVotesCasted(res.data.totalVotersOnChain);
    } catch (error: any) {
      console.log("error occured", error.message);
    } finally {
      setLoading(false);
    }

  }, [])
  useEffect(() => {
    try {
      fetch();
      const interval = setInterval(() => {
        fetch();
      }, 60000);

      return () => clearInterval(interval);
    } catch (error: any) {
      console.log("error occured", error.message);
    }
  }, [fetch])
  useEffect(() => {
    if (totalVoters > 0) {
      const turnout = ((votesCasted / totalVoters) * 100).toFixed(2);
      setTurnout(Number(turnout));

      const remaining = totalVoters-votesCasted
      setRemaining(remaining);
    }
  }, [votesCasted, totalVoters]);
  return (
    loading ? (
      <div className="card">
        <h1>Loading.....</h1>
      </div>
    ) : (
      <div className="card voting-card">
        <h3 className="voting-title">Voting Progress</h3>
  
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${turnoutPercentage}%` }}></div>
          </div>
          <div className="progress-labels">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
  
        {electionProgress ? (
          <div className="statistics">
            <p className="statistic-item">
              Current voter turnout: <span className="highlight">{turnoutPercentage}%</span>
            </p>
            <p className="statistic-item">
              Target turnout: <span className="target">{targetPercentage}%</span>
            </p>
            <p className="statistic-item small">Remaining votes needed: {remainingVotes.toLocaleString()}</p>
          </div>
        ) : (
          <div className="statistics">
            <p className="statistic-item">
              Voter turnout: <span className="highlight">{turnoutPercentage}%</span>
            </p>
            <p className="statistic-item small">Election has Ended</p>
          </div>
        )}
      </div>
    )
  );
  


}
const ElectionInfo = ({ electionProgress }: any) => {

  const [electionDetails, setElectionDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const fetchElection = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/voter/getElection", { id: localStorage.getItem("electionId") })
      const dateObj = new Date(res.data.election.endDate);
      const formattedEndDate = dateObj.getDate().toString().padStart(2, '0') + '-' +
        (dateObj.getMonth() + 1).toString().padStart(2, '0') + '-' +
        dateObj.getFullYear();
      const data = {
        name: res.data.election.name,
        endDate: formattedEndDate,
        endTime: res.data.election.endTime
      }
      console.log("data received", data);
      setElectionDetails(data);
    } catch (error: any) {
      console.log("error occured", error.message);
    } finally {
      setLoading(false);
    }
  }, [])
  useEffect(() => {
    fetchElection();
  }, [])
  return !electionProgress ?
    <div className="card">
      <h3>Election Information</h3>
      <p>
        <strong>Next election date:</strong>{" "}
        <span className="highlight">April 25, 2025</span>
      </p>
      <p>Make sure to vote and make your voice heard!</p>
    </div>
    :
    <div className="card">
      <h3>Election Information</h3>
      <p>
        <strong>Election Name:</strong>{" "}
        <span className="highlight">{electionDetails.name}</span>
      </p>
      <p>
        <strong>Election End Date:</strong>{" "}
        <span className="highlight">{electionDetails.endDate}</span>
      </p>
      <p>
        <strong>Election End Time:</strong>{" "}
        <span className="highlight">{electionDetails.endTime}</span>
      </p>
      <p>Make sure to vote and make your voice heard!</p>
    </div>


}



// const CountdownTimer = ({ endTime }: any) => {
//   const calculateTimeLeft = () => {
//     const now = new Date().getTime();
//     const difference = endTime - now;

//     if (difference <= 0) {
//       return { hours: 0, minutes: 0, seconds: 0 };
//     }

//     return {
//       hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//       minutes: Math.floor((difference / (1000 * 60)) % 60),
//       seconds: Math.floor((difference / 1000) % 60),
//     };
//   };

//   const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft(calculateTimeLeft());
//     }, 1000);

//     if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
//       clearInterval(timer);
//     }

//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   return (
//     <h1>
//       {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
//     </h1>

//   );
// }
