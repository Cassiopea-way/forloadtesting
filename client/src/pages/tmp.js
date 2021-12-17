fetch('/api')
		.then(response => response.text())
		.then(user => {
			setIsAuth(user = "pisos" ? true : false);
		})
		
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute = () => {
	const [isauth,setIsAuth] = React.useState(false);
	React.useEffect(() => {
		const fetchData  = async() => {
			const response = await fetch('/api');
            const user = await response.text();
		    setIsAuth(true);
		}
		fetchData();
	},[]);
	
	return isauth ? <Outlet /> : <Navigate to="/login" />;
}

import React,{useContext} from 'react'
import {Route,Navigate} from 'react-router-dom'
import {UserContext} from './../hooks/UserContext'


export default function PrivateRoute(props) {
	
	const {user,isLoading} = useContext(UserContext);
	const {component: Component,...rest} = props;
	
	if (user) {
		return (<Route {...rest} render={(props) => (<Component {...props}/>)}/>)
	}
	
	return <Navigate to='/login'/>
}