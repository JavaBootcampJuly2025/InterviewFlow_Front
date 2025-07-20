interface LogoProps {
    className?: string;
    onClick?: () => void;
    isFooter?: boolean;
}

export function Logo({ className = "", onClick, isFooter }: LogoProps) {
    return (
        <div
            className={`flex items-center space-x-3 cursor-pointer group ${className}`}
            onClick={onClick}
        >
            <div className="relative">
                <svg
                    width={isFooter ? "20" : "40"}
                    height={isFooter ? "20" : "40"}
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-transform duration-300 group-hover:scale-110 "
                >
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6ea8fe" /> {/* blue */}
                            <stop offset="50%" stopColor="#b392ff" /> {/* purple */}
                            <stop offset="100%" stopColor="#f3a6e8" /> {/* pink */}
                        </linearGradient>
                        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#b392ff" /> {/* purple */}
                            <stop offset="100%" stopColor="#f3a6e8" /> {/* pink */}
                        </linearGradient>
                    </defs>

                    {/* Main Background */}
                    <circle
                        cx="20"
                        cy="20"
                        r="18"
                        fill="url(#logoGradient)"
                    />

                    {/* Inner geometric design - representing job flow/tracking */}
                    <g transform="translate(8, 8)">
                        {/* Top bar - representing applications */}
                        <rect
                            x="2"
                            y="4"
                            width="20"
                            height="3"
                            rx="1.5"
                            fill="white"
                            fillOpacity="0.9"
                        />

                        <circle cx="6" cy="12" r="2" fill="white" fillOpacity="0.8" />
                        <circle cx="12" cy="12" r="2" fill="url(#accentGradient)" />
                        <circle cx="18" cy="12" r="2" fill="white" fillOpacity="0.6" />

                        <line x1="8" y1="12" x2="10" y2="12" stroke="white" strokeWidth="2" strokeOpacity="0.7" />
                        <line x1="14" y1="12" x2="16" y2="12" stroke="white" strokeWidth="2" strokeOpacity="0.7" />

                        <path
                            d="M4 18 L8 16 L12 19 L16 15 L20 17"
                            stroke="white"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeOpacity="0.8"
                        />
                    </g>

                    <circle cx="32" cy="12" r="1.5" fill="url(#accentGradient)" className="animate-pulse-slow" />
                    <circle cx="8" cy="32" r="1" fill="url(#logoGradient)" className="animate-pulse-delayed" />
                </svg>
            </div>

            <div className="flex flex-col group-hover:scale-105 transition-all duration-300">
                <div className="flex items-baseline space-x-1 transition-transform duration-300 ">
                    <p className="text-m font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent ">
                        Interview
                    </p>
                    <p className="text-m font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-pink-400 bg-clip-text text-transparent transition-all duration-300">
                        Flow
                    </p>
                </div>
                {!isFooter && <div className="text-[8px] text-muted-foreground font-medium tracking-wider uppercase opacity-75 transition-opacity duration-300 min-w-[100px]">
                    Track &amp; Succeed
                </div>}
            </div>
        </div>
    );
}