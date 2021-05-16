function redirect() {
	window.location = "password"
}

function passwordRedirect(){
	var password =  document.getElementById('password').value
	// if password is correct redirect to write blog
	if (password == "1234"){
		location = "writeBlog"
	}
	// go back to blog
	else{
		location = "blog"
	}
	return false
}

function gotoblogRedirect(){
	window.location = "blog"
}