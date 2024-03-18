import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import _ from 'lodash';

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

  const [dateRange, setDateRange] = useState([20240319, 20240320]);
  const [matchDates, setMatchDate] = useState([]);

  useEffect(() => {
    setMatchDate([]);
    for (let i=0; i<dateRange.length; i++) {
      try {
        const options = {
          method: 'GET',
          url: `api/matches?date=${dateRange[i]}`
        };
        axios.request(options).then((res) => {
          setMatchDate([...matchDates, res.data]);
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const DateBlock = async ({data}) => {
    console.log('data ne1: ', data);
    return data.Events.map((match) => {
      return <Match data={match} />
    });
  }

  const Match = async (data) => {
    const dateStr = data.Esd;
    const date = moment(dateStr, 'YYYYMMDDhhmmss');
    const time = date.format('hh:mm A');
    return (
      <div>
        {/* <h1>Match</h1>
        <h2>{data['T1'][0]['Nm']}</h2>
        <h2>{data['T2'][0]['Nm']}</h2>
        <h2>{time}</h2> */}
      </div>
    )
  }

  return (
    <div className="App">
      {matchDates.map((data) => {
        return <DateBlock data={data} />
      })}
    </div>
  );
}

export default App;
