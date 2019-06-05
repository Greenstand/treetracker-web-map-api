let inOkState = true; // Current state of the website.
const elDivError = document.getElementById("error-message-div"); // error div 
const elDivRemedy = document.getElementById("remedy-message-div"); // remedy div 

/*
 * Parameters: message: either array or string that contains the message or messages to display.
 *					  containerDiv: div where the messages are appended. Either remedyDiv or the errorDiv.
 *
 * Details: Displays the message by appending it to the div. It will display a paragraph if the message is a string
 *          If the message is an array, then an unordered list will be displayed. 
 */
function error(errorMessage, remedyMessage){
		displayMessage(errorMessage, elDivError);
		displayMessage(remedyMessage, elDivRemedy);
}

/*
 * Parameters: message: either array or string that contains the message or messages to display.
 *					   containerDiv: div where the messages are appended. Either remedyDiv or the errorDiv.
 *
 * Details: Displays the message by appending it to the div. It will display a paragraph if the message is a string
 *          If the message is an array, then an unordered list will be displayed. 
 */
function displayMessage(message, containerDiv){
	let el = document.createElement("p");
	if( typeof message === 'string') {
			el.innerText = message; 
	}else if(message instanceof Array) {
		let elList = document.createElement("li");

		message.forEach(function(item) {
				let li = document.createElement("li");
				let text = document.createTextNode(item);
				li.appendChild(text);
				elList.appendChild(li);
			});
		el.appendChild(elList);
	}else{
		console.log("Unexpected Data Type");
	}
    el.class += "hello"; 
	containerDiv.appendChild(el);
}


/*
 * Parameter: element: script element that is used to output the error message 
 *
 * Details: Called when the script fails to load. 
 * Passes possible solutions and the problem to error function.
 */
function scriptfail(element){
  if(inOkState){

	 inOkState = false;
  }
  let messagesRemedy = ["Check the config.js path and name.", " Read the README about acquiring the config files.", " Reload the page when done."];
  error(element.src + " failed to load", messagesRemedy)
}

/*
 * Details: Redirects back to index.html if the website is not in an error state.
 */
function checkErrorStatus(){
	if(inOkState){
	  location.replace("index.html");
	}
}

window.onload = checkErrorStatus;
