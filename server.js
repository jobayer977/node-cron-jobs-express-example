const express = require('express');
const app = express();

const axios = require('axios');
const cron = require('node-cron');

const tempDB = {};

async function getWeatherData(lat, lon) {
	try {
		const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`;
		const response = await axios.get(url);
		const data = response.data;
		tempDB[new Date().toUTCString()] = data;
	} catch (error) {
		console.log(error);
	}
}

cron.schedule(`*/2 * * * * *`, async () => {
	console.log('Running cron job');
	await getWeatherData(40.7128, -74.006);
});

app.get('/weather', (req, res) => {
	return res.json(tempDB);
});

app.get('/', (req, res) => {
	res.send('Hello, world!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
