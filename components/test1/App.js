import React,{ Component } from 'react';
import Menu from './components/test1/menu/Menu.js';
import Joinuser from './components/test1/joinedusers/Joinuser.js';
import Field from './components/test1/field/Field.js';

const App = () => {
	return <div>
	          <Menu />
			  <Joinuser />
			  <Field />  
	       </div>;
}

export default App;