import { useState } from 'react'
import Volleyball from '../assets/volleyball.svg'
import Soccer from '../assets/soccer.svg'
import Baseball from '../assets/baseball.svg'
import Swimming from '../assets/swimming.svg'
import '../App.css'
import { Home, User, Slack, Dribbble, Heart, Edit, Search, HelpCircle } from 'react-feather';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { fetchOrPlaceholder} from '../api/api-funcs'
import { predict_options } from '../assets/data/placeholder-data'

const options = await fetchOrPlaceholder("/predict/options",null,predict_options)


function Predict() {
    let [show, setShow] = useState(false);

    function myFunc(e) {
        e.preventDefault();
        setShow(true);
        setTimeout(() => setShow(false), 9000);
    }


    // data from form/page is stored here
    let [conference, setConference] = useState('');
    let [school, setSchool] = useState('');
    let [position, setPosition] = useState('');
    let [year, setYear] = useState('');
    let [passingYDS, setPassingYDS] = useState('');
    let [YDSAttempt, setYDSAttempt] = useState('');
    let [TDS, setTDS] = useState('');
    let [INTS, setINTS] = useState('');

    // function to hand changes in form select inputs
    function handleConferenceChange(e) {
        e.preventDefault();
        setConference(e.target.value);
    }

    function handleSchoolChange(e) {
        e.preventDefault();
        setSchool(e.target.value);
    }

    function handlePositionChange(e) {
        e.preventDefault();
        setPosition(e.target.value);
    }

    function handleYearChange(e) {
        e.preventDefault();
        setYear(e.target.value);
    }

    // functions to handle changes in form text inputs
    function handlePassingYDSChange(e) {
        e.preventDefault(); // not sure if I need this but helps prevent page from refreshing
        setPassingYDS(e.target.value);
    }
    function handleYDSAttemptChange(e) {
        e.preventDefault();
        setYDSAttempt(e.target.value);
    }
    function handleTDSChange(e) {
        e.preventDefault();
        setTDS(e.target.value);
    }
    function handleINTSChange(e) {
        e.preventDefault();
        setINTS(e.target.value);
    }

    // function to handle form submission, will eventually send data to backend and get prediction back
    function handleSubmit1(e) {
        e.preventDefault(); // prevents page from refreshing when submit button is clicked
        alert(`Conference: ${conference}\nSchool: ${school}\nPosition: ${position}\nYear: ${year}`);
    }
    function handleSubmit2(e) {
        e.preventDefault(); // prevents page from refreshing when submit button is clicked
        alert(`Passing YDS: ${passingYDS}\nYDS/Attempt: ${YDSAttempt}\nTDS: ${TDS}\nINTS: ${INTS}`);
    }


    return (
        <main className='grid-container-main' >
            <header className='page-title center-vertical'><h1>Predict</h1></header>
            <form className='search-bar center-vertical'>
                <div className='row row-spacing'>
                    <input className='search-input' type='search' value='search for your team' />

                    <button type='submit'><Search size={30} /></button>

                </div>
            </form>

            <section className='predict-sect'>
                <div id='Environment-Section'>
                    <form onSubmit={handleSubmit1}>
                        <div className='predict-input row row-spacing'>
                            <label>Select a Conference:</label>
                            <select onChange={handleConferenceChange}>
                                <option>select...</option>
                                {options["conferences"].map((item) => (
                                    <option key = {item} value={item} >
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='predict-input row row-spacing'>
                            <label>Select a School:</label>
                            <select onChange={handleSchoolChange}>
                                <option>select...</option>
                                {options["schools"].map((item) => (
                                    <option key = {item} value={item} onChange={handleSchoolChange}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='predict-input row row-spacing'>
                            <label>Select a Position:</label>
                            <select onChange={handlePositionChange}>
                                <option >select...</option>
                                {options["positions"].map((item) => (
                                    <option key = {item} value={item} onChange={handlePositionChange}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='predict-input row row-spacing'>
                            <label>Select a Year:</label>
                            <select onChange={handleYearChange}>
                                <option>select...</option>
                                {options["years"].map((item) => (
                                    <option key = {item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='row row-spacing'>
                            <input type='submit' value='Submit' className='submit-btn' />
                            <input type='reset' value='Reset' className='reset-btn' />
                        </div>
                    </form>
                </div>
                <div className='make-line'></div>
                <div id="Prediction-Section">
                    <form onSubmit={handleSubmit2} >
                        <div className='predict-input row row-spacing'>
                            <label>Passing YDS:</label>
                            <input
                                className='text-input' inputMode='numeric' type='number' onChange={handlePassingYDSChange} />
                        </div>
                        <details className='app-row'>
                            <summary className='row'><HelpCircle /></summary>
                            <p>Passing Yards (YDS) is how many total yards they have successfully throw the ball over their career.</p>
                        </details>
                        <div className='predict-input row row-spacing'>

                            <label>YDS/ATTEMPT:</label>

                            <input className='text-input' inputMode='numeric' type='number' onChange={handleYDSAttemptChange} />
                        </div>

                        <div className='predict-input row row-spacing'>
                            <label>TDS:</label>
                            <input className='text-input' inputMode='numeric' type='number' onChange={handleTDSChange} />
                        </div>
                        <div className='predict-input row row-spacing'>
                            <label>INTS:</label>
                            <input className='text-input' inputMode='numeric' type='number' onChange={handleINTSChange} />
                        </div>
                        <div className='row row-spacing'>
                            <input type='submit' value='Submit' className='submit-btn' />
                            <input type='reset' value='Reset' className='reset-btn' />
                        </div>
                    </form >
                </div>
            </section>
        </main>
    )
}

export default Predict