import React,{Fragment,useState,useEffect} from 'react'
import {BrowserRouter,Routes,Route,Outlet} from 'react-router-dom'
import {UserContext} from './hooks/UserContext'
import {AuthPage} from './pages/AuthPage.js'
import {RegisterPage} from './pages/RegisterPage.js'
import {UserPage} from './pages/UserPage.js'
import {PrivateRoute} from './pages/PrivateRoute.js'
import {MyprofilePage} from './pages/MyprofilePage.js'
import {Test1Page} from './pages/Test1Page.js'
import {Test2Page} from './pages/Test2Page.js'
import {Test3Page} from './pages/Test3Page.js'
import {ChangepasswordPage} from './pages/ChangepasswordPage.js'



 function App() {
	
	const [user,setUser] = useState(null);
	const [isLoading,setIsLoading] = useState(false);
	const [auth,setAuth] = useState(false);
	
	function useauthenticate(){
		setAuth(true);
		console.log('AUTH IS OK');
	}
	
	useEffect(() => {
		fetch('/api')
        .then(response => response.text())
		.then(user => {
			setUser(user);
			setIsLoading(true);
			console.log(user,isLoading);
			return {
				user: user,
				isLoading: true
			   }
        }).catch(err => {
			setIsLoading(false);
          return {
				isLoading: false
			   }
        });
		
	},[]);
	
  if (!isLoading){
	  return <div id = "wrapper">
	           <div id = "rotate">
			     <div id = "ball1"></div>
				 <div id = "ball2"></div>
				 <div id = "ball3"></div>
			   </div>
			 </div>;
  }	
  
  return (
    <BrowserRouter>
     <UserContext.Provider value = {[user,isLoading,setUser]}>	
	  <Fragment>
	    <Routes>
          <Route path='/' element={<PrivateRoute/>}>
            <Route index element={<UserPage/>}></Route>			
			   <Route path='MyprofilePage' element={<MyprofilePage/>}>
			     
			   </Route>
			   <Route path='MyprofilePage/changepassword' element={<ChangepasswordPage/>}/>
			   <Route path='test1' element={<Test1Page/>}/>
			   <Route path='test2' element={<Test2Page/>}/>
			   <Route path='test3' element={<Test3Page/>}/>
          </Route>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/login' element={<AuthPage authenticate = {useauthenticate}/>}/>
        </Routes> 
      </Fragment>
     </UserContext.Provider>	  
	</BrowserRouter>
	
  );
  
}

export default App;

