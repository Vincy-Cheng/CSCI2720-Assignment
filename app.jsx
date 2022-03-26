// CSCI2720 Assignment 2
// Name: Cheng Wing Lam
// SID: 1155125313

const { BrowserRouter, Routes, Route, Link } = ReactRouterDOM;
const { useMatch, useParams, useLocation } = ReactRouterDOM;

// global variables
const data = [
    {
        filename: "cuhk-2013.jpg", year: 2013, remarks: "Sunset over CUHK"
    },
    {
        filename: "cuhk-2017.jpg", year: 2017, remarks: "Bird's-eye view of CUHK"
    },
    {
        filename: "sci-2013.jpg", year: 2013, remarks: "The CUHK Emblem"
    },
    {
        filename: "shb-2013.jpg", year: 2013, remarks: "The Engineering Buildings"
    },
    {
        filename: "stream-2009.jpg", year: 2009, remarks: "Nature hidden in the campus"
    },
];



class App extends React.Component {
    render() {
        {/* <> fragment for >1 components */ }
        return (
            <>
                {/* will have more than one component */}
                {/* Title component & Gallery component */}
                <Title name={this.props.name} />
                <BrowserRouter>
                    <div>
                        <ul>
                            <LongLink to="/" label="Home" />
                            <LongLink to="/gallery" label="Images" />
                            <LongLink to="/slideshow" label="Slideshow" />

                        </ul>
                        <hr />

                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/gallery" element={<Gallery />} />
                            <Route path="/slideshow" element={<Slideshow />} />
                            <Route path="*" element={<NoMatch />} />
                        </Routes>
                    </div>
                </BrowserRouter>
            </>
        );
    }
}

class Title extends React.Component {
    render() {
        return (
            // that is bootstrap element
            <header className="bg-warning">
                {/* right now is CUHK Pictures */}
                <h1 className="display-4 textcenter">{this.props.name}</h1>
            </header>
        );
    }
}

class Gallery extends React.Component {
    render() {
        return (

            data.map((file, index) => <FileCard i={index} key={index} />)
        );
    }
}

class FileCard extends React.Component {

    handleClick(index, e) {
        if (this.state.selected != index) {
            this.setState({ selected: index });
            console.log(index);
        } else {
            this.setState({ selected: -1 });
        }
    }

    constructor(props) {
        super(props);
        this.state = { selected: -1 };
        {/* this syntax should only be used
        in the constructor, and otherwise
        this.setState() must be used */}
    }

    render() {


        let i = this.props.i;
        return (
            <div className="card d-inline-block m-2"

                style={{ width: this.state.selected == i ? 220 : 200 }}
                onMouseOver={(e) => this.handleClick(i, e)}
                onMouseOut={(e) => this.handleClick(i, e)}>
                <img src={"images/" + data[i].filename}
                    className="w-100"
                />
                <div className="card-body">
                    <h6 className="card-title">
                        {data[i].filename}</h6>
                    <p className="card-text">
                        {data[i].year}</p>
                </div>
            </div>
        )
    }
}

function LongLink({ label, to }) {
    let match = useMatch({
        path: to
    });
    return (
        <li className={match ? "active" : ""}>
            {match && "> "}
            <Link to={to}>{label}</Link>
        </li>
    );
}


function NoMatch() {
    let location = useLocation();
    return (
        <div>
            <h3>
                No match for <code>{location.pathname}</code>
            </h3>
        </div>
    );
}

class Home extends React.Component {
    render() {
        return <div className="m-2">
            <h2>Home</h2>
            <h5>Tree diagram of react component</h5>
            <img src="Tree-diagram.png" alt="diagram" />
            </div>;
    }
}


class Slideshow extends React.Component {

    play() {
        let len = data.length;
        // useEffect()
        this.intervalID = setInterval(() => {
            if (this.state.selected < len - 1) {
                let index = this.state.selected + 1;
                this.setState({ selected: index });
                console.log(this.state.selected);
                console.log(this.state.currentInterval);
                console.log("IntervalID", this.intervalID);
            }
            else {
                this.setState({ selected: 0 });
                console.log(this.state.selected);
            }
            // console.log('This will run every second!');
        }, this.state.currentInterval)

    }

    stop() {
        clearInterval(this.intervalID)
    }

    faster() {
        if (this.intervalID) {
            if (this.state.currentInterval > 250) {
                let speed = this.state.currentInterval - 250
                this.setState({ currentInterval: speed });
            }
            this.stop()
            this.play()
        }

    }

    slower() {
        if (this.intervalID) {
            let speed = this.state.currentInterval + 250
            this.setState({ currentInterval: speed });
            this.stop()
            this.play()
        }

    }

    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
            currentInterval: 1500
        };
        {/* this syntax should only be used
        in the constructor, and otherwise
        this.setState() must be used */}
    }
    render() {
        let i = this.state.selected;
        return (
            <div >
                <div className="m-2"

                >
                    <img src={"images/" + data[i].filename}
                        style={{ width: 300 }}
                    />
                    <div className="card-body">
                        <h6 className="card-title">
                            {data[i].filename}</h6>
                        <p className="card-text">
                            {data[i].year}</p>
                    </div>
                </div>
                <button type="button" className="mx-2 btn btn-success" onClick={(e) => { this.play() }}>Start slideshow</button>
                <button type="button" className="mx-2 btn btn-danger" onClick={(e) => { this.stop() }}>Stop slideshow</button>
                <button type="button" className="mx-2 btn btn-warning" onClick={(e) => { this.faster() }}>Faster</button>
                <button type="button" className="mx-2 btn btn-info" onClick={(e) => { this.slower() }}>Slower</button>

            </div>


        )
    }
}
ReactDOM.render(
    //  name refer to {this.props.name}
    <App name="CUHK Pictures" />,
    document.querySelector("#app"));





