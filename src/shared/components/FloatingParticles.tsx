const FloatingParticles = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-20 left-20 w-2 h-2 rounded-full animate-float bg-brand/40" />
    <div className="absolute top-40 right-32 w-1 h-1 rounded-full animate-float-delay-1 bg-brand/60" />
    <div className="absolute bottom-32 left-40 w-1.5 h-1.5 rounded-full animate-float-delay-2 bg-brand/40" />
    <div className="absolute bottom-20 right-20 w-2 h-2 rounded-full animate-float-delay-3 bg-cyan-800/50" />
    <div className="absolute top-1/3 left-2/3 w-1 h-1 rounded-full animate-float bg-brand/50" />
    <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full animate-float-delay-1 bg-brand/40" />
    <div className="absolute top-1/2 left-10 w-1 h-1 rounded-full animate-float-delay-2 bg-cyan-800/30" />
    <div className="absolute top-3/4 right-40 w-1.5 h-1.5 rounded-full animate-float-delay-3 bg-brand/40" />
  </div>
);

export default FloatingParticles;

