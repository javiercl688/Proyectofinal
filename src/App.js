import logo from './logo.svg';
import React from 'react';
import './App.css';
import Partes from './components/Partes';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Partes List</h1>
                <Partes />
            </header>
        </div>
    );
}

export default App;
