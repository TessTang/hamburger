export default function Banner({ bgImg, children }) {
  return (
    <div
      style={{ backgroundImage: `url(${require(`../assets/${bgImg}`)})` }}
      className="section_banner container-fluid bg-secondary px-0 mt-2 position-relative"
    >
      {children}
    </div>
  );
}
