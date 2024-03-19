import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Datepicker from "react-tailwindcss-datepicker";

function App() {

  const [dateRange, setDateRange] = useState(moment().format('YYYYMMDD').toString());
  const [matchDates, setMatchDate] = useState([]);
  const [betTeams, setBetTeams] = useState({ team1: '', team2: '' });
  const [value, setValue] = useState({
    startDate: null,
    endDate: null
  });


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
    const team1 = data.T1[0].Nm.trim();
    const team2 = data.T2[0].Nm.trim();
    const team1Logo = `https://lsm-static-prod.livescore.com/medium/${data.T1[0].Img}`;
    const team2Logo = `https://lsm-static-prod.livescore.com/medium/${data.T2[0].Img}`;

    const handleBetClick = () => {
      setBetCardVisible(true);
      setBetTeams({ team1, team2 });
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
              <span>{team1}</span>
            </div>
            <span>vs</span>
            <div className="flex flex-col items-center">
              <img className='h-[48px] w-[48px]' src={team2Logo} alt="team2 logo" />
              <span>{team2}</span>
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
    return (
      <div className="flex flex-col items-start justify-start border h-80 p-4 mt-20 m-1 w-3/12 space-y-2 bg-white shadow-lg rounded-lg">
        <div className="text-lg font-semibold">Choose a team:</div>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="radio" value="team1" name="team" className="mr-2" /> {team1}
          </label>
          <label className="flex items-center">
            <input type="radio" value="team2" name="team" className="mr-2" /> {team2}
          </label>
        </div>
        <label htmlFor="eth" className="text-lg font-semibold">Enter amount of ETH:</label>
        <input type="number" id="eth" name="eth" min="0" step="0.01" className="border rounded-lg p-2 w-full" />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
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
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Wallet
        </button>
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
