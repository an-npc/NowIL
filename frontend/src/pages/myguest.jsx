import { useState } from 'react'
import Volleyball from '../assets/volleyball.svg'
import Soccer from '../assets/soccer.svg'
import Baseball from '../assets/baseball.svg'
import Swimming from '../assets/swimming.svg'
import '../App.css'
import { Home, User, Slack, Dribbble, Heart, Edit, Search } from 'react-feather';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {fetchOrPlaceholder } from '../api/api-funcs'
import {top_10_data} from '../assets/data/placeholder-data'

const params = new URLSearchParams({limit:10})
let data = await fetchOrPlaceholder("/players/data",params,top_10_data)

function Guest() {
    const USD = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',});
    return (
        <main className='grid-container-main' >
            <header className='page-title center-vertical'><h1>Players</h1></header>
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
                    {data.map((item,index) => (
                        <div key={item.player_id} className='table-row'>
                            <p>{index+1}</p>
                            <p>{`${item.first_name} ${item.last_name}`}</p>
                            <p>{item.school}</p>
                            <p>{item.sport}</p>
                            <p>{item.position}</p>
                            <p>{USD.format(item.nil)}</p>
                            <p>{`${item.nil_delta.toFixed(2)*100}%`}</p>
                            <p><Heart/></p>
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