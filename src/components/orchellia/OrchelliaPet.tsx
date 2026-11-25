'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudioStore } from '@/store/useStudioStore';
import {
  X,
  Volume2,
  VolumeX,
  ArrowRight,
  Send,
  Loader2,
  Mic,
  MicOff,
  Leaf,
  MessageSquare,
  SquarePen,
  ZoomIn,
  ZoomOut,
  Compass,
  Navigation,
} from 'lucide-react';
import { StylingGuideModal } from '@/components/styling/StylingGuideModal';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

interface SelectionPillState {
  text: string;
  x: number;
  y: number;
}

type PetActionState = 'idle' | 'listening' | 'thinking' | 'flying' | 'inspecting' | 'speaking' | 'delighted';

interface FlightWaypoint {
  x: number;
  y: number;
  label: string;
  targetId: string;
}

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function OrchelliaPet() {
  // Companion Pet States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showStylingModal, setShowStylingModal] = useState(false);
  const [petActionState, setPetActionState] = useState<PetActionState>('idle');

  // Waypoint Flight State
  const [flightTarget, setFlightTarget] = useState<FlightWaypoint | null>(null);

  // Conversational & Audio State
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'I am with you in the atelier. Speak with me directly, tap a question, or highlight any text on the page.',
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Push-to-Talk Mic State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Text Selection Blossom Pill State
  const [selectionPill, setSelectionPill] = useState<SelectionPillState | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const petVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Ensure animated orchid pet body video loops continuously
  useEffect(() => {
    if (petVideoRef.current) {
      petVideoRef.current.play().catch(() => {});
    }
  }, []);

  // Zustand Store Selectors & Actions
  const activeScarf = useStudioStore((state) => state.activeScarf);
  const activeScarfId = useStudioStore((state) => state.activeScarfId);
  const selectScarf = useStudioStore((state) => state.selectScarf);
  const set3DView = useStudioStore((state) => state.set3DView);
  const setHeroMode = useStudioStore((state) => state.setHeroMode);
  const highlightUI = useStudioStore((state) => state.highlightUI);
  const clearUIHighlight = useStudioStore((state) => state.clearUIHighlight);
  const zoomState = useStudioStore((state) => state.zoomState);
  const setZoom = useStudioStore((state) => state.setZoom);
  const resetZoom = useStudioStore((state) => state.resetZoom);

  // Auto-scroll chat stream
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isChatLoading]);

  // Clean up audio and intervals on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  // Listen for Text Selections anywhere on the page
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        return;
      }

      const text = selection.toString().trim();
      if (text.length >= 3 && text.length <= 90) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            setSelectionPill({
              text,
              x: Math.min(Math.max(rect.left + rect.width / 2, 90), window.innerWidth - 120),
              y: Math.max(rect.top - 12, 16),
            });
          }
        } catch {
          // Fallback
        }
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.orchellia-selection-pill') || target.closest('.orchellia-pet-container')) {
        return;
      }
      setSelectionPill(null);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  // Calculate coordinates for Waypoint Flight to UI features
  const flyToTarget = useCallback((targetId: string, label: string) => {
    if (typeof window === 'undefined') return;

    setPetActionState('flying');

    if (targetId === 'hero' || targetId === '3d_scarf' || targetId === 'canvas') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Hover gracefully to the upper-left of the 3D canvas stage
      const targetX = -Math.min(window.innerWidth * 0.35, 380);
      const targetY = -Math.min(window.innerHeight * 0.45, 340);
      setFlightTarget({ x: targetX, y: targetY, label: '3D Silk Weave', targetId });
    } else if (targetId === 'collection') {
      const el = document.getElementById('collection');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        const targetX = -Math.min(window.innerWidth * 0.45, 480);
        const targetY = -Math.min(window.innerHeight * 0.25, 220);
        setFlightTarget({ x: targetX, y: targetY, label: 'Collection Swatches', targetId });
      }
    } else if (targetId === 'craft' || targetId === 'craft_loupe') {
      const el = document.getElementById('craft');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        const targetX = -Math.min(window.innerWidth * 0.4, 420);
        const targetY = -Math.min(window.innerHeight * 0.3, 260);
        setFlightTarget({ x: targetX, y: targetY, label: 'Craft Lab Loupe', targetId });
      }
    } else if (targetId === 'bag' || targetId === 'cart') {
      const targetX = -40;
      const targetY = -Math.min(window.innerHeight * 0.7, 500);
      setFlightTarget({ x: targetX, y: targetY, label: 'Atelier Bag', targetId });
    } else {
      // Default flight position
      setFlightTarget({ x: -120, y: -180, label, targetId });
    }

    // Switch from flying to inspecting after glide transition completes
    setTimeout(() => {
      setPetActionState('inspecting');
    }, 600);
  }, []);

  // Return Orchéllia gracefully to her home dock
  const returnToDock = useCallback(() => {
    setPetActionState('flying');
    setFlightTarget(null);
    clearUIHighlight();
    setTimeout(() => {
      setPetActionState('idle');
    }, 600);
  }, [clearUIHighlight]);

  // Audio-Paced Word Streaming Engine: Reveals words in perfect lockstep with Sol Voice playback
  const streamWordsSynchronizedWithVoice = useCallback(
    async (fullText: string, audioBlobUrl: string | null) => {
      const words = fullText.split(' ');
      if (words.length === 0) return;

      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }

      // Add a fresh empty assistant message to stream words into
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      if (audioBlobUrl) {
        if (audioRef.current) {
          audioRef.current.pause();
        }

        const audio = new Audio(audioBlobUrl);
        audioRef.current = audio;

        // Obtain duration for timing calibration
        let audioDuration = 0;
        await new Promise<void>((resolve) => {
          audio.onloadedmetadata = () => {
            audioDuration = audio.duration;
            resolve();
          };
          audio.onerror = () => resolve();
          setTimeout(resolve, 350);
        });

        // Compute word interval (ms per word) calibrated to audio duration
        const totalDurationSec = audioDuration > 0 ? audioDuration : words.length * 0.35;
        const intervalMs = Math.max(35, (totalDurationSec * 1000) / words.length);

        setPetActionState('speaking');
        setIsVoicePlaying(true);
        audio.play().catch(() => {});

        audio.onended = () => {
          setIsVoicePlaying(false);
          // Return to idle after speech completes
          setTimeout(() => {
            setPetActionState('idle');
            // If at a flight waypoint, glide back home after user has absorbed the note
            if (flightTarget) {
              setTimeout(returnToDock, 2200);
            }
          }, 400);
          URL.revokeObjectURL(audioBlobUrl);
        };

        // Stream words one-by-one synchronized to audio
        let currentWordIndex = 0;
        streamIntervalRef.current = setInterval(() => {
          currentWordIndex++;
          const currentContent = words.slice(0, currentWordIndex).join(' ');

          setMessages((prev) => {
            const next = [...prev];
            if (next.length > 0 && next[next.length - 1].role === 'assistant') {
              next[next.length - 1] = { role: 'assistant', content: currentContent };
            }
            return next;
          });

          if (currentWordIndex >= words.length) {
            if (streamIntervalRef.current) {
              clearInterval(streamIntervalRef.current);
            }
          }
        }, intervalMs);
      } else {
        // Fallback: Natural conversational typewriter streaming
        setPetActionState('speaking');
        let currentWordIndex = 0;
        const intervalMs = 60;

        streamIntervalRef.current = setInterval(() => {
          currentWordIndex++;
          const currentContent = words.slice(0, currentWordIndex).join(' ');

          setMessages((prev) => {
            const next = [...prev];
            if (next.length > 0 && next[next.length - 1].role === 'assistant') {
              next[next.length - 1] = { role: 'assistant', content: currentContent };
            }
            return next;
          });

          if (currentWordIndex >= words.length) {
            if (streamIntervalRef.current) {
              clearInterval(streamIntervalRef.current);
            }
            setPetActionState('idle');
            if (flightTarget) {
              setTimeout(returnToDock, 2500);
            }
          }
        }, intervalMs);
      }
    },
    [flightTarget, returnToDock]
  );

  // Execute Tool Calls returned from Orchéllia
  const executeToolCalls = useCallback(
    (toolCalls: ToolCall[]) => {
      for (const tool of toolCalls) {
        switch (tool.name) {
          case 'select_scarf': {
            const scarfId = tool.arguments.scarfId as 'solstice' | 'fern-whisper' | 'indigo-flora' | 'iron-oak';
            if (scarfId) {
              selectScarf(scarfId);
              setHeroMode('canvas');
              flyToTarget('canvas', `${scarfId} Silk Weave`);
            }
            break;
          }
          case 'set_3d_view': {
            const preset = tool.arguments.preset as 'front' | 'drape_detail' | 'full_spin' | 'top_down';
            if (preset) {
              set3DView(preset);
              setHeroMode('canvas');
              flyToTarget('canvas', '3D Camera View');
            }
            break;
          }
          case 'zoom_ui': {
            const target = tool.arguments.target as string;
            const level = (tool.arguments.level as number) || 1.8;
            if (target === 'reset') {
              resetZoom();
              returnToDock();
            } else if (target === '3d_scarf') {
              setHeroMode('canvas');
              setZoom('3d_scarf', level);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              flyToTarget('canvas', '3D Weave Inspection');
            } else if (target === 'craft_loupe') {
              const el = document.getElementById('craft');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              setZoom('craft_loupe', level);
              highlightUI('craft', '2.5× Macro Loupe inspection of natural dye formulation');
              flyToTarget('craft', 'Craft Lab Alchemy');
            } else if (target === 'collection_tray') {
              const el = document.getElementById('collection');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              setZoom('collection_tray', level);
              flyToTarget('collection', 'Collection Tray');
            }
            break;
          }
          case 'focus_section': {
            const sectionId = tool.arguments.sectionId as string;
            if (sectionId) {
              const el = document.getElementById(sectionId);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              flyToTarget(sectionId, sectionId.toUpperCase());
            }
            break;
          }
          case 'highlight_ui': {
            const targetId = tool.arguments.targetId as string;
            const explanation = (tool.arguments.explanation as string) || null;
            if (targetId) {
              highlightUI(targetId, explanation);
              flyToTarget(targetId, explanation || 'Focus Target');
            }
            break;
          }
          case 'open_bag': {
            useStudioStore.getState().openBag();
            setPetActionState('delighted');
            flyToTarget('bag', 'Atelier Bag');
            break;
          }
          case 'open_styling_guide': {
            setShowStylingModal(true);
            setPetActionState('delighted');
            break;
          }
          default:
            break;
        }
      }
    },
    [selectScarf, setHeroMode, set3DView, highlightUI, setZoom, resetZoom, flyToTarget, returnToDock]
  );

  // Send message to Orchéllia with pre-fetched voice audio & synchronized word streaming
  const handleSendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isChatLoading) return;

      // Add user message to UI immediately
      const newMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
      setMessages(newMessages);
      setInputText('');
      setIsChatLoading(true);
      setVoiceNotice(null);
      setPetActionState('thinking');

      try {
        // 1. Fetch Chat Completion from /api/orchellia/chat
        const res = await fetch('/api/orchellia/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        const data = await res.json();
        const replyMessage = data.message || 'I am here with you in the atelier.';

        // Execute tool calls (and initiate flight if target exists)
        if (data.toolCalls && Array.isArray(data.toolCalls)) {
          executeToolCalls(data.toolCalls);
        }

        // 2. Pre-fetch Voice Audio BEFORE streaming text so words reveal *as* she speaks
        let audioBlobUrl: string | null = null;
        try {
          setIsVoiceLoading(true);
          const voiceRes = await fetch('/api/orchellia/voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: replyMessage }),
          });

          if (voiceRes.ok) {
            const blob = await voiceRes.blob();
            audioBlobUrl = URL.createObjectURL(blob);
          } else {
            const err = await voiceRes.json().catch(() => ({}));
            if (err.error === 'OPENAI_API_KEY_REQUIRED') {
              setVoiceNotice('Atelier Preview: Add OPENAI_API_KEY in .env.local to stream Sol voice.');
            }
          }
        } catch (vErr) {
          console.warn('Voice generation warning:', vErr);
        } finally {
          setIsVoiceLoading(false);
          setIsChatLoading(false);
        }

        // 3. Begin synchronized word streaming as voice speaks!
        await streamWordsSynchronizedWithVoice(replyMessage, audioBlobUrl);
      } catch (err) {
        console.error('Chat error:', err);
        setIsChatLoading(false);
        setPetActionState('idle');
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'The steam in the atelier is thick right now. Solstice rests on the table before you—shall we look at its golden leaves?',
          },
        ]);
      }
    },
    [messages, isChatLoading, executeToolCalls, streamWordsSynchronizedWithVoice]
  );

  // Play audio on demand for existing messages
  const handlePlayVoiceOnDemand = async (textToSpeak: string) => {
    if (isVoicePlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsVoicePlaying(false);
        setPetActionState('idle');
      }
      return;
    }

    try {
      setIsVoiceLoading(true);
      setPetActionState('thinking');
      const res = await fetch('/api/orchellia/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak }),
      });

      if (!res.ok) {
        setIsVoiceLoading(false);
        setPetActionState('idle');
        return;
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsVoicePlaying(false);
        setPetActionState('idle');
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
      setIsVoicePlaying(true);
      setIsVoiceLoading(false);
      setPetActionState('speaking');
    } catch {
      setIsVoiceLoading(false);
      setPetActionState('idle');
    }
  };

  // Handle clicking the contextual text selection pill
  const handleSelectPillClick = () => {
    if (!selectionPill) return;
    const selectedPhrase = selectionPill.text;

    window.getSelection()?.removeAllRanges();
    setSelectionPill(null);

    setIsChatOpen(true);
    handleSendMessage(`What can you tell me about "${selectedPhrase}"?`);
  };

  // Push-to-Talk Speech Recognition
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setPetActionState('idle');
      return;
    }

    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setPetActionState('listening');
        setVoiceNotice('Listening to your voice...');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setInputText(transcript);
          setIsChatOpen(true);
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        setIsListening(false);
        setPetActionState('idle');
        if (event.error === 'not-allowed') {
          setVoiceNotice('Microphone permission denied.');
        } else {
          setVoiceNotice(null);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setPetActionState('idle');
    }
  };

  // Dynamic Context-Aware Suggestions based on current active scarf
  const getDynamicContextSuggestions = () => {
    switch (activeScarfId) {
      case 'solstice':
        return [
          {
            label: 'Why sun-cured eucalyptus?',
            action: () => handleSendMessage('Why do you use sun-cured eucalyptus leaves in Solstice?'),
          },
          {
            label: 'Zoom into 3D weave detail',
            action: () => {
              setHeroMode('canvas');
              setZoom('3d_scarf', 1.9);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              flyToTarget('canvas', 'Solstice Silk Weave');
              handleSendMessage('Zoom into the 3D silk weave to inspect the golden amber print.');
            },
          },
          {
            label: 'How is golden amber achieved?',
            action: () => handleSendMessage('What botanical dyes create the golden amber hue of Solstice?'),
          },
          {
            label: 'Add Solstice to Bag',
            action: () => {
              useStudioStore.getState().addToBag('solstice', 1);
              setPetActionState('delighted');
              flyToTarget('bag', 'Atelier Bag');
              handleSendMessage('I have placed Solstice in your atelier bag.');
            },
          },
        ];
      case 'fern-whisper':
        return [
          {
            label: 'Why sword fern silhouettes?',
            action: () => handleSendMessage('Tell me about the Pacific sword ferns in Fern Whisper.'),
          },
          {
            label: 'Explain iron tannin mordant',
            action: () => handleSendMessage('What role does the mineral iron water play in Fern Whisper?'),
          },
          {
            label: 'Zoom into ghost fronds',
            action: () => {
              setHeroMode('canvas');
              setZoom('3d_scarf', 1.9);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              flyToTarget('canvas', 'Fern Whisper Silk');
              handleSendMessage('Zoom into the ghost fronds on the Fern Whisper silk.');
            },
          },
          {
            label: 'How to drape with tailoring',
            action: () => {
              setShowStylingModal(true);
              setPetActionState('delighted');
              handleSendMessage('Demonstrate how to drape Fern Whisper with tailored pieces.');
            },
          },
        ];
      case 'indigo-flora':
        return [
          {
            label: 'The 9-month cold fermented vat',
            action: () => handleSendMessage('Explain how your 9-month earthenware indigo vat works.'),
          },
          {
            label: 'Why persistent lapis lazuli?',
            action: () => handleSendMessage('Why is living fermented indigo so rich on silk?'),
          },
          {
            label: 'Zoom in Craft Lab loupe',
            action: () => {
              const el = document.getElementById('craft');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              setZoom('craft_loupe', 1.8);
              flyToTarget('craft', 'Craft Lab Indigo Vats');
              handleSendMessage('Zoom into the Craft Lab to observe the living indigo vats.');
            },
          },
          {
            label: 'Inspect 3D silk drape',
            action: () => {
              setHeroMode('canvas');
              set3DView('drape_detail');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              flyToTarget('canvas', '3D Silk Drape');
            },
          },
        ];
      case 'iron-oak':
        return [
          {
            label: 'What causes the violet charcoal hue?',
            action: () => handleSendMessage('What chemical reaction creates the smoky charcoal and violet in Iron Oak?'),
          },
          {
            label: 'Oak gall tannin chemistry',
            action: () => handleSendMessage('Why are foraged oak galls so important to your iron prints?'),
          },
          {
            label: 'Zoom into charcoal hem',
            action: () => {
              setHeroMode('canvas');
              setZoom('3d_scarf', 1.8);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              flyToTarget('canvas', 'Iron Oak Hem Detail');
              handleSendMessage('Zoom into the charcoal and violet hem detail of Iron Oak.');
            },
          },
          {
            label: 'View Parisian Bias knot',
            action: () => {
              setShowStylingModal(true);
              setPetActionState('delighted');
              handleSendMessage('How should I style the Iron Oak scarf using the Parisian Bias Knot?');
            },
          },
        ];
      default:
        return [
          {
            label: 'Where should I wander?',
            action: () => handleSendMessage('Where do you recommend I begin in the atelier?'),
          },
          {
            label: 'Tell me about the scarves',
            action: () => handleSendMessage('Tell me about the 4 launch botanical scarves.'),
          },
        ];
    }
  };

  return (
    <>
      {/* 🌿 Floating Contextual Selection Blossom Pill */}
      {selectionPill && (
        <div
          style={{
            position: 'fixed',
            left: `${selectionPill.x}px`,
            top: `${selectionPill.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="orchellia-selection-pill z-50 animate-in fade-in zoom-in-95 duration-200"
        >
          <button
            onClick={handleSelectPillClick}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-full glass-panel border border-[#BB9AEF] bg-[#221D63]/95 text-[#FFF2B1] shadow-2xl hover:bg-[#BB9AEF] hover:text-[#221D63] transition-all duration-300 group cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#BB9AEF] group-hover:bg-[#221D63] animate-ping" />
            <Leaf className="w-3.5 h-3.5 text-[#BB9AEF] group-hover:text-[#221D63] transition-colors" />
            <span className="font-serif text-xs tracking-wider">
              Ask Orchéllia about &ldquo;
              <span className="font-semibold italic max-w-[140px] truncate inline-block align-bottom text-[#FFC8DD] group-hover:text-[#221D63]">
                {selectionPill.text}
              </span>
              &rdquo;
            </span>
          </button>
        </div>
      )}

      {/* 🔍 Global Active Zoom Indicator Pill */}
      {zoomState.isZoomed && (
        <div className="fixed top-20 right-6 z-40 animate-in fade-in slide-in-from-top-4 duration-300">
          <button
            onClick={() => {
              resetZoom();
              returnToDock();
            }}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-botanical-marigold/60 bg-brand-noir/90 text-brand-ecru shadow-xl hover:border-botanical-marigold transition-all group"
          >
            <ZoomOut className="w-3.5 h-3.5 text-botanical-marigold group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-mono tracking-wider uppercase">
              Zoom Active: {zoomState.target === '3d_scarf' ? '3D Silk Weave' : 'Craft Lab'}
            </span>
            <span className="text-[10px] text-brand-sand/60 group-hover:text-brand-ecru">
              (Click to Reset)
            </span>
          </button>
        </div>
      )}

      {/* 🌸 Living Orchid Pet Container with Smooth Waypoint Flight Physics */}
      <motion.div
        animate={{
          x: flightTarget ? flightTarget.x : 0,
          y: flightTarget ? flightTarget.y : 0,
        }}
        transition={{
          type: 'spring',
          damping: 24,
          stiffness: 90,
          mass: 0.8,
        }}
        className="orchellia-pet-container fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto select-none"
      >
        {/* Floating Waypoint Beacon Indicator when hovering across UI */}
        {flightTarget && (
          <div className="mb-2 glass-pill px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase text-botanical-marigold bg-[#141210]/90 border border-botanical-marigold/40 shadow-xl flex items-center space-x-1.5 animate-in fade-in duration-300">
            <Navigation className="w-3 h-3 animate-spin-slow" />
            <span>Guiding: {flightTarget.label}</span>
            <button
              onClick={returnToDock}
              className="ml-1 text-brand-sand/60 hover:text-brand-ecru transition-colors"
              title="Return to dock"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Floating Speech Bubble / Dialogue Card */}
        {isChatOpen && (
          <div className="mb-3 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[75vh] glass-panel p-5 rounded-3xl border border-botanical-marigold/40 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-6 duration-300 relative flex flex-col overflow-hidden backdrop-blur-2xl">
            {/* Header: Living Character Presence & Active Context */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-botanical-marigold animate-ping" />
                <h4 className="font-serif text-sm uppercase tracking-luxury text-brand-ecru leading-none">
                  Orchéllia
                </h4>
                <span className="text-[9px] font-mono tracking-widest text-botanical-marigold glass-pill px-1.5 py-0.5 rounded-full uppercase">
                  {activeScarf.name}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* 3D Weave Zoom Quick Action */}
                <button
                  onClick={() => {
                    if (zoomState.isZoomed && zoomState.target === '3d_scarf') {
                      resetZoom();
                      returnToDock();
                    } else {
                      setHeroMode('canvas');
                      setZoom('3d_scarf', 1.8);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      flyToTarget('canvas', '3D Scarf Weave');
                    }
                  }}
                  className="p-1 rounded-full text-brand-sand/60 hover:text-botanical-marigold transition-colors"
                  title={zoomState.isZoomed ? 'Zoom Out' : 'Zoom into 3D Weave'}
                >
                  {zoomState.isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 rounded-full text-brand-sand/60 hover:text-brand-ecru transition-colors"
                  aria-label="Close dialogue"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Conversation Stream */}
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3 scrollbar-thin scrollbar-thumb-white/10 text-xs"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  } animate-in fade-in duration-200`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[90%] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-botanical-marigold/15 border border-botanical-marigold/30 text-brand-ecru rounded-br-none'
                        : 'glass-panel border border-white/10 text-brand-sand/90 font-serif italic rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                    {/* Blinking cursor while assistant is streaming text */}
                    {msg.role === 'assistant' && isVoicePlaying && idx === messages.length - 1 && (
                      <span className="inline-block w-1.5 h-3 bg-botanical-marigold ml-1 animate-pulse" />
                    )}
                  </div>

                  {msg.role === 'assistant' && msg.content && (
                    <div className="mt-1 flex items-center space-x-2 px-1">
                      <button
                        onClick={() => handlePlayVoiceOnDemand(msg.content)}
                        disabled={isVoiceLoading}
                        className="text-[10px] font-mono tracking-widest uppercase text-botanical-marigold/80 hover:text-botanical-marigold flex items-center space-x-1 transition-colors"
                      >
                        {isVoiceLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : isVoicePlaying ? (
                          <VolumeX className="w-3 h-3 text-red-400" />
                        ) : (
                          <Volume2 className="w-3 h-3" />
                        )}
                        <span>{isVoicePlaying ? 'Pause Voice' : 'Hear Sol Voice'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-center space-x-2 text-xs text-brand-sand/60 italic py-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-botanical-marigold animate-ping" />
                  <span>Orchéllia is gathering botanical memories...</span>
                </div>
              )}
            </div>

            {/* Setup / Voice Notice */}
            {voiceNotice && (
              <div className="mb-2 text-[10px] text-botanical-marigold/90 bg-botanical-marigold/10 border border-botanical-marigold/30 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
                <span>{voiceNotice}</span>
                <button onClick={() => setVoiceNotice(null)} className="ml-2 hover:opacity-100 opacity-60">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Contextual Suggestion Chips */}
            <div className="space-y-1 mb-3 flex-shrink-0">
              <span className="text-[9px] font-mono uppercase tracking-widest text-brand-sand/50 block">
                Explore {activeScarf.name}
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {getDynamicContextSuggestions().map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={suggestion.action}
                    disabled={isChatLoading}
                    className="text-left p-1.5 rounded-xl glass-pill hover:bg-white/10 transition-all flex items-center justify-between group border border-white/5 hover:border-botanical-marigold/40"
                  >
                    <span className="font-serif text-[11px] text-brand-ecru group-hover:text-botanical-marigold transition-colors line-clamp-1">
                      {suggestion.label}
                    </span>
                    <ArrowRight className="w-3 h-3 text-botanical-marigold opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input with Send */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="relative flex items-center flex-shrink-0"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Orchéllia, speak, or select text..."
                className="w-full glass-panel border border-white/15 focus:border-botanical-marigold/70 rounded-full py-2 pl-4 pr-10 text-xs text-brand-ecru placeholder:text-brand-sand/40 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isChatLoading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-botanical-marigold text-brand-noir disabled:opacity-40 hover:scale-105 active:scale-95 transition-all"
                title="Send"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* 🌸 The Orchid Pet Character with Expressive Action Animations */}
        <div className="relative flex flex-col items-center">
          {/* Action State Visual: Inspecting Focal Beam */}
          {petActionState === 'inspecting' && (
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 pointer-events-none flex items-center z-10 animate-in fade-in duration-300">
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-botanical-marigold/80 to-botanical-marigold animate-pulse" />
              <span className="w-3 h-3 rounded-full bg-botanical-marigold animate-ping opacity-75" />
            </div>
          )}

          {/* Action State Visual: Delighted Spore Burst */}
          {petActionState === 'delighted' && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
              <span className="absolute w-3 h-3 rounded-full bg-[#BB9AEF] animate-ping" />
              <span className="absolute -top-4 -right-3 w-2.5 h-2.5 rounded-full bg-[#FFC8DD] animate-bounce" />
              <span className="absolute -bottom-3 -left-4 w-2 h-2 rounded-full bg-[#BB9AEF] animate-pulse" />
              <span className="absolute -top-3 -left-3 w-2.5 h-2.5 rounded-full bg-[#FFF2B1] animate-ping" />
            </div>
          )}

          {/* Action State Visual: Speaking Soundwave Aura */}
          {petActionState === 'speaking' && (
            <>
              <div className="absolute -inset-3 rounded-full border border-[#BB9AEF]/40 animate-ping pointer-events-none" />
              <div className="absolute -inset-1 rounded-full bg-[#BB9AEF]/20 blur-md animate-pulse pointer-events-none" />
            </>
          )}

          {/* Action State Visual: Thinking Orbit */}
          {petActionState === 'thinking' && (
            <div className="absolute -inset-2 rounded-full border border-dashed border-[#BB9AEF]/60 animate-spin-slow pointer-events-none opacity-80" />
          )}

          {/* Orchid Pet Figure with Ethereal Screen Blend & Interactive Tilts */}
          <motion.button
            onClick={() => setIsChatOpen(!isChatOpen)}
            animate={{
              y: petActionState === 'speaking' ? [0, -4, 0] : [0, -8, 0],
              scale: petActionState === 'speaking' ? 1.08 : petActionState === 'delighted' ? 1.15 : 1.0,
              rotate: petActionState === 'inspecting' ? -12 : petActionState === 'flying' ? 8 : 0,
            }}
            transition={{
              y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
              scale: { duration: 0.35 },
              rotate: { duration: 0.4 },
            }}
            aria-label="Orchéllia Orchid Pet"
            className="relative cursor-pointer focus:outline-none group mb-2"
          >
            {/* Ambient Botanical Glow Behind Pet (Orchid Violet #BB9AEF) */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-500 ${
                petActionState === 'delighted'
                  ? 'bg-[#BB9AEF]/40 blur-xl scale-125'
                  : petActionState === 'speaking'
                  ? 'bg-[#BB9AEF]/30 blur-lg scale-115'
                  : 'bg-[#BB9AEF]/15 blur-lg group-hover:bg-[#BB9AEF]/30'
              }`}
            />

            {/* Looping Orchid Character Video masked into living floating avatar (Animated Body) */}
            <div
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex items-center justify-center transition-all transform-gpu will-change-transform pointer-events-none"
              style={{
                maskImage: 'radial-gradient(circle at center, black 65%, transparent 95%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 65%, transparent 95%)',
              }}
            >
              <video
                ref={petVideoRef}
                src="/videos/orchellia-opening.mp4"
                poster="/brand/orchellia-transparent.png"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover mix-blend-screen pointer-events-none scale-125"
              />
            </div>
          </motion.button>

          {/* 🏷️ Authentic ChatGPT Companion Dock Pill (Matching User Palette) */}
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#221D63]/95 border border-[#BB9AEF]/30 shadow-2xl backdrop-blur-xl hover:border-[#BB9AEF]/50 transition-all">
            {/* Text Mode / Compose Prompt Button */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                isChatOpen
                  ? 'text-[#BB9AEF] bg-white/10'
                  : 'text-white/70 hover:text-white'
              }`}
              title="Open Chat / Prompt (Text Mode)"
              aria-label="Open Chat / Prompt"
            >
              <SquarePen className="w-4 h-4" />
            </button>

            {/* Subtle Vertical Divider */}
            <div className="h-4 w-px bg-white/15" />

            {/* Voice Mode / Live Waveform Button */}
            <button
              onClick={toggleSpeechRecognition}
              className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${
                isListening
                  ? 'text-red-400 bg-red-500/20'
                  : isVoicePlaying
                  ? 'text-[#BB9AEF]'
                  : 'text-white/70 hover:text-white'
              }`}
              title={
                isListening
                  ? 'Listening... click to send'
                  : isVoicePlaying
                  ? 'Orchéllia Speaking'
                  : 'Voice Mode (Live Conversation)'
              }
              aria-label="Voice Mode"
            >
              {/* Authentic ChatGPT Equalizer Waveform Bars (Orchid Purple #BB9AEF) */}
              <div className="flex items-center space-x-[2.5px] h-4 px-0.5">
                <span
                  className={`w-[2.5px] rounded-full transition-all duration-300 ${
                    isListening || isVoicePlaying
                      ? 'bg-[#BB9AEF] animate-pulse h-3'
                      : 'bg-current h-2'
                  }`}
                />
                <span
                  className={`w-[2.5px] rounded-full transition-all duration-300 ${
                    isListening || isVoicePlaying
                      ? 'bg-[#BB9AEF] animate-bounce h-4'
                      : 'bg-current h-4'
                  }`}
                />
                <span
                  className={`w-[2.5px] rounded-full transition-all duration-300 ${
                    isListening || isVoicePlaying
                      ? 'bg-[#BB9AEF] animate-pulse h-3.5'
                      : 'bg-current h-3'
                  }`}
                />
                <span
                  className={`w-[2.5px] rounded-full transition-all duration-300 ${
                    isListening || isVoicePlaying
                      ? 'bg-[#BB9AEF] animate-ping h-2.5'
                      : 'bg-current h-1.5'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Draping Guide Modal */}
      <StylingGuideModal isOpen={showStylingModal} onClose={() => setShowStylingModal(false)} />
    </>
  );
}
