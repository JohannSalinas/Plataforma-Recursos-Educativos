const Notification = ({ message, type, onClose }) => {
    if (!message) return null;

    return (
        <div
            className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white transition-opacity duration-300 ${
                type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
            {message}
            <button className="ml-2 text-white font-bold" onClick={onClose}>✖</button>
        </div>
    );
};

export default Notification;
