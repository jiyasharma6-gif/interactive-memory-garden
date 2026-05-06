import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Pause, Play, SkipForward, Volume2, VolumeX, ListMusic } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { usePoints } from './PointsContext';
import { Tooltip } from './Tooltip';
import { TimeOfDay } from '../types';

const TRACKS = [
  { id: 'zen', name: 'Zen Garden', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 'meadow', name: 'Peaceful Meadow', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  { id: 'mist', name: 'Midnight Mist', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
  { id: 'calm', name: 'Eternal Calm', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3' }
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { timeOfDay } = useTheme();
  const { unlockedTracks } = usePoints();

  const availableTracks = TRACKS.filter(t => unlockedTracks.includes(t.id));
  const currentTrack = availableTracks[currentTrackIdx] || availableTracks[0];

  // Handle auto-switch based on time of day
  useEffect(() => {
    if (audioRef.current && !isPlaying && availableTracks.length > 0) {
      if (timeOfDay === 'night' && availableTracks.some(t => t.id === 'mist')) {
        const mistIdx = availableTracks.findIndex(t => t.id === 'mist');
        setCurrentTrackIdx(mistIdx !== -1 ? mistIdx : 0);
      } else {
        setCurrentTrackIdx(0);
      }
    }
  }, [timeOfDay, availableTracks.length]);

  // Update audio when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed on switch:", e));
      }
    }
  }, [currentTrackIdx]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (availableTracks.length === 0) return;
    setCurrentTrackIdx((prev) => (prev + 1) % availableTracks.length);
  };

  const selectTrack = (idx: number) => {
    setCurrentTrackIdx(idx);
    setIsListOpen(false);
    if (!isPlaying) {
      togglePlay();
    }
  };

  if (availableTracks.length === 0) return null;

  return (
    <div className="fixed top-10 right-10 z-[100] flex flex-col items-end gap-3 text-right">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        loop
        muted={isMuted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex items-center gap-2">
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`backdrop-blur-xl px-4 py-2 rounded-2xl border text-xs font-black shadow-2xl transition-colors ${
                timeOfDay === TimeOfDay.DAY ? 'bg-white/40 border-gray-900/10 text-gray-900' : 'bg-white/10 border-white/20 text-white'
              }`}
            >
              Playing: {currentTrack.name}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isPlaying ? {
            boxShadow: timeOfDay === TimeOfDay.DAY ? [
              "0 0 0px rgba(0, 0, 0, 0)",
              "0 0 20px rgba(0, 0, 0, 0.2)",
              "0 0 0px rgba(0, 0, 0, 0)"
            ] : [
              "0 0 0px rgba(255, 255, 255, 0)",
              "0 0 20px rgba(255, 255, 255, 0.6)",
              "0 0 0px rgba(255, 255, 255, 0)"
            ]
          } : {}}
          transition={isPlaying ? {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
          onClick={togglePlay}
          className={`p-4 rounded-full shadow-2xl transition-all border backdrop-blur-xl ${
            isPlaying 
              ? (timeOfDay === TimeOfDay.DAY ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-white') 
              : (timeOfDay === TimeOfDay.DAY ? 'bg-white/40 text-gray-900 border-gray-900/10' : 'bg-white/10 text-white border-white/30')
          }`}
        >
          <Tooltip content={isPlaying ? "Pause Music" : "Play Music"} position="left">
            {isPlaying ? <Pause size={20} /> : <Music size={20} />}
          </Tooltip>
        </motion.button>
      </div>

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="flex flex-col gap-2"
          >
            <div className={`flex items-center gap-2 backdrop-blur-xl p-2 rounded-full border shadow-xl transition-colors ${
              timeOfDay === TimeOfDay.DAY ? 'bg-white/40 border-gray-900/10' : 'bg-white/10 border-white/20'
            }`}>
              <Tooltip content="Next Track" position="bottom">
                <ControlBtn onClick={nextTrack} icon={<SkipForward size={16} />} timeOfDay={timeOfDay} />
              </Tooltip>
              <Tooltip content={isMuted ? "Unmute" : "Mute"} position="bottom">
                <ControlBtn onClick={() => setIsMuted(!isMuted)} icon={isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />} timeOfDay={timeOfDay} />
              </Tooltip>
              <Tooltip content="Playlist" position="bottom">
                <ControlBtn onClick={() => setIsListOpen(!isListOpen)} icon={<ListMusic size={16} />} timeOfDay={timeOfDay} />
              </Tooltip>
            </div>

            <AnimatePresence>
              {isListOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl min-w-[180px] border border-white overflow-hidden"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-2">Playlist</p>
                  <div className="space-y-1">
                    {availableTracks.map((track, i) => (
                      <button
                        key={track.id}
                        onClick={() => selectTrack(i)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          currentTrackIdx === i ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {track.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ControlBtn({ onClick, icon, timeOfDay }: { onClick: () => void, icon: React.ReactNode, timeOfDay: TimeOfDay }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full transition-all ${
        timeOfDay === TimeOfDay.DAY ? 'text-gray-900/60 hover:text-gray-900 hover:bg-gray-900/10' : 'text-white/80 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
    </button>
  );
}
