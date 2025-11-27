import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactFormData, FormStatus } from '../../types';
import { Check, Loader2, ArrowRight, ArrowLeft, CornerDownLeft, MessageCircle, AlertCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    situation: '',
    source: '',
    sourceDetail: ''
  });
  const [status, setStatus] = useState<FormStatus>(FormStatus.IDLE);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // References for auto-focus, timers, and data
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);
  const nextStepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formDataRef = useRef(formData);

  // Update ref whenever state changes
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    // Focus input on step change after animation delay
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
        
        // Ensure the input is visible (especially on mobile)
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (nextStepTimerRef.current) clearTimeout(nextStepTimerRef.current);
    };
  }, []);

  // Steps Logic
  const getSteps = (data: ContactFormData) => {
    const baseSteps = [
      { 
        id: 'intro',
        label: "Let's Talk",
        description: "I work with a limited number of clients. Tell me a bit about your situation to see if we're a fit.",
        type: 'intro',
        buttonText: "Start Conversation"
      },
      { 
        id: 'name', 
        label: "Let's start with your name", 
        type: 'text', 
        placeholder: 'Jane Doe', 
        required: true 
      },
      { 
        id: 'email', 
        label: "What is your email address?", 
        type: 'email', 
        placeholder: 'jane@example.com', 
        required: true 
      },
      { 
        id: 'company', 
        label: "What is your company or brand name?", 
        subLabel: "Optional",
        type: 'text', 
        placeholder: 'Brand Co.', 
        required: false 
      },
      { 
        id: 'situation', 
        label: "Tell me about your situation", 
        subLabel: "Please be as specific as possible about the account health issues you are facing.",
        type: 'textarea', 
        placeholder: 'I am facing an IP complaint...', 
        required: true 
      },
      { 
        id: 'source', 
        label: "How did you find me?", 
        type: 'select', 
        options: ['LinkedIn', 'Referral', 'Search', 'Other'], 
        required: true 
      }
    ];

    const needsDetail = data.source === 'Referral' || data.source === 'Other';
    
    if (needsDetail) {
      baseSteps.push({
        id: 'sourceDetail',
        label: data.source === 'Referral' ? "Who referred you?" : "Please elaborate",
        type: 'text',
        placeholder: data.source === 'Referral' ? "Name of referrer" : "Details...",
        required: true
      });
    }

    return baseSteps;
  };

  const steps = getSteps(formData);
  const currentStepData = steps[currentStep];
  
  // GUARD: Prevent crash if index out of bounds during rapid transitions
  if (!currentStepData) return null;

  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep) / (steps.length - 1)) * 100;

  const validateStep = (data: ContactFormData) => {
    setError(null);
    const step = getSteps(data)[currentStep]; // Get step definition based on current data
    const value = data[step.id as keyof ContactFormData];
    
    // Skip validation for intro
    if (step.type === 'intro') return true;

    if (step.required && !value) {
      setError('This field is required');
      return false;
    }

    if (step.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value as string)) {
        setError('Please enter a valid email address');
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    if (isNavigating) return; // Prevent double clicks
    
    // Use REF to get latest data, as state might be stale in closures
    const currentData = formDataRef.current;
    
    if (!validateStep(currentData)) return;

    // Recalculate steps based on latest data to determine if this is truly the last step
    const currentSteps = getSteps(currentData);
    const actuallyLastStep = currentStep === currentSteps.length - 1;

    if (actuallyLastStep) {
      setIsNavigating(true);
      await handleSubmit();
      setIsNavigating(false);
    } else {
      setIsNavigating(true);
      setDirection(1);
      setCurrentStep(prev => prev + 1);
      // Unlock after transition
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  const handleBack = () => {
    if (currentStep === 0 || isNavigating) return;
    setIsNavigating(true);
    setDirection(-1);
    setCurrentStep(prev => prev - 1);
    setError(null);
    setTimeout(() => setIsNavigating(false), 500);
  };

  const handleSubmit = async () => {
    setStatus(FormStatus.SUBMITTING);

    try {
      const response = await fetch('https://formspree.io/f/movolpwq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formDataRef.current.name,
          email: formDataRef.current.email,
          company: formDataRef.current.company || 'Not provided',
          situation: formDataRef.current.situation,
          source: formDataRef.current.source,
          sourceDetail: formDataRef.current.sourceDetail || 'N/A'
        })
      });

      if (response.ok) {
        setStatus(FormStatus.SUCCESS);
      } else {
        setStatus(FormStatus.ERROR);
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setStatus(FormStatus.ERROR);
      setError('Network error. Please check your connection and try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentStepData.type === 'textarea' && !e.shiftKey) {
        return; // Allow new lines in textarea
      }
      e.preventDefault();
      handleNext();
    }
  };

  const handleChange = (val: string) => {
    setFormData(prev => ({ ...prev, [currentStepData.id]: val }));
    if (error) setError(null);
  };

  const handleOptionSelect = (option: string) => {
    if (isNavigating) return;
    
    handleChange(option);
    
    // Clear any pending timer
    if (nextStepTimerRef.current) clearTimeout(nextStepTimerRef.current);
    
    // Debounce navigation to prevent race conditions
    nextStepTimerRef.current = setTimeout(() => {
      handleNext();
    }, 350);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  // Success View
  if (status === FormStatus.SUCCESS) {
    return (
      <section id="contact" className="py-12 md:py-32 bg-brand-dark min-h-[600px] flex items-center justify-center border-t border-brand-charcoal">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="container max-w-lg mx-auto px-6 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-brand-gold" />
          </div>
          <h3 className="text-3xl md:text-4xl font-serif text-brand-cream mb-6">Message Sent</h3>
          <p className="text-brand-muted text-lg leading-relaxed mb-8">
            Thank you for reaching out, {formData.name.split(' ')[0]}. I will review your situation and respond as soon as possible.
          </p>
        </motion.div>
      </section>
    );
  }

  // Error View
  if (status === FormStatus.ERROR) {
    return (
      <section id="contact" className="py-12 md:py-32 bg-brand-dark min-h-[600px] flex items-center justify-center border-t border-brand-charcoal">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="container max-w-lg mx-auto px-6 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-8">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-3xl md:text-4xl font-serif text-brand-cream mb-6">Something Went Wrong</h3>
          <p className="text-brand-muted text-lg leading-relaxed mb-8">
            {error || 'We couldn\'t send your message. Please try again.'}
          </p>
          <button
            onClick={() => {
              setStatus(FormStatus.IDLE);
              setError(null);
            }}
            className="bg-brand-gold text-brand-black px-8 py-4 text-sm uppercase tracking-widest font-semibold hover:bg-white transition-colors duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    // Use flex-col without justify-center to prevent top-clipping on small screens when content is tall
    <section id="contact" className="py-12 md:py-32 bg-brand-dark min-h-[600px] md:min-h-[700px] flex flex-col border-t border-brand-charcoal relative overflow-hidden">
      
      {/* Progress Bar (hidden on intro) */}
      {currentStep > 0 && (
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-charcoal z-20">
          <motion.div 
            className="h-full bg-brand-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Container uses my-auto to center vertically if space permits, but flow normally if not */}
      <div className="container max-w-2xl mx-auto px-6 relative my-auto z-10">
        
        {/* Step Counter (hidden on intro) */}
        {currentStep > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 md:mb-8 text-brand-gold/50 text-xs uppercase tracking-widest font-medium flex justify-between items-center"
          >
            <span>Step {currentStep} / {steps.length - 1}</span>
            
            {/* Mobile Back Button Inline */}
            <button
              onClick={handleBack}
              disabled={isNavigating}
              className="md:hidden flex items-center gap-1 text-brand-muted hover:text-brand-gold transition-colors p-2"
              aria-label="Previous step"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </motion.div>
        )}

        <div className="min-h-[300px] flex flex-col justify-center">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="w-full"
            >
              {/* INTRO STEP */}
              {currentStepData.type === 'intro' ? (
                <div className="text-center md:text-left pt-8 md:pt-0">
                  <h2 className="text-4xl md:text-6xl font-serif text-brand-cream mb-6 leading-tight">
                    {currentStepData.label}
                  </h2>
                  <p className="text-xl text-brand-muted font-light leading-relaxed mb-12 max-w-xl">
                    {currentStepData.description}
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleNext}
                      disabled={isNavigating}
                      className="bg-brand-gold text-brand-black px-8 py-4 text-sm uppercase tracking-widest font-semibold hover:bg-white transition-colors duration-300 flex items-center justify-center gap-3 w-full md:w-auto group"
                    >
                      {currentStepData.buttonText}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <a
                      href="https://wa.me/19142409454"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-brand-gold text-brand-gold px-8 py-4 text-sm uppercase tracking-widest font-semibold hover:bg-brand-gold/10 transition-colors duration-300 flex items-center justify-center gap-3 w-full md:w-auto"
                    >
                      Reach out through WhatsApp
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                /* FORM INPUT STEPS */
                <div className="space-y-6">
                  <div>
                    <label 
                      htmlFor={currentStepData.id} 
                      className="block text-2xl md:text-4xl font-serif text-brand-cream mb-3"
                    >
                      {currentStepData.label} 
                      {!currentStepData.required && <span className="text-brand-muted text-lg md:text-2xl font-sans italic ml-2 opacity-50">(Optional)</span>}
                    </label>
                    {currentStepData.subLabel && (
                      <p className="text-brand-muted text-sm md:text-base mb-2">{currentStepData.subLabel}</p>
                    )}
                  </div>

                  <div className="relative">
                    {currentStepData.type === 'textarea' ? (
                      <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={formData[currentStepData.id as keyof ContactFormData] || ''}
                        onChange={(e) => handleChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={currentStepData.placeholder}
                        rows={4}
                        className="w-full bg-transparent border-b-2 border-brand-charcoal text-brand-cream py-4 text-xl focus:outline-none focus:border-brand-gold transition-colors placeholder-brand-charcoal/50 resize-none leading-normal"
                      />
                    ) : currentStepData.type === 'select' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {(currentStepData.options || []).map((option) => (
                          <button
                            key={option}
                            onClick={() => handleOptionSelect(option)}
                            disabled={isNavigating}
                            className={`p-4 md:p-6 text-left border transition-all duration-300 ${
                              formData[currentStepData.id as keyof ContactFormData] === option
                                ? 'border-brand-gold bg-brand-gold/10 text-brand-cream'
                                : 'border-brand-charcoal text-brand-muted hover:border-brand-gold/50 hover:text-brand-cream'
                            } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span className="text-lg">{option}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type={currentStepData.type}
                        value={formData[currentStepData.id as keyof ContactFormData] || ''}
                        onChange={(e) => handleChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={currentStepData.placeholder}
                        className="w-full bg-transparent border-b-2 border-brand-charcoal text-brand-cream py-4 text-xl md:text-3xl focus:outline-none focus:border-brand-gold transition-colors placeholder-brand-charcoal/50"
                      />
                    )}
                    
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-8 left-0 text-red-400 text-sm flex items-center gap-1"
                      >
                        <span className="block w-1 h-1 rounded-full bg-red-400" />
                        {error}
                      </motion.div>
                    )}
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center gap-4 pt-8">
                    <button
                      onClick={handleNext}
                      disabled={status === FormStatus.SUBMITTING || isNavigating}
                      className="bg-brand-gold text-brand-black px-8 py-3 md:py-4 text-sm uppercase tracking-widest font-semibold hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {status === FormStatus.SUBMITTING ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          {isLastStep ? 'Submit' : 'Next'}
                          {!isLastStep && <ArrowRight className="w-4 h-4" />}
                        </>
                      )}
                    </button>
                    
                    {/* Enter Key Hint - Desktop Only */}
                    {currentStepData.type !== 'select' && (
                      <div className="hidden md:flex items-center gap-2 text-brand-muted/40 text-xs uppercase tracking-widest pointer-events-none">
                        <span>Press</span>
                        <div className="flex items-center gap-1 border border-brand-muted/20 rounded px-1.5 py-0.5">
                          <CornerDownLeft className="w-3 h-3" />
                          <span className="font-sans font-bold">Enter</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop Back Button (Hidden on Mobile, moved to header) */}
        {currentStep > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleBack}
            disabled={isNavigating}
            className="hidden md:block absolute -left-12 top-1/2 -translate-y-1/2 p-2 text-brand-muted hover:text-brand-gold transition-colors disabled:opacity-30"
            aria-label="Previous step"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
        )}
      </div>
    </section>
  );
};

export default Contact;