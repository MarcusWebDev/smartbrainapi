const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '201a48fb067f4a59a408e05706e274c3'
});

const handleApiCall = (req, res) => {
app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
    	res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with API'))
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id) //where the id in the database = the id in the body
	.increment('entries', 1) //allows you to increment a row in the database by a set amount each time the code is run
	.returning('entries') //returns the entries column
	.then(entries => {
		res.json(entries[0]); //ensures only one user is accessed, being the user who's id matches the id in the body
	})
	.catch(err => res.status(400).json('Unable to get entries'))
};

module.exports = {
	handleImage,
	handleApiCall
}