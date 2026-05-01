import { useState } from 'react'
import Baseball from '../assets/baseball.svg'
import Football from '../assets/football.svg'
import Volleyball from '../assets/volleyball.svg'
import Soccer from '../assets/soccer.svg'
import Swimming from '../assets/swimming.svg'
import Golf from '../assets/golf.svg'
import '../App.css'
import { Home, User, Slack, Dribbble, Heart, Edit, Search } from 'react-feather';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

let college_logo_urls = [
    'https://upload.wikimedia.org/wikipedia/commons/a/a1/Brown_University_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/2/29/Alabama_State_University_wordmark.svg',
    'https://upload.wikimedia.org/wikipedia/commons/4/4b/Duke_University_wordmark_full_gothic.svg',
    'https://upload.wikimedia.org/wikipedia/commons/6/65/Texas_A%26M_University_2021_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/4/4b/Cornell_University_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/5/50/Ohio_State_University_text_logo_unified.svg',
    'https://upload.wikimedia.org/wikipedia/commons/1/13/Miami_University_logo.svg'


];

let player_img_urls = [
    "https://upload.wikimedia.org/wikipedia/commons/1/1b/025_CG.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/95/105a-319.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/a/a0/Andrii_Yakovenko_with_a_radio-controlled_boat_2020.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/7/78/Arsen_Karen_Harutyunyan%28ARM%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/0/0d/Brandon_J._Glover_%28Cam_Newton_7V7_Tournament_w-_MTAG%29.jpg"

];

function Following() {
    return (
        <main className='grid-container-main' >
            <header className='page-title center-vertical'><h1>following</h1></header>
            <form className='search-bar center-vertical'>
                <div className='row row-spacing'>
                    <input className='search-input' type='search' value='search for your team' />
                    <button type='submit'><Search size={30} /></button>
                </div>
            </form>
            <section className='hero-stats'>
                <div className='following-category'>
                    <div className='following-category-tag'></div>
                    <div className='following-category-content'>
                        <p>Players Followed</p>
                        <p>17</p>
                    </div>

                </div>
                <div className='following-category'>
                    <div className='following-category-tag'></div>
                    <div className='following-category-content'>
                        <p>Teams Followed</p>
                        <p>12</p>
                    </div>

                </div>
                <div className='following-category'>
                    <div className='following-category-tag'></div>
                    <div className='following-category-content'>
                        <p>Sports Followed</p>
                        <p>6</p>
                    </div>
                </div>
                <div className='following-category'>
                    <div className='following-category-tag'></div>
                    <div className='following-category-content'>
                        <p>Unread News</p>
                        <p>2</p>
                    </div>

                </div>
            </section>
            <section className='followed-sports'>
                <div className='followed-sports-header'>
                    <h2>Followed Sports</h2>
                    <p className='text-bubble'>6 sports</p>
                </div>
                <div className='sport-categories'>
                    <div className='followed-sports-category'>
                        <img
                            src={Football}
                            alt='football-img'
                            className='change-icon' />
                        <div>football</div>
                    </div>
                    <div className='followed-sports-category'>
                        <img
                            src={Golf}
                            alt='basketball-img'
                            className='change-icon' />
                        <div>golf</div>
                    </div>
                    <div className='followed-sports-category'>
                        <img
                            src={Baseball}
                            alt='baseball-img'
                            className='change-icon' />
                        <div>football</div>
                    </div>
                    <div className='followed-sports-category'>
                        <img
                            src={Swimming}
                            alt='swimming-img'
                            className='change-icon' />
                        <div>football</div>
                    </div>
                    <div className='followed-sports-category'>
                        <img
                            src={Volleyball}
                            alt='volleyball-img'
                            className='change-icon' />
                        <div>football</div>
                    </div>
                    <div className='followed-sports-category'>
                        <img
                            src={Golf}
                            alt='golf-img'
                            className='change-icon' />
                        <div>football</div>
                    </div>
                </div>

            </section>
            <section className='following-news-section'>
                <iframe
                    className='video'
                    src="https://www.youtube.com/embed/AOa5afREJXo?si=hpbPA3I1524oFO2B" title="YouTube video player"
                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </section>
            <section className='follow-players'>
                {player_img_urls.map((item) => (
                    <img
                        className='player-logo'
                        src={item}
                        alt='player-logo'
                    />
                ))}
            </section>
            <section className='follow-sports'>
                {college_logo_urls.map((item) => (
                    <img
                        className='college-logo'
                        src={item}
                        alt='college-logo'
                    />
                ))}

            </section>
        </main >
    );
}

export default Following;