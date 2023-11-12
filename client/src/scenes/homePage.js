import Image from "react-bootstrap/Image";

function Home() {
  return (
    <div className="home">
      <p className="home__text">
        Russell Zhuo's <br></br>Fabulous Movie Searching Website
      </p>
      <img
        src="./photo-1595769816263-9b910be24d5f.avif"
        className="home__image"
      />
      <p className="home__text">I hope you find the movie you're after!</p>
    </div>
  );
}

export default Home;
