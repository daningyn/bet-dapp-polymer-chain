const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const _ = require('lodash');
const { NBA_LEAGUE, NBA_SESSION } = require('./common/constant');

app.use(express.json());
app.use(cors())

// user_address
// matchId ~ gameId
// predictedTeam ~ betId 
// NFTId
// Amount
// timestamp

// WIN NFT (Draw ~ 1)
// Amount
// Revenue = 0
// matchId
// predictedTeam
// NFTId

// WIN NFT (Win ~ 2)
// Amount
// Revenue = 1
// matchId
// predictedTeam
// NFTId

app.get('/api/nba-result', async (req, res) => {
    try {
        const gameId = req.query.gameId;
        const betId = req.query.betId;
        if (!gameId || !betId) {
            throw new Error('Missing queries');
        }
        const response = await axios.get(`https://livescore6.p.rapidapi.com/matches/v2/get-scoreboard?Category=basketball&Eid=${gameId}`, {
            headers: {
                'X-RapidAPI-Host': 'livescore6.p.rapidapi.com',
                'X-RapidAPI-Key': '363de001aamsh7f7c5bb8e26fce2p15a3cbjsn6618398a7ea9'
            }
        });

        let result; // 1: team lose, 2: team draw, 3: team win
        const T1 = _.get(response.data, 'T1[0]');
        const Tr1 = _.get(response.data, 'Tr1');
        const Tr2 = _.get(response.data, 'Tr2');
        if (_.get(T1, 'ID') === betId) {
            result = Tr1 > Tr2 ? 3 : Tr1 === Tr2 ? 2 : 1;
        } else {
            result = Tr1 < Tr2 ? 3 : Tr1 === Tr2 ? 2 : 1;
        }
        res.json({
            result,
            team: T1.Nm,
            statusCode: 200
        });
    } catch (error) {
        console.log('error: ', error.message);
        res.status(200).json({ error: 'Bad request' });
    }
});

app.get('/api/matches', async (req, res) => {
    const date = req.query.date;
    if (!date) {
        return res.status(400).json({ error: 'Missing date' });
    }
    try {
        const response = await axios.get(`https://livescore6.p.rapidapi.com/matches/v2/list-by-date?Category=basketball&Date=${date}&Timezone=-5`, {
            headers: {
                'X-RapidAPI-Host': 'livescore6.p.rapidapi.com',
                'X-RapidAPI-Key': '363de001aamsh7f7c5bb8e26fce2p15a3cbjsn6618398a7ea9'
            }
        });
        let result = _.chain(response.data.Stages).filter(stage => stage.Ccd === NBA_LEAGUE && stage.Scd === NBA_SESSION).value();
        result = result[0];
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Bad request' });
    }
})

app.listen(5555, () => console.log('Server is listening on port 5555'));