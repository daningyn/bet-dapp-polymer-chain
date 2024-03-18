import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Datepicker from "react-tailwindcss-datepicker";

const getListByDate = async (date) => {

  const options = {
    method: 'GET',
    url: 'https://livescore6.p.rapidapi.com/matches/v2/list-by-date',
    params: {
      Category: 'basketball',
      Date: '20240318',
      Timezone: '-5'
    },
    headers: {
      'X-RapidAPI-Key': 'fbdda89d74msh7b990edc2ea51eep1bcd58jsn73008d56b75f',
      'X-RapidAPI-Host': 'livescore6.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

const getMatchResult = async (id) => {

  const options = {
    method: 'GET',
    url: 'https://livescore6.p.rapidapi.com/matches/v2/get-scoreboard',
    params: {
      Category: 'basketball',
      Eid: '1057946'
    },
    headers: {
      'X-RapidAPI-Key': 'fbdda89d74msh7b990edc2ea51eep1bcd58jsn73008d56b75f',
      'X-RapidAPI-Host': 'livescore6.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
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

  const [dateRange, setDateRange] = useState(20240319);
  const [matchDates, setMatchDate] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [betTeams, setBetTeams] = useState({ team1: '', team2: '' });


  useEffect(() => {
    setMatchDate([]);
    const fetchData = async () => {
      try {
        // const options = {
        //   method: 'GET',
        //   url: `api/matches?date=${dateRange}`
        // };
        // const res = await axios.request(options);
        // console.log('res11111:', res);
        // setMatchDate([res.data]);
        const res = await JSON.parse(dataJson);
        console.log(res);
        setMatchDate([res.data]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [dateRange]); // Thêm dateRange vào mảng dependencies

  const DateBlock = ({ data }) => {
    // console.log('data?.Events: ', data);
    return data?.map((match) => {
      console.log('match.Events: ', match.Events);
      return match.Events.map((event, index) => {
        console.log('event: ', event);
        return <Match data={event} index={index} />
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

    console.log('dateStr:', data);

    const handleBetClick = () => {
      setBetCardVisible(true);
      setBetTeams({ team1, team2 });
    };

    return (
      <div className="flex items-center justify-between border p-4 m-1">
        <div>
          <p>{time}<br />{dateFormatted}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Match {index + 1}</p>
          <div className="grid grid-cols-3 items-center gap-2">
            <span className="text-right">{team1}</span>
            <span>vs</span>
            <span className="text-left">{team2}</span>
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
      <div className="flex flex-col items-start justify-start border h-80 p-4 mt-20 m-1 w-3/12 space-y-2 bg-white shadow-lg rounded-lg">          <div className="text-lg font-semibold">Choose a team:</div>
        <div id="team" className="space-y-2">
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

  const [value, setValue] = useState({
    startDate: null,
    endDate: null
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  }

  const [isBetCardVisible, setBetCardVisible] = useState(false);

  return (
    <div className="App flex">
      <div className="flex items-start justify-start">
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
      <div className="w-7/12">
        <div className="flex flex-col max-w-5xl mx-auto">
          <div className="flex justify-left space-x-4 p-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Today
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
