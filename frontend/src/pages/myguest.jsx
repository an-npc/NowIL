import { useState } from 'react'
import Volleyball from '../assets/volleyball.svg'
import Soccer from '../assets/soccer.svg'
import Baseball from '../assets/baseball.svg'
import Swimming from '../assets/swimming.svg'
import '../App.css'
import { Home, User, Slack, Dribbble, Heart, Edit, Search } from 'react-feather';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

let data = [
    {
        id: 1,
        rank: 1,
        athlete: 'John Doe',
        college: 'University of Nowhere',
        sport: 'Basketball',
        position: 'Guard',
        nilValue: '$1M',
        nilChange: '+$500K',
        following: true
    },
    {
        id: 2,
        rank: 2,
        athlete: 'Jane Smith',
        college: 'College of Somewhere',
        sport: 'Football',
        position: 'Quarterback',
        nilValue: '$800K',
        nilChange: '+$300K',
        following: false
    },
    {
        id: 3,
        rank: 3,
        athlete: 'Mike Johnson',
        college: 'State University',
        sport: 'Baseball',
        position: 'Pitcher',
        nilValue: '$600K',
        nilChange: '+$200K',
        following: true
    }
];

function Guest() {
    return (
        <main className='grid-container-main' >
            <header className='page-title center-vertical'><h1>guest</h1></header>
            <form className='search-bar center-vertical'>
                <div className='row'>
                    <input type='search' value='search for your team' />
                    <input type='submit' />
                </div>
            </form>
            <section className='chart'>
                <div id='header' className='table-row-header'>
                    <p>#</p>
                    <p>ATHLETE</p>
                    <p>COLLEGE</p>
                    <p>SPORT</p>
                    <p>POS</p>
                    <p>NIL VALUE</p>
                    <p>NIL CHANGE</p>
                    <p>FOLLOW</p>
                </div>
                <div className=''>
                    {data.map((item) => (
                        <div key={item.id} className='table-row'>
                            <p>{item.rank}</p>
                            <p>{item.athlete}</p>
                            <p>{item.college}</p>
                            <p>{item.sport}</p>
                            <p>{item.position}</p>
                            <p>{item.nilValue}</p>
                            <p>{item.nilChange}</p>
                            <p>{item.following ? 'Following' : 'Not Following'}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className='trending'>
                <div className='sub-trending'>
                    <div className='sports-card'>
                        <img
                            src={Volleyball}
                            alt='volleyball-img'
                            className='change-color' />
                        <p className='sports-title'>VOLLEYBALL</p>
                    </div>
                    <div className='sports-card'>
                        <img
                            src={Baseball}
                            alt='volleyball-img'
                            className='change-color' />
                        <p className='sports-title'>BASEBALL</p>
                    </div>
                    <div className='sports-card'>
                        <img
                            src={Swimming}
                            alt='volleyball-img'
                            className='change-color' />
                        <p className='sports-title'>SWIMMING</p>
                    </div>
                    <div className='sports-card'>
                        <img
                            src={Soccer}
                            alt='volleyball-img'
                            className='change-color' />
                        <p className='sports-title'>SOCCER</p>
                    </div>
                </div>
            </section>
            <section className='news-section2'>

            </section>
        </main>
    );
}

export default Guest;