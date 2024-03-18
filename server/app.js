const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const _ = require('lodash');
const {Web3} = require('web3');
const web3 = new Web3();

app.use(express.json());
app.use(cors())

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
                'X-RapidAPI-Key': 'fbdda89d74msh7b990edc2ea51eep1bcd58jsn73008d56b75f'
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
        console.log(result);
        res.json({
            data: { result },
            statusCode: 200
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Bad request' });
    }
});

app.listen(3000, () => console.log('Server is listening on port 3000'));