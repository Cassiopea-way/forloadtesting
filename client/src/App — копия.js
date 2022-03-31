import React,{Fragment,useState} from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import {UserContext} from './hooks/UserContext'
//import useFindUser from './hooks/useFindUser'
import {AuthPage} from './pages/AuthPage.js'
import {RegisterPage} from './pages/RegisterPage.js'
import {UserPage} from './pages/UserPage.js'
import {PrivateRoute} from './pages/PrivateRoute.js'
import {MyprofilePage} from './pages/MyprofilePage.js'
import {Test1Page} from './pages/Test1Page.js'
import {Test2Page} from './pages/Test2Page.js'
import {Test3Page} from './pages/Test3Page.js'
import {ChangepasswordPage} from './pages/ChangepasswordPage.js'



 class App extends React.Component {
	//let userObj = await useFindUser();
	//console.log(userObj);
	
	//const {user,setUser} = userObj.user;
	//const {isLoading,setIsLoading} = userObj.isLoading;
	
	const {user,setUser} = useState(null);
	const {isLoading,setIsLoading} = useState(false);
	
	//console.log(user,setUser,isLoading);
	fetch('/api')
        .then(response => response.text())
		.then(user => {
			return {
				user: user,
				isLoading: true
			   }
        }). catch(err => {
          return {
				isLoading: false
			   }
        });
	
	/*return <div>
		sdfsdf
	</div>*/
	
  return (
    <BrowserRouter>
     <UserContext.Provider value = {{user,isLoading}}>	
	  <Fragment>
	    <Routes>
          <Route path='/' element={<PrivateRoute/>}>
            <Route path='/UserPage' element={<UserPage/>}> 
			   <Route path='/UserPage/MyprofilePage' element={<MyprofilePage/>}>
			     <Route path='/UserPage/MyprofilePage/changepassword' element={<ChangepasswordPage/>}/>
			   </Route>
			   <Route path='/UserPage/test1' element={<Test1Page/>}/>
			   <Route path='/UserPage/test2' element={<Test2Page/>}/>
			   <Route path='/UserPage/test3' element={<Test3Page/>}/>
			</Route>
          </Route>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/login' element={<AuthPage/>}/>
        </Routes> 
      </Fragment>
     </UserContext.Provider>	  
	</BrowserRouter>
	
  );
  
}

export default App;
