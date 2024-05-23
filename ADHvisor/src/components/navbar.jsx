import ahaorg from "../assets/ahaorg_1.png";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="left">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#2F4F4F"
          height="30px"
          width="30px"
          viewBox="0 0 24 24"
        >
          <path d="M21,3H3C1.896,3,1,3.896,1,5v12c0,1.104,0.896,2,2,2h6l4,4V19h4l4,4V5C23,3.896,22.104,3,21,3z M18,13H6V11h12V13z M18,10H6 V8h12V10z" />
        </svg>
        <span style={{ color: "#2F4F4F" }}>ADHvisor</span>
      </div>
      <div className="right">
        <img src={ahaorg} id="ahaorg" alt="ADH" />
      </div>
    </div>
  );
};

export default Navbar;
