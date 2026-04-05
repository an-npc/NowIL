import { useState } from 'react';
import NowILLogo from './assets/Logo.svg';
import './App.css';
import { Home, User, Slack, Dribbble, Heart, Edit, Search } from 'react-feather';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './pages/homepage';
import Index from './pages/Index';
import Guest from './pages/myguest';

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

// acts as Map in my dev-port-iii

function App() {
  return (


    <Router>
      <main className='app-row'>
        <section className='menu-bar'>
          <div className='column'>
            <div className='center'><img src={NowILLogo} alt='NowIL_Logo' className='logo' /></div>
            <Link to="/homepage">
              <div className='row'><Home /><p>home</p>
              </div>
            </Link>
            <Link to="/guest">
              <div className='row'>
                <User /> <p>players</p>
              </div>
            </Link>
            <div className='row'><Slack /> <p>teams</p></div>
            <div className='row'><Dribbble /> <p>sports</p></div>
            <div className='row'><Heart /> <p>following</p></div>
            <div className='row'><Edit /> <p>predict</p></div>
          </div>
        </section>
        <Routes>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/guest" element={<Guest />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App


/*
function App() {
  return (
    <section>
      <Router>
        <section className='menu-bar'>
          <div className='column'>
            <div className='center'><img src={NowILLogo} alt='NowIL_Logo' className='logo' /></div>
            <button><div className='row'><Home /> <p>home</p></div></button>
            <button><div className='row'><User /> <p>players</p></div></button>
            <button><div className='row'><Slack /> <p>teams</p></div></button>
            <button><div className='row'><Dribbble /> <p>sports</p></div></button>
            <button><div className='row'><Heart /> <p>following</p></div></button>
            <button><div className='row'><Edit /> <p>predict</p></div></button>
          </div>
        </section>
        <Routes>
          <Route path="/onboarding" element={<Index />} />
          <Route path="/guest" element={<Guest />} />
          <Route path="/" element={<Homepage />} />
        </Routes>
      </Router>
    </section>
  )
}

export default App
*/




{/* <div id="page">
        <Router>
          <nav id="row">
            <div className="menu">
              <button id="btn" data-toggle="dropdown" type="button">
                <Menu color="#ffffff" class="icon" />
              </button>

              <div class="dropdown-menu">
                <Link to="/">
                  <button id="opt" class="dropdown-item">
                    // about me
                  </button>
                </Link>

                <Link to="/skill-level">
                  <button id="opt" class="dropdown-item">
                    // skill level
                  </button>
                </Link>
                <Link id="opt" to="/exp-points">
                  <button class="dropdown-item">// exp points</button>
                </Link>
                <Link id="opt" to="/projects">
                  <button class="dropdown-item">// projects</button>
                </Link>
              </div>
            </div>

            <div>
              <a href="https://www.linkedin.com/in/melanie-steiner-811782227/">
                <button id="btn-front">
                  <Linkedin color="#ffffff" class="icon" />
                </button>
              </a>
              <a href="https://codesandbox.io/dashboard/drafts?workspace=ws_HPCGq37933jTz96LhNc3YF">
                <button id="btn-mid">
                  <GitHub color="#ffffff" class="icon" />
                </button>
              </a>
              <button id="btn-mid">
                <Codesandbox color="#ffffff" class="icon" />
              </button>
              <button id="btn-end">
                <Mail color="#ffffff" class="icon" />
              </button>
            </div>
          </nav>
          <Routes>
            <Route path="/" element={<AboutMe class="padding-btm" />} />
            <Route
              path="/skill-level"
              element={<Skills class="padding-btm" />}
            />
            <Route path="/exp-points" element={<Exp class="padding-btm" />} />
            <Route
              path="/projects"
              element={<Projects class="padding-btm" />}
            />
          </Routes>
        </Router>
      </div>
      <div id="footer">
        <Footer />
      </div> */}