import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Datepicker from "react-tailwindcss-datepicker";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NBABetAbi } from './common/NBABet.json';
import { PoVAbi } from './common/XProofOfBetNFT.json';
import { Config } from './common/config.json';

const AddressContract = {
  PoV: "0x82824f424D6Cf659c4AB6FF7Ef3F2D3dDCb4461C",
  NBABet: "0x4e0904357d5CfBE2F6c78CbdfF410830C0729A1f"
}

function App() {
  const dataJson = `
  {
  "data": {
    "Sid": "15332",
    "Snm": "Regular season",
    "Scd": "regular-season",
    "Cnm": "NBA",
    "Csnm": "NBA",
    "Ccd": "nba",
    "Scu": 0,
    "Events": [
      {
        "Eid": "1057978",
        "Pids": {
          "8": "1057978"
        },
        "T1": [
          {
            "Nm": "Orlando Magic",
            "ID": "1909",
            "Img": "enet/58510.png",
            "Abr": "ORL"
          }
        ],
        "T2": [
          {
            "Nm": "Charlotte Hornets",
            "ID": "1891",
            "Img": "enet/58755.png",
            "Abr": "CHA"
          }
        ],
        "Eps": "NS",
        "Esid": 1,
        "Epr": 0,
        "Ecov": 0,
        "ErnInf": "1",
        "Et": 1,
        "Esd": 20240319180000,
        "EO": 524327,
        "EOX": 524327,
        "Spid": 23,
        "Pid": 8
      },
      {
        "Eid": "1057969",
        "Pids": {
          "8": "1057969"
        },
        "T1": [
          {
            "Nm": "Washington Wizards",
            "ID": "1864",
            "Img": "enet/58536.png",
            "Abr": "WAS"
          }
        ],
        "T2": [
          {
            "Nm": "Houston Rockets",
            "ID": "140",
            "Img": "enet/58549.png",
            "Abr": "HOU"
          }
        ],
        "Eps": "NS",
        "Esid": 1,
        "Epr": 0,
        "Ecov": 0,
        "ErnInf": "1",
        "Et": 1,
        "Esd": 20240319180000,
        "EO": 524327,
        "EOX": 524327,
        "Spid": 23,
        "Pid": 8
      },
      {
        "Eid": "1057973",
        "Pids": {
          "8": "1057973"
        },
        "T1": [
          {
            "Nm": "Brooklyn Nets",
            "ID": "1906",
            "Img": "enet/58535.png",
            "Abr": "BRO"
          }
        ],
        "T2": [
          {
            "Nm": "New Orleans Pelicans",
            "ID": "1881",
            "Img": "enet/58538.png",
            "Abr": "NEW"
          }
        ],
        "Eps": "NS",
        "Esid": 1,
        "Epr": 0,
        "Ecov": 0,
        "ErnInf": "1",
        "Et": 1,
        "Esd": 20240319183000,
        "EO": 524327,
        "EOX": 524327,
        "Spid": 23,
        "Pid": 8
      },
      {
        "Eid": "1057960",
        "Pids": {
          "8": "1057960"
        },
        "T1": [
          {
            "Nm": "San Antonio Spurs",
            "ID": "1887",
            "Img": "enet/58546.png",
            "Abr": "SAN"
          }
        ],
        "T2": [
          {
            "Nm": "Dallas Mavericks",
            "ID": "1888",
            "Img": "enet/58547.png",
            "Abr": "DAL"
          }
        ],
        "Eps": "NS",
        "Esid": 1,
        "Epr": 0,
        "Ecov": 0,
        "ErnInf": "1",
        "Et": 1,
        "Esd": 20240319190000,
        "EO": 524327,
        "EOX": 524327,
        "Spid": 23,
        "Pid": 8
      },
      {
        "Eid": "1057979",
        "Pids": {
          "8": "1057979"
        },
        "T1": [
          {
            "Nm": "Minnesota Timberwolves",
            "ID": "157",
            "Img": "enet/58548.png",
            "Abr": "MIN"
          }
        ],
        "T2": [
          {
            "Nm": "Denver Nuggets",
            "ID": "2382",
            "Img": "enet/58550.png",
            "Abr": "DEN"
          }
        ],
        "Eps": "NS",
        "Esid": 1,
        "Epr": 0,
        "Ecov": 0,
        "ErnInf": "1",
        "Et": 1,
        "Esd": 20240319200000,
        "EO": 524327,
        "EOX": 524327,
        "Spid": 23,
        "Pid": 8
      }
    ]
  }
}
  `;

  const [dateRange, setDateRange] = useState(moment().format('YYYYMMDD').toString());
  const [matchDates, setMatchDate] = useState([]);
  const [betTeams, setBetTeams] = useState({ team1: null, team2: null });
  const [value, setValue] = useState({
    startDate: null,
    endDate: null
  });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [betAmount, setBetAmount] = useState(0);


  useEffect(() => {
    setMatchDate([]);
    const fetchData = async () => {
      try {
        // const options = {
        //   method: 'GET',
        //   url: `api/matches?date=${dateRange}`
        // };
        // const res = await axios.request(options);
        // setMatchDate([res.data]);
        const res = await JSON.parse(dataJson);
        console.log('effect: ', res);
        setMatchDate([res.data]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [dateRange]); // Add dateRange into dependencies

  const DateBlock = ({ data }) => {
    return data?.map((match) => {
      return match.Events.map((event, index) => {
        return <Match key={index} data={event} index={index} />
      });
    });
  }

  const Match = (props) => {
    const { data, index } = props;
    const dateStr = data.Esd;
    const date = moment(dateStr, 'YYYYMMDDhhmmss');
    const time = date.format('hh:mm A');
    const dateFormatted = date.format('YYYY-MM-DD');
    const team1 = data.T1[0];
    const team2 = data.T2[0];
    const team1Logo = `https://lsm-static-prod.livescore.com/medium/${data.T1[0].Img}`;
    const team2Logo = `https://lsm-static-prod.livescore.com/medium/${data.T2[0].Img}`;

    const handleBetClick = () => {
      console.log('Bet clicked');
      console.log('team1:', team1);
      // console.log('team2:', team2);

      setBetCardVisible(true);
      setBetTeams({ team1, team2 });
      // Reset selectedTeam
      setSelectedTeam(null);
      setBetAmount(0);
    };

    return (
      <div key={index} className="flex items-center justify-between border p-4 m-1">
        <div>
          <p>{time}<br />{dateFormatted}</p>
        </div>
        <div className='flex flex-col grow items-center'>
          <p className="text-lg font-semibold">Match {index + 1}</p>
          <div className="grid grid-cols-[1fr_50px_1fr] items-center w-[100%]">
            <div className="flex flex-col items-center">
              <img className='h-[48px] w-[48px]' src={team1Logo} alt="team1 logo" />
              <span>{team1.Nm}</span>
            </div>
            <span>vs</span>
            <div className="flex flex-col items-center">
              <img className='h-[48px] w-[48px]' src={team2Logo} alt="team2 logo" />
              <span>{team2.Nm}</span>
            </div>
          </div>
        </div>
        <div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleBetClick}>
            Bet
          </button>
        </div>
      </div>
    )
  }

  const BetCard = (props) => {
    const { team1, team2 } = props;
    // console.log('team1:', team1);
    // console.log("team2:", team2);

    const submitFormBet = () => {
      if (!selectedTeam) {
        alert('Please select a team');
        return;
      }
      if (betAmount <= 0) {
        alert('Please enter a valid amount');
        return;
      }
      // Rest of the function...
    }

    const clickOnRadioInput = (team) => {
      setSelectedTeam(team);
    }

    return (
      <div className="flex flex-col items-start justify-start border h-80 p-4 mt-20 m-1 w-3/12 space-y-2 bg-white shadow-lg rounded-lg">
        <div className="text-lg font-semibold">Choose a team:</div>
        <div className="flex flex-col items-start space-y-2">
          <div className={`flex flex-col border rounded-md border-slate-600 p-[10px] cursor-pointer ${selectedTeam && selectedTeam.ID === team1.ID ? 'bg-cyan-400 text-white' : ''}`} onClick={() => {clickOnRadioInput(team1)}}>
            {team1.Nm}
          </div>
          <div className={`flex flex-col border rounded-md border-slate-600 p-[10px] cursor-pointer ${selectedTeam && selectedTeam.ID === team2.ID ? 'bg-cyan-400 text-white' : ''}`} onClick={() => { clickOnRadioInput(team2) }}>
            {team2.Nm}
          </div>
        </div>
        <label htmlFor="eth" className="text-lg font-semibold">Enter amount of ETH:</label>
        <input value={betAmount} type="number" name="eth" min="0" className="border rounded-lg p-2 w-full" onChange={(e) => {setBetAmount(e.target.value)}} />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" onClick={submitFormBet}>
          Submit
        </button>
      </div>
    );
  };

  const handleValueChange = (newValue) => {
    setValue(newValue);
    const selectedDate = moment(newValue.startDate).format('YYYYMMDD');
    setDateRange(selectedDate);
  }

  const fetchTodayData = () => {
    const today = moment().format('YYYYMMDD');
    setDateRange(today);
  }

  const fetchTomorrowData = () => {
    const tomorrow = moment().add(1, 'days').format('YYYYMMDD');
    setDateRange(tomorrow);
  }

  const [isBetCardVisible, setBetCardVisible] = useState(false);

  return (
    <div className="App flex px-[150px] py-0 justify-around">
      <div className="flex items-start justify-start absolute top-0 left-0">
        <div className="flex justify-left space-x-4 p-4">
          <input type="checkbox" id="testMode" name="testMode" value="TestMode" className="form-checkbox h-5 w-5 text-blue-600" />
          <label htmlFor="testMode" className="ml-2 text-gray-700 text-sm">Test mode</label>
        </div>
      </div>
      <div className="absolute top-0 right-1 p-4">
        {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Wallet
        </button> */}
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
                value={value}
                onChange={handleValueChange}
              />
            </div>
          </div>

          {matchDates.length > 0 && <DateBlock data={matchDates} />}

        </div>
      </div>
      {isBetCardVisible && (
        <BetCard team1={betTeams.team1} team2={betTeams.team2} />
      )}
    </div>
  );
}

export default App;
