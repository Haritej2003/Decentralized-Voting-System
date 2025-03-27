import { useCallback, useEffect, useState } from "react";
import axios from "axios"
import { useRecoilValue, RecoilRoot } from 'recoil'
import { useElectionProgress } from '../Atoms/contextAPI'
import { NewElection } from '../Atoms/CandidatesAtom'
import { ElectionProgressProvider } from "../Atoms/contextAPI";
import "../styles/PieChart.css";
// const PieChart = ({ percentage }:any) => {
//   const [offset, setOffset] = useState(0);

//   useEffect(() => {
//     // Animate the stroke dashoffset for smooth transition
//     const timeout = setTimeout(() => {
//       setOffset(100 - percentage);
//     }, 300);

//     return () => clearTimeout(timeout);
//   }, [percentage]);

//   return (
//     <div className="chart-container">
//       <svg viewBox="0 0 36 36" className="pie-chart">
//         <circle className="bg" cx="18" cy="18" r="15.9155" />
//         <circle
//           className="progress"
//           cx="18"
//           cy="18"
//           r="15.9155"
//           style={{ strokeDashoffset: offset }}
//         />
//         <text x="18" y="20.5" className="percentage-text">
//           {percentage}%
//         </text>
//       </svg>
//     </div>
//   );
// };

// export default PieChart;


export default function PieChart() {
  const [votingPercentage, setVotingPercentage] = useState(0)
  const [totalVoters, setTotalVoters] = useState(0)
  const [votedCount, setVotedCount] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const { electionProgress } = useElectionProgress();

  const fetchData = useCallback(async () => {
    const res = await axios.post("http://localhost:5000/blockchain/getStats");
    const { totalRegisteredVoters, totalVotersOnChain } = res.data;
    setTotalVoters(totalRegisteredVoters);
    setVotedCount(totalVotersOnChain);
    const percentage =
      totalRegisteredVoters > 0
        ? (totalVotersOnChain / totalRegisteredVoters) * 100
        : 0;
    setVotingPercentage(parseFloat(percentage.toFixed(2)));
  }, [])
  // Calculate the voted count based on percentage
  useEffect(() => {
    fetchData();
    const loadDelay = setTimeout(() => {
      setIsLoaded(true)
      const interval = setInterval(fetchData, 20000);
      return () => {
        clearInterval(interval)
      }
    }, 500)
    return () => {
      clearTimeout(loadDelay)
    }
  }, [])

  // Simulate loading data and animate to final percentage
  // useEffect(() => {
  //   // Start with 0% and animate to final value
  //   // const targetPercentage = 67.8
  //   fetchData();
  //   // Set a small delay before starting animation
  //   // const loadDelay = setTimeout(() => {
  //   //   setIsLoaded(true)

  //   //   // Animate the percentage counter
  //   //   let currentPercentage = 0
  //   //   const interval = setInterval(fetchData, 20000)
  //   // }, 500)

  //   return () => {
  //     clearTimeout(loadDelay)
  //   }
  // }, [])

  // Calculate the stroke dash offset for the progress circle
  const calculateStrokeDashOffset = (percent: number) => {
    const circumference = 2 * Math.PI * 120 // radius is 120
    return circumference - (circumference * percent) / 100
  }

  return <div className="voting-container">
      <div className="voting-header">
        <h2>Election Voting Statistics</h2>
        <p className="voting-subtitle">Live voting percentage tracker</p>
      </div>

      <div className="voting-content">
        <div className="voting-chart-container">
          <div className="progress-circle-container">
            <svg className="progress-circle" width="280" height="280" viewBox="0 0 280 280">
              {/* Background circle */}
              <circle cx="140" cy="140" r="120" className="progress-circle-bg" />

              {/* Progress circle */}
              <circle
                cx="140"
                cy="140"
                r="120"
                className="progress-circle-progress"
                style={{
                  strokeDasharray: `${2 * Math.PI * 120}`,
                  strokeDashoffset: isLoaded ? calculateStrokeDashOffset(votingPercentage) : `${2 * Math.PI * 120}`,
                  transition: isLoaded ? "stroke-dashoffset 1.5s ease-in-out" : "none",
                }}
              />

              {/* Center text */}
              <text x="140" y="130" className="percentage-text">
                {votingPercentage.toFixed(1)}%
              </text>
              <text x="140" y="160" className="percentage-label">
                Voter Turnout
              </text>
            </svg>

            <div className={`percentage-info ${isLoaded ? "animate-in" : ""}`}>
              <div className="info-item">
                <span className="info-label">Total Eligible Voters</span>
                <span className="info-value">{totalVoters.toLocaleString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Votes Cast</span>
                <span className="info-value">{votedCount.toLocaleString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Remaining</span>
                <span className="info-value">{(totalVoters - votedCount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="voting-stats">
            <div className={`stats-card ${isLoaded ? "animate-in" : ""}`} style={{ animationDelay: "0.3s" }}>
              <div className="stats-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="stats-content">
                <h3>Participation Rate</h3>
                <p className="stats-value">{votingPercentage.toFixed(1)}%</p>
                <p className=" poll">
                  {votingPercentage > 50 ? "Above average turnout" : "Below average turnout"}
                </p>
              </div>
            </div>

            <div className={`stats-card ${isLoaded ? "animate-in" : ""}`} style={{ animationDelay: "0.5s" }}>
              <div className="stats-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <RecoilRoot>
                <ElectionProgressProvider>
                  <ElectionTimer electionProgress={electionProgress} />
                </ElectionProgressProvider>
              </RecoilRoot>
            </div>

            <div className={`stats-card ${isLoaded ? "animate-in" : ""}`} style={{ animationDelay: "0.7s" }}>
              <div className="stats-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="stats-content">
                <h3>Demographic</h3>
                <p className="stats-value">All Regions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
}

const ElectionTimer = ({ electionProgress }: any) => {
  const election = useRecoilValue(NewElection);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [endTime, setEndtime] = useState("23:59");
  const [electionData, setElectionData] = useState<any>(null);

  const fetching = useCallback(async () => {
    try {
      console.log("Fetching data...");
      const res = await axios.post("http://localhost:5000/admin/getElection", {
        id: localStorage.getItem("electionId"),
      });
      console.log("Response received:", res.data.election);
      setElectionData(res.data.election); // Store election data in state
    } catch (error) {
      console.error("Error fetching election data", error);
    }

  }, [])
  useEffect(() => {
    electionProgress?fetching():"";
  }, [])
  useEffect(() => {
    try {

      let { endDate, endTime } = electionData;
      console.log("response received", electionData);
      endDate = new Date(endDate);
      const calculateTimeRemaining = () => {
        let now = new Date();

        let [hours, minutes] = endTime.split(":").map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        if (ampm === "PM" && hours !== 12) {
          hours += 12;
      } else if (ampm === "AM" && hours === 12) {
          hours = 0;
      }
      endDate.setHours(hours, minutes, 0, 0);
        // Convert to 12-hour format, ensuring 12 is displayed instead of 0

        const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
        console.log("formattedTime",formattedTime);
      
        const diff = Math.abs(endDate.getTime() - now.getTime());
        console.log(endDate, now)
        console.log(endDate.getTime(), now.getTime())
        console.log("difference is ", diff)
        // if (diff > 0) {
        const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hoursLeft}h ${minutesLeft}m`);
        // } else {
        //   setTimeRemaining("Election Closed");
        // }
      }
      calculateTimeRemaining(); // Initial call
      const timer = setInterval(calculateTimeRemaining, 60000); // Update every minute
      setEndtime(endTime);
      return () => clearInterval(timer)

    } catch (error: any) {
      console.log("error occured", error)
    }

  }, [electionData]);

  return electionProgress ? (
    <div className="stats-content">
      <h3>Time Remaining</h3>
      {/* <p className="stats-value">{timeRemaining}</p> */}
      <p className="stats-description poll">Polls close at {endTime}</p>
    </div>
  ) : (
    <h2>Election Closed</h2>
  )
};