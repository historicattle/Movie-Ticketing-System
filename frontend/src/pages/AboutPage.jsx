import '../styles/AboutPage.css'

function AboutPage() {
    return (
        <>
            <title>About Us!</title>
            <div id='wrapper'>
            <h1>About Us</h1>
            <h2>Meet the Team</h2>
            <div className='container'>
                <div className="team-member">
                    <h3>Naren Sirigere</h3>
                    <p>Roles: Frontend</p>
                </div>
                <div className="team-member">
                    <h3>Rohinth S</h3>
                    <p>Roles: Backend</p>
                </div>
                <div className="team-member">
                    <h3>Raghavendra Saini</h3>
                    <p>Roles: Backend</p>
                </div>
            </div>
            </div>
        </>
    )
}

export default AboutPage