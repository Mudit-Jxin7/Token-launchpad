import Launchpad from "./Launchpad"
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

const App = () => {
  const wallets = [new PhantomWalletAdapter()];

  return (
    <div style={styles.appContainer}>
      <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <header style={styles.header}>
              <h1 style={styles.title}>🚀 Token Launchpad</h1>
              <div style={styles.walletButtons}>
                <WalletMultiButton style={styles.walletBtn} />
                <WalletDisconnectButton style={styles.walletBtn} />
              </div>
            </header>
            <main style={styles.main}>
              <Launchpad />
            </main>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
};

const styles = {
  appContainer: {
    minHeight: '100vh',
    padding: 0,
    margin: 0
  },
  header: {
    backgroundColor: '#212529',
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    paddingRight: '1rem'
  },
  walletButtons: {
    display: 'flex',
    gap: '1rem'
  },
  walletBtn: {
    backgroundColor: '#0d6efd',
    color: '#fff',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    border: 'none',
    cursor: 'pointer'
  },
  main: {
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
};

export default App;
