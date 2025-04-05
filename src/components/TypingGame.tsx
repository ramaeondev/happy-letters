
import React, { useState, useEffect, useRef } from 'react';
import AnimatedLetter from './AnimatedLetter';
import Keyboard from './Keyboard';
import VoiceSelector from './VoiceSelector';
import ImageDisplay from './ImageDisplay';
import { useToast } from '@/hooks/use-toast';

const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5eWhuYnpla2FmbnZ4ZmxobG5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTA0NTksImV4cCI6MjA1OTQyNjQ1OX0.J96DGREUC2NXn1WGC3wkhpr0JsCnBqjVHiQWq4yO3FI";
const API_ENDPOINT = "https://gyyhnbzekafnvxflhlni.functions.supabase.co/random-word-image";

// Default word mapping as fallback if API fails
const createItemsMapping = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const mapping: Record<string, Array<{word: string, image_url: string}>> = {};
  
  const defaultWords: Record<string, string[]> = {
    'A': ['Apple', 'Ant', 'Astronaut', 'Airplane', 'Arrow', 'Avocado', 'Alligator', 'Anchor', 'Acorn', 'Axe'],
    'B': ['Ball', 'Banana', 'Bear', 'Boat', 'Balloon', 'Butterfly', 'Bird', 'Book', 'Beach', 'Bee'],
    'C': ['Cat', 'Car', 'Cake', 'Cow', 'Castle', 'Carrot', 'Cloud', 'Candy', 'Camera', 'Candle'],
    'D': ['Dog', 'Duck', 'Dinosaur', 'Door', 'Dolphin', 'Donut', 'Dragon', 'Drum', 'Diamond', 'Daisy'],
    'E': ['Elephant', 'Egg', 'Eagle', 'Eye', 'Earth', 'Elbow', 'Eel', 'Envelope', 'Eskimo', 'Engine'],
    'F': ['Fish', 'Frog', 'Flower', 'Fox', 'Fire', 'Flag', 'Fries', 'Fan', 'Fairy', 'Feather'],
    'G': ['Giraffe', 'Grass', 'Grapes', 'Gift', 'Guitar', 'Ghost', 'Goat', 'Goose', 'Garden', 'Glove'],
    'H': ['House', 'Hat', 'Horse', 'Heart', 'Hamburger', 'Helicopter', 'Hippo', 'Hand', 'Honey', 'Hammer'],
    'I': ['Ice cream', 'Igloo', 'Island', 'Insect', 'Ink', 'Iron', 'Ivy', 'Icicle', 'Iguana', 'Instrument'],
    'J': ['Jelly', 'Jacket', 'Jet', 'Juice', 'Jam', 'Jellyfish', 'Jeep', 'Jungle', 'Jar', 'Jewelry'],
    'K': ['Kite', 'King', 'Koala', 'Key', 'Kangaroo', 'Kitchen', 'Kettle', 'Keyboard', 'Knife', 'Kiwi'],
    'L': ['Lion', 'Lamp', 'Leaf', 'Lemon', 'Ladder', 'Lighthouse', 'Lizard', 'Lock', 'Lollipop', 'Leg'],
    'M': ['Monkey', 'Moon', 'Mouse', 'Mango', 'Monster', 'Mountain', 'Map', 'Milk', 'Music', 'Muffin'],
    'N': ['Nest', 'Nose', 'Nut', 'Noodles', 'Nurse', 'Nail', 'Notebook', 'Night', 'Needle', 'Necklace'],
    'O': ['Orange', 'Octopus', 'Owl', 'Ocean', 'Onion', 'Otter', 'Oven', 'Ostrich', 'Olive', 'Office'],
    'P': ['Penguin', 'Pig', 'Pizza', 'Panda', 'Pencil', 'Popcorn', 'Puzzle', 'Pear', 'Pillow', 'Parachute'],
    'Q': ['Queen', 'Quilt', 'Question', 'Quail', 'Quarter', 'Quiver', 'Quicksand', 'Quiche', 'Quiet', 'Queue'],
    'R': ['Rabbit', 'Rainbow', 'Robot', 'Rocket', 'River', 'Rain', 'Rose', 'Ring', 'Road', 'Raccoon'],
    'S': ['Snake', 'Sun', 'Star', 'Strawberry', 'Sandwich', 'Spider', 'Ship', 'Snow', 'Shark', 'Sock'],
    'T': ['Tiger', 'Tree', 'Train', 'Turtle', 'Tomato', 'Tooth', 'Tractor', 'Telescope', 'Table', 'Toy'],
    'U': ['Umbrella', 'Unicorn', 'UFO', 'Underwear', 'Uniform', 'Ukulele', 'Umpire', 'Universe', 'Urchin', 'Up'],
    'V': ['Violin', 'Volcano', 'Vase', 'Vegetable', 'Van', 'Vest', 'Valentine', 'Vacuum', 'Vine', 'Village'],
    'W': ['Whale', 'Watch', 'Wagon', 'Watermelon', 'Window', 'Wolf', 'Web', 'Waffle', 'Wind', 'Water'],
    'X': ['X-ray', 'Xylophone', 'Box', 'Fox', 'Axe', 'Exit', 'Taxi', 'Mixer', 'Six', 'Ox'],
    'Y': ['Yo-yo', 'Yacht', 'Yak', 'Yogurt', 'Yarn', 'Yellow', 'Yawn', 'Yard', 'Yell', 'Year'],
    'Z': ['Zebra', 'Zoo', 'Zipper', 'Zero', 'Zigzag', 'Zinc', 'Zucchini', 'Zoom', 'Zone', 'Zombie'],
    '0': ['Zero'],
    '1': ['One'],
    '2': ['Two'],
    '3': ['Three'],
    '4': ['Four'],
    '5': ['Five'],
    '6': ['Six'],
    '7': ['Seven'],
    '8': ['Eight'],
    '9': ['Nine'],
  };
  
  letters.split('').forEach(char => {
    const isNumber = /\d/.test(char);
    const words = isNumber 
      ? Array(10).fill(defaultWords[char][0])
      : (defaultWords[char] || Array(10).fill(`${char}-word`));
    
    mapping[char] = words.map((word) => ({
      word,
      image_url: `https://source.unsplash.com/featured/300x300?${encodeURIComponent(word)}`
    }));
  });
  
  return mapping;
};

interface TypingGameProps {
  darkMode?: boolean;
}

const TypingGame: React.FC<TypingGameProps> = ({ darkMode = false }) => {
  const [currentLetter, setCurrentLetter] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showBoomEffect, setShowBoomEffect] = useState<boolean>(false);
  const [voiceType, setVoiceType] = useState<'male' | 'female'>('female');
  const [letterCounter, setLetterCounter] = useState<Record<string, number>>({});
  const [currentWordAndImage, setCurrentWordAndImage] = useState<{word: string, image_url: string} | null>(null);
  const itemsMapping = useRef(createItemsMapping());
  const { toast } = useToast();
  const lastLetter = useRef<string | null>(null);
  const speechEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [speechAvailable, setSpeechAvailable] = useState<boolean>(true);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [apiError, setApiError] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioPool = useRef<HTMLAudioElement[]>([]);
  const currentAudioIndex = useRef(0);

  const fetchWordAndImage = async (letter: string): Promise<{word: string, image_url: string} | null> => {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_API_KEY}`
        },
        body: JSON.stringify({
          letter: letter.toLowerCase(),
          width: 300,
          height: 300
        })
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`API response for letter ${letter}:`, data);
      return data;
    } catch (error) {
      console.error("Failed to fetch word and image:", error);
      setApiError(true);
      return null;
    }
  };

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechAvailable(false);
      console.warn("Speech synthesis not available in this browser");
    }
    
    if (window.AudioContext || (window as any).webkitAudioContext) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const audioCount = 5;
    for (let i = 0; i < audioCount; i++) {
      const audio = new Audio();
      audio.src = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';
      audio.load();
      audioPool.current.push(audio);
    }
    
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      
      if (/^[a-zA-Z0-9]$/.test(key)) {
        handleLetterPress(key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (speechEndTimeoutRef.current) {
        clearTimeout(speechEndTimeoutRef.current);
      }
      if (speechSynthesisRef.current && speechAvailable) {
        window.speechSynthesis.cancel();
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [isAnimating, speechAvailable]);

  useEffect(() => {
    const initVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          setTimeout(initVoices, 500);
        }
      }
    };

    initVoices();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = initVoices;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const playSound = () => {
    try {
      const audioElement = audioPool.current[currentAudioIndex.current];
      audioElement.currentTime = 0;
      currentAudioIndex.current = (currentAudioIndex.current + 1) % audioPool.current.length;
      audioElement.play().catch((error) => {
        console.error("Audio play error:", error);
        tryWebAudioFallback();
      });
    } catch (error) {
      console.error("Audio playback error:", error);
      tryWebAudioFallback();
    }
  };

  const tryWebAudioFallback = () => {
    if (!audioContextRef.current) return;
    
    try {
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      
      gainNode.gain.value = 0.1;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, 100);
    } catch (e) {
      console.error("Web Audio API also failed:", e);
    }
  };

  const speakLetter = (letter: string, word: string) => {
    if (!speechAvailable) {
      setTimeout(() => {
        setShowBoomEffect(false);
      }, 1500);
      return;
    }
    
    try {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
      
      setTimeout(() => {
        const isNumber = /\d/.test(letter);
        const textToSpeak = isNumber ? letter : `${letter}. ${word}`;
        
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        speechSynthesisRef.current = utterance;
        
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;
        
        const voices = window.speechSynthesis.getVoices();
        
        let selectedVoice = voices.find(voice => 
          voiceType === 'male' 
            ? voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man')
            : voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman')
        );
        
        if (!selectedVoice && voices.length > 0) {
          console.log("No specific voice found, using first available voice");
          selectedVoice = voices[0];
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        } else {
          console.log("No voices available, using default voice");
        }
        
        utterance.onend = () => {
          console.log("Speech ended normally for: " + textToSpeak);
          setShowBoomEffect(false);
          speechSynthesisRef.current = null;
          setActiveKey(null);
        };
        
        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          setShowBoomEffect(false);
          speechSynthesisRef.current = null;
          setActiveKey(null);
          
          if (event.error === 'interrupted') {
            console.log("Speech was interrupted, this is normal when typing quickly");
            setShowBoomEffect(false);
          }
        };
        
        const estimatedSpeechTime = Math.max(1500, (letter.length + (isNumber ? 0 : word.length)) * 100);
        if (speechEndTimeoutRef.current) {
          clearTimeout(speechEndTimeoutRef.current);
        }
        
        speechEndTimeoutRef.current = setTimeout(() => {
          setShowBoomEffect(false);
          setActiveKey(null);
        }, estimatedSpeechTime);
        
        window.speechSynthesis.speak(utterance);
        console.log("Speaking:", textToSpeak);
      }, 50);
    } catch (error) {
      console.error("Speech synthesis error:", error);
      setShowBoomEffect(false);
      setActiveKey(null);
      
      setTimeout(() => {
        setShowBoomEffect(false);
      }, 1500);
    }
  };

  const handleLetterPress = async (letter: string) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveKey(letter);
    
    // Initialize the counter if it doesn't exist
    const currentCount = letterCounter[letter] !== undefined ? letterCounter[letter] : 0;
    const newCount = (currentCount + 1) % 10;
    setLetterCounter(prev => ({...prev, [letter]: newCount}));
    
    // Try to fetch from API first
    let wordAndImage = null;
    try {
      wordAndImage = await fetchWordAndImage(letter);
    } catch (error) {
      console.error("Error fetching from API:", error);
    }
    
    // If API fails, use the default mapping
    if (!wordAndImage) {
      wordAndImage = itemsMapping.current[letter][newCount];
      console.log("Using fallback word and image:", wordAndImage);
    }
    
    setCurrentWordAndImage(wordAndImage);
    
    if (speechEndTimeoutRef.current) {
      clearTimeout(speechEndTimeoutRef.current);
    }
    
    playSound();
    
    setCurrentLetter('');
    
    setTimeout(() => {
      setCurrentLetter(letter);
      setIsAnimating(false);
      lastLetter.current = letter;
      setShowBoomEffect(true);
      
      if (wordAndImage) {
        speakLetter(letter, wordAndImage.word);
      }
      
      toast({
        title: letter,
        description: wordAndImage ? wordAndImage.word : '',
        duration: 2000,
      });
    }, 200);
  };

  const bgColor = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-700';

  return (
    <div className={`${bgColor} rounded-2xl shadow-2xl p-6 md:p-8 transition-colors duration-300`}>
      <div className="text-center mb-6">
        <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Type any letter or number on your keyboard or tap below!
        </p>
        
        <VoiceSelector voiceType={voiceType} onVoiceChange={setVoiceType} darkMode={darkMode} />
      </div>
      
      <div className={`flex flex-col items-center h-80 md:h-96 mb-8 ${darkMode ? 'bg-gradient-to-r from-gray-900 to-indigo-900' : 'bg-gradient-to-r from-purple-100 to-pink-100'} rounded-xl overflow-hidden relative`}>
        {currentLetter && showBoomEffect && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`animate-ping absolute inline-flex h-full w-full rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-400'} opacity-30`}></div>
          </div>
        )}
        
        {apiError && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs">
            Using backup images
          </div>
        )}
        
        <div className="flex flex-col items-center justify-center h-full w-full">
          {currentLetter ? (
            <>
              <AnimatedLetter letter={currentLetter} />
              {currentWordAndImage && <ImageDisplay word={currentWordAndImage.word} imageUrl={currentWordAndImage.image_url} />}
            </>
          ) : (
            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-400'} text-2xl`}>
              Type a letter or number to begin!
            </div>
          )}
        </div>
      </div>
      
      <Keyboard 
        onLetterClick={handleLetterPress} 
        showNumbers={true} 
        darkMode={darkMode} 
        activeKey={activeKey}
      />
    </div>
  );
};

export default TypingGame;
