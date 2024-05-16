/* eslint-disable react/prop-types */
const Scroller = ({textColor, bgColor, emailLink}) => {
  return (
    <div id="scroller" style={{borderColor: textColor}} className="border-t">
      <h1>
        Lets create something together{" "}
        <span style={{ backgroundColor: textColor, color: bgColor }}>
          <a href={emailLink} target="_blank">
            MAIL ME
          </a>
        </span>
      </h1>
      <h1>
        Lets create something together{" "}
        <span style={{ backgroundColor: textColor, color: bgColor }}>
          <a href={emailLink} target="_blank">
            MAIL ME
          </a>
        </span>
      </h1>
      <h1>
        Lets create something together{" "}
        <span style={{ backgroundColor: textColor, color: bgColor }}>
          <a href={emailLink} target="_blank">
            MAIL ME
          </a>
        </span>
      </h1>
    </div>
  );
};

export default Scroller;
