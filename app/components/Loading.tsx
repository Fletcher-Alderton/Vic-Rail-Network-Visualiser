import React from 'react';

const Loading = React.memo(() => {
  return (
    <div className="loading-page">
      <div className="loading-content">
        <div className="container">
          <div className="track"></div>
          <div className="train"></div>
        </div>
        <div className="loading-text">Loading train lines and stops...</div>
      </div>
      
      <style jsx>{`
        .loading-page {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100vw;
          position: fixed;
          top: 0;
          left: 0;
          background-color: hsl(var(--background));
          z-index: 9999;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
        }

        .container {
          position: relative;
          width: 60px;
          height: 100px;
          display: flex;
          justify-content: center;
        }

        .loading-text {
          font-size: 16px;
          color: hsl(var(--muted-foreground));
          font-family: system-ui, -apple-system, sans-serif;
          text-align: center;
        }

        .track {
          position: relative;
          overflow: hidden;
          width: 50px;
          height: 100px;
          border-left: 3px solid hsl(var(--foreground));
          transform: skew(-10deg) rotateX(45deg);
          margin: 0 auto;
        }

        .track:before {
          content: "";
          position: absolute;
          height: 3px;
          width: 50px;
          background-color: hsl(var(--foreground));
          top: 90px;
          box-shadow: 0 0 hsl(var(--foreground)), 0 -10px hsl(var(--foreground)), 0 -20px hsl(var(--foreground)), 0 -30px hsl(var(--foreground)), 0 -40px hsl(var(--foreground)), 0 -50px hsl(var(--foreground)), 0 -50px hsl(var(--foreground)), 0 -60px hsl(var(--foreground)), 0 -70px hsl(var(--foreground)), 0 -80px hsl(var(--foreground)), 0 -90px hsl(var(--foreground)), 0 -100px hsl(var(--foreground)), 0 -110px hsl(var(--foreground)), 0 -120px hsl(var(--foreground)), 0 -130px hsl(var(--foreground)), 0 -140px hsl(var(--foreground));
          animation: track 1s linear infinite;
        }

        @keyframes track {
          0% {
            transform: translateY(70px) rotateX(45deg);
          }
          100% {
            transform: translateY(0px) rotateX(45deg);
          }
        }

        .track:after {
          content: "";
          position: absolute;
          transform: rotate(-15deg);
          width: 50px;
          height: 120px;
          background-color: hsl(var(--background));
          border-left: 3px solid hsl(var(--foreground));
          left: 30px;
          top: -10px;
        }

        .train {
          position: absolute;
          width: 60px;
          height: 60px;
          background-color: hsl(var(--foreground));
          border-radius: 15px;
          top: 0;
          left: -7px;
          transform-origin: bottom;
          animation: rotate 1s linear infinite;
        }

        .train:before {
          content: "";
          position: absolute;
          background-color: #ced4da;
          width: 20px;
          height: 15px;
          left: 9px;
          top: 15px;
          box-shadow: 22px 0 #ced4da;
        }

        .train:after {
          content: "";
          position: absolute;
          background-color: #ced4da;
          border-radius: 50%;
          height: 10px;
          width: 10px;
          top: 45px;
          left: 10px;
          box-shadow: 30px 0px #ced4da;
        }

        @keyframes rotate {
          0% {
            transform: rotate(0);
          }
          25% {
            transform: rotate(2deg);
          }
          50% {
            transform: rotate(0);
          }
          75% {
            transform: rotate(-2deg);
          }
          100% {
            transform: rotate(0);
          }
        }
      `}</style>
    </div>
  );
});

export default Loading; 