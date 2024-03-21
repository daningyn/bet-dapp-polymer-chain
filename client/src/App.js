import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Datepicker from "react-tailwindcss-datepicker";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { v4 as uuidv4 } from 'uuid';
import NBABetAbi from './common/NBABet.json';
import PoVAbi from './common/XProofOfBetNFT.json';
import config from './common/config.json';
import { ethers } from 'ethers';
import { useAccount, useChainId, useChains, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { explorerURL } from './helpers/helper';
import BetCard from './components/BetCard';
import Match from './components/Match';


const AddressContract = {
  PoV: "0x4c67ad406270451EC63b459428072e5DA611c024",
  NBABet: "0xDAeF5eb7CA101726fc356D4B2a83cE72e5884674"
}

function App() {

  const [dateRange, setDateRange] = useState(moment().format('YYYYMMDD').toString());
  const [matchDates, setMatchDate] = useState([]);
  const [betTeams, setBetTeams] = useState({ team1: null, team2: null, matchId: null });
  const [valueDatePicker, setValueDatePicker] = useState({
    startDate: moment().format('YYYY-MM-DD').toString(),
    endDate: moment().format('YYYY-MM-DD').toString()
  });
  const [betAmount, setBetAmount] = useState(0);

  const [isBetCardVisible, setBetCardVisible] = useState(false);

  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const wallet = useAccount();


  useEffect(() => {
    setMatchDate([]);
    const fetchData = async () => {
      try {
        const options = {
          method: 'GET',
          url: `api/matches?date=${dateRange}`
        };
        const res = await axios.request(options);
        setMatchDate([res.data]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [dateRange]); // Add dateRange into dependencies

  const DateBlock = ({ data }) => {
    return data[0].Events.map((event, index) => {
      return <Match key={uuidv4()} data={event} index={index} handleBetClick={handleBetClick} />
    });
  }

  const handleBetClick = (team1, team2, eid) => {
    setBetCardVisible(true);
    setBetTeams({ team1, team2, matchId: eid });
    // Reset selectedTeam
    setSelectedTeam(null);
    setBetAmount(0);
  };

  const handleValueChange = (newValue) => {
    setValueDatePicker(newValue);
    const selectedDate = moment(newValue.startDate).format('YYYYMMDD');
    setDateRange(selectedDate);
  }

  const fetchTodayData = () => {
    const today = moment().format('YYYYMMDD');
    setDateRange(today);
    setValueDatePicker({
      startDate: moment().format('YYYY-MM-DD').toString(),
      endDate: moment().format('YYYY-MM-DD').toString()
    });
  }

  const fetchTomorrowData = () => {
    const tomorrow = moment().add(1, 'days').format('YYYYMMDD');
    setDateRange(tomorrow);
    setValueDatePicker({
      startDate: moment().add(1, 'days').format('YYYY-MM-DD').toString(),
      endDate: moment().add(1, 'days').format('YYYY-MM-DD').toString()
    })
  }

  const [checkResult, setCheckResult] = useState(false);

  const checkBets = async () => {
    setCheckResult(true);
  }

  const BetResultData = () => {
    const bet = useReadContract({
      address: AddressContract.NBABet,
      abi: NBABetAbi,
      functionName: 'getMatchIds',
      args: [
              wallet.address
            ]
    });
    return bet.status === 'success' ? bet.data.map(d => {
      return <div key={uuidv4()} className='flex flex-col items-center m-[10px]'><ResultCard id={d.toString()} /></div>
    }) : <></>;
  }

  const ResultCard = (props) => {
    const { id } = props;
    const betInfo = useReadContract({
      address: AddressContract.NBABet,
      abi: NBABetAbi,
      functionName: 'betsOf',
      args: [
              Number(id),
              wallet.address
            ]
    });
    const processData = (data) => {
      const betAmount = ethers.formatEther(data[0]).toString();
      const teamId = data[1].toString();
      const matchId = id;
      const url = data[6];
      return { betAmount, teamId, matchId, url };
    }
    return betInfo.status === 'success' ? <div><ResultDetailCard props={processData(betInfo.data)} /></div> : <div>Loading for match</div>;
  }

  const ResultDetailCard = ({props}) => {
    const { betAmount, teamId, matchId, url } = props;
    const [resultData, setResultData] = useState(null);
    axios.get(`/api/nba-result?gameId=${matchId}&betId=${teamId}`).then(data => {
      setResultData(data);
    })
    return resultData ? 
          <div className='border rounded-md p-[10px] flex flex-row gap-x-[10px]'>
            <img className='h-[48px] w-[48px]' src={url} alt="team logo" />
            <div className='flex flex-col gap-y-[10px]'>
              <div>{resultData.data.team}</div>
              <div>You bet: {betAmount.toString()} Eth, {`${resultData.data.error ? 'The match has not happened yet' : `you ${resultData.data.result == 1 ? 'lose' : resultData.data.result == 2 ? 'draw' : 'win'}`}`}</div>
            </div>
          </div>
        : <div>Loading for result</div>;
  }

  return (
    <div className="App flex px-[150px] py-0 justify-around">
      <div className="flex items-start justify-start absolute top-0 left-0">
        <div className="flex justify-left space-x-4 p-4">
          <input type="checkbox" id="testMode" name="testMode" value="TestMode" className="form-checkbox h-5 w-5 text-blue-600" />
          <label htmlFor="testMode" className="ml-2 text-gray-700 text-sm">Test mode</label>
        </div>
      </div>
      <div className="absolute top-0 right-1 p-4">
        <ConnectButton />
      </div>
      <div className={`${isBetCardVisible ? 'w-[70%]' : 'w-[100%]'} transform transition-all ease-linear`}>
        <div className="flex flex-col">
          <div className="flex justify-left space-x-4 p-4">
            <button onClick={fetchTodayData} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Today
            </button>
            <button onClick={fetchTomorrowData} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Tomorrow
            </button>
            <div className="w-64 border rounded">
              <Datepicker
                useRange={false}
                asSingle={true}
                value={valueDatePicker}
                onChange={handleValueChange}
              />
            </div>
            <button onClick={checkBets} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Check your bets
            </button>
          </div>

          {checkResult && <BetResultData />}

          {hash && <a target="_blank" className='text-blue-600 cursor-pointer' href={explorerURL({txSignature: hash, baseExplorerUrl: config['sendPacket'][_.find(chains, { id: chainId })?.nativeCurrency.replacedName || 'optimisum']['explorerUrl']})}>Transaction Hash</a>}
          {isConfirming && <div>Waiting for confirmation...</div>}
          {isConfirmed && <div>Transaction confirmed.</div>}
          {error && (
            <div className='text-red-500'>Error: {error.message}</div>
          )}

          {matchDates[0] && <DateBlock data={matchDates} />}

        </div>
      </div>
      {isBetCardVisible && (
        <BetCard selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam}
          betAmount={betAmount} setBetAmount={setBetAmount} team1={betTeams.team1}
          team2={betTeams.team2} matchId={betTeams.matchId} isPending={isPending}
          writeContract={writeContract} />
      )}
    </div>
  );
}

export default App;
