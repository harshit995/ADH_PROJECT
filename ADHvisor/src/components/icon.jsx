import aha from "../assets/aha.jpg";
import ahacross from "../assets/ahacross.jpg";

const Icon = (props) => {
  const { showChatbot, toggleChatbot } = props;
  return (
    <div className="ADH" onClick={toggleChatbot}>
      {showChatbot ? (
        <img
          src={ahacross}
          alt="ADH"
          style={{ width: "50px", borderRadius: "50px 50px 0 50px" }}
        />
      ) : (
        <img
          src={aha}
          alt="ADH"
          style={{ width: "50px", borderRadius: "50px 50px 0 50px" }}
        />
      )}
    </div>
  );
};

export default Icon;
