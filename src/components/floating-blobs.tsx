'use client';

export default function FloatingBlobs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-soft-light filter blur-2xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-accent rounded-full mix-blend-soft-light filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary rounded-full mix-blend-soft-light filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>
      <div className="absolute -bottom-8 -right-10 w-96 h-96 bg-accent rounded-full mix-blend-soft-light filter blur-3xl opacity-15 animate-blob animation-delay-6000"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/50 rounded-full mix-blend-soft-light filter blur-3xl opacity-10 animate-blob animation-delay-8000"></div>
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-accent/50 rounded-full mix-blend-soft-light filter blur-3xl opacity-10 animate-blob animation-delay-10000"></div>

       <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 15s infinite;
        }
        .animation-delay-2000 {
          animation-delay: -2s;
        }
        .animation-delay-4000 {
          animation-delay: -4s;
        }
        .animation-delay-6000 {
          animation-delay: -6s;
        }
        .animation-delay-8000 {
            animation-delay: -8s;
        }
        .animation-delay-10000 {
            animation-delay: -10s;
        }
      `}</style>
    </div>
  );
}
