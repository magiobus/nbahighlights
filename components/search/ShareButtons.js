import {
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

const ShareButtons = ({
  label = "Share this video:",
  shareUrl,
  sharedMessage,
  centered = false,
}) => {
  return (
    <div className="sharebuttons my-4 font-bold">
      <p>{label}</p>
      <div
        className={`buttons mt-2 flex  items-center space-x-4 ${
          centered && "justify-center"
        }`}
      >
        <WhatsappShareButton url={shareUrl} title={sharedMessage}>
          <WhatsappIcon size={35} round={true} />
        </WhatsappShareButton>

        <TwitterShareButton url={shareUrl} title={sharedMessage}>
          <TwitterIcon size={35} round={true} />
        </TwitterShareButton>

        <TelegramShareButton url={shareUrl} title={sharedMessage}>
          <TelegramIcon size={35} round={true} />
        </TelegramShareButton>
      </div>
    </div>
  );
};

export default ShareButtons;
