import {
  BriefcaseIcon,
  FileTextIcon,
  UsersIcon,
  TrendingUpIcon,
  TargetIcon,
  Star,
} from "lucide-react";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Dynamic gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50" />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-pink-600/30 rounded-full blur-3xl animate-blob-delayed" />
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-gradient-to-r from-indigo-400/30 to-blue-600/30 rounded-full blur-3xl animate-blob-reverse" />
        <div className="absolute bottom-40 right-40 w-64 h-64 bg-gradient-to-r from-cyan-400/30 to-teal-600/30 rounded-full blur-3xl animate-blob-slow" />
      </div>

      {/* Modern geometric shapes */}
      <div className="absolute inset-0">
        {/* Large floating cards */}
        <div className="absolute top-32 left-32 w-64 h-40 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg animate-float-slow transform rotate-12" />
        <div className="absolute bottom-32 right-32 w-56 h-36 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg animate-float-delayed transform -rotate-12" />

        {/* Hexagonal patterns */}
        <div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 transform rotate-45 animate-pulse-slow"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 transform rotate-45 animate-pulse-delayed"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        />
      </div>

      {/* Enhanced floating icons with glassmorphism */}
      <div className="absolute inset-0">
        {/* Briefcase icons */}
        <div className="absolute top-20 left-20 p-4 bg-white/30 backdrop-blur-sm rounded-full border border-white/40 shadow-lg animate-float-slow">
          <BriefcaseIcon className="w-8 h-8 text-blue-600" />
        </div>
        <div className="absolute top-60 right-32 p-3 bg-white/30 backdrop-blur-sm rounded-full border border-white/40 shadow-lg animate-float-delayed">
          <BriefcaseIcon className="w-6 h-6 text-purple-600" />
        </div>
        <div className="absolute bottom-40 left-1/4 p-5 bg-white/30 backdrop-blur-sm rounded-full border border-white/40 shadow-lg animate-float-slow">
          <BriefcaseIcon className="w-10 h-10 text-indigo-600" />
        </div>

        {/* Document icons */}
        <div className="absolute top-1/3 left-1/2 p-4 bg-white/30 backdrop-blur-sm rounded-full border border-white/40 shadow-lg animate-float-delayed opacity-50">
          <FileTextIcon className="w-7 h-7 text-green-400" />
        </div>
        <div className="absolute bottom-32 right-1/4 p-4 bg-white/30 backdrop-blur-sm rounded-full border border-white/40 shadow-lg animate-float-slow">
          <FileTextIcon className="w-9 h-9 text-blue-600" />
        </div>

        {/* People/networking icons */}
        <div className="absolute top-1/2 right-20 p-4 bg-white/30 backdrop-blur-sm rounded-full border border-white/40 shadow-lg animate-float-slow">
          <UsersIcon className="w-8 h-8 text-purple-600" />
        </div>
        <div className="absolute bottom-1/3 left-32 p-3 bg-white/30 backdrop-blur-sm rounded-full border border-white/40 shadow-lg animate-float-delayed">
          <UsersIcon className="w-6 h-6 text-indigo-600" />
        </div>

        {/* Growth/success icons */}
        <div className="absolute top-3/4 right-1/3 p-4 bg-white/30 backdrop-blur-sm rounded-full border border-white/40 shadow-lg animate-float-slow">
          <TrendingUpIcon className="w-8 h-8 text-green-600" />
        </div>
        <div className="absolute top-24 left-2/3 p-4 bg-white/30 backdrop-blur-sm rounded-full border border-white/40 shadow-lg animate-float-delayed">
          <TrendingUpIcon className="w-7 h-7 text-blue-600" />
        </div>

        {/* Target/goal icons */}
        <div className="absolute top-2/3 left-1/5 p-4 bg-white/30 backdrop-blur-sm rounded-full border border-white/40 shadow-lg animate-float-slow">
          <TargetIcon className="w-8 h-8 text-red-500" />
        </div>

        {/* Star icons for achievements */}
        <div className="absolute top-1/4 right-1/5 p-3 bg-white/30 backdrop-blur-sm rounded-full border border-white/40 shadow-lg animate-float-delayed">
          <Star className="w-6 h-6 text-yellow-500" />
        </div>
      </div>


      {/* Modern connection network */}
      <svg className="absolute inset-0 w-full h-full opacity-30">
        <defs>
          <linearGradient
              id="modernConnectionGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
          >
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated connection lines with glow */}
        <g className="animate-pulse-slow" filter="url(#glow)">
          <line
              x1="15%"
              y1="45%"
              x2="35%"
              y2="25%"
              stroke="url(#modernConnectionGradient)"
              strokeWidth="2"
          />
          <line
              x1="65%"
              y1="50%"
              x2="80%"
              y2="30%"
              stroke="url(#modernConnectionGradient)"
              strokeWidth="2"
          />
          <line
              x1="25%"
              y1="85%"
              x2="45%"
              y2="70%"
              stroke="url(#modernConnectionGradient)"
              strokeWidth="2"
          />
          <line
              x1="60%"
              y1="40%"
              x2="75%"
              y2="20%"
              stroke="url(#modernConnectionGradient)"
              strokeWidth="2"
          />
          <line
              x1="20%"
              y1="60%"
              x2="40%"
              y2="40%"
              stroke="url(#modernConnectionGradient)"
              strokeWidth="2"
          />
          <line
              x1="70%"
              y1="75%"
              x2="85%"
              y2="60%"
              stroke="url(#modernConnectionGradient)"
              strokeWidth="2"
          />
        </g>

        {/* Larger, more visible connection nodes */}
        <g className="animate-pulse-slow">
          <circle cx="15%" cy="45%" r="4" fill="#3b82f6" />
          <circle cx="35%" cy="25%" r="4" fill="#8b5cf6" />
          <circle cx="65%" cy="50%" r="4" fill="#3b82f6" />
          <circle cx="80%" cy="30%" r="4" fill="#ec4899" />
          <circle cx="25%" cy="85%" r="4" fill="#8b5cf6" />
          <circle cx="45%" cy="70%" r="4" fill="#3b82f6" />
          <circle cx="60%" cy="40%" r="4" fill="#ec4899" />
          <circle cx="75%" cy="20%" r="4" fill="#8b5cf6" />
          <circle cx="20%" cy="60%" r="4" fill="#3b82f6" />
          <circle cx="40%" cy="40%" r="4" fill="#8b5cf6" />
          <circle cx="70%" cy="75%" r="4" fill="#ec4899" />
          <circle cx="85%" cy="60%" r="4" fill="#3b82f6" />
        </g>
      </svg>

      {/* Floating grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
            animation: "float 20s ease-in-out infinite",
          }}
        />
      </div>

      {/* Modern particle system */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle-float ${
                5 + Math.random() * 10
              }s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
