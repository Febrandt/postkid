import { HashRouter, Navigate, Route, Routes, Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import './App.css';
import Workbench from "../Workbench/Workbench";
import icon from '../../assets/icon.svg';

function App() {
  const [tabs, setTabs] = useState(['Workbench 1']);
  const [tabsData, setTabsData] = useState({});
  const [tabsParent, enableTabsAnimations] = useAutoAnimate({
    duration: 100,
    easing: 'ease-in-out'
  });

  const newTab = () => {
    const newTabName = `Workbench ${tabs.length + 1}`;
    setTabs([...tabs, newTabName]);

    // Initialize state for the new tab
    setTabsData({
      ...tabsData,
      [newTabName]: {
        url: '',
        method: 'GET',
        params: [{ key: '', value: '' }],
        body: '',
        response: '',
        headers: [{ key: '', value: '' }]
      }
    });
  };

  const closeTab = (index) => {
    setTabs(tabs.filter((_, i) => i !== index));
    setTabsData(Object.fromEntries(Object.entries(tabsData).filter((_, i) => i !== index)));
  };

  return (
    <div className="app">
      <HashRouter>
        <nav><img src={icon}></img> PostKid</nav>
        <aside ref={tabsParent}>
          {tabs.map((tab, index) => (
            
            <Link key={index} to={`tab/${index}`}>
              <span>{tab}</span><button onClick={() => {closeTab(index)}}>x</button> 
            </Link>
          ))}
          <button className="new-tab" onClick={newTab}> + </button>
        </aside>
        <main>
          <Routes>
            <Route index element={<Navigate to="tab/0" />} />
            {tabs.map((tab, index) => (
              <Route
                key={index}
                path={`tab/${index}`}
                element={<Workbench
                          tabName={tab}
                          tabData={tabsData[tab]} 
                          setTabData={(newData) => setTabsData({ ...tabsData, [tab]: newData })}
                          />}
              />
            ))}
          </Routes>
        </main>
        <footer>@All Rights Reserved To YOU 2025</footer>
      </HashRouter>
    </div>
  );
}

export default App;
