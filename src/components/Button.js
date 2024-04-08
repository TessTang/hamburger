import { Link } from "react-router-dom";

export default function Button({
  text,
  bg = "primary",
  myClass,
  linkto,
  click,
}) {
  return linkto ? (
    <Link className={`button-56 bg-${bg} ${myClass}`} to={linkto}>
      {text}
    </Link>
  ) : (
    <button
      className={`button-56 bg-${bg} ${myClass}`}
      onClick={
        click
          ? click
          : (e) => {
              e.preventDefault();
            }
      }
    >
      {text}
    </button>
  );
}
