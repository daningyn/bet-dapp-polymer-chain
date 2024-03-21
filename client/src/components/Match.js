import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

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

  return (
    <div key={uuidv4()} className="flex items-center justify-between border p-4 m-1">
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
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => props.handleBetClick(team1, team2, data.Eid)}>
          Bet
        </button>
      </div>
    </div>
  )
}

export default Match;
