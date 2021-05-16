function redirect() {
	var username = document.getElementById('username').value
	var comment = document.getElementById('comment').value
	// if username or comment is empty redirect to contact page
	if (username == "" || comment == ""){
        location = 'contact';
	}
    else{
    	return true;
    }
    return false;
}