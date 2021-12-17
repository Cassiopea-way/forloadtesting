import React,{ Component } from 'react';
//import Logout from './components/test1/menu/Logout.js';

const Logout = () => {
	
	function changeLocation(){
		document.location = '/user';
	}
	return <button onClick = {changeLocation}>Выйти</button>;
}

export default Logout;