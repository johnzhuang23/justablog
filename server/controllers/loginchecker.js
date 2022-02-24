//Logged in
function loginYes(req, res, next) {
	if (req.session.user) {
		req.flash('error', 'You have already logged in.');
		console.log(req.flash('error').toString())
		return res.redirect('back');
	}
	next();
}

//not logged in
function loginNo(req, res, next) {
	if (!req.session.user) {
		req.flash('error', 'Please log in first.');
		console.log(req.flash('error').toString())
		return res.redirect('/user/login');
	}
	next();
}

exports.loginYes = loginYes;
exports.loginNo = loginNo;
