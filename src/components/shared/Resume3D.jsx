import { useState } from 'react';
import { FileText } from 'lucide-react';

const Resume3D = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = ((centerY - y) / centerY) * 15;

    setMousePosition({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovering(false);
  };

  return (
    <div className="flex items-center justify-center min-h-96 py-20">
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovering(true)}
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d'
        }}
        className="w-full max-w-sm h-96 cursor-pointer"
      >
        {/* Outer container with perspective */}
        <div
          style={{
            transform: `rotateX(${mousePosition.x}deg) rotateY(${mousePosition.y}deg)`,
            transformStyle: 'preserve-3d',
            transition: isHovering ? 'none' : 'transform 0.6s ease-out',
            transitionDuration: isHovering ? '0ms' : '600ms'
          }}
          className="w-full h-full"
        >
          {/* Front face - Resume */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
              transform: 'translateZ(100px)'
            }}
            className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 flex flex-col justify-between overflow-hidden"
          >
            {/* Decorative top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"></div>

            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Jyotinder Yadav</h3>
                  <p className="text-sm text-cyan-600 font-semibold">Full Stack Developer</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <p className="text-gray-700 font-medium">
                  Passionate developer with expertise in building modern web applications
                </p>
              </div>
            </div>

            {/* Content sections */}
            <div className="space-y-4">
              {/* Skills preview */}
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase mb-2">Core Skills</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-700 rounded text-xs font-semibold">
                    React
                  </span>
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                    JavaScript
                  </span>
                  <span className="px-2.5 py-1 bg-pink-100 text-pink-700 rounded text-xs font-semibold">
                    Web Dev
                  </span>
                </div>
              </div>

              {/* Experience preview */}
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase mb-2">Experience</p>
                <p className="text-xs text-gray-700">
                  <span className="font-semibold">Senior Developer</span> at ResumeRefine
                </p>
                <p className="text-xs text-gray-600">2023 - Present</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
              </div>
              <p className="text-xs text-gray-500">ResumeRefine</p>
            </div>
          </div>

          {/* Back face - Features */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              transformStyle: 'preserve-3d',
              translateZ: '-100px'
            }}
            className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl p-8 flex flex-col justify-between text-white overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
            </div>

            <div className="relative">
              <h3 className="text-2xl font-black mb-6">✨ 8 Templates</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li>✓ Modern & Creative</li>
                <li>✓ Executive & ATS</li>
                <li>✓ Infographic & Startup</li>
                <li>✓ Live Preview</li>
              </ul>
            </div>

            <div className="relative">
              <p className="text-xs opacity-90">
                Flip to see all amazing features included in ResumeRefine
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume3D;
