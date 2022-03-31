import React from 'react'

export const MessageList = ({loadingmessages,messagehistory}) => {
	console.log(messagehistory);
	return loadingmessages ? (
	  <ul className="messagelist">
	    {messagehistory.map(message => {
			return (
			  <li key={message._id}>
			    <div id = "user">
				  {message.authuser}
				</div>
				<div id = "message">
				  {message.usermessage}
				</div>
			  </li>
			)
		})}
	  </ul>
	) : (
	<p>loading</p>
	)
}