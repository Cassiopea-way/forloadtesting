import React from 'react'

export const UsersList = ({loading,users}) => {
	console.log(users);
	const [onclass,setOnclass] = React.useState('off');
	
	React.useEffect(() => {
		setOnclass('on');
	},[]);
	
	return loading ? (
	<div>
	 <div className={onclass}>Онлайн : ({users.length})</div>
	   <ul className="userlist">
	    {users.map(user => {
			return (
			  <li>
			    {user}
			  </li>
			)
		})}
	   </ul>
	 </div>) : (
	 <p>Loading</p>
	)
}