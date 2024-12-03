const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p className="absolute bottom-6 sm:bottom-8 w-full text-center">
        &copy; {year} by{" "}
        <a target="_blank" href="https://github.com/hulchenko">
          hulchenko
        </a>
      </p>
    </footer>
  );
};

export default Footer;
