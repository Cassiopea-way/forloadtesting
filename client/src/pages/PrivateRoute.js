import React,{useContext,useState} from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import {UserContext} from './../hooks/UserContext'

export const PrivateRoute = () => {
	const [user,isLoading,setUser] = useContext(UserContext);
	console.log(user,isLoading);
	let isAuthenticated = false;
	if (user == 'пользователь не авторизован'){
		isAuthenticated = false;
	} else {
		isAuthenticated = true;
	}
	
	return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}