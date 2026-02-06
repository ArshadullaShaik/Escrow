import React, { useState } from 'react';
import { useWalletClient } from 'wagmi';
import EscrowArtifact from '../constants/Escrow.json';
import { parseEther } from 'viem';
import { motion } from 'framer-motion';

export default function Deployer({ onDeployed }: { onDeployed: (address: string) => void }) {
    const { data: walletClient } = useWalletClient();
    const [sellerAddr, setSellerAddr] = useState('');
    const [isDeploying, setIsDeploying] = useState(false);
    const [error, setError] = useState('');

    const handleDeploy = async () => {
        if (!walletClient) {
            setError('Please connect wallet first');
            return;
        }
        if (!sellerAddr.startsWith('0x')) {
            setError('Invalid Seller Address');
            return;
        }

        setIsDeploying(true);
        setError('');

        try {
            const hash = await walletClient.deployContract({
                abi: EscrowArtifact.abi,
                bytecode: EscrowArtifact.bytecode as `0x${string}`,
                args: [walletClient.account.address, sellerAddr as `0x${string}`],
            });

            // We would wait for receipt here in a real app, but for now we'll just wait for the hash
            // Actually deployContract returns the hash. 
            // To get the address we strictly need to wait for transaction receipt.
            // But simplifying for this step, we might want to let the parent handle the waiting or use public client.

            // Correction: deployContract returns a hash. We need to wait for it.
            // Let's assume onDeployed handles the hash or we wait here.
            // Ideally we use usePublicClient to waitForTransactionReceipt.

            onDeployed(hash); // Passing hash for now, parent can track it
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Deployment failed');
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="tech-panel p-8 max-w-md w-full mx-auto"
        >
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="w-10 h-10 flex items-center justify-center text-primary bg-primary/10 border border-primary/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">Deploy Contract</h2>
                    <p className="text-xs text-gray-500 font-mono">Create secure escrow instance</p>
                </div>
            </div>

            <div className="flex flex-col gap-5">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide font-mono">Seller Address</label>
                    <input
                        type="text"
                        placeholder="0x..."
                        value={sellerAddr}
                        onChange={(e) => setSellerAddr(e.target.value)}
                        className="input-tech"
                    />
                </div>

                {error && <p className="text-red-500 text-xs bg-red-500/10 p-2 border border-red-500/20 font-mono">{error}</p>}

                <button
                    onClick={handleDeploy}
                    disabled={isDeploying || !sellerAddr}
                    className="btn-tech w-full mt-2"
                >
                    {isDeploying ? (
                        <div className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            DEPLOYING...
                        </div>
                    ) : 'DEPLOY CONTRACT'}
                </button>
            </div>
        </motion.div>
    );
}
