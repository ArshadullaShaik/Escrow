import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Deployer from '../components/Deployer';
import EscrowInteraction from '../components/EscrowInteraction';
import SpotlightGrid from '../components/SpotlightGrid';
import GlitchText from '../components/GlitchText';
import TiltCard from '../components/TiltCard';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'deploy' | 'interact' | 'home'>('home');
  const [contractAddress, setContractAddress] = useState<`0x${string}` | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden bg-[#09090bSelection]">
      <Head>
        <title>Escrow Protocol | Trustless.</title>
        <meta name="description" content="Next-Gen Crypto Escrow Service" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Cyberpunk Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-black" />
      <SpotlightGrid />
      <div className="scanline" />

      {/* Navbar */}
      <header className="w-full max-w-7xl flex justify-between items-center py-6 px-6 z-10">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-8 h-8 flex items-center justify-center font-bold text-primary border border-primary/50 group-hover:bg-primary group-hover:text-black transition-all duration-300 clip-path-polygon">E</div>
          <h1 className="text-xl font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
            Escrow<span className="text-primary">.io</span>
          </h1>
        </div>
        <ConnectButton
          chainStatus="icon"
          showBalance={false}
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl flex flex-col items-center mt-12 px-4 z-10 pb-20">

        <AnimatePresence mode='wait'>
          {activeTab === 'home' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 bg-primary/5 text-sm text-primary mb-8 animate-pulse font-mono tracking-widest uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 bg-primary"></span>
                </span>
                System Online
              </div>

              <div className="mb-6">
                <GlitchText
                  text="TRUSTLESS PAYMENTS"
                  as="h1"
                  className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] text-white block mb-2"
                />
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-500">MADE SIMPLE.</h1>
              </div>

              <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed font-mono">
                Secure transactions via smart contract arbitration.
                De-risk your digital exchanges.
              </p>

              <div className="flex gap-4">
                <TiltCard>
                  <button
                    onClick={() => setActiveTab('deploy')}
                    className="btn-tech text-lg px-8 py-4 shadow-[0_0_30px_rgba(255,0,0,0.4)] hover:shadow-[0_0_50px_rgba(255,0,0,0.6)]"
                  >
                    INITIATE ESCROW
                  </button>
                </TiltCard>

                <TiltCard>
                  <button
                    onClick={() => setActiveTab('interact')}
                    className="btn-tech-outline px-8 py-4 bg-black/50 backdrop-blur-sm"
                  >
                    MANAGE EXISTING
                  </button>
                </TiltCard>
              </div>
            </motion.div>
          )}

          {activeTab !== 'home' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center"
            >
              {/* Tech Tab Switcher */}
              <div className="flex bg-black/50 border border-white/10 mb-10 relative clip-path-polygon backdrop-blur-sm">
                {['deploy', 'interact'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`relative px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 z-10 font-mono ${activeTab === tab
                      ? 'text-black'
                      : 'text-gray-500 hover:text-white'
                      }`}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    {tab === 'deploy' ? 'Create New' : 'Interact'}
                  </button>
                ))}
              </div>

              {activeTab === 'deploy' && (
                <Deployer key="deploy" onDeployed={(hash) => {
                  setActiveTab('interact');
                }} />
              )}

              {activeTab === 'interact' && (
                <div className="w-full flex flex-col items-center">
                  {!contractAddress ? (
                    <TiltCard className="w-full max-w-md">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="tech-panel p-10 w-full"
                      >
                        <h3 className="text-2xl font-bold mb-2 text-center text-white uppercase tracking-wider">Access Escrow</h3>
                        <p className="text-center text-gray-500 mb-8 text-xs font-mono uppercase">Enter contract address</p>

                        <input
                          type="text"
                          placeholder="0x..."
                          className="input-tech mb-6"
                          onChange={(e) => {
                            if (e.target.value.length === 42) {
                              setContractAddress(e.target.value as `0x${string}`);
                            }
                          }}
                        />
                        <div className="flex flex-col gap-2 mt-4 opacity-50 hover:opacity-100 transition-opacity">
                          <p className="text-[10px] text-center text-gray-600 uppercase tracking-widest font-mono">Recent Contracts</p>
                        </div>
                      </motion.div>
                    </TiltCard>
                  ) : (
                    <div className="w-full flex flex-col items-center">
                      <button
                        onClick={() => setContractAddress(null)}
                        className="mb-6 flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-primary transition-colors uppercase tracking-widest"
                      >
                        Load Different Contract
                      </button>
                      <EscrowInteraction contractAddress={contractAddress} />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
