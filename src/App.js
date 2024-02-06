import React, { useState, useEffect } from 'react';
import './App.css';

const AudioPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioRef, setAudioRef] = useState(null);

  useEffect(() => {
    // Load playlist and current track index from localStorage on component mount
    const savedPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
    const savedIndex = JSON.parse(localStorage.getItem('currentTrackIndex')) || 0;

    setPlaylist(savedPlaylist);
    setCurrentTrackIndex(savedIndex);
  }, []);

  useEffect(() => {
    // Save playlist and current track index to localStorage whenever they change
    localStorage.setItem('playlist', JSON.stringify(playlist));
    localStorage.setItem('currentTrackIndex', JSON.stringify(currentTrackIndex));
  }, [playlist, currentTrackIndex]);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    const newPlaylist = [...playlist];

    for (let i = 0; i < files.length; i++) {
      newPlaylist.push({
        name: files[i].name,
        url: URL.createObjectURL(files[i]),
      });
    }

    setPlaylist(newPlaylist);

    // Auto-play the first track if the playlist was empty
    if (playlist.length === 0) {
      setCurrentTrackIndex(0);
    }
  };

  const handlePlay = () => {
    audioRef.play();
  };

  const handlePause = () => {
    audioRef.pause();
  };

  const handleEnded = () => {
    // Move to the next track in the playlist upon completion
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const handleTimeUpdate = () => {
    // Update localStorage with the current playback position
    localStorage.setItem('currentPosition', JSON.stringify(audioRef.currentTime));
  };

  const handleTrackClick = (index) => {
    setCurrentTrackIndex(index);
  };

  return (
    <div className='audio_container'>
      <input type="file"  accept="audio/*" onChange={handleFileUpload} multiple />
      <audio
        ref={(audio) => setAudioRef(audio)}
        src={playlist[currentTrackIndex] ? playlist[currentTrackIndex].url : ''}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
      />
      <div>
        <h3>Playlist</h3>
        <ul>
          {playlist.map((track, index) => (
            <li key={index} onClick={() => handleTrackClick(index)}>
              {track.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Now Playing</h3>
        {playlist[currentTrackIndex] && (
          <>
            <p>{playlist[currentTrackIndex].name}</p>
            <input type='progress'/>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handlePause}>Pause</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;


