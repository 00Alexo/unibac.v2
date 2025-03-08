const LineBG = () => (
    <svg className="absolute top-0 left-0 w-full h-full z-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(14, 44, 197, 0.2)" strokeWidth="1"/>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
);

export default LineBG;