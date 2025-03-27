import { useCallback, useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios"
import '../styles/Result.css';
// const VoteGraph = () => {
//     const [voteData, setVoteData] = useState([]);
//     const fetching=useCallback(async ()=>{
//         try{
//         const res=await axios.get("http://localhost:5000/blockchain/all-votes");
//         const filteredData = res.data.results.map(({ name, votes }) => ({ name, votes })).sort((a, b) => b.votes - a.votes); ;
//         setVoteData(filteredData);
//         }catch(error:any){
//             console.log("Error fetching vote data:", error);
//         }
//     },[])
//     useEffect(()=>{
//         fetching();
//         const interval = setInterval(() => {
//             fetching();
//         }, 60000); // Fetch every 60 seconds

//         return () => clearInterval(interval);
//     },[fetching])
//     const barSize = Math.max(10, Math.min(40, 200 / voteData.length));

//     return (
//         <div className="graph-container ">
//             <h2>Candidate Vote Count</h2>
//             <ResponsiveContainer width="100%" height={500}>
//                 <BarChart data={voteData} layout="horizontal">
//                     <XAxis dataKey="name" type="category" angle={-45} textAnchor="end" height={100} />
//                     <YAxis type="number" />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="votes" fill="#0d47a1" barSize={barSize} />
//                 </BarChart>
//             </ResponsiveContainer>

//         </div>
//     );
// };
// "use client";


interface VoteData {
  name: string;
  votes: number;
}

function VoteGraph() {
  const [voteData, setVoteData] = useState<VoteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [NoVotes,setNoVotes]=useState(false);
  const [totalVotes,setTotalVotes]=useState(0);
  const fetchVoteData = useCallback(async () => {
    try {
      setNoVotes(false);
      setError(null);
      const res = await axios.get("http://localhost:5000/blockchain/all-votes");
      const filteredData = res.data.results
        .map(({ name, votes }: { name: string; votes: number }) => ({ name, votes }))
        .sort((a: VoteData, b: VoteData) => b.votes - a.votes);
        if(filteredData[0].votes==0){
          setNoVotes(true);

        }
        setTotalVotes(filteredData.reduce((sum, candidate) => sum + candidate.votes, 0));
      console.log("Obtained dat is",filteredData);
      setVoteData(filteredData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching vote data:", error);
      setError("Failed to fetch vote data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVoteData();
    const interval = setInterval(() => {
      fetchVoteData();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchVoteData]);

  return (
    <div className="vote-graph-container">
      <div className="title-container">

        <div className='title-box'>
          <h2 className="title">Election Results</h2>
          <p className="description">Real-time vote count for each candidate</p>
        </div>
        <div className="total-container">
          <span className="icon">☑️</span>
          <span className="text">{totalVotes} total votes</span>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading data...</div>
      ) : NoVotes?<p className='no-vote'>0 Votes Polled</p>:
      
        <div className="chart-container">
          <ResponsiveContainer width="90%" height={400}>
            <BarChart data={voteData}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="votes"  fill="#2C7373" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      }
      <div className='result-footer'>

        <p className="info">Data updates automatically every minute</p>
        <p className="update-info">Last updated: {lastUpdated.toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

export default VoteGraph;
