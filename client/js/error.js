let inOkState = false; // Current state of the website.
const elDivError = document.getElementById("error_message_div"); // error div 
const elDivRemedy = document.getElementById("remedy_message_div"); // remedy div 

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
	let el = createElement("p");
	if( typeof message === 'string' || message instanceof String) {
			el.innerText = message; 
	}else if(message instanceof Array) {
		let elList = createElement("li");

		message.forEach(function(item) {
				let li = document.createElement("li");
				let text = document.createTextNode(item);
				li.appendChild(text);
				elList.appendChild(li);
			});

		appendChild(el, elList);
	}else{
		console.log("Unexpected Data Type");
	}
	el.style.backgroundColor = "white";
	appendChild(containerDiv, el);
}

/*
 * Parameter: type: type of HTML that is needed to be created. Parameter should be a string.
 *
 * Details: Outputs the HTML element which type is the value that is passed into the function.
 * 
 * Return:  HTML element with the type that is passed into the function. 
 */
function createElement(type){
	return document.createElement(type);
}

/*
 * Parameter: parent: HTML element that the child parameter will be appended to
 *						child: HTML element which will be appended to the parent parameter
 *   
 * Details: Appends the child parameter to the parent parameter.
 */
function appendChild(parent, child){
	 parent.appendChild(child);
}

/*
 * Parameter: element: script element that is used to output the error message 
 *
 * Details: Called when the script fails to load. 
 * Passes possible solutions and the problem to error function.
 */
function scriptfail(element){
  inOkState = false;
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
