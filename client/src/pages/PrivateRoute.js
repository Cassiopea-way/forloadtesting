
import React,{useContext} from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import {UserContext} from './../hooks/UserContext'

export const PrivateRoute = () => {
	const {user,isLoading} = useContext(UserContext);
	console.log(user,isLoading);
	
	return isLoading ? <Outlet /> : <Navigate to="/login" />;
}