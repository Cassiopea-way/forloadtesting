import React,{ Component } from 'react';

import Beginbutton from './components/test1/menu/Beginbutton.js';
import Records from './components/test1/menu/Records.js';
import Logout from './components/test1/menu/Logout.js';

const Menu = () => {
	return <div>
	          <Buttonbegin />
			  <Records />
			  <Logout />  
	       </div>;
}

export default Menu;