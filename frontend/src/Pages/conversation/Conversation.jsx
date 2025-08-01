const MessageBubble = ({ message, isOwn }) => {
    const IMAGE_BASE_URL = 'http://localhost:3000/uploads/';
      const getUserImageSrc = (image) => {
  if (!image || image === 'null' || image === 'undefined') {
    return '/image/profile.png';
  }
  return `${IMAGE_BASE_URL}/${image}?v=${Date.now()}`;
};
  return (
    <div className={`flex items-start ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      {!isOwn && message.sender?.image && (
        <img
          src= {getUserImageSrc(message?.sender.image)}
          alt="avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
        
      )}
      {console.log("message: ", message)}
      {console.log("message.sender?.image:", message.sender?.image)}
      <div className={`rounded-lg px-4 py-2 text-sm max-w-xs ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
        <p className="font-semibold">{message.sender?.name}</p>
        {console.log("message.sender?.name:", message.sender?.name)}
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default MessageBubble;