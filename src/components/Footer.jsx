// eslint-disable-next-line react/prop-types
const Footer = ({textColor, bgColor}) => {
  return (
    <div
      style={{
        borderColor: textColor,
      }}
      className="w-screen flex justify-center p-2 border-t"
    >
      Made with ❤️ by
      <a
        href="https://github.com/HawkdotDev"
        target="_blank"
        style={{
          backgroundColor: textColor,
          color: bgColor,
        }}
        className="ml-[6px] px-[5px]"
      >
        HawkdotDev
      </a>
    </div>
  );
};

export default Footer;
