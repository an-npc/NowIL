import { useState, useRef, useCallback, ReactComponent } from 'react'
import Volleyball from '../assets/volleyball.svg'
// import { ReactComponent as Volleyball } from '../assets/volleyball.svg'
import Soccer from '../assets/soccer.svg'
import Baseball from '../assets/baseball.svg'
import Swimming from '../assets/swimming.svg'
import '../App.css'
import { Home, User, Slack, Dribbble, Heart, Edit, Search } from 'react-feather';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

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
    },
    {
        id: 4,
        rank: 4,
        athlete: 'Sarah Williams',
        college: 'Pacific University',
        sport: 'Soccer',
        position: 'Forward',
        nilValue: '$550K',
        nilChange: '+$150K',
        following: false
    },
    {
        id: 5,
        rank: 5,
        athlete: 'Chris Davis',
        college: 'Midwest College',
        sport: 'Basketball',
        position: 'Center',
        nilValue: '$500K',
        nilChange: '+$100K',
        following: true
    },
    {
        id: 6,
        rank: 6,
        athlete: 'Emily Carter',
        college: 'Eastern State University',
        sport: 'Gymnastics',
        position: 'All-Around',
        nilValue: '$450K',
        nilChange: '+$75K',
        following: false
    },
    {
        id: 7,
        rank: 7,
        athlete: 'Marcus Thompson',
        college: 'Southern Tech',
        sport: 'Football',
        position: 'Wide Receiver',
        nilValue: '$420K',
        nilChange: '+$120K',
        following: false
    },
    {
        id: 8,
        rank: 8,
        athlete: 'Olivia Nguyen',
        college: 'Northern University',
        sport: 'Swimming',
        position: 'Freestyle',
        nilValue: '$380K',
        nilChange: '+$60K',
        following: true
    },
    {
        id: 9,
        rank: 9,
        athlete: 'DeShawn Harris',
        college: 'Atlantic College',
        sport: 'Track & Field',
        position: 'Sprinter',
        nilValue: '$350K',
        nilChange: '+$90K',
        following: false
    },
    {
        id: 10,
        rank: 10,
        athlete: 'Mia Rodriguez',
        college: 'Western State College',
        sport: 'Volleyball',
        position: 'Setter',
        nilValue: '$300K',
        nilChange: '+$50K',
        following: true
    }
];

function Homepage() {
    return (
        <main className='grid-container-main' >
            <header className='page-title center-vertical'><h1>homepage</h1></header>
            <form className='search-bar center-vertical'>
                <div className='row row-spacing'>
                    <input className='search-input' type='search' value='search for your team' />
                    <button type='submit'><Search size={30} /></button>
                </div>
            </form>
            <section className='chart'>
                <tr>
                    <th>#</th>
                    <th>ATHLETE</th>
                    <th>COLLEGE</th>
                    <th>SPORT</th>
                    <th>POS</th>
                    <th>NIL VALUE</th>
                    <th>NIL CHANGE</th>
                    <th>FOLLOW</th>
                </tr>

                {
                    data.map((item) => (
                        <tr>
                            <th>{item.rank}</th>
                            <td>{item.athlete}</td>
                            <td>{item.college}</td>
                            <td>{item.sport}</td>
                            <td>{item.position}</td>
                            <td>{item.nilValue}</td>
                            <td>{item.nilChange}</td>
                            <td>{item.following ? <Heart fill='red' stroke='darkred' /> : <Heart />}</td>
                        </tr>
                    ))
                }

            </section>
            <section className='trending'>
                <div className='sub-trending'>
                    <div className='sports-card'>
                        <img
                            src={Volleyball}
                            alt='baseball-img'
                            className='change-color' />
                        <p className='sports-title'>VOLLEYBALL</p>
                    </div>
                    <div className='sports-card'>
                        <img
                            src={Baseball}
                            alt='baseball-img'
                            className='change-color' />
                        <p className='sports-title'>BASEBALL</p>
                    </div>
                    <div className='sports-card'>
                        <img
                            src={Swimming}
                            alt='swimming-img'
                            className='change-color' />
                        <p className='sports-title'>SWIMMING</p>
                    </div>
                    <div className='sports-card'>
                        <img
                            src={Soccer}
                            alt='soccer-img'
                            className='change-color' />
                        <p className='sports-title'>SOCCER</p>
                    </div>
                </div>
            </section>
            <section className='news-section2'>

            </section>
        </main>
    )
}

export default Homepage;