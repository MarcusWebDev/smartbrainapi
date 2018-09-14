const handleSignin = (req, res, db, bcrypt) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json('Incorrect form submission');
	}
	db.select('email', 'hash').from('login') //select from the login database the email and hash columns
		.where('email', '=', email) //where the email is equal to the email found in the body of the request
		.then(data => { //data is equal to the row where the email was found in the login table
			const isValid = bcrypt.compareSync(password, data[0].hash); //check if the password in the body of the request matches the hash connected to the email entered, returns a true or false
			if (isValid) { //if the credentials are correct, respond with the user's data
				return db.select('*').from('users') //you always have to return when operating on two tables so that the other table knows about it? The explanation was weird (section 26, Sign In, 14:30)
					.where('email', '=', email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('Unable to get user'))
			} else {
				res.status(400).json('Wrong credentials') //if password is wrong, give wrong crednetials message
			}
		})
		.catch(err => res.status(400).json('Wrong credentials')) //if email is wrong, give wrong credentials message
};

module.exports = {
	handleSignin: handleSignin
}