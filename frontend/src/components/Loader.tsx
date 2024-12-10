import { Spinner } from "@nextui-org/react";

const Loader = () => {
  return (
    <div className="w-full mt-96 flex justify-center">
      <Spinner size="lg"></Spinner>
    </div>
  );
};

export default Loader;
