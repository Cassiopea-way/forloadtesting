import React from 'react'
import {Link,useNavigate} from "react-router-dom"

export const UserPage = () => {
	let navigate = useNavigate();
	return (
	  <div id = "userpanel">
	      <button onClick = {event => {navigate('/UserPage/MyprofilePage');}} className = "buttonmenu">Мой профиль</button>
		  <button onClick = {event => {navigate('/UserPage/Test1');}} className = "buttonmenu">Тест 1</button>
		  <button onClick = {event => {navigate('/UserPage/Test2');}} className = "buttonmenu">Тест 2</button>
		  <button onClick = {event => {navigate('/UserPage/Test3');}} className = "buttonmenu">Тест 3</button>
		  <button onClick = {event => {navigate('/login');}} className = "buttonmenu">Выйти</button>
	  </div>
	)
}