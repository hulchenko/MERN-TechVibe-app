import { Link } from "@nextui-org/react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="absolute bottom-4 w-full text-center z-10">
      &copy; {year} by{" "}
      <Link isBlock showAnchorIcon target="_blank" href="https://github.com/hulchenko" className="font-bold text-violet-500">
        hulchenko
      </Link>
    </footer>
  );
};

export default Footer;
