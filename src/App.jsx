import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BootScreen from './components/BootScreen';
import DialUpScreen from './components/DialUpScreen';
import InternetIdentity from './components/InternetIdentity';
import Desktop from './components/Desktop';
import useLocalStorage from './hooks/useLocalStorage';

// The full experience flow, matching the spec exactly:
// Windows XP Boot -> Dial-up -> Create Identity -> Desktop
const STAGES = {
  BOOT: 'boot',
  DIALUP: 'dialup',
  IDENTITY: 'identity',
  DESKTOP: 'desktop',
};

export default function App() {
  const [identity, setIdentity] = useLocalStorage('retroverse_identity', null);
  // Returning users with a saved identity skip straight past identity
  // creation (but still get the nostalgic boot/dial-up sequence).
  const [stage, setStage] = useState(STAGES.BOOT);

  const handleBootComplete = () => setStage(STAGES.DIALUP);

  const handleDialUpComplete = () => {
    setStage(identity ? STAGES.DESKTOP : STAGES.IDENTITY);
  };

  const handleIdentityCreated = (newIdentity) => {
    setIdentity(newIdentity);
    setStage(STAGES.DESKTOP);
  };

  return (
    <AnimatePresence mode="wait">
      {stage === STAGES.BOOT && (
        <motion.div key="boot" exit={{ opacity: 0 }}>
          <BootScreen onComplete={handleBootComplete} />
        </motion.div>
      )}
      {stage === STAGES.DIALUP && (
        <motion.div key="dialup" exit={{ opacity: 0 }}>
          <DialUpScreen onComplete={handleDialUpComplete} />
        </motion.div>
      )}
      {stage === STAGES.IDENTITY && (
        <motion.div key="identity" exit={{ opacity: 0 }}>
          <InternetIdentity onCreate={handleIdentityCreated} />
        </motion.div>
      )}
      {stage === STAGES.DESKTOP && (
        <motion.div key="desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Desktop identity={identity} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
