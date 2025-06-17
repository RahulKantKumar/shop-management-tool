import "./HomePage.scss";
import Header from "../components/Header";
import LeftPanel from "../components/LeftPanel";

const Homepage = () => {

  return (
    <div>
      <Header/>
      <LeftPanel/>
      <div className="homePage">
        Main Content
      </div>
    </div>
  );
};

export default Homepage;
