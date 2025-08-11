import yLogo from "../assets/y.svg";

const Ylogo = () => {
  return (
    <div className="fixed p-6">
      <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center transition hover:bg-gray-800 transform hover:-rotate-6">
        <img className="w-8 h-8 " src={yLogo} alt="y logo" />
      </div>
    </div>
  );
};

export default Ylogo;
