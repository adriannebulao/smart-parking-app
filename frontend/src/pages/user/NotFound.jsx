import logo from "../../assets/logo.svg";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md bg-background rounded-2xl shadow-lg p-8 text-center">
        <img src={logo} alt="Logo" className="h-16 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text mb-2">
          Page Not Found
        </h2>
        <p className="text-text mb-6">
          The page you're looking for doesn't exist!
        </p>
        <a
          href="/"
          className="inline-block bg-primary text-white py-3 px-6 rounded-md font-semibold hover:bg-accent transition"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

export default NotFound;
