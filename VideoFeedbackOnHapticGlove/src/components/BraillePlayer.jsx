import React, { useState, useRef, useEffect, useCallback } from 'react';
import './BraillePlayer.css';

function BraillePlayer() {
  const [isConnected, setIsConnected] = useState(false);
  const portRef = useRef(null);
  const writerRef = useRef(null);
  const taskIDRef = useRef(null); 
  const videoRef = useRef(null); 


  const handleDisconnect = useCallback(async () => {
    console.log('Disconnecting from serial port...');
    taskIDRef.current = null; 

    if (writerRef.current) {
      try {
        await writerRef.current.abort();
        writerRef.current.releaseLock();
      } catch (err) {
        console.error('Error aborting writer:', err);
      }
    }

    if (portRef.current) {
      try {
        await portRef.current.close();
      } catch (err) {
        console.error('Error closing port:', err);
      }
    }

    portRef.current = null;
    writerRef.current = null;
    setIsConnected(false);
    console.log('Disconnected.');
  }, []); 

  const lastCueRef = useRef("");

const sendTextToArduino = useCallback(async (text) => {
  if (!writerRef.current) return;

  const encoder = new TextEncoder();
  const characters = text.replace(/\s+/g, " ").trim().split("");

  for (const ch of characters) {
    // Check space / alphabets only
    const lower = ch.toLowerCase();
    if ((lower >= "a" && lower <= "z") || lower === " ") {
      await writerRef.current.write(encoder.encode(lower));
      await new Promise(r => setTimeout(r, 300)); // faster + safe delay
    }
  }
}, []);


  const handleConnect = async () => {
    if (navigator.serial) {
      try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        portRef.current = port;
        writerRef.current = port.writable.getWriter(); 
        setIsConnected(true); 
        console.log('Serial port connected!');
      } catch (err) {
        console.error('Error connecting to serial port:', err);
      }
    } else {
      alert('Web Serial API is not supported. Please use Chrome or Edge.');
    }
  };


  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isConnected) {
      return;
    }
    
    const handleCueChange = () => {
        const track = videoRef.current.textTracks[0];
        const cue = track?.activeCues[0];
  
        if (!cue) return;

        if (cue.text !== lastCueRef.current) {
            lastCueRef.current = cue.text;
            console.log("Sending subtitle:", cue.text);
            sendTextToArduino(cue.text);
        }
    };


    const handlePauseOrSeek = () => {
      console.log('Video paused/seeked, stopping Braille task.');
      taskIDRef.current = null;
    };

    
    const setupListeners = () => {
      const track = video.textTracks[0];
      if (!track) {
        console.error('Text track not found!');
        return;
      }
      track.mode = 'showing';
      console.log('Attaching video listeners...');
      track.addEventListener('cuechange', handleCueChange);
      video.addEventListener('pause', handlePauseOrSeek);
      video.addEventListener('seeking', handlePauseOrSeek);
    };

    
    if (video.readyState >= 1) {
      setupListeners();
    } else {
      video.addEventListener('loadedmetadata', setupListeners);
    }
    
    return () => {
      console.log('Cleaning up all video listeners...');
      
      video.removeEventListener('loadedmetadata', setupListeners);

      const track = video.textTracks[0];
      if (track) {
        track.removeEventListener('cuechange', handleCueChange);
      }
      video.removeEventListener('pause', handlePauseOrSeek);
      video.removeEventListener('seeking', handlePauseOrSeek);
      
      taskIDRef.current = null;
    };

  }, [isConnected, sendTextToArduino]);

  return (
    <div className="player-container">
      <h1>Let's Learn</h1>
      <p>Connect your Arduino, then click the button below.</p>
      
      <div className="button-group">
        <button onClick={handleConnect} disabled={isConnected}>
          Connect to Braille Device
        </button>
        <button onClick={handleDisconnect} disabled={!isConnected}>
          Disconnect
        </button>
      </div>

      <hr />
      
      <video ref={videoRef} className="video-player" width="600" controls>
        <source src="/sample2.mp4" type="video/mp4" />
        <track
          label="English"
          kind="subtitles"
          srcLang="en"
          src="/sample.vtt"
          default
        />
      </video>
    </div>
  );
}

export default BraillePlayer;
