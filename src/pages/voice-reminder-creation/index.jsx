import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import VoiceRecordingButton from './components/VoiceRecordingButton';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import ManualInputForm from './components/ManualInputForm';
import FormatGuidance from './components/FormatGuidance';
import ProcessingStatus from './components/ProcessingStatus';

const VoiceReminderCreation = () => {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Transcription States
  const [transcription, setTranscription] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [transcriptionError, setTranscriptionError] = useState('');

  // Manual Form States
  const [manualFormData, setManualFormData] = useState({
    task: '',
    date: '',
    time: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Processing States
  const [processingStatus, setProcessingStatus] = useState(null);
  const [processingMessage, setProcessingMessage] = useState('');
  const [calendarUrl, setCalendarUrl] = useState('');
  const [processingError, setProcessingError] = useState('');

  // UI States
  const [showManualForm, setShowManualForm] = useState(false);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Enhanced configuration for better Turkish recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'tr-TR';
      recognitionRef.current.maxAlternatives = 3;
      
      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        setTranscriptionError('');
        console.log('Speech recognition started');
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event?.resultIndex || 0; i < (event?.results?.length || 0); i++) {
          const result = event?.results?.[i];
          if (result?.isFinal) {
            finalTranscript += result?.[0]?.transcript || '';
          } else {
            interimTranscript += result?.[0]?.transcript || '';
          }
        }

        // Show interim results for better user feedback
        const fullTranscript = finalTranscript || interimTranscript;
        if (fullTranscript?.trim()) {
          setTranscription(fullTranscript);
          
          // Only parse if we have final results
          if (finalTranscript?.trim()) {
            parseVoiceCommand(finalTranscript);
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event?.error);
        let errorMessage = 'Ses tanıma hatası oluştu';
        
        switch (event?.error) {
          case 'no-speech':
            errorMessage = 'Ses algılanamadı. Lütfen daha yüksek sesle konuşun';
            break;
          case 'audio-capture':
            errorMessage = 'Mikrofona erişilemiyor. Lütfen mikrofon bağlantınızı kontrol edin';
            break;
          case 'not-allowed':
            errorMessage = 'Mikrofon izni reddedildi. Lütfen tarayıcı ayarlarından mikrofon iznini açın';
            break;
          case 'network':
            errorMessage = 'İnternet bağlantısı sorunu. Bağlantınızı kontrol edin';
            break;
          case 'service-not-allowed':
            errorMessage = 'Ses tanıma servisi kullanılamıyor';
            break;
          default:
            errorMessage = `Ses tanıma hatası: ${event?.error}`;
        }
        
        setTranscriptionError(errorMessage);
        setIsRecording(false);
        setIsProcessing(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setAudioLevel(0);
        console.log('Speech recognition ended');
      };

      // Check microphone permission with better error handling
      checkMicrophonePermission();
    } else {
      setTranscriptionError('Bu tarayıcı ses tanıma özelliğini desteklemiyor. Chrome veya Edge kullanmayı deneyin');
    }

    return () => {
      if (animationFrameRef?.current) {
        cancelAnimationFrame(animationFrameRef?.current);
      }
      if (audioContextRef?.current && audioContextRef?.current?.state !== 'closed') {
        audioContextRef?.current?.close();
      }
      if (recognitionRef?.current) {
        recognitionRef?.current?.abort();
      }
    };
  }, []);

  // Enhanced microphone permission check
  const checkMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices?.getUserMedia({ audio: true });
      setHasPermission(true);
    } catch (error) {
      console.error('Microphone permission error:', error);
      setHasPermission(false);
      if (error?.name === 'NotAllowedError') {
        setTranscriptionError('Mikrofon izni reddedildi. Lütfen tarayıcı ayarlarından mikrofon iznini açın');
      } else if (error?.name === 'NotFoundError') {
        setTranscriptionError('Mikrofon bulunamadı. Lütfen mikrofon bağlantınızı kontrol edin');
      }
    }
  };

  // Parse voice command to extract task, date, and time
  const parseVoiceCommand = (text) => {
    setIsProcessing(true);
    
    // Simulate processing delay but provide immediate feedback
    setTimeout(() => {
      try {
        const parsed = extractReminderData(text);
        setParsedData(parsed);
        setIsProcessing(false);
        setTranscriptionError(''); // Clear any previous errors
      } catch (error) {
        console.error('Command parsing error:', error);
        setTranscriptionError(`Komut çözümlenemedi: ${error?.message}. Lütfen şu formatta konuşun: "Beni toplantı için yarın saat 14:30'da hatırlat"`);
        setIsProcessing(false);
      }
    }, 1000); // Reduced delay for better UX
  };

  // Enhanced data extraction with more flexible patterns
  const extractReminderData = (text) => {
    const lowerText = text?.toLowerCase()?.trim();
    
    if (!lowerText) {
      throw new Error('Boş metin algılandı');
    }

    console.log('Parsing text:', lowerText);
    
    // More flexible task extraction patterns
    let task = '';
    const taskPatterns = [
      // "beni X için hatırlat" pattern
      /beni\s+(.*?)\s+(?:için|diye)\s+(?:yarın|bugün|pazartesi|salı|çarşamba|perşembe|cuma|cumartesi|pazar|saat)/i,
      // "beni X hatırlat" pattern  
      /beni\s+(.*?)\s+(?:yarın|bugün|pazartesi|salı|çarşamba|perşembe|cuma|cumartesi|pazar|saat)/i,
      // "X için hatırlat" pattern
      /(.*?)\s+(?:için|diye)\s+hatırlat/i,
      // Direct task mention
      /(?:hatırlat|hatırlatıcı).*?(.*?)(?:\s+(?:yarın|bugün|pazartesi|salı|çarşamba|perşembe|cuma|cumartesi|pazar|\d+))/i
    ];
    
    for (const pattern of taskPatterns) {
      const match = lowerText?.match(pattern);
      if (match?.[1]?.trim()) {
        task = match?.[1]?.trim();
        break;
      }
    }

    // Enhanced date extraction with more patterns
    let date = '';
    const datePatterns = [
      { pattern: /yarın/, value: 'yarın' },
      { pattern: /bugün/, value: 'bugün' },
      { pattern: /pazartesi/, value: 'pazartesi' },
      { pattern: /salı/, value: 'salı' },
      { pattern: /çarşamba/, value: 'çarşamba' },
      { pattern: /perşembe/, value: 'perşembe' },
      { pattern: /cuma/, value: 'cuma' },
      { pattern: /cumartesi/, value: 'cumartesi' },
      { pattern: /pazar/, value: 'pazar' },
      { pattern: /(\d{1,2})\s+(ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)/, value: 'match' },
      { pattern: /(\d{1,2})\/(\d{1,2})\/(\d{4})/, value: 'match' },
      { pattern: /(\d{1,2})\.(\d{1,2})\.(\d{4})/, value: 'match' }
    ];
    
    for (const { pattern, value } of datePatterns) {
      const match = lowerText?.match(pattern);
      if (match) {
        date = value === 'match' ? match?.[0] : value;
        break;
      }
    }

    // Enhanced time extraction with more flexible patterns including decimal notation
    let time = '';
    const timePatterns = [
      // Decimal notation: "22.25", "14.30", etc.
      /(?:saat\s*)?(\d{1,2})\.(\d{2})(?:\s*(?:'te|'ta|'de|'da|de|da))/,
      // "saat 14:30" or "saat 14 30"
      /saat\s*(\d{1,2})[:\s]*(\d{2})(?:\s*(?:'te|'ta|'de|'da|de|da))/,
      // "14:30'da" or "14:30 da"
      /(\d{1,2}):(\d{2})(?:\s*(?:'te|'ta|'de|'da|de|da))/,
      // "14'te" or "saat 14" - only hours
      /(?:saat\s*)?(\d{1,2})(?:\s*(?:'te|'ta|'de|'da|de|da))/,
      // More natural language
      /(?:saat\s*)?(\d{1,2})\s*buçuk/, // "2 buçuk" for 2:30
    ];
    
    for (const pattern of timePatterns) {
      const match = lowerText?.match(pattern);
      if (match) {
        const hours = match?.[1];
        let minutes = match?.[2] || '00';
        
        // Handle "buçuk" (half past)
        if (lowerText?.includes('buçuk')) {
          minutes = '30';
        }
        
        // Ensure two digits for minutes
        if (minutes?.length === 1) {
          minutes = '0' + minutes;
        }
        
        // Validate hours and minutes
        const hoursNum = parseInt(hours);
        const minutesNum = parseInt(minutes);
        
        if (hoursNum >= 0 && hoursNum <= 23 && minutesNum >= 0 && minutesNum <= 59) {
          time = `${hours?.padStart(2, '0')}:${minutes}`;
          break;
        }
      }
    }

    // Validation with more helpful error messages
    const missingFields = [];
    if (!task) missingFields?.push('görev');
    if (!date) missingFields?.push('tarih');
    if (!time) missingFields?.push('saat');

    if (missingFields?.length > 0) {
      throw new Error(`Şu bilgiler eksik: ${missingFields.join(', ')}. Örnek: "Beni toplantı için yarın saat 14:30'da hatırlat" veya "22.25'te toplantı"`);
    }

    console.log('Parsed data:', { task, date, time });
    return { task, date, time };
  };

  // Enhanced recording start with better error handling
  const startRecording = async () => {
    try {
      // First check if browser supports speech recognition
      if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        setTranscriptionError('Bu tarayıcı ses tanıma özelliğini desteklemiyor. Chrome veya Edge kullanmayı deneyin');
        return;
      }

      if (!hasPermission) {
        try {
          await navigator.mediaDevices?.getUserMedia({ audio: true });
          setHasPermission(true);
        } catch (error) {
          console.error('Permission request failed:', error);
          if (error?.name === 'NotAllowedError') {
            setTranscriptionError('Mikrofon izni reddedildi. Lütfen tarayıcı ayarlarından mikrofon iznini açın');
          } else if (error?.name === 'NotFoundError') {
            setTranscriptionError('Mikrofon bulunamadı. Lütfen mikrofon bağlantınızı kontrol edin');
          } else {
            setTranscriptionError('Mikrofon erişimi sağlanamadı: ' + error?.message);
          }
          return;
        }
      }

      // Setup audio level monitoring with better error handling
      try {
        const stream = await navigator.mediaDevices?.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef?.current?.createAnalyser();
        const source = audioContextRef?.current?.createMediaStreamSource(stream);
        source?.connect(analyserRef?.current);
        
        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef?.current?.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateAudioLevel = () => {
          analyserRef?.current?.getByteFrequencyData(dataArray);
          const average = dataArray?.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(Math.min(100, average * 2)); // Amplify sensitivity
          
          if (isRecording) {
            animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
          }
        };

        updateAudioLevel();
        
      } catch (audioError) {
        console.warn('Audio level monitoring failed:', audioError);
        // Continue without audio level monitoring
      }
      
      // Clear previous results
      setTranscription('');
      setParsedData(null);
      setTranscriptionError('');
      setProcessingError('');
      
      // Start recognition with retry logic
      try {
        recognitionRef?.current?.start();
      } catch (startError) {
        console.error('Recognition start failed:', startError);
        setTimeout(() => {
          try {
            recognitionRef?.current?.start();
          } catch (retryError) {
            setTranscriptionError('Ses tanıma başlatılamadı. Lütfen sayfayı yenileyin ve tekrar deneyin');
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Recording start failed:', error);
      setTranscriptionError('Ses kaydı başlatılamadı: ' + error?.message);
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (recognitionRef?.current) {
      recognitionRef?.current?.stop();
    }
    if (animationFrameRef?.current) {
      cancelAnimationFrame(animationFrameRef?.current);
    }
    if (audioContextRef?.current) {
      audioContextRef?.current?.close();
    }
    setIsRecording(false);
    setAudioLevel(0);
  };

  // Validate manual form
  const validateForm = (data) => {
    const errors = {};
    
    if (!data?.task?.trim()) {
      errors.task = 'Görev açıklaması gerekli';
    }
    
    if (!data?.date) {
      errors.date = 'Tarih seçimi gerekli';
    } else {
      const selectedDate = new Date(data.date);
      const today = new Date();
      today?.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = 'Geçmiş tarih seçilemez';
      }
    }
    
    if (!data?.time) {
      errors.time = 'Saat seçimi gerekli';
    }
    
    return errors;
  };

  // Submit manual form
  const handleManualSubmit = async (formData) => {
    const errors = validateForm(formData);
    setFormErrors(errors);
    
    if (Object.keys(errors)?.length > 0) {
      return;
    }

    setIsSubmittingForm(true);
    setProcessingStatus('processing');
    setProcessingMessage('Hatırlatıcı oluşturuluyor...');

    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const calendarUrl = generateCalendarUrl(formData);
      
      setProcessingStatus('success');
      setProcessingMessage('Hatırlatıcınız başarıyla oluşturuldu!');
      setCalendarUrl(calendarUrl);
      
      // Schedule browser notification
      scheduleNotification(formData);
      
    } catch (error) {
      setProcessingStatus('error');
      setProcessingMessage('Hatırlatıcı oluşturulurken hata oluştu');
      setProcessingError(error?.message);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Submit voice data
  const handleVoiceSubmit = async () => {
    if (!parsedData) return;

    setProcessingStatus('processing');
    setProcessingMessage('Google Takvim bağlantısı oluşturuluyor...');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const calendarUrl = generateCalendarUrl(parsedData);
      
      setProcessingStatus('success');
      setProcessingMessage('Hatırlatıcınız başarıyla oluşturuldu!');
      setCalendarUrl(calendarUrl);
      
      // Schedule browser notification
      scheduleNotification(parsedData);
      
    } catch (error) {
      setProcessingStatus('error');
      setProcessingMessage('Hatırlatıcı oluşturulurken hata oluştu');
      setProcessingError(error?.message);
    }
  };

  // Generate Google Calendar URL with proper timezone handling
  const generateCalendarUrl = (data) => {
    const { task, date, time, notes } = data;
    
    // Convert date and time to proper format
    let eventDate = new Date();
    
    if (date === 'yarın') {
      eventDate?.setDate(eventDate?.getDate() + 1);
    } else if (date === 'bugün') {
      // Keep current date
    } else if (['pazartesi', 'salı', 'çarşamba', 'perşembe', 'cuma', 'cumartesi', 'pazar']?.includes(date?.toLowerCase())) {
      // Calculate next occurrence of the specified day
      const dayNames = ['pazar', 'pazartesi', 'salı', 'çarşamba', 'perşembe', 'cuma', 'cumartesi'];
      const targetDay = dayNames?.indexOf(date?.toLowerCase());
      const currentDay = eventDate?.getDay();
      let daysToAdd = targetDay - currentDay;
      
      if (daysToAdd <= 0) {
        daysToAdd += 7; // Next week if the day has passed
      }
      
      eventDate?.setDate(eventDate?.getDate() + daysToAdd);
    } else {
      // Parse other date formats
      eventDate = new Date(date);
    }
    
    // Parse time and create proper date object
    const [hours, minutes] = time?.split(':');
    
    // Create the event date and time in the user's local timezone
    const localEventTime = new Date(
      eventDate?.getFullYear(),
      eventDate?.getMonth(), 
      eventDate?.getDate(),
      parseInt(hours),
      parseInt(minutes),
      0,
      0
    );
    
    // Create end time (1 hour later)
    const endTime = new Date(localEventTime?.getTime() + (60 * 60 * 1000));
    
    // Format dates for Google Calendar (this will automatically handle timezone conversion)
    const formatDateForCalendar = (date) => {
      return date?.toISOString()?.replace(/[-:]/g, '')?.split('.')?.[0] + 'Z';
    };
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: task,
      dates: `${formatDateForCalendar(localEventTime)}/${formatDateForCalendar(endTime)}`,
      details: notes || `VoiceTracker ile oluşturuldu - ${new Date().toLocaleString('tr-TR')}`,
      ctz: 'Europe/Istanbul' // This ensures Google Calendar interprets the time correctly
    });
    
    return `https://calendar.google.com/calendar/render?${params?.toString()}`;
  };

  // Schedule browser notification
  const scheduleNotification = (data) => {
    if ('Notification' in window) {
      Notification.requestPermission()?.then(permission => {
        if (permission === 'granted') {
          // In a real app, you would schedule this properly
          console.log('Notification scheduled for:', data);
        }
      });
    }
  };

  // Reset all states
  const resetStates = () => {
    setTranscription('');
    setParsedData(null);
    setTranscriptionError('');
    setManualFormData({ task: '', date: '', time: '', notes: '' });
    setFormErrors({});
    setProcessingStatus(null);
    setProcessingMessage('');
    setCalendarUrl('');
    setProcessingError('');
    setShowManualForm(false);
  };

  // Navigation handlers
  const handleCreateAnother = () => {
    resetStates();
  };

  const handleGoHome = () => {
    navigate('/home-dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isVoiceRecording={isRecording} />
      
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Sesli Hatırlatıcı Oluştur
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sesli komutlarla veya manuel girişle Google Takvim hatırlatıcıları oluşturun
            </p>
          </div>

          {/* Processing Status */}
          {processingStatus && (
            <ProcessingStatus
              status={processingStatus}
              message={processingMessage}
              calendarUrl={calendarUrl}
              onCreateAnother={handleCreateAnother}
              onGoHome={handleGoHome}
              error={processingError}
            />
          )}

          {/* Main Content - Only show if not processing success */}
          {processingStatus !== 'success' && (
            <>
              {/* Voice Recording Section */}
              <div className="text-center">
                <VoiceRecordingButton
                  isRecording={isRecording}
                  isProcessing={isProcessing}
                  audioLevel={audioLevel}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                  hasPermission={hasPermission}
                />
              </div>

              {/* Transcription Display */}
              <TranscriptionDisplay
                transcription={transcription}
                parsedData={parsedData}
                isProcessing={isProcessing}
                error={transcriptionError}
              />

              {/* Voice Submit Button */}
              {parsedData && !transcriptionError && (
                <div className="text-center">
                  <button
                    onClick={handleVoiceSubmit}
                    className="px-8 py-3 bg-success text-success-foreground rounded-lg font-semibold hover:bg-success/90 transition-colors shadow-lg"
                  >
                    Hatırlatıcı Oluştur
                  </button>
                </div>
              )}

              {/* Manual Form Toggle */}
              <div className="text-center">
                <button
                  onClick={() => setShowManualForm(!showManualForm)}
                  className="text-primary hover:text-primary/80 text-sm font-medium underline"
                >
                  {showManualForm ? 'Manuel girişi gizle' : 'Manuel giriş kullan'}
                </button>
              </div>

              {/* Manual Input Form */}
              {showManualForm && (
                <ManualInputForm
                  formData={manualFormData}
                  onFormChange={setManualFormData}
                  onSubmit={handleManualSubmit}
                  isSubmitting={isSubmittingForm}
                  errors={formErrors}
                />
              )}

              {/* Format Guidance */}
              <FormatGuidance />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default VoiceReminderCreation;