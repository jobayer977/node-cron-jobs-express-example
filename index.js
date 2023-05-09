const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const corn = require('node-cron');
app.use(bodyParser.json());

const reminders = [];
function scheduleReminder(reminder) {
	const { title, description, remindInSeconds } = reminder;
	const job = corn.schedule(`*/${remindInSeconds} * * * * *`, () => {
		console.log(`Reminder: ${title} - ${description}`);
		job.destroy();
	});
}

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/reminders', (req, res) => {
	res.json(reminders);
});

app.post('/reminders', (req, res) => {
	const reminder = {
		id: uuidv4(),
		title: req.body.title,
		description: req.body.description,
		remindInSeconds: req.body.remindInSeconds,
	};
	reminders.push(reminder);
	scheduleReminder(reminder);
	res.status(201).json(reminder);
});

app.listen(3000, () => {
	console.log('Server listening on port 3000');
});
