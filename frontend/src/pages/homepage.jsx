import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function Homepage() {
    return (
        <main className='grid-container'>
            <section className='menu-bar'><p>menu</p></section>
            <header className='page-title'>TITLE</header>
            <div className='search-bar'>search bar</div>
            <section className='chart'><p>chart</p></section>
        </main>
    )
} 

export default Homepage;