import ReactLoading from "react-loading";

export default function Loading() {
  return (
    <div className="loadingPage">
      <ReactLoading
        type="spinningBubbles"
        color="green"
        height={100}
        width={100}
      />
    </div>
  );
}
