import React, { useEffect, useState } from 'react';
import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt, usePublicClient, useWatchContractEvent } from 'wagmi';
import EscrowArtifact from '../constants/Escrow.json';
import { formatEther, parseEther } from 'viem';
import { motion, AnimatePresence } from 'framer-motion';

const STATE_STEPS = [
    { label: 'Awaiting Payment', value: 0 },
    { label: 'Processing', value: 1 },
    { label: 'Shipped', value: 2 },
    { label: 'Complete', value: 3 },
    { label: 'Refunded', value: 4 } // Handling Cancel/Refund state
];

type LogEvent = {
    name: string;
    message: string;
    timestamp: number;
    hash?: string;
};

export default function EscrowInteraction({ contractAddress }: { contractAddress: `0x${string}` }) {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();

    // Local State
    const [amount, setAmount] = useState('0.001');
    const [events, setEvents] = useState<LogEvent[]>([]);

    // Watch for transaction receipt to auto-refresh
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    const { data, refetch } = useReadContracts({
        contracts: [
            { address: contractAddress, abi: EscrowArtifact.abi, functionName: 'State' },
            { address: contractAddress, abi: EscrowArtifact.abi, functionName: 'buyer' },
            { address: contractAddress, abi: EscrowArtifact.abi, functionName: 'payee' },
            { address: contractAddress, abi: EscrowArtifact.abi, functionName: 'balance' },
        ],
    });

    useEffect(() => {
        if (isConfirmed) refetch();
    }, [isConfirmed, refetch]);

    // Load History & Watch Events
    useEffect(() => {
        if (!publicClient || !contractAddress) return;

        const fetchLogs = async () => {
            try {
                // Fetching logs logic could go here using publicClient.getContractEvents
                // For this demo, we'll start fresh or rely on live events to avoid complex parsing without indexed events
                // Just ensuring we watch for new ones
            } catch (e) { console.error("Log fetch error", e); }
        };
        fetchLogs();
    }, [publicClient, contractAddress]);

    // Event Listeners (Live Feed)
    useWatchContractEvent({
        address: contractAddress as `0x${string}`,
        abi: EscrowArtifact.abi,
        eventName: 'paymentdone',
        onLogs(logs) {
            addEvent('Payment Deposited', 'Buyer has deposited funds.');
            refetch();
        },
    });
    useWatchContractEvent({
        address: contractAddress as `0x${string}`,
        abi: EscrowArtifact.abi,
        eventName: 'prodctsent',
        onLogs(logs) {
            addEvent('Product Shipped', 'Seller has shipped the item.');
            refetch();
        },
    });
    useWatchContractEvent({
        address: contractAddress as `0x${string}`,
        abi: EscrowArtifact.abi,
        eventName: 'prodctreceived',
        onLogs(logs) {
            addEvent('Funds Released', 'Buyer confirmed receipt. Funds released.');
            refetch();
        },
    });
    useWatchContractEvent({
        address: contractAddress as `0x${string}`,
        abi: EscrowArtifact.abi,
        eventName: 'refnd',
        onLogs(logs) {
            addEvent('Refund Issued', 'Funds refunded to Buyer.');
            refetch();
        },
    });

    const addEvent = (name: string, message: string) => {
        setEvents(prev => [{ name, message, timestamp: Date.now() }, ...prev]);
    };

    if (!data || data.some(result => result.status === 'failure')) {
        return (
            <div className="flex flex-col items-center justify-center p-10 space-y-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Syncing Chain Data...</p>
            </div>
        );
    }

    const [stateResult, buyerResult, payeeResult, balanceResult] = data;
    const currentState = stateResult.result as number;
    const buyerAddr = buyerResult.result as string;
    const payeeAddr = payeeResult.result as string;
    const contractBalance = balanceResult.result as bigint;

    const isBuyer = address === buyerAddr;
    const isSeller = address === payeeAddr;

    // determine active step index (handling refund state mapping to end or special)
    const activeStep = currentState === 4 ? 4 : currentState;

    // Actions
    const handleDeposit = () => {
        writeContract({
            address: contractAddress,
            abi: EscrowArtifact.abi,
            functionName: 'payndconfirm',
            value: parseEther(amount),
        });
    };

    const handleAction = (fnName: string) => {
        writeContract({
            address: contractAddress,
            abi: EscrowArtifact.abi,
            functionName: fnName,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl mx-auto space-y-6"
        >
            {/* Top Dashboard: Balance & Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Balance Card - The "Large Bold Text" */}
                <div className="tech-panel p-8 flex flex-col justify-center items-center md:items-start relative overflow-hidden group">
                    <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-gradient-to-b from-primary/20 to-transparent blur-3xl rounded-full pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity duration-1000" />
                    <p className="z-10 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 font-mono">Escrow Balance</p>
                    <div className="z-10 flex items-baseline gap-2">
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-lg">
                            {formatEther(contractBalance)}
                        </h1>
                        <span className="text-xl font-bold text-primary font-mono">ETH</span>
                    </div>
                </div>

                {/* Role & Info Card */}
                <div className="tech-panel p-6 col-span-1 md:col-span-2 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1 uppercase">Contract Details</h2>
                            <p className="text-xs font-mono text-gray-400 break-all">{contractAddress}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Your Role</span>
                            {isBuyer && <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide shadow-[0_0_10px_rgba(59,130,246,0.2)]">Buyer</span>}
                            {isSeller && <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide shadow-[0_0_10px_rgba(168,85,247,0.2)]">Payee / Seller</span>}
                            {!isBuyer && !isSeller && <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Observer</span>}
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="relative mt-2">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 rounded-full" />
                        <div
                            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-secondary to-primary -translate-y-1/2 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min((activeStep / 3) * 100, 100)}%` }}
                        />
                        <div className="flex justify-between relative z-10 w-full">
                            {STATE_STEPS.slice(0, 4).map((step, idx) => {
                                const isActive = idx === activeStep;
                                const isCompleted = idx < activeStep;
                                return (
                                    <div key={idx} className="flex flex-col items-center gap-2">
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2
                                            ${isActive ? 'bg-black border-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] scale-110' :
                                                isCompleted ? 'bg-primary border-primary text-black' :
                                                    'bg-black/50 border-white/10 text-gray-600'}
                                        `}>
                                            {isCompleted ? '✓' : idx + 1}
                                        </div>
                                        <span className={`hidden md:block text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Action Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Actions Panel */}
                <div className="tech-panel p-8 flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 -z-10" />

                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-4 w-full">Available Actions</h3>

                    {/* Pending / Error State Feedback */}
                    <AnimatePresence>
                        {isConfirming && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="w-full bg-blue-500/10 border border-blue-500/20 p-3 rounded text-sm text-blue-400 flex items-center justify-center gap-2">
                                <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                                Processing Transaction...
                            </motion.div>
                        )}
                        {writeError && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="w-full bg-red-500/10 border border-red-500/20 p-3 rounded text-sm text-red-400 break-words">
                                {writeError.message.split('\n')[0].slice(0, 60)}...
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* BUYER ACTIONS */}
                    {isBuyer && (
                        <>
                            {currentState === 0 && (
                                <div className="w-full space-y-4">
                                    <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-1">
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={e => setAmount(e.target.value)}
                                            className="bg-transparent border-none text-white p-3 w-full focus:outline-none font-mono text-sm"
                                            placeholder="Amount ETH"
                                        />
                                        <span className="text-gray-500 font-mono text-xs px-3">ETH</span>
                                    </div>
                                    <button onClick={handleDeposit} disabled={isWritePending} className="btn-tech w-full">
                                        Deposit Funds
                                    </button>
                                </div>
                            )}

                            {activeStep === 2 && (
                                <button onClick={() => handleAction('productreceived')} disabled={isWritePending} className="btn-tech w-full">
                                    Release Funds
                                </button>
                            )}

                            {/* Refund logic: valid in state 1 (Waiting for ship) or 2 (Wait for receipt) */}
                            {(activeStep === 1 || activeStep === 2) && (
                                <div className="w-full pt-4 border-t border-white/5 mt-4">
                                    <button onClick={() => handleAction('refund')} disabled={isWritePending} className="btn-tech-outline w-full text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500">
                                        Request Refund
                                    </button>
                                    <p className="text-[10px] text-gray-600 mt-2 uppercase">Emergency Only • Reverts funds to you</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* SELLER ACTIONS */}
                    {isSeller && (
                        <>
                            {currentState === 1 && (
                                <button onClick={() => handleAction('productsent')} disabled={isWritePending} className="btn-tech w-full">
                                    Mark as Shipped
                                </button>
                            )}

                            {currentState === 3 && (
                                <button onClick={() => handleAction('getpayment')} disabled={isWritePending} className="btn-tech w-full">
                                    Withdraw Funds
                                </button>
                            )}
                        </>
                    )}

                    {/* Idle States */}
                    {!isBuyer && !isSeller && <p className="text-gray-500 text-sm">Connect as Buyer or Seller to interact.</p>}
                    {isBuyer && currentState === 1 && <p className="text-gray-500 text-sm animate-pulse">Waiting for Seller to ship...</p>}
                    {isSeller && currentState === 0 && <p className="text-gray-500 text-sm animate-pulse">Waiting for Buyer to deposit...</p>}
                    {isSeller && currentState === 2 && <p className="text-gray-500 text-sm animate-pulse">Waiting for Buyer confirmation...</p>}
                    {currentState === 4 && <p className="text-red-400 font-bold uppercase tracking-widest text-lg">Contract Refunded</p>}
                    {isSeller && currentState === 3 && contractBalance === BigInt(0) && <p className="text-green-500 font-bold uppercase tracking-widest">Funds Withdrawn</p>}

                </div>

                {/* Activity Feed */}
                <div className="tech-panel p-0 flex flex-col h-[350px]">
                    <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Activity Feed</h3>
                        <span className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> LIVE
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {events.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                                <span className="text-2xl mb-2">📡</span>
                                <p className="text-xs uppercase tracking-wider">No recent events</p>
                            </div>
                        ) : (
                            events.map((evt, i) => (
                                <motion.div
                                    key={evt.timestamp + i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-3 rounded bg-white/5 border border-white/5 flex gap-3"
                                >
                                    <div className="mt-1 w-2 h-2 rounded-full bg-secondary shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-200">{evt.name}</p>
                                        <p className="text-xs text-gray-500">{evt.message}</p>
                                        <p className="text-[10px] text-gray-600 font-mono mt-1">{new Date(evt.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
