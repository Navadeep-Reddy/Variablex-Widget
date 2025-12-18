import { render } from 'preact';

import { Home } from './pages/Home/index.jsx';
import './style.css';

export function App() {
	return <Home />;
}

render(<App />, document.getElementById('app'));
