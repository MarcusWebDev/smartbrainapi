const handleProfileGet = (req, res, db) => {
	const { id } = req.params;
	db.select('*').from('users').where({id}) //this block of code selects all the rows in the users table where the id matches what is in the id paramater of the url. If the id is in the database it sends that data to the front end
		.then(user =>{
			if (user.length) { //this if statement is used instead of .catch because if the id doesn't exist, it returns an empty array. An empty array in boolean returns true, so it would not throw the error message
				res.json(user[0]) //so the if statement checks if there is a user in the array, which would make the statement true and responds that user, if not, 0 is false and it throws the error
			} else {
				res.status(400).json('Not found')
			}	
		})
		.catch(err => res.status(400).json('Error getting user'))
};

module.exports = {
	handleProfileGet: handleProfileGet
}