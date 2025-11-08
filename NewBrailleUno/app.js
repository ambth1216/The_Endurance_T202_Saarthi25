// --- New Global Variables ---
let port;
let serialWriter;
let currentTaskID = null; // This is the key to stopping old tasks

const connectButton = document.getElementById('connectButton');
const disconnectButton = document.getElementById('disconnectButton');
const video = document.getElementById('myVideo');

// 1. Connect Button Listener (Updated)
connectButton.addEventListener('click', async () => {
  if (navigator.serial) {
    try {
      port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      
      serialWriter = port.writable.getWriter(); // Store writer globally

      console.log('Serial port connected!');
      
      // Update button states
      connectButton.textContent = 'Connected!';
      connectButton.disabled = true;
      disconnectButton.disabled = false;

      // Start listening for subtitle and video events
      setupVideoListeners();

    } catch (err) {
      console.error('Error connecting to serial port:', err);
    }
  } else {
    alert('Web Serial API is not supported in your browser. Please use Chrome or Edge.');
  }
});

// --- New ---
// 2. Disconnect Button Listener
disconnectButton.addEventListener('click', async () => {
  await handleDisconnect();
});

// --- New ---
// 3. Helper function to disconnect
async function handleDisconnect() {
  console.log('Disconnecting from serial port...');
  currentTaskID = null; // This will stop any running Braille task

  if (serialWriter) {
    try {
      // Abort any pending writes and release the lock
      await serialWriter.abort(); 
      serialWriter.releaseLock();
    } catch (err) {
      console.error('Error aborting writer:', err);
    }
    serialWriter = null;
  }

  if (port) {
    try {
      await port.close(); // Close the port
    } catch (err) {
      console.error('Error closing port:', err);
    }
    port = null;
  }

  // Reset button states
  connectButton.textContent = 'Connect to Braille Device';
  connectButton.disabled = false;
  disconnectButton.disabled = true;
}

// --- Updated ---
// 4. Set up all video event listeners
function setupVideoListeners() {
  const track = video.textTracks[0];
  if (!track) {
    console.error("No text track found!");
    return;
  }
  track.mode = 'showing';

  // This event fires when a new subtitle appears
  track.oncuechange = () => {
    const cue = track.activeCues[0];
    if (cue) {
      console.log('New Subtitle:', cue.text);
      // Give this new task a unique ID
      const taskID = Date.now();
      currentTaskID = taskID;
      // Send the text and the new ID. Do NOT await this.
      sendTextToArduino(cue.text, taskID);
    } else {
      // No active subtitle, so cancel any running task
      currentTaskID = null;
    }
  };

  // --- New Event Listeners for Stopping ---

  // When the video is paused, stop the current task
  video.addEventListener('pause', () => {
    console.log('Video paused, stopping Braille task.');
    currentTaskID = null;
  });

  // When seeking, stop the current task
  video.addEventListener('seeking', () => {
    console.log('Video seeked, stopping Braille task.');
    currentTaskID = null;
  });

  // When play resumes, we need to re-trigger the current subtitle
  video.addEventListener('play', () => {
    const cue = track.activeCues[0];
    if (cue) {
      console.log('Resuming subtitle:', cue.text);
      const taskID = Date.now();
      currentTaskID = taskID;
      sendTextToArduino(cue.text, taskID);
    }
  });
}

// --- Updated ---
// 5. Function to send text to the Arduino (now with stopping logic)
async function sendTextToArduino(text, taskID) {
  if (!serialWriter) {
    console.warn('Serial port not connected.');
    return;
  }

  const encoder = new TextEncoder();
  
  for (const char of text) {
    // *** CRITICAL STOP CHECK ***
    // Before vibrating, check if this task is still the "current" one.
    // If not, a new subtitle has come in, or the user pressed pause.
    if (taskID !== currentTaskID) {
      console.log('Braille task cancelled (new task started or video paused).');
      return; // Exit the function immediately
    }
    
    // Only process letters and spaces
    const lowerChar = char.toLowerCase();
    if (lowerChar >= 'a' && lowerChar <= 'z' || lowerChar === ' ') {
      console.log(`Sending: ${lowerChar}`);
      
      const data = encoder.encode(lowerChar); 
      try {
        await serialWriter.write(data);
      } catch (err) {
        // This likely means the device was unplugged
        console.error("Error writing to serial:", err);
        await handleDisconnect(); // Cleanly disconnect
        return; // Stop the function
      }

      // Wait for the Arduino to finish.
      // This is still 2.5s based on your code, but now it's cancellable!
      await new Promise(resolve => setTimeout(resolve, 2500));
    }
  }
  console.log('Finished Braille for subtitle.');
}