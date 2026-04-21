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
import {fetchOrPlaceholder } from '../api/api-funcs'
import {top_10_data} from '../assets/data/placeholder-data'

const params = new URLSearchParams({limit:10})
let data = await fetchOrPlaceholder("/players/data",params,top_10_data)


function Homepage() {
    const USD = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',});
    return (
        <main className='grid-container-main' >
            <header className='page-title center-vertical'><h1>Home</h1></header>
            <form className='search-bar center-vertical'>
                <div className='row row-spacing'>
                    <input className='search-input' type='search' value='search for your team' />
                    <button type='submit'><Search size={30} /></button>
                </div>
            </form>
            <section className='chart'>
                <table>
                    <thead>
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
                    </thead>
                    <tbody>
                    { 
                        data.map((item, index) => (
                            <tr key={item.player_id}>
                                <th>{index+1}</th>
                                <td>{`${item.first_name} ${item.last_name}`}</td>
                                <td>{item.school}</td>
                                <td>{item.sport}</td>
                                <td>{item.position}</td>
                                <td>{USD.format(item.nil)}</td>
                                <td>{`${item.nil_delta.toFixed(2)*100}%`}</td>
                                <td><Heart/></td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
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