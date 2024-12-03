import { CircularProgress } from "@nextui-org/progress";

const Loader = () => {
  return (
    <CircularProgress
      aria-label="Loading..."
      // TODO not sure if style is needed
      //   style={{
      //     width: "100px",
      //     height: "100px",
      //     margin: "auto",
      //     display: "block",
      //   }}
    ></CircularProgress>
  );
};

export default Loader;
