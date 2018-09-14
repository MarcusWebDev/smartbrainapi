const handleRegister = (req, res, db, bcrypt) => {
	const {email, name, password} = req.body;
	if (!email || !name || !password) {
		return res.status(400).json('Incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);
	//This db block adds the new user to the database under the users table
		db.transaction(trx => { //trx replaces the db const for database syntax within the transaction
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login') //insert into the login table
			.returning('email') //return the email
			.then(loginEmail => { 
				return trx('users') //do this transaction also in the users table
					.returning('*') //this method returns all the columns in the users table
					.insert({
						email: loginEmail[0], //this makes sure that the value isn't stored as array in the database and is strictly just the email value. Also this will be the same email inserted into login
						name: name,
						joined: new Date()
					}).then(user => {
						res.json(user[0]); // this line ensures that only the user that registered is returned from the users table
					})
			})
			.then(trx.commit) //commit the changes to the database
			.catch(trx.rollback) //if there are any errors, rollback all the changes to what they were before the operation
		})
		.catch(err => res.status(400).json('Unable to register.')) //this line catches any errors that occur during this process and responds with "unable to register"
};

module.exports = {
	handleRegister: handleRegister
};