import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-slate-200 flex flex-col items-center justify-center text-center px-6">
      {/* Logo + Tagline */}
      <div className="mb-10">
        <h1 className="text-5xl font-extrabold text-slate-700 mb-4">Welcome to CommunityShare</h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          A platform to share, borrow, and connect. Post your items or borrow from the community.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/register"
          className="px-6 py-3 bg-gradient-to-r from-zinc-300 to-slate-200 text-slate-800 font-semibold rounded-xl shadow hover:from-blue-400 hover:to-slate-300 transition"
        >
          Register
        </Link>

        <Link
          to="/login"
          className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-xl shadow hover:bg-slate-800 transition"
        >
          Login
        </Link>

        <Link
          to="/home"
          className="px-6 py-3 border-2 border-slate-300 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition"
        >
          Skip for now
        </Link>
      </div>
    </div>
  );
}

export default Landing;
