import { useState } from 'react';
import Create from './crud/Create';
import ReadDelete from './crud/ReadDelete';
import Update from './crud/Update';
import ButtonBar from './ButtonBar';

function Crud() {
	const [activeView, setActiveView] = useState('create');

	return (
			<div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #181818 0%, #232526 100%)', display: 'flex', flexDirection: 'column', width: '100vw', color:'white'}}>
				<ButtonBar />
				<main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center" style={{ width: '100%', padding: '3vw 0' }}>
					<div className="shadow-lg rounded-4 p-4" style={{ background: 'rgba(30,30,30,0.95)', width: 'min(98vw, 1100px)', maxWidth: '1100px' }}>
					<div className="mb-4 d-flex justify-content-center">
						<button
							className={`btn btn-outline-primary mx-2 ${activeView === 'create' ? 'active' : ''}`}
							onClick={() => setActiveView('create')}
						>Create</button>
						<button
							className={`btn btn-outline-success mx-2 ${activeView === 'readdelete' ? 'active' : ''}`}
							onClick={() => setActiveView('readdelete')}
						>Read/Delete</button>
						<button
							className={`btn btn-outline-warning mx-2 ${activeView === 'update' ? 'active' : ''}`}
							onClick={() => setActiveView('update')}
						>Update</button>
					</div>
					{activeView === 'create' && <Create />}
					{activeView === 'readdelete' && <ReadDelete />}
					{activeView === 'update' && <Update />}
				</div>
			</main>
			<footer className="text-center py-4" style={{ background: '#111', color: '#bbb', letterSpacing: '1px', fontSize: '1.05rem' }}>
				&copy; {new Date().getFullYear()} Nicholas Lacapria of FakeStore. All rights reserved.
			</footer>
		</div>
	);
}

export default Crud;
