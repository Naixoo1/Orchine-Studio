'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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

// Speech Recognition interface for browsers
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function OrchelliaSeed() {
  const [isBloomed, setIsBloomed] = useState(false);
  const [showStylingModal, setShowStylingModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Conversational & Voice State
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Welcome back to the atelier, my friend. The morning steam has just lifted from the cedar vats. Select any words on the page or speak with me directly—I am here to guide your gaze.',
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Push-to-Talk Mic State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Contextual Selection Blossom Pill State
  const [selectionPill, setSelectionPill] = useState<SelectionPillState | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Zustand Store Selectors & Actions
  const activeScarf = useStudioStore((state) => state.activeScarf);
  const activeScarfId = useStudioStore((state) => state.activeScarfId);
  const selectScarf = useStudioStore((state) => state.selectScarf);
  const set3DView = useStudioStore((state) => state.set3DView);
  const setHeroMode = useStudioStore((state) => state.setHeroMode);
  const highlightUI = useStudioStore((state) => state.highlightUI);

  // Auto-scroll chat stream
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isChatLoading]);

  // Clean up audio and speech recognition on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
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
      // Only trigger on meaningful phrases (3 to 90 chars)
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
          // Range access error fallback
        }
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Do not clear pill if clicking inside the pill itself
      if (target.closest('.orchellia-selection-pill') || target.closest('.orchellia-panel')) {
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

  // Execute Tool Calls returned from Orchéllia
  const executeToolCalls = useCallback((toolCalls: ToolCall[]) => {
    for (const tool of toolCalls) {
      switch (tool.name) {
        case 'select_scarf': {
          const scarfId = tool.arguments.scarfId as 'solstice' | 'fern-whisper' | 'indigo-flora' | 'iron-oak';
          if (scarfId) {
            selectScarf(scarfId);
            setHeroMode('canvas');
          }
          break;
        }
        case 'set_3d_view': {
          const preset = tool.arguments.preset as 'front' | 'drape_detail' | 'full_spin' | 'top_down';
          if (preset) {
            set3DView(preset);
            setHeroMode('canvas');
          }
          break;
        }
        case 'focus_section': {
          const sectionId = tool.arguments.sectionId as string;
          if (sectionId) {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
          break;
        }
        case 'highlight_ui': {
          const targetId = tool.arguments.targetId as string;
          const explanation = (tool.arguments.explanation as string) || null;
          if (targetId) {
            highlightUI(targetId, explanation);
          }
          break;
        }
        case 'open_bag': {
          useStudioStore.getState().openBag();
          break;
        }
        case 'open_styling_guide': {
          setShowStylingModal(true);
          break;
        }
        default:
          break;
      }
    }
  }, [selectScarf, setHeroMode, set3DView, highlightUI]);

  // Play Sol Voice via /api/orchellia/voice
  const handlePlayVoice = useCallback(async (textToSpeak: string) => {
    if (isVoicePlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsVoicePlaying(false);
      }
      return;
    }

    try {
      setIsVoiceLoading(true);
      setVoiceNotice(null);

      const res = await fetch('/api/orchellia/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (errorData.error === 'OPENAI_API_KEY_REQUIRED') {
          setVoiceNotice('Atelier Preview Mode: Add OPENAI_API_KEY to .env.local to hear live Sol voice.');
        } else {
          setVoiceNotice(errorData.error || 'Voice synthesis paused.');
        }
        setIsVoiceLoading(false);
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
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsVoicePlaying(false);
        setIsVoiceLoading(false);
      };

      await audio.play();
      setIsVoicePlaying(true);
      setIsVoiceLoading(false);
    } catch (err) {
      console.warn('Voice playback error:', err);
      setIsVoiceLoading(false);
      setIsVoicePlaying(false);
    }
  }, [isVoicePlaying]);

  // Send message to Orchéllia Chat API with optional auto-speak in Sol Voice
  const handleSendMessage = useCallback(async (text: string, autoSpeak = false) => {
    const trimmed = text.trim();
    if (!trimmed || isChatLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);
    setInputText('');
    setIsChatLoading(true);
    setVoiceNotice(null);

    try {
      const res = await fetch('/api/orchellia/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const replyMessage = data.message || 'I am here with you in the atelier.';
      setMessages((prev) => [...prev, { role: 'assistant', content: replyMessage }]);

      // Execute tool calls if any
      if (data.toolCalls && Array.isArray(data.toolCalls)) {
        executeToolCalls(data.toolCalls);
      }

      // Automatically speak in Sol Voice if requested (e.g. from Mic or Selection Pill)
      if (autoSpeak) {
        handlePlayVoice(replyMessage);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'The steam in the atelier is thick right now. Solstice rests on the table before you—shall we look at its golden leaves?',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  }, [messages, isChatLoading, executeToolCalls, handlePlayVoice]);

  // Handle clicking the contextual text selection pill
  const handleSelectPillClick = () => {
    if (!selectionPill) return;
    const selectedPhrase = selectionPill.text;

    // Clear selection from screen
    window.getSelection()?.removeAllRanges();
    setSelectionPill(null);

    // Open Orchéllia's panel directly
    setIsBloomed(true);

    // Immediately ask Orchéllia and auto-speak her Sol voice response
    handleSendMessage(`What can you tell me about "${selectedPhrase}"?`, true);
  };

  // Push-to-Talk Speech Recognition
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice('Listening... speak now.');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setInputText(transcript);
          // Auto-send and auto-speak Orchéllia's reply
          handleSendMessage(transcript, true);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        setIsListening(false);
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
    }
  };

  const handleBloomClick = () => {
    setIsBloomed(true);
  };

  const handleClose = () => {
    setIsBloomed(false);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsVoicePlaying(false);
    }
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Dynamic Context-Aware Suggestions based on current active scarf & studio state
  const getDynamicContextSuggestions = () => {
    switch (activeScarfId) {
      case 'solstice':
        return [
          {
            label: 'Why sun-cured eucalyptus?',
            action: () => handleSendMessage('Why do you use sun-cured eucalyptus leaves in Solstice?', true),
          },
          {
            label: 'Inspect golden 3D drape',
            action: () => {
              set3DView('drape_detail');
              setHeroMode('canvas');
              handleSendMessage('Show me the 3D drape detail and light sheen of Solstice.', true);
            },
          },
          {
            label: 'How is golden amber achieved?',
            action: () => handleSendMessage('What botanical dyes create the golden amber hue of Solstice?', true),
          },
          {
            label: 'Add Solstice to Bag',
            action: () => {
              useStudioStore.getState().addToBag('solstice', 1);
              handleSendMessage('I have placed Solstice in your atelier bag.', true);
            },
          },
        ];
      case 'fern-whisper':
        return [
          {
            label: 'Why sword fern silhouettes?',
            action: () => handleSendMessage('Tell me about the Pacific sword ferns in Fern Whisper.', true),
          },
          {
            label: 'Explain the iron tannin mordant',
            action: () => handleSendMessage('What role does the mineral iron water play in Fern Whisper?', true),
          },
          {
            label: 'Inspect 3D ghost fronds',
            action: () => {
              set3DView('drape_detail');
              setHeroMode('canvas');
              handleSendMessage('Zoom into the ghost fronds on the Fern Whisper silk.', true);
            },
          },
          {
            label: 'How to drape with tailoring',
            action: () => {
              setShowStylingModal(true);
              handleSendMessage('Demonstrate how to drape Fern Whisper with tailored pieces.', true);
            },
          },
        ];
      case 'indigo-flora':
        return [
          {
            label: 'The 9-month cold fermented vat',
            action: () => handleSendMessage('Explain how your 9-month earthenware indigo vat works.', true),
          },
          {
            label: 'Why persistent lapis lazuli?',
            action: () => handleSendMessage('Why is living fermented indigo so much richer than synthetic dye?', true),
          },
          {
            label: 'Explore Craft Lab vats',
            action: () => {
              const el = document.getElementById('craft');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              handleSendMessage('Guide me into the Craft Lab to observe the living indigo vats.', true);
            },
          },
          {
            label: 'Inspect 2.5× Macro Loupe',
            action: () => {
              const el = document.getElementById('craft');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              highlightUI('craft', '2.5× Macro Loupe showing Japanese indigo fiber saturation.');
            },
          },
        ];
      case 'iron-oak':
        return [
          {
            label: 'What causes the violet charcoal hue?',
            action: () => handleSendMessage('What chemical reaction creates the smoky charcoal and violet in Iron Oak?', true),
          },
          {
            label: 'Oak gall tannin chemistry',
            action: () => handleSendMessage('Why are foraged oak galls so important to your iron prints?', true),
          },
          {
            label: 'View Parisian Bias knot',
            action: () => {
              setShowStylingModal(true);
              handleSendMessage('How should I style the Iron Oak scarf using the Parisian Bias Knot?', true);
            },
          },
          {
            label: 'Add Iron Oak to Bag',
            action: () => {
              useStudioStore.getState().addToBag('iron-oak', 1);
              handleSendMessage('I have prepared Iron Oak for your collection.', true);
            },
          },
        ];
      default:
        return [
          {
            label: 'Where should I wander?',
            action: () => handleSendMessage('Where do you recommend I begin in the atelier?', true),
          },
          {
            label: 'Tell me about the scarves',
            action: () => handleSendMessage('Tell me about the 4 launch botanical scarves.', true),
          },
        ];
    }
  };

  return (
    <>
      {/* 🌿 Floating Contextual Selection Blossom Pill */}
      {selectionPill && !isBloomed && (
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
            className="flex items-center space-x-2 px-3.5 py-2 rounded-full glass-panel border border-botanical-marigold bg-[#141210]/95 text-brand-ecru shadow-2xl hover:bg-botanical-marigold hover:text-brand-noir transition-all duration-300 group cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-botanical-marigold group-hover:bg-brand-noir animate-ping" />
            <Leaf className="w-3.5 h-3.5 text-botanical-marigold group-hover:text-brand-noir transition-colors" />
            <span className="font-serif text-xs tracking-wider">
              Ask Orchéllia about &ldquo;
              <span className="font-semibold italic max-w-[140px] truncate inline-block align-bottom">
                {selectionPill.text}
              </span>
              &rdquo;
            </span>
          </button>
        </div>
      )}

      {/* Organic Botanical Seed Anchor & Living Companion Panel (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {/* Living Atelier Companion Panel */}
        {isBloomed && (
          <div className="orchellia-panel mb-4 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[82vh] glass-panel p-5 sm:p-6 rounded-3xl border border-botanical-marigold/40 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-6 duration-300 relative flex flex-col overflow-hidden backdrop-blur-2xl">
            {/* Ambient Leaf Glow Gradient */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-botanical-marigold/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header: Living Character Presence & Active Context */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 flex-shrink-0">
              <div className="flex items-center space-x-2.5">
                {/* Living Botanical Seed Micro Core */}
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-botanical-marigold opacity-60" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-br from-botanical-marigold to-[#8E5A23]" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-serif text-sm uppercase tracking-luxury text-brand-ecru leading-none">
                      Orchéllia
                    </h4>
                    {/* Real-time Dynamic Active Context Badge */}
                    <span className="text-[9px] font-mono tracking-widest text-botanical-marigold glass-pill px-1.5 py-0.5 rounded-full uppercase flex items-center space-x-1">
                      <span className="w-1 h-1 rounded-full bg-botanical-marigold" />
                      <span>{activeScarf.name}</span>
                    </span>
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-brand-sand/60 uppercase block mt-0.5">
                    Living Atelier Companion • Sol Voice
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Audio Status Waveform Indicator */}
                {isVoicePlaying && (
                  <div className="flex items-center space-x-0.5 h-3 px-2 py-0.5 rounded-full bg-botanical-marigold/10 border border-botanical-marigold/30">
                    <span className="w-0.5 h-full bg-botanical-marigold animate-pulse" />
                    <span className="w-0.5 h-2/3 bg-botanical-marigold animate-ping" />
                    <span className="w-0.5 h-full bg-botanical-marigold animate-pulse" />
                  </div>
                )}

                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full text-brand-sand/60 hover:text-brand-ecru hover:bg-white/5 transition-colors"
                  aria-label="Close Orchéllia Companion"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Conversation Stream */}
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto space-y-3.5 pr-1 mb-3 scrollbar-thin scrollbar-thumb-white/10 text-xs"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  } animate-in fade-in duration-200`}
                >
                  <div
                    className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-botanical-marigold/15 border border-botanical-marigold/30 text-brand-ecru rounded-br-none'
                        : 'glass-panel border border-white/10 text-brand-sand/90 font-serif italic rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Voice Listen Button for Assistant Messages */}
                  {msg.role === 'assistant' && (
                    <div className="mt-1 flex items-center space-x-2 px-1">
                      <button
                        onClick={() => handlePlayVoice(msg.content)}
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
                <div className="flex items-center space-x-2 text-xs text-brand-sand/50 italic py-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-botanical-marigold" />
                  <span>Orchéllia is listening and gathering botanical memories...</span>
                </div>
              )}
            </div>

            {/* Voice Notice / Setup Pill if needed */}
            {voiceNotice && (
              <div className="mb-2 text-[10px] text-botanical-marigold/90 bg-botanical-marigold/10 border border-botanical-marigold/30 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
                <span>{voiceNotice}</span>
                <button onClick={() => setVoiceNotice(null)} className="ml-2 hover:opacity-100 opacity-60">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Context-Aware Dynamic Suggestions (Adapts to Active Scarf / Section) */}
            <div className="space-y-1.5 mb-3 flex-shrink-0">
              <span className="text-[9px] font-mono uppercase tracking-widest text-brand-sand/50 block">
                Contextual Questions for {activeScarf.name}
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {getDynamicContextSuggestions().map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={suggestion.action}
                    disabled={isChatLoading}
                    className="text-left p-2 rounded-xl glass-pill hover:bg-white/10 transition-all flex items-center justify-between group border border-white/5 hover:border-botanical-marigold/40"
                  >
                    <span className="font-serif text-[11px] text-brand-ecru group-hover:text-botanical-marigold transition-colors line-clamp-1">
                      {suggestion.label}
                    </span>
                    <ArrowRight className="w-3 h-3 text-botanical-marigold opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Voice (Mic) & Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="relative flex items-center space-x-2 flex-shrink-0"
            >
              {/* Push-to-Talk Microphone Button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                aria-label={isListening ? 'Stop listening' : 'Speak to Orchéllia'}
                className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center relative ${
                  isListening
                    ? 'bg-red-500/80 text-white shadow-lg shadow-red-500/50 animate-pulse'
                    : 'glass-panel border border-white/15 text-botanical-marigold hover:border-botanical-marigold/70 hover:scale-105'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Speak to Orchéllia (Push-to-Talk)'}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping" />
                  </>
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              {/* Text Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isListening
                      ? 'Listening to your voice...'
                      : 'Ask Orchéllia, speak via mic, or highlight text...'
                  }
                  className="w-full glass-panel border border-white/15 focus:border-botanical-marigold/70 rounded-full py-2.5 pl-4 pr-10 text-xs text-brand-ecru placeholder:text-brand-sand/40 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isChatLoading}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-botanical-marigold text-brand-noir disabled:opacity-40 hover:scale-105 active:scale-95 transition-all"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 🌿 The Interactive Botanical Seed Pod (Concealed button with organic bloom effect) */}
        <button
          onClick={handleBloomClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Awaken Orchéllia Botanical Seed"
          className="relative group p-1 rounded-full cursor-pointer transition-transform duration-500 hover:scale-105 focus:outline-none"
        >
          {/* Outer Breathing Aura Ring */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-700 pointer-events-none ${
              isHovered
                ? 'scale-150 bg-radial-gradient from-botanical-marigold/30 via-botanical-marigold/10 to-transparent blur-md'
                : 'scale-110 bg-radial-gradient from-botanical-marigold/15 to-transparent blur-sm animate-pulse'
            }`}
          />

          {/* Unfolding Petals / Spores Ring (Bloom Animation on Hover) */}
          <div
            className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
              isHovered
                ? 'bg-gradient-to-br from-[#D49B42]/40 via-[#1A1612] to-[#0E0D0C] border-2 border-botanical-marigold shadow-2xl shadow-botanical-marigold/40'
                : 'bg-brand-charcoal/90 border border-white/20 shadow-xl'
            }`}
          >
            {/* Organic Concentric Growth Rings */}
            <div className="absolute inset-1.5 rounded-full border border-dashed border-white/20 animate-spin-slow pointer-events-none opacity-40" />
            <div className="absolute inset-3 rounded-full border border-botanical-marigold/30 pointer-events-none" />

            {/* Living Core Seed Embryo */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <span className="w-4 h-5 rounded-full bg-gradient-to-b from-botanical-marigold to-[#8E5A23] shadow-sm transform rotate-12 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-0" />
            </div>

            {/* Subtle Bloom Tooltip Pill */}
            <span
              className={`absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap glass-panel px-3 py-1 rounded-full text-[10px] font-serif uppercase tracking-luxury text-brand-ecru border border-white/10 transition-all duration-300 pointer-events-none ${
                isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
              }`}
            >
              Awaken Orchéllia
            </span>
          </div>
        </button>
      </div>

      {/* Draping Guide Modal */}
      <StylingGuideModal isOpen={showStylingModal} onClose={() => setShowStylingModal(false)} />
    </>
  );
}
