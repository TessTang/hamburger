import ReactLoading from "react-loading";

export default function Loading() {
  return (
    <div className="loadingPage">
      <ReactLoading type="balls" color="black" height={100} width={100} />
    </div>
  );
}
